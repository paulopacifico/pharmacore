"use client";
import { useForm } from "react-hook-form";
import { AppliedFilterTag } from "../product";
import { TextSearch } from "../shared";
import { BrandFiltersDTO } from "@pharmacore/product";

interface FilterFormData extends BrandFiltersDTO {}

interface BrandFilterProps {
    filters: FilterFormData;
    updateFilters: (filters: FilterFormData) => void;
}

export function BrandFilter({ filters, updateFilters }: BrandFilterProps) {
    const form = useForm<FilterFormData>({
        defaultValues: {
            search: filters.search ?? "",
        },
    });

    const applyFilters = async () => {
        const filterValues = form.getValues();
        updateFilters(filterValues);
    };

    const handleRemoveFilter = (filterType: "search") => {
        const resetValue = "";
        form.setValue(filterType, resetValue);
        applyFilters();
    };

    const handleSearchChange = (value: string) => {
        form.setValue("search", value);
    };

    const handleSearchClear = () => {
        handleRemoveFilter("search");
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3 items-center">
                <TextSearch
                    value={form.watch("search") ?? ""}
                    onChange={handleSearchChange}
                    onSearch={applyFilters}
                    onClear={handleSearchClear}
                    placeholder="Buscar marcas..."
                />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <AppliedFilterTag
                    show={!!filters.search && filters.search !== ""}
                    text={!!filters.search ? `Busca: ${filters.search}` : ""}
                    onRemove={() => handleRemoveFilter("search")}
                    disabled={false}
                />
            </div>
        </div>
    );
}
