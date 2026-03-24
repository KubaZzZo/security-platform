/**
 * 算法能力 API 路由
 * 统一暴露所有算法模块的能力
 */

const express = require('express');
const router = express.Router();

// 算法模块
const anomaly = require('../data/algorithms/anomalyDetection');
const prediction = require('../data/algorithms/prediction');
const risk = require('../data/algorithms/riskScoring');
const correlation = require('../data/algorithms/attackCorrelation');
const dpi = require('../data/algorithms/dpi');
const profiling = require('../data/algorithms/ipProfiling');

// 数据生成器
const { generateRealtimeTraffic, generateThroughputTrend, generateProtocolDistribution } = require('../data/trafficGenerator');
const { generateSecurityLogs } = require('../data/securityGenerator');

// ============ 异常检测 ============

/**
 * GET /api/algorithms/anomaly/traffic
 * 对当前流量数据运行异常检测
 * Query: method=z-score|ewma|sliding-window|ensemble, seconds=120
 */
router.get('/anomaly/traffic', (req, res) => {
  const { method = 'ensemble', seconds = 120 } = req.query;
  const traffic = generateRealtimeTraffic(parseInt(seconds));
  const values = traffic.map(t => t.total.bps);

  let result;
  switch (method) {
    case 'z-score':
      result = anomaly.zScoreDetection(values);
      break;
    case 'ewma':
      result = anomaly.ewmaDetection(values);
      break;
    case 'sliding-window':
      result = anomaly.slidingWindowDetection(values);
      break;
    case 'grubbs':
      result = anomaly.grubbsTest(values);
      break;
    default:
      result = anomaly.ensembleDetection(values);
  }

  res.json({
    success: true,
    data: {
      method,
      sampleCount: values.length,
      timestamps: traffic.map(t => t.timestamp),
      values,
      result,
    },
  });
});

/**
 * POST /api/algorithms/anomaly/detect
 * 对自定义数据运行异常检测
 * Body: { data: number[], method: string, threshold?: number }
 */
router.post('/anomaly/detect', (req, res) => {
  const { data, method = 'ensemble', threshold } = req.body;
  if (!Array.isArray(data) || data.length < 3) {
    return res.status(400).json({ success: false, error: '需要至少3个数据点' });
  }

  let result;
  switch (method) {
    case 'z-score':
      result = anomaly.zScoreDetection(data, threshold || 2.5);
      break;
    case 'ewma':
      result = anomaly.ewmaDetection(data, threshold || 0.3);
      break;
    case 'sliding-window':
      result = anomaly.slidingWindowDetection(data, threshold || 10);
      break;
    case 'grubbs':
      result = anomaly.grubbsTest(data);
      break;
    case 'baseline':
      const mid = Math.floor(data.length / 2);
      result = anomaly.baselineDeviation(data.slice(mid), data.slice(0, mid), threshold || 50);
      break;
    default:
      result = anomaly.ensembleDetection(data);
  }

  res.json({ success: true, data: { method, sampleCount: data.length, result } });
});

// ============ 流量预测 ============

/**
 * GET /api/algorithms/predict/throughput
 * 预测未来N小时吞吐量
 * Query: hours=6, method=holt-winters|holt|ses|sma|ensemble
 */
router.get('/predict/throughput', (req, res) => {
  const { hours = 6, method = 'ensemble' } = req.query;
  const trend = generateThroughputTrend();
  const values = trend.map(t => t.inboundBytes);
  const forecastSteps = Math.min(parseInt(hours) * 12, 144); // 5min粒度

  let result;
  switch (method) {
    case 'sma':
      result = prediction.simpleMovingAverage(values, 12, forecastSteps);
      break;
    case 'ses':
      result = prediction.singleExponentialSmoothing(values, 0.3, forecastSteps);
      break;
    case 'holt':
      result = prediction.holtLinearSmoothing(values, 0.3, 0.1, forecastSteps);
      break;
    case 'holt-winters':
      result = prediction.holtWinters(values, 24, 0.3, 0.1, 0.3, forecastSteps);
      break;
    case 'linear':
      result = prediction.linearRegression(values, forecastSteps);
      break;
    default:
      result = prediction.ensembleForecast(values, forecastSteps);
  }

  res.json({
    success: true,
    data: {
      method,
      historicalPoints: trend.length,
      forecastSteps,
      forecastHours: parseInt(hours),
      historical: trend.map(t => ({ time: t.time, value: t.inboundBytes })),
      result,
    },
  });
});

/**
 * GET /api/algorithms/predict/seasonal
 * 季节性分解
 */
router.get('/predict/seasonal', (req, res) => {
  const trend = generateThroughputTrend();
  const values = trend.map(t => t.inboundBytes);
  const result = prediction.seasonalDecomposition(values, 48); // 48个5min=4小时周期

  res.json({
    success: true,
    data: {
      points: trend.length,
      times: trend.map(t => t.time),
      original: values,
      result,
    },
  });
});

// ============ 风险评分 ============

/**
 * GET /api/algorithms/risk/ip/:ip
 * 单IP风险评分
 */
router.get('/risk/ip/:ip', (req, res) => {
  const { ip } = req.params;
  const events = generateSecurityLogs(200).filter(e => e.srcIP === ip || e.dstIP === ip);
  const protocols = generateProtocolDistribution().slice(0, 8);
  const baseline = profiling.generateIPBaseline(ip);

  const score = risk.calculateRiskScore({
    trafficMetrics: {
      currentBps: baseline.baseline.hourlyTraffic[new Date().getHours()].avgBytes * 8,
      baselineBps: baseline.baseline.hourlyTraffic[new Date().getHours()].avgBytes * 8 * 0.8,
      burstCount: Math.floor(Math.random() * 5),
      protocolEntropy: baseline.baseline.protocolEntropy,
    },
    securityEvents: events,
    protocols,
    peers: baseline.baseline.regularPeers,
    assetType: baseline.deviceType === 'server' ? 'server' : 'workstation',
    historicalScore: Math.floor(Math.random() * 40),
    hoursSinceLastEvent: Math.floor(Math.random() * 48),
  });

  res.json({ success: true, data: { ip, deviceType: baseline.deviceLabel, ...score } });
});

/**
 * GET /api/algorithms/risk/batch
 * 批量IP风险评分
 * Query: limit=20
 */
router.get('/risk/batch', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const profiles = profiling.batchIPProfiling(limit);

  const scored = profiles.map(p => {
    const baseline = profiling.generateIPBaseline(p.ip);
    const score = risk.calculateRiskScore({
      trafficMetrics: { protocolEntropy: baseline.baseline.protocolEntropy, burstCount: 0 },
      securityEvents: [],
      protocols: baseline.baseline.protocolProfile,
      peers: baseline.baseline.regularPeers,
      assetType: p.deviceType,
    });
    return { ip: p.ip, deviceType: p.deviceLabel, riskScore: score.score, level: score.level, label: score.label, color: score.color };
  }).sort((a, b) => b.riskScore - a.riskScore);

  res.json({ success: true, data: { total: scored.length, list: scored } });
});

/**
 * GET /api/algorithms/risk/overview
 * 风险概览仪表盘
 */
router.get('/risk/overview', (req, res) => {
  const profiles = profiling.batchIPProfiling(50);
  const distribution = { critical: 0, high: 0, medium: 0, low: 0, safe: 0 };

  profiles.forEach(p => {
    if (p.deviationScore >= 80) distribution.critical++;
    else if (p.deviationScore >= 60) distribution.high++;
    else if (p.deviationScore >= 40) distribution.medium++;
    else if (p.deviationScore >= 20) distribution.low++;
    else distribution.safe++;
  });

  res.json({
    success: true,
    data: {
      totalIPs: profiles.length,
      distribution,
      avgScore: +(profiles.reduce((s, p) => s + p.deviationScore, 0) / profiles.length).toFixed(1),
      topRisk: profiles.slice(0, 10),
      byDeviceType: Object.entries(
        profiles.reduce((acc, p) => {
          acc[p.deviceLabel] = acc[p.deviceLabel] || { count: 0, totalScore: 0 };
          acc[p.deviceLabel].count++;
          acc[p.deviceLabel].totalScore += p.deviationScore;
          return acc;
        }, {})
      ).map(([type, data]) => ({ type, count: data.count, avgScore: +(data.totalScore / data.count).toFixed(1) })),
    },
  });
});

// ============ 攻击链关联 ============

/**
 * GET /api/algorithms/correlation/killchain
 * Kill Chain 阶段分析
 */
router.get('/correlation/killchain', (req, res) => {
  const events = generateSecurityLogs(100);
  const mapped = correlation.mapToKillChain(events);

  const stageStats = correlation.KILL_CHAIN_STAGES.map(s => ({
    ...s,
    count: mapped.filter(e => e.killChain.stageId === s.id).length,
  }));

  res.json({
    success: true,
    data: {
      events: mapped.slice(0, 50),
      stages: stageStats,
      totalEvents: mapped.length,
      coveredStages: stageStats.filter(s => s.count > 0).length,
    },
  });
});

/**
 * GET /api/algorithms/correlation/clusters
 * 事件聚类分析
 * Query: timeWindow=120 (分钟), minEvents=2
 */
router.get('/correlation/clusters', (req, res) => {
  const { timeWindow = 120, minEvents = 2 } = req.query;
  const events = generateSecurityLogs(150);
  const clusters = correlation.clusterEvents(events, parseInt(timeWindow) * 60000, parseInt(minEvents));

  res.json({
    success: true,
    data: {
      totalEvents: events.length,
      clusterCount: clusters.length,
      clusters: clusters.slice(0, 20),
      unclusteredEvents: events.length - clusters.reduce((s, c) => s + c.eventCount, 0),
    },
  });
});

/**
 * GET /api/algorithms/correlation/campaigns
 * 攻击战役识别
 */
router.get('/correlation/campaigns', (req, res) => {
  const events = generateSecurityLogs(200);
  const clusters = correlation.clusterEvents(events, 7200000, 2);
  const campaigns = correlation.identifyCampaigns(clusters);
  const rules = correlation.matchCorrelationRules(events);

  res.json({
    success: true,
    data: {
      campaigns,
      matchedRules: rules,
      summary: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === '活跃攻击').length,
        totalMatchedRules: rules.length,
        criticalRules: rules.filter(r => r.severity === 'critical').length,
      },
    },
  });
});

/**
 * GET /api/algorithms/correlation/graph
 * 攻击路径图数据（可视化用）
 */
router.get('/correlation/graph', (req, res) => {
  const events = generateSecurityLogs(80);
  const graph = correlation.generateAttackGraph(events);

  res.json({ success: true, data: graph });
});

// ============ 深度包检测 ============

/**
 * GET /api/algorithms/dpi/report
 * DPI 完整分析报告
 * Query: flows=100
 */
router.get('/dpi/report', (req, res) => {
  const flowCount = Math.min(parseInt(req.query.flows) || 100, 500);
  const report = dpi.generateDPIReport(flowCount);

  res.json({ success: true, data: report });
});

/**
 * POST /api/algorithms/dpi/identify
 * 识别单个流的应用
 * Body: { port, avgPacketSize, tls, burstPattern, bytesTotal }
 */
router.post('/dpi/identify', (req, res) => {
  const result = dpi.identifyApplication(req.body);
  res.json({ success: true, data: result });
});

/**
 * POST /api/algorithms/dpi/compliance
 * 协议合规性检测
 * Body: { protocol, port, tls, avgQueryLength, queryRate, bytesOut, duration }
 */
router.post('/dpi/compliance', (req, res) => {
  const violations = dpi.protocolComplianceCheck(req.body);
  res.json({
    success: true,
    data: {
      violations,
      isCompliant: violations.length === 0,
      riskLevel: violations.some(v => v.severity === 'critical') ? 'critical'
        : violations.some(v => v.severity === 'high') ? 'high'
        : violations.length > 0 ? 'medium' : 'safe',
    },
  });
});

/**
 * GET /api/algorithms/dpi/fingerprints
 * 获取应用指纹库和JA3指纹库
 */
router.get('/dpi/fingerprints', (req, res) => {
  res.json({
    success: true,
    data: {
      applications: dpi.APP_FINGERPRINTS.map(a => ({
        id: a.id, name: a.name, category: a.category, risk: a.risk,
      })),
      ja3: dpi.JA3_FINGERPRINTS,
      totalApps: dpi.APP_FINGERPRINTS.length,
      totalJA3: dpi.JA3_FINGERPRINTS.length,
    },
  });
});

// ============ IP 行为画像 ============

/**
 * GET /api/algorithms/profile/ip/:ip
 * 单IP完整行为画像
 */
router.get('/profile/ip/:ip', (req, res) => {
  const { ip } = req.params;
  const baseline = profiling.generateIPBaseline(ip);
  res.json({ success: true, data: baseline });
});

/**
 * GET /api/algorithms/profile/ip/:ip/deviation
 * 单IP行为偏差分析
 */
router.get('/profile/ip/:ip/deviation', (req, res) => {
  const { ip } = req.params;
  const baseline = profiling.generateIPBaseline(ip);
  const hour = new Date().getHours();
  const hourBase = baseline.baseline.hourlyTraffic[hour];

  // 模拟当前行为（带随机偏差）
  const rng = Math.random;
  const currentBehavior = {
    currentBytes: Math.floor(hourBase.avgBytes * (0.5 + rng() * 2)),
    protocols: baseline.baseline.protocolProfile.map(p => ({
      ...p, percentage: +(p.percentage * (0.7 + rng() * 0.6)).toFixed(1),
    })),
    peers: baseline.baseline.regularPeers,
  };

  const deviation = profiling.calculateDeviation(ip, currentBehavior);
  res.json({ success: true, data: deviation });
});

/**
 * GET /api/algorithms/profile/batch
 * 批量IP画像
 * Query: limit=20
 */
router.get('/profile/batch', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const profiles = profiling.batchIPProfiling(limit);

  const byType = {};
  profiles.forEach(p => {
    byType[p.deviceLabel] = (byType[p.deviceLabel] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      profiles,
      summary: {
        total: profiles.length,
        byDeviceType: Object.entries(byType).map(([type, count]) => ({ type, count })),
        anomalous: profiles.filter(p => p.level !== 'normal').length,
        avgDeviation: +(profiles.reduce((s, p) => s + p.deviationScore, 0) / profiles.length).toFixed(1),
      },
    },
  });
});

// ============ 算法概览 ============

/**
 * GET /api/algorithms/overview
 * 所有算法模块概览
 */
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      modules: [
        { id: 'anomaly', name: '异常检测', methods: ['Z-Score', 'EWMA', '滑动窗口', 'Grubbs检验', '基线偏差', '多算法融合'], endpoints: 2 },
        { id: 'prediction', name: '流量预测', methods: ['SMA', '单次指数平滑', 'Holt线性', 'Holt-Winters季节性', '线性回归', '多模型融合'], endpoints: 2 },
        { id: 'risk', name: '风险评分', methods: ['流量异常度', '威胁事件评分', '协议行为评分', '通信模式评分', '历史衰减', '资产加权'], endpoints: 3 },
        { id: 'correlation', name: '攻击链关联', methods: ['Kill Chain映射', '时间-IP聚类', '关联规则匹配', '战役识别', '攻击路径图'], endpoints: 4 },
        { id: 'dpi', name: '深度包检测', methods: ['应用指纹匹配', 'JA3/TLS指纹', '协议合规检测', '行为分类'], endpoints: 4 },
        { id: 'profiling', name: 'IP行为画像', methods: ['流量基线', '协议画像', '通信画像', '时间画像', '设备分类', '偏差评分'], endpoints: 3 },
      ],
      totalEndpoints: 18,
      killChainStages: correlation.KILL_CHAIN_STAGES,
      riskLevels: risk.RISK_LEVELS,
    },
  });
});

module.exports = router;
