# 安全感知平台 V3.0.92

安全感知平台管理后台，基于设计稿一比一还原的 React 前端项目。

## 技术栈

- React 19 + TypeScript
- React Router v7（BrowserRouter）
- ECharts + echarts-for-react（环形图、柱状图、折线图）
- 纯 CSS 样式（无 UI 框架）

## 快速开始

```bash
cd website
npm install
npm start
```

访问 http://localhost:3000，默认跳转到监控中心。

构建生产版本：

```bash
npm run build
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

## 项目结构

```
website/src/
├── api/              # API 接口层（含 mock）
├── assets/images/    # 设计稿截图
├── components/
│   ├── Layout/       # 布局组件（TopNav + Sidebar + Outlet）
│   └── common/       # 通用组件（DataTable、FilterBar）
├── data/             # 模拟数据（mockData.ts）
├── pages/            # 页面组件（按模块分目录）
├── App.tsx           # 路由配置
└── index.tsx         # 入口文件
```

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
