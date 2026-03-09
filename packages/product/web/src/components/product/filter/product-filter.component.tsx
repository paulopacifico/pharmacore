"use client";

import { useForm } from "react-hook-form";
import { useCategory } from "../../../data";
import { AppliedFilterTag } from "./applied-filter-tag.component";
import { ProductFiltersDTO } from "@pharmacore/product";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface FilterFormData extends ProductFiltersDTO {}

interface ProductFilterProps {
    filters: FilterFormData;
    updateFilters: (filters: FilterFormData) => void;
}
export function ProductFilter({ filters, updateFilters }: ProductFilterProps) {
    const { categories, isLoadingCategories: isLoading } = useCategory();

    const form = useForm<FilterFormData>({
        defaultValues: {
            search: filters.search ?? "",
            categoryId: filters.categoryId ?? undefined,
            subcategoryId: filters.subcategoryId ?? undefined,
        },
    });

    const watchCategoryId = form.watch("categoryId");
    const selectedCategory = categories.find((c) => c.id === watchCategoryId);

    const applyFilters = () => {
        const filterValues = form.getValues();
        updateFilters(filterValues);
    };

    const handleClearFilters = () => {
        form.setValue("search", "");
        form.setValue("categoryId", undefined);
        form.setValue("subcategoryId", undefined);
        updateFilters({ search: "", categoryId: undefined, subcategoryId: undefined });
    };

    const handleRemoveFilter = (
        filterType: "search" | "categoryId" | "subcategoryId",
    ) => {
        const resetValue = filterType === "search" ? "" : undefined;

        form.setValue(filterType, resetValue);

        if (filterType === "categoryId") {
            form.setValue("subcategoryId", undefined);
        }

        applyFilters();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            applyFilters();
        }
    };

    return (
        <div className="rounded-xl border border-border-card bg-bg-card-hover/45 p-3 sm:p-3.5">
            <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="relative w-full min-w-0 sm:flex-1 sm:min-w-[200px]">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={form.watch("search") ?? ""}
                        onChange={(e) => form.setValue("search", e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-[10px] border border-border-input bg-bg-input px-3.5 py-2.5 pl-10 text-[13px] text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                    />
                </div>

                {/* Category select */}
                {!isLoading && (
                    <select
                        value={form.watch("categoryId") ?? ""}
                        onChange={(e) => {
                            form.setValue("categoryId", e.target.value || undefined);
                            form.setValue("subcategoryId", undefined);
                        }}
                        className="w-full rounded-[10px] border border-border-input bg-bg-input px-3.5 py-2.5 text-[13px] text-text-secondary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue sm:w-auto sm:min-w-[160px]"
                    >
                        <option value="">Categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Subcategory select */}
                {!isLoading && (
                    <select
                        value={form.watch("subcategoryId") ?? ""}
                        onChange={(e) => {
                            form.setValue("subcategoryId", e.target.value || undefined);
                        }}
                        disabled={!selectedCategory}
                        className="w-full rounded-[10px] border border-border-input bg-bg-input px-3.5 py-2.5 text-[13px] text-text-secondary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[160px]"
                    >
                        <option value="">Subcategoria</option>
                        {selectedCategory?.subcategories?.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Apply button */}
                <button
                    type="button"
                    onClick={applyFilters}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-linear-to-r from-[#2563EB] to-[#4F46E5] px-4 py-2.5 text-[13px] font-semibold text-text-on-accent transition-all hover:brightness-110 sm:w-auto"
                >
                    <MagnifyingGlassIcon className="h-4 w-4" />
                    Aplicar filtros
                </button>

                {/* Clear button */}
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-border-input bg-bg-input px-4 py-2.5 text-[13px] font-semibold text-text-secondary transition-all hover:bg-bg-card-hover sm:w-auto"
                >
                    <XMarkIcon className="h-4 w-4" />
                    Limpar
                </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <AppliedFilterTag
                    show={filters.search !== ""}
                    text={!!filters.search ? `Busca: ${filters.search}` : ""}
                    onRemove={() => handleRemoveFilter("search")}
                    disabled={isLoading}
                />

                <AppliedFilterTag
                    show={!!filters.categoryId}
                    text={
                        !!filters.categoryId
                            ? `Categoria: ${
                                  categories.find(
                                      (cat) => cat.id === filters.categoryId,
                                  )?.name
                              }`
                            : ""
                    }
                    onRemove={() => handleRemoveFilter("categoryId")}
                    disabled={isLoading}
                />

                <AppliedFilterTag
                    show={!!filters.subcategoryId}
                    text={
                        !!filters.subcategoryId
                            ? `Subcategoria: ${
                                  categories
                                      .find(
                                          (cat) =>
                                              cat.id === filters.categoryId,
                                      )
                                      ?.subcategories?.find(
                                          (s) => s.id === filters.subcategoryId,
                                      )?.name
                              }`
                            : ""
                    }
                    onRemove={() => handleRemoveFilter("subcategoryId")}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}
