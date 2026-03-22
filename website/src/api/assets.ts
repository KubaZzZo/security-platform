import { USE_MOCK, request, mockResponse } from './config';
import { assetOverview } from '../data/mockData';

/** 获取资产总览 */
export async function getAssetOverview() {
  if (USE_MOCK) return mockResponse(assetOverview);
  return request<typeof assetOverview>('/assets/overview');
}

/** 获取资产管理列表 */
export async function getAssetList(params?: { type?: string; status?: string; os?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/assets/list', { params: params as any });
}

/** 添加资产 */
export async function addAsset(asset: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/assets', { method: 'POST', body: asset });
}

/** 更新资产 */
export async function updateAsset(id: string, asset: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>(`/assets/${id}`, { method: 'PUT', body: asset });
}

/** 删除资产 */
export async function deleteAsset(id: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>(`/assets/${id}`, { method: 'DELETE' });
}

/** 获取基线检测结果 */
export async function getBaselineResults(params?: { area?: string; result?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, distribution: [], list: [], total: 0 });
  return request<{ stats: any; distribution: any[]; list: any[]; total: number }>('/assets/baseline', { params: params as any });
}

/** 获取资产发现结果 */
export async function getDiscoveryResults(params?: { status?: string; type?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/assets/discovery', { params: params as any });
}

/** 纳管资产 */
export async function manageAsset(ip: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/assets/manage', { method: 'POST', body: { ip } });
}

/** 获取扫描配置 */
export async function getScanConfig() {
  if (USE_MOCK) return mockResponse({ period: '每天', time: '02:00', range: '10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16', concurrency: 100 });
  return request<any>('/assets/config/scan');
}

/** 保存扫描配置 */
export async function saveScanConfig(config: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/assets/config/scan', { method: 'PUT', body: config });
}

/** 获取基线规则列表 */
export async function getBaselineRules() {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/assets/config/baseline-rules');
}
