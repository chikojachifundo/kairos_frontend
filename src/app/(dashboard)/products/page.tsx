"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
    Package,
    Plus,
    Search,
} from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFeedback } from "@/components/ui/feedback-bar";

import { ProductTable } from "@/components/products/product-table";
import { ProductChargeTable } from "@/components/products/product-charge-table";

import {
    mockProducts,
    mockProductCharges,
    mockProductChargeRecords,
} from "./mock-data";

import type { Product } from "@/types/product";
import type { ProductCharge } from "@/types/product-charge";


export default function ProductsPage() {
    const { showFeedback } = useFeedback();

    const [products, setProducts] = useState(mockProducts);
    const [charges, setCharges] = useState(mockProductCharges);

    const [productSearch, setProductSearch] = useState("");
    const [chargeSearch, setChargeSearch] = useState("");

    const [productStatus, setProductStatus] =
        useState<"all" | "active" | "inactive">("all");

    const [chargeStatus, setChargeStatus] =
        useState<"all" | "active" | "inactive">("all");

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const [selectedCharge, setSelectedCharge] =
        useState<ProductCharge | null>(null);

    const [showProductDialog, setShowProductDialog] =
        useState(false);

    const [showChargeDialog, setShowChargeDialog] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const filteredProducts = useMemo(() => {
        const search = productSearch.toLowerCase().trim();

        return products.filter((product) => {
            const matchesSearch =
                !search ||
                product.name.toLowerCase().includes(search) ||
                product.code.toLowerCase().includes(search);

            const matchesStatus =
                productStatus === "all" ||
                product.status === productStatus;

            return matchesSearch && matchesStatus;
        });
    }, [products, productSearch, productStatus]);

    const filteredCharges = useMemo(() => {
        const search = chargeSearch.toLowerCase().trim();

        return charges.filter((charge) => {
            const matchesSearch =
                !search ||
                charge.name.toLowerCase().includes(search) ||
                charge.code.toLowerCase().includes(search);

            const matchesStatus =
                chargeStatus === "all" ||
                charge.status === chargeStatus;

            return matchesSearch && matchesStatus;
        });
    }, [charges, chargeSearch, chargeStatus]);

    const getChargeCount = (productId: string) => {
        return mockProductChargeRecords.filter(
            (record) => String(record.productId) === productId,
        ).length;
    };

    const activeProducts = products.filter(
        (product) => product.status === "active",
    ).length;

    const inactiveProducts = products.filter(
        (product) => product.status === "inactive",
    ).length;

    const activeCharges = charges.filter(
        (charge) => charge.status === "active",
    ).length;

    const handleProductStatus = (product: Product) => {
        setSelectedProduct(product);
        setShowProductDialog(true);
    };

    const handleChargeStatus = (charge: ProductCharge) => {
        setSelectedCharge(charge);
        setShowChargeDialog(true);
    };

    const confirmProductStatus = () => {
        if (!selectedProduct) return;

        setActionLoading(true);

        setTimeout(() => {
            const newStatus =
                selectedProduct.status === "active"
                    ? "inactive"
                    : "active";

            setProducts((current) =>
                current.map((product) =>
                    product.id === selectedProduct.id
                        ? {
                            ...product,
                            status: newStatus,
                        }
                        : product,
                ),
            );

            setActionLoading(false);
            setShowProductDialog(false);

            showFeedback(
                "success",
                newStatus === "active"
                    ? "Product activated"
                    : "Product deactivated",
                `${selectedProduct.name} has been ${
                    newStatus === "active"
                        ? "activated"
                        : "deactivated"
                } successfully.`,
            );

            setSelectedProduct(null);
        }, 700);
    };

    const confirmChargeStatus = () => {
        if (!selectedCharge) return;

        setActionLoading(true);

        setTimeout(() => {
            const newStatus =
                selectedCharge.status === "active"
                    ? "inactive"
                    : "active";

            setCharges((current) =>
                current.map((charge) =>
                    charge.id === selectedCharge.id
                        ? {
                            ...charge,
                            status: newStatus,
                        }
                        : charge,
                ),
            );

            setActionLoading(false);
            setShowChargeDialog(false);

            showFeedback(
                "success",
                newStatus === "active"
                    ? "Charge activated"
                    : "Charge deactivated",
                `${selectedCharge.name} has been ${
                    newStatus === "active"
                        ? "activated"
                        : "deactivated"
                } successfully.`,
            );

            setSelectedCharge(null);
        }, 700);
    };

    const handleProductDelete = (product: Product) => {
        setProducts((current) =>
            current.filter((item) => item.id !== product.id),
        );

        showFeedback(
            "success",
            "Product deleted",
            `${product.name} has been deleted successfully.`,
        );
    };

    const handleChargeDelete = (charge: ProductCharge) => {
        setCharges((current) =>
            current.filter((item) => item.id !== charge.id),
        );

        showFeedback(
            "success",
            "Charge deleted",
            `${charge.name} has been deleted successfully.`,
        );
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Products"
                description="Manage loan products and their associated charges."
                icon={Package}
                action={
                    <Button size="sm" asChild>
                        <Link href="/products/create"  className="flex items-center gap-2 whitespace-nowrap">
                            <Plus className="h-4 w-4" />
                            New Product
                        </Link>
                    </Button>
                }
            />

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    label="Total Products"
                    value={products.length}
                />

                <SummaryCard
                    label="Active Products"
                    value={activeProducts}
                />

                <SummaryCard
                    label="Inactive Products"
                    value={inactiveProducts}
                />

                <SummaryCard
                    label="Available Charges"
                    value={activeCharges}
                />
            </div>

            {/* Products */}
            <section className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Products
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Manage the loan products available to your organization.
                            </p>
                        </div>

                        <Button size="sm" asChild>
                            <Link href="/products/create" className="flex items-center gap-2 whitespace-nowrap">
                                <Plus className="h-4 w-4" />
                                New Product
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                            <Input
                                value={productSearch}
                                onChange={(event) =>
                                    setProductSearch(event.target.value)
                                }
                                placeholder="Search products by name or code..."
                                className="pl-9"
                            />
                        </div>

                        <select
                            value={productStatus}
                            onChange={(event) =>
                                setProductStatus(
                                    event.target.value as
                                        | "all"
                                        | "active"
                                        | "inactive",
                                )
                            }
                            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>

                <ProductTable
                    products={filteredProducts}
                    getChargeCount={getChargeCount}
                    onDeactivate={handleProductStatus}
                    onDelete={handleProductDelete}
                />
            </section>

            {/* Charge definitions */}
            <section className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Available Charge Definitions
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Define the charges that can be assigned to loan products.
                            </p>
                        </div>

                        <Button size="sm" variant="outline" asChild>
                            <Link href="/products/charges/create" className="flex items-center gap-2 whitespace-nowrap">
                                <Plus className="h-4 w-4" />
                                New Charge
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                            <Input
                                value={chargeSearch}
                                onChange={(event) =>
                                    setChargeSearch(event.target.value)
                                }
                                placeholder="Search charges by name or code..."
                                className="pl-9"
                            />
                        </div>

                        <select
                            value={chargeStatus}
                            onChange={(event) =>
                                setChargeStatus(
                                    event.target.value as
                                        | "all"
                                        | "active"
                                        | "inactive",
                                )
                            }
                            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>

                <ProductChargeTable
                    charges={filteredCharges}
                    onDeactivate={handleChargeStatus}
                    onDelete={handleChargeDelete}
                />
            </section>

            {/* Product status confirmation */}
            <ConfirmDialog
                open={showProductDialog}
                title={
                    selectedProduct?.status === "active"
                        ? "Deactivate Product"
                        : "Activate Product"
                }
                description={
                    selectedProduct
                        ? `Are you sure you want to ${
                            selectedProduct.status === "active"
                                ? "deactivate"
                                : "activate"
                        } "${selectedProduct.name}"?`
                        : ""
                }
                confirmText={
                    selectedProduct?.status === "active"
                        ? "Deactivate"
                        : "Activate"
                }
                variant="warning"
                loading={actionLoading}
                onConfirm={confirmProductStatus}
                onCancel={() => {
                    setShowProductDialog(false);
                    setSelectedProduct(null);
                }}
            />

            {/* Charge status confirmation */}
            <ConfirmDialog
                open={showChargeDialog}
                title={
                    selectedCharge?.status === "active"
                        ? "Deactivate Charge"
                        : "Activate Charge"
                }
                description={
                    selectedCharge
                        ? `Are you sure you want to ${
                            selectedCharge.status === "active"
                                ? "deactivate"
                                : "activate"
                        } "${selectedCharge.name}"?`
                        : ""
                }
                confirmText={
                    selectedCharge?.status === "active"
                        ? "Deactivate"
                        : "Activate"
                }
                variant="warning"
                loading={actionLoading}
                onConfirm={confirmChargeStatus}
                onCancel={() => {
                    setShowChargeDialog(false);
                    setSelectedCharge(null);
                }}
            />
        </div>
    );
}


interface SummaryCardProps {
    label: string;
    value: number;
}

function SummaryCard({
                         label,
                         value,
                     }: SummaryCardProps) {
    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
                {value}
            </p>
        </div>
    );
}