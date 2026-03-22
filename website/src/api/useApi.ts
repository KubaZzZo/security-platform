import { useState, useEffect, useCallback } from 'react';

/**
 * 通用数据请求 Hook
 * 用法：const { data, loading, error, refresh } = useApi(() => monitorApi.getStats());
 */
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: any[] = []): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
