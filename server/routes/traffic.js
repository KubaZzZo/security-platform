/**
 * 流量监控路由 - 高频采样与多维可视化
 *
 * 支持：
 * - 秒级实时流量（10Gbps+链路）
 * - 吞吐量趋势（Bytes/Packets双维度）
 * - 热点业务排行
 * - 协议识别与分布（15种协议）
 * - Top流量IP排行
 * - 单IP详情与通信对端趋势（下钻）
 */

const express = require('express');
const router = express.Router();
const {
  generateRealtimeTraffic,
  generateThroughputTrend,
  generateProtocolDistribution,
  generateHotspotServices,
  generateTopTalkers,
  seededRandom,
  gaussianRandom,
  randomCampusIP,
  randomExternalIP,
  getDailyTrafficMultiplier,
  PROTOCOLS,
} = require('../data/trafficGenerator');

/**
 * GET /api/traffic/realtime
 * 秒级实时流量数据
 * Query: seconds=60 (采集秒数，默认60)
 */
router.get('/realtime', (req, res) => {
  const seconds = Math.min(parseInt(req.query.seconds) || 60, 300);
  const data = generateRealtimeTraffic(seconds);

  // 计算汇总
  const summary = {
    avgInboundBps: Math.floor(data.reduce((s, d) => s + d.inbound.bps, 0) / data.length),
    avgOutboundBps: Math.floor(data.reduce((s, d) => s + d.outbound.bps, 0) / data.length),
    peakInboundBps: Math.max(...data.map(d => d.inbound.bps)),
    peakOutboundBps: Math.max(...data.map(d => d.outbound.bps)),
    totalBytes: data.reduce((s, d) => s + d.total.bytes, 0),
    totalPackets: data.reduce((s, d) => s + d.total.packets, 0),
    linkUtilization: +(data.reduce((s, d) => s + d.total.bps, 0) / data.length / (10 * 1e9) * 100).toFixed(1),
  };

  res.json({ success: true, data: { points: data, summary, sampleInterval: '1s', linkCapacity: '10Gbps' } });
});

/**
 * GET /api/traffic/throughput
 * 吞吐量趋势（24小时，5分钟粒度）
 * Query: date=YYYY-MM-DD, dimension=bytes|packets (默认bytes)
 */
router.get('/throughput', (req, res) => {
  const { date, dimension = 'bytes' } = req.query;
  const trend = generateThroughputTrend(date);

  const points = trend.map(p => ({
    time: p.time,
    inbound: dimension === 'packets' ? p.inboundPackets : p.inboundBytes,
    outbound: dimension === 'packets' ? p.outboundPackets : p.outboundBytes,
  }));

  // 峰值与均值
  const inValues = points.map(p => p.inbound);
  const outValues = points.map(p => p.outbound);

  res.json({
    success: true,
    data: {
      points,
      dimension,
      unit: dimension === 'packets' ? 'pps' : 'Bps',
      stats: {
        peakInbound: Math.max(...inValues),
        peakOutbound: Math.max(...outValues),
        avgInbound: Math.floor(inValues.reduce((a, b) => a + b, 0) / inValues.length),
        avgOutbound: Math.floor(outValues.reduce((a, b) => a + b, 0) / outValues.length),
        peakTime: points[inValues.indexOf(Math.max(...inValues))].time,
      },
      interval: '5min',
    },
  });
});

/**
 * GET /api/traffic/protocols
 * 协议识别与分布
 */
router.get('/protocols', (req, res) => {
  const protocols = generateProtocolDistribution();
  const totalBytes = protocols.reduce((s, p) => s + p.bytes, 0);

  res.json({
    success: true,
    data: {
      protocols,
      totalProtocols: protocols.length,
      totalBytes,
      categories: [...new Set(protocols.map(p => p.category))].map(cat => {
        const items = protocols.filter(p => p.category === cat);
        return {
          name: cat,
          bytes: items.reduce((s, p) => s + p.bytes, 0),
          percentage: +(items.reduce((s, p) => s + p.percentage, 0)).toFixed(2),
          protocols: items.map(p => p.protocol),
        };
      }),
    },
  });
});

/**
 * GET /api/traffic/hotspot
 * 热点业务/应用排行
 */
router.get('/hotspot', (req, res) => {
  const services = generateHotspotServices();
  res.json({
    success: true,
    data: {
      services,
      totalTraffic: services.reduce((s, sv) => s + sv.bytes, 0),
      totalUsers: services.reduce((s, sv) => s + sv.users, 0),
    },
  });
});

/**
 * GET /api/traffic/top-talkers
 * Top流量IP排行
 * Query: limit=20
 */
router.get('/top-talkers', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const talkers = generateTopTalkers(limit);
  res.json({ success: true, data: { talkers, total: talkers.length } });
});

/**
 * GET /api/traffic/ip/:ip
 * 单IP详情（下钻页面）
 * 展示该IP的流量概况、协议分布、通信对端
 */
router.get('/ip/:ip', (req, res) => {
  const { ip } = req.params;
  const rng = seededRandom(ip.split('.').reduce((a, b) => a + parseInt(b), 0));

  // 基本信息
  const info = {
    ip,
    hostname: `host-${ip.split('.').slice(2).join('-')}`,
    mac: Array.from({ length: 6 }, () => Math.floor(rng() * 256).toString(16).padStart(2, '0')).join(':'),
    department: ['计算机学院', '信息学院', '图书馆', '行政楼', '学生宿舍', '实验中心'][Math.floor(rng() * 6)],
    os: ['Windows 10', 'Windows 11', 'Ubuntu 22.04', 'macOS 14', 'CentOS 7'][Math.floor(rng() * 5)],
    firstSeen: new Date(Date.now() - Math.floor(rng() * 90 * 86400000)).toISOString(),
    lastSeen: new Date().toISOString(),
    riskLevel: rng() > 0.7 ? 'high' : rng() > 0.4 ? 'medium' : 'low',
  };

  // 流量概况
  const trafficSummary = {
    totalBytes: Math.floor(rng() * 5e9 + 1e8),
    totalPackets: Math.floor(rng() * 8e6 + 1e5),
    avgBps: Math.floor(rng() * 100e6 + 1e6),
    peakBps: Math.floor(rng() * 500e6 + 10e6),
    activeConnections: Math.floor(rng() * 200 + 5),
  };

  // 该IP的协议分布
  const ipProtocols = PROTOCOLS.slice(0, 8).map(p => ({
    protocol: p.name,
    bytes: Math.floor(trafficSummary.totalBytes * (p.weight / 100) * (0.8 + rng() * 0.4)),
    connections: Math.floor(rng() * 100 + 1),
  })).sort((a, b) => b.bytes - a.bytes);

  // 通信对端 Top10
  const peers = Array.from({ length: 10 }, (_, i) => {
    const isExternal = rng() > 0.4;
    return {
      ip: isExternal ? randomExternalIP(rng) : randomCampusIP(rng),
      type: isExternal ? 'external' : 'internal',
      bytes: Math.floor(trafficSummary.totalBytes * Math.pow(0.6, i) * (0.8 + rng() * 0.4)),
      packets: Math.floor(rng() * 1e5 + 1000),
      protocol: PROTOCOLS[Math.floor(rng() * 8)].name,
      lastActive: new Date(Date.now() - Math.floor(rng() * 3600000)).toISOString(),
    };
  }).sort((a, b) => b.bytes - a.bytes);

  res.json({ success: true, data: { info, trafficSummary, protocols: ipProtocols, peers } });
});

/**
 * GET /api/traffic/ip/:ip/trend
 * 单IP通信对端变化趋势（24小时）
 * 展示该IP与Top5对端的流量随时间变化
 */
router.get('/ip/:ip/trend', (req, res) => {
  const { ip } = req.params;
  const seed = ip.split('.').reduce((a, b) => a + parseInt(b), 0);
  const rng = seededRandom(seed);

  // 生成Top5对端
  const topPeers = Array.from({ length: 5 }, () => {
    return rng() > 0.4 ? randomExternalIP(rng) : randomCampusIP(rng);
  });

  // 24小时趋势，每30分钟一个点
  const points = [];
  for (let m = 0; m < 24 * 60; m += 30) {
    const hour = m / 60;
    const multiplier = getDailyTrafficMultiplier(hour);
    const hh = String(Math.floor(hour)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');

    const point = { time: `${hh}:${mm}` };
    topPeers.forEach((peer, i) => {
      const base = 1e7 * Math.pow(0.6, i) * multiplier;
      point[peer] = Math.max(0, Math.floor(base * (1 + gaussianRandom(0, 0.2, rng))));
    });
    points.push(point);
  }

  res.json({
    success: true,
    data: { ip, peers: topPeers, points, interval: '30min' },
  });
});

/**
 * GET /api/traffic/overview
 * 宏观概览（大屏首页数据）
 */
router.get('/overview', (req, res) => {
  const rng = seededRandom(Date.now());
  const hour = new Date().getHours();
  const multiplier = getDailyTrafficMultiplier(hour);
  const BASE = 10 * 1e9;

  res.json({
    success: true,
    data: {
      currentBandwidth: {
        inbound: Math.floor(BASE * multiplier * 0.55),
        outbound: Math.floor(BASE * multiplier * 0.38),
        total: Math.floor(BASE * multiplier * 0.93),
        utilization: +(multiplier * 93).toFixed(1),
      },
      today: {
        totalBytes: Math.floor(BASE * 0.45 * 86400 / 8),
        totalPackets: Math.floor(BASE * 0.45 * 86400 / 8 / 600),
        peakBps: Math.floor(BASE * 0.95),
        peakTime: '09:15',
        activeIPs: Math.floor(3000 + rng() * 2000),
        activeConnections: Math.floor(50000 + rng() * 30000),
      },
      protocols: generateProtocolDistribution().slice(0, 5),
      topTalkers: generateTopTalkers(5),
    },
  });
});

module.exports = router;
