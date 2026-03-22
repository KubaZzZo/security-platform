import { USE_MOCK, request, mockResponse } from './config';
import { reportCards, reportTableData } from '../data/mockData';

/** 获取预设报告卡片 */
export async function getReportCards() {
  if (USE_MOCK) return mockResponse(reportCards);
  return request<typeof reportCards>('/reports/cards');
}

/** 获取报告列表 */
export async function getReportList(params?: { type?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: reportTableData, total: reportTableData.length });
  return request<{ list: any[]; total: number }>('/reports/list', { params: params as any });
}

/** 手动导出报告 */
export async function exportReport(config: { type: string; startDate: string; endDate: string; format: string; modules: string[] }) {
  if (USE_MOCK) return mockResponse({ success: true, downloadUrl: '' });
  return request<{ success: boolean; downloadUrl: string }>('/reports/export', { method: 'POST', body: config });
}

/** 获取导出历史 */
export async function getExportHistory(params?: { page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/reports/export/history', { params: params as any });
}

/** 获取报告订阅列表 */
export async function getSubscriptions() {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/reports/subscriptions');
}

/** 创建/更新订阅 */
export async function saveSubscription(sub: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/reports/subscriptions', { method: sub.id ? 'PUT' : 'POST', body: sub });
}

/** 删除订阅 */
export async function deleteSubscription(id: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>(`/reports/subscriptions/${id}`, { method: 'DELETE' });
}

/** 获取报告设置 */
export async function getReportSettings() {
  if (USE_MOCK) return mockResponse({ smtp: {}, watermark: { enabled: false, text: '' }, templates: [] });
  return request<any>('/reports/settings');
}

/** 保存报告设置 */
export async function saveReportSettings(settings: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/reports/settings', { method: 'PUT', body: settings });
}
