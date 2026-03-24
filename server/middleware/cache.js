/**
 * 内存缓存中间件
 * 为计算密集型算法接口提供 TTL 缓存
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    // 每分钟清理过期缓存
    this._cleanupInterval = setInterval(() => this._cleanup(), 60000);
  }

  /**
   * 获取缓存
   * @returns {any|null} 缓存值或null
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    entry.hits++;
    return entry.value;
  }

  /**
   * 设置缓存
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMs - 过期时间（毫秒）
   */
  set(key, value, ttlMs = 30000) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      createdAt: Date.now(),
      hits: 0,
    });
  }

  /** 删除缓存 */
  del(key) {
    return this.cache.delete(key);
  }

  /** 清空所有缓存 */
  flush() {
    this.cache.clear();
  }

  /** 缓存统计 */
  stats() {
    let active = 0, expired = 0, totalHits = 0;
    const now = Date.now();
    this.cache.forEach(entry => {
      if (now > entry.expiresAt) expired++;
      else { active++; totalHits += entry.hits; }
    });
    return { active, expired, totalHits, size: this.cache.size };
  }

  /** 清理过期条目 */
  _cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) this.cache.delete(key);
    }
  }

  /** 销毁（清理定时器） */
  destroy() {
    clearInterval(this._cleanupInterval);
    this.cache.clear();
  }
}

// 全局缓存实例
const globalCache = new MemoryCache();

/**
 * Express 缓存中间件工厂
 * @param {number} ttlMs - 缓存时间（毫秒，默认30秒）
 */
function cacheMiddleware(ttlMs = 30000) {
  return (req, res, next) => {
    // 只缓存 GET 请求
    if (req.method !== 'GET') return next();

    const key = `${req.originalUrl}`;
    const cached = globalCache.get(key);

    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    // 拦截 res.json 以缓存响应
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200 && body?.success) {
        globalCache.set(key, body, ttlMs);
      }
      res.set('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}

module.exports = { MemoryCache, globalCache, cacheMiddleware };
