/**
 * 多因子风险评分模型
 *
 * 基于加权评分矩阵，综合以下维度：
 * - 流量异常度（Traffic Anomaly Score）
 * - 威胁事件评分（Threat Event Score）
 * - 协议行为评分（Protocol Behavior Score）
 * - 通信模式评分（Communication Pattern Score）
 * - 资产价值权重（Asset Value Weight）
 * - 历史风险衰减（Historical Risk Decay）
 *
 * 输出：0-100 综合风险分，含各维度明细
 */

// 风险等级定义
const RISK_LEVELS = [
  { level: 'critical', label: '严重', min: 80, color: '#ff1744' },
  { level: 'high', label: '高危', min: 60, color: '#ff5722' },
  { level: 'medium', label: '中危', min: 40, color: '#ff9800' },
  { level: 'low', label: '低危', min: 20, color: '#ffc107' },
  { level: 'safe', label: '安全', min: 0, color: '#4caf50' },
];

// 威胁严重度权重
const SEVERITY_WEIGHTS = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
  info: 1,
};

// 资产类型价值权重
const ASSET_VALUE = {
  server: 1.5,       // 服务器
  database: 2.0,     // 数据库
  gateway: 1.8,      // 网关
  firewall: 1.8,     // 防火墙
  workstation: 0.8,  // 工作站
  printer: 0.3,      // 打印机
  iot: 0.5,          // IoT设备
  unknown: 1.0,
};

/**
 * 计算流量异常度评分 (0-100)
 * 基于流量偏离基线的程度
 */
function trafficAnomalyScore(metrics) {
  const {
    currentBps = 0,
    baselineBps = 0,
    burstCount = 0,        // 突发次数
    zeroTrafficSeconds = 0, // 零流量秒数
    protocolEntropy = 0,    // 协议熵值
  } = metrics;

  let score = 0;

  // 1. 流量偏差 (0-35分)
  if (baselineBps > 0) {
    const deviation = Math.abs(currentBps - baselineBps) / baselineBps;
    score += Math.min(35, deviation * 20);
  }

  // 2. 突发频率 (0-25分)
  score += Math.min(25, burstCount * 5);

  // 3. 零流量异常 (0-20分) — 正常设备不应长时间零流量后突然高流量
  score += Math.min(20, zeroTrafficSeconds * 0.5);

  // 4. 协议熵异常 (0-20分) — 熵过低(单一协议)或过高(扫描特征)
  const normalEntropy = 2.5; // 正常校园网协议熵约2-3
  const entropyDev = Math.abs(protocolEntropy - normalEntropy);
  score += Math.min(20, entropyDev * 8);

  return Math.min(100, Math.round(score));
}

/**
 * 计算威胁事件评分 (0-100)
 * 基于关联的安全事件数量和严重度
 */
function threatEventScore(events) {
  if (!events || events.length === 0) return 0;

  let score = 0;

  // 按严重度加权求和
  events.forEach(e => {
    const severity = e.type?.severity || e.severity || 'low';
    score += SEVERITY_WEIGHTS[severity] || 3;
  });

  // 事件多样性加成（多种类型攻击更危险）
  const uniqueTypes = new Set(events.map(e => e.type?.category || e.category)).size;
  const diversityBonus = (uniqueTypes - 1) * 8;
  score += diversityBonus;

  // 时间密度加成（短时间内大量事件更危险）
  if (events.length >= 2) {
    const timestamps = events.map(e => new Date(e.timestamp).getTime()).sort();
    const timeSpan = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000; // 秒
    if (timeSpan > 0) {
      const density = events.length / (timeSpan / 60); // 每分钟事件数
      score += Math.min(20, density * 5);
    }
  }

  return Math.min(100, Math.round(score));
}

/**
 * 计算协议行为评分 (0-100)
 * 检测异常协议使用模式
 */
function protocolBehaviorScore(protocols) {
  if (!protocols || protocols.length === 0) return 0;

  let score = 0;

  // 高危协议使用
  const riskyProtocols = {
    Telnet: 20,   // 明文传输
    FTP: 10,      // 明文传输
    RDP: 8,       // 常被攻击
    SMB: 15,      // 蠕虫传播通道
    IRC: 25,      // C2通信特征
    TOR: 30,      // 匿名网络
  };

  protocols.forEach(p => {
    const name = p.protocol || p.name;
    if (riskyProtocols[name]) {
      score += riskyProtocols[name];
    }
  });

  // 非标准端口使用
  const nonStandardPorts = protocols.filter(p => {
    const port = p.port;
    return port > 10000 && p.bytes > 1e6; // 高端口+大流量
  });
  score += nonStandardPorts.length * 8;

  // 协议数量异常（正常终端一般用3-8种协议）
  const protoCount = protocols.length;
  if (protoCount > 12) score += (protoCount - 12) * 3;
  if (protoCount === 1 && protocols[0]?.bytes > 1e8) score += 15; // 单协议大流量

  return Math.min(100, Math.round(score));
}

/**
 * 计算通信模式评分 (0-100)
 * 检测异常通信模式
 */
function communicationPatternScore(peers) {
  if (!peers || peers.length === 0) return 0;

  let score = 0;

  // 1. 对端数量异常 (0-30分)
  const peerCount = peers.length;
  if (peerCount > 50) score += Math.min(30, (peerCount - 50) * 0.5);
  if (peerCount > 200) score += 15; // 扫描特征

  // 2. 外部连接比例 (0-25分)
  const externalPeers = peers.filter(p => p.type === 'external').length;
  const externalRatio = peerCount > 0 ? externalPeers / peerCount : 0;
  if (externalRatio > 0.8) score += 25;
  else if (externalRatio > 0.6) score += 15;

  // 3. 单一目标集中度 (0-20分) — DDoS参与特征
  if (peers.length > 0) {
    const maxBytes = Math.max(...peers.map(p => p.bytes || 0));
    const totalBytes = peers.reduce((s, p) => s + (p.bytes || 0), 0);
    const concentration = totalBytes > 0 ? maxBytes / totalBytes : 0;
    if (concentration > 0.9) score += 20; // 90%流量到单一目标
  }

  // 4. 新对端突增 (0-25分)
  const recentPeers = peers.filter(p => {
    const lastActive = new Date(p.lastActive).getTime();
    return Date.now() - lastActive < 3600000; // 1小时内
  });
  if (recentPeers.length > 20) score += Math.min(25, (recentPeers.length - 20) * 2);

  return Math.min(100, Math.round(score));
}

/**
 * 历史风险衰减
 * 历史风险随时间指数衰减
 * @param {number} historicalScore - 历史风险分
 * @param {number} hoursSince - 距上次事件的小时数
 * @param {number} halfLife - 半衰期（小时，默认24）
 */
function riskDecay(historicalScore, hoursSince, halfLife = 24) {
  const decayFactor = Math.pow(0.5, hoursSince / halfLife);
  return Math.round(historicalScore * decayFactor);
}

/**
 * 综合风险评分（核心函数）
 * 多维度加权融合
 */
function calculateRiskScore(params) {
  const {
    trafficMetrics = {},
    securityEvents = [],
    protocols = [],
    peers = [],
    assetType = 'unknown',
    historicalScore = 0,
    hoursSinceLastEvent = 24,
  } = params;

  // 各维度评分
  const dimensions = {
    traffic: trafficAnomalyScore(trafficMetrics),
    threat: threatEventScore(securityEvents),
    protocol: protocolBehaviorScore(protocols),
    communication: communicationPatternScore(peers),
    historical: riskDecay(historicalScore, hoursSinceLastEvent),
  };

  // 维度权重
  const weights = {
    traffic: 0.20,
    threat: 0.35,
    protocol: 0.15,
    communication: 0.15,
    historical: 0.15,
  };

  // 加权求和
  let rawScore = 0;
  for (const [dim, score] of Object.entries(dimensions)) {
    rawScore += score * weights[dim];
  }

  // 资产价值调整
  const assetMultiplier = ASSET_VALUE[assetType] || 1.0;
  const adjustedScore = Math.min(100, Math.round(rawScore * assetMultiplier));

  // 确定风险等级
  const riskLevel = RISK_LEVELS.find(r => adjustedScore >= r.min) || RISK_LEVELS[RISK_LEVELS.length - 1];

  return {
    score: adjustedScore,
    level: riskLevel.level,
    label: riskLevel.label,
    color: riskLevel.color,
    dimensions,
    weights,
    assetMultiplier,
    recommendation: generateRecommendation(adjustedScore, dimensions),
  };
}

/** 生成处置建议 */
function generateRecommendation(score, dimensions) {
  const recommendations = [];

  if (dimensions.threat > 60) {
    recommendations.push({ priority: 'urgent', action: '立即排查安全事件，确认是否存在入侵行为' });
  }
  if (dimensions.traffic > 60) {
    recommendations.push({ priority: 'high', action: '流量异常，建议检查是否存在数据泄露或DDoS攻击' });
  }
  if (dimensions.protocol > 50) {
    recommendations.push({ priority: 'high', action: '检测到高危协议使用，建议限制不必要的协议访问' });
  }
  if (dimensions.communication > 50) {
    recommendations.push({ priority: 'medium', action: '通信模式异常，建议核实对端IP合法性' });
  }
  if (score < 20) {
    recommendations.push({ priority: 'info', action: '当前风险较低，保持常规监控即可' });
  }

  return recommendations;
}

/**
 * 批量IP风险评分
 * 对一组IP进行风险评估并排序
 */
function batchRiskScoring(ipList) {
  return ipList
    .map(ip => ({ ip: ip.ip, ...calculateRiskScore(ip) }))
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  RISK_LEVELS,
  SEVERITY_WEIGHTS,
  ASSET_VALUE,
  trafficAnomalyScore,
  threatEventScore,
  protocolBehaviorScore,
  communicationPatternScore,
  riskDecay,
  calculateRiskScore,
  batchRiskScoring,
};
