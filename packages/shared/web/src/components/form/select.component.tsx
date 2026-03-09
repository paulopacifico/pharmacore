"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { classNames } from "../../utils/tw.utils";

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}
export interface SelectProps {
    options: SelectOption[];
    value?: SelectOption;
    onChange?: (value: SelectOption) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        {
            options,
            value = undefined,
            onChange,
            disabled,
            className,
            placeholder = "Selecione uma option...",
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

        useEffect(() => {
            if (isOpen && searchRef.current) {
                setTimeout(() => searchRef.current?.focus(), 100);
            }
        }, [isOpen]);

        const selectOption = (option: SelectOption) => {
            if (disabled) return;

            onChange?.(option);
            setIsOpen(false);
            setSearch("");
        };

        const filteredOptions = options.filter((option) =>
            option.label.toLowerCase().includes(search.toLowerCase()),
        );

        const getValueId = () => {
            return value?.value;
        };

        const selectedOption = options.find(
            (option) => option.value === getValueId(),
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
                className={classNames("relative", className)}
            >
                <div
                    className={classNames(
                        "flex h-[38px] w-full items-center rounded-[10px] border border-border-input bg-bg-input px-3 text-sm text-text-primary transition-colors focus:border-accent-blue focus:ring-1 focus:ring-accent-blue",
                        disabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer",
                    )}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <div className="flex items-center justify-between w-full">
                        <span
                            className={
                                selectedOption
                                    ? "text-text-secondary"
                                    : "text-text-muted"
                            }
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </span>
                        <div className="shrink-0">
                            <svg
                                className={classNames(
                                    "h-3.5 w-3.5 text-text-muted transition-transform",
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
                    <div className="absolute z-50 mt-1 w-full rounded-[10px] border border-border-card bg-bg-card shadow-lg">
                        <div className="border-b border-border-card p-2">
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar opções..."
                                className="w-full rounded-lg border border-border-input bg-bg-input px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => {
                                    const isSelected =
                                        value?.value === option.value;
                                    return (
                                        <div
                                            key={option.value}
                                            className={classNames(
                                                "flex items-center px-3 py-2 hover:bg-accent-blue/10",
                                                isSelected &&
                                                    "bg-accent-blue/15",
                                                option.disabled
                                                    ? "cursor-not-allowed text-text-muted"
                                                    : "cursor-pointer",
                                            )}
                                            onClick={() =>
                                                !option.disabled &&
                                                selectOption(option)
                                            }
                                        >
                                            <div
                                                className={classNames(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                                                    option.disabled
                                                        ? "border-border-input bg-bg-input"
                                                        : isSelected
                                                          ? "border-accent-blue bg-accent-blue"
                                                          : "border-border-input bg-bg-input",
                                                )}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        className="h-3 w-3 text-text-on-accent"
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
                                                    option.disabled &&
                                                        "text-text-muted",
                                                    isSelected
                                                        ? "text-accent-blue"
                                                        : "text-text-secondary",
                                                )}
                                            >
                                                {option.label}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-text-muted">
                                    Nenhuma opção encontrada
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

Select.displayName = "Select";

export { Select };
