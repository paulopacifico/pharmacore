"use client";

import { useState, useRef, useEffect } from "react";
import { classNames } from "../../utils/tw.utils";

export interface SelectAsyncOption {
    label: string;
    value: string;
}

export interface SelectAsyncProps {
    initialOptions?: SelectAsyncOption[];
    onSearch: (searchTerm: string) => Promise<SelectAsyncOption[]>;
    value?: SelectAsyncOption;
    onChange?: (option: SelectAsyncOption) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    debounceMs?: number;
}

export function SelectAsync({
    initialOptions = [],
    onSearch,
    value = undefined,
    onChange,
    disabled,
    className,
    placeholder = "Selecione uma option...",
    debounceMs = 500,
}: SelectAsyncProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState<SelectAsyncOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const initialOptionsRef = useRef(initialOptions);

    useEffect(() => {
        initialOptionsRef.current = initialOptions;
        if (search.trim() === "") {
            setOptions(initialOptions);
        }
    }, [initialOptionsRef]);

    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (search.trim() === "") {
            setOptions(initialOptionsRef.current);
            setIsLoading(false);
            return;
        }

        debounceTimerRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await onSearch(search);
                setOptions(results);
            } catch (error) {
                console.error("Error searching options:", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, debounceMs);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [search, debounceMs, onSearch]);

    const selectOption = (option: SelectAsyncOption) => {
        if (disabled) return;

        onChange?.(option);
        setIsOpen(false);
        setSearch("");
    };

    const selectedOption = value;

    return (
        <div className={classNames("relative", className)}>
            <div
                className={classNames(
                    "block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6",
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer",
                    "min-h-10.5",
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <span
                        className={
                            selectedOption ? "text-white" : "text-gray-400"
                        }
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="shrink-0">
                        <svg
                            className={classNames(
                                "h-4 w-4 text-gray-400 transition-transform",
                                isOpen && "rotate-180",
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-700 bg-gray-900 shadow-lg">
                    <div className="border-b border-gray-700 p-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search options..."
                            className="w-full rounded bg-gray-800 px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            onClick={(e) => e.stopPropagation()}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center px-3 py-4">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500"></div>
                                <span className="ml-2 text-sm text-gray-400">
                                    Buscando...
                                </span>
                            </div>
                        ) : options.length > 0 ? (
                            options.map((option) => {
                                const isSelected =
                                    value?.value === option.value;
                                return (
                                    <div
                                        key={option.value}
                                        className={classNames(
                                            "flex items-center px-3 py-2 hover:bg-gray-800",
                                            isSelected && "bg-indigo-500/10",
                                        )}
                                        onClick={() => selectOption(option)}
                                    >
                                        <div
                                            className={classNames(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                                                isSelected
                                                    ? "border-indigo-500 bg-indigo-500"
                                                    : "border-gray-500 bg-gray-800",
                                            )}
                                        >
                                            {isSelected && (
                                                <svg
                                                    className="h-3 w-3 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>

                                        <span
                                            className={classNames(
                                                "text-sm",
                                                isSelected && "text-indigo-300",
                                            )}
                                        >
                                            {option.label}{" "}
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
                </div>
            )}
        </div>
    );
}
