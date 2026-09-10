"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ArrowLeft, Loader2, ReceiptText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {ProductChargeRecordForm} from "@/components/products/product-charge-record-form";
import {productService} from "@/services/product-service";
import {productChargeService} from "@/services/product-charge-service";
import {productChargeRecordService} from "@/services/product-charge-record-service";
import type {Product} from "@/types/product";
import type {ProductCharge} from "@/types/product-charge";
import type {ProductChargeRecord} from "@/types/product-charge-record";

export default function CreateProductChargePage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [charges, setCharges] = useState<ProductCharge[]>([]);
    const [records, setRecords] = useState<ProductChargeRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!productId || Number.isNaN(productId)) {
                setLoading(false);
                return;
            }
            try {
                const [loadedProduct, chargeResponse, recordResponse] = await Promise.all([productService.getProduct(productId), productChargeService.getProductCharges(), productChargeRecordService.getProductChargeRecords(productId)]);
                setProduct(loadedProduct);
                setCharges(chargeResponse.data.filter((charge) => charge.status === "active"));
                setRecords(recordResponse.data.filter((record) => record.productId === productId));
            } catch (error) {
                console.error("Failed to load charge form data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [productId]);

    if (loading) return <div className="space-y-6"><PageHeader title="Add Product Charge"
                                                               description="Loading charge information..."
                                                               icon={ReceiptText}/><Loader2
        className="h-7 w-7 animate-spin text-muted"/></div>;
    if (!product) return <div className="space-y-6"><PageHeader title="Product Not Found"
                                                                description="The requested loan product could not be found."
                                                                icon={ReceiptText}/><Button variant="outline"
                                                                                            asChild><Link
        href="/products" className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft className="h-4 w-4"/>Back to Products</Link></Button></div>;
    return <div className="space-y-6"><PageHeader title="Add Product Charge"
                                                  description={`Configure a charge for ${product.name}.`}
                                                  icon={ReceiptText}
                                                  action={<Button variant="outline" size="sm" asChild><Link
                                                      href={`/products/${product.id}/charges`} className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft
                                                      className="h-4 w-4"/>Back to
                                                      Charges</Link></Button>}/><ProductChargeRecordForm mode="create"
                                                                                                         productId={product.id}
                                                                                                         productName={product.name}
                                                                                                         charges={charges}
                                                                                                         existingRecords={records}/>
    </div>;
}
