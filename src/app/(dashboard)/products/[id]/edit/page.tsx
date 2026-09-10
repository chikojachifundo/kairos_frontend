"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import axios from "axios";
import {ArrowLeft, Loader2, Package} from "lucide-react";

import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {ProductForm} from "@/components/products/product-form";
import {productService} from "@/services/product-service";
import type {Product} from "@/types/product";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

function getErrorMessage(error: unknown) {
    if (axios.isAxiosError<{message?: string}>(error)) {
        return error.response?.data?.message || "Unable to load product information.";
    }

    return error instanceof Error ? error.message : "Unable to load product information.";
}

export default function EditProductPage({params}: EditProductPageProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProduct() {
            const {id} = await params;
            const productId = Number(id);

            if (!productId || Number.isNaN(productId)) {
                setError("Invalid product ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                setProduct(await productService.getProduct(productId));
            } catch (error: unknown) {
                console.error("Failed to load product:", error);
                setError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [params]);

    if (loading) {
        return <div className="space-y-6"><PageHeader title="Edit Product" description="Loading product information..." icon={Package}/><div className="rounded-xl border border-border bg-surface p-10 text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-muted"/></div></div>;
    }

    if (!product) {
        return <div className="space-y-6"><PageHeader title="Product Not Found" description={error || "The requested product could not be found."} icon={Package}/><div className="rounded-xl border border-border bg-surface p-8 text-center"><p className="text-sm text-muted">The product you are trying to edit does not exist or could not be loaded.</p><Button variant="outline" className="mt-4" asChild><Link href="/products"><ArrowLeft className="h-4 w-4"/>Back to Products</Link></Button></div></div>;
    }

    return <div className="space-y-6"><PageHeader title="Edit Product" description={`Update the details for ${product.name}.`} icon={Package} action={<Button variant="outline" size="sm" asChild><Link href="/products" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4"/>Back to Products</Link></Button>}/><ProductForm mode="edit" product={product}/></div>;
}
