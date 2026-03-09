import { XMarkIcon } from "@heroicons/react/24/outline";

interface AppliedFilterProps {
    text: string;
    onRemove: () => void;
    disabled: boolean;
    show: boolean;
}

export function AppliedFilterTag({
    text,
    onRemove,
    disabled,
    show,
}: AppliedFilterProps) {
    if (!show) {
        return null;
    }
    return (
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-blue/12 px-3 py-1 text-sm text-accent-blue ring-1 ring-accent-blue/30">
            <span>{text}</span>
            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="ml-1 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                title="Remover filtro"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        </div>
    );
}
