"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
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

export default function EditProductChargeRecordPage() {
    const params = useParams<{id: string; recordId: string}>();
    const productId = Number(params.id), recordId = Number(params.recordId);
    const [product, setProduct] = useState<Product | null>(null);
    const [record, setRecord] = useState<ProductChargeRecord | null>(null);
    const [charges, setCharges] = useState<ProductCharge[]>([]);
    const [records, setRecords] = useState<ProductChargeRecord[]>([]);
    const [loading, setLoading] = useState(() => Boolean(productId && recordId));
    useEffect(() => { async function loadData() { try { const [p, cs, rs, r] = await Promise.all([productService.getProduct(productId), productChargeService.getProductCharges(), productChargeRecordService.getProductChargeRecords(productId), productChargeRecordService.getProductChargeRecord(recordId)]); setProduct(p); setCharges(cs.data); setRecords(rs.data.filter((item) => item.productId === productId)); setRecord(r); } catch (error) { console.error("Failed to load product charge record:", error); } finally { setLoading(false); } } if (productId && recordId) loadData(); }, [productId, recordId]);
    if (loading) return <div className="space-y-6"><PageHeader title="Edit Product Charge" description="Loading charge record..." icon={ReceiptText}/><Loader2 className="h-7 w-7 animate-spin text-muted"/></div>;
    if (!product || !record) return <div className="space-y-6"><PageHeader title="Product Charge Not Found" description="The requested charge record could not be found." icon={ReceiptText}/><Button asChild variant="outline"><Link href={`/products/${productId}/charges`}><ArrowLeft className="h-4 w-4"/>Back to Charges</Link></Button></div>;
    return <div className="space-y-6"><PageHeader title="Edit Product Charge" description={`Update the charge for ${product.name}.`} icon={ReceiptText}/><ProductChargeRecordForm mode="edit" productId={productId} productName={product.name} record={record} charges={charges} existingRecords={records}/></div>;
}
