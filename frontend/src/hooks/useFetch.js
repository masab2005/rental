import { useEffect, useState, useCallback } from 'react';
import { fetchJson } from '../api';

export function useFetch(path, opts = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);

  const load = useCallback(async ()=>{
    if (!path) return;
    setLoading(true); setError(null);
    try {
      const res = await fetchJson(path, opts || {});
      // Handle both direct data and wrapped data responses
      setData(res.data !== undefined ? res.data : res);
    } catch (e) {
      setError(e);
    } finally { setLoading(false); }
  }, [path, JSON.stringify(opts), ...deps]);

  useEffect(()=> { load(); }, [load]);

  return { data, loading, error, reload: load };
}
