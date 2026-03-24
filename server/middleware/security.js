/**
 * 安全加固中间件
 * helmet 安全头 + 限流 + CORS 收窄 + 参数校验工具
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

/**
 * Helmet 安全头配置
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // API服务不需要CSP
  crossOriginEmbedderPolicy: false,
});

/**
 * CORS 收窄配置
 * 只允许前端开发服务器和生产域名
 */
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 预检缓存24h
};
const corsMiddleware = cors(corsOptions);

/**
 * 全局限流：每个IP每15分钟最多300次请求
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 429, message: '请求过于频繁，请稍后再试' },
  },
});

/**
 * 登录接口限流：每个IP每15分钟最多10次
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: { code: 429, message: '登录尝试过于频繁，请15分钟后再试' },
  },
});

/**
 * 算法接口限流：计算密集型，每个IP每分钟最多30次
 */
const algorithmLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: { code: 429, message: '算法接口调用过于频繁，请稍后再试' },
  },
});

module.exports = {
  helmetMiddleware,
  corsMiddleware,
  corsOptions,
  globalLimiter,
  loginLimiter,
  algorithmLimiter,
};
