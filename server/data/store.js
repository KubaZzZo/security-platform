/**
 * 轻量级 JSON 文件持久化存储引擎
 * 支持 CRUD 操作，自动持久化到磁盘
 */

const fs = require('fs');
const path = require('path');

const STORE_DIR = path.join(__dirname, '../.store');

class JsonStore {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(STORE_DIR, `${name}.json`);
    this.data = [];
    this._ensureDir();
    this._load();
  }

  _ensureDir() {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (e) {
      console.error(`[Store] 加载 ${this.name} 失败:`, e.message);
      this.data = [];
    }
  }

  _save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`[Store] 保存 ${this.name} 失败:`, e.message);
    }
  }

  /** 插入记录 */
  insert(record) {
    const item = {
      id: `${this.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...record,
      createdAt: new Date().toISOString(),
    };
    this.data.unshift(item);
    // 限制最大记录数，防止文件过大
    if (this.data.length > 10000) {
      this.data = this.data.slice(0, 10000);
    }
    this._save();
    return item;
  }

  /** 批量插入 */
  insertMany(records) {
    const items = records.map(r => ({
      id: `${this.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...r,
      createdAt: new Date().toISOString(),
    }));
    this.data.unshift(...items);
    if (this.data.length > 10000) {
      this.data = this.data.slice(0, 10000);
    }
    this._save();
    return items;
  }

  /** 查询（支持过滤、分页） */
  find(filter = {}, { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc' } = {}) {
    let result = [...this.data];

    // 过滤
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter(item => {
          const itemVal = item[key];
          if (typeof value === 'string') return String(itemVal).includes(value);
          return itemVal === value;
        });
      }
    }

    // 排序
    result.sort((a, b) => {
      const va = a[sort], vb = b[sort];
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return order === 'desc' ? -cmp : cmp;
    });

    const total = result.length;
    const p = parseInt(page);
    const ps = parseInt(pageSize);
    const paged = result.slice((p - 1) * ps, p * ps);

    return {
      list: paged,
      pagination: { page: p, pageSize: ps, total, totalPages: Math.ceil(total / ps) },
    };
  }

  /** 按ID查找 */
  findById(id) {
    return this.data.find(item => item.id === id) || null;
  }

  /** 更新 */
  update(id, updates) {
    const idx = this.data.findIndex(item => item.id === id);
    if (idx === -1) return null;
    this.data[idx] = { ...this.data[idx], ...updates, updatedAt: new Date().toISOString() };
    this._save();
    return this.data[idx];
  }

  /** 删除 */
  remove(id) {
    const idx = this.data.findIndex(item => item.id === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    this._save();
    return true;
  }

  /** 统计 */
  count(filter = {}) {
    if (Object.keys(filter).length === 0) return this.data.length;
    return this.find(filter, { pageSize: Infinity }).list.length;
  }

  /** 清空 */
  clear() {
    this.data = [];
    this._save();
  }
}

// 预定义存储实例
const stores = {
  securityLogs: new JsonStore('security-logs'),
  disposalRecords: new JsonStore('disposal-records'),
  alertHistory: new JsonStore('alert-history'),
  auditLog: new JsonStore('audit-log'),
  userSessions: new JsonStore('user-sessions'),
};

module.exports = { JsonStore, stores };
