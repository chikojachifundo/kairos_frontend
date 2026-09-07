"use client";

import Link from "next/link";

import {
    Edit,
    Eye,
    MoreHorizontal,
    Trash2,
    Power,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { ProductCharge } from "@/types/product-charge";
import type { ProductChargeRecord } from "@/types/product-charge-record";

interface ProductChargeRecordTableProps {
    productId: number;
    records: ProductChargeRecord[];
    charges: ProductCharge[];
    onDeactivate: (record: ProductChargeRecord) => void;
    onDelete: (record: ProductChargeRecord) => void;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
        maximumFractionDigits: 0,
    }).format(value);
}

export function ProductChargeRecordTable({
                                             productId,
                                             records,
                                             charges,
                                             onDeactivate,
                                             onDelete,
                                         }: ProductChargeRecordTableProps) {
    function getCharge(record: ProductChargeRecord) {
        return charges.find(
            (charge) => charge.id === record.productChargeId,
        );
    }

    function formatValue(
        value: number,
        type?: ProductCharge["type"],
    ) {
        if (type === "percentage") {
            return `${value}%`;
        }

        return formatCurrency(value);
    }

    if (records.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-surface">
                <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <MoreHorizontal className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-foreground">
                        No charges configured
                    </h3>

                    <p className="mx-auto mt-1 max-w-md text-sm text-muted">
                        No charges have been assigned to this product yet.
                        Add a charge to define how it applies to this loan
                        product.
                    </p>

                    <Button
                        variant="primary"
                        size="sm"
                        className="mt-5"
                        asChild
                    >
                        <Link
                            href={`/products/${productId}/charges/create`}
                        >
                            Add Product Charge
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                    <thead className="border-b border-border bg-surface-low">
                    <tr>
                        <th className="px-5 py-3 text-left font-semibold text-foreground">
                            Charge
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-foreground">
                            Type
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-foreground">
                            Value
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-foreground">
                            Description
                        </th>

                        <th className="px-5 py-3 text-left font-semibold text-foreground">
                            Status
                        </th>

                        <th className="px-5 py-3 text-right font-semibold text-foreground">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                    {records.map((record) => {
                        const charge = getCharge(record);

                        return (
                            <tr
                                key={record.id}
                                className="transition-colors hover:bg-surface-low/60"
                            >
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {charge?.name ??
                                                "Unknown Charge"}
                                        </p>

                                        <p className="mt-0.5 text-xs text-muted">
                                            {charge?.code ?? "—"}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                        <span className="capitalize text-muted">
                                            {charge?.type ===
                                            "fixed-amount"
                                                ? "Fixed Amount"
                                                : "Percentage"}
                                        </span>
                                </td>

                                <td className="px-5 py-4">
                                        <span className="font-semibold text-foreground">
                                            {formatValue(
                                                record.value,
                                                charge?.type,
                                            )}
                                        </span>
                                </td>

                                <td className="max-w-[260px] px-5 py-4">
                                        <span className="line-clamp-2 text-muted">
                                            {record.description || "—"}
                                        </span>
                                </td>

                                <td className="px-5 py-4">
                                    <Badge
                                        variant={
                                            record.status === "active"
                                                ? "success"
                                                : "neutral"
                                        }
                                    >
                                        {record.status === "active"
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/products/${productId}/charges/${record.id}`}
                                                    className="flex w-full items-center gap-2"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/products/${productId}/charges/${record.id}/edit`}
                                                    className="flex w-full items-center gap-2"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>

                                            {record.status === "active" && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onDeactivate(
                                                            record,
                                                        )
                                                    }
                                                >
                                                    <Power className="mr-2 h-4 w-4" />
                                                    Deactivate
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuItem
                                                danger
                                                onClick={() =>
                                                    onDelete(record)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenu>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}