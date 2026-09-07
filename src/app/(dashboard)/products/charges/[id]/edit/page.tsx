
import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProductChargeForm } from "@/components/products/product-charge-form";

import { mockProductCharges } from "../../../mock-data";

interface EditProductChargePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductChargePage({
    params,
}: EditProductChargePageProps) {
    const { id } = await params;

    const charge = mockProductCharges.find(
        (item) => item.id === Number(id),
    );

    if (!charge) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Charge Not Found"
                    description="The requested product charge could not be found."
                    icon={ReceiptText}
                />

                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                    <p className="text-sm text-muted">
                        The charge you are trying to edit does not exist.
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        asChild
                    >
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Product Charge"
                description={`Update the details for ${charge.name}.`}
                icon={ReceiptText}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link
                            href={`/products/charges/${charge.id}`}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Charge
                        </Link>
                    </Button>
                }
            />

            <ProductChargeForm
                mode="edit"
                charge={charge}
            />
        </div>
    );
}

