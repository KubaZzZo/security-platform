/**
 * WebSocket 实时推送服务
 *
 * 频道：
 * - traffic：秒级流量数据推送（1s间隔）
 * - security：安全告警实时推送（5s间隔检测）
 * - system：系统状态推送（10s间隔）
 *
 * 协议：
 * 客户端 → 服务端：{ type: "subscribe"|"unsubscribe", channel: "traffic"|"security"|"system" }
 * 服务端 → 客户端：{ channel: string, timestamp: string, data: object }
 */

const WebSocket = require('ws');
const { generateRealtimeTraffic, generateProtocolDistribution } = require('../data/trafficGenerator');
const { generateSecurityLogs, generateThreatStats } = require('../data/securityGenerator');
const { seededRandom, gaussianRandom } = require('../data/trafficGenerator');

class RealtimePushService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // ws → { subscriptions: Set, connectedAt }
    this.intervals = {};
    this.stats = { totalConnections: 0, totalMessages: 0 };
  }

  /**
   * 初始化 WebSocket 服务器
   * @param {http.Server} server - HTTP 服务器实例
   */
  init(server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });

    this.wss.on('connection', (ws, req) => {
      const clientIP = req.socket.remoteAddress;
      this.stats.totalConnections++;

      // 注册客户端
      this.clients.set(ws, {
        subscriptions: new Set(),
        connectedAt: new Date().toISOString(),
        ip: clientIP,
      });

      console.log(`[WS] 客户端连接: ${clientIP} (在线: ${this.clients.size})`);

      // 发送欢迎消息
      this._send(ws, {
        channel: 'system',
        type: 'welcome',
        data: {
          message: '已连接安全感知平台实时推送服务',
          availableChannels: ['traffic', 'security', 'system'],
          serverTime: new Date().toISOString(),
        },
      });

      // 处理客户端消息
      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          this._handleMessage(ws, msg);
        } catch (e) {
          this._send(ws, { channel: 'system', type: 'error', data: { message: '无效的消息格式' } });
        }
      });

      // 断开连接
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`[WS] 客户端断开: ${clientIP} (在线: ${this.clients.size})`);
      });

      ws.on('error', (err) => {
        console.error(`[WS] 错误: ${err.message}`);
        this.clients.delete(ws);
      });
    });

    // 启动推送定时器
    this._startPushTimers();

    console.log('[WS] WebSocket 实时推送服务已启动 (路径: /ws)');
  }

  /** 处理客户端消息 */
  _handleMessage(ws, msg) {
    const client = this.clients.get(ws);
    if (!client) return;

    switch (msg.type) {
      case 'subscribe':
        if (['traffic', 'security', 'system'].includes(msg.channel)) {
          client.subscriptions.add(msg.channel);
          this._send(ws, {
            channel: 'system', type: 'subscribed',
            data: { channel: msg.channel, active: [...client.subscriptions] },
          });
        }
        break;

      case 'unsubscribe':
        client.subscriptions.delete(msg.channel);
        this._send(ws, {
          channel: 'system', type: 'unsubscribed',
          data: { channel: msg.channel, active: [...client.subscriptions] },
        });
        break;

      case 'ping':
        this._send(ws, { channel: 'system', type: 'pong', data: { serverTime: new Date().toISOString() } });
        break;

      default:
        this._send(ws, { channel: 'system', type: 'error', data: { message: `未知消息类型: ${msg.type}` } });
    }
  }

  /** 启动各频道推送定时器 */
  _startPushTimers() {
    // 流量数据：每秒推送
    this.intervals.traffic = setInterval(() => {
      this._pushToChannel('traffic', this._generateTrafficTick());
    }, 1000);

    // 安全告警：每5秒检测
    this.intervals.security = setInterval(() => {
      const alert = this._generateSecurityAlert();
      if (alert) {
        this._pushToChannel('security', alert);
      }
    }, 5000);

    // 系统状态：每10秒
    this.intervals.system = setInterval(() => {
      this._pushToChannel('system', this._generateSystemStatus());
    }, 10000);
  }

  /** 生成单个流量数据点 */
  _generateTrafficTick() {
    const points = generateRealtimeTraffic(1);
    const point = points[0];
    const rng = seededRandom(Date.now());

    return {
      type: 'tick',
      ...point,
      activeConnections: Math.floor(30000 + rng() * 50000),
      activeIPs: Math.floor(2000 + rng() * 3000),
      topProtocol: ['HTTPS', 'HTTP', 'DNS', 'SSH'][Math.floor(rng() * 4)],
    };
  }

  /** 生成安全告警（概率触发） */
  _generateSecurityAlert() {
    const rng = seededRandom(Date.now());
    // 30%概率产生告警
    if (rng() > 0.3) return null;

    const logs = generateSecurityLogs(1);
    const log = logs[0];

    return {
      type: 'alert',
      id: log.id,
      threatType: log.type.name,
      category: log.type.category,
      severity: log.type.severity,
      srcIP: log.srcIP,
      dstIP: log.dstIP,
      timestamp: log.timestamp,
      status: log.status,
      summary: `检测到${log.type.category}：${log.type.name}，来源 ${log.srcIP}`,
    };
  }

  /** 生成系统状态 */
  _generateSystemStatus() {
    const rng = seededRandom(Date.now());
    const memUsage = process.memoryUsage();

    return {
      type: 'status',
      server: {
        uptime: Math.floor(process.uptime()),
        memoryMB: Math.floor(memUsage.heapUsed / 1024 / 1024),
        wsClients: this.clients.size,
        totalConnections: this.stats.totalConnections,
        totalMessages: this.stats.totalMessages,
      },
      network: {
        linkUtilization: +(30 + rng() * 60).toFixed(1),
        activeAlerts: Math.floor(rng() * 20),
        threatsBlocked24h: Math.floor(50 + rng() * 150),
      },
    };
  }

  /** 向指定频道的所有订阅者推送 */
  _pushToChannel(channel, data) {
    const message = JSON.stringify({
      channel,
      timestamp: new Date().toISOString(),
      data,
    });

    for (const [ws, client] of this.clients) {
      if (client.subscriptions.has(channel) && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        this.stats.totalMessages++;
      }
    }
  }

  /** 主动推送消息到所有客户端（用于外部调用） */
  broadcast(channel, data) {
    this._pushToChannel(channel, data);
  }

  /** 发送消息给单个客户端 */
  _send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
      this.stats.totalMessages++;
    }
  }

  /** 获取服务状态 */
  getStatus() {
    return {
      running: !!this.wss,
      clients: this.clients.size,
      ...this.stats,
      subscriptions: {
        traffic: [...this.clients.values()].filter(c => c.subscriptions.has('traffic')).length,
        security: [...this.clients.values()].filter(c => c.subscriptions.has('security')).length,
        system: [...this.clients.values()].filter(c => c.subscriptions.has('system')).length,
      },
    };
  }

  /** 关闭服务 */
  close() {
    Object.values(this.intervals).forEach(clearInterval);
    if (this.wss) this.wss.close();
  }
}

// 单例
const pushService = new RealtimePushService();

module.exports = { RealtimePushService, pushService };
