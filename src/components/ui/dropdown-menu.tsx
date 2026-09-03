"use client";

import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    children: ReactNode;
}

interface DropdownMenuItemProps {
    children: ReactNode;
    onClick?: () => void;
    danger?: boolean;
    disabled?: boolean;
}

export function DropdownMenu({
                                 children,
                             }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node,
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape,
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative flex justify-end"
        >
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    "text-muted transition-colors",
                    "hover:bg-surface-low hover:text-foreground",
                    open && "bg-surface-low text-foreground",
                )}
                aria-label="Open actions"
                aria-expanded={open}
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {open && (
                <div
                    className={cn(
                        "absolute right-0 top-8 z-30 w-44",
                        "rounded-lg border border-border",
                        "bg-surface p-1 shadow-lg",
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export function DropdownMenuItem({
                                     children,
                                     onClick,
                                     danger = false,
                                     disabled = false,
                                 }: DropdownMenuItemProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "flex w-full items-center rounded-md px-3 py-2",
                "text-left text-xs transition-colors",
                "disabled:pointer-events-none disabled:opacity-50",

                danger
                    ? "text-error hover:bg-red-50"
                    : "text-foreground hover:bg-surface-low",
            )}
        >
            {children}
        </button>
    );
}