interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({
                               title,
                               description,
                               action,
                           }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

            {action && <div>{action}</div>}
        </div>
    );
}