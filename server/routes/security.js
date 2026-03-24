/**
 * 安全溯源路由 - 威胁检测与安全日志
 *
 * 支持：
 * - 4+种典型网络威胁检测（扫描、钓鱼、蠕虫、DDoS、暴力破解）
 * - 安全日志列表（时间、类型、源目IP）
 * - 威胁统计与时间线
 * - 按威胁类型筛选
 * - 单IP安全事件查询
 */

const express = require('express');
const router = express.Router();
const {
  generateSecurityLogs,
  generateThreatStats,
  generateThreatTimeline,
  generateIPSecurityEvents,
  generatePortScan,
  generateIPSweep,
  generatePhishing,
  generateWormSpread,
  generateDDoS,
  generateBruteForce,
  THREAT_TYPES,
} = require('../data/securityGenerator');
const { seededRandom, randomExternalIP, randomCampusIP } = require('../data/trafficGenerator');

/**
 * GET /api/security/logs
 * 安全日志列表（核心接口）
 * Query: page=1, pageSize=20, type=扫描攻击|钓鱼攻击|蠕虫攻击|DDoS攻击|暴力破解, severity=critical|high|medium|low
 */
router.get('/logs', (req, res) => {
  const { page = 1, pageSize = 20, type, severity, keyword } = req.query;
  let logs = generateSecurityLogs(200);

  // 按威胁类别筛选
  if (type) {
    logs = logs.filter(l => l.type.category === type);
  }
  // 按严重级别筛选
  if (severity) {
    logs = logs.filter(l => l.type.severity === severity);
  }
  // 关键词搜索（IP、威胁名称）
  if (keyword) {
    const kw = keyword.toLowerCase();
    logs = logs.filter(l =>
      l.srcIP.toLowerCase().includes(kw) ||
      l.dstIP.toLowerCase().includes(kw) ||
      l.type.name.toLowerCase().includes(kw)
    );
  }

  const total = logs.length;
  const p = parseInt(page);
  const ps = parseInt(pageSize);
  const paged = logs.slice((p - 1) * ps, p * ps);

  res.json({
    success: true,
    data: {
      list: paged,
      pagination: { page: p, pageSize: ps, total, totalPages: Math.ceil(total / ps) },
    },
  });
});

/**
 * GET /api/security/stats
 * 威胁统计概览
 */
router.get('/stats', (req, res) => {
  const stats = generateThreatStats();
  res.json({ success: true, data: stats });
});

/**
 * GET /api/security/timeline
 * 24小时威胁时间线
 */
router.get('/timeline', (req, res) => {
  const timeline = generateThreatTimeline();
  const totals = timeline.reduce((acc, p) => {
    acc.scan += p.scan;
    acc.phishing += p.phishing;
    acc.worm += p.worm;
    acc.ddos += p.ddos;
    acc.bruteForce += p.bruteForce;
    return acc;
  }, { scan: 0, phishing: 0, worm: 0, ddos: 0, bruteForce: 0 });

  res.json({ success: true, data: { timeline, totals } });
});

/**
 * GET /api/security/threats/scan
 * 扫描攻击检测详情
 */
router.get('/threats/scan', (req, res) => {
  const rng = seededRandom(Date.now());
  const now = Date.now();
  const events = [];
  for (let i = 0; i < 30; i++) {
    events.push(rng() > 0.5 ? generatePortScan(rng, now) : generateIPSweep(rng, now));
  }
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    success: true,
    data: {
      events,
      summary: {
        total: events.length,
        portScans: events.filter(e => e.type.code === 'PORT_SCAN').length,
        ipSweeps: events.filter(e => e.type.code === 'IP_SWEEP').length,
        blocked: events.filter(e => e.status === 'blocked').length,
        topScanners: [...new Set(events.map(e => e.srcIP))].slice(0, 5),
      },
    },
  });
});

/**
 * GET /api/security/threats/phishing
 * 钓鱼攻击检测详情
 */
router.get('/threats/phishing', (req, res) => {
  const rng = seededRandom(Date.now());
  const now = Date.now();
  const events = [];
  for (let i = 0; i < 25; i++) {
    events.push(generatePhishing(rng, now));
  }
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const dnsEvents = events.filter(e => e.type.code === 'PHISHING_DNS');
  const emailEvents = events.filter(e => e.type.code === 'PHISHING_EMAIL');

  res.json({
    success: true,
    data: {
      events,
      summary: {
        total: events.length,
        dnsPhishing: dnsEvents.length,
        emailPhishing: emailEvents.length,
        blocked: events.filter(e => e.status === 'blocked').length,
        affectedUsers: [...new Set(events.map(e => e.type.code === 'PHISHING_DNS' ? e.srcIP : e.dstIP))].length,
        topDomains: [...new Set(dnsEvents.map(e => e.detail.queryDomain))].slice(0, 5),
      },
    },
  });
});

/**
 * GET /api/security/threats/worm
 * 蠕虫攻击检测详情
 */
router.get('/threats/worm', (req, res) => {
  const rng = seededRandom(Date.now());
  const now = Date.now();
  const events = [];
  for (let i = 0; i < 8; i++) {
    events.push(generateWormSpread(rng, now));
  }
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalInfected = events.reduce((s, e) => s + e.detail.totalInfected, 0);

  res.json({
    success: true,
    data: {
      events,
      summary: {
        total: events.length,
        totalInfectedHosts: totalInfected,
        signatures: [...new Set(events.map(e => e.detail.wormSignature))],
        targetPorts: [...new Set(events.map(e => e.detail.targetPort))],
      },
    },
  });
});

/**
 * GET /api/security/threats/ddos
 * DDoS攻击检测详情
 */
router.get('/threats/ddos', (req, res) => {
  const rng = seededRandom(Date.now());
  const now = Date.now();
  const events = [];
  for (let i = 0; i < 12; i++) {
    events.push(generateDDoS(rng, now));
  }
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const peakAttack = events.reduce((max, e) => e.detail.peakBps > max.detail.peakBps ? e : max, events[0]);

  res.json({
    success: true,
    data: {
      events,
      summary: {
        total: events.length,
        synFlood: events.filter(e => e.type.code === 'DDOS_SYN').length,
        udpFlood: events.filter(e => e.type.code === 'DDOS_UDP').length,
        mitigated: events.filter(e => e.status === 'mitigated').length,
        peakBps: peakAttack.detail.peakBpsFormatted,
        totalSources: events.reduce((s, e) => s + e.detail.sourceCount, 0),
        topTargets: [...new Set(events.map(e => e.detail.targetIP))].slice(0, 5),
      },
    },
  });
});

/**
 * GET /api/security/threats/brute-force
 * 暴力破解检测详情
 */
router.get('/threats/brute-force', (req, res) => {
  const rng = seededRandom(Date.now());
  const now = Date.now();
  const events = [];
  for (let i = 0; i < 20; i++) {
    events.push(generateBruteForce(rng, now));
  }
  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    success: true,
    data: {
      events,
      summary: {
        total: events.length,
        blocked: events.filter(e => e.status === 'blocked').length,
        successfulBreaches: events.filter(e => e.detail.successfulLogin).length,
        byService: ['SSH', 'RDP', 'FTP', 'MySQL', 'SMTP'].map(svc => ({
          service: svc,
          count: events.filter(e => e.detail.service === svc).length,
        })).filter(s => s.count > 0),
        topAttackers: [...new Set(events.map(e => e.srcIP))].slice(0, 5),
      },
    },
  });
});

/**
 * GET /api/security/ip/:ip
 * 单IP安全事件（下钻）
 */
router.get('/ip/:ip', (req, res) => {
  const { ip } = req.params;
  const events = generateIPSecurityEvents(ip, 30);

  const byType = {};
  events.forEach(e => {
    const cat = e.type.category;
    byType[cat] = (byType[cat] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      ip,
      events,
      summary: {
        totalEvents: events.length,
        byCategory: Object.entries(byType).map(([category, count]) => ({ category, count })),
        latestEvent: events[0]?.timestamp,
        riskScore: Math.min(100, events.length * 3 + Object.keys(byType).length * 10),
      },
    },
  });
});

/**
 * GET /api/security/threat-types
 * 获取所有威胁类型定义
 */
router.get('/threat-types', (req, res) => {
  res.json({ success: true, data: Object.values(THREAT_TYPES) });
});

module.exports = router;
