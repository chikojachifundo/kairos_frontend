"use client";

import { MoreHorizontal } from "lucide-react";

import type { Client } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import {
    DataTable,
    type DataTableColumn,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";

interface ClientTableProps {
    clients: Client[];
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

export function ClientTable({
                                clients,
                            }: ClientTableProps) {
    const columns: DataTableColumn<Client>[] = [
        {
            key: "name",
            header: "Name",
            render: (client) => (
                <div className="flex items-center gap-3">
                    <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-semibold text-white sm:flex">
                        {client.initials}
                    </div>

                    <div>
                        <p className="font-medium text-foreground">
                            {client.name}
                        </p>

                        <p className="text-xs text-muted md:hidden">
                            {client.phone}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: "group",
            header: "Group",
            className: "hidden sm:table-cell",
            render: (client) => client.group,
        },

        {
            key: "phone",
            header: "Phone",
            className: "hidden md:table-cell",
            render: (client) => client.phone,
        },

        {
            key: "activeLoans",
            header: "Active Loans",
            className: "text-right tabular-nums",
            render: (client) => client.activeLoans,
        },

        {
            key: "totalBorrowed",
            header: "Total Borrowed",
            className:
                "hidden text-right tabular-nums lg:table-cell",
            render: (client) =>
                formatCurrency(client.totalBorrowed),
        },

        {
            key: "status",
            header: "Status",
            render: (client) => (
                <Badge
                    variant={
                        client.status === "active"
                            ? "success"
                            : client.status === "arrears"
                                ? "danger"
                                : "neutral"
                    }
                >
                    {client.status === "active"
                        ? "Active"
                        : client.status === "arrears"
                            ? "Arrears"
                            : "Inactive"}
                </Badge>
            ),
        },

        {
            key: "actions",
            header: "Action",
            className: "text-right",
            render: () => (
                <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-low hover:text-foreground"
                    aria-label="Client actions"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-0">
            <DataTable
                data={clients}
                columns={columns}
                rowKey={(client) => client.id}
                emptyMessage="No clients match your search criteria."
            />

            <Pagination
                currentPage={1}
                totalPages={3}
                totalItems={124}
                from={1}
                to={clients.length}
                onPageChange={(page) => {
                    console.log("Change page:", page);
                }}
            />
        </div>
    );
}