"use client";
import { useCallback, useEffect, useState } from "react";
import { findStats as apiFindStats } from "../api/product.service";
import { ProductStatusDTO } from "@pharmacore/product";
import { useLocalStorage } from "../../../../../shared/web/src/data";
export function useStats() {
    const [stats, setStats] = useState<ProductStatusDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const localStorageKey = "product-dashboard-stats";
    const STATS_TTL_MINUTES = 60;
    const { getLocalStorageValue, setLocalStorageValue } =
        useLocalStorage<ProductStatusDTO>(localStorageKey, STATS_TTL_MINUTES);

    const loadStatsFromBackend = useCallback(async () => {
        try {
            const statsResponse = await apiFindStats();
            setStats(statsResponse);
            return statsResponse;
        } catch (err) {
            throw err;
        }
    }, []);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const savedStats = getLocalStorageValue();
            if (savedStats) {
                setStats(savedStats);
            } else {
                const statsResponse = await loadStatsFromBackend();
                setStats(statsResponse);
                setLocalStorageValue(statsResponse);
            }
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        } finally {
            setIsLoading(false);
        }
    }, [loadStatsFromBackend, setLocalStorageValue]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        stats,
        isLoading,
    };
}
