"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Banknote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { DisbursementForm } from "@/components/disbursements/disbursement-form";

import {
    mockDisbursements,
    mockDisbursementCharges,
} from "../../mock-data";

import { mockClients } from "@/app/(dashboard)/clients/mock-data";

import {
    mockProducts,
    mockProductCharges,
    mockProductChargeRecords,
} from "@/app/(dashboard)/products/mock-data";

export default function EditDisbursementPage() {
    const params = useParams();
    const id = Number(params.id);

    const disbursement = mockDisbursements.find(
        (item) => item.id === id,
    );

    if (!disbursement) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Disbursement Not Found"
                    description="The requested disbursement could not be found."
                    icon={Banknote}
                />

                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                    <p className="text-sm text-muted">
                        The disbursement you are trying to edit does not exist.
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        asChild
                    >
                        <Link href="/disbursements">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Disbursements
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (
        disbursement.status === "disbursed" ||
        disbursement.status === "cancelled"
    ) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Disbursement Cannot Be Edited"
                    description="This disbursement has already been finalized."
                    icon={Banknote}
                />

                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                    <p className="text-sm text-muted">
                        Disbursed or cancelled disbursements cannot be
                        edited.
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        asChild
                    >
                        <Link
                            href={`/disbursements/${disbursement.id}`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Disbursement
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const disbursementCharges =
        mockDisbursementCharges.filter(
            (item) => item.disbursementId === disbursement.id,
        );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Disbursement"
                description={`Update ${disbursement.disbursementNumber}.`}
                icon={Banknote}
                action={
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link
                            href={`/disbursements/${disbursement.id}`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Disbursement
                        </Link>
                    </Button>
                }
            />

            <DisbursementForm
                mode="edit"
                disbursement={disbursement}
                disbursementCharges={disbursementCharges}
                clients={mockClients}
                products={mockProducts}
                productCharges={mockProductCharges}
                productChargeRecords={mockProductChargeRecords}
            />
        </div>
    );
}