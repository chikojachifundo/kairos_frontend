
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProductForm } from "@/components/products/product-form";

import { mockProducts } from "../../mock-data";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;

    const product = mockProducts.find(
        (item) => item.id === Number(id),
    );

    if (!product) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Product Not Found"
                    description="The requested product could not be found."
                    icon={Package}
                />

                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                    <p className="text-sm text-muted">
                        The product you are trying to edit does not exist.
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
                title="Edit Product"
                description={`Update the details for ${product.name}.`}
                icon={Package}
                action={
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            href={`/products/${product.id}`}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Product
                        </Link>
                    </Button>
                }
            />

            <ProductForm
                mode="edit"
                product={product}
            />
        </div>
    );
}

