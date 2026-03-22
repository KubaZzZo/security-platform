// ==================== 监控中心 ====================
export const monitorStats = {
  serviceDays: 365,
  pendingRisks: 128,
  alerts: 1563,
  securityEvents: 4289,
};

export const securityRating = {
  score: 85,
  level: '良好',
  color: '#52c41a',
};

export const hotEvents = [
  '勒索病毒', 'Log4j漏洞', 'SQL注入', 'XSS攻击', '暴力破解',
  'Webshell', '挖矿木马', 'DDoS攻击', '钓鱼邮件', '弱口令',
  '未授权访问', '信息泄露', '命令注入', '文件上传', '反序列化',
];

export const serverSecurity = {
  total: 256,
  safe: 198,
  risk: 42,
  offline: 16,
  riskDistribution: [
    { name: '高危', value: 12, color: '#ff4d4f' },
    { name: '中危', value: 18, color: '#faad14' },
    { name: '低危', value: 12, color: '#1890ff' },
  ],
  top5: [
    { name: '192.168.1.100', type: '服务器', riskLevel: '高危', events: 23, time: '2024-01-15 14:30' },
    { name: '192.168.1.101', type: '服务器', riskLevel: '高危', events: 18, time: '2024-01-15 13:20' },
    { name: '192.168.1.102', type: '服务器', riskLevel: '中危', events: 15, time: '2024-01-15 12:10' },
    { name: '192.168.1.103', type: '服务器', riskLevel: '中危', events: 12, time: '2024-01-15 11:05' },
    { name: '192.168.1.104', type: '服务器', riskLevel: '低危', events: 8, time: '2024-01-15 10:00' },
  ],
};

export const terminalSecurity = {
  total: 1024,
  safe: 890,
  risk: 98,
  offline: 36,
  riskDistribution: [
    { name: '高危', value: 28, color: '#ff4d4f' },
    { name: '中危', value: 42, color: '#faad14' },
    { name: '低危', value: 28, color: '#1890ff' },
  ],
  top5: [
    { name: 'PC-ZHANGSAN', type: '终端', riskLevel: '高危', events: 15, time: '2024-01-15 14:25' },
    { name: 'PC-LISI', type: '终端', riskLevel: '高危', events: 12, time: '2024-01-15 13:15' },
    { name: 'PC-WANGWU', type: '终端', riskLevel: '中危', events: 9, time: '2024-01-15 12:05' },
    { name: 'PC-ZHAOLIU', type: '终端', riskLevel: '中危', events: 7, time: '2024-01-15 11:00' },
    { name: 'PC-SUNQI', type: '终端', riskLevel: '低危', events: 5, time: '2024-01-15 10:30' },
  ],
};

export const userSecurity = {
  total: 2048,
  safe: 1856,
  risk: 64,
  offline: 128,
  riskDistribution: [
    { name: '高危', value: 18, color: '#ff4d4f' },
    { name: '中危', value: 26, color: '#faad14' },
    { name: '低危', value: 20, color: '#1890ff' },
  ],
  top5: [
    { name: 'user_admin01', type: '管理员', riskLevel: '高危', events: 20, time: '2024-01-15 14:20' },
    { name: 'user_dev03', type: '开发', riskLevel: '高危', events: 16, time: '2024-01-15 13:10' },
    { name: 'user_test05', type: '测试', riskLevel: '中危', events: 11, time: '2024-01-15 12:00' },
    { name: 'user_ops02', type: '运维', riskLevel: '中危', events: 8, time: '2024-01-15 11:30' },
    { name: 'user_hr01', type: '人事', riskLevel: '低危', events: 4, time: '2024-01-15 10:15' },
  ],
};

export const assetStats = {
  servers: 256,
  terminals: 1024,
  iot: 128,
  databases: 32,
};

export const portTop5 = [
  { port: 80, count: 1256 },
  { port: 443, count: 986 },
  { port: 22, count: 654 },
  { port: 3306, count: 432 },
  { port: 8080, count: 321 },
];

export const eubaData = {
  dates: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'],
  values: [120, 132, 101, 134, 90, 230, 210],
};

export const threatEvents = {
  categories: ['恶意软件', '漏洞利用', '暴力破解', 'Web攻击', '异常流量', 'DDoS', '钓鱼攻击'],
  values: [320, 280, 250, 220, 180, 150, 120],
};

export const securityBulletins = [
  { id: 1, title: '安全日报-2024年1月15日', type: '日报', date: '2024-01-15', status: '已发送' },
  { id: 2, title: '安全日报-2024年1月14日', type: '日报', date: '2024-01-14', status: '已发送' },
  { id: 3, title: '安全周报-2024年第3周', type: '周报', date: '2024-01-14', status: '已发送' },
  { id: 4, title: '安全日报-2024年1月13日', type: '日报', date: '2024-01-13', status: '已发送' },
  { id: 5, title: '安全月报-2023年12月', type: '月报', date: '2024-01-01', status: '已发送' },
];

// ==================== 处置中心 ====================
export const assetGroups = [
  { id: 'all', name: '全部', count: 1408 },
  { id: 'internal', name: '内网IP范围', count: 1200, children: [
    { id: 'student', name: '学生', count: 800 },
    { id: 'staff', name: '教职工', count: 400 },
  ]},
];

export const disposalStats = {
  all: { label: '全部', value: 128, color: 'var(--primary)' },
  server: { label: '服务器', value: 42, color: '#fa8c16' },
  terminal: { label: '终端', value: 56, color: '#722ed1' },
  iot: { label: '物联网', value: 30, color: '#13c2c2' },
};

export const disposalTableData = [
  { name: '192.168.1.100', type: '服务器', riskLevel: '高危', events: 23, time: '2024-01-15 14:30', status: '待处置', hasEDR: true },
  { name: '192.168.1.105', type: '终端', riskLevel: '高危', events: 18, time: '2024-01-15 13:20', status: '处置中', hasEDR: true },
  { name: '192.168.1.110', type: '服务器', riskLevel: '中危', events: 15, time: '2024-01-15 12:10', status: '待处置', hasEDR: false },
  { name: '192.168.1.115', type: '物联网', riskLevel: '中危', events: 12, time: '2024-01-15 11:05', status: '已处置', hasEDR: false },
  { name: '192.168.1.120', type: '终端', riskLevel: '低危', events: 8, time: '2024-01-15 10:00', status: '待处置', hasEDR: true },
  { name: '192.168.1.125', type: '服务器', riskLevel: '高危', events: 21, time: '2024-01-15 09:45', status: '处置中', hasEDR: true },
  { name: '192.168.1.130', type: '终端', riskLevel: '中危', events: 10, time: '2024-01-15 09:30', status: '待处置', hasEDR: false },
  { name: '192.168.1.135', type: '物联网', riskLevel: '低危', events: 5, time: '2024-01-15 09:15', status: '已处置', hasEDR: false },
  { name: '192.168.1.140', type: '服务器', riskLevel: '高危', events: 19, time: '2024-01-15 09:00', status: '待处置', hasEDR: true },
  { name: '192.168.1.145', type: '终端', riskLevel: '中危', events: 14, time: '2024-01-15 08:45', status: '处置中', hasEDR: true },
];

// ==================== 分析中心 ====================
export const logStats = {
  total: 56244981,
  categories: [
    { name: '僵尸网络', count: 12580, color: '#ff4d4f' },
    { name: '系统命令注入', count: 8964, color: '#fa8c16' },
    { name: 'XSS攻击', count: 7523, color: '#faad14' },
    { name: '正常访问', count: 45892341, color: '#52c41a' },
    { name: 'SQL注入', count: 6842, color: '#1890ff' },
    { name: '恶意扫描', count: 5631, color: '#722ed1' },
    { name: '暴力破解', count: 4523, color: '#eb2f96' },
    { name: '文件包含', count: 3214, color: '#13c2c2' },
  ],
};

export const logTableData = [
  { time: '2024-01-15 14:30:25', desc: '检测到SQL注入攻击', logType: 'IDS', attackType: 'SQL注入', srcIp: '10.45.23.101', dstIp: '192.168.1.100', severity: '高', action: '阻断' },
  { time: '2024-01-15 14:29:18', desc: '检测到XSS跨站脚本攻击', logType: 'WAF', attackType: 'XSS攻击', srcIp: '10.45.23.102', dstIp: '192.168.1.101', severity: '高', action: '阻断' },
  { time: '2024-01-15 14:28:05', desc: '检测到系统命令注入', logType: 'IDS', attackType: '命令注入', srcIp: '10.45.23.103', dstIp: '192.168.1.102', severity: '高', action: '阻断' },
  { time: '2024-01-15 14:27:30', desc: '检测到暴力破解行为', logType: '防火墙', attackType: '暴力破解', srcIp: '10.45.23.104', dstIp: '192.168.1.103', severity: '中', action: '告警' },
  { time: '2024-01-15 14:26:15', desc: '检测到恶意扫描行为', logType: 'IDS', attackType: '恶意扫描', srcIp: '10.45.23.105', dstIp: '192.168.1.104', severity: '中', action: '告警' },
  { time: '2024-01-15 14:25:00', desc: '正常HTTP访问请求', logType: 'WAF', attackType: '正常访问', srcIp: '10.45.23.106', dstIp: '192.168.1.105', severity: '低', action: '放行' },
  { time: '2024-01-15 14:24:30', desc: '检测到僵尸网络通信', logType: 'IDS', attackType: '僵尸网络', srcIp: '10.45.23.107', dstIp: '192.168.1.106', severity: '高', action: '阻断' },
  { time: '2024-01-15 14:23:15', desc: '检测到文件包含攻击', logType: 'WAF', attackType: '文件包含', srcIp: '10.45.23.108', dstIp: '192.168.1.107', severity: '中', action: '阻断' },
  { time: '2024-01-15 14:22:00', desc: '正常DNS查询请求', logType: '防火墙', attackType: '正常访问', srcIp: '10.45.23.109', dstIp: '192.168.1.108', severity: '低', action: '放行' },
  { time: '2024-01-15 14:21:30', desc: '检测到SQL注入攻击', logType: 'WAF', attackType: 'SQL注入', srcIp: '10.45.23.110', dstIp: '192.168.1.109', severity: '高', action: '阻断' },
];

// ==================== 资产中心 ====================
export const assetOverview = {
  cards: [
    { title: '主机资产总数', value: 1408, color: 'var(--primary)' },
    { title: '服务器', value: 256, color: '#fa8c16' },
    { title: '终端', value: 1024, color: '#722ed1' },
    { title: '物联网设备', value: 128, color: '#13c2c2' },
    { title: '在线资产', value: 1280, color: '#52c41a' },
    { title: '离线资产', value: 96, color: '#999' },
    { title: '风险资产', value: 32, color: '#ff4d4f' },
  ],
  baselineDistribution: [
    { name: '合规', value: 1200, color: '#52c41a' },
    { name: '不合规', value: 150, color: '#ff4d4f' },
    { name: '未检测', value: 58, color: '#999' },
  ],
  baselineTrend: {
    dates: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'],
    compliant: [1150, 1160, 1170, 1180, 1190, 1195, 1200],
    nonCompliant: [180, 175, 168, 162, 158, 155, 150],
  },
};

// ==================== 报告中心 ====================
export const reportCards = [
  { type: '年报', title: '2023年度安全报告', status: '已生成', date: '2024-01-01' },
  { type: '半年报', title: '2023下半年安全报告', status: '已生成', date: '2024-01-01' },
  { type: '季度报', title: '2023年Q4安全报告', status: '已生成', date: '2024-01-01' },
];

export const reportTableData = [
  { id: 1, name: '安全日报-2024年1月15日', type: '日报', createTime: '2024-01-15 08:00', status: '已生成', size: '2.3MB' },
  { id: 2, name: '安全日报-2024年1月14日', type: '日报', createTime: '2024-01-14 08:00', status: '已生成', size: '2.1MB' },
  { id: 3, name: '安全周报-2024年第3周', type: '周报', createTime: '2024-01-14 09:00', status: '已生成', size: '5.6MB' },
  { id: 4, name: '安全日报-2024年1月13日', type: '日报', createTime: '2024-01-13 08:00', status: '已生成', size: '1.9MB' },
  { id: 5, name: '安全日报-2024年1月12日', type: '日报', createTime: '2024-01-12 08:00', status: '已生成', size: '2.0MB' },
  { id: 6, name: '安全月报-2023年12月', type: '月报', createTime: '2024-01-01 09:00', status: '已生成', size: '12.5MB' },
  { id: 7, name: '安全季度报-2023年Q4', type: '季度报', createTime: '2024-01-01 10:00', status: '已生成', size: '25.3MB' },
  { id: 8, name: '安全年报-2023年', type: '年报', createTime: '2024-01-01 11:00', status: '已生成', size: '48.7MB' },
];

// ==================== 通报预警 ====================
export const warningTableData = [
  { id: 1, title: '关于Apache Log4j2远程代码执行漏洞的预警通报', source: '国家信息安全漏洞共享平台', time: '2024-01-15 10:00', type: '漏洞预警' },
  { id: 2, title: '关于Windows远程桌面服务漏洞的预警通报', source: '国家互联网应急中心', time: '2024-01-14 15:30', type: '漏洞预警' },
  { id: 3, title: '关于新型勒索病毒变种的预警通报', source: '国家信息安全漏洞共享平台', time: '2024-01-13 09:00', type: '安全预警' },
  { id: 4, title: '关于某APT组织针对教育行业攻击的预警', source: '教育行业安全中心', time: '2024-01-12 14:00', type: '安全预警' },
  { id: 5, title: '关于OpenSSH远程代码执行漏洞的预警通报', source: '国家互联网应急中心', time: '2024-01-11 11:00', type: '漏洞预警' },
];

// ==================== 重保中心 ====================
export const attackerDistribution = {
  domestic: [
    { name: '北京', value: 2856 },
    { name: '上海', value: 2340 },
    { name: '广东', value: 1987 },
    { name: '浙江', value: 1654 },
    { name: '江苏', value: 1432 },
    { name: '四川', value: 1210 },
    { name: '湖北', value: 987 },
    { name: '山东', value: 876 },
    { name: '福建', value: 765 },
    { name: '河南', value: 654 },
  ],
  foreign: [
    { name: '美国', value: 5632 },
    { name: '俄罗斯', value: 3214 },
    { name: '韩国', value: 2156 },
    { name: '日本', value: 1876 },
    { name: '德国', value: 1543 },
    { name: '荷兰', value: 1234 },
    { name: '法国', value: 987 },
    { name: '英国', value: 876 },
    { name: '巴西', value: 654 },
    { name: '印度', value: 543 },
  ],
};

export const attackerTop10 = [
  { ip: '45.227.253.101', cSegment: 12, victimIps: 56, attackType: 'SQL注入', attacks: 2856, lastTime: '2024-01-15 14:30', status: '已封锁' },
  { ip: '103.45.67.89', cSegment: 8, victimIps: 43, attackType: '暴力破解', attacks: 2340, lastTime: '2024-01-15 14:25', status: '已封锁' },
  { ip: '185.220.101.45', cSegment: 15, victimIps: 38, attackType: 'XSS攻击', attacks: 1987, lastTime: '2024-01-15 14:20', status: '封锁中' },
  { ip: '91.234.56.78', cSegment: 6, victimIps: 31, attackType: '命令注入', attacks: 1654, lastTime: '2024-01-15 14:15', status: '未封锁' },
  { ip: '23.129.64.100', cSegment: 10, victimIps: 28, attackType: '恶意扫描', attacks: 1432, lastTime: '2024-01-15 14:10', status: '已封锁' },
  { ip: '176.111.174.23', cSegment: 4, victimIps: 25, attackType: 'Web攻击', attacks: 1210, lastTime: '2024-01-15 14:05', status: '封锁中' },
  { ip: '45.155.205.67', cSegment: 7, victimIps: 22, attackType: '暴力破解', attacks: 987, lastTime: '2024-01-15 14:00', status: '未封锁' },
  { ip: '89.248.167.131', cSegment: 9, victimIps: 19, attackType: 'SQL注入', attacks: 876, lastTime: '2024-01-15 13:55', status: '已封锁' },
  { ip: '162.247.74.27', cSegment: 3, victimIps: 16, attackType: '文件上传', attacks: 765, lastTime: '2024-01-15 13:50', status: '封锁中' },
  { ip: '198.98.56.78', cSegment: 5, victimIps: 13, attackType: 'XSS攻击', attacks: 654, lastTime: '2024-01-15 13:45', status: '未封锁' },
];
