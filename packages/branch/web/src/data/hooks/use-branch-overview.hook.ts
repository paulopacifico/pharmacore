"use client";

import { useCallback, useEffect, useState } from "react";
import { getBranchOverview } from "../api/branch";
import { BranchOverviewDTO } from "@pharmacore/branch";

export function useBranchOverview() {
    const [overview, setOverview] = useState<BranchOverviewDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOverview = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getBranchOverview();
            setOverview(data);
        } catch (error) {
            console.error("Failed to fetch branch overview:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return { overview, isLoading, refetch: fetchOverview };
}
