"use client";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    deleteBrand as apiDeleteBrand,
    createBrand as apiCreateBrand,
    updateBrand as apiUpdateBrand,
    findManyBrandsWithFilter as apiFindManyBrandsWithFilter,
} from "../api/brand.service";
import { BrandQueryDTO, BrandListItem } from "@pharmacore/product";
import { CreateBrandFormData, UpdateBrandFormData } from "../schemas";

export interface BrandContextProps {
    brands: BrandListItem[];
    isLoadingBrands: boolean;
    filters: BrandQueryDTO;
    totalPages: number;
    totalItems: number;
    currentPage: number;
    findManyBrands(filters: BrandQueryDTO): Promise<void>;
    deleteBrand(id: string): Promise<void>;
    findBrandById(id: string): Promise<BrandListItem | null>;
    createBrand(data: CreateBrandFormData): Promise<void>;
    updateBrand(id: string, data: UpdateBrandFormData): Promise<void>;
    goToPage(page: number): void;
    updateFilters(newFilters: Partial<BrandQueryDTO>): void;
}

export const BrandContext = createContext<BrandContextProps>(
    {} as BrandContextProps,
);

export function BrandProvider({ children }: { children: ReactNode }) {
    const [brands, setBrands] = useState<BrandListItem[]>([]);
    const [isLoadingBrands, setIsLoadingBrands] = useState<boolean>(false);
    const [filters, setFilters] = useState<BrandQueryDTO>({
        page: 1,
        pageSize: 10,
        search: undefined,
    });
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        findManyBrands(filters).catch(() => {});
    }, []);

    const findManyBrands = useCallback(async (newFilters: BrandQueryDTO) => {
        try {
            setIsLoadingBrands(true);
            setFilters(newFilters);

            const brandsResponse = await apiFindManyBrandsWithFilter({
                page: newFilters.page ?? 1,
                pageSize: newFilters.pageSize ?? 10,
                search: newFilters.search,
            });

            setBrands(brandsResponse.data);
            setTotalPages(brandsResponse.meta.totalPages);
            setTotalItems(brandsResponse.meta.total);
            setCurrentPage(newFilters.page ?? 1);
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingBrands(false);
        }
    }, []);

    const findBrandById = useCallback(
        async (id: string): Promise<BrandListItem | null> => {
            const brand = brands.find((brand) => brand.id === id);
            return brand ?? null;
        },
        [brands],
    );

    const deleteBrand = useCallback(
        async (id: string) => {
            try {
                await apiDeleteBrand(id);
                await findManyBrands(filters);
            } catch (err) {
                throw err;
            }
        },
        [findManyBrands, filters],
    );

    const createBrand = useCallback(
        async (data: CreateBrandFormData) => {
            try {
                await apiCreateBrand(data);
                await findManyBrands({ ...filters, page: 1, pageSize: filters.pageSize ?? 10 });
            } catch (err) {
                throw err;
            }
        },
        [findManyBrands, filters],
    );

    const updateBrand = useCallback(
        async (id: string, data: UpdateBrandFormData) => {
            try {
                const formattedData = {
                    id,
                    name: data.name,
                    alias: data.alias,
                };
                await apiUpdateBrand(id, formattedData);
                await findManyBrands(filters);
            } catch (err) {
                throw err;
            }
        },
        [findManyBrands, filters],
    );

    const goToPage = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages) {
                findManyBrands({ ...filters, page });
            }
        },
        [findManyBrands, totalPages, filters],
    );

    const updateFilters = useCallback(
        (newFilters: Partial<BrandQueryDTO>) => {
            const updatedFilters = { ...filters, ...newFilters };
            findManyBrands(updatedFilters);
        },
        [findManyBrands, filters],
    );

    return (
        <BrandContext.Provider
            value={{
                brands,
                filters,
                isLoadingBrands,
                totalPages,
                totalItems,
                currentPage,
                findManyBrands,
                deleteBrand,
                findBrandById,
                createBrand,
                updateBrand,
                goToPage,
                updateFilters,
            }}
        >
            {children}
        </BrandContext.Provider>
    );
}
