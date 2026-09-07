"use client";

import Link from "next/link";
import {useMemo, useState} from "react";
import {ArrowLeft, Plus, ReceiptText} from "lucide-react";
import {useParams} from "next/navigation";

import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {PageHeader} from "@/components/ui/page-header";
import {
    useFeedback,
} from "@/components/ui/feedback-bar";

import {ProductChargeRecordTable} from "@/components/products/product-charge-record-table";

import {
    mockProductChargeRecords,
    mockProductCharges,
    mockProducts,
} from "../../mock-data";

import type {ProductChargeRecord} from "@/types/product-charge-record";

export default function ProductChargesPage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);

    const {showFeedback} = useFeedback();

    const product = mockProducts.find(
        (item) => item.id === productId,
    );

    const records = useMemo(
        () =>
            mockProductChargeRecords.filter(
                (record) => record.productId === productId,
            ),
        [productId],
    );

    const [selectedRecord, setSelectedRecord] =
        useState<ProductChargeRecord | null>(null);

    const [dialogType, setDialogType] = useState<
        "deactivate" | "delete" | null
    >(null);

    const [loading, setLoading] = useState(false);

    if (!product) {
        return (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Product Not Found
                </h2>

                <p className="mt-2 text-sm text-muted">
                    The product you are looking for does not exist.
                </p>

                <Button
                    variant="outline"
                    className="mt-5"
                    asChild
                >
                    <Link href="/products" >
                        <ArrowLeft className="h-4 w-4"/>
                        Back to Products
                    </Link>
                </Button>
            </div>
        );
    }

    function handleDeactivate(record: ProductChargeRecord) {
        setSelectedRecord(record);
        setDialogType("deactivate");
    }

    function handleDelete(record: ProductChargeRecord) {
        setSelectedRecord(record);
        setDialogType("delete");
    }

    async function confirmAction() {
        if (!selectedRecord || !dialogType) {
            return;
        }

        setLoading(true);

        await new Promise((resolve) =>
            setTimeout(resolve, 700),
        );

        const charge = mockProductCharges.find(
            (item) =>
                item.id === selectedRecord.productChargeId,
        );

        showFeedback(
            "success",
            "",
            dialogType === "deactivate"
                ? `${charge?.name ?? "Charge"} has been deactivated.`
                : `${charge?.name ?? "Charge"} has been deleted.`,
        );

        setLoading(false);
        setSelectedRecord(null);
        setDialogType(null);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`${product.name} Charges`}
                description="Manage the charges configured for this loan product."
                icon={ReceiptText}
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href={`/products/${product.id}`} className="flex items-center gap-2 whitespace-nowrap" >
                                <ArrowLeft className="h-4 w-4"/>
                                Back to Product
                            </Link>
                        </Button>

                        <Button
                            size="sm"
                            asChild
                        >
                            <Link
                                href={`/products/${product.id}/charges/create`} className="flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus className="h-4 w-4"/>
                                Add Charge
                            </Link>
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="text-sm text-muted">
                        Total Charges
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {records.length}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="text-sm text-muted">
                        Active Charges
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {
                            records.filter(
                                (record) =>
                                    record.status === "active",
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-5">
                    <p className="text-sm text-muted">
                        Inactive Charges
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary">
                        {
                            records.filter(
                                (record) =>
                                    record.status === "inactive",
                            ).length
                        }
                    </p>
                </div>
            </div>

            <ProductChargeRecordTable
                productId={product.id}
                records={records}
                charges={mockProductCharges}
                onDeactivate={handleDeactivate}
                onDelete={handleDelete}
            />

            <ConfirmDialog
                open={dialogType !== null}
                title={
                    dialogType === "delete"
                        ? "Delete Product Charge?"
                        : "Deactivate Product Charge?"
                }
                description={
                    dialogType === "delete"
                        ? "This will permanently remove this charge configuration from the product."
                        : "This will deactivate the charge configuration for this product."
                }
                confirmText={
                    dialogType === "delete"
                        ? "Delete"
                        : "Deactivate"
                }
                cancelText="Cancel"
                variant={
                    dialogType === "delete"
                        ? "delete"
                        : "warning"
                }
                loading={loading}
                onConfirm={confirmAction}
                onCancel={() => {
                    if (!loading) {
                        setSelectedRecord(null);
                        setDialogType(null);
                    }
                }}
            />
        </div>
    );
}