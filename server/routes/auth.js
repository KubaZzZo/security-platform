const router = require('express').Router();
const { generateToken } = require('../middleware/auth');
const { stores } = require('../data/store');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = generateToken({ username, role: '系统管理员', loginAt: Date.now() });
    stores.auditLog.insert({ action: 'login', username, ip: req.ip, success: true });
    res.json({ success: true, data: { token, user: { username: 'admin', role: '系统管理员' } } });
  } else {
    stores.auditLog.insert({ action: 'login', username, ip: req.ip, success: false });
    res.status(401).json({ success: false, error: { code: 401, message: '用户名或密码错误' } });
  }
});
router.post('/logout', (req, res) => {
  stores.auditLog.insert({ action: 'logout', username: req.user?.username, ip: req.ip });
  res.json({ success: true });
});
router.post('/change-password', (_, res) => res.json({ success: true }));
router.get('/user-info', (_, res) => res.json({
  success: true, data: {
    username: 'admin', role: '系统管理员', email: 'admin@suda.edu.cn',
    phone: '0512-65880000', department: '信息化建设与管理中心',
    lastLogin: '2026-03-22 09:15:32', loginIp: '10.10.2.105',
  },
}));
router.put('/user-info', (_, res) => res.json({ success: true }));

module.exports = router;
