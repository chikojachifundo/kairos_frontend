import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({
                          className,
                          ...props
                      }: InputProps) {
    return (
        <input
            className={cn(
                "h-10 w-full rounded-lg border border-border bg-surface",
                "px-3 text-sm text-foreground",
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