"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

import { BranchFilters } from "@/components/branches/branch-filters";
import { BranchTable } from "@/components/branches/branch-table";

import type { Branch } from "@/types/branch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const mockBranches: Branch[] = [
    {
        id: 1,
        branchCode: "BR-0001",
        name: "Head Office",
        type: "head_office",
        manager: "James Banda",
        phone: "+265 888 123 456",
        email: "headoffice@company.com",
        location: "Blantyre",

        status: "active",
    },
    {
        id: 2,
        branchCode: "BR-0002",
        name: "Lilongwe Branch",
        type: "branch",
        manager: "Grace Phiri",
        phone: "+265 999 234 567",
        email: "lilongwe@company.com",
        location: "Lilongwe",

        status: "active",
    },
    {
        id: 3,
        branchCode: "BR-0003",
        name: "Mzuzu Branch",
        type: "branch",
        manager: "Peter Mbewe",
        phone: "+265 888 345 678",
        email: "mzuzu@company.com",
        location: "Mzuzu",

        status: "active",
    },
    {
        id: 4,
        branchCode: "BR-0004",
        name: "Zomba Branch",
        type: "branch",
        manager: "Mary Chirwa",
        phone: "+265 999 456 789",
        email: "zomba@company.com",
        location: "Zomba",

        status: "active",
    },
    {
        id: 5,
        branchCode: "BR-0005",
        name: "Mangochi Branch",
        type: "regional",
        manager: "Andrew Kumwenda",
        phone: "+265 888 567 890",
        email: "mangochi@company.com",
        location: "Mangochi",

        status: "inactive",
    },
];

export default function BranchesPage() {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [selectedBranch, setSelectedBranch] =
        useState<Branch | null>(null);

    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);

    const [showDeactivateConfirmation, setShowDeactivateConfirmation] =
        useState(false);

    const [deleting, setDeleting] = useState(false);
    const [deactivating, setDeactivating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const filteredBranches = useMemo(() => {
        const searchTerm = search.toLowerCase().trim();

        return mockBranches.filter((branch) => {
            const matchesSearch =
                !searchTerm ||
                branch.name.toLowerCase().includes(searchTerm) ||
                branch.branchCode.toLowerCase().includes(searchTerm) ||
                branch.phone.toLowerCase().includes(searchTerm) ||
                branch.email.toLowerCase().includes(searchTerm) ||
                branch.location.toLowerCase().includes(searchTerm) ||
                branch.manager.toLowerCase().includes(searchTerm);

            const matchesType =
                !type || branch.type === type;

            const matchesStatus =
                !status || branch.status === status;

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );
        });
    }, [search, type, status]);

    function handleFilter() {
        setCurrentPage(1);
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }
    function handleDelete(branch: Branch) {
        setSelectedBranch(branch);
        setShowDeleteConfirmation(true);
    }

    function handleDeactivate(branch: Branch) {
        setSelectedBranch(branch);
        setShowDeactivateConfirmation(true);
    }

    async function confirmDelete() {
        if (!selectedBranch) return;

        setDeleting(true);

        try {
            // API call will go here later.
            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            setShowDeleteConfirmation(false);
            setSelectedBranch(null);
        } finally {
            setDeleting(false);
        }
    }

    async function confirmDeactivate() {
        if (!selectedBranch) return;

        setDeactivating(true);

        try {
            // API call will go here later.
            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            setShowDeactivateConfirmation(false);
            setSelectedBranch(null);
        } finally {
            setDeactivating(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Branch Directory"
                description="Manage company branches and their operational information."
                action={
                    <Link href="/branches/create">
                        <Button>
                            <Plus className="h-4 w-4" />
                            Add New Branch
                        </Button>
                    </Link>
                }
            />

            <BranchFilters
                search={search}
                type={type}
                status={status}
                onSearchChange={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                onTypeChange={(value) => {
                    setType(value);
                    setCurrentPage(1);
                }}
                onStatusChange={(value) => {
                    setStatus(value);
                    setCurrentPage(1);
                }}
                onFilter={handleFilter}
            />

            <BranchTable
                branches={filteredBranches}
                currentPage={currentPage}
                totalPages={3}
                totalItems={filteredBranches.length}
                onPageChange={handlePageChange}
                onDelete={handleDelete}
                onDeactivate={handleDeactivate}
            />

            <ConfirmDialog
                open={showDeleteConfirmation}
                title="Delete Branch?"
                description={
                    selectedBranch
                        ? `Are you sure you want to delete ${selectedBranch.name}? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete Branch"
                cancelText="Cancel"
                variant="delete"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteConfirmation(false);
                    setSelectedBranch(null);
                }}
            />

            <ConfirmDialog
                open={showDeactivateConfirmation}
                title="Deactivate Branch?"
                description={
                    selectedBranch
                        ? `Are you sure you want to deactivate ${selectedBranch.name}? The branch will no longer be available for normal operations.`
                        : ""
                }
                confirmText="Deactivate Branch"
                cancelText="Cancel"
                variant="warning"
                loading={deactivating}
                onConfirm={confirmDeactivate}
                onCancel={() => {
                    setShowDeactivateConfirmation(false);
                    setSelectedBranch(null);
                }}
            />
        </div>
    );
}