import type {
    TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({
                             className,
                             ...props
                         }: TextareaProps) {
    return (
        <textarea
            className={cn(
                "min-h-24 w-full rounded-lg border border-border",
                "bg-surface px-3 py-2 text-sm text-foreground",
                "placeholder:text-muted/70",
                "outline-none transition",
                "focus:border-primary focus:ring-2 focus:ring-primary/10",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}