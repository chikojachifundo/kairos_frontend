"use client";

import Link from "next/link";
import { Eye, Edit, Settings2, Power, Trash2 } from "lucide-react";

import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ProductTableProps {
    products: Product[];
    getChargeCount: (productId: number) => number;
    onDeactivate: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const paymentTermLabels: Record<Product["paymentTerm"], string> = {
    daily: "Daily",
    weekly: "Weekly",
    biweekly: "Biweekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    annually: "Annually",
};

export function ProductTable({
                                 products,
                                 getChargeCount,
                                 onDeactivate,
                                 onDelete,
                             }: ProductTableProps) {
    if (products.length === 0) {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface-low">
                <p className="text-sm text-muted">
                    No products found.
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
                        Product
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Code
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Payment Term
                    </th>

                    <th className="px-4 py-3 text-center font-medium text-muted">
                        Charges
                    </th>

                    <th className="px-4 py-3 font-medium text-muted">
                        Status
                    </th>

                    <th className="w-12 px-4 py-3" />
                </tr>
                </thead>

                <tbody>
                {products.map((product) => (
                    <tr
                        key={product.id}
                        className="border-b border-border last:border-0 hover:bg-surface-low/50"
                    >
                        <td className="px-4 py-3">
                            <div>
                                <Link
                                    href={`/products/${product.id}`}
                                    className="font-medium text-foreground hover:text-primary"
                                >
                                    {product.name}
                                </Link>

                                {product.description && (
                                    <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted">
                                        {product.description}
                                    </p>
                                )}
                            </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-xs text-muted">
                            {product.code}
                        </td>

                        <td className="px-4 py-3 text-muted">
                            {paymentTermLabels[product.paymentTerm]}
                        </td>

                        <td className="px-4 py-3 text-center">
                            <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {getChargeCount(product.id)}
                            </span>
                        </td>

                        <td className="px-4 py-3">
                            <Badge
                                variant={
                                    product.status === "active"
                                        ? "success"
                                        : "neutral"
                                }
                            >
                                {product.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </Badge>
                        </td>

                        <td className="px-4 py-3">
                            <DropdownMenu>
                                <DropdownMenuItem>
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="flex w-full items-center"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="flex w-full items-center"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <Link
                                        href={`/products/${product.id}/charges`}
                                        className="flex w-full items-center"
                                    >
                                        <Settings2 className="mr-2 h-4 w-4" />
                                        Manage Charges
                                    </Link>
                                </DropdownMenuItem>

                                {product.status === "active" && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            onDeactivate(product)
                                        }
                                    >
                                        <Power className="mr-2 h-4 w-4" />
                                        Deactivate
                                    </DropdownMenuItem>
                                )}

                                {product.status === "inactive" && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            onDeactivate(product)
                                        }
                                    >
                                        <Power className="mr-2 h-4 w-4" />
                                        Activate
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                    danger
                                    onClick={() => onDelete(product)}
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
