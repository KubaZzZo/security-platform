import { USE_MOCK, request, mockResponse } from './config';
import { logStats, logTableData } from '../data/mockData';

/** 获取日志统计 */
export async function getLogStats() {
  if (USE_MOCK) return mockResponse(logStats);
  return request<typeof logStats>('/analysis/log-stats');
}

/** 日志检索 */
export async function searchLogs(params?: { srcIp?: string; dstIp?: string; port?: string; startTime?: string; endTime?: string; attackType?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: logTableData, total: logTableData.length });
  return request<{ list: any[]; total: number }>('/analysis/logs', { params: params as any });
}

/** 获取关联分析规则及结果 */
export async function getCorrelationData(params?: { ruleType?: string; severity?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/analysis/correlation', { params: params as any });
}

/** 获取行为分析数据 */
export async function getBehaviorAnalysis(params?: { page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, trend: { dates: [], anomaly: [], baseline: [] }, list: [], total: 0 });
  return request<{ stats: any; trend: any; list: any[]; total: number }>('/analysis/behavior', { params: params as any });
}

/** 获取威胁情报数据 */
export async function getThreatIntel(params?: { source?: string; iocType?: string; keyword?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ stats: {}, list: [], total: 0 });
  return request<{ stats: any; list: any[]; total: number }>('/analysis/threat-intel', { params: params as any });
}

/** 微观流级检索 - 按五元组查询通信流记录 */
export async function searchFlows(params: { srcIp?: string; dstIp?: string; srcPort?: string; dstPort?: string; protocol?: string; startTime?: string; endTime?: string; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0 });
  return request<{ list: any[]; total: number }>('/analysis/flows', { params: params as any });
}
