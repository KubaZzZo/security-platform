import { USE_MOCK, request, mockResponse } from './config';
import { attackerDistribution, attackerTop10 } from '../data/mockData';

/** 获取攻击者地理分布 */
export async function getAttackerDistribution(region: 'domestic' | 'foreign' = 'domestic') {
  if (USE_MOCK) return mockResponse(region === 'domestic' ? attackerDistribution.domestic : attackerDistribution.foreign);
  return request<any[]>('/protection/attacker-distribution', { params: { region } });
}

/** 获取攻击者TOP10 */
export async function getAttackerTop10() {
  if (USE_MOCK) return mockResponse(attackerTop10);
  return request<typeof attackerTop10>('/protection/attacker-top10');
}

/** 获取实时告警分析数据 */
export async function getRealtimeAlerts(params?: { page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, trend: { hours: [], values: [] }, typeDistribution: [], list: [], total: 0 });
  return request<{ stats: any; trend: any; typeDistribution: any[]; list: any[]; total: number }>('/protection/realtime', { params: params as any });
}

/** 获取封锁IP列表 */
export async function getBlockList(params?: { status?: string; source?: string; ip?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/protection/block-list', { params: params as any });
}

/** 手动封锁IP */
export async function blockIp(ip: string, reason: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/protection/block', { method: 'POST', body: { ip, reason } });
}

/** 解封IP */
export async function unblockIp(ip: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>(`/protection/unblock/${ip}`, { method: 'POST' });
}

/** 批量导入封锁IP */
export async function importBlockList(ips: string[]) {
  if (USE_MOCK) return mockResponse({ success: true, count: ips.length });
  return request<{ success: boolean; count: number }>('/protection/block/import', { method: 'POST', body: { ips } });
}

/** 获取重保威胁情报 */
export async function getProtectionThreatIntel(params?: { page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, hitTrend: { dates: [], values: [] }, typeDistribution: [], list: [], total: 0 });
  return request<{ stats: any; hitTrend: any; typeDistribution: any[]; list: any[]; total: number }>('/protection/threat-intel', { params: params as any });
}

/** 将IOC加入封锁列表 */
export async function addIocToBlockList(ioc: string, type: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/protection/block/add-ioc', { method: 'POST', body: { ioc, type } });
}

/** 获取暴露面分析数据 */
export async function getExposureAnalysis(params?: { page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, areaDistribution: [], list: [], total: 0 });
  return request<{ stats: any; areaDistribution: any[]; list: any[]; total: number }>('/protection/exposure', { params: params as any });
}
