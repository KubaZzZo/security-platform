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
- 6 大算法引擎（异常检测/流量预测/风险评分/攻击链关联/DPI深度包检测/IP行为画像）

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
│   │   ├── securityGenerator.js  # 安全威胁检测引擎
│   │   └── algorithms/           # 算法引擎模块
│   │       ├── anomalyDetection.js   # 异常检测
│   │       ├── prediction.js         # 流量预测
│   │       ├── riskScoring.js        # 风险评分
│   │       ├── attackCorrelation.js  # 攻击链关联
│   │       ├── dpi.js                # 深度包检测
│   │       └── ipProfiling.js        # IP行为画像
│   └── routes/             # API 路由（15个模块）
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

### 算法引擎 `/api/algorithms`

| 端点 | 说明 |
|------|------|
| `GET /overview` | 所有算法模块能力清单 |
| `GET /anomaly/traffic?method=ensemble&seconds=120` | 实时流量异常检测（Z-Score/EWMA/滑动窗口/融合） |
| `POST /anomaly/detect` | 自定义数据异常检测 |
| `GET /predict/throughput?hours=6&method=holt-winters` | 流量预测（SMA/指数平滑/Holt-Winters/回归/融合） |
| `GET /predict/seasonal` | 季节性分解（趋势+季节+残差） |
| `GET /risk/ip/:ip` | 单IP多因子风险评分 |
| `GET /risk/batch?limit=20` | 批量IP风险评分排行 |
| `GET /risk/overview` | 风险概览仪表盘 |
| `GET /correlation/killchain` | Kill Chain 7阶段映射分析 |
| `GET /correlation/clusters` | 安全事件时间-IP聚类 |
| `GET /correlation/campaigns` | 攻击战役识别 + 关联规则匹配 |
| `GET /correlation/graph` | 攻击路径图数据（可视化用） |
| `GET /dpi/report?flows=100` | DPI深度包检测完整报告 |
| `POST /dpi/identify` | 单流应用指纹识别 |
| `POST /dpi/compliance` | 协议合规性检测 |
| `GET /dpi/fingerprints` | 应用指纹库 + JA3指纹库 |
| `GET /profile/ip/:ip` | 单IP完整行为画像 |
| `GET /profile/ip/:ip/deviation` | 单IP行为偏差分析 |
| `GET /profile/batch?limit=20` | 批量IP画像 + 设备分类 |

## 算法引擎详解

### 1. 流量数据生成引擎

模拟真实校园网 10Gbps+ 链路流量：

| 算法 | 用途 |
|------|------|
| 泊松过程 | 数据包到达模拟 |
| 正弦波叠加 | 日间流量波动（上课高峰 8-10/14-16 点、晚间自习、深夜低谷） |
| Zipf 分布 | 协议流行度分布（HTTPS > HTTP > DNS > ...） |
| 高斯噪声 | 随机波动与突发流量 |
| Pareto 分布 | 流大小分布（少量大流 + 大量小流） |

### 2. 异常检测引擎 `anomalyDetection.js`

| 方法 | 原理 | 适用场景 |
|------|------|----------|
| Z-Score | 基于标准差的离群点检测 | 静态阈值异常 |
| EWMA | 指数加权移动平均，近期数据权重更高 | 趋势突变检测 |
| 滑动窗口 | 固定窗口内局部统计量变化 | 局部突发检测 |
| Grubbs 检验 | 单离群点假设检验 | 极端值判定 |
| 基线偏差 | 当前数据与历史基线对比 | 周期性异常 |
| 多算法融合 | 投票机制，多算法交叉验证 | 高置信度检测 |

### 3. 流量预测引擎 `prediction.js`

| 方法 | 原理 | 特点 |
|------|------|------|
| SMA | 简单移动平均 | 短期趋势平滑 |
| SES | 单次指数平滑 | 无趋势平稳序列 |
| Holt 线性 | 双参数指数平滑 | 捕捉线性趋势 |
| Holt-Winters | 三次指数平滑（趋势+季节） | 周期性流量预测（24h周期） |
| 线性回归 | 最小二乘法 + 置信区间 | 趋势外推 + 不确定性量化 |
| 多模型融合 | 加权平均（Holt 40% + 回归 25% + SES 20% + SMA 15%） | 综合预测 |

### 4. 风险评分模型 `riskScoring.js`

五维加权评分矩阵，输出 0-100 风险分：

```
综合风险分 = Σ(维度评分 × 权重) × 资产价值系数

维度权重：
├── 威胁事件评分    35%  ← 事件数量×严重度 + 多样性加成 + 时间密度
├── 流量异常度      20%  ← 基线偏差 + 突发频率 + 零流量异常 + 协议熵
├── 协议行为评分    15%  ← 高危协议使用 + 非标准端口 + 协议数量异常
├── 通信模式评分    15%  ← 对端数量 + 外部连接比 + 目标集中度 + 新对端突增
└── 历史风险衰减    15%  ← 指数衰减（半衰期24h）
```

风险等级：严重(≥80) → 高危(≥60) → 中危(≥40) → 低危(≥20) → 安全(<20)

### 5. 攻击链关联引擎 `attackCorrelation.js`

基于 Cyber Kill Chain 模型的 7 阶段映射：

```
侦察 → 武器化 → 投递 → 利用 → 安装 → C2通信 → 目标达成
 │                  │       │       │
端口扫描        钓鱼邮件  暴力破解  蠕虫传播    ← 自动映射
IP扫描          DNS钓鱼   漏洞利用  恶意软件
```

核心能力：
- 时间-IP 多维聚类：将时间窗口内涉及相同 IP 的事件自动聚类
- 5 条预置关联规则：识别「扫描→暴力破解→蠕虫」等典型攻击链
- 攻击战役识别：合并有 IP 重叠的聚类，识别协同攻击
- 攻击路径图：生成节点(IP)+边(攻击)的图数据，支持可视化

### 6. DPI 深度包检测 `dpi.js`

超越端口号的应用识别：

| 能力 | 说明 |
|------|------|
| 应用指纹库 | 18 种校园网应用（教学/办公/科研/娱乐/安全风险 5 大类） |
| 多维特征匹配 | 端口(30%) + TLS(15%) + 包大小高斯相似度(30%) + 流量模式(25%) |
| JA3/TLS 指纹 | 10 种 TLS 客户端指纹（含 Tor/Cobalt Strike 等恶意工具） |
| 协议合规检测 | DNS 隧道、非标准端口、数据外泄、协议滥用检测 |

### 7. IP 行为画像引擎 `ipProfiling.js`

为每个 IP 建立四维行为基线：

| 维度 | 基线内容 | 偏差检测方法 |
|------|----------|-------------|
| 流量 | 24h 逐小时均值±标准差 | Z-Score 偏差 |
| 协议 | 常用协议及比例分布 | 余弦相似度 |
| 通信 | 常见对端 IP 及频率 | 未知对端比例 |
| 时间 | 活跃时段概率分布 | 非常规时段活动检测 |

设备自动分类：服务器 / 工作站 / 移动设备 / IoT / 打印机（基于行为模板匹配）

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
