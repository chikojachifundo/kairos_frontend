import type {
    SelectHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface SelectProps
    extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({
                           className,
                           children,
                           ...props
                       }: SelectProps) {
    return (
        <select
            className={cn(
                "h-10 w-full rounded-lg border border-border",
                "bg-surface px-3 text-sm text-foreground",
                "outline-none transition",
                "focus:border-primary focus:ring-2 focus:ring-primary/10",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}