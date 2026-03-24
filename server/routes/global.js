const router = require('express').Router();

router.get('/areas', (_, res) => res.json([
  { name:'教学区',devices:256,online:240,alerts:12,risk:'低' },
  { name:'行政区',devices:128,online:120,alerts:5,risk:'低' },
  { name:'宿舍区',devices:512,online:480,alerts:23,risk:'中' },
  { name:'科研区',devices:64,online:60,alerts:8,risk:'低' },
  { name:'图书馆',devices:32,online:30,alerts:2,risk:'低' },
  { name:'数据中心',devices:48,online:48,alerts:15,risk:'高' },
]));
router.get('/stats', (_, res) => res.json({ totalDevices:1408,online:1312,alerts:65,threats:23,bandwidth:'8.6Gbps' }));
router.get('/traffic-trend', (_, res) => res.json({
  hours: ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'],
  series: [
    { name:'入站',data:[2.1,3.5,4.2,5.1,4.8,5.6,6.2,5.8,4.5,3.2] },
    { name:'出站',data:[1.8,2.9,3.5,4.2,3.9,4.5,5.1,4.8,3.8,2.6] },
  ],
}));
router.get('/alerts', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const alerts = [
    { id:1,title:'数据中心检测到异常流量',level:'高危',time:'2024-01-15 14:30',area:'数据中心' },
    { id:2,title:'宿舍区发现挖矿行为',level:'中危',time:'2024-01-15 14:25',area:'宿舍区' },
    { id:3,title:'教学区端口扫描告警',level:'低危',time:'2024-01-15 14:20',area:'教学区' },
    { id:4,title:'科研区服务器异常外联',level:'中危',time:'2024-01-15 14:15',area:'科研区' },
    { id:5,title:'行政区弱口令告警',level:'低危',time:'2024-01-15 14:10',area:'行政区' },
  ];
  res.json(alerts.slice(0, limit));
});

module.exports = router;
