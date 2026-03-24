/**
 * 安全威胁检测生成器 - 模拟4+种典型网络威胁
 *
 * 检测算法：
 * - 扫描攻击：端口扫描（短时间内访问大量端口）/ IP扫描（横向扫描子网）
 * - 钓鱼攻击：可疑DNS查询 + 邮件钓鱼特征
 * - 蠕虫攻击：指数级连接扩散模式
 * - DDoS攻击：多源单目标高频流量
 * - 暴力破解：短时间内大量认证失败
 */

const {
  seededRandom, gaussianRandom, randomCampusIP, randomExternalIP
} = require('./trafficGenerator');

// 威胁类型定义
const THREAT_TYPES = {
  PORT_SCAN: { code: 'PORT_SCAN', name: '端口扫描', severity: 'medium', category: '扫描攻击' },
  IP_SWEEP: { code: 'IP_SWEEP', name: 'IP扫描', severity: 'medium', category: '扫描攻击' },
  PHISHING_DNS: { code: 'PHISHING_DNS', name: 'DNS钓鱼', severity: 'high', category: '钓鱼攻击' },
  PHISHING_EMAIL: { code: 'PHISHING_EMAIL', name: '邮件钓鱼', severity: 'high', category: '钓鱼攻击' },
  WORM_SPREAD: { code: 'WORM_SPREAD', name: '蠕虫传播', severity: 'critical', category: '蠕虫攻击' },
  DDOS_SYN: { code: 'DDOS_SYN', name: 'SYN洪泛', severity: 'critical', category: 'DDoS攻击' },
  DDOS_UDP: { code: 'DDOS_UDP', name: 'UDP洪泛', severity: 'critical', category: 'DDoS攻击' },
  BRUTE_FORCE: { code: 'BRUTE_FORCE', name: '暴力破解', severity: 'high', category: '暴力破解' },
};

// 已知钓鱼域名模式
const PHISHING_DOMAINS = [
  'edu-verify.xyz', 'campus-login.tk', 'mail-update.cc',
  'student-aid.ml', 'library-renew.ga', 'vpn-portal.cf',
  'grade-check.top', 'scholarship-app.buzz', 'wifi-auth.icu',
  'exam-result.work',
];

// ============ 威胁生成算法 ============

/** 生成端口扫描事件 */
function generatePortScan(rng, baseTime) {
  const srcIP = randomExternalIP(rng);
  const dstIP = randomCampusIP(rng);
  const startPort = Math.floor(rng() * 1000) + 1;
  const portCount = Math.floor(rng() * 200) + 50;
  const duration = Math.floor(rng() * 30) + 5; // 5-35秒内扫描

  return {
    id: `PS-${Date.now()}-${Math.floor(rng() * 10000)}`,
    type: THREAT_TYPES.PORT_SCAN,
    timestamp: new Date(baseTime - Math.floor(rng() * 3600000)).toISOString(),
    srcIP,
    dstIP,
    detail: {
      startPort,
      endPort: startPort + portCount,
      portsScanned: portCount,
      duration: `${duration}s`,
      technique: rng() > 0.5 ? 'SYN扫描' : 'TCP全连接扫描',
      packetsPerSecond: Math.floor(portCount / duration),
    },
    status: rng() > 0.3 ? 'detected' : 'blocked',
  };
}

/** 生成IP扫描事件 */
function generateIPSweep(rng, baseTime) {
  const srcIP = randomExternalIP(rng);
  const subnet = `10.${Math.floor(rng() * 50 + 1)}.${Math.floor(rng() * 254 + 1)}`;
  const hostsScanned = Math.floor(rng() * 200) + 30;
  const targetPort = [22, 80, 443, 3389, 3306][Math.floor(rng() * 5)];

  return {
    id: `IS-${Date.now()}-${Math.floor(rng() * 10000)}`,
    type: THREAT_TYPES.IP_SWEEP,
    timestamp: new Date(baseTime - Math.floor(rng() * 3600000)).toISOString(),
    srcIP,
    dstIP: `${subnet}.0/24`,
    detail: {
      subnet: `${subnet}.0/24`,
      hostsScanned,
      targetPort,
      hostsAlive: Math.floor(hostsScanned * (0.3 + rng() * 0.4)),
      duration: `${Math.floor(hostsScanned * 0.2)}s`,
    },
    status: 'detected',
  };
}

/** 生成钓鱼攻击事件 */
function generatePhishing(rng, baseTime) {
  const isEmail = rng() > 0.5;
  const victimIP = randomCampusIP(rng);
  const domain = PHISHING_DOMAINS[Math.floor(rng() * PHISHING_DOMAINS.length)];

  if (isEmail) {
    return {
      id: `PE-${Date.now()}-${Math.floor(rng() * 10000)}`,
      type: THREAT_TYPES.PHISHING_EMAIL,
      timestamp: new Date(baseTime - Math.floor(rng() * 7200000)).toISOString(),
      srcIP: randomExternalIP(rng),
      dstIP: victimIP,
      detail: {
        subject: ['账号验证通知', '奖学金申请确认', '密码过期提醒', '成绩查询通知', '图书馆欠费通知'][Math.floor(rng() * 5)],
        sender: `admin@${domain}`,
        recipients: Math.floor(rng() * 50) + 1,
        maliciousURL: `https://${domain}/verify?token=${Math.floor(rng() * 1e8)}`,
        attachmentHash: rng() > 0.6 ? `SHA256:${Array.from({ length: 16 }, () => Math.floor(rng() * 16).toString(16)).join('')}...` : null,
      },
      status: rng() > 0.4 ? 'detected' : 'blocked',
    };
  }

  return {
    id: `PD-${Date.now()}-${Math.floor(rng() * 10000)}`,
    type: THREAT_TYPES.PHISHING_DNS,
    timestamp: new Date(baseTime - Math.floor(rng() * 7200000)).toISOString(),
    srcIP: victimIP,
    dstIP: '10.0.0.1',
    detail: {
      queryDomain: domain,
      queryType: 'A',
      resolvedIP: randomExternalIP(rng),
      matchedRule: '钓鱼域名黑名单',
      confidence: +(0.85 + rng() * 0.15).toFixed(2),
    },
    status: 'blocked',
  };
}

/** 生成蠕虫传播事件 */
function generateWormSpread(rng, baseTime) {
  const patientZero = randomCampusIP(rng);
  const infectedCount = Math.floor(rng() * 30) + 5;
  const infected = [patientZero];
  for (let i = 1; i < infectedCount; i++) {
    infected.push(randomCampusIP(rng));
  }
  const targetPort = [445, 139, 135, 22, 3389][Math.floor(rng() * 5)];

  return {
    id: `WM-${Date.now()}-${Math.floor(rng() * 10000)}`,
    type: THREAT_TYPES.WORM_SPREAD,
    timestamp: new Date(baseTime - Math.floor(rng() * 1800000)).toISOString(),
    srcIP: patientZero,
    dstIP: `${infected.length}台主机`,
    detail: {
      patientZero,
      infectedHosts: infected.slice(0, 10),
      totalInfected: infectedCount,
      targetPort,
      propagationRate: `${Math.floor(infectedCount / (rng() * 10 + 2))}/min`,
      wormSignature: `WORM-${['Conficker', 'WannaCry', 'Mirai', 'Emotet'][Math.floor(rng() * 4)]}-variant`,
      connectionsPerHost: Math.floor(rng() * 500) + 100,
    },
    status: 'detected',
  };
}

/** 生成DDoS攻击事件 */
function generateDDoS(rng, baseTime) {
  const isSYN = rng() > 0.4;
  const targetIP = randomCampusIP(rng);
  const sourceCount = Math.floor(rng() * 500) + 50;
  const sources = [];
  for (let i = 0; i < Math.min(sourceCount, 20); i++) {
    sources.push(randomExternalIP(rng));
  }
  const peakBps = Math.floor((rng() * 8 + 2) * 1024 * 1024 * 1024); // 2-10Gbps

  return {
    id: `DD-${Date.now()}-${Math.floor(rng() * 10000)}`,
    type: isSYN ? THREAT_TYPES.DDOS_SYN : THREAT_TYPES.DDOS_UDP,
    timestamp: new Date(baseTime - Math.floor(rng() * 3600000)).toISOString(),
    srcIP: `${sourceCount}个源IP`,
    dstIP: targetIP,
    detail: {
      targetIP,
      targetPort: isSYN ? [80, 443, 8080][Math.floor(rng() * 3)] : Math.floor(rng() * 65535),
      sourceCount,
      sampleSources: sources,
      peakBps,
      peakPps: Math.floor(peakBps / (isSYN ? 60 : 800)),
      peakBpsFormatted: `${(peakBps / 1e9).toFixed(2)} Gbps`,
      duration: `${Math.floor(rng() * 120) + 30}s`,
      attackVector: isSYN ? 'SYN Flood' : 'UDP Flood',
    },
    status: rng() > 0.5 ? 'mitigating' : 'mitigated',
  };
}

/** 生成暴力破解事件 */
function generateBruteForce(rng, baseTime) {
  const srcIP = randomExternalIP(rng);
  const dstIP = randomCampusIP(rng);
  const attempts = Math.floor(rng() * 5000) + 100;
  const service = ['SSH', 'RDP', 'FTP', 'MySQL', 'SMTP'][Math.floor(rng() * 5)];
  const ports = { SSH: 22, RDP: 3389, FTP: 21, MySQL: 3306, SMTP: 25 };

  return {
    id: `BF-${Date.now()}-${Math.floor(rng() * 10000)}`,
    type: THREAT_TYPES.BRUTE_FORCE,
    timestamp: new Date(baseTime - Math.floor(rng() * 3600000)).toISOString(),
    srcIP,
    dstIP,
    detail: {
      service,
      port: ports[service],
      attempts,
      successfulLogin: rng() > 0.85,
      usernames: ['admin', 'root', 'test', 'user', 'student'].slice(0, Math.floor(rng() * 4) + 1),
      duration: `${Math.floor(attempts / (rng() * 50 + 10))}s`,
      attemptsPerSecond: Math.floor(rng() * 50) + 10,
    },
    status: rng() > 0.6 ? 'blocked' : 'detected',
  };
}

// ============ 聚合函数 ============

/** 生成安全日志列表 */
function generateSecurityLogs(count = 50) {
  const rng = seededRandom(Date.now());
  const now = Date.now();
  const generators = [
    generatePortScan, generateIPSweep, generatePhishing,
    generateWormSpread, generateDDoS, generateBruteForce,
  ];
  const logs = [];

  for (let i = 0; i < count; i++) {
    const gen = generators[Math.floor(rng() * generators.length)];
    logs.push(gen(rng, now));
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/** 生成威胁统计 */
function generateThreatStats() {
  const rng = seededRandom(Date.now());
  const categories = ['扫描攻击', '钓鱼攻击', '蠕虫攻击', 'DDoS攻击', '暴力破解'];

  return {
    total24h: Math.floor(rng() * 200) + 80,
    blocked24h: Math.floor(rng() * 150) + 50,
    critical: Math.floor(rng() * 15) + 3,
    byCategory: categories.map(cat => ({
      category: cat,
      count: Math.floor(rng() * 50) + 5,
      blocked: Math.floor(rng() * 40) + 3,
      trend: +(gaussianRandom(0, 20, rng)).toFixed(1),
    })),
    topAttackers: Array.from({ length: 10 }, (_, i) => ({
      ip: randomExternalIP(rng),
      attacks: Math.floor(50 * Math.pow(0.75, i) * (1 + rng() * 0.3)),
      types: categories.slice(0, Math.floor(rng() * 3) + 1),
      country: ['美国', '俄罗斯', '荷兰', '德国', '巴西', '印度', '韩国', '日本'][Math.floor(rng() * 8)],
    })),
    topTargets: Array.from({ length: 10 }, (_, i) => ({
      ip: randomCampusIP(rng),
      attacks: Math.floor(30 * Math.pow(0.8, i) * (1 + rng() * 0.3)),
      department: ['服务器区', '教务系统', '图书馆', '学生宿舍', '实验中心'][Math.floor(rng() * 5)],
    })),
  };
}

/** 生成威胁时间线（24小时） */
function generateThreatTimeline() {
  const rng = seededRandom(Date.now());
  const points = [];

  for (let h = 0; h < 24; h++) {
    const base = 5 + Math.sin((h - 3) * Math.PI / 12) * 8;
    points.push({
      hour: `${String(h).padStart(2, '0')}:00`,
      scan: Math.max(0, Math.floor(base * 0.35 + gaussianRandom(0, 2, rng))),
      phishing: Math.max(0, Math.floor(base * 0.25 + gaussianRandom(0, 1.5, rng))),
      worm: Math.max(0, Math.floor(base * 0.1 + gaussianRandom(0, 1, rng))),
      ddos: Math.max(0, Math.floor(base * 0.15 + gaussianRandom(0, 1.5, rng))),
      bruteForce: Math.max(0, Math.floor(base * 0.15 + gaussianRandom(0, 1, rng))),
    });
  }
  return points;
}

/** 生成单IP安全事件 */
function generateIPSecurityEvents(ip, count = 20) {
  const rng = seededRandom(ip.split('.').reduce((a, b) => a + parseInt(b), 0));
  const now = Date.now();
  const events = [];
  const generators = [generatePortScan, generatePhishing, generateBruteForce];

  for (let i = 0; i < count; i++) {
    const gen = generators[Math.floor(rng() * generators.length)];
    const event = gen(rng, now);
    event.dstIP = ip;
    events.push(event);
  }
  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

module.exports = {
  THREAT_TYPES,
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
};
