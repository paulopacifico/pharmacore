"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BranchDetailsDTO } from "@pharmacore/branch";
import { useDebounce } from "@pharmacore/shared-web";
import * as branchApi from "../api/branch/branch.service";

const SELECTED_BRANCH_KEY = "pharmacore_selected_branch";

export function useBranchSelectorData() {
    const initialBranches = useRef<BranchDetailsDTO[]>([]);
    const [branches, setBranches] = useState<BranchDetailsDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const [selectedBranch, setSelectedBranchState] =
        useState<BranchDetailsDTO | null>(() => {
            if (typeof window === "undefined") return null;
            try {
                const stored = localStorage.getItem(SELECTED_BRANCH_KEY);
                return stored ? JSON.parse(stored) : null;
            } catch {
                return null;
            }
        });

    const setSelectedBranch = useCallback((branch: BranchDetailsDTO | null) => {
        setSelectedBranchState(branch);
        if (typeof window === "undefined") return;
        if (branch) {
            localStorage.setItem(SELECTED_BRANCH_KEY, JSON.stringify(branch));
        } else {
            localStorage.removeItem(SELECTED_BRANCH_KEY);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        branchApi
            .getBranches({ page: 1, pageSize: 10 })
            .then((result) => {
                initialBranches.current = result.data;
                setBranches(result.data);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setBranches(initialBranches.current);
            return;
        }

        setIsLoading(true);
        branchApi
            .getBranches({
                page: 1,
                pageSize: 10,
                name: debouncedSearch.trim(),
            })
            .then((result) => setBranches(result.data))
            .finally(() => setIsLoading(false));
    }, [debouncedSearch]);

    return { branches, isLoading, search, setSearch, selectedBranch, setSelectedBranch };
}
