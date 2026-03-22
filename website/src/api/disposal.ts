import { USE_MOCK, request, mockResponse } from './config';
import { assetGroups, disposalStats, disposalTableData } from '../data/mockData';

/** 获取资产分组树 */
export async function getAssetGroups() {
  if (USE_MOCK) return mockResponse(assetGroups);
  return request<typeof assetGroups>('/disposal/asset-groups');
}

/** 获取处置统计 */
export async function getDisposalStats() {
  if (USE_MOCK) return mockResponse(disposalStats);
  return request<typeof disposalStats>('/disposal/stats');
}

/** 获取处置列表 */
export async function getDisposalList(params?: { group?: string; type?: string; status?: string; riskLevel?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: disposalTableData, total: disposalTableData.length });
  return request<{ list: any[]; total: number }>('/disposal/list', { params: params as any });
}

/** 执行处置操作 */
export async function executeDisposal(assetId: string, action: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/disposal/execute', { method: 'POST', body: { assetId, action } });
}

/** 获取风险用户列表 */
export async function getRiskUsers(params?: { userType?: string; riskLevel?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/disposal/risk-users', { params: params as any });
}

/** 获取威胁视角数据 */
export async function getThreatsView(params?: { page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/disposal/threats', { params: params as any });
}

/** 获取响应策略列表 */
export async function getStrategies(params?: { type?: string; status?: string }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/disposal/strategies', { params: params as any });
}

/** 创建/更新响应策略 */
export async function saveStrategy(strategy: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/disposal/strategies', { method: strategy.id ? 'PUT' : 'POST', body: strategy });
}

/** 获取处置记录 */
export async function getDisposalRecords(params?: { dateRange?: string[]; type?: string; result?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/disposal/records', { params: params as any });
}
