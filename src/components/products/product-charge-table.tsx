"use client";

import Link from "next/link";
import { Edit, Eye, Power, Trash2 } from "lucide-react";

import type { ProductCharge } from "@/types/product-charge";

import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ProductChargeTableProps {
    charges: ProductCharge[];
    onDeactivate: (charge: ProductCharge) => void;
    onDelete: (charge: ProductCharge) => void;
}

export function ProductChargeTable({
                                       charges,
                                       onDeactivate,
                                       onDelete,
                                   }: ProductChargeTableProps) {
    if (charges.length === 0) {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface-low">
                <p className="text-sm text-muted">
                    No charge definitions found.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
                <thead>
                <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 font-medium text-muted">
                        Charge
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Code
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Type
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Description
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Status
                    </th>

                    <th className="w-12 px-4 py-3" />
                </tr>
                </thead>

                <tbody>
                {charges.map((charge) => (
                    <tr
                        key={charge.id}
                        className="border-b border-border last:border-0 hover:bg-surface-low/50"
                    >
                        <td className="px-4 py-3">
                            <span className="font-medium text-foreground">
                                {charge.name}
                            </span>
                        </td>

                        <td className="px-4 py-3 font-mono text-xs text-muted">
                            {charge.code}
                        </td>

                        <td className="px-4 py-3">
                            <Badge variant="neutral">
                                {charge.type === "percentage"
                                    ? "Percentage"
                                    : "Fixed Amount"}
                            </Badge>
                        </td>

                        <td className="max-w-[300px] px-4 py-3">
                            <span className="block truncate text-muted">
                                {charge.description || "—"}
                            </span>
                        </td>

                        <td className="px-4 py-3">
                            <Badge
                                variant={
                                    charge.status === "active"
                                        ? "success"
                                        : "neutral"
                                }
                            >
                                {charge.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </Badge>
                        </td>

                        <td className="px-4 py-3">
                            <DropdownMenu>
                                <DropdownMenuItem>
                                    <Link
                                        href={`/products/charges/${charge.id}`}
                                        className="flex w-full items-center"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Link
                                        href={`/products/charges/${charge.id}/edit`}
                                        className="flex w-full items-center"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() =>
                                        onDeactivate(charge)
                                    }
                                >
                                    <Power className="mr-2 h-4 w-4" />

                                    {charge.status === "active"
                                        ? "Deactivate"
                                        : "Activate"}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    danger
                                    onClick={() => onDelete(charge)}
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
    );
}