/**
 * 攻击链关联分析引擎
 *
 * 基于 Cyber Kill Chain 模型：
 * 侦察 → 武器化 → 投递 → 利用 → 安装 → C2通信 → 目标达成
 *
 * 功能：
 * - Kill Chain 阶段自动映射
 * - 时间-IP-类型多维事件聚类
 * - 攻击战役（Campaign）识别
 * - 关联规则引擎
 * - 攻击路径可视化数据
 */

// Kill Chain 阶段定义
const KILL_CHAIN_STAGES = [
  { stage: 1, id: 'reconnaissance', name: '侦察', description: '信息收集与目标探测', color: '#2196f3' },
  { stage: 2, id: 'weaponization', name: '武器化', description: '构造攻击载荷', color: '#9c27b0' },
  { stage: 3, id: 'delivery', name: '投递', description: '将载荷投递到目标', color: '#ff9800' },
  { stage: 4, id: 'exploitation', name: '利用', description: '触发漏洞利用', color: '#f44336' },
  { stage: 5, id: 'installation', name: '安装', description: '植入后门或恶意软件', color: '#e91e63' },
  { stage: 6, id: 'command_control', name: 'C2通信', description: '建立远程控制通道', color: '#9c27b0' },
  { stage: 7, id: 'actions', name: '目标达成', description: '数据窃取/破坏/横向移动', color: '#b71c1c' },
];

// 威胁类型 → Kill Chain 阶段映射规则
const THREAT_STAGE_MAP = {
  PORT_SCAN: 'reconnaissance',
  IP_SWEEP: 'reconnaissance',
  PHISHING_DNS: 'delivery',
  PHISHING_EMAIL: 'delivery',
  BRUTE_FORCE: 'exploitation',
  WORM_SPREAD: 'installation',
  DDOS_SYN: 'actions',
  DDOS_UDP: 'actions',
  // 扩展映射
  DNS_TUNNEL: 'command_control',
  REVERSE_SHELL: 'command_control',
  DATA_EXFIL: 'actions',
  PRIVILEGE_ESCALATION: 'exploitation',
  LATERAL_MOVEMENT: 'actions',
  MALWARE_DOWNLOAD: 'installation',
  EXPLOIT_ATTEMPT: 'exploitation',
  VULN_SCAN: 'reconnaissance',
};

// 关联规则：定义哪些事件序列构成攻击链
const CORRELATION_RULES = [
  {
    id: 'RULE_001',
    name: '扫描→暴力破解→蠕虫传播',
    description: '典型的自动化攻击链：先扫描发现目标，暴力破解获取权限，然后蠕虫横向传播',
    stages: ['reconnaissance', 'exploitation', 'installation'],
    threatSequence: [['PORT_SCAN', 'IP_SWEEP'], ['BRUTE_FORCE'], ['WORM_SPREAD']],
    timeWindowMinutes: 120,
    severity: 'critical',
  },
  {
    id: 'RULE_002',
    name: '钓鱼→恶意软件→C2',
    description: '社工攻击链：钓鱼邮件投递恶意载荷，建立C2通道',
    stages: ['delivery', 'installation', 'command_control'],
    threatSequence: [['PHISHING_EMAIL', 'PHISHING_DNS'], ['WORM_SPREAD'], ['DDOS_SYN']],
    timeWindowMinutes: 1440,
    severity: 'critical',
  },
  {
    id: 'RULE_003',
    name: '扫描→暴力破解',
    description: '端口扫描后针对开放服务进行暴力破解',
    stages: ['reconnaissance', 'exploitation'],
    threatSequence: [['PORT_SCAN'], ['BRUTE_FORCE']],
    timeWindowMinutes: 60,
    severity: 'high',
  },
  {
    id: 'RULE_004',
    name: '多源DDoS攻击',
    description: '来自多个源IP的分布式拒绝服务攻击',
    stages: ['actions'],
    threatSequence: [['DDOS_SYN', 'DDOS_UDP']],
    timeWindowMinutes: 30,
    severity: 'critical',
  },
  {
    id: 'RULE_005',
    name: '横向扫描→蠕虫扩散',
    description: '内网IP扫描后蠕虫快速传播',
    stages: ['reconnaissance', 'installation', 'actions'],
    threatSequence: [['IP_SWEEP'], ['WORM_SPREAD']],
    timeWindowMinutes: 60,
    severity: 'critical',
  },
];

/**
 * 将安全事件映射到 Kill Chain 阶段
 */
function mapToKillChain(events) {
  return events.map(event => {
    const threatCode = event.type?.code || event.threatCode || 'UNKNOWN';
    const stageId = THREAT_STAGE_MAP[threatCode] || 'reconnaissance';
    const stage = KILL_CHAIN_STAGES.find(s => s.id === stageId);

    return {
      ...event,
      killChain: {
        stageId: stage.id,
        stageName: stage.name,
        stageNumber: stage.stage,
        color: stage.color,
      },
    };
  });
}

/**
 * 时间-IP聚类算法
 * 将时间窗口内、涉及相同IP的事件聚为一组
 * @param {Array} events - 安全事件列表
 * @param {number} timeWindowMs - 时间窗口（毫秒）
 * @param {number} minEvents - 最小事件数
 */
function clusterEvents(events, timeWindowMs = 7200000, minEvents = 2) {
  if (events.length === 0) return [];

  // 按时间排序
  const sorted = [...events].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const clusters = [];
  const visited = new Set();

  for (let i = 0; i < sorted.length; i++) {
    if (visited.has(i)) continue;

    const cluster = [sorted[i]];
    visited.add(i);
    const baseTime = new Date(sorted[i].timestamp).getTime();
    const baseIPs = new Set([sorted[i].srcIP, sorted[i].dstIP]);

    for (let j = i + 1; j < sorted.length; j++) {
      if (visited.has(j)) continue;

      const eventTime = new Date(sorted[j].timestamp).getTime();
      if (eventTime - baseTime > timeWindowMs) break;

      // IP关联检查
      const hasIPOverlap = baseIPs.has(sorted[j].srcIP) || baseIPs.has(sorted[j].dstIP);
      if (hasIPOverlap) {
        cluster.push(sorted[j]);
        visited.add(j);
        baseIPs.add(sorted[j].srcIP);
        baseIPs.add(sorted[j].dstIP);
      }
    }

    if (cluster.length >= minEvents) {
      const timestamps = cluster.map(e => new Date(e.timestamp).getTime());
      const types = [...new Set(cluster.map(e => e.type?.code || 'UNKNOWN'))];
      const stages = [...new Set(cluster.map(e => THREAT_STAGE_MAP[e.type?.code] || 'reconnaissance'))];

      clusters.push({
        id: `CLU-${Date.now()}-${clusters.length}`,
        events: cluster,
        eventCount: cluster.length,
        involvedIPs: [...baseIPs],
        threatTypes: types,
        killChainStages: stages.sort((a, b) => {
          const sa = KILL_CHAIN_STAGES.find(s => s.id === a)?.stage || 0;
          const sb = KILL_CHAIN_STAGES.find(s => s.id === b)?.stage || 0;
          return sa - sb;
        }),
        timeRange: {
          start: new Date(Math.min(...timestamps)).toISOString(),
          end: new Date(Math.max(...timestamps)).toISOString(),
          durationMs: Math.max(...timestamps) - Math.min(...timestamps),
        },
        severity: stages.length >= 3 ? 'critical' : stages.length >= 2 ? 'high' : 'medium',
      });
    }
  }

  return clusters.sort((a, b) => b.eventCount - a.eventCount);
}

/**
 * 关联规则匹配
 * 检查事件序列是否匹配预定义的攻击链规则
 */
function matchCorrelationRules(events) {
  const matches = [];

  for (const rule of CORRELATION_RULES) {
    const windowMs = rule.timeWindowMinutes * 60 * 1000;

    // 按源IP分组检查
    const bySourceIP = {};
    events.forEach(e => {
      const ip = e.srcIP;
      if (!bySourceIP[ip]) bySourceIP[ip] = [];
      bySourceIP[ip].push(e);
    });

    for (const [ip, ipEvents] of Object.entries(bySourceIP)) {
      const sorted = ipEvents.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // 检查是否按顺序匹配规则中的威胁序列
      let seqIdx = 0;
      const matchedEvents = [];
      let firstTime = null;

      for (const event of sorted) {
        const code = event.type?.code || '';
        if (rule.threatSequence[seqIdx]?.includes(code)) {
          if (firstTime === null) firstTime = new Date(event.timestamp).getTime();

          const eventTime = new Date(event.timestamp).getTime();
          if (eventTime - firstTime <= windowMs) {
            matchedEvents.push(event);
            seqIdx++;
            if (seqIdx >= rule.threatSequence.length) break;
          }
        }
      }

      if (seqIdx >= rule.threatSequence.length) {
        matches.push({
          ruleId: rule.id,
          ruleName: rule.name,
          description: rule.description,
          severity: rule.severity,
          attackerIP: ip,
          matchedEvents,
          killChainCoverage: rule.stages,
          completeness: +(seqIdx / rule.threatSequence.length).toFixed(2),
        });
      }
    }
  }

  return matches.sort((a, b) => {
    const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (sevOrder[a.severity] || 3) - (sevOrder[b.severity] || 3);
  });
}

/**
 * 攻击战役识别
 * 将多个关联的攻击聚类识别为同一战役
 */
function identifyCampaigns(clusters) {
  if (clusters.length === 0) return [];

  const campaigns = [];
  const used = new Set();

  for (let i = 0; i < clusters.length; i++) {
    if (used.has(i)) continue;

    const campaign = {
      id: `CAMP-${Date.now()}-${campaigns.length}`,
      clusters: [clusters[i]],
      allIPs: new Set(clusters[i].involvedIPs),
      allTypes: new Set(clusters[i].threatTypes),
      allStages: new Set(clusters[i].killChainStages),
    };
    used.add(i);

    // 合并有IP重叠的聚类
    for (let j = i + 1; j < clusters.length; j++) {
      if (used.has(j)) continue;
      const overlap = clusters[j].involvedIPs.some(ip => campaign.allIPs.has(ip));
      if (overlap) {
        campaign.clusters.push(clusters[j]);
        clusters[j].involvedIPs.forEach(ip => campaign.allIPs.add(ip));
        clusters[j].threatTypes.forEach(t => campaign.allTypes.add(t));
        clusters[j].killChainStages.forEach(s => campaign.allStages.add(s));
        used.add(j);
      }
    }

    const stageList = [...campaign.allStages];
    campaigns.push({
      id: campaign.id,
      clusterCount: campaign.clusters.length,
      totalEvents: campaign.clusters.reduce((s, c) => s + c.eventCount, 0),
      involvedIPs: [...campaign.allIPs],
      threatTypes: [...campaign.allTypes],
      killChainStages: stageList,
      killChainProgress: +(stageList.length / 7).toFixed(2),
      severity: stageList.length >= 4 ? 'critical' : stageList.length >= 2 ? 'high' : 'medium',
      status: stageList.length >= 5 ? '活跃攻击' : stageList.length >= 3 ? '攻击进行中' : '早期侦察',
    });
  }

  return campaigns.sort((a, b) => b.killChainProgress - a.killChainProgress);
}

/**
 * 生成攻击路径图数据（用于可视化）
 */
function generateAttackGraph(events) {
  const mapped = mapToKillChain(events);
  const nodes = new Map();
  const edges = [];

  // 生成节点
  mapped.forEach(e => {
    const srcKey = e.srcIP;
    const dstKey = e.dstIP;
    if (!nodes.has(srcKey)) {
      nodes.set(srcKey, { id: srcKey, type: 'ip', label: srcKey, events: 0, isAttacker: true });
    }
    if (!nodes.has(dstKey)) {
      nodes.set(dstKey, { id: dstKey, type: 'ip', label: dstKey, events: 0, isAttacker: false });
    }
    nodes.get(srcKey).events++;
    nodes.get(dstKey).events++;

    edges.push({
      source: srcKey,
      target: dstKey,
      type: e.type?.name || 'unknown',
      stage: e.killChain.stageName,
      stageNumber: e.killChain.stageNumber,
      timestamp: e.timestamp,
      color: e.killChain.color,
    });
  });

  return {
    nodes: [...nodes.values()],
    edges,
    stageDistribution: KILL_CHAIN_STAGES.map(s => ({
      ...s,
      count: mapped.filter(e => e.killChain.stageId === s.id).length,
    })),
  };
}

module.exports = {
  KILL_CHAIN_STAGES,
  THREAT_STAGE_MAP,
  CORRELATION_RULES,
  mapToKillChain,
  clusterEvents,
  matchCorrelationRules,
  identifyCampaigns,
  generateAttackGraph,
};
