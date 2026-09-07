"use client";

import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProductChargeRecordForm } from "@/components/products/product-charge-record-form";

import {
    mockProductChargeRecords,
    mockProductCharges,
    mockProducts,
} from "../../../mock-data";

export default function CreateProductChargePage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);

    const product = mockProducts.find(
        (item) => item.id === productId,
    );

    if (!product) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Product Not Found"
                    description="The requested loan product could not be found."
                    icon={ReceiptText}
                />

                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                    <Button variant="outline" asChild>
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const existingRecords =
        mockProductChargeRecords.filter(
            (record) => record.productId === productId,
        );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Add Product Charge"
                description={`Configure a charge for ${product.name}.`}
                icon={ReceiptText}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link
                            href={`/products/${product.id}/charges`} className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Charges
                        </Link>
                    </Button>
                }
            />

            <ProductChargeRecordForm
                mode="create"
                productId={product.id}
                productName={product.name}
                charges={mockProductCharges}
                existingRecords={existingRecords}
            />
        </div>
    );
}