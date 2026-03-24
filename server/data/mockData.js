// ==================== 监控中心 ====================
const monitorStats = { serviceDays: 365, pendingRisks: 128, alerts: 1563, securityEvents: 4289 };
const securityRating = { score: 85, level: '良好', color: '#52c41a' };
const hotEvents = ['勒索病毒','Log4j漏洞','SQL注入','XSS攻击','暴力破解','Webshell','挖矿木马','DDoS攻击','钓鱼邮件','弱口令','未授权访问','信息泄露','命令注入','文件上传','反序列化'];

const riskDist = (h, m, l) => [{ name:'高危',value:h,color:'#ff4d4f' },{ name:'中危',value:m,color:'#faad14' },{ name:'低危',value:l,color:'#1890ff' }];
const serverSecurity = { total:256, safe:198, risk:42, offline:16, riskDistribution: riskDist(12,18,12), top5:[
  { name:'192.168.1.100',type:'服务器',riskLevel:'高危',events:23,time:'2024-01-15 14:30' },
  { name:'192.168.1.101',type:'服务器',riskLevel:'高危',events:18,time:'2024-01-15 13:20' },
  { name:'192.168.1.102',type:'服务器',riskLevel:'中危',events:15,time:'2024-01-15 12:10' },
  { name:'192.168.1.103',type:'服务器',riskLevel:'中危',events:12,time:'2024-01-15 11:05' },
  { name:'192.168.1.104',type:'服务器',riskLevel:'低危',events:8,time:'2024-01-15 10:00' },
]};
const terminalSecurity = { total:1024, safe:890, risk:98, offline:36, riskDistribution: riskDist(28,42,28), top5:[
  { name:'PC-ZHANGSAN',type:'终端',riskLevel:'高危',events:15,time:'2024-01-15 14:25' },
  { name:'PC-LISI',type:'终端',riskLevel:'高危',events:12,time:'2024-01-15 13:15' },
  { name:'PC-WANGWU',type:'终端',riskLevel:'中危',events:9,time:'2024-01-15 12:05' },
  { name:'PC-ZHAOLIU',type:'终端',riskLevel:'中危',events:7,time:'2024-01-15 11:00' },
  { name:'PC-SUNQI',type:'终端',riskLevel:'低危',events:5,time:'2024-01-15 10:30' },
]};
const userSecurity = { total:2048, safe:1856, risk:64, offline:128, riskDistribution: riskDist(18,26,20), top5:[
  { name:'user_admin01',type:'管理员',riskLevel:'高危',events:20,time:'2024-01-15 14:20' },
  { name:'user_dev03',type:'开发',riskLevel:'高危',events:16,time:'2024-01-15 13:10' },
  { name:'user_test05',type:'测试',riskLevel:'中危',events:11,time:'2024-01-15 12:00' },
  { name:'user_ops02',type:'运维',riskLevel:'中危',events:8,time:'2024-01-15 11:30' },
  { name:'user_hr01',type:'人事',riskLevel:'低危',events:4,time:'2024-01-15 10:15' },
]};
const assetStats = { servers:256, terminals:1024, iot:128, databases:32 };
const portTop5 = [{ port:80,count:1256 },{ port:443,count:986 },{ port:22,count:654 },{ port:3306,count:432 },{ port:8080,count:321 }];
const eubaData = { dates:['01-09','01-10','01-11','01-12','01-13','01-14','01-15'], values:[120,132,101,134,90,230,210] };
const threatEvents = { categories:['恶意软件','漏洞利用','暴力破解','Web攻击','异常流量','DDoS','钓鱼攻击'], values:[320,280,250,220,180,150,120] };
const securityBulletins = [
  { id:1,title:'安全日报-2024年1月15日',type:'日报',date:'2024-01-15',status:'已发送' },
  { id:2,title:'安全日报-2024年1月14日',type:'日报',date:'2024-01-14',status:'已发送' },
  { id:3,title:'安全周报-2024年第3周',type:'周报',date:'2024-01-14',status:'已发送' },
  { id:4,title:'安全日报-2024年1月13日',type:'日报',date:'2024-01-13',status:'已发送' },
  { id:5,title:'安全月报-2023年12月',type:'月报',date:'2024-01-01',status:'已发送' },
];

// ==================== 监控子页面 ====================
const monitorEventsData = [
  { time:'2026-03-22 14:32:18',name:'Trojan.GenericKD.46542',type:'恶意软件',severity:'高危',srcIp:'192.168.1.105',dstIp:'10.0.0.12',status:'已处置' },
  { time:'2026-03-22 14:28:05',name:'SQL注入攻击检测',type:'Web攻击',severity:'高危',srcIp:'172.16.5.33',dstIp:'10.0.1.8',status:'待处置' },
  { time:'2026-03-22 14:15:42',name:'SSH暴力破解尝试',type:'暴力破解',severity:'中危',srcIp:'192.168.3.201',dstIp:'10.0.0.5',status:'处理中' },
  { time:'2026-03-22 13:58:31',name:'CVE-2025-21388漏洞利用',type:'漏洞利用',severity:'高危',srcIp:'172.16.8.15',dstIp:'10.0.2.3',status:'已处置' },
  { time:'2026-03-22 13:45:20',name:'DNS隧道通信检测',type:'异常流量',severity:'中危',srcIp:'192.168.2.88',dstIp:'10.0.0.1',status:'已处置' },
  { time:'2026-03-22 13:30:11',name:'XSS跨站脚本攻击',type:'Web攻击',severity:'中危',srcIp:'172.16.3.42',dstIp:'10.0.1.15',status:'已处置' },
  { time:'2026-03-22 13:12:55',name:'Webshell上传检测',type:'Web攻击',severity:'高危',srcIp:'192.168.5.67',dstIp:'10.0.1.8',status:'处理中' },
  { time:'2026-03-22 12:58:03',name:'RDP暴力破解',type:'暴力破解',severity:'中危',srcIp:'172.16.9.100',dstIp:'10.0.3.22',status:'已处置' },
];
const monitorAlertsData = [
  { id:'ALT-20260322-001',name:'异常登录行为检测',level:'高危',source:'HIDS',time:'2026-03-22 14:30:12',asset:'10.0.1.15',status:'未处理' },
  { id:'ALT-20260322-002',name:'端口扫描告警',level:'中危',source:'NIDS',time:'2026-03-22 14:25:08',asset:'192.168.1.0/24',status:'处理中' },
  { id:'ALT-20260322-003',name:'恶意文件下载',level:'高危',source:'WAF',time:'2026-03-22 14:18:33',asset:'10.0.2.8',status:'未处理' },
  { id:'ALT-20260322-004',name:'DNS异常查询',level:'低危',source:'DNS防火墙',time:'2026-03-22 14:10:45',asset:'172.16.3.50',status:'已关闭' },
  { id:'ALT-20260322-005',name:'弱口令登录告警',level:'中危',source:'HIDS',time:'2026-03-22 13:55:20',asset:'10.0.0.22',status:'已关闭' },
  { id:'ALT-20260322-006',name:'CC攻击检测',level:'高危',source:'WAF',time:'2026-03-22 13:42:11',asset:'10.0.1.8',status:'处理中' },
];
const hostsData = [
  { ip:'10.0.1.15',hostname:'web-server-01',os:'CentOS 7.9',riskLevel:'高危',vulns:12,events:23,status:'在线',lastScan:'2026-03-22 08:00' },
  { ip:'10.0.2.8',hostname:'db-server-01',os:'Ubuntu 22.04',riskLevel:'中危',vulns:5,events:8,status:'在线',lastScan:'2026-03-22 08:00' },
  { ip:'10.0.0.5',hostname:'app-server-01',os:'Windows Server 2022',riskLevel:'低危',vulns:2,events:3,status:'在线',lastScan:'2026-03-22 08:00' },
  { ip:'10.0.3.22',hostname:'file-server-01',os:'CentOS 8.5',riskLevel:'中危',vulns:7,events:11,status:'在线',lastScan:'2026-03-22 08:00' },
];

// ==================== 处置中心 ====================
const assetGroups = [
  { id:'all',name:'全部',count:1408 },
  { id:'internal',name:'内网IP范围',count:1200,children:[{ id:'student',name:'学生',count:800 },{ id:'staff',name:'教职工',count:400 }] },
];
const disposalStats = { all:{label:'全部',value:128,color:'#1890ff'}, server:{label:'服务器',value:42,color:'#fa8c16'}, terminal:{label:'终端',value:56,color:'#722ed1'}, iot:{label:'物联网',value:30,color:'#13c2c2'} };
const disposalTableData = [
  { name:'192.168.1.100',type:'服务器',riskLevel:'高危',events:23,time:'2024-01-15 14:30',status:'待处置',hasEDR:true },
  { name:'192.168.1.105',type:'终端',riskLevel:'高危',events:18,time:'2024-01-15 13:20',status:'处置中',hasEDR:true },
  { name:'192.168.1.110',type:'服务器',riskLevel:'中危',events:15,time:'2024-01-15 12:10',status:'待处置',hasEDR:false },
  { name:'192.168.1.115',type:'物联网',riskLevel:'中危',events:12,time:'2024-01-15 11:05',status:'已处置',hasEDR:false },
  { name:'192.168.1.120',type:'终端',riskLevel:'低危',events:8,time:'2024-01-15 10:00',status:'待处置',hasEDR:true },
  { name:'192.168.1.125',type:'服务器',riskLevel:'高危',events:21,time:'2024-01-15 09:45',status:'处置中',hasEDR:true },
  { name:'192.168.1.130',type:'终端',riskLevel:'中危',events:10,time:'2024-01-15 09:30',status:'待处置',hasEDR:false },
  { name:'192.168.1.135',type:'物联网',riskLevel:'低危',events:5,time:'2024-01-15 09:15',status:'已处置',hasEDR:false },
  { name:'192.168.1.140',type:'服务器',riskLevel:'高危',events:19,time:'2024-01-15 09:00',status:'待处置',hasEDR:true },
  { name:'192.168.1.145',type:'终端',riskLevel:'中危',events:14,time:'2024-01-15 08:45',status:'处置中',hasEDR:true },
];

// ==================== 分析中心 ====================
const logStats = { total:56244981, categories:[
  { name:'僵尸网络',count:12580,color:'#ff4d4f' },{ name:'系统命令注入',count:8964,color:'#fa8c16' },
  { name:'XSS攻击',count:7523,color:'#faad14' },{ name:'正常访问',count:45892341,color:'#52c41a' },
  { name:'SQL注入',count:6842,color:'#1890ff' },{ name:'恶意扫描',count:5631,color:'#722ed1' },
  { name:'暴力破解',count:4523,color:'#eb2f96' },{ name:'文件包含',count:3214,color:'#13c2c2' },
]};
const logTableData = [
  { time:'2024-01-15 14:30:25',desc:'检测到SQL注入攻击',logType:'IDS',attackType:'SQL注入',srcIp:'10.45.23.101',dstIp:'192.168.1.100',severity:'高',action:'阻断' },
  { time:'2024-01-15 14:29:18',desc:'检测到XSS跨站脚本攻击',logType:'WAF',attackType:'XSS攻击',srcIp:'10.45.23.102',dstIp:'192.168.1.101',severity:'高',action:'阻断' },
  { time:'2024-01-15 14:28:05',desc:'检测到系统命令注入',logType:'IDS',attackType:'命令注入',srcIp:'10.45.23.103',dstIp:'192.168.1.102',severity:'高',action:'阻断' },
  { time:'2024-01-15 14:27:30',desc:'检测到暴力破解行为',logType:'防火墙',attackType:'暴力破解',srcIp:'10.45.23.104',dstIp:'192.168.1.103',severity:'中',action:'告警' },
  { time:'2024-01-15 14:26:15',desc:'检测到恶意扫描行为',logType:'IDS',attackType:'恶意扫描',srcIp:'10.45.23.105',dstIp:'192.168.1.104',severity:'中',action:'告警' },
  { time:'2024-01-15 14:25:00',desc:'正常HTTP访问请求',logType:'WAF',attackType:'正常访问',srcIp:'10.45.23.106',dstIp:'192.168.1.105',severity:'低',action:'放行' },
  { time:'2024-01-15 14:24:30',desc:'检测到僵尸网络通信',logType:'IDS',attackType:'僵尸网络',srcIp:'10.45.23.107',dstIp:'192.168.1.106',severity:'高',action:'阻断' },
  { time:'2024-01-15 14:23:15',desc:'检测到文件包含攻击',logType:'WAF',attackType:'文件包含',srcIp:'10.45.23.108',dstIp:'192.168.1.107',severity:'中',action:'阻断' },
];

// ==================== 资产中心 ====================
const assetOverview = {
  cards:[
    { title:'主机资产总数',value:1408,color:'#1890ff' },{ title:'服务器',value:256,color:'#fa8c16' },
    { title:'终端',value:1024,color:'#722ed1' },{ title:'物联网设备',value:128,color:'#13c2c2' },
    { title:'在线资产',value:1280,color:'#52c41a' },{ title:'离线资产',value:96,color:'#999' },
    { title:'风险资产',value:32,color:'#ff4d4f' },
  ],
  baselineDistribution:[{ name:'合规',value:1200,color:'#52c41a' },{ name:'不合规',value:150,color:'#ff4d4f' },{ name:'未检测',value:58,color:'#999' }],
  baselineTrend:{ dates:['01-09','01-10','01-11','01-12','01-13','01-14','01-15'], compliant:[1150,1160,1170,1180,1190,1195,1200], nonCompliant:[180,175,168,162,158,155,150] },
};

// ==================== 报告中心 ====================
const reportCards = [
  { type:'年报',title:'2023年度安全报告',status:'已生成',date:'2024-01-01' },
  { type:'半年报',title:'2023下半年安全报告',status:'已生成',date:'2024-01-01' },
  { type:'季度报',title:'2023年Q4安全报告',status:'已生成',date:'2024-01-01' },
];
const reportTableData = [
  { id:1,name:'安全日报-2024年1月15日',type:'日报',createTime:'2024-01-15 08:00',status:'已生成',size:'2.3MB' },
  { id:2,name:'安全日报-2024年1月14日',type:'日报',createTime:'2024-01-14 08:00',status:'已生成',size:'2.1MB' },
  { id:3,name:'安全周报-2024年第3周',type:'周报',createTime:'2024-01-14 09:00',status:'已生成',size:'5.6MB' },
  { id:4,name:'安全日报-2024年1月13日',type:'日报',createTime:'2024-01-13 08:00',status:'已生成',size:'1.9MB' },
  { id:5,name:'安全月报-2023年12月',type:'月报',createTime:'2024-01-01 09:00',status:'已生成',size:'12.5MB' },
  { id:6,name:'安全季度报-2023年Q4',type:'季度报',createTime:'2024-01-01 10:00',status:'已生成',size:'25.3MB' },
  { id:7,name:'安全年报-2023年',type:'年报',createTime:'2024-01-01 11:00',status:'已生成',size:'48.7MB' },
];

// ==================== 通报预警 ====================
const warningTableData = [
  { id:1,title:'关于Apache Log4j2远程代码执行漏洞的预警通报',source:'国家信息安全漏洞共享平台',time:'2024-01-15 10:00',type:'漏洞预警' },
  { id:2,title:'关于Windows远程桌面服务漏洞的预警通报',source:'国家互联网应急中心',time:'2024-01-14 15:30',type:'漏洞预警' },
  { id:3,title:'关于新型勒索病毒变种的预警通报',source:'国家信息安全漏洞共享平台',time:'2024-01-13 09:00',type:'安全预警' },
  { id:4,title:'关于某APT组织针对教育行业攻击的预警',source:'教育行业安全中心',time:'2024-01-12 14:00',type:'安全预警' },
  { id:5,title:'关于OpenSSH远程代码执行漏洞的预警通报',source:'国家互联网应急中心',time:'2024-01-11 11:00',type:'漏洞预警' },
];
const pendingEvents = [
  { id:'TB-2024-0156',title:'校园网出口遭受DDoS攻击事件',level:'高',source:'安全监控平台',target:'出口防火墙',time:'2024-01-15 14:30',reporter:'待指派' },
  { id:'TB-2024-0155',title:'教学区服务器存在SQL注入漏洞',level:'高',source:'漏洞扫描系统',target:'教学区Web服务器',time:'2024-01-15 13:20',reporter:'待指派' },
  { id:'TB-2024-0154',title:'宿舍区发现挖矿木马通信行为',level:'中',source:'IDS检测',target:'宿舍区终端',time:'2024-01-15 12:10',reporter:'待指派' },
  { id:'TB-2024-0153',title:'图书馆无线网络异常流量突增',level:'中',source:'流量监控',target:'图书馆AP',time:'2024-01-15 11:05',reporter:'待指派' },
  { id:'TB-2024-0152',title:'行政区邮件服务器遭受暴力破解',level:'高',source:'日志分析',target:'邮件服务器',time:'2024-01-15 10:00',reporter:'待指派' },
];
const processingEvents = [
  { id:'TB-2024-0148',title:'宿舍区蠕虫病毒传播事件',level:'高',source:'IDS检测',target:'宿舍区网段',time:'2024-01-14 16:30',reporter:'张明',progress:'已通知责任单位' },
  { id:'TB-2024-0147',title:'教学区Web应用XSS漏洞利用',level:'高',source:'WAF日志',target:'教务系统',time:'2024-01-14 15:20',reporter:'李华',progress:'修复中' },
  { id:'TB-2024-0146',title:'科研区服务器异常外联行为',level:'中',source:'流量分析',target:'科研服务器集群',time:'2024-01-14 14:10',reporter:'王强',progress:'排查中' },
];
const archivedEvents = [
  { id:'TB-2024-0120',title:'校园网出口遭受SYN Flood攻击',level:'高',source:'安全监控平台',reporter:'张明',time:'2024-01-10 14:30',archiveTime:'2024-01-12 16:00',result:'已修复' },
  { id:'TB-2024-0118',title:'教务系统存在未授权访问漏洞',level:'高',source:'漏洞扫描系统',reporter:'李华',time:'2024-01-09 10:20',archiveTime:'2024-01-11 14:30',result:'已修复' },
  { id:'TB-2024-0115',title:'宿舍区终端感染勒索病毒',level:'高',source:'EDR告警',reporter:'王强',time:'2024-01-08 09:15',archiveTime:'2024-01-10 11:00',result:'已隔离处置' },
];
const ignoredEvents = [
  { id:'TB-2024-0142',title:'教学区打印机固件版本过低',level:'低',source:'资产扫描',target:'教学区打印机',time:'2024-01-13 14:30',reason:'设备即将淘汰',operator:'张明' },
  { id:'TB-2024-0140',title:'测试环境SSH弱口令告警',level:'低',source:'基线检查',target:'测试服务器',time:'2024-01-13 11:20',reason:'隔离测试环境',operator:'李华' },
  { id:'TB-2024-0138',title:'实验室内网扫描行为',level:'低',source:'IDS检测',target:'实验室网段',time:'2024-01-12 16:00',reason:'授权安全测试',operator:'王强' },
];
const alertCenterData = [
  { id:'YJ-2024-0891',title:'Apache Log4j2远程代码执行漏洞预警',level:'高危',source:'国家互联网应急中心',scope:'全校Web服务器',time:'2024-03-15 09:23:00',status:'待处理' },
  { id:'YJ-2024-0890',title:'校园网DNS劫持攻击预警',level:'高危',source:'自动检测',scope:'DNS服务器集群',time:'2024-03-15 08:45:00',status:'处理中' },
  { id:'YJ-2024-0889',title:'Windows SMB协议漏洞利用预警',level:'中危',source:'教育行业安全中心',scope:'教学区终端',time:'2024-03-14 16:30:00',status:'已处理' },
  { id:'YJ-2024-0888',title:'校园VPN暴力破解攻击预警',level:'高危',source:'自动检测',scope:'VPN网关',time:'2024-03-14 14:12:00',status:'处理中' },
];

// ==================== 重保中心 ====================
const attackerDistribution = {
  domestic:[{ name:'北京',value:2856 },{ name:'上海',value:2340 },{ name:'广东',value:1987 },{ name:'浙江',value:1654 },{ name:'江苏',value:1432 }],
  foreign:[{ name:'美国',value:5632 },{ name:'俄罗斯',value:3214 },{ name:'韩国',value:2156 },{ name:'日本',value:1876 },{ name:'德国',value:1543 }],
};
const attackerTop10 = [
  { ip:'45.227.253.101',cSegment:12,victimIps:56,attackType:'SQL注入',attacks:2856,lastTime:'2024-01-15 14:30',status:'已封锁' },
  { ip:'103.45.67.89',cSegment:8,victimIps:43,attackType:'暴力破解',attacks:2340,lastTime:'2024-01-15 14:25',status:'已封锁' },
  { ip:'185.220.101.45',cSegment:15,victimIps:38,attackType:'XSS攻击',attacks:1987,lastTime:'2024-01-15 14:20',status:'封锁中' },
  { ip:'91.234.56.78',cSegment:6,victimIps:31,attackType:'命令注入',attacks:1654,lastTime:'2024-01-15 14:15',status:'未封锁' },
  { ip:'23.129.64.100',cSegment:10,victimIps:28,attackType:'恶意扫描',attacks:1432,lastTime:'2024-01-15 14:10',status:'已封锁' },
];

module.exports = {
  monitorStats, securityRating, hotEvents, serverSecurity, terminalSecurity, userSecurity,
  assetStats, portTop5, eubaData, threatEvents, securityBulletins,
  monitorEventsData, monitorAlertsData, hostsData,
  assetGroups, disposalStats, disposalTableData,
  logStats, logTableData, assetOverview,
  reportCards, reportTableData,
  warningTableData, pendingEvents, processingEvents, archivedEvents, ignoredEvents, alertCenterData,
  attackerDistribution, attackerTop10,
};
