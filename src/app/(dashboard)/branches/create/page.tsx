
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { BranchForm } from "@/components/branches/branch-form";

export default function CreateBranchPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/branches">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Branches
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Add New Branch"
        description="Create a new branch and configure its basic information."
      />

      <BranchForm />
    </div>
  );
}

