
"use client";

import Link from "next/link";
import {
    Eye,
    Pencil,
    MoreHorizontal,
    UserX,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { Client } from "@/types/client";

interface ClientTableProps {
    clients: Client[];
    onDeactivate: (client: Client) => void;
    onDelete: (client: Client) => void;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
        maximumFractionDigits: 0,
    }).format(amount);
}

function getInitials(
    firstName: string,
    lastName: string,
) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function ClientTable({
    clients,
    onDeactivate,
    onDelete,
}: ClientTableProps) {
    if (clients.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-surface">
                <div className="flex min-h-[240px] items-center justify-center px-6 text-center">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            No clients found
                        </h3>

                        <p className="mt-1 text-sm text-muted">
                            Try changing your search or filter
                            criteria.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                    <thead>
                        <tr className="border-b border-border bg-surface-low">
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Client
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Branch
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                                Group
                            </th>

                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                                Loans
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
                                Outstanding
                            </th>

                            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted">
                                Status
                            </th>

                            <th className="w-16 px-4 py-3 text-right">
                                <span className="sr-only">
                                    Actions
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {clients.map((client) => (
                            <tr
                                key={client.id}
                                className="transition-colors hover:bg-surface-low/60"
                            >
                                {/* Client */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                            {getInitials(
                                                client.firstName,
                                                client.lastName,
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <Link
                                                href={`/clients/${client.id}`}
                                                className="block truncate text-sm font-semibold text-foreground hover:text-primary"
                                            >
                                                {client.firstName}{" "}
                                                {client.middleName &&
                                                    `${client.middleName} `}
                                                {client.lastName}
                                            </Link>

                                            <p className="mt-0.5 text-xs text-muted">
                                                {client.clientNumber}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Branch */}
                                <td className="px-5 py-4">
                                    <span className="text-sm text-foreground">
                                        {client.branchName}
                                    </span>
                                </td>

                                {/* Group */}
                                <td className="px-5 py-4">
                                    <span className="text-sm text-foreground">
                                        {client.groupName}
                                    </span>
                                </td>

                                {/* Loans */}
                                <td className="px-5 py-4 text-center">
                                    <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-surface-low px-2 py-1 text-sm font-medium text-foreground">
                                        {client.activeLoans}
                                    </span>
                                </td>

                                {/* Outstanding */}
                                <td className="px-5 py-4 text-right">
                                    <span className="whitespace-nowrap text-sm font-semibold text-foreground">
                                        {formatCurrency(
                                            client.outstandingBalance,
                                        )}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4 text-center">
                                    <Badge
                                        variant={
                                            client.status === "active"
                                                ? "success"
                                                : "neutral"
                                        }
                                    >
                                        {client.status === "active"
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuItem>
                                            <Link
                                                href={`/clients/${client.id}`}
                                                className="flex w-full items-center"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <Link
                                                href={`/clients/${client.id}/edit`}
className="flex w-full items-center"
    >
    <Pencil className="mr-2 h-4 w-4" />
    Edit
    </Link>
</DropdownMenuItem>

{client.status === "active" && (
    <DropdownMenuItem
        onClick={() =>
            onDeactivate(client)
        }
    >
        <UserX className="mr-2 h-4 w-4" />
        Deactivate
    </DropdownMenuItem>
)}

<DropdownMenuItem
    danger
    onClick={() =>
        onDelete(client)
    }
>
    <Trash2 className="mr-2 h-4 w-4" />
    Delete
</DropdownMenuItem>
</DropdownMenu>
</td>
</tr>
))}
</tbody>
</table>
</div>

<div className="flex items-center justify-between border-t border-border px-5 py-3">
    <p className="text-sm text-muted">
        Showing{" "}
        <span className="font-medium text-foreground">
                        {clients.length}
                    </span>{" "}
        client{clients.length !== 1 ? "s" : ""}
    </p>
</div>
</div>
);
}

