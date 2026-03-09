"use client";

import {
    BranchDetailsDTO,
    CreateBranchIn,
    UpdateBranchIn,
} from "@pharmacore/branch";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import * as branchApi from "../api/branch";

export interface BranchContextProps {
    branches: BranchDetailsDTO[];
    isLoading: boolean;
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    getById(id: string): Promise<BranchDetailsDTO | null>;
    create(data: CreateBranchIn): Promise<void>;
    update(id: string, data: Omit<UpdateBranchIn, "id">): Promise<void>;
    del(id: string): Promise<void>;
    goToPage(page: number): void;
    searchByName(name: string): Promise<void>;
    clearSearch(): Promise<void>;
}

export const BranchContext = createContext<BranchContextProps | undefined>(
    undefined,
);

export function BranchProvider({ children }: { children: ReactNode }) {
    const [branches, setBranches] = useState<BranchDetailsDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [nameFilter, setNameFilter] = useState<string | undefined>(undefined);

    const fetchBranches = useCallback(
        async (targetPage = page, name?: string) => {
            try {
                setIsLoading(true);
                const response = await branchApi.getBranches({
                    page: targetPage,
                    pageSize,
                    name,
                });
                setBranches(response.data);
                setTotal(response.meta.total);
                setTotalPages(response.meta.totalPages);
                if (response.meta.page !== page) {
                    setPage(response.meta.page);
                }
            } catch (err) {
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [page, pageSize],
    );

    useEffect(() => {
        fetchBranches(page, nameFilter);
    }, [page, nameFilter]);

    const getById = useCallback(
        async (id: string) => {
            const branchInState = branches.find((b) => b.id === id);
            if (branchInState) {
                return branchInState;
            }

            try {
                const branch = await branchApi.getBranchById(id);
                return branch;
            } catch (err) {
                console.error(`Failed to fetch branch ${id}:`, err);
                return null;
            }
        },
        [branches],
    );

    const create = useCallback(
        async (data: CreateBranchIn) => {
            try {
                await branchApi.create(data);
                await fetchBranches(page, nameFilter);
            } catch (err) {
                throw err;
            }
        },
        [fetchBranches, page, nameFilter],
    );

    const update = useCallback(
        async (id: string, data: Omit<UpdateBranchIn, "id">) => {
            try {
                await branchApi.update(id, data);
                await fetchBranches(page, nameFilter);
            } catch (err) {
                throw err;
            }
        },
        [fetchBranches, page, nameFilter],
    );

    const del = useCallback(
        async (id: string) => {
            try {
                await branchApi.del(id);
                await fetchBranches(page, nameFilter);
            } catch (err) {
                throw err;
            }
        },
        [fetchBranches, page, nameFilter],
    );

    const goToPage = useCallback(
        (nextPage: number) => {
            const maxPage = totalPages > 0 ? totalPages : 1;
            const safePage = Math.min(
                Math.max(1, Math.floor(nextPage)),
                maxPage,
            );
            if (safePage !== page) {
                setPage(safePage);
            }
        },
        [page, totalPages],
    );

    const searchByName = useCallback(async (name: string) => {
        const trimmed = name?.trim();
        if (!trimmed) {
            setNameFilter(undefined);
            return;
        }
        setNameFilter(trimmed);
        setPage(1);
    }, []);

    const clearSearch = useCallback(async () => {
        if (nameFilter !== undefined) {
            setNameFilter(undefined);
            setPage(1);
            return;
        }
        if (page !== 1) {
            setPage(1);
            return;
        }
        await fetchBranches(1);
    }, [fetchBranches, page, nameFilter]);

    return (
        <BranchContext.Provider
            value={{
                branches,
                isLoading,
                page,
                pageSize,
                total,
                totalPages,
                getById,
                create,
                update,
                del,
                goToPage,
                searchByName,
                clearSearch,
            }}
        >
            {children}
        </BranchContext.Provider>
    );
}
