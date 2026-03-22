import { USE_MOCK, request, mockResponse } from './config';
import { warningTableData } from '../data/mockData';

/** 获取通报总览列表 */
export async function getWarningList(params?: { type?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: warningTableData, total: warningTableData.length });
  return request<{ list: any[]; total: number }>('/warning/list', { params: params as any });
}

/** 获取待通报事件 */
export async function getPendingEvents(params?: { level?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/warning/pending', { params: params as any });
}

/** 通报事件 */
export async function reportEvent(eventId: string, reporter: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/warning/report', { method: 'POST', body: { eventId, reporter } });
}

/** 忽略事件 */
export async function ignoreEvent(eventId: string, reason: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/warning/ignore', { method: 'POST', body: { eventId, reason } });
}

/** 获取通报中事件 */
export async function getProcessingEvents(params?: { level?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/warning/processing', { params: params as any });
}

/** 归档事件 */
export async function archiveEvent(eventId: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>(`/warning/archive/${eventId}`, { method: 'POST' });
}

/** 获取已归档事件 */
export async function getArchivedEvents(params?: { level?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/warning/archived', { params: params as any });
}

/** 获取无需通报事件 */
export async function getIgnoredEvents(params?: { level?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/warning/ignored', { params: params as any });
}

/** 获取预警中心数据 */
export async function getAlertCenter(params?: { level?: string; source?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, trend: { dates: [], values: [] }, list: [], total: 0 });
  return request<{ stats: any; trend: any; list: any[]; total: number }>('/warning/alert-center', { params: params as any });
}

/** 获取公告列表 */
export async function getBulletins(params?: { type?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/warning/bulletins', { params: params as any });
}

/** 发布公告 */
export async function publishBulletin(bulletin: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/warning/bulletins', { method: 'POST', body: bulletin });
}

/** 获取预警设置 */
export async function getWarningSettings() {
  if (USE_MOCK) return mockResponse({ receivers: {}, rules: [], templates: [] });
  return request<any>('/warning/settings');
}

/** 保存预警设置 */
export async function saveWarningSettings(settings: any) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/warning/settings', { method: 'PUT', body: settings });
}
