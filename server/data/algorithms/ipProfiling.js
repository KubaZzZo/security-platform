/**
 * IP 行为画像引擎
 *
 * 为每个IP建立行为基线模型：
 * - 流量基线：正常流量范围（均值±标准差）
 * - 协议画像：常用协议及比例
 * - 通信画像：常见对端IP及通信频率
 * - 时间画像：活跃时段分布
 * - 设备分类：基于行为特征自动分类
 * - 偏差评分：当前行为与基线的偏离度
 */

const { seededRandom, gaussianRandom, PROTOCOLS, randomCampusIP, randomExternalIP, getDailyTrafficMultiplier } = require('../trafficGenerator');

// 设备类型行为模板
const DEVICE_PROFILES = {
  server: {
    label: '服务器',
    activeHours: 24,           // 全天活跃
    protocolDiversity: 3,      // 协议种类少
    peerStability: 0.9,        // 对端稳定
    trafficPattern: 'stable',  // 流量稳定
    avgBandwidth: 'high',
    inboundRatio: 0.7,         // 入站流量占比高
  },
  workstation: {
    label: '工作站/PC',
    activeHours: 10,
    protocolDiversity: 6,
    peerStability: 0.4,
    trafficPattern: 'bursty',
    avgBandwidth: 'medium',
    inboundRatio: 0.4,
  },
  iot: {
    label: 'IoT设备',
    activeHours: 24,
    protocolDiversity: 2,
    peerStability: 0.95,
    trafficPattern: 'periodic',
    avgBandwidth: 'low',
    inboundRatio: 0.3,
  },
  mobile: {
    label: '移动设备',
    activeHours: 14,
    protocolDiversity: 5,
    peerStability: 0.2,
    trafficPattern: 'bursty',
    avgBandwidth: 'medium',
    inboundRatio: 0.35,
  },
  printer: {
    label: '打印机/外设',
    activeHours: 8,
    protocolDiversity: 2,
    peerStability: 0.85,
    trafficPattern: 'sparse',
    avgBandwidth: 'very_low',
    inboundRatio: 0.8,
  },
};

/**
 * 计算信息熵
 * 用于衡量协议/对端分布的均匀程度
 */
function shannonEntropy(distribution) {
  const total = distribution.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;
  let entropy = 0;
  distribution.forEach(v => {
    if (v > 0) {
      const p = v / total;
      entropy -= p * Math.log2(p);
    }
  });
  return +entropy.toFixed(4);
}

/**
 * 余弦相似度
 * 比较两个行为向量的相似程度
 */
function cosineSimilarity(vecA, vecB) {
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : +(dotProduct / denom).toFixed(4);
}

/**
 * 生成IP行为基线
 * 基于IP地址种子生成确定性的行为画像
 */
function generateIPBaseline(ip) {
  const seed = ip.split('.').reduce((a, b) => a * 256 + parseInt(b), 0);
  const rng = seededRandom(seed);

  // 自动分类设备类型
  const typeRoll = rng();
  const deviceType = typeRoll < 0.15 ? 'server' :
    typeRoll < 0.55 ? 'workstation' :
    typeRoll < 0.7 ? 'mobile' :
    typeRoll < 0.85 ? 'iot' : 'printer';
  const profile = DEVICE_PROFILES[deviceType];

  // 流量基线（24小时，每小时一个点）
  const hourlyBaseline = Array.from({ length: 24 }, (_, h) => {
    const mult = getDailyTrafficMultiplier(h);
    const isActive = h >= (12 - profile.activeHours / 2) && h < (12 + profile.activeHours / 2);
    const base = isActive ? mult * (rng() * 5e7 + 1e6) : rng() * 1e5;
    return {
      hour: h,
      avgBytes: Math.floor(base),
      stdBytes: Math.floor(base * (0.15 + rng() * 0.2)),
      avgPackets: Math.floor(base / 700),
    };
  });

  // 协议画像
  const protoCount = Math.floor(rng() * profile.protocolDiversity) + 2;
  const selectedProtos = [];
  const usedIdx = new Set();
  for (let i = 0; i < protoCount; i++) {
    let idx;
    do { idx = Math.floor(rng() * PROTOCOLS.length); } while (usedIdx.has(idx));
    usedIdx.add(idx);
    selectedProtos.push(PROTOCOLS[idx]);
  }
  const totalWeight = selectedProtos.reduce((s, p) => s + p.weight, 0);
  const protocolProfile = selectedProtos.map(p => ({
    protocol: p.name,
    port: p.port,
    percentage: +((p.weight / totalWeight) * 100).toFixed(1),
    avgBytesPerSession: Math.floor(rng() * 1e6 + 1e3),
  }));

  // 通信对端画像（常见对端）
  const peerCount = Math.floor(rng() * 15) + 3;
  const regularPeers = Array.from({ length: peerCount }, () => {
    const isExternal = rng() > 0.5;
    return {
      ip: isExternal ? randomExternalIP(rng) : randomCampusIP(rng),
      type: isExternal ? 'external' : 'internal',
      frequency: +(rng() * 100).toFixed(1), // 每天通信次数
      avgBytes: Math.floor(rng() * 1e7 + 1e4),
      protocol: selectedProtos[Math.floor(rng() * selectedProtos.length)].name,
    };
  }).sort((a, b) => b.frequency - a.frequency);

  // 时间活跃画像
  const activeHourDistribution = Array.from({ length: 24 }, (_, h) => {
    const isActive = h >= (12 - profile.activeHours / 2) && h < (12 + profile.activeHours / 2);
    return isActive ? +(0.5 + rng() * 0.5).toFixed(2) : +(rng() * 0.1).toFixed(2);
  });

  return {
    ip,
    deviceType,
    deviceLabel: profile.label,
    trafficPattern: profile.trafficPattern,
    baseline: {
      hourlyTraffic: hourlyBaseline,
      totalDailyBytes: hourlyBaseline.reduce((s, h) => s + h.avgBytes, 0),
      protocolProfile,
      protocolEntropy: shannonEntropy(protocolProfile.map(p => p.percentage)),
      regularPeers,
      peerCount,
      peerStability: profile.peerStability,
      activeHourDistribution,
      inboundRatio: profile.inboundRatio,
    },
  };
}

/**
 * 计算行为偏差评分
 * 将当前行为与基线对比，输出0-100偏差分
 */
function calculateDeviation(ip, currentBehavior) {
  const baseline = generateIPBaseline(ip);
  const b = baseline.baseline;
  const deviations = {};

  // 1. 流量偏差 (0-30)
  const hour = new Date().getHours();
  const hourBase = b.hourlyTraffic[hour];
  if (hourBase.avgBytes > 0 && currentBehavior.currentBytes) {
    const zScore = Math.abs(currentBehavior.currentBytes - hourBase.avgBytes) / (hourBase.stdBytes || 1);
    deviations.traffic = { score: Math.min(30, Math.round(zScore * 8)), zScore: +zScore.toFixed(2) };
  } else {
    deviations.traffic = { score: 0, zScore: 0 };
  }

  // 2. 协议偏差 (0-25)
  if (currentBehavior.protocols) {
    const baselineVec = b.protocolProfile.map(p => p.percentage);
    const currentVec = b.protocolProfile.map(bp => {
      const match = currentBehavior.protocols.find(cp => cp.protocol === bp.protocol);
      return match ? match.percentage : 0;
    });
    const similarity = cosineSimilarity(baselineVec, currentVec);
    deviations.protocol = { score: Math.round((1 - similarity) * 25), similarity };
  } else {
    deviations.protocol = { score: 0, similarity: 1 };
  }

  // 3. 对端偏差 (0-25)
  if (currentBehavior.peers) {
    const knownPeerIPs = new Set(b.regularPeers.map(p => p.ip));
    const unknownPeers = currentBehavior.peers.filter(p => !knownPeerIPs.has(p.ip));
    const unknownRatio = currentBehavior.peers.length > 0
      ? unknownPeers.length / currentBehavior.peers.length : 0;
    deviations.peer = {
      score: Math.min(25, Math.round(unknownRatio * 25 + unknownPeers.length * 0.5)),
      unknownPeers: unknownPeers.length,
      unknownRatio: +unknownRatio.toFixed(2),
    };
  } else {
    deviations.peer = { score: 0, unknownPeers: 0, unknownRatio: 0 };
  }

  // 4. 时间偏差 (0-20)
  const activeProb = b.activeHourDistribution[hour];
  const isCurrentlyActive = (currentBehavior.currentBytes || 0) > 0;
  if (isCurrentlyActive && activeProb < 0.1) {
    deviations.temporal = { score: 20, note: '非常规活跃时段出现活动' };
  } else if (!isCurrentlyActive && activeProb > 0.8) {
    deviations.temporal = { score: 10, note: '常规活跃时段无活动' };
  } else {
    deviations.temporal = { score: 0, note: '时间模式正常' };
  }

  const totalScore = Object.values(deviations).reduce((s, d) => s + d.score, 0);

  return {
    ip,
    deviceType: baseline.deviceType,
    deviceLabel: baseline.deviceLabel,
    deviationScore: Math.min(100, totalScore),
    level: totalScore >= 70 ? 'critical' : totalScore >= 50 ? 'high' : totalScore >= 30 ? 'medium' : 'normal',
    deviations,
    baseline: {
      expectedBytes: hourBase.avgBytes,
      expectedProtocols: b.protocolProfile.map(p => p.protocol),
      knownPeerCount: b.regularPeers.length,
      normalActiveHour: activeProb > 0.5,
    },
  };
}

/**
 * 批量IP画像生成
 */
function batchIPProfiling(count = 20) {
  const rng = seededRandom(Date.now());
  const profiles = [];

  for (let i = 0; i < count; i++) {
    const ip = randomCampusIP(rng);
    const profile = generateIPBaseline(ip);

    // 模拟当前行为
    const hour = new Date().getHours();
    const hourBase = profile.baseline.hourlyTraffic[hour];
    const anomalyChance = rng();
    const currentBytes = anomalyChance > 0.85
      ? hourBase.avgBytes * (3 + rng() * 5) // 异常高
      : hourBase.avgBytes * (0.8 + rng() * 0.4); // 正常范围

    const deviation = calculateDeviation(ip, { currentBytes });

    profiles.push({
      ip,
      deviceType: profile.deviceType,
      deviceLabel: profile.deviceLabel,
      dailyBytes: profile.baseline.totalDailyBytes,
      protocolCount: profile.baseline.protocolProfile.length,
      peerCount: profile.baseline.peerCount,
      deviationScore: deviation.deviationScore,
      level: deviation.level,
    });
  }

  return profiles.sort((a, b) => b.deviationScore - a.deviationScore);
}

module.exports = {
  DEVICE_PROFILES,
  shannonEntropy,
  cosineSimilarity,
  generateIPBaseline,
  calculateDeviation,
  batchIPProfiling,
};
