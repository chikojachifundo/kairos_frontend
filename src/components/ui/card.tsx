import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}

function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border border-border bg-surface shadow-sm",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}

function CardHeader({
                        children,
                        className,
                        ...props
                    }: CardHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col space-y-1.5 p-5",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardTitleProps extends React.ComponentProps<"h3"> {
    children: React.ReactNode;
}

function CardTitle({
                       children,
                       className,
                       ...props
                   }: CardTitleProps) {
    return (
        <h3
            className={cn(
                "text-sm font-semibold leading-none tracking-tight",
                className,
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

interface CardContentProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}

function CardContent({
                         children,
                         className,
                         ...props
                     }: CardContentProps) {
    return (
        <div
            className={cn(
                "p-5 pt-0",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardFooterProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}

function CardFooter({
                        children,
                        className,
                        ...props
                    }: CardFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center p-5 pt-0",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
};