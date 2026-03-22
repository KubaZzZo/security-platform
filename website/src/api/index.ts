/**
 * API 接口统一导出
 *
 * 使用方式：
 *   import { monitorApi, disposalApi } from '../api';
 *   const stats = await monitorApi.getMonitorStats();
 *
 * 或配合 useApi Hook：
 *   import { useApi } from '../api/useApi';
 *   import { monitorApi } from '../api';
 *   const { data, loading } = useApi(() => monitorApi.getMonitorStats());
 *
 * 对接后端：
 *   1. 修改 config.ts 中 USE_MOCK = false, BASE_URL = '实际后端地址'
 *   2. 各接口函数会自动切换为真实 HTTP 请求
 *   3. 如需添加 Token，在 config.ts 的 request 函数中添加 Authorization header
 */

export * as monitorApi from './monitor';
export * as disposalApi from './disposal';
export * as analysisApi from './analysis';
export * as assetsApi from './assets';
export * as reportsApi from './reports';
export * as warningApi from './warning';
export * as protectionApi from './protection';
export * as systemApi from './system';

export { USE_MOCK, BASE_URL } from './config';
export { useApi } from './useApi';
