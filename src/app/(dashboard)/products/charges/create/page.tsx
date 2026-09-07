
import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProductChargeForm } from "@/components/products/product-charge-form";

export default function CreateProductChargePage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Product Charge"
                description="Create a charge definition that can be assigned to loan products."
                icon={ReceiptText}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link
                            href="/products"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                }
            />

            <ProductChargeForm mode="create" />
        </div>
    );
}

