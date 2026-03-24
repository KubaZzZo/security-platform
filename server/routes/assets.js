const router = require('express').Router();
const d = require('../data/mockData');

router.get('/overview', (_, res) => res.json(d.assetOverview));
router.get('/list', (_, res) => res.json({ list: [
  { id:'A001',ip:'192.168.1.100',hostname:'web-server-01',type:'服务器',os:'CentOS 7.9',status:'在线',riskLevel:'高危',department:'信息中心',lastScan:'2024-01-15 08:00' },
  { id:'A002',ip:'192.168.1.105',hostname:'PC-ZHANGSAN',type:'终端',os:'Windows 10',status:'在线',riskLevel:'中危',department:'教学部',lastScan:'2024-01-15 08:00' },
  { id:'A003',ip:'192.168.1.110',hostname:'db-server-01',type:'服务器',os:'Ubuntu 22.04',status:'在线',riskLevel:'低危',department:'信息中心',lastScan:'2024-01-15 08:00' },
  { id:'A004',ip:'192.168.1.115',hostname:'iot-camera-01',type:'物联网',os:'Linux',status:'离线',riskLevel:'中危',department:'后勤部',lastScan:'2024-01-14 08:00' },
  { id:'A005',ip:'192.168.1.120',hostname:'PC-LISI',type:'终端',os:'Windows 11',status:'在线',riskLevel:'低危',department:'行政部',lastScan:'2024-01-15 08:00' },
], total: 5 }));
router.post('/', (_, res) => res.json({ success: true }));
router.put('/:id', (_, res) => res.json({ success: true }));
router.delete('/:id', (_, res) => res.json({ success: true }));
router.get('/baseline', (_, res) => res.json({ stats: { total:1408,compliant:1200,nonCompliant:150,unchecked:58 }, distribution: d.assetOverview.baselineDistribution, list: [
  { ip:'192.168.1.100',hostname:'web-server-01',area:'信息中心',checkItems:45,passed:38,failed:7,result:'不合规',lastCheck:'2024-01-15 08:00' },
  { ip:'192.168.1.105',hostname:'PC-ZHANGSAN',area:'教学部',checkItems:32,passed:32,failed:0,result:'合规',lastCheck:'2024-01-15 08:00' },
  { ip:'192.168.1.110',hostname:'db-server-01',area:'信息中心',checkItems:50,passed:48,failed:2,result:'不合规',lastCheck:'2024-01-15 08:00' },
], total: 3 }));
router.get('/discovery', (_, res) => res.json({ stats: { scanned:2048,newFound:12,unmanaged:45 }, list: [
  { ip:'192.168.2.50',mac:'AA:BB:CC:DD:EE:01',type:'未知',firstSeen:'2024-01-15 10:00',lastSeen:'2024-01-15 14:30',ports:'80,443,22',status:'未纳管' },
  { ip:'192.168.2.51',mac:'AA:BB:CC:DD:EE:02',type:'终端',firstSeen:'2024-01-14 09:00',lastSeen:'2024-01-15 14:25',ports:'135,445',status:'未纳管' },
], total: 2 }));
router.post('/manage', (_, res) => res.json({ success: true }));
router.get('/config/scan', (_, res) => res.json({ period:'每天',time:'02:00',range:'10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16',concurrency:100 }));
router.put('/config/scan', (_, res) => res.json({ success: true }));
router.get('/config/baseline-rules', (_, res) => res.json({ list: [
  { id:1,name:'SSH安全配置',category:'系统安全',checkItems:8,enabled:true },
  { id:2,name:'密码策略检查',category:'身份认证',checkItems:6,enabled:true },
  { id:3,name:'防火墙规则检查',category:'网络安全',checkItems:12,enabled:true },
  { id:4,name:'日志审计配置',category:'审计合规',checkItems:5,enabled:false },
], total: 4 }));

module.exports = router;
