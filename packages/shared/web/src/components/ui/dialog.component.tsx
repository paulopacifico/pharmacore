import {
    Dialog as PrimitiveDialog,
    DialogPanel,
    DialogTitle,
    Description,
} from "@headlessui/react";
import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    type?: "confirm" | "delete" | "info";
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (() => void) | (() => Promise<void>);
}

export function Dialog({
    isOpen,
    onClose,
    title,
    children,
    type = "confirm",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
}: DialogProps) {
    const getTypeStyles = () => {
        switch (type) {
            case "delete":
                return {
                    button: "border border-status-error hover:bg-status-error hover:text-text-on-accent text-status-error",
                    title: "text-status-error",
                };
            case "info":
                return {
                    button: "border border-accent-blue hover:bg-accent-blue hover:text-text-on-accent text-accent-blue",
                    title: "text-accent-blue",
                };
            default:
                return {
                    button: "border border-border-strong hover:bg-bg-card-hover text-text-secondary",
                    title: "text-text-primary",
                };
        }
    };

    const styles = getTypeStyles();

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <PrimitiveDialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/60" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="max-w-md bg-bg-card border border-border-subtle rounded-[var(--radius-card)] p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <DialogTitle
                            className={`font-heading text-lg font-semibold ${styles.title}`}
                        >
                            {title}
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="cursor-pointer rounded-md p-1 hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <Description className="text-text-secondary mb-6">
                        {children}
                    </Description>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 text-sm font-medium border border-border-subtle text-text-secondary hover:bg-bg-card-hover rounded-[var(--radius-btn)] transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-[var(--radius-btn)] transition-colors ${styles.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </PrimitiveDialog>
    );
}
