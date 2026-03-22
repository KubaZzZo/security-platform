/**
 * API 配置文件
 * 对接后端时，修改 BASE_URL 为实际后端地址，并将 USE_MOCK 设为 false
 */

// ====== 切换开关 ======
export const USE_MOCK = true;
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// ====== 通用请求封装 ======
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, headers = {} } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // 对接后端时在此添加 Authorization header
      // 'Authorization': `Bearer ${getToken()}`,
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Mock 辅助：将 mock 数据包装为异步返回，模拟网络延迟
 * 对接后端后可删除此函数
 */
export function mockResponse<T>(data: T, delay = 0): Promise<T> {
  if (delay > 0) {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
  }
  return Promise.resolve(data);
}
