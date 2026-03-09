"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuthOverview } from "../api/auth/auth.service";
import { GetAuthDashboardOverviewOut } from "@pharmacore/auth";

export function useAuthOverview() {
    const [overview, setOverview] = useState<GetAuthDashboardOverviewOut | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOverview = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAuthOverview();
            setOverview(data);
        } catch (error) {
            console.error("Failed to fetch auth overview:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return { overview, isLoading, refetch: fetchOverview };
}
