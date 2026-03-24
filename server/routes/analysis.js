const router = require('express').Router();
const d = require('../data/mockData');

router.get('/log-stats', (_, res) => res.json(d.logStats));
router.get('/logs', (_, res) => res.json({ list: d.logTableData, total: d.logTableData.length }));
router.get('/correlation', (_, res) => res.json({ stats: { totalRules:24,triggered:8,highSeverity:3 }, list: [
  { id:1,ruleName:'横向移动检测',ruleType:'行为关联',severity:'高危',matchCount:12,lastMatch:'2024-01-15 14:30',status:'活跃',desc:'检测到同一源IP在短时间内访问多个内网主机' },
  { id:2,ruleName:'数据外泄检测',ruleType:'流量关联',severity:'高危',matchCount:5,lastMatch:'2024-01-15 13:20',status:'活跃',desc:'检测到大量数据向外部IP传输' },
  { id:3,ruleName:'权限提升检测',ruleType:'日志关联',severity:'中危',matchCount:8,lastMatch:'2024-01-15 12:10',status:'活跃',desc:'检测到普通用户执行管理员权限操作' },
  { id:4,ruleName:'C2通信检测',ruleType:'行为关联',severity:'高危',matchCount:3,lastMatch:'2024-01-15 11:05',status:'处置中',desc:'检测到与已知C2服务器的周期性通信' },
], total: 4 }));
router.get('/behavior', (_, res) => res.json({
  stats: { totalUsers:2048,anomalyUsers:23,highRisk:5,newAnomalies:8 },
  trend: { dates:['01-09','01-10','01-11','01-12','01-13','01-14','01-15'], anomaly:[12,15,8,20,14,18,23], baseline:[10,10,10,10,10,10,10] },
  list: [
    { username:'user_admin01',department:'信息中心',riskScore:92,anomalyType:'异常时间登录',detail:'凌晨3:00登录系统',time:'2024-01-15 03:00',status:'待确认' },
    { username:'user_dev03',department:'开发部',riskScore:85,anomalyType:'大量数据下载',detail:'下载数据量超过日常10倍',time:'2024-01-15 10:30',status:'调查中' },
    { username:'user_test05',department:'测试部',riskScore:68,anomalyType:'异地登录',detail:'从异常IP地址登录',time:'2024-01-15 09:15',status:'已确认' },
  ], total: 3
}));
router.get('/threat-intel', (_, res) => res.json({ stats: { sources:8,totalIoc:45678,todayMatch:234,activeThreats:89 }, list: [
  { ioc:'203.0.113.45',iocType:'IP',threatType:'C2服务器',confidence:95,source:'国家互联网应急中心',firstSeen:'2026-03-10',lastMatch:'2026-03-22 10:00:00',relatedEvents:12 },
  { ioc:'malware.evil-domain.com',iocType:'域名',threatType:'钓鱼域名',confidence:90,source:'微步在线',firstSeen:'2026-03-15',lastMatch:'2026-03-22 09:30:00',relatedEvents:8 },
  { ioc:'e3b0c44298fc1c149afb',iocType:'Hash',threatType:'勒索软件',confidence:98,source:'VirusTotal',firstSeen:'2026-03-08',lastMatch:'2026-03-21 22:15:00',relatedEvents:3 },
], total: 3 }));
router.get('/flows', (_, res) => res.json({ list: [
  { srcIp:'192.168.1.100',srcPort:45678,dstIp:'10.0.1.8',dstPort:443,protocol:'TCP',bytes:1256000,packets:856,startTime:'2024-01-15 14:30:00',duration:'00:05:30' },
  { srcIp:'172.16.5.33',srcPort:52341,dstIp:'10.0.2.3',dstPort:80,protocol:'TCP',bytes:856000,packets:654,startTime:'2024-01-15 14:25:00',duration:'00:03:20' },
], total: 2 }));

module.exports = router;
