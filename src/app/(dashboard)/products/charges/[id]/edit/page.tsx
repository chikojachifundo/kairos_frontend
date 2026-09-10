"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import axios from "axios";
import {ArrowLeft, Loader2, ReceiptText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {ProductChargeForm} from "@/components/products/product-charge-form";
import {productChargeService} from "@/services/product-charge-service";
import type {ProductCharge} from "@/types/product-charge";

export default function EditProductChargePage() {
    const params = useParams<{id: string}>();
    const chargeId = Number(params.id);
    const [charge, setCharge] = useState<ProductCharge | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCharge() {
            if (!chargeId || Number.isNaN(chargeId)) {
                setError("Invalid charge ID.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setCharge(await productChargeService.getProductCharge(chargeId));
            } catch (error: unknown) {
                console.error("Failed to load product charge:", error);
                setError(axios.isAxiosError<{message?: string}>(error) ? error.response?.data?.message || "Unable to load charge information." : "Unable to load charge information.");
            } finally {
                setLoading(false);
            }
        }
        loadCharge();
    }, [chargeId]);

    if (loading) return <div className="space-y-6"><PageHeader title="Edit Product Charge" description="Loading charge information..." icon={ReceiptText}/><Loader2 className="h-7 w-7 animate-spin text-muted"/></div>;

    if (!charge) return <div className="space-y-6"><PageHeader title="Charge Not Found" description={error || "The requested product charge could not be found."} icon={ReceiptText}/><Button asChild variant="outline"><Link href="/products"><ArrowLeft className="h-4 w-4"/>Back to Products</Link></Button></div>;

    return <div className="space-y-6"><PageHeader title="Edit Product Charge" description={`Update the details for ${charge.name}.`} icon={ReceiptText} action={<Button variant="outline" size="sm" asChild><Link href={`/products/charges/${charge.id}`} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4"/>Back to Charge</Link></Button>}/><ProductChargeForm mode="edit" charge={charge}/></div>;
}
