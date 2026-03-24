/**
 * 安全感知平台后端服务 - 主入口
 *
 * 集成：Express + WebSocket + JWT + Swagger + 算法引擎
 */

const http = require('http');
const express = require('express');

// 中间件
const { helmetMiddleware, corsMiddleware, globalLimiter, loginLimiter, algorithmLimiter } = require('./middleware/security');
const { requestLogger } = require('./middleware/logger');
const { authMiddleware } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { cacheMiddleware, globalCache } = require('./middleware/cache');

// Swagger
const { setupSwagger } = require('./swagger');

// WebSocket
const { pushService } = require('./websocket');

const app = express();
const PORT = process.env.PORT || 8080;

// ============ 中间件链（顺序重要） ============

// 1. 安全头
app.use(helmetMiddleware);

// 2. CORS
app.use(corsMiddleware);

// 3. 全局限流
app.use(globalLimiter);

// 4. 请求日志
app.use(requestLogger);

// 5. Body 解析
app.use(express.json({ limit: '10mb' }));

// 6. 健康检查（不需要认证）
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'running',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: '3.0.92',
      memoryMB: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  });
});

// 7. Swagger 文档（不需要认证）
setupSwagger(app);

// 8. JWT 认证
app.use(authMiddleware);

// ============ 路由挂载 ============

// 认证（login 加独立限流）
const authRouter = require('./routes/auth');
app.use('/api/auth', loginLimiter, authRouter);

// 业务路由
app.use('/api/monitor', require('./routes/monitor'));
app.use('/api/disposal', require('./routes/disposal'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/warning', require('./routes/warning'));
app.use('/api/protection', require('./routes/protection'));
app.use('/api/system', require('./routes/system'));
app.use('/api/global', require('./routes/global'));
app.use('/api/messages', require('./routes/messages'));

// 流量监控（30秒缓存）
app.use('/api/traffic', cacheMiddleware(30000), require('./routes/traffic'));

// 安全溯源（15秒缓存）
app.use('/api/security', cacheMiddleware(15000), require('./routes/security'));

// 算法引擎（独立限流 + 30秒缓存）
app.use('/api/algorithms', algorithmLimiter, cacheMiddleware(30000), require('./routes/algorithms'));

// WebSocket 状态接口
app.get('/ws/status', (req, res) => {
  res.json({ success: true, data: pushService.getStatus() });
});

// 缓存状态接口
app.get('/api/cache/stats', (req, res) => {
  res.json({ success: true, data: globalCache.stats() });
});

// ============ 错误处理（必须在最后） ============

app.use(notFoundHandler);
app.use(errorHandler);

// ============ 启动服务器 ============

const server = http.createServer(app);

// 初始化 WebSocket
pushService.init(server);

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║     安全感知平台后端 V3.0.92 已启动      ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log(`  ║  HTTP API:  http://localhost:${PORT}          ║`);
  console.log(`  ║  WebSocket: ws://localhost:${PORT}/ws          ║`);
  console.log(`  ║  API 文档:  http://localhost:${PORT}/api-docs  ║`);
  console.log(`  ║  健康检查:  http://localhost:${PORT}/health    ║`);
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});

// ============ 优雅关闭 ============

function gracefulShutdown(signal) {
  console.log(`\n[${signal}] 正在关闭服务器...`);
  pushService.close();
  globalCache.flush();
  server.close(() => {
    console.log('服务器已安全关闭');
    process.exit(0);
  });
  // 5秒后强制退出
  setTimeout(() => { process.exit(1); }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
