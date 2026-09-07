
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "@/components/products/product-form";

export default function CreateProductPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Product"
                description="Create a new loan product and configure its payment terms."
                icon={Package}
                action={
                    <Button variant="outline" size="sm" asChild>
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

            <ProductForm mode="create" />
        </div>
    );
}

