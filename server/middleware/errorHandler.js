/**
 * 全局错误处理中间件
 * 统一错误响应格式，捕获未处理异常
 */

function errorHandler(err, req, res, next) {
  // 默认500
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  // 开发环境返回堆栈
  const isDev = process.env.NODE_ENV !== 'production';

  const response = {
    success: false,
    error: {
      code: statusCode,
      message,
      ...(isDev && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  };

  // 记录错误日志
  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}: ${message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
}

/** 创建带状态码的错误 */
function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/** 404 路由未找到 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 404, message: `接口不存在: ${req.method} ${req.originalUrl}` },
    timestamp: new Date().toISOString(),
  });
}

module.exports = { errorHandler, createError, notFoundHandler };
