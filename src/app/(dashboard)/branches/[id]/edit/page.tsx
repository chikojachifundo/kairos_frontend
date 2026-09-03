
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { BranchForm } from "@/components/branches/branch-form";

import type { Branch, BranchFormData } from "@/types/branch";

const branches: Branch[] = [
  {
    id: 1,
    branchCode: "BR-001",
    name: "Blantyre Main Branch",
    type: "branch",
    manager: "John Banda",
    phone: "+265 888 123 456",
    email: "blantyre@company.com",
    location: "Blantyre, Southern Region",
    activeClients: 245,
    activeLoans: 318,
    status: "active",
  },
  {
    id: 2,
    branchCode: "BR-002",
    name: "Lilongwe Branch",
    type: "regional",
    manager: "Mary Phiri",
    phone: "+265 999 234 567",
    email: "lilongwe@company.com",
    location: "Lilongwe, Central Region",
    activeClients: 189,
    activeLoans: 241,
    status: "active",
  },
  {
    id: 3,
    branchCode: "BR-003",
    name: "Mzuzu Branch",
    type: "branch",
    manager: "Peter Mbewe",
    phone: "+265 888 345 678",
    email: "mzuzu@company.com",
    location: "Mzuzu, Northern Region",
    activeClients: 126,
    activeLoans: 157,
    status: "inactive",
  },
];

interface EditBranchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBranchPage({
  params,
}: EditBranchPageProps) {
  const { id } = await params;

  const branch = branches.find(
    (item) => item.id === Number(id),
  );

  if (!branch) {
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

