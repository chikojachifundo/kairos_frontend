import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}

export function PageHeader({
                               title,
                               description,
                               icon: Icon,
                               action,
                           }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div
                            className={cn(
                                "flex h-10 w-10 items-center justify-center",
                                "rounded-lg bg-primary/10 text-primary",
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                    )}

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">
                            {title}
                        </h1>

                        {description && (
                            <p className="mt-1 text-sm text-muted">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {action && <div>{action}</div>}
        </div>
    );
}