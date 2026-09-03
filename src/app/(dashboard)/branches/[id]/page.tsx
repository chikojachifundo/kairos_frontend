
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";

import type { Branch, BranchType } from "@/types/branch";

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

function formatBranchType(type: BranchType) {
  switch (type) {
    case "head_office":
      return "Head Office";
    case "regional":
      return "Regional";
    case "branch":
      return "Branch";
    case "satellite":
      return "Satellite";
    default:
      return type;
  }
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-low text-muted">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function BranchDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const branch = branches.find((item) => item.id === id);

  if (!branch) {
    return (
      <div className="space-y-5">
        <Link href="/branches">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Branches
          </Button>
        </Link>

        <Card className="p-8 text-center">
          <Building2 className="mx-auto h-10 w-10 text-muted" />

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Branch Not Found
          </h2>

          <p className="mt-1 text-sm text-muted">
            The branch you are looking for does not exist.
          </p>

          <Button
            className="mt-5"
            onClick={() => router.push("/branches")}
          >
            Back to Branches
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link href="/branches">
        <Button variant="ghost" size="sm" className="-ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Branches
        </Button>
      </Link>

      {/* Header */}
      <PageHeader
        title={branch.name}
        description={`${branch.branchCode} • ${formatBranchType(branch.type)}`}
        action={
          <Link href={`/branches/${branch.id}/edit`}>
<Button size="sm">
    <Pencil className="h-4 w-4" />
    Edit Branch
</Button>
</Link>
}
/>

{/* Status */}
<Card className="p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <p className="text-xs text-muted">
                Branch Status
            </p>

            <div className="mt-2">
                <Badge
                    variant={
                        branch.status === "active"
                            ? "success"
                            : "neutral"
                    }
                >
                    {branch.status === "active"
                        ? "Active"
                        : "Inactive"}
                </Badge>
            </div>
        </div>

        <div className="text-left sm:text-right">
            <p className="text-xs text-muted">
                Branch Code
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
                {branch.branchCode}
            </p>
        </div>
    </div>
</Card>

{/* Overview */}
<div className="grid gap-4 md:grid-cols-3">
    <Card className="p-5">
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
            </div>

            <div>
                <p className="text-xs text-muted">
                    Active Clients
                </p>

                <p className="mt-0.5 text-xl font-semibold text-foreground">
                    {branch.activeClients.toLocaleString()}
                </p>
            </div>
        </div>
    </Card>

    <Card className="p-5">
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
            </div>

            <div>
                <p className="text-xs text-muted">
                    Active Loans
                </p>

                <p className="mt-0.5 text-xl font-semibold text-foreground">
                    {branch.activeLoans.toLocaleString()}
                </p>
            </div>
        </div>
    </Card>

    <Card className="p-5">
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-4 w-4" />
            </div>

            <div>
                <p className="text-xs text-muted">
                    Branch Type
                </p>

                <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {formatBranchType(branch.type)}
                </p>
            </div>
        </div>
    </Card>
</div>

{/* Information */}
<div className="grid gap-5 lg:grid-cols-2">
    {/* Contact */}
    <Card className="p-5">
        <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">
                Contact Information
            </h2>

            <p className="mt-1 text-xs text-muted">
                Branch contact details.
            </p>
        </div>

        <div className="space-y-5">
            <DetailItem
                icon={Phone}
                label="Phone Number"
                value={branch.phone}
            />

            <DetailItem
                icon={Mail}
                label="Email Address"
                value={branch.email}
            />

            <DetailItem
                icon={MapPin}
                label="Location"
                value={branch.location}
            />
        </div>
    </Card>

    {/* Management */}
    <Card className="p-5">
        <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">
                Management
            </h2>

            <p className="mt-1 text-xs text-muted">
                Branch management information.
            </p>
        </div>

        <div className="space-y-5">
            <DetailItem
                icon={Users}
                label="Branch Manager"
                value={branch.manager}
            />

            <DetailItem
                icon={Building2}
                label="Branch Type"
                value={formatBranchType(branch.type)}
            />

            <DetailItem
                icon={CalendarDays}
                label="Status"
                value={
                    <Badge
                        variant={
                            branch.status === "active"
                                ? "success"
                                : "neutral"
                        }
                    >
                        {branch.status === "active"
                            ? "Active"
                            : "Inactive"}
                    </Badge>
                }
            />
        </div>
    </Card>
</div>
</div>
);
}

