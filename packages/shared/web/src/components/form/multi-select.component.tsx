"use client";

import { ReactNode, forwardRef, useState, useRef, useEffect } from "react";
import { classNames } from "../../utils/tw.utils";
import { ItemNotFound } from "../ui";
import {
    ChevronDownIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface MultiSelectOption {
    label: string;
    value: string;
    description?: string;
    disabled?: boolean;
    meta?: Record<string, unknown>;
}

export interface MultiSelectFilterHelpers {
    normalize: (str: string) => string;
}

export interface MultiSelectProps {
    options: MultiSelectOption[];
    value?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    viewMode?: "default" | "cards";
    renderOptionMeta?: (option: MultiSelectOption) => ReactNode;
    filterOption?: (
        option: MultiSelectOption,
        search: string,
        helpers: MultiSelectFilterHelpers,
    ) => boolean;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
    (
        {
            options,
            value = [],
            onChange,
            disabled,
            className,
            placeholder = "Select options...",
            viewMode = "default",
            renderOptionMeta,
            filterOption,
        },
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [search, setSearch] = useState("");
        const wrapperRef = useRef<HTMLDivElement>(null);
        const searchRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    wrapperRef.current &&
                    !wrapperRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                    setSearch("");
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const toggleOption = (optionValue: string) => {
            if (disabled) return;

            const newValue = value.includes(optionValue)
                ? value.filter((v) => v !== optionValue)
                : [...value, optionValue];

            onChange?.(newValue);
        };

        const removeOption = (optionValue: string, e: React.MouseEvent) => {
            e.stopPropagation();
            if (disabled) return;

            const newValue = value.filter((v) => v !== optionValue);
            onChange?.(newValue);
        };

        const clearAll = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (disabled) return;

            onChange?.([]);
        };

        const normalize = (str: string) =>
            str
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        const defaultFilterOption = (
            option: MultiSelectOption,
            term: string,
        ): boolean =>
            normalize(option.label).includes(term) ||
            (option.description
                ? normalize(option.description).includes(term)
                : false);
        const normalizedSearch = normalize(search);
        const filteredOptions = search
            ? options.filter((option) => {
                  if (filterOption) {
                      return filterOption(option, search, { normalize });
                  }
                  return defaultFilterOption(option, normalizedSearch);
              })
            : options;

        const selectedOptions = options.filter((option) =>
            value.includes(option.value),
        );

        const renderDefaultView = () => (
            <>
                <div
                    className={classNames(
                        "block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6",
                        {
                            "cursor-not-allowed opacity-50": disabled,
                            "cursor-pointer": !disabled,
                        },
                        "min-h-10.5",
                    )}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedOptions.length > 0 ? (
                            <>
                                {selectedOptions.map((option) => (
                                    <span
                                        key={option.value}
                                        className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-200"
                                    >
                                        {option.label}
                                        <button
                                            type="button"
                                            onClick={(e) =>
                                                removeOption(option.value, e)
                                            }
                                            className="hover:text-white focus:outline-none"
                                            disabled={disabled}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="ml-1 text-xs text-gray-400 hover:text-white focus:outline-none"
                                    disabled={disabled}
                                >
                                    Clear all
                                </button>
                            </>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </div>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ChevronDownIcon
                            className={classNames(
                                "h-4 w-4 text-gray-400 transition-transform",
                                { "rotate-180": isOpen },
                            )}
                        />
                    </div>
                </div>

                {isOpen && !disabled && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-700 bg-gray-900 shadow-lg">
                        <div className="border-b border-gray-700 p-2">
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search options..."
                                className="w-full rounded bg-gray-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => {
                                    const isSelected = value.includes(
                                        option.value,
                                    );
                                    return (
                                        <div
                                            key={option.value}
                                            className={classNames(
                                                "flex items-center px-3 py-2 hover:bg-gray-800",
                                                {
                                                    "bg-indigo-500/10":
                                                        isSelected,
                                                    "cursor-not-allowed text-gray-500":
                                                        option.disabled,
                                                    "cursor-pointer":
                                                        !option.disabled,
                                                },
                                            )}
                                            onClick={() =>
                                                !option.disabled &&
                                                toggleOption(option.value)
                                            }
                                        >
                                            <div
                                                className={classNames(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                                                    {
                                                        "border-gray-600 bg-gray-800":
                                                            option.disabled,
                                                        "border-indigo-500 bg-indigo-500":
                                                            isSelected &&
                                                            !option.disabled,
                                                        "border-gray-500 bg-gray-800":
                                                            !isSelected &&
                                                            !option.disabled,
                                                    },
                                                )}
                                            >
                                                {isSelected && (
                                                    <CheckIcon className="h-3 w-3 text-white" />
                                                )}
                                            </div>

                                            <span
                                                className={classNames(
                                                    "text-sm",
                                                    {
                                                        "text-gray-500":
                                                            option.disabled,
                                                        "text-indigo-300":
                                                            isSelected &&
                                                            !option.disabled,
                                                    },
                                                )}
                                            >
                                                {option.label}{" "}
                                                {option?.description
                                                    ? `: ${option.description}`
                                                    : null}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-gray-500">
                                    No options found
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-700 px-3 py-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>
                                    {value.length} of {options.length} selected
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="hover:text-white focus:outline-none"
                                >
                                    Clear search
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );

        const renderCardsView = () => (
            <div className="space-y-4">
                <div className="relative">
                    <input
                        ref={searchRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search options..."
                        className={classNames(
                            "w-full rounded-md bg-white/5 px-3 py-2.5 text-sm text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500",
                            { "cursor-not-allowed opacity-50": disabled },
                        )}
                        disabled={disabled}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                            disabled={disabled}
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">
                        {value.length} of {options.length} selected
                    </div>
                    {value.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-sm text-gray-400 hover:text-white focus:outline-none"
                            disabled={disabled}
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => {
                            const isSelected = value.includes(option.value);
                            const isDisabled = option.disabled || disabled;

                            return (
                                <div
                                    key={option.value}
                                    className={classNames(
                                        "relative rounded-lg border p-4 transition-all",
                                        {
                                            "cursor-not-allowed border-gray-700 bg-gray-800/30 opacity-50":
                                                isDisabled,
                                            "cursor-pointer border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800":
                                                !isDisabled,
                                            "border-indigo-500/50 bg-indigo-500/10":
                                                isSelected,
                                        },
                                    )}
                                    onClick={() =>
                                        !isDisabled &&
                                        toggleOption(option.value)
                                    }
                                >
                                    <div
                                        className={classNames(
                                            "absolute right-3 bottom-3 flex h-5 w-5 items-center justify-center rounded border",
                                            {
                                                "border-gray-600 bg-gray-800":
                                                    isDisabled,
                                                "border-indigo-500 bg-indigo-500":
                                                    isSelected && !isDisabled,
                                                "border-gray-500 bg-gray-800":
                                                    !isSelected && !isDisabled,
                                            },
                                        )}
                                    >
                                        {isSelected && (
                                            <CheckIcon className="h-3 w-3 text-white" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-1 justify-between w-full">
                                            <h3
                                                className={classNames(
                                                    "font-medium",
                                                    {
                                                        "text-gray-500":
                                                            isDisabled,
                                                        "text-indigo-300":
                                                            isSelected &&
                                                            !isDisabled,
                                                        "text-white":
                                                            !isSelected &&
                                                            !isDisabled,
                                                    },
                                                )}
                                            >
                                                {option.label}
                                            </h3>
                                            {renderOptionMeta?.(option)}
                                        </div>
                                        {option.description && (
                                            <p className="mt-2 text-sm text-gray-300">
                                                {option.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <ItemNotFound
                            title="Opção não encontrada"
                            description="Tente uma busca diferente"
                            icon={ExclamationTriangleIcon}
                            className="min-h-auto col-span-full rounded-lg border border-dashed border-gray-700 bg-gray-800/30 p-8 text-center"
                        />
                    )}
                </div>
            </div>
        );

        return (
            <div
                ref={(node) => {
                    if (typeof ref === "function") {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                    wrapperRef.current = node;
                }}
                className={classNames("relative", {
                    [className || ""]: !!className,
                })}
            >
                {viewMode === "default"
                    ? renderDefaultView()
                    : renderCardsView()}
            </div>
        );
    },
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
