'use client';

import { useState, useEffect, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';

export function useDebouncedSearch<T>(query: string, url: string, delay = 300) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const cancelRef = useRef<CancelTokenSource | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setData([]);
            return;
        }

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (cancelRef.current) cancelRef.current.cancel();

            const source = axios.CancelToken.source();
            cancelRef.current = source;
            setLoading(true);

            axios
                .get(`${url}?q=${encodeURIComponent(query)}`, {
                    cancelToken: source.token,
                })
                .then((res) => setData(res.data.data))
                .catch((err) => {
                    if (!axios.isCancel(err)) console.error(err);
                })
                .finally(() => setLoading(false));
        }, delay);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            if (cancelRef.current) cancelRef.current.cancel();
        };
    }, [query, url, delay]);

    return { data, loading };
}
