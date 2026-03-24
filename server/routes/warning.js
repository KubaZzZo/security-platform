const router = require('express').Router();
const d = require('../data/mockData');

router.get('/list', (_, res) => res.json({ list: d.warningTableData, total: d.warningTableData.length }));
router.get('/pending', (_, res) => res.json({
  stats: { total:8,high:3,medium:3,low:2 },
  list: d.pendingEvents, total: d.pendingEvents.length,
}));
router.post('/report', (_, res) => res.json({ success: true }));
router.post('/ignore', (_, res) => res.json({ success: true }));
router.get('/processing', (_, res) => res.json({
  stats: { total:6,high:3,notified:2,handling:1 },
  list: d.processingEvents, total: d.processingEvents.length,
}));
router.post('/archive/:eventId', (_, res) => res.json({ success: true }));
router.get('/archived', (_, res) => res.json({
  stats: { total:156,high:34,medium:68,low:54 },
  list: d.archivedEvents, total: d.archivedEvents.length,
}));
router.get('/ignored', (_, res) => res.json({
  stats: { total:86,medium:5,low:81,thisMonth:12 },
  list: d.ignoredEvents, total: d.ignoredEvents.length,
}));
router.get('/alert-center', (_, res) => res.json({
  stats: { active:23,high:5,medium:12,low:6 },
  trend: { dates:['03-09','03-10','03-11','03-12','03-13','03-14','03-15'],values:[8,12,6,15,10,18,14] },
  list: d.alertCenterData, total: d.alertCenterData.length,
}));
router.get('/bulletins', (_, res) => res.json({ list: [
  { id:1,title:'关于加强校园网VPN使用安全的通知',type:'安全通知',time:'2024-03-15 10:00',author:'信息安全中心',reads:1256 },
  { id:2,title:'2024年寒假期间网络安全值班安排',type:'系统公告',time:'2024-03-14 16:30',author:'网络管理中心',reads:892 },
  { id:3,title:'校园网出口设备升级维护公告',type:'运维通告',time:'2024-03-14 09:15',author:'网络运维部',reads:2341 },
], total: 3 }));
router.post('/bulletins', (_, res) => res.json({ success: true }));
router.get('/settings', (_, res) => res.json({
  receivers: { email:true,sms:true,wechat:false,system:true,levels:['高危','中危'],timeRange:'all' },
  rules: [
    { name:'DDoS流量阈值检测',type:'流量异常',condition:'入站流量 > 500Mbps 持续5分钟',level:'高危',status:'启用' },
    { name:'端口扫描频率检测',type:'扫描探测',condition:'同一IP扫描端口 > 100个/分钟',level:'中危',status:'启用' },
    { name:'异常登录检测',type:'身份认证',condition:'同一账号失败登录 > 5次/10分钟',level:'中危',status:'启用' },
  ],
  templates: [
    { name:'邮件模板',desc:'用于发送预警邮件通知' },
    { name:'短信模板',desc:'用于发送预警短信通知' },
    { name:'企业微信模板',desc:'用于推送企业微信消息卡片' },
  ],
}));
router.put('/settings', (_, res) => res.json({ success: true }));

module.exports = router;
