const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// 路由挂载
app.use('/api/monitor', require('./routes/monitor'));
app.use('/api/disposal', require('./routes/disposal'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/warning', require('./routes/warning'));
app.use('/api/protection', require('./routes/protection'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/system', require('./routes/system'));
app.use('/api/global', require('./routes/global'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/traffic', require('./routes/traffic'));
app.use('/api/security', require('./routes/security'));
app.use('/api/algorithms', require('./routes/algorithms'));

app.listen(PORT, () => {
  console.log(`安全感知平台后端已启动: http://localhost:${PORT}`);
});
