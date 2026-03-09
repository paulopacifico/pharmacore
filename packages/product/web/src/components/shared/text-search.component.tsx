"use client";

import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TextSearchProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
    placeholder: string;
}

export function TextSearch({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder,
}: TextSearchProps) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="relative flex-1">
            <button
                type="button"
                onClick={onSearch}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                title="Pesquisar"
            >
                <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-[10px] border border-border-input bg-bg-input px-3.5 py-2.5 pl-10 pr-12 text-[13px] text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
            />
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors"
                    title="Limpar busca"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
