/**
 * Swagger/OpenAPI 配置
 * 自动生成可交互的 API 文档
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '安全感知平台 API',
    version: '3.0.92',
    description: `校园网安全感知平台后端 API 服务

## 功能模块
- **流量监控** - 10Gbps+链路秒级采样、Bytes/Packets双维度、15种协议识别
- **安全溯源** - 5类威胁检测（扫描/钓鱼/蠕虫/DDoS/暴力破解）
- **算法引擎** - 异常检测、流量预测、风险评分、攻击链关联、DPI、IP画像
- **实时推送** - WebSocket秒级流量推送与安全告警

## 认证方式
除登录接口外，所有接口需要在请求头携带 JWT Token：
\`Authorization: Bearer <token>\`

## WebSocket
连接地址：\`ws://localhost:8080/ws\`
频道：traffic（流量）、security（告警）、system（系统状态）`,
    contact: { name: 'Security Platform Team' },
  },
  servers: [
    { url: 'http://localhost:8080', description: '开发服务器' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'integer' },
              message: { type: 'string' },
            },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          pageSize: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: '认证', description: '登录/登出/用户信息' },
    { name: '流量监控', description: '实时流量、吞吐量、协议分布、热点业务' },
    { name: '安全溯源', description: '威胁检测、安全日志、威胁统计' },
    { name: '算法引擎', description: '异常检测、流量预测、风险评分、攻击链、DPI、IP画像' },
    { name: '监控中心', description: '仪表盘概览、告警、事件' },
    { name: '处置中心', description: '风险资产、威胁处置、策略管理' },
    { name: '分析中心', description: '日志检索、行为分析、关联分析' },
    { name: '资产中心', description: '资产管理、基线配置、资产发现' },
    { name: '报告中心', description: '报告管理、导出、订阅' },
    { name: '通报预警', description: '预警接收、告警中心' },
    { name: '重保中心', description: '攻击者分析、封堵管理' },
    { name: '系统', description: '系统设置、消息、全局数据' },
    { name: 'WebSocket', description: '实时推送服务状态' },
  ],
  paths: {
    // ===== 认证 =====
    '/api/auth/login': {
      post: {
        tags: ['认证'], summary: '用户登录', security: [],
        requestBody: { content: { 'application/json': { schema: {
          type: 'object',
          properties: { username: { type: 'string', example: 'admin' }, password: { type: 'string', example: 'admin123' } },
        }}}},
        responses: { 200: { description: '登录成功，返回JWT Token' } },
      },
    },
    '/api/auth/user-info': {
      get: { tags: ['认证'], summary: '获取当前用户信息', responses: { 200: { description: '用户信息' } } },
    },
    // ===== 流量监控 =====
    '/api/traffic/realtime': {
      get: {
        tags: ['流量监控'], summary: '秒级实时流量数据',
        parameters: [{ name: 'seconds', in: 'query', schema: { type: 'integer', default: 60 }, description: '采集秒数(最大300)' }],
        responses: { 200: { description: '实时流量数据点+汇总统计' } },
      },
    },
    '/api/traffic/throughput': {
      get: {
        tags: ['流量监控'], summary: '24h吞吐量趋势',
        parameters: [
          { name: 'dimension', in: 'query', schema: { type: 'string', enum: ['bytes', 'packets'], default: 'bytes' } },
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: { 200: { description: '吞吐量趋势数据' } },
      },
    },
    '/api/traffic/protocols': {
      get: { tags: ['流量监控'], summary: '协议识别与分布(15种)', responses: { 200: { description: '协议分布数据' } } },
    },
    '/api/traffic/hotspot': {
      get: { tags: ['流量监控'], summary: '热点业务排行', responses: { 200: { description: '热点服务列表' } } },
    },
    '/api/traffic/top-talkers': {
      get: {
        tags: ['流量监控'], summary: 'Top流量IP排行',
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }],
        responses: { 200: { description: 'IP流量排行' } },
      },
    },
    '/api/traffic/overview': {
      get: { tags: ['流量监控'], summary: '宏观概览(大屏首页)', responses: { 200: { description: '流量概览数据' } } },
    },
    '/api/traffic/ip/{ip}': {
      get: {
        tags: ['流量监控'], summary: '单IP详情(下钻)',
        parameters: [{ name: 'ip', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'IP详情+协议+对端' } },
      },
    },
    '/api/traffic/ip/{ip}/trend': {
      get: {
        tags: ['流量监控'], summary: '单IP通信对端变化趋势',
        parameters: [{ name: 'ip', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Top5对端24h趋势' } },
      },
    },
    // ===== 安全溯源 =====
    '/api/security/logs': {
      get: {
        tags: ['安全溯源'], summary: '安全日志列表',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['扫描攻击', '钓鱼攻击', '蠕虫攻击', 'DDoS攻击', '暴力破解'] } },
          { name: 'severity', in: 'query', schema: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] } },
          { name: 'keyword', in: 'query', schema: { type: 'string' }, description: '搜索IP或威胁名称' },
        ],
        responses: { 200: { description: '安全日志分页列表' } },
      },
    },
    '/api/security/stats': {
      get: { tags: ['安全溯源'], summary: '威胁统计概览', responses: { 200: { description: '24h威胁统计' } } },
    },
    '/api/security/timeline': {
      get: { tags: ['安全溯源'], summary: '24h威胁时间线', responses: { 200: { description: '按小时统计各类威胁' } } },
    },
    '/api/security/threats/scan': {
      get: { tags: ['安全溯源'], summary: '扫描攻击检测详情', responses: { 200: { description: '端口扫描+IP扫描事件' } } },
    },
    '/api/security/threats/phishing': {
      get: { tags: ['安全溯源'], summary: '钓鱼攻击检测详情', responses: { 200: { description: 'DNS钓鱼+邮件钓鱼事件' } } },
    },
    '/api/security/threats/worm': {
      get: { tags: ['安全溯源'], summary: '蠕虫传播检测详情', responses: { 200: { description: '蠕虫传播事件' } } },
    },
    '/api/security/threats/ddos': {
      get: { tags: ['安全溯源'], summary: 'DDoS攻击检测详情', responses: { 200: { description: 'SYN/UDP洪泛事件' } } },
    },
    '/api/security/threats/brute-force': {
      get: { tags: ['安全溯源'], summary: '暴力破解检测详情', responses: { 200: { description: '暴力破解事件' } } },
    },
    // ===== 算法引擎 =====
    '/api/algorithms/overview': {
      get: { tags: ['算法引擎'], summary: '算法模块能力清单', responses: { 200: { description: '6大算法模块概览' } } },
    },
    '/api/algorithms/anomaly/traffic': {
      get: {
        tags: ['算法引擎'], summary: '实时流量异常检测',
        parameters: [
          { name: 'method', in: 'query', schema: { type: 'string', enum: ['z-score', 'ewma', 'sliding-window', 'grubbs', 'ensemble'], default: 'ensemble' } },
          { name: 'seconds', in: 'query', schema: { type: 'integer', default: 120 } },
        ],
        responses: { 200: { description: '异常检测结果' } },
      },
    },
    '/api/algorithms/predict/throughput': {
      get: {
        tags: ['算法引擎'], summary: '流量预测',
        parameters: [
          { name: 'hours', in: 'query', schema: { type: 'integer', default: 6 } },
          { name: 'method', in: 'query', schema: { type: 'string', enum: ['sma', 'ses', 'holt', 'holt-winters', 'linear', 'ensemble'], default: 'ensemble' } },
        ],
        responses: { 200: { description: '预测结果+历史数据' } },
      },
    },
    '/api/algorithms/risk/ip/{ip}': {
      get: {
        tags: ['算法引擎'], summary: '单IP风险评分',
        parameters: [{ name: 'ip', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: '多维度风险评分' } },
      },
    },
    '/api/algorithms/risk/overview': {
      get: { tags: ['算法引擎'], summary: '风险概览仪表盘', responses: { 200: { description: '风险分布+Top风险IP' } } },
    },
    '/api/algorithms/correlation/killchain': {
      get: { tags: ['算法引擎'], summary: 'Kill Chain阶段分析', responses: { 200: { description: '7阶段映射结果' } } },
    },
    '/api/algorithms/correlation/campaigns': {
      get: { tags: ['算法引擎'], summary: '攻击战役识别', responses: { 200: { description: '战役+关联规则匹配' } } },
    },
    '/api/algorithms/dpi/report': {
      get: {
        tags: ['算法引擎'], summary: 'DPI深度包检测报告',
        parameters: [{ name: 'flows', in: 'query', schema: { type: 'integer', default: 100 } }],
        responses: { 200: { description: 'DPI分析报告' } },
      },
    },
    '/api/algorithms/profile/ip/{ip}': {
      get: {
        tags: ['算法引擎'], summary: 'IP行为画像',
        parameters: [{ name: 'ip', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: '完整行为基线' } },
      },
    },
    // ===== WebSocket =====
    '/ws/status': {
      get: { tags: ['WebSocket'], summary: 'WebSocket服务状态', responses: { 200: { description: '连接数+推送统计' } } },
    },
  },
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: [], // 我们直接在上面定义了paths，不需要扫描文件
});

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '安全感知平台 API 文档',
  }));

  // JSON格式的spec
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  console.log('[Swagger] API 文档已启动: http://localhost:8080/api-docs');
}

module.exports = { setupSwagger, swaggerSpec };
