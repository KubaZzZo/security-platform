const router = require('express').Router();
const d = require('../data/mockData');

router.get('/cards', (_, res) => res.json(d.reportCards));
router.get('/list', (req, res) => {
  const { type } = req.query;
  const list = type && type !== '全部' ? d.reportTableData.filter(r => r.type === type) : d.reportTableData;
  res.json({ list, total: list.length });
});
router.post('/export', (_, res) => res.json({ success: true, downloadUrl: '/downloads/report-export.pdf' }));
router.get('/export/history', (_, res) => res.json({ list: [
  { id:1,name:'安全态势报告-2024Q1',format:'PDF',createTime:'2024-01-15 10:00',size:'15.2MB',status:'已完成',operator:'admin' },
  { id:2,name:'漏洞扫描报告-2024年1月',format:'PDF',createTime:'2024-01-14 15:00',size:'8.6MB',status:'已完成',operator:'admin' },
  { id:3,name:'资产清单导出',format:'Excel',createTime:'2024-01-13 09:00',size:'3.2MB',status:'已完成',operator:'张明' },
], total: 3 }));
router.get('/subscriptions', (_, res) => res.json({ list: [
  { id:'SUB001',name:'每日安全日报',type:'日报',recipients:'admin@suda.edu.cn',schedule:'每天 08:00',status:'启用',lastSent:'2024-01-15 08:00' },
  { id:'SUB002',name:'每周安全周报',type:'周报',recipients:'security-team@suda.edu.cn',schedule:'每周一 09:00',status:'启用',lastSent:'2024-01-14 09:00' },
], total: 2 }));
router.post('/subscriptions', (_, res) => res.json({ success: true }));
router.put('/subscriptions', (_, res) => res.json({ success: true }));
router.delete('/subscriptions/:id', (_, res) => res.json({ success: true }));
router.get('/settings', (_, res) => res.json({
  smtp: { host:'smtp.suda.edu.cn',port:465,username:'security@suda.edu.cn',ssl:true },
  watermark: { enabled:false,text:'安全感知平台' },
  templates: [
    { id:1,name:'日报模板',type:'日报',lastModified:'2024-01-10' },
    { id:2,name:'周报模板',type:'周报',lastModified:'2024-01-08' },
    { id:3,name:'月报模板',type:'月报',lastModified:'2024-01-01' },
  ],
}));
router.put('/settings', (_, res) => res.json({ success: true }));

module.exports = router;
