# 安全感知平台 V3.0.92

校园网安全感知平台管理后台，包含前端界面与后端 API 服务。

## 技术栈

**前端（website/）**
- React 19 + TypeScript
- React Router v7（BrowserRouter）
- ECharts + echarts-for-react（环形图、柱状图、折线图）
- 纯 CSS 样式（无 UI 框架）

**后端（server/）**
- Node.js + Express
- 算法驱动的模拟数据引擎（泊松过程、Zipf分布、高斯噪声）
- 支持 10Gbps+ 链路秒级流量监控
- 5 类网络威胁检测（扫描/钓鱼/蠕虫/DDoS/暴力破解）

## 快速开始

```bash
# 启动后端
cd server
npm install
npm run dev          # http://localhost:8080

# 启动前端
cd website
npm install
npm start            # http://localhost:3000
```

构建生产版本：

```bash
cd website && npm run build
```

## 项目结构

```
├── website/                # 前端项目
│   └── src/
│       ├── api/            # API 接口层
│       ├── components/     # 布局与通用组件
│       ├── data/           # 前端模拟数据
│       ├── pages/          # 页面组件（按模块分目录）
│       ├── App.tsx         # 路由配置
│       └── index.tsx       # 入口文件
├── server/                 # 后端服务
│   ├── app.js              # Express 入口
│   ├── data/
│   │   ├── mockData.js     # 基础模拟数据
│   │   ├── trafficGenerator.js   # 流量数据算法引擎
│   │   └── securityGenerator.js  # 安全威胁检测引擎
│   └── routes/             # API 路由（13个模块）
└── README.md
```

## 功能模块

| 路径 | 模块 | 说明 |
|------|------|------|
| `/monitor` | 监控中心 | 仪表盘概览、告警、事件、主机、网络监控 |
| `/disposal` | 处置中心 | 风险资产、威胁处置、策略管理、处置记录 |
| `/analysis` | 分析中心 | 日志检索、行为分析、关联分析、威胁情报 |
| `/assets` | 资产中心 | 资产总览、资产管理、资产发现、基线配置 |
| `/reports` | 报告中心 | 预设报告、报告导出、报告订阅、报告设置 |
| `/warning` | 通报预警 | 预警接收、预警公告、告警中心、预警设置 |
| `/protection` | 重保中心 | 攻击者分析、实时监控、暴露面管理、封堵管理 |

## 后端 API

### 流量监控 `/api/traffic`

| 端点 | 说明 |
|------|------|
| `GET /realtime?seconds=60` | 秒级实时流量（10Gbps+链路采样） |
| `GET /throughput?dimension=bytes\|packets` | 24h吞吐量趋势，支持Bytes/Packets切换 |
| `GET /protocols` | 协议识别与分布（15种校园网协议） |
| `GET /hotspot` | 热点业务/应用排行 |
| `GET /top-talkers?limit=20` | Top流量IP排行 |
| `GET /overview` | 宏观概览（大屏首页） |
| `GET /ip/:ip` | 单IP详情（下钻页面） |
| `GET /ip/:ip/trend` | 单IP通信对端变化趋势 |

### 安全溯源 `/api/security`

| 端点 | 说明 |
|------|------|
| `GET /logs?type=&severity=&keyword=` | 安全日志列表（时间+类型+源目IP） |
| `GET /stats` | 威胁统计概览 |
| `GET /timeline` | 24h威胁时间线 |
| `GET /threats/scan` | 扫描攻击检测（端口扫描/IP扫描） |
| `GET /threats/phishing` | 钓鱼攻击检测（DNS/邮件钓鱼） |
| `GET /threats/worm` | 蠕虫传播检测 |
| `GET /threats/ddos` | DDoS攻击检测（SYN/UDP洪泛） |
| `GET /threats/brute-force` | 暴力破解检测 |
| `GET /ip/:ip` | 单IP安全事件（下钻） |
| `GET /threat-types` | 威胁类型定义 |

### 其他 API

| 模块 | 路径 | 端点数 |
|------|------|--------|
| 监控中心 | `/api/monitor` | 16 |
| 处置中心 | `/api/disposal` | 9 |
| 分析中心 | `/api/analysis` | 6 |
| 资产中心 | `/api/assets` | 11 |
| 报告中心 | `/api/reports` | 9 |
| 通报预警 | `/api/warning` | 13 |
| 重保中心 | `/api/protection` | 10 |
| 认证 | `/api/auth` | 5 |
| 系统设置 | `/api/system` | 2 |
| 全局数据 | `/api/global` | 4 |
| 消息 | `/api/messages` | 4 |

## 算法说明

流量数据引擎使用多种统计算法模拟真实校园网流量：

- **泊松过程** — 数据包到达模拟
- **正弦波叠加** — 日间流量波动（上课高峰 8-10/14-16 点、晚间自习、深夜低谷）
- **Zipf 分布** — 协议流行度（HTTPS > HTTP > DNS > ...）
- **高斯噪声** — 随机波动与突发流量
- **Pareto 分布** — 流大小分布（少量大流 + 大量小流）

## 布局

TopNav 固定顶部 48px，Sidebar 固定左侧 200px，内容区自适应。Sidebar 根据当前路由动态切换子菜单。

## 样式变量

```css
--primary: #1890ff      /* 主色 */
--danger: #ff4d4f       /* 危险 */
--success: #52c41a      /* 成功 */
--warning: #faad14      /* 警告 */
--bg-dark: #001529      /* 深色背景 */
--bg-content: #f0f2f5   /* 内容区背景 */
```
