"use client";

import {AlertTriangle, CheckCircle2, Trash2} from "lucide-react";

import {Button} from "@/components/ui/button";

type ConfirmDialogVariant = "save" | "delete" | "warning";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
                                  open,
                                  title,
                                  description,
                                  confirmText = "Confirm",
                                  cancelText = "Cancel",
                                  variant = "warning",
                                  loading = false,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDialogProps) {
    if (!open) {
        return null;
    }

    const Icon =
        variant === "delete"
            ? Trash2
            : variant === "save"
                ? CheckCircle2
                : AlertTriangle;

    const iconContainer =
        variant === "delete"
            ? "bg-red-100 text-red-600"
            : variant === "save"
                ? "bg-green-100 text-green-600"
                : "bg-amber-100 text-amber-600";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
        >
            <div className="w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-xl">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconContainer}`}
                        >
                            <Icon className="h-5 w-5"/>
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="confirm-dialog-title"
                                className="text-lg font-semibold text-foreground"
                            >
                                {title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-border bg-surface-low px-6 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        variant={
                            variant === "delete"
                                ? "danger"
                                : "primary"
                        }
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}