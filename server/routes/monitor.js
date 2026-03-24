const router = require('express').Router();
const d = require('../data/mockData');

router.get('/stats', (_, res) => res.json(d.monitorStats));
router.get('/security-rating', (_, res) => res.json(d.securityRating));
router.get('/hot-events', (_, res) => res.json(d.hotEvents));
router.get('/server-security', (_, res) => res.json(d.serverSecurity));
router.get('/terminal-security', (_, res) => res.json(d.terminalSecurity));
router.get('/user-security', (_, res) => res.json(d.userSecurity));
router.get('/asset-stats', (_, res) => res.json(d.assetStats));
router.get('/port-top5', (_, res) => res.json(d.portTop5));
router.get('/euba-trend', (_, res) => res.json(d.eubaData));
router.get('/threat-events', (_, res) => res.json(d.threatEvents));
router.get('/bulletins', (req, res) => {
  const { type } = req.query;
  const data = type && type !== '全部' ? d.securityBulletins.filter(b => b.type === type) : d.securityBulletins;
  res.json(data);
});
router.get('/events', (_, res) => res.json({ list: d.monitorEventsData, total: d.monitorEventsData.length }));
router.get('/alerts', (req, res) => {
  const { status } = req.query;
  const list = status ? d.monitorAlertsData.filter(a => a.status === status) : d.monitorAlertsData;
  res.json({ list, total: list.length });
});
router.get('/hosts', (_, res) => res.json({ list: d.hostsData, total: d.hostsData.length }));
router.get('/hosts/:ip', (req, res) => {
  const host = d.hostsData.find(h => h.ip === req.params.ip);
  res.json(host || null);
});
router.get('/network/throughput', (_, res) => res.json({ current: 8.6, unit: 'Gbps', activeIps: 12458, connections: 856432, todayTraffic: 2.8 }));
router.get('/network/protocols', (_, res) => res.json([
  { name:'HTTP/HTTPS',value:45,color:'#1890ff' },{ name:'DNS',value:20,color:'#52c41a' },
  { name:'SSH',value:12,color:'#faad14' },{ name:'SMTP',value:8,color:'#ff4d4f' },{ name:'其他',value:15,color:'#722ed1' },
]));
router.get('/network/top-flows', (_, res) => res.json({ list: [
  { srcIp:'192.168.1.100',dstIp:'10.0.1.8',protocol:'HTTPS',bytes:1256000000,packets:856432,duration:'02:15:30' },
  { srcIp:'172.16.5.33',dstIp:'10.0.2.3',protocol:'HTTP',bytes:856000000,packets:654321,duration:'01:45:20' },
], total: 2 }));

module.exports = router;
