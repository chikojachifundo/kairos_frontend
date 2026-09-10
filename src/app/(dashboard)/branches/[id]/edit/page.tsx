
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { BranchForm } from "@/components/branches/branch-form";

import { branchService } from "@/services/branch-service";

import type { BranchFormData } from "@/types/branch";

interface EditBranchPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditBranchPage({
    params,
}: EditBranchPageProps) {
    const { id } = await params;

    const branchId = Number(id);

    if (Number.isNaN(branchId)) {
        notFound();
    }

    let branch;

    try {
        branch = await branchService.getBranch(branchId);
    } catch (error) {
        console.error("Failed to load branch:", error);
        notFound();
    }

    const initialData: BranchFormData = {
        branchCode: branch.branchCode,
        name: branch.name,
        type: branch.type,
        status: branch.status,
        phone: branch.phone,
        email: branch.email,
        address: branch.location,
        city: "",
        region: "",
        manager: branch.manager,
        openingDate: "",
        notes: "",
    };

    return (
        <div className="space-y-5">
            <Link href={`/branches/${branch.id}`}>
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Branch
                </Button>
            </Link>

            <PageHeader
                title="Edit Branch"
                description={`Update information for ${branch.name}.`}
            />

            <BranchForm
                mode="edit"
                branchId={branch.id}
                initialData={initialData}
            />
        </div>
    );
}

