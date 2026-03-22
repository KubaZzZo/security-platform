# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

安全感知平台 (Security Intelligence Platform) V3.0.92 管理后台，基于设计稿一比一还原的 React 前端项目。

## 常用命令

```bash
cd E:/Reactweb/website
npm start          # 启动开发服务器 (localhost:3000)
npm run build      # 生产构建，输出到 build/
npm test           # 运行测试 (Jest + React Testing Library)
```

## 技术栈

- React 19 + TypeScript (Create React App)
- React Router v6 (BrowserRouter，路由在 App.tsx)
- ECharts + echarts-for-react (图表：环形图、柱状图、折线图)
- 纯 CSS 样式（每个组件/页面对应一个 .css 文件）

## 架构

### 布局系统
`Layout.tsx` 使用 `<Outlet />` 渲染子路由。TopNav 固定顶部 48px，Sidebar 固定左侧 200px，内容区自适应。

### 路由映射
| 路径 | 页面 | 说明 |
|------|------|------|
| `/monitor` | Monitor | 监控中心概览（仪表盘） |
| `/disposal` | Disposal | 处置中心（风险资产视角） |
| `/analysis` | Analysis | 分析中心（日志检索） |
| `/assets` | Assets | 资产中心（总览） |
| `/reports` | Reports | 报告中心（预设报告） |
| `/warning` | Warning | 通报预警（收到的预警） |
| `/protection` | Protection | 重保中心（攻击者分析） |

根路径 `/` 自动重定向到 `/monitor`。

### Sidebar 动态菜单
`Sidebar.tsx` 内部维护 `sidebarConfig` 对象，根据当前路由的第一段路径匹配对应子菜单。每个菜单项有 SVG 图标。

### 数据层
所有模拟数据集中在 `src/data/mockData.ts`，按页面分区导出。无后端 API 调用。

### 通用组件
- `DataTable` — 带分页的数据表格，接收 `columns` (支持自定义 render) 和 `data`
- `StatCard` — 统计卡片，支持 icon/trend/active 状态
- `FilterBar` — 筛选栏，支持 select/input/date/button 类型

## 样式约定

CSS 变量定义在 `index.css` 的 `:root` 中：
- 主色: `--primary: #1890ff`
- 危险: `--danger: #ff4d4f`
- 成功: `--success: #52c41a`
- 警告: `--warning: #faad14`
- 深色背景: `--bg-dark: #001529`（导航/侧边栏）
- 内容区背景: `--bg-content: #f0f2f5`

## 设计稿

原始设计截图在 `src/assets/images/` 目录下，共 7 张 PNG 对应 7 个页面。
