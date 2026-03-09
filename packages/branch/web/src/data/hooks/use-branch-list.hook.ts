"use client";

import { useCallback, useEffect, useState } from "react";
import { getBranches } from "../api/branch";
import { BranchListItem } from "@pharmacore/branch";

export function useBranchList() {
    const [branches, setBranches] = useState<BranchListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBranches = useCallback(async (pageSize: number = 100) => {
        try {
            setIsLoading(true);
            const response = await getBranches({ page: 1, pageSize: pageSize });
            setBranches(response.data);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    return { branches, isLoading, refetch: fetchBranches };
}
