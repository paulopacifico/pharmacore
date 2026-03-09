"use client";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { CategoryDetailsDTO } from "@pharmacore/product";
import { useState } from "react";

interface CategoryMenuProps {
    categories: CategoryDetailsDTO[];
    onCategorySelect: (categoryId: string) => void;
    onSubcategorySelect: (categoryId: string, subcategoryId: string) => void;
}

export function CategoryMenu({
    onCategorySelect,
    onSubcategorySelect,
    categories,
}: CategoryMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState<CategoryDetailsDTO | null>(null);

    const setCurrentCategory = (id: string) => {
        const category = categories.find((cat) => cat.id === id);
        setCategory(category ?? null);
    };

    const onMouseEnter = () => {
        setCategory(null);
        setIsOpen(true);
    };

    const onMouseLeave = () => {
        setIsOpen(false);
        setCategory(null);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative group" onMouseLeave={onMouseLeave}>
            <button
                type="button"
                onClick={toggleOpen}
                onMouseEnter={onMouseEnter}
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border-input bg-bg-input text-text-secondary transition-all hover:bg-bg-card-hover"
                title="Abrir menu de categorias"
            >
                <Bars3Icon className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="pointer-events-auto absolute left-0 top-full z-50 mt-0 w-[calc(100vw-2rem)] rounded-xl border border-border-card bg-bg-sidebar p-4 pt-3 shadow-lg sm:w-fit">
                    <div className="grid max-h-96 min-w-0 grid-cols-1 gap-4 overflow-y-auto sm:min-w-2xl sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary mb-3 sticky top-0 bg-bg-sidebar">
                                Categorias
                            </h3>
                            <ul className="space-y-1 pr-2">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        onMouseEnter={() => {
                                            setCurrentCategory(category.id!);
                                        }}
                                        onClick={() => {
                                            onCategorySelect(category.id!);
                                        }}
                                        className="px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm text-text-secondary hover:bg-accent-blue/20 hover:text-text-primary"
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {category ? (
                            <div>
                                <h3 className="text-sm font-semibold text-accent-blue mb-3 sticky top-0 bg-bg-sidebar">
                                    {category?.name}
                                </h3>
                                <ul className="space-y-1 pr-2">
                                    {category?.subcategories?.map((sub) => (
                                        <li
                                            key={sub.id}
                                            onClick={() => {
                                                onSubcategorySelect(
                                                    category.id!,
                                                    sub.id,
                                                );
                                                setIsOpen(false);
                                            }}
                                            className="px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm text-text-secondary hover:bg-accent-blue/20 hover:text-text-primary"
                                        >
                                            {sub.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-center text-text-muted py-8">
                                <p className="text-xs">
                                    Selecione uma categoria para ver as
                                    subcategorias.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
