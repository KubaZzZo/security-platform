/**
 * 请求日志中间件
 * 记录每个请求的方法、路径、状态码、耗时
 */

// ANSI颜色
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
};

function getStatusColor(status) {
  if (status >= 500) return colors.red;
  if (status >= 400) return colors.yellow;
  if (status >= 300) return colors.cyan;
  return colors.green;
}

function formatDuration(ms) {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // 响应完成时记录
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    const method = req.method.padEnd(6);
    const url = req.originalUrl;

    console.log(
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${colors.cyan}${method}${colors.reset} ` +
      `${url} ` +
      `${statusColor}${res.statusCode}${colors.reset} ` +
      `${colors.gray}${formatDuration(duration)}${colors.reset}`
    );
  });

  next();
}

module.exports = { requestLogger };
