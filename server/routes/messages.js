const router = require('express').Router();

const messages = [
  { id:1,title:'高危漏洞预警：Apache Log4j2',type:'预警',content:'检测到Apache Log4j2远程代码执行漏洞',time:'2024-01-15 14:30',read:false },
  { id:2,title:'系统维护通知',type:'系统',content:'计划于今晚22:00进行系统升级维护',time:'2024-01-15 10:00',read:false },
  { id:3,title:'安全日报已生成',type:'报告',content:'2024年1月15日安全日报已自动生成',time:'2024-01-15 08:00',read:false },
  { id:4,title:'封锁IP到期提醒',type:'系统',content:'IP 103.45.67.89 的封锁将于明日到期',time:'2024-01-14 16:00',read:true },
  { id:5,title:'资产扫描完成',type:'系统',content:'全网资产扫描已完成，发现12个新设备',time:'2024-01-14 08:30',read:true },
];

router.get('/', (req, res) => {
  const { type, read } = req.query;
  let list = messages;
  if (type) list = list.filter(m => m.type === type);
  if (read !== undefined) list = list.filter(m => m.read === (read === 'true'));
  res.json({ list, total: list.length, unreadCount: messages.filter(m => !m.read).length });
});
router.put('/:id/read', (req, res) => {
  const msg = messages.find(m => m.id === parseInt(req.params.id));
  if (msg) msg.read = true;
  res.json({ success: true });
});
router.put('/read-all', (_, res) => {
  messages.forEach(m => m.read = true);
  res.json({ success: true });
});
router.get('/unread-count', (_, res) => res.json({ count: messages.filter(m => !m.read).length }));

module.exports = router;
