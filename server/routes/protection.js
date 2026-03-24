const router = require('express').Router();
const d = require('../data/mockData');

router.get('/attacker-distribution', (req, res) => {
  const region = req.query.region || 'domestic';
  res.json(d.attackerDistribution[region] || d.attackerDistribution.domestic);
});
router.get('/attacker-top10', (_, res) => res.json(d.attackerTop10));
router.get('/realtime', (_, res) => res.json({
  stats: { total:1563,high:156,medium:432,low:975 },
  trend: { hours:['08:00','09:00','10:00','11:00','12:00','13:00','14:00'], values:[45,68,92,78,56,89,120] },
  typeDistribution: [{ name:'Web攻击',value:35 },{ name:'暴力破解',value:25 },{ name:'恶意扫描',value:20 },{ name:'漏洞利用',value:15 },{ name:'其他',value:5 }],
  list: [
    { id:1,name:'SQL注入攻击',srcIp:'45.227.253.101',dstIp:'10.0.1.8',type:'Web攻击',severity:'高危',time:'2024-01-15 14:30',status:'已封锁' },
    { id:2,name:'SSH暴力破解',srcIp:'103.45.67.89',dstIp:'10.0.0.5',type:'暴力破解',severity:'中危',time:'2024-01-15 14:25',status:'告警中' },
    { id:3,name:'端口扫描',srcIp:'185.220.101.45',dstIp:'192.168.1.0/24',type:'恶意扫描',severity:'低危',time:'2024-01-15 14:20',status:'已封锁' },
  ], total: 3,
}));
router.get('/block-list', (_, res) => res.json({ stats: { total:2456,active:1890,expired:566 }, list: [
  { ip:'45.227.253.101',source:'自动封锁',reason:'SQL注入攻击',blockTime:'2024-01-15 14:30',expireTime:'2024-01-16 14:30',status:'生效中',hits:234 },
  { ip:'103.45.67.89',source:'手动封锁',reason:'暴力破解',blockTime:'2024-01-15 13:00',expireTime:'永久',status:'生效中',hits:156 },
  { ip:'185.220.101.45',source:'情报联动',reason:'已知恶意IP',blockTime:'2024-01-14 10:00',expireTime:'2024-01-21 10:00',status:'生效中',hits:89 },
], total: 3 }));
router.post('/block', (_, res) => res.json({ success: true }));
router.post('/unblock/:ip', (_, res) => res.json({ success: true }));
router.post('/block/import', (req, res) => res.json({ success: true, count: (req.body.ips || []).length }));
router.get('/threat-intel', (_, res) => res.json({
  stats: { sources:12,activeIoc:8956,todayHits:167,highRisk:234 },
  hitTrend: { dates:['03-09','03-10','03-11','03-12','03-13','03-14','03-15'], values:[120,98,145,167,134,189,167] },
  typeDistribution: [{ name:'钓鱼攻击',value:156 },{ name:'僵尸网络',value:267 },{ name:'挖矿木马',value:189 },{ name:'勒索软件',value:98 },{ name:'APT攻击',value:345 }],
  list: [
    { ioc:'103.45.67.0/24',type:'IP',tag:'APT攻击',confidence:95,hits:234,lastHit:'2024-03-15 10:12:00',source:'国家威胁情报中心' },
    { ioc:'evil-domain.example.com',type:'域名',tag:'钓鱼攻击',confidence:88,hits:156,lastHit:'2024-03-15 09:45:00',source:'教育行业情报共享' },
    { ioc:'a1b2c3d4e5f6...',type:'Hash',tag:'勒索软件',confidence:92,hits:12,lastHit:'2024-03-15 08:30:00',source:'开源情报社区' },
  ], total: 3,
}));
router.post('/block/add-ioc', (_, res) => res.json({ success: true }));
router.get('/exposure', (_, res) => res.json({
  stats: { totalExposed:45,highRisk:8,ports:156,services:89 },
  areaDistribution: [{ name:'教学区',value:15 },{ name:'行政区',value:10 },{ name:'宿舍区',value:8 },{ name:'科研区',value:7 },{ name:'图书馆',value:5 }],
  list: [
    { ip:'202.195.1.100',port:80,service:'HTTP',version:'Apache 2.4.41',risk:'高危',exposure:'公网可访问',lastScan:'2024-03-15 08:00' },
    { ip:'202.195.1.101',port:443,service:'HTTPS',version:'Nginx 1.18',risk:'低危',exposure:'公网可访问',lastScan:'2024-03-15 08:00' },
    { ip:'202.195.1.102',port:22,service:'SSH',version:'OpenSSH 7.9',risk:'中危',exposure:'公网可访问',lastScan:'2024-03-15 08:00' },
  ], total: 3,
}));

module.exports = router;
