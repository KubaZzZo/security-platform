/**
 * 深度包检测 (DPI) 模拟引擎
 *
 * 超越端口号的应用识别：
 * - 应用指纹库：基于流量行为特征识别应用
 * - TLS/JA3 指纹模拟：SSL/TLS 握手特征匹配
 * - 应用行为分类：按用途分类（教学/办公/娱乐/安全风险）
 * - 内容类型检测：识别传输内容类型
 * - 协议合规检测：检测协议滥用与隧道行为
 */

const { seededRandom, gaussianRandom } = require('../trafficGenerator');

// ============ 应用指纹库 ============

const APP_FINGERPRINTS = [
  // 教学类
  { id: 'APP_001', name: '教务管理系统', category: '教学', subCategory: '教务',
    signatures: { ports: [443, 8080], tls: true, avgPacketSize: 850, burstPattern: 'request-response' },
    risk: 'none', bandwidth: 'low' },
  { id: 'APP_002', name: 'Moodle/学习平台', category: '教学', subCategory: '在线学习',
    signatures: { ports: [443], tls: true, avgPacketSize: 1200, burstPattern: 'streaming' },
    risk: 'none', bandwidth: 'medium' },
  { id: 'APP_003', name: '视频会议(腾讯会议)', category: '教学', subCategory: '视频会议',
    signatures: { ports: [443, 8000], tls: true, avgPacketSize: 1100, burstPattern: 'continuous', protocol: 'QUIC' },
    risk: 'none', bandwidth: 'high' },
  { id: 'APP_004', name: '在线考试系统', category: '教学', subCategory: '考试',
    signatures: { ports: [443], tls: true, avgPacketSize: 600, burstPattern: 'periodic' },
    risk: 'none', bandwidth: 'low' },

  // 办公类
  { id: 'APP_010', name: 'OA办公系统', category: '办公', subCategory: '协同办公',
    signatures: { ports: [443, 80], tls: true, avgPacketSize: 750, burstPattern: 'request-response' },
    risk: 'none', bandwidth: 'low' },
  { id: 'APP_011', name: '企业邮箱', category: '办公', subCategory: '邮件',
    signatures: { ports: [143, 993, 25, 465], tls: true, avgPacketSize: 2000, burstPattern: 'burst' },
    risk: 'none', bandwidth: 'medium' },
  { id: 'APP_012', name: 'VPN接入', category: '办公', subCategory: '远程接入',
    signatures: { ports: [443, 1194, 500], tls: true, avgPacketSize: 1400, burstPattern: 'continuous' },
    risk: 'low', bandwidth: 'high' },

  // 科研类
  { id: 'APP_020', name: '知网/学术数据库', category: '科研', subCategory: '文献检索',
    signatures: { ports: [443, 80], tls: true, avgPacketSize: 5000, burstPattern: 'download' },
    risk: 'none', bandwidth: 'medium' },
  { id: 'APP_021', name: 'Git/代码仓库', category: '科研', subCategory: '代码管理',
    signatures: { ports: [22, 443], tls: true, avgPacketSize: 1500, burstPattern: 'burst' },
    risk: 'none', bandwidth: 'low' },

  // 娱乐类（可能需要管控）
  { id: 'APP_030', name: '在线视频(B站/优酷)', category: '娱乐', subCategory: '视频流媒体',
    signatures: { ports: [443, 80], tls: true, avgPacketSize: 1400, burstPattern: 'streaming' },
    risk: 'low', bandwidth: 'very_high' },
  { id: 'APP_031', name: '网络游戏', category: '娱乐', subCategory: '游戏',
    signatures: { ports: [443, 8000, 9000], tls: false, avgPacketSize: 200, burstPattern: 'continuous' },
    risk: 'low', bandwidth: 'medium' },
  { id: 'APP_032', name: '社交媒体(微信/QQ)', category: '社交', subCategory: '即时通讯',
    signatures: { ports: [443, 8080, 14000], tls: true, avgPacketSize: 500, burstPattern: 'periodic' },
    risk: 'none', bandwidth: 'low' },
  { id: 'APP_033', name: '短视频(抖音/快手)', category: '娱乐', subCategory: '短视频',
    signatures: { ports: [443], tls: true, avgPacketSize: 1350, burstPattern: 'streaming' },
    risk: 'low', bandwidth: 'very_high' },

  // 安全风险类
  { id: 'APP_040', name: 'Tor匿名网络', category: '安全风险', subCategory: '匿名代理',
    signatures: { ports: [9001, 9030, 443], tls: true, avgPacketSize: 512, burstPattern: 'continuous' },
    risk: 'critical', bandwidth: 'medium' },
  { id: 'APP_041', name: 'P2P下载(BitTorrent)', category: '安全风险', subCategory: 'P2P',
    signatures: { ports: [6881, 6889, 51413], tls: false, avgPacketSize: 1400, burstPattern: 'continuous' },
    risk: 'high', bandwidth: 'very_high' },
  { id: 'APP_042', name: '代理工具(Shadowsocks)', category: '安全风险', subCategory: '加密代理',
    signatures: { ports: [1080, 8388, 443], tls: true, avgPacketSize: 1200, burstPattern: 'continuous' },
    risk: 'high', bandwidth: 'high' },
  { id: 'APP_043', name: 'DNS隧道', category: '安全风险', subCategory: '隧道',
    signatures: { ports: [53], tls: false, avgPacketSize: 250, burstPattern: 'periodic' },
    risk: 'critical', bandwidth: 'low' },
  { id: 'APP_044', name: 'ICMP隧道', category: '安全风险', subCategory: '隧道',
    signatures: { ports: [0], tls: false, avgPacketSize: 1000, burstPattern: 'periodic' },
    risk: 'critical', bandwidth: 'low' },
];

// TLS/JA3 指纹库
const JA3_FINGERPRINTS = [
  { hash: 'e7d705a3286e19ea42f587b344ee6865', app: 'Chrome 120+', os: 'Windows/macOS', risk: 'none' },
  { hash: 'b32309a26951912be7dba376398abc3b', app: 'Firefox 120+', os: 'Windows/macOS', risk: 'none' },
  { hash: '473cd7cb9faa642487833865d516e578', app: 'Safari 17+', os: 'macOS/iOS', risk: 'none' },
  { hash: 'a0e9f5d64349fb13191bc781f81f42e1', app: 'Python requests', os: 'Any', risk: 'medium' },
  { hash: 'c12f54a3f91dc7bafd92b1b4a4a7c8e2', app: 'curl/wget', os: 'Linux', risk: 'low' },
  { hash: 'd41d8cd98f00b204e9800998ecf8427e', app: 'Tor Browser', os: 'Any', risk: 'critical' },
  { hash: 'f09e1a2b3c4d5e6f7a8b9c0d1e2f3a4b', app: 'Cobalt Strike', os: 'Windows', risk: 'critical' },
  { hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', app: 'Metasploit', os: 'Any', risk: 'critical' },
  { hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', app: 'WeChat', os: 'Windows/Mobile', risk: 'none' },
  { hash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e', app: 'QQ', os: 'Windows/Mobile', risk: 'none' },
];

// ============ DPI 分析函数 ============

/**
 * 应用识别（基于多维特征匹配）
 * 不仅看端口，还看包大小、流量模式、TLS特征
 */
function identifyApplication(flowFeatures) {
  const { port, avgPacketSize, tls, burstPattern, bytesTotal } = flowFeatures;

  let bestMatch = null;
  let bestScore = 0;

  for (const app of APP_FINGERPRINTS) {
    let score = 0;
    const sig = app.signatures;

    // 端口匹配 (30%)
    if (sig.ports.includes(port)) score += 30;

    // TLS匹配 (15%)
    if (sig.tls === tls) score += 15;

    // 包大小相似度 (30%) — 高斯相似度
    const sizeDiff = Math.abs((avgPacketSize || 500) - sig.avgPacketSize);
    score += 30 * Math.exp(-sizeDiff * sizeDiff / (2 * 300 * 300));

    // 流量模式匹配 (25%)
    if (burstPattern === sig.burstPattern) score += 25;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = app;
    }
  }

  return {
    application: bestMatch,
    confidence: +(bestScore / 100).toFixed(2),
    matchScore: +bestScore.toFixed(1),
  };
}

/**
 * TLS/JA3 指纹分析
 */
function analyzeJA3(ja3Hash) {
  const match = JA3_FINGERPRINTS.find(f => f.hash === ja3Hash);
  if (match) {
    return { matched: true, ...match };
  }
  return { matched: false, hash: ja3Hash, app: 'Unknown', risk: 'medium', note: '未知TLS指纹，需人工分析' };
}

/**
 * 协议合规性检测
 * 检测协议滥用、隧道行为、异常使用
 */
function protocolComplianceCheck(flowData) {
  const violations = [];

  // DNS隧道检测：DNS查询长度异常
  if (flowData.protocol === 'DNS') {
    if (flowData.avgQueryLength > 50) {
      violations.push({
        type: 'DNS_TUNNEL_SUSPECT',
        severity: 'critical',
        description: 'DNS查询长度异常，疑似DNS隧道',
        evidence: `平均查询长度: ${flowData.avgQueryLength} 字节（正常<30）`,
        confidence: Math.min(0.95, flowData.avgQueryLength / 100),
      });
    }
    if (flowData.queryRate > 100) {
      violations.push({
        type: 'DNS_FLOOD',
        severity: 'high',
        description: 'DNS查询频率异常',
        evidence: `查询速率: ${flowData.queryRate}/s（正常<20）`,
        confidence: 0.85,
      });
    }
  }

  // HTTP协议合规
  if (flowData.protocol === 'HTTP') {
    if (flowData.port !== 80 && flowData.port !== 8080) {
      violations.push({
        type: 'HTTP_NON_STANDARD_PORT',
        severity: 'medium',
        description: `HTTP运行在非标准端口 ${flowData.port}`,
        evidence: `端口: ${flowData.port}`,
        confidence: 0.7,
      });
    }
  }

  // 加密流量在非标准端口
  if (flowData.tls && ![443, 8443, 993, 995, 465].includes(flowData.port)) {
    violations.push({
      type: 'TLS_NON_STANDARD_PORT',
      severity: 'medium',
      description: `加密流量使用非标准端口 ${flowData.port}`,
      evidence: `TLS on port ${flowData.port}`,
      confidence: 0.6,
    });
  }

  // 大流量单连接（可能是数据外泄）
  if (flowData.bytesOut > 1e9 && flowData.duration < 600) {
    violations.push({
      type: 'DATA_EXFILTRATION_SUSPECT',
      severity: 'critical',
      description: '短时间内大量数据外传，疑似数据泄露',
      evidence: `${(flowData.bytesOut / 1e9).toFixed(2)}GB in ${flowData.duration}s`,
      confidence: 0.75,
    });
  }

  return violations;
}

/**
 * 生成DPI分析报告（模拟）
 * 对一组流量进行完整DPI分析
 */
function generateDPIReport(flowCount = 100) {
  const rng = seededRandom(Date.now());
  const results = [];

  for (let i = 0; i < flowCount; i++) {
    const app = APP_FINGERPRINTS[Math.floor(rng() * APP_FINGERPRINTS.length)];
    const port = app.signatures.ports[Math.floor(rng() * app.signatures.ports.length)];
    const noise = gaussianRandom(0, 0.15, rng);

    const flow = {
      flowId: `FL-${Date.now()}-${i}`,
      srcIP: `10.${Math.floor(rng() * 50 + 1)}.${Math.floor(rng() * 254 + 1)}.${Math.floor(rng() * 254 + 1)}`,
      dstIP: `${Math.floor(rng() * 200 + 20)}.${Math.floor(rng() * 254 + 1)}.${Math.floor(rng() * 254 + 1)}.${Math.floor(rng() * 254 + 1)}`,
      port,
      protocol: app.signatures.tls ? 'HTTPS' : 'HTTP',
      tls: app.signatures.tls,
      avgPacketSize: Math.floor(app.signatures.avgPacketSize * (1 + noise)),
      burstPattern: app.signatures.burstPattern,
      bytesTotal: Math.floor(rng() * 1e8 + 1e4),
      duration: Math.floor(rng() * 3600 + 10),
    };

    const identification = identifyApplication(flow);
    const ja3 = app.signatures.tls
      ? analyzeJA3(JA3_FINGERPRINTS[Math.floor(rng() * JA3_FINGERPRINTS.length)].hash)
      : null;

    results.push({
      flow,
      identification,
      ja3Fingerprint: ja3,
      risk: app.risk,
      category: app.category,
    });
  }

  // 汇总统计
  const byCategory = {};
  const byRisk = { none: 0, low: 0, medium: 0, high: 0, critical: 0 };
  let totalBytes = 0;

  results.forEach(r => {
    const cat = r.category;
    if (!byCategory[cat]) byCategory[cat] = { count: 0, bytes: 0 };
    byCategory[cat].count++;
    byCategory[cat].bytes += r.flow.bytesTotal;
    byRisk[r.risk]++;
    totalBytes += r.flow.bytesTotal;
  });

  return {
    flows: results,
    summary: {
      totalFlows: flowCount,
      totalBytes,
      byCategory: Object.entries(byCategory).map(([name, data]) => ({
        name, ...data, percentage: +((data.bytes / totalBytes) * 100).toFixed(1),
      })).sort((a, b) => b.bytes - a.bytes),
      byRisk,
      highRiskFlows: results.filter(r => r.risk === 'high' || r.risk === 'critical'),
      avgConfidence: +(results.reduce((s, r) => s + r.identification.confidence, 0) / flowCount).toFixed(2),
    },
  };
}

module.exports = {
  APP_FINGERPRINTS,
  JA3_FINGERPRINTS,
  identifyApplication,
  analyzeJA3,
  protocolComplianceCheck,
  generateDPIReport,
};
