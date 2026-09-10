"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Plus,
} from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

import { BranchFilters } from "@/components/branches/branch-filters";
import { BranchTable } from "@/components/branches/branch-table";

import type { Branch } from "@/types/branch";

import { branchService } from "@/services/branch-service";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFeedback } from "@/components/ui/feedback-bar";

export default function BranchesPage() {
    const { showFeedback } = useFeedback();

    const [branches, setBranches] = useState<Branch[]>([]);

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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    /**
     * Load branches from Laravel API
     */
    async function loadBranches(page = currentPage) {
        try {
            setLoading(true);
            setError(null);

            const response =
                await branchService.getBranches(page);

            setBranches(response.data);

            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
            setTotalItems(response.meta.total);
        } catch (error) {
            console.error("Failed to load branches:", error);

            setError(
                "Unable to load branches. Please try again.",
            );

            showFeedback(
                "error",
                "Failed to load branches",
                "There was a problem communicating with the server.",
            );
        } finally {
            setLoading(false);
        }
    }

    /**
     * Load branches when page opens
     */
    useEffect(() => {
        loadBranches(1);
    }, []);

    /**
     * Filter branches
     *
     * Since the current API returns all branches for the
     * current page, these filters operate on the loaded page.
     */
    const filteredBranches = branches.filter((branch) => {
        const searchTerm = search.toLowerCase().trim();

        const matchesSearch =
            !searchTerm ||
            branch.name
                .toLowerCase()
                .includes(searchTerm) ||
            branch.branchCode
                .toLowerCase()
                .includes(searchTerm) ||
            branch.phone
                .toLowerCase()
                .includes(searchTerm) ||
            branch.email
                .toLowerCase()
                .includes(searchTerm) ||
            branch.location
                .toLowerCase()
                .includes(searchTerm) ||
            branch.manager
                .toLowerCase()
                .includes(searchTerm);

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

    function handleFilter() {
        setCurrentPage(1);
        loadBranches(1);
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
        loadBranches(page);
    }

    function handleDelete(branch: Branch) {
        setSelectedBranch(branch);
        setShowDeleteConfirmation(true);
    }

    function handleDeactivate(branch: Branch) {
        setSelectedBranch(branch);
        setShowDeactivateConfirmation(true);
    }

    /**
     * Delete branch
     */
    async function confirmDelete() {
        if (!selectedBranch) return;

        setDeleting(true);

        try {
            const branchName = selectedBranch.name;

            await branchService.deleteBranch(
                selectedBranch.id,
            );

            setShowDeleteConfirmation(false);
            setSelectedBranch(null);

            showFeedback(
                "success",
                "Branch deleted successfully",
                `${branchName} has been removed from the system.`,
            );

            await loadBranches(currentPage);
        } catch (error) {
            console.error(
                "Failed to delete branch:",
                error,
            );

            showFeedback(
                "error",
                "Failed to delete branch",
                "The branch could not be deleted. Please try again.",
            );
        } finally {
            setDeleting(false);
        }
    }

    /**
     * Deactivate branch
     */
    async function confirmDeactivate() {
        if (!selectedBranch) return;

        setDeactivating(true);

        try {
            const branchName = selectedBranch.name;

            await branchService.updateBranch(
                selectedBranch.id,
                {
                    status: "inactive",
                },
            );

            setShowDeactivateConfirmation(false);
            setSelectedBranch(null);

            showFeedback(
                "success",
                "Branch updated successfully",
                `${branchName} has been deactivated.`,
            );

            await loadBranches(currentPage);
        } catch (error) {
            console.error(
                "Failed to deactivate branch:",
                error,
            );

            showFeedback(
                "error",
                "Failed to update branch",
                "The branch could not be deactivated. Please try again.",
            );
        } finally {
            setDeactivating(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Branch Directory"
                icon={LayoutDashboard}
                description="Manage company branches and their operational information."
                action={
                    <Link href="/branches/create">
                        <Button size="sm">
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

            {/* Loading */}
            {loading && (
                <div className="rounded-lg border bg-white p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading branches...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>

                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                            loadBranches(currentPage)
                        }
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <BranchTable
                    branches={filteredBranches}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onDelete={handleDelete}
                    onDeactivate={handleDeactivate}
                />
            )}

            {/* Delete Confirmation */}
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

            {/* Deactivate Confirmation */}
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