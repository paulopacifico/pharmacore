import { classNames } from "../../utils/tw.utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  totalLabel?: string;
  className?: string;
}

export function PaginationControls({
  page,
  totalPages,
  totalItems,
  onPageChange,
  totalLabel = "itens",
  className,
}: PaginationControlsProps) {
  const safeTotalPages = totalPages || 1;
  const canGoBack = page > 1;
  const canGoForward = totalPages > 0 && page < totalPages;

  const pages = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <div
      className={classNames(
        "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-text-muted">{`Mostrando ${totalItems} ${totalLabel}`}</p>
      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-normal">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoBack}
          aria-label="Página anterior"
          title="Página anterior"
          className="rounded-lg border border-border-input bg-bg-input px-2.5 py-1.5 text-xs text-text-secondary transition-all hover:bg-bg-card-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        </button>
        <span className="text-xs font-semibold text-text-secondary">Página {page} de {safeTotalPages}</span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoForward}
          aria-label="Próxima página"
          title="Próxima página"
          className="rounded-lg border border-border-input bg-bg-input px-2.5 py-1.5 text-xs text-text-secondary transition-all hover:bg-bg-card-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
