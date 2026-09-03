import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface DataTableColumn<T> {
    key: string;
    header: string;
    className?: string;
    render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    rowKey: (item: T) => string | number;
    emptyMessage?: string;
}

export function DataTable<T>({
                                 data,
                                 columns,
                                 rowKey,
                                 emptyMessage = "No records found.",
                             }: DataTableProps<T>) {
    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-border bg-surface-low">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    "px-4 py-3 text-xs font-semibold uppercase",
                                    "tracking-wider text-muted",
                                    column.className,
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-10 text-center text-sm text-muted"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={rowKey(item)}
                                className="transition-colors hover:bg-primary/5"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            "px-4 py-4 text-sm",
                                            column.className,
                                        )}
                                    >
                                        {column.render(item)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}