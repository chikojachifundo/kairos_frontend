"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import axios from "axios";
import {ArrowLeft, Edit, Loader2, Package} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {PageHeader} from "@/components/ui/page-header";
import {productService} from "@/services/product-service";
import type {Product} from "@/types/product";

const paymentTermLabels: Record<Product["paymentTerm"], string> = {
    daily: "Daily",
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    annually: "Annually",
};

function getErrorMessage(error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || "Unable to load product information.";
    }
    return error instanceof Error ? error.message : "Unable to load product information.";
}

export default function ProductPage() {
    const params = useParams();
    const productId = Number(params.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProduct() {
            if (!productId || Number.isNaN(productId)) {
                setError("Invalid product ID.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setProduct(await productService.getProduct(productId));
            } catch (error: unknown) {
                console.error("Failed to load product:", error);
                setError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [productId]);

    if (loading) return <div className="space-y-6"><PageHeader title="Product"
                                                               description="Loading product information..."
                                                               icon={Package}/><Card
        className="p-10 text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-muted"/></Card></div>;

    if (!product) return <div className="space-y-6"><PageHeader title="Product Not Found"
                                                                description={error || "The requested product could not be found."}
                                                                icon={Package}/><Button asChild variant="outline"><Link
        href="/products"><ArrowLeft className="h-4 w-4"/>Back to Products</Link></Button></div>;

    return <div className="space-y-6">
        <PageHeader title={product.name} description={`Product code: ${product.code}`}
                    icon={Package} action={<Button asChild size="sm"><Link
            href={`/products/${product.id}/edit`} className="flex items-center gap-2 whitespace-nowrap"><Edit className="h-4 w-4"/>Edit Product</Link></Button>}/><Card
        className="p-6">
        <div className="grid gap-6 sm:grid-cols-2"><Detail label="Product Code" value={product.code}/><Detail
            label="Payment Term" value={paymentTermLabels[product.paymentTerm]}/><Detail label="Status" value={<Badge
            variant={product.status === "active" ? "success" : "neutral"}>{product.status === "active" ? "Active" : "Inactive"}</Badge>}/><Detail
            label="Created By" value={product.createdBy}/><Detail label="Approved By"
                                                                  value={product.approvedBy}/><Detail
            label="Description" value={product.description || "No description provided."}/></div>
    </Card></div>;
}

function Detail({label, value}: { label: string; value: React.ReactNode }) {
    return <div><p className="text-xs font-medium text-muted">{label}</p>
        <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>;
}
