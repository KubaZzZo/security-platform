# 安全感知平台 API 接口文档

> 版本：V3.0.92
> 基础路径：`http://localhost:8080/api`
> 配置文件：`src/api/config.ts`（`USE_MOCK = true` 时使用前端 Mock 数据，设为 `false` 切换真实后端）

---

## 目录

1. [通用说明](#1-通用说明)
2. [认证与用户 /auth](#2-认证与用户)
3. [系统设置 /system](#3-系统设置)
4. [消息中心 /messages](#4-消息中心)
5. [全局视角 /global](#5-全局视角)
6. [监控中心 /monitor](#6-监控中心)
7. [处置中心 /disposal](#7-处置中心)
8. [分析中心 /analysis](#8-分析中心)
9. [资产中心 /assets](#9-资产中心)
10. [报告中心 /reports](#10-报告中心)
11. [通报预警 /warning](#11-通报预警)
12. [重保中心 /protection](#12-重保中心)

---

## 1. 通用说明

### 请求格式
- Content-Type: `application/json`
- 认证方式：Bearer Token（在 `config.ts` 的 `request()` 中添加 `Authorization` header）

### 通用分页参数
| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码，从 1 开始 |
| pageSize | number | 每页条数，默认 10 |

### 通用响应格式
```json
// 列表类
{ "list": [], "total": 0 }

// 操作类
{ "success": true }
```

### 前端调用方式
```typescript
import { monitorApi, systemApi } from '../api';
import { useApi } from '../api/useApi';

// 方式一：直接调用
const stats = await monitorApi.getMonitorStats();

// 方式二：配合 Hook（自动管理 loading/error）
const { data, loading, error, refresh } = useApi(() => monitorApi.getMonitorStats());
```

---

## 2. 认证与用户

### 2.1 用户登录
- **POST** `/auth/login`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

- 响应：`{ token: string, user: { username: string, role: string } }`

### 2.2 用户登出
- **POST** `/auth/logout`
- 响应：`{ success: boolean }`

### 2.3 修改密码
- **POST** `/auth/change-password`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| oldPassword | string | 是 | 当前密码 |
| newPassword | string | 是 | 新密码（≥8位） |

- 响应：`{ success: boolean }`

### 2.4 获取用户信息
- **GET** `/auth/user-info`
- 响应：

```typescript
interface UserInfo {
  username: string;     // 用户名
  role: string;         // 角色
  email: string;        // 邮箱
  phone: string;        // 联系电话
  department: string;   // 所属部门
  lastLogin: string;    // 上次登录时间
  loginIp: string;      // 登录IP
}
```

### 2.5 更新用户信息
- **PUT** `/auth/user-info`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 否 | 邮箱 |
| phone | string | 否 | 联系电话 |
| department | string | 否 | 所属部门 |

- 响应：`{ success: boolean }`

---

## 3. 系统设置

### 3.1 获取系统设置
- **GET** `/system/settings`
- 响应：

```typescript
interface SystemSettingsData {
  siteName: string;        // 平台名称
  sessionTimeout: number;  // 会话超时（分钟）
  logRetention: number;    // 日志保留天数
  autoRefresh: boolean;    // 自动刷新开关
  refreshInterval: number; // 刷新间隔（秒）
  emailNotify: boolean;    // 邮件通知
  smsNotify: boolean;      // 短信通知
  loginVerify: boolean;    // 登录二次验证
  ipWhitelist: boolean;    // IP白名单
  maxLoginAttempts: number; // 最大登录尝试次数
}
```

### 3.2 保存系统设置
- **PUT** `/system/settings`
- 请求体：同 `SystemSettingsData`
- 响应：`{ success: boolean }`

---

## 4. 消息中心

### 4.1 获取消息列表
- **GET** `/messages`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| type | string | 消息类型 |
| read | boolean | 是否已读 |
| page | number | 页码 |
| pageSize | number | 每页条数 |

- 响应：`{ list: Message[], total: number, unreadCount: number }`

### 4.2 标记消息已读
- **PUT** `/messages/{id}/read`
- 响应：`{ success: boolean }`

### 4.3 全部标记已读
- **PUT** `/messages/read-all`
- 响应：`{ success: boolean }`

### 4.4 获取未读消息数
- **GET** `/messages/unread-count`
- 响应：`{ count: number }`

---

## 5. 全局视角

### 5.1 获取各区域概览
- **GET** `/global/areas`
- 响应：`AreaInfo[]`

### 5.2 获取全网统计
- **GET** `/global/stats`
- 响应：全网汇总统计对象

### 5.3 获取各区域流量趋势
- **GET** `/global/traffic-trend`
- 查询参数：`area`（可选，区域名称）
- 响应：`{ hours: string[], series: SeriesData[] }`

### 5.4 获取最新告警
- **GET** `/global/alerts`
- 查询参数：`limit`（条数，默认 10）
- 响应：`AlertItem[]`

---

## 6. 监控中心

### 6.1 获取概览统计
- **GET** `/monitor/stats`
- 响应：监控中心顶部统计卡片数据（今日告警、待处理事件、在线资产等）

### 6.2 获取安全评分
- **GET** `/monitor/security-rating`
- 响应：安全评分及各维度得分

### 6.3 获取热点事件
- **GET** `/monitor/hot-events`
- 响应：`string[]`（热点事件标题列表）

### 6.4 获取服务器安全感知
- **GET** `/monitor/server-security`
- 响应：服务器安全状态统计

### 6.5 获取终端安全感知
- **GET** `/monitor/terminal-security`
- 响应：终端安全状态统计

### 6.6 获取用户安全感知
- **GET** `/monitor/user-security`
- 响应：用户安全行为统计

### 6.7 获取资产统计
- **GET** `/monitor/asset-stats`
- 响应：资产分类统计数据

### 6.8 获取端口 TOP5
- **GET** `/monitor/port-top5`
- 响应：端口流量排名前5

### 6.9 获取 EUBA 趋势
- **GET** `/monitor/euba-trend`
- 响应：用户实体行为分析趋势数据

### 6.10 获取威胁事件统计
- **GET** `/monitor/threat-events`
- 响应：威胁事件分类统计

### 6.11 获取安全播报
- **GET** `/monitor/bulletins`
- 查询参数：`type`（可选，播报类型，如"全部"）
- 响应：安全播报列表

### 6.12 获取安全事件列表
- **GET** `/monitor/events`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| severity | string | 严重等级 |
| type | string | 事件类型 |
| keyword | string | 关键词搜索 |
| page / pageSize | number | 分页 |

- 响应：`{ list: EventItem[], total: number }`

### 6.13 获取告警列表
- **GET** `/monitor/alerts`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 告警状态 |
| page / pageSize | number | 分页 |

- 响应：`{ list: AlertItem[], total: number }`

### 6.14 获取主机安全列表
- **GET** `/monitor/hosts`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| os | string | 操作系统 |
| riskLevel | string | 风险等级 |
| ip | string | IP 地址 |

- 响应：`{ list: HostItem[], total: number }`

### 6.15 获取主机详情（下钻）
- **GET** `/monitor/hosts/{ip}`
- 路径参数：`ip` — 主机 IP 地址
- 响应：主机详细信息对象

### 6.16 获取网络实时吞吐量
- **GET** `/monitor/network/throughput`
- 响应：

```json
{
  "current": 8.6,
  "unit": "Gbps",
  "activeIps": 12458,
  "connections": 856432,
  "todayTraffic": 2.8
}
```

### 6.17 获取协议分布
- **GET** `/monitor/network/protocols`
- 响应：`ProtocolItem[]`（各协议流量占比）

### 6.18 获取 Top-K 大流
- **GET** `/monitor/network/top-flows`
- 查询参数：`k`（返回条数，默认 10）
- 响应：`{ list: FlowItem[], total: number }`

---

## 7. 处置中心

### 7.1 获取资产分组树
- **GET** `/disposal/asset-groups`
- 响应：资产分组树形结构

### 7.2 获取处置统计
- **GET** `/disposal/stats`
- 响应：处置中心顶部统计数据

### 7.3 获取处置列表
- **GET** `/disposal/list`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| group | string | 资产分组 |
| type | string | 类型 |
| status | string | 状态 |
| riskLevel | string | 风险等级 |
| keyword | string | 关键词 |
| page / pageSize | number | 分页 |

- 响应：`{ list: DisposalItem[], total: number }`

### 7.4 执行处置操作
- **POST** `/disposal/execute`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| assetId | string | 是 | 资产 ID |
| action | string | 是 | 处置动作 |

- 响应：`{ success: boolean }`

### 7.5 获取风险用户列表
- **GET** `/disposal/risk-users`
- 查询参数：`userType`, `riskLevel`, `keyword`, `page`, `pageSize`
- 响应：`{ list: RiskUser[], total: number }`

### 7.6 获取威胁视角数据
- **GET** `/disposal/threats`
- 查询参数：`page`, `pageSize`
- 响应：`{ stats: object, list: ThreatItem[], total: number }`

### 7.7 获取响应策略列表
- **GET** `/disposal/strategies`
- 查询参数：`type`, `status`
- 响应：`{ list: Strategy[], total: number }`

### 7.8 创建/更新响应策略
- **POST**（新建）/ **PUT**（更新） `/disposal/strategies`
- 请求体：策略对象（含 `id` 时为更新）
- 响应：`{ success: boolean }`

### 7.9 获取处置记录
- **GET** `/disposal/records`
- 查询参数：`dateRange`, `type`, `result`, `page`, `pageSize`
- 响应：`{ list: Record[], total: number }`

---

## 8. 分析中心

### 8.1 获取日志统计
- **GET** `/analysis/log-stats`
- 响应：日志统计概览数据

### 8.2 日志检索
- **GET** `/analysis/logs`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| srcIp | string | 源 IP |
| dstIp | string | 目的 IP |
| port | string | 端口 |
| startTime | string | 开始时间 |
| endTime | string | 结束时间 |
| attackType | string | 攻击类型 |
| page / pageSize | number | 分页 |

- 响应：`{ list: LogItem[], total: number }`

### 8.3 获取关联分析数据
- **GET** `/analysis/correlation`
- 查询参数：`ruleType`, `severity`, `page`, `pageSize`
- 响应：`{ stats: object, list: CorrelationItem[], total: number }`

### 8.4 获取行为分析数据
- **GET** `/analysis/behavior`
- 查询参数：`page`, `pageSize`
- 响应：`{ stats: object, trend: { dates: string[], anomaly: number[], baseline: number[] }, list: BehaviorItem[], total: number }`

### 8.5 获取威胁情报
- **GET** `/analysis/threat-intel`
- 查询参数：`source`, `iocType`, `keyword`, `page`, `pageSize`
- 响应：`{ stats: object, list: IntelItem[], total: number }`

### 8.6 微观流级检索
- **GET** `/analysis/flows`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| srcIp | string | 源 IP |
| dstIp | string | 目的 IP |
| srcPort | string | 源端口 |
| dstPort | string | 目的端口 |
| protocol | string | 协议 |
| startTime / endTime | string | 时间范围 |
| page / pageSize | number | 分页 |

- 响应：`{ list: FlowRecord[], total: number }`

---

## 9. 资产中心

### 9.1 获取资产总览
- **GET** `/assets/overview`
- 响应：资产总览统计（总数、分类、状态分布等）

### 9.2 获取资产管理列表
- **GET** `/assets/list`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| type | string | 资产类型 |
| status | string | 状态 |
| os | string | 操作系统 |
| keyword | string | 关键词搜索 |
| page / pageSize | number | 分页 |

- 响应：`{ list: AssetItem[], total: number }`

### 9.3 添加资产
- **POST** `/assets`
- 请求体：资产对象
- 响应：`{ success: boolean }`

### 9.4 更新资产
- **PUT** `/assets/{id}`
- 路径参数：`id` — 资产 ID
- 请求体：资产对象
- 响应：`{ success: boolean }`

### 9.5 删除资产
- **DELETE** `/assets/{id}`
- 路径参数：`id` — 资产 ID
- 响应：`{ success: boolean }`

### 9.6 获取基线检测结果
- **GET** `/assets/baseline`
- 查询参数：`area`, `result`, `page`, `pageSize`
- 响应：`{ stats: object, distribution: ChartItem[], list: BaselineItem[], total: number }`

### 9.7 获取资产发现结果
- **GET** `/assets/discovery`
- 查询参数：`status`, `type`, `page`, `pageSize`
- 响应：`{ stats: object, list: DiscoveryItem[], total: number }`

### 9.8 纳管资产
- **POST** `/assets/manage`
- 请求体：`{ ip: string }`
- 响应：`{ success: boolean }`

### 9.9 获取扫描配置
- **GET** `/assets/config/scan`
- 响应：

```json
{
  "period": "每天",
  "time": "02:00",
  "range": "10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16",
  "concurrency": 100
}
```

### 9.10 保存扫描配置
- **PUT** `/assets/config/scan`
- 请求体：同上
- 响应：`{ success: boolean }`

### 9.11 获取基线规则列表
- **GET** `/assets/config/baseline-rules`
- 响应：`{ list: BaselineRule[], total: number }`

---

## 10. 报告中心

### 10.1 获取预设报告卡片
- **GET** `/reports/cards`
- 响应：预设报告模板卡片列表

### 10.2 获取报告列表
- **GET** `/reports/list`
- 查询参数：`type`, `page`, `pageSize`
- 响应：`{ list: ReportItem[], total: number }`

### 10.3 手动导出报告
- **POST** `/reports/export`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 报告类型 |
| startDate | string | 是 | 开始日期 |
| endDate | string | 是 | 结束日期 |
| format | string | 是 | 导出格式（PDF/Word/Excel） |
| modules | string[] | 是 | 包含模块 |

- 响应：`{ success: boolean, downloadUrl: string }`

### 10.4 获取导出历史
- **GET** `/reports/export/history`
- 查询参数：`page`, `pageSize`
- 响应：`{ list: ExportRecord[], total: number }`

### 10.5 获取报告订阅列表
- **GET** `/reports/subscriptions`
- 响应：`{ list: Subscription[], total: number }`

### 10.6 创建/更新订阅
- **POST**（新建）/ **PUT**（更新） `/reports/subscriptions`
- 请求体：订阅对象（含 `id` 时为更新）
- 响应：`{ success: boolean }`

### 10.7 删除订阅
- **DELETE** `/reports/subscriptions/{id}`
- 路径参数：`id` — 订阅 ID
- 响应：`{ success: boolean }`

### 10.8 获取报告设置
- **GET** `/reports/settings`
- 响应：`{ smtp: object, watermark: { enabled: boolean, text: string }, templates: Template[] }`

### 10.9 保存报告设置
- **PUT** `/reports/settings`
- 请求体：同上
- 响应：`{ success: boolean }`

---

## 11. 通报预警

### 11.1 获取通报总览列表
- **GET** `/warning/list`
- 查询参数：`type`, `keyword`, `page`, `pageSize`
- 响应：`{ list: WarningItem[], total: number }`

### 11.2 获取待通报事件
- **GET** `/warning/pending`
- 查询参数：`level`, `keyword`, `page`, `pageSize`
- 响应：`{ stats: object, list: EventItem[], total: number }`

### 11.3 通报事件
- **POST** `/warning/report`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventId | string | 是 | 事件 ID |
| reporter | string | 是 | 通报人 |

- 响应：`{ success: boolean }`

### 11.4 忽略事件
- **POST** `/warning/ignore`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventId | string | 是 | 事件 ID |
| reason | string | 是 | 忽略原因 |

- 响应：`{ success: boolean }`

### 11.5 获取通报中事件
- **GET** `/warning/processing`
- 查询参数：`level`, `keyword`, `page`, `pageSize`
- 响应：`{ stats: object, list: EventItem[], total: number }`

### 11.6 归档事件
- **POST** `/warning/archive/{eventId}`
- 路径参数：`eventId` — 事件 ID
- 响应：`{ success: boolean }`

### 11.7 获取已归档事件
- **GET** `/warning/archived`
- 查询参数：`level`, `keyword`, `page`, `pageSize`
- 响应：`{ stats: object, list: EventItem[], total: number }`

### 11.8 获取无需通报事件
- **GET** `/warning/ignored`
- 查询参数：`level`, `keyword`, `page`, `pageSize`
- 响应：`{ stats: object, list: EventItem[], total: number }`

### 11.9 获取预警中心数据
- **GET** `/warning/alert-center`
- 查询参数：`level`, `source`, `page`, `pageSize`
- 响应：`{ stats: object, trend: { dates: string[], values: number[] }, list: AlertItem[], total: number }`

### 11.10 获取公告列表
- **GET** `/warning/bulletins`
- 查询参数：`type`, `page`, `pageSize`
- 响应：`{ list: Bulletin[], total: number }`

### 11.11 发布公告
- **POST** `/warning/bulletins`
- 请求体：公告对象
- 响应：`{ success: boolean }`

### 11.12 获取预警设置
- **GET** `/warning/settings`
- 响应：`{ receivers: object, rules: Rule[], templates: Template[] }`

### 11.13 保存预警设置
- **PUT** `/warning/settings`
- 请求体：同上
- 响应：`{ success: boolean }`

---

## 12. 重保中心

### 12.1 获取攻击者地理分布
- **GET** `/protection/attacker-distribution`
- 查询参数：`region`（`domestic` | `foreign`，默认 `domestic`）
- 响应：攻击者地理分布数据

### 12.2 获取攻击者 TOP10
- **GET** `/protection/attacker-top10`
- 响应：攻击者 IP 排名前10

### 12.3 获取实时告警分析
- **GET** `/protection/realtime`
- 查询参数：`page`, `pageSize`
- 响应：`{ stats: object, trend: { hours: string[], values: number[] }, typeDistribution: ChartItem[], list: AlertItem[], total: number }`

### 12.4 获取封锁 IP 列表
- **GET** `/protection/block-list`
- 查询参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 封锁状态 |
| source | string | 来源 |
| ip | string | IP 搜索 |
| page / pageSize | number | 分页 |

- 响应：`{ stats: object, list: BlockItem[], total: number }`

### 12.5 手动封锁 IP
- **POST** `/protection/block`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ip | string | 是 | 封锁 IP |
| reason | string | 是 | 封锁原因 |

- 响应：`{ success: boolean }`

### 12.6 解封 IP
- **POST** `/protection/unblock/{ip}`
- 路径参数：`ip` — 要解封的 IP
- 响应：`{ success: boolean }`

### 12.7 批量导入封锁 IP
- **POST** `/protection/block/import`
- 请求体：`{ ips: string[] }`
- 响应：`{ success: boolean, count: number }`

### 12.8 获取重保威胁情报
- **GET** `/protection/threat-intel`
- 查询参数：`page`, `pageSize`
- 响应：`{ stats: object, hitTrend: { dates: string[], values: number[] }, typeDistribution: ChartItem[], list: IntelItem[], total: number }`

### 12.9 将 IOC 加入封锁列表
- **POST** `/protection/block/add-ioc`
- 请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ioc | string | 是 | IOC 值 |
| type | string | 是 | IOC 类型（IP/域名/Hash） |

- 响应：`{ success: boolean }`

### 12.10 获取暴露面分析
- **GET** `/protection/exposure`
- 查询参数：`page`, `pageSize`
- 响应：`{ stats: object, areaDistribution: ChartItem[], list: ExposureItem[], total: number }`

---

## 接口统计

| 模块 | 接口数 | 前端文件 |
|------|--------|----------|
| 认证与用户 | 5 | `api/system.ts` |
| 系统设置 | 2 | `api/system.ts` |
| 消息中心 | 4 | `api/system.ts` |
| 全局视角 | 4 | `api/system.ts` |
| 监控中心 | 18 | `api/monitor.ts` |
| 处置中心 | 9 | `api/disposal.ts` |
| 分析中心 | 6 | `api/analysis.ts` |
| 资产中心 | 11 | `api/assets.ts` |
| 报告中心 | 9 | `api/reports.ts` |
| 通报预警 | 13 | `api/warning.ts` |
| 重保中心 | 10 | `api/protection.ts` |
| **合计** | **91** | — |
