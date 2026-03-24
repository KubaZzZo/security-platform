const router = require('express').Router();
const d = require('../data/mockData');

router.get('/asset-groups', (_, res) => res.json(d.assetGroups));
router.get('/stats', (_, res) => res.json(d.disposalStats));
router.get('/list', (_, res) => res.json({ list: d.disposalTableData, total: d.disposalTableData.length }));
router.post('/execute', (_, res) => res.json({ success: true }));
router.get('/risk-users', (_, res) => res.json({ list: [
  { username:'user_admin01',type:'管理员',riskLevel:'高危',riskScore:92,abnormalLogins:15,lastLogin:'2024-01-15 14:20',status:'在线' },
  { username:'user_dev03',type:'开发',riskLevel:'高危',riskScore:85,abnormalLogins:12,lastLogin:'2024-01-15 13:10',status:'在线' },
  { username:'user_test05',type:'测试',riskLevel:'中危',riskScore:68,abnormalLogins:8,lastLogin:'2024-01-15 12:00',status:'离线' },
  { username:'user_ops02',type:'运维',riskLevel:'中危',riskScore:62,abnormalLogins:5,lastLogin:'2024-01-15 11:30',status:'在线' },
  { username:'user_hr01',type:'人事',riskLevel:'低危',riskScore:35,abnormalLogins:2,lastLogin:'2024-01-15 10:15',status:'离线' },
], total: 5 }));
router.get('/threats', (_, res) => res.json({ stats: { total:486,high:23,medium:89,low:374 }, list: [
  { name:'SQL注入攻击',category:'Web攻击',severity:'高危',affectedAssets:12,events:156,firstSeen:'2024-01-10',lastSeen:'2024-01-15 14:30',status:'活跃' },
  { name:'SSH暴力破解',category:'暴力破解',severity:'中危',affectedAssets:8,events:89,firstSeen:'2024-01-12',lastSeen:'2024-01-15 13:20',status:'活跃' },
  { name:'恶意文件传播',category:'恶意软件',severity:'高危',affectedAssets:5,events:34,firstSeen:'2024-01-14',lastSeen:'2024-01-15 12:10',status:'处置中' },
], total: 3 }));
router.get('/strategies', (_, res) => res.json({ list: [
  { id:1,name:'高危漏洞自动封锁',type:'自动响应',trigger:'检测到高危漏洞利用',action:'自动封锁源IP 24小时',status:'启用',execCount:156 },
  { id:2,name:'暴力破解防护',type:'自动响应',trigger:'同一IP登录失败>10次/5分钟',action:'封锁IP 1小时',status:'启用',execCount:89 },
  { id:3,name:'DDoS流量清洗',type:'联动响应',trigger:'入站流量>500Mbps',action:'启动流量清洗',status:'启用',execCount:12 },
], total: 3 }));
router.post('/strategies', (_, res) => res.json({ success: true }));
router.put('/strategies', (_, res) => res.json({ success: true }));
router.get('/records', (_, res) => res.json({ list: [
  { id:1,asset:'192.168.1.100',type:'封锁IP',operator:'系统自动',time:'2024-01-15 14:30',result:'成功',detail:'封锁攻击源IP 45.227.253.101' },
  { id:2,asset:'192.168.1.105',type:'隔离终端',operator:'张明',time:'2024-01-15 13:20',result:'成功',detail:'隔离感染终端并清除恶意文件' },
  { id:3,asset:'192.168.1.110',type:'漏洞修复',operator:'李华',time:'2024-01-15 12:10',result:'成功',detail:'修复Apache Log4j2漏洞' },
], total: 3 }));

module.exports = router;
