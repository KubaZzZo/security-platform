const router = require('express').Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token', user: { username: 'admin', role: '系统管理员' } });
  } else {
    res.status(401).json({ message: '用户名或密码错误' });
  }
});
router.post('/logout', (_, res) => res.json({ success: true }));
router.post('/change-password', (_, res) => res.json({ success: true }));
router.get('/user-info', (_, res) => res.json({
  username: 'admin', role: '系统管理员', email: 'admin@suda.edu.cn',
  phone: '0512-65880000', department: '信息化建设与管理中心',
  lastLogin: '2026-03-22 09:15:32', loginIp: '10.10.2.105',
}));
router.put('/user-info', (_, res) => res.json({ success: true }));

module.exports = router;
