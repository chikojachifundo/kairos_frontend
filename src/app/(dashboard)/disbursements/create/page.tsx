"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {ArrowLeft, Banknote, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {DisbursementForm} from "@/components/disbursements/disbursement-form";
import {clientService} from "@/services/client-service";
import {productService} from "@/services/product-service";
import {productChargeService} from "@/services/product-charge-service";
import {productChargeRecordService} from "@/services/product-charge-record-service";
import type {Client} from "@/types/client";
import type {Product} from "@/types/product";
import type {ProductCharge} from "@/types/product-charge";
import type {ProductChargeRecord} from "@/types/product-charge-record";

export default function CreateDisbursementPage() {
    const [data, setData] = useState<{
        clients: Client[];
        products: Product[];
        charges: ProductCharge[];
        records: ProductChargeRecord[]
    } | null>(null);
    useEffect(() => {
        async function load() {
            try {
                const [clients, products, charges, records] = await Promise.all([clientService.getClients(), productService.getProducts(), productChargeService.getProductCharges(), productChargeRecordService.getProductChargeRecords()]);
                setData({clients: clients.data, products: products.data, charges: charges.data, records: records.data});

            } catch (error) {
                console.error("Failed to load disbursement form data:", error);
            }
        }

        load();
    }, []);
    return <div className="space-y-6">
        <PageHeader title="New Disbursement"
                    description="Create a new loan disbursement and calculate the applicable charges."
                    icon={Banknote}
                    action={<Button variant="outline" size="sm" asChild><Link
                        href="/disbursements"
                        className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft
                        className="h-4 w-4"/>Back to
                        Disbursements</Link></Button>}/>{data ?
        <DisbursementForm mode="create" clients={data.clients} products={data.products} productCharges={data.charges}
                          productChargeRecords={data.records}/> :
        <Loader2 className="h-7 w-7 animate-spin text-muted"/>}</div>;
}
