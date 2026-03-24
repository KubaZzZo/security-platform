/**
 * 流量数据生成器 - 基于算法模拟校园网10Gbps+链路流量
 *
 * 算法说明：
 * - 泊松过程：模拟数据包到达
 * - 正弦波+噪声：模拟日间流量波动（上课高峰/夜间低谷）
 * - Zipf分布：模拟协议流行度分布
 * - Pareto分布：模拟流大小分布（少量大流+大量小流）
 */

// 校园网IP池 (10.0.0.0/8 子网)
const CAMPUS_SUBNETS = [
  '10.1.', '10.2.', '10.3.', '10.4.', '10.5.',
  '10.10.', '10.20.', '10.30.', '10.50.', '10.100.'
];

// 协议定义（15种常见校园网协议）
const PROTOCOLS = [
  { name: 'HTTPS', port: 443, weight: 35, category: 'Web' },
  { name: 'HTTP', port: 80, weight: 20, category: 'Web' },
  { name: 'DNS', port: 53, weight: 12, category: '基础服务' },
  { name: 'SSH', port: 22, weight: 5, category: '远程管理' },
  { name: 'IMAP', port: 143, weight: 4, category: '邮件' },
  { name: 'SMTP', port: 25, weight: 3.5, category: '邮件' },
  { name: 'POP3', port: 110, weight: 2.5, category: '邮件' },
  { name: 'FTP', port: 21, weight: 3, category: '文件传输' },
  { name: 'SNMP', port: 161, weight: 2, category: '网络管理' },
  { name: 'NTP', port: 123, weight: 2, category: '基础服务' },
  { name: 'DHCP', port: 67, weight: 2, category: '基础服务' },
  { name: 'LDAP', port: 389, weight: 1.5, category: '认证' },
  { name: 'MySQL', port: 3306, weight: 2, category: '数据库' },
  { name: 'RDP', port: 3389, weight: 3, category: '远程管理' },
  { name: 'Telnet', port: 23, weight: 0.5, category: '远程管理' },
  { name: 'QUIC', port: 443, weight: 2, category: 'Web' },
];

// ============ 核心算法 ============

/** 伪随机种子生成器（可复现） */
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/** 泊松分布随机数 */
function poissonRandom(lambda, rng) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

/** 高斯随机数 (Box-Muller) */
function gaussianRandom(mean, stddev, rng) {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
  return mean + stddev * z;
}

/** 日间流量模式：正弦波叠加模拟校园作息 */
function getDailyTrafficMultiplier(hour) {
  // 基础正弦波（白天高、夜间低）
  const base = 0.5 + 0.4 * Math.sin((hour - 6) * Math.PI / 12);
  // 上课高峰叠加 (8-10点, 14-16点)
  const morningPeak = Math.exp(-Math.pow(hour - 9, 2) / 2) * 0.3;
  const afternoonPeak = Math.exp(-Math.pow(hour - 15, 2) / 2) * 0.25;
  // 晚间自习 (19-22点)
  const eveningStudy = Math.exp(-Math.pow(hour - 20.5, 2) / 3) * 0.2;
  // 深夜低谷 (0-6点)
  const nightDip = hour < 6 ? -0.3 * (1 - hour / 6) : 0;
  return Math.max(0.05, base + morningPeak + afternoonPeak + eveningStudy + nightDip);
}

/** Zipf分布选择协议 */
function zipfSelect(items, rng) {
  const totalWeight = items.reduce((s, p) => s + p.weight, 0);
  let r = rng() * totalWeight;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[0];
}

/** 生成随机校园IP */
function randomCampusIP(rng) {
  const subnet = CAMPUS_SUBNETS[Math.floor(rng() * CAMPUS_SUBNETS.length)];
  return subnet + Math.floor(rng() * 254 + 1) + '.' + Math.floor(rng() * 254 + 1);
}

/** 生成外部IP */
function randomExternalIP(rng) {
  const ranges = ['202.', '114.', '183.', '220.', '61.', '123.', '218.', '180.'];
  const prefix = ranges[Math.floor(rng() * ranges.length)];
  return prefix + Math.floor(rng() * 254 + 1) + '.' +
    Math.floor(rng() * 254 + 1) + '.' + Math.floor(rng() * 254 + 1);
}

// ============ 数据生成函数 ============

/** 生成秒级实时流量数据（模拟10Gbps链路） */
function generateRealtimeTraffic(seconds = 60) {
  const now = Date.now();
  const rng = seededRandom(Math.floor(now / 10000));
  const hour = new Date().getHours();
  const multiplier = getDailyTrafficMultiplier(hour);
  const BASE_BPS = 10 * 1024 * 1024 * 1024; // 10Gbps基线
  const points = [];

  for (let i = 0; i < seconds; i++) {
    const ts = new Date(now - (seconds - i) * 1000).toISOString();
    const noise = gaussianRandom(0, 0.08, rng);
    const burst = rng() > 0.95 ? gaussianRandom(0.3, 0.1, rng) : 0;
    const factor = multiplier * (1 + noise + burst);

    const inBytes = Math.floor(BASE_BPS * factor * (0.55 + rng() * 0.1) / 8);
    const outBytes = Math.floor(BASE_BPS * factor * (0.35 + rng() * 0.1) / 8);
    const inPackets = Math.floor(inBytes / (400 + rng() * 800));
    const outPackets = Math.floor(outBytes / (400 + rng() * 800));

    points.push({
      timestamp: ts,
      inbound: { bytes: inBytes, packets: inPackets, bps: inBytes * 8 },
      outbound: { bytes: outBytes, packets: outPackets, bps: outBytes * 8 },
      total: {
        bytes: inBytes + outBytes,
        packets: inPackets + outPackets,
        bps: (inBytes + outBytes) * 8
      }
    });
  }
  return points;
}

/** 生成吞吐量趋势（24小时，每5分钟一个点） */
function generateThroughputTrend(date) {
  const rng = seededRandom(date ? new Date(date).getTime() : Date.now());
  const BASE_BPS = 10 * 1024 * 1024 * 1024;
  const points = [];

  for (let m = 0; m < 24 * 60; m += 5) {
    const hour = m / 60;
    const multiplier = getDailyTrafficMultiplier(hour);
    const noise = gaussianRandom(0, 0.05, rng);
    const factor = multiplier * (1 + noise);
    const hh = String(Math.floor(hour)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');

    points.push({
      time: `${hh}:${mm}`,
      inboundBytes: Math.floor(BASE_BPS * factor * 0.55 / 8),
      outboundBytes: Math.floor(BASE_BPS * factor * 0.38 / 8),
      inboundPackets: Math.floor(BASE_BPS * factor * 0.55 / 8 / 600),
      outboundPackets: Math.floor(BASE_BPS * factor * 0.38 / 8 / 600),
    });
  }
  return points;
}

/** 生成协议分布（Zipf分布） */
function generateProtocolDistribution() {
  const rng = seededRandom(Date.now());
  const hour = new Date().getHours();
  const multiplier = getDailyTrafficMultiplier(hour);
  const BASE_TOTAL = 10 * 1024 * 1024 * 1024 * multiplier / 8;

  return PROTOCOLS.map(p => {
    const share = (p.weight / 100) * (1 + gaussianRandom(0, 0.1, rng));
    const bytes = Math.floor(BASE_TOTAL * share);
    const packets = Math.floor(bytes / (300 + Math.random() * 900));
    return {
      protocol: p.name,
      port: p.port,
      category: p.category,
      bytes, packets,
      percentage: +(share * 100).toFixed(2),
      connections: Math.floor(packets * (0.01 + Math.random() * 0.05)),
    };
  }).sort((a, b) => b.bytes - a.bytes);
}

/** 生成热点业务/应用排行 */
function generateHotspotServices() {
  const rng = seededRandom(Date.now());
  const services = [
    { name: '教务系统', domain: 'jwxt.edu.cn', proto: 'HTTPS' },
    { name: '图书馆系统', domain: 'lib.edu.cn', proto: 'HTTPS' },
    { name: '邮件系统', domain: 'mail.edu.cn', proto: 'IMAP' },
    { name: '视频教学平台', domain: 'mooc.edu.cn', proto: 'HTTPS' },
    { name: 'VPN接入', domain: 'vpn.edu.cn', proto: 'HTTPS' },
    { name: 'DNS服务', domain: 'dns.edu.cn', proto: 'DNS' },
    { name: '科研数据平台', domain: 'data.edu.cn', proto: 'HTTPS' },
    { name: 'OA办公系统', domain: 'oa.edu.cn', proto: 'HTTPS' },
    { name: '校园网认证', domain: 'auth.edu.cn', proto: 'HTTP' },
    { name: 'FTP文件服务', domain: 'ftp.edu.cn', proto: 'FTP' },
  ];

  return services.map((s, i) => {
    const base = Math.pow(0.7, i) * 2e9;
    const bytes = Math.floor(base * (1 + gaussianRandom(0, 0.15, rng)));
    return {
      ...s,
      bytes, packets: Math.floor(bytes / 700),
      connections: Math.floor(1000 * Math.pow(0.75, i) * (1 + rng() * 0.3)),
      users: Math.floor(500 * Math.pow(0.8, i) * (1 + rng() * 0.2)),
      trend: +(gaussianRandom(0, 15, rng)).toFixed(1), // 变化百分比
    };
  });
}

/** 生成Top流量IP排行 */
function generateTopTalkers(limit = 20) {
  const rng = seededRandom(Date.now());
  const talkers = [];

  for (let i = 0; i < limit; i++) {
    const ip = randomCampusIP(rng);
    const base = Math.pow(0.82, i) * 5e8;
    const bytes = Math.floor(base * (1 + gaussianRandom(0, 0.1, rng)));
    const proto = zipfSelect(PROTOCOLS, rng);

    talkers.push({
      rank: i + 1,
      ip,
      hostname: `host-${ip.split('.').slice(2).join('-')}`,
      department: ['计算机学院', '信息学院', '图书馆', '行政楼', '学生宿舍', '实验中心'][Math.floor(rng() * 6)],
      bytes, packets: Math.floor(bytes / 650),
      topProtocol: proto.name,
      connections: Math.floor(100 * Math.pow(0.85, i) * (1 + rng() * 0.5)),
      riskLevel: rng() > 0.8 ? 'high' : rng() > 0.5 ? 'medium' : 'low',
    });
  }
  return talkers;
}

module.exports = {
  PROTOCOLS,
  generateRealtimeTraffic,
  generateThroughputTrend,
  generateProtocolDistribution,
  generateHotspotServices,
  generateTopTalkers,
  randomCampusIP,
  randomExternalIP,
  seededRandom,
  gaussianRandom,
  poissonRandom,
  zipfSelect,
  getDailyTrafficMultiplier,
};
