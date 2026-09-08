import Link from "next/link";
import { ArrowLeft, Banknote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { DisbursementForm } from "@/components/disbursements/disbursement-form";

import { mockClients } from "@/app/(dashboard)/clients/mock-data";

import {
    mockProducts,
    mockProductCharges,
    mockProductChargeRecords,
} from "@/app/(dashboard)/products/mock-data";

export default function CreateDisbursementPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="New Disbursement"
                description="Create a new loan disbursement and calculate the applicable charges."
                icon={Banknote}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href="/disbursements" className="flex items-center gap-2 whitespace-nowrap">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Disbursements
                        </Link>
                    </Button>
                }
            />

            <DisbursementForm
                mode="create"
                clients={mockClients}
                products={mockProducts}
                productCharges={mockProductCharges}
                productChargeRecords={mockProductChargeRecords}
            />
        </div>
    );
}