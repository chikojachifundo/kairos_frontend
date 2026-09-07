import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export function Input({
                          className,
                          leftIcon,
                          rightIcon,
                          ...props
                      }: InputProps) {
    return (
        <div className="relative w-full">
            {leftIcon && (
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted">
                    {leftIcon}
                </span>
            )}

            <input
                className={cn(
                    "h-10 w-full rounded-lg border border-border bg-surface",
                    "text-sm text-foreground",
                    "placeholder:text-muted/70",
                    "outline-none transition",
                    "focus:border-primary focus:ring-2 focus:ring-primary/10",
                    "disabled:cursor-not-allowed disabled:opacity-50",

                    // Horizontal padding
                    leftIcon && rightIcon
                        ? "pl-10 pr-10"
                        : leftIcon
                            ? "pl-10 pr-3"
                            : rightIcon
                                ? "pl-3 pr-10"
                                : "px-3",

                    className,
                )}
                {...props}
            />

            {rightIcon && (
                <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted">
                    {rightIcon}
                </span>
            )}
        </div>
    );
}