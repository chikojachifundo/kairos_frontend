"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ArrowLeft, Loader2, Plus, ReceiptText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {PageHeader} from "@/components/ui/page-header";
import {useFeedback} from "@/components/ui/feedback-bar";
import {ProductChargeRecordTable} from "@/components/products/product-charge-record-table";
import {productService} from "@/services/product-service";
import {productChargeService} from "@/services/product-charge-service";
import {productChargeRecordService} from "@/services/product-charge-record-service";
import type {Product} from "@/types/product";
import type {ProductCharge} from "@/types/product-charge";
import type {ProductChargeRecord} from "@/types/product-charge-record";

export default function ProductChargesPage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);
    const {showFeedback} = useFeedback();
    const [product, setProduct] = useState<Product | null>(null);
    const [charges, setCharges] = useState<ProductCharge[]>([]);
    const [records, setRecords] = useState<ProductChargeRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<ProductChargeRecord | null>(null);
    const [dialogType, setDialogType] = useState<"deactivate" | "delete" | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            if (!productId || Number.isNaN(productId)) {
                setError("Invalid product ID.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [loadedProduct, chargeResponse, recordResponse] = await Promise.all([productService.getProduct(productId), productChargeService.getProductCharges(), productChargeRecordService.getProductChargeRecords(productId)]);
                setProduct(loadedProduct);
                setCharges(chargeResponse.data);
                setRecords(recordResponse.data.filter((record) => record.productId === productId));
            } catch (error) {
                console.error("Failed to load product charge records:", error);
                setError("Unable to load product charge records.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [productId]);

    async function confirmAction() {
        if (!selectedRecord || !dialogType) return;
        setProcessing(true);
        try {
            if (dialogType === "delete") {
                await productChargeRecordService.deleteProductChargeRecord(selectedRecord.id);
                setRecords((current) => current.filter((record) => record.id !== selectedRecord.id));
            } else {
                const updated = await productChargeRecordService.updateProductChargeRecord(selectedRecord.id, {status: "inactive"});
                setRecords((current) => current.map((record) => record.id === updated.id ? updated : record));
            }
            showFeedback("success", "", dialogType === "delete" ? "Product charge removed." : "Product charge deactivated.");
            setSelectedRecord(null);
            setDialogType(null);
        } catch (error) {
            console.error("Failed to update product charge record:", error);
            showFeedback("error", "Unable to update product charge", "Please try again.");
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <div className="space-y-6"><PageHeader title="Product Charges"
                                                               description="Loading charge records..."
                                                               icon={ReceiptText}/><Loader2
        className="h-7 w-7 animate-spin text-muted"/></div>;
    if (!product) return <div className="space-y-6"><PageHeader title="Product Not Found"
                                                                description={error || "The requested product could not be found."}
                                                                icon={ReceiptText}/><Button asChild
                                                                                            variant="outline"><Link
        href="/products" className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft className="h-4 w-4" />Back to Products</Link></Button></div>;

    return <div className="space-y-6"><PageHeader title={`${product.name} Charges`}
                                                  description="Manage the charges configured for this loan product."
                                                  icon={ReceiptText}
                                                  action={<div className="flex gap-2"><Button variant="outline"
                                                                                              size="sm" asChild><Link
                                                      href={`/products/${product.id}`} className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft className="h-4 w-4"/>Back
                                                      to Product</Link></Button><Button size="sm" asChild><Link
                                                      href={`/products/${product.id}/charges/create`} className="flex items-center gap-2 whitespace-nowrap"><Plus
                                                      className="h-4 w-4"/>Add Charge</Link></Button></div>}/>
        <div className="grid gap-4 sm:grid-cols-3"><Summary label="Total Charges" value={records.length}/><Summary
            label="Active Charges" value={records.filter((record) => record.status === "active").length}/><Summary
            label="Inactive Charges" value={records.filter((record) => record.status === "inactive").length}/></div>
        <ProductChargeRecordTable productId={product.id} records={records} charges={charges} onDeactivate={(record) => {
            setSelectedRecord(record);
            setDialogType("deactivate");
        }} onDelete={(record) => {
            setSelectedRecord(record);
            setDialogType("delete");
        }}/><ConfirmDialog open={dialogType !== null}
                           title={dialogType === "delete" ? "Delete Product Charge?" : "Deactivate Product Charge?"}
                           description={dialogType === "delete" ? "This will permanently remove this charge configuration from the product." : "This will deactivate the charge configuration for this product."}
                           confirmText={dialogType === "delete" ? "Delete" : "Deactivate"}
                           variant={dialogType === "delete" ? "delete" : "warning"} loading={processing}
                           onConfirm={confirmAction} onCancel={() => {
            if (!processing) {
                setSelectedRecord(null);
                setDialogType(null);
            }
        }}/></div>;
}

function Summary({label, value}: { label: string; value: number }) {
    return <div className="rounded-xl border border-border bg-surface p-5"><p className="text-sm text-muted">{label}</p>
        <p className="mt-2 text-2xl font-bold text-primary">{value}</p></div>;
}
