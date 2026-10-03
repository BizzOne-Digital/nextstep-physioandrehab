"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/components/admin/api";

/**
 * Fetches admin JSON for a URL. Loading is derived from the request key, so
 * previous data stays visible while a new page/search is loading.
 */
export function useAdminQuery<T>(url: string) {
  const [token, setToken] = useState(0);
  const key = `${url}#${token}`;
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: "" });

  useEffect(() => {
    let cancelled = false;
    adminFetch<T>(url)
      .then((data) => !cancelled && setState({ key, data }))
      .catch((e: Error) => !cancelled && setState((s) => ({ key, data: s.data, error: e.message })));
    return () => {
      cancelled = true;
    };
  }, [url, key]);

  const reload = useCallback(() => setToken((t) => t + 1), []);
  const mutate = useCallback((fn: (data: T) => T) => setState((s) => (s.data ? { ...s, data: fn(s.data) } : s)), []);

  return {
    data: state.data,
    error: state.key === key ? state.error : undefined,
    loading: state.key !== key,
    reload,
    mutate,
  };
}

/** Debounces a value (e.g. a search box) before it is used in a query. */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
