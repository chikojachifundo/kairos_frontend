import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
    href?: string;
    children: ReactNode;
}

export function Button({
                           children,
                           className,
                           variant = "primary",
                           size = "md",
                           asChild = false,
                           href,
                           ...props
                       }: ButtonProps) {
    const classes = cn(
        "inline-flex items-center justify-center gap-2 rounded-lg",
        "font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary/30",
        "disabled:pointer-events-none disabled:opacity-50",

        variant === "primary" &&
        "bg-primary text-white hover:bg-primary-container",

        variant === "secondary" &&
        "bg-secondary text-white hover:bg-secondary/90",

        variant === "outline" &&
        "border border-border bg-surface text-foreground hover:bg-surface-low",

        variant === "ghost" &&
        "text-muted hover:bg-surface-low hover:text-foreground",

        variant === "danger" &&
        "bg-error text-white hover:bg-error/90",

        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-5 text-sm",
        size === "icon" && "h-9 w-9",

        className,
    );

    if (asChild && href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
}