import { USE_MOCK, request, mockResponse } from './config';
import {
  monitorStats, securityRating, hotEvents, serverSecurity,
  terminalSecurity, userSecurity, assetStats, portTop5,
  eubaData, threatEvents, securityBulletins
} from '../data/mockData';

/** 获取监控中心概览统计 */
export async function getMonitorStats() {
  if (USE_MOCK) return mockResponse(monitorStats);
  return request<typeof monitorStats>('/monitor/stats');
}

/** 获取安全评分 */
export async function getSecurityRating() {
  if (USE_MOCK) return mockResponse(securityRating);
  return request<typeof securityRating>('/monitor/security-rating');
}

/** 获取热点事件 */
export async function getHotEvents() {
  if (USE_MOCK) return mockResponse(hotEvents);
  return request<string[]>('/monitor/hot-events');
}

/** 获取服务器安全感知数据 */
export async function getServerSecurity() {
  if (USE_MOCK) return mockResponse(serverSecurity);
  return request<typeof serverSecurity>('/monitor/server-security');
}

/** 获取终端安全感知数据 */
export async function getTerminalSecurity() {
  if (USE_MOCK) return mockResponse(terminalSecurity);
  return request<typeof terminalSecurity>('/monitor/terminal-security');
}

/** 获取用户安全感知数据 */
export async function getUserSecurity() {
  if (USE_MOCK) return mockResponse(userSecurity);
  return request<typeof userSecurity>('/monitor/user-security');
}

/** 获取资产统计 */
export async function getAssetStats() {
  if (USE_MOCK) return mockResponse(assetStats);
  return request<typeof assetStats>('/monitor/asset-stats');
}

/** 获取端口TOP5 */
export async function getPortTop5() {
  if (USE_MOCK) return mockResponse(portTop5);
  return request<typeof portTop5>('/monitor/port-top5');
}

/** 获取EUBA趋势数据 */
export async function getEubaData() {
  if (USE_MOCK) return mockResponse(eubaData);
  return request<typeof eubaData>('/monitor/euba-trend');
}

/** 获取威胁事件统计 */
export async function getThreatEvents() {
  if (USE_MOCK) return mockResponse(threatEvents);
  return request<typeof threatEvents>('/monitor/threat-events');
}

/** 获取安全播报 */
export async function getSecurityBulletins(type?: string) {
  if (USE_MOCK) {
    const data = type && type !== '全部' ? securityBulletins.filter(b => b.type === type) : securityBulletins;
    return mockResponse(data);
  }
  return request<typeof securityBulletins>('/monitor/bulletins', { params: type ? { type } : undefined });
}

/** 获取安全事件列表 */
export async function getSecurityEvents(params?: { severity?: string; type?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 }); // 子页面内联mock数据，对接后端时替换
  return request<{ list: any[]; total: number }>('/monitor/events', { params: params as any });
}

/** 获取告警列表 */
export async function getAlerts(params?: { status?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/monitor/alerts', { params: params as any });
}

/** 获取主机安全列表 */
export async function getHostSecurity(params?: { os?: string; riskLevel?: string; ip?: string }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/monitor/hosts', { params: params as any });
}

/** 获取单IP详情（下钻） */
export async function getHostDetail(ip: string) {
  if (USE_MOCK) return mockResponse(null);
  return request<any>(`/monitor/hosts/${ip}`);
}

/** 获取网络安全数据 - 实时吞吐量 */
export async function getNetworkThroughput() {
  if (USE_MOCK) return mockResponse({ current: 8.6, unit: 'Gbps', activeIps: 12458, connections: 856432, todayTraffic: 2.8 });
  return request<any>('/monitor/network/throughput');
}

/** 获取网络安全数据 - 协议分布 */
export async function getProtocolDistribution() {
  if (USE_MOCK) return mockResponse([]);
  return request<any[]>('/monitor/network/protocols');
}

/** 获取Top-K大流 */
export async function getTopKFlows(k?: number) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/monitor/network/top-flows', { params: { k: String(k || 10) } });
}
