const router = require('express').Router();

router.get('/settings', (_, res) => res.json({
  siteName: '安全感知平台', sessionTimeout: 30, logRetention: 90,
  autoRefresh: true, refreshInterval: 60, emailNotify: true,
  smsNotify: false, loginVerify: true, ipWhitelist: false, maxLoginAttempts: 5,
}));
router.put('/settings', (_, res) => res.json({ success: true }));

module.exports = router;
