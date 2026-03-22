import { USE_MOCK, request, mockResponse } from './config';

/** 用户信息类型 */
export interface UserInfo {
  username: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  lastLogin: string;
  loginIp: string;
}

/** 系统设置类型 */
export interface SystemSettingsData {
  siteName: string;
  sessionTimeout: number;
  logRetention: number;
  autoRefresh: boolean;
  refreshInterval: number;
  emailNotify: boolean;
  smsNotify: boolean;
  loginVerify: boolean;
  ipWhitelist: boolean;
  maxLoginAttempts: number;
}

/** 获取全局视角 - 各区域概览 */
export async function getAreaOverview() {
  if (USE_MOCK) return mockResponse([]);
  return request<any[]>('/global/areas');
}

/** 获取全局视角 - 全网统计 */
export async function getGlobalStats() {
  if (USE_MOCK) return mockResponse({});
  return request<any>('/global/stats');
}

/** 获取全局视角 - 各区域流量趋势 */
export async function getAreaTrafficTrend(area?: string) {
  if (USE_MOCK) return mockResponse({ hours: [], series: [] });
  return request<any>('/global/traffic-trend', { params: area ? { area } : undefined });
}

/** 获取全局视角 - 最新告警 */
export async function getGlobalAlerts(limit?: number) {
  if (USE_MOCK) return mockResponse([]);
  return request<any[]>('/global/alerts', { params: { limit: String(limit || 10) } });
}

/** 获取消息列表 */
export async function getMessages(params?: { type?: string; read?: boolean; page?: number; pageSize?: number }) {
  if (USE_MOCK) return mockResponse({ list: [], total: 0, unreadCount: 0 });
  return request<{ list: any[]; total: number; unreadCount: number }>('/messages', { params: params as any });
}

/** 标记消息已读 */
export async function markMessageRead(id: number) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>(`/messages/${id}/read`, { method: 'PUT' });
}

/** 全部标记已读 */
export async function markAllMessagesRead() {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/messages/read-all', { method: 'PUT' });
}

/** 获取未读消息数 */
export async function getUnreadCount() {
  if (USE_MOCK) return mockResponse({ count: 3 });
  return request<{ count: number }>('/messages/unread-count');
}

/** 用户登录 */
export async function login(username: string, password: string) {
  if (USE_MOCK) return mockResponse({ token: 'mock-token', user: { username: 'admin', role: '系统管理员' } });
  return request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: { username, password } });
}

/** 用户登出 */
export async function logout() {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
}

/** 修改密码 */
export async function changePassword(oldPassword: string, newPassword: string) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/auth/change-password', { method: 'POST', body: { oldPassword, newPassword } });
}

/** 获取用户信息 */
export async function getUserInfo() {
  if (USE_MOCK) return mockResponse({
    username: 'admin',
    role: '系统管理员',
    email: 'admin@suda.edu.cn',
    phone: '0512-65880000',
    department: '信息化建设与管理中心',
    lastLogin: '2026-03-22 09:15:32',
    loginIp: '10.10.2.105',
  });
  return request<UserInfo>('/auth/user-info');
}

/** 更新用户信息 */
export async function updateUserInfo(info: { email?: string; phone?: string; department?: string }) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/auth/user-info', { method: 'PUT', body: info });
}

/** 获取系统设置 */
export async function getSystemSettings() {
  if (USE_MOCK) return mockResponse({
    siteName: '安全感知平台',
    sessionTimeout: 30,
    logRetention: 90,
    autoRefresh: true,
    refreshInterval: 60,
    emailNotify: true,
    smsNotify: false,
    loginVerify: true,
    ipWhitelist: false,
    maxLoginAttempts: 5,
  });
  return request<SystemSettingsData>('/system/settings');
}

/** 保存系统设置 */
export async function saveSystemSettings(settings: SystemSettingsData) {
  if (USE_MOCK) return mockResponse({ success: true });
  return request<{ success: boolean }>('/system/settings', { method: 'PUT', body: settings });
}
