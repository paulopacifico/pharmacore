"use client";

import { SubcategoryItem } from ".";

interface SubcategoryFormInputProps {
    subcategories: { id?: string; name: string; alias?: string }[];
    onSubcategoriesChange: (
        subcategories: { id?: string; name: string; alias?: string }[],
    ) => void;
    errors?: any;
}

export function SubcategoryFormInput({
    subcategories,
    onSubcategoriesChange,
    errors,
}: SubcategoryFormInputProps) {
    const swapArrayElements = (
        array: { id?: string; name: string; alias?: string }[],
        fromIndex: number,
        toIndex: number,
    ) => {
        const updated = [...array];
        [updated[fromIndex], updated[toIndex]] = [
            updated[toIndex]!,
            updated[fromIndex]!,
        ];
        return updated;
    };

    const moveSubcategoryUp = (index: number) => {
        if (index === 0) return;
        const updated = swapArrayElements(subcategories, index - 1, index);
        onSubcategoriesChange(updated);
    };

    const moveSubcategoryDown = (index: number) => {
        if (index === subcategories.length - 1) return;
        const updated = swapArrayElements(subcategories, index, index + 1);
        onSubcategoriesChange(updated);
    };

    const removeSubcategory = (itemName: string) => {
        const updated = subcategories.filter(
            (sub) =>
                sub.name.trim().toLowerCase() !== itemName.trim().toLowerCase(),
        );
        onSubcategoriesChange(updated);
    };

    const updateSubcategory = (
        index: number,
        updatedSubcategory: { name?: string; alias?: string },
    ) => {
        const updated = subcategories.map((sub, idx) =>
            idx === index ? { ...sub, ...updatedSubcategory } : sub,
        );
        onSubcategoriesChange(updated);
    };

    return (
        <div className="space-y-2">
            {(subcategories ?? []).map((subcategory, index) => (
                <div
                    key={`${subcategory.id}-${subcategory.name}`}
                    className="space-y-1"
                >
                    <SubcategoryItem
                        name={subcategory.name}
                        alias={subcategory.alias || ""}
                        index={index}
                        isFirst={index === 0}
                        isLast={index === (subcategories?.length ?? 0) - 1}
                        onUpdate={(updatedData) =>
                            updateSubcategory(index, updatedData)
                        }
                        onRemove={() => removeSubcategory(subcategory.name)}
                        onMoveUp={moveSubcategoryUp}
                        onMoveDown={moveSubcategoryDown}
                    />

                    {(errors?.[index]?.name?.message ||
                        errors?.[index]?.alias?.message) && (
                        <div className="space-y-1">
                            {errors?.[index]?.name?.message && (
                                <span className="text-xs text-red-500">
                                    Nome: {errors[index].name.message}
                                </span>
                            )}
                            {errors?.[index]?.alias?.message && (
                                <span className="text-xs text-red-500">
                                    Alias: {errors[index].alias.message}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
