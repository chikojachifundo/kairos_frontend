"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ArrowLeft, Edit, ReceiptText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {PageHeader} from "@/components/ui/page-header";
import {productChargeRecordService} from "@/services/product-charge-record-service";
import {productChargeService} from "@/services/product-charge-service";
import type {ProductChargeRecord} from "@/types/product-charge-record";
import type {ProductCharge} from "@/types/product-charge";

export default function ProductChargeRecordPage() {
    const params = useParams<{ id: string; recordId: string }>();
    const productId = Number(params.id), recordId = Number(params.recordId);
    const [record, setRecord] = useState<ProductChargeRecord | null>(null);
    const [charge, setCharge] = useState<ProductCharge | null>(null);
    useEffect(() => {
        async function load() {
            try {
                const [loadedRecord, charges] = await Promise.all([productChargeRecordService.getProductChargeRecord(recordId), productChargeService.getProductCharges()]);
                setRecord(loadedRecord);
                setCharge(charges.data.find((item) => item.id === loadedRecord.productChargeId) || null);
            } catch (error) {
                console.error("Failed to load product charge record:", error);
            }
        }

        if (productId && recordId) load();
    }, [productId, recordId]);
    if (!record) return <div className="space-y-6"><PageHeader title="Product Charge"
                                                               description="Loading charge record..."
                                                               icon={ReceiptText}/></div>;
    return <div className="space-y-6"><PageHeader title={charge?.name || "Product Charge"}
                                                  description="View charge configuration details." icon={ReceiptText}
                                                  action={<Button asChild size="sm"><Link
                                                      href={`/products/${productId}/charges/${recordId}/edit`}
                                                      className="flex items-center gap-2 whitespace-nowrap"><Edit
                                                      className="h-4 w-4"/>Edit</Link></Button>}/><Card className="p-6">
        <div className="grid gap-5 sm:grid-cols-2"><Detail label="Charge"
                                                           value={charge?.name || String(record.productChargeId)}/><Detail
            label="Value"
            value={charge?.type === "percentage" ? `${record.value}%` : record.value.toLocaleString()}/><Detail
            label="Status" value={record.status}/><Detail label="Description"
                                                          value={record.description || "No description provided."}/>
        </div>
    </Card><Button asChild variant="outline"><Link href={`/products/${productId}/charges`} className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft
        className="h-4 w-4"/>Back to Charges</Link></Button></div>;
}

function Detail({label, value}: { label: string; value: string }) {
    return <div><p className="text-xs text-muted">{label}</p><p
        className="mt-1 text-sm font-medium text-foreground">{value}</p></div>;
}
