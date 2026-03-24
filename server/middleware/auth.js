/**
 * JWT 认证中间件
 * 验证 Bearer Token，保护 API 路由
 */

const jwt = require('jsonwebtoken');

// JWT 密钥（生产环境应从环境变量读取）
const JWT_SECRET = process.env.JWT_SECRET || 'security-platform-secret-key-v3';
const JWT_EXPIRES_IN = '24h';

/**
 * 生成 JWT Token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 验证 JWT Token
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * 不需要认证的路径白名单
 */
const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api-docs',
  '/swagger',
  '/health',
];

/**
 * 认证中间件
 * 从 Authorization: Bearer <token> 提取并验证 token
 */
function authMiddleware(req, res, next) {
  // 白名单路径跳过认证
  const isPublic = PUBLIC_PATHS.some(p => req.path.startsWith(p));
  if (isPublic) return next();

  // OPTIONS 预检请求跳过
  if (req.method === 'OPTIONS') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: '未提供认证令牌，请先登录' },
    });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? '令牌已过期，请重新登录' : '无效的认证令牌';
    return res.status(401).json({
      success: false,
      error: { code: 401, message },
    });
  }
}

module.exports = { authMiddleware, generateToken, verifyToken, JWT_SECRET, JWT_EXPIRES_IN };
