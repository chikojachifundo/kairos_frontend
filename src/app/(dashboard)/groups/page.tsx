"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {GroupIcon, Plus, Users2Icon} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { GroupFilters } from "@/components/groups/group-filters";
import { GroupTable } from "@/components/groups/group-table";
import { useFeedback } from "@/components/ui/feedback-bar";

import type { Group } from "@/types/group";
import { branches, mockGroups } from "./mock-data";

export default function GroupsPage() {
    const [groups, setGroups] = useState(mockGroups);
    const { showFeedback } = useFeedback();
    const [search, setSearch] = useState("");
    const [branchId, setBranchId] = useState("");
    const [status, setStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedGroup, setSelectedGroup] =
        useState<Group | null>(null);


    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);

    const [
        showDeactivateConfirmation,
        setShowDeactivateConfirmation,
    ] = useState(false);

    const [deleting, setDeleting] = useState(false);
    const [deactivating, setDeactivating] = useState(false);

    const filteredGroups = useMemo(() => {
        const query = search.trim().toLowerCase();

        return groups.filter((group) => {
            const matchesSearch =
                !query ||
                group.title.toLowerCase().includes(query) ||
                group.chair.toLowerCase().includes(query) ||
                group.viceChair.toLowerCase().includes(query) ||
                group.cellphone.toLowerCase().includes(query) ||
                group.viceChairCell.toLowerCase().includes(query);

            const matchesBranch =
                !branchId ||
                group.branchId === Number(branchId);

            const matchesStatus =
                !status || group.status === status;

            return (
                matchesSearch &&
                matchesBranch &&
                matchesStatus
            );
        });
    }, [groups, search, branchId, status]);

    function handleFilter() {
        setCurrentPage(1);
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    function handleDelete(group: Group) {
        setSelectedGroup(group);
        setShowDeleteConfirmation(true);
    }

    function handleDeactivate(group: Group) {
        setSelectedGroup(group);
        setShowDeactivateConfirmation(true);
    }

    async function confirmDelete() {
        if (!selectedGroup) return;

        setDeleting(true);

        const groupName = selectedGroup.title;

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            setGroups((current) =>
                current.filter(
                    (group) => group.id !== selectedGroup.id,
                ),
            );

            setShowDeleteConfirmation(false);
            setSelectedGroup(null);

            showFeedback(
                "success",
                "Group deleted successfully",
                `${groupName} has been removed from the system.`,
            );
        } finally {
            setDeleting(false);
        }
    }

    async function confirmDeactivate() {
        if (!selectedGroup) return;

        setDeactivating(true);

        const groupName = selectedGroup.title;

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            setGroups((current) =>
                current.map((group) =>
                    group.id === selectedGroup.id
                        ? {
                            ...group,
                            status: "inactive",
                        }
                        : group,
                ),
            );

            setShowDeactivateConfirmation(false);
            setSelectedGroup(null);

            showFeedback(
                "success",
                "Group deactivated successfully",
                `${groupName} has been marked as inactive.`,
            );
        } finally {
            setDeactivating(false);
        }
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title="Groups"
                icon={Users2Icon}
                description="Manage client groups and their leadership."
                action={
                    <Link href="/groups/create">
                        <Button size="sm">
                            <Plus className="h-4 w-4" />
                            Add Group
                        </Button>
                    </Link>
                }
            />

            <GroupFilters
                search={search}
                branchId={branchId}
                status={status}
                branches={branches}
                onSearchChange={setSearch}
                onBranchChange={setBranchId}
                onStatusChange={setStatus}
                onFilter={handleFilter}
            />

            <GroupTable
                groups={filteredGroups}
                currentPage={currentPage}
                totalPages={3}
                totalItems={filteredGroups.length}
                onPageChange={handlePageChange}
                onDelete={handleDelete}
                onDeactivate={handleDeactivate}
            />

            <ConfirmDialog
                open={showDeleteConfirmation}
                title="Delete Group?"
                description={
                    selectedGroup
                        ? `Are you sure you want to delete ${selectedGroup.title}? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete Group"
                cancelText="Cancel"
                variant="delete"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteConfirmation(false);
                    setSelectedGroup(null);
                }}
            />

            <ConfirmDialog
                open={showDeactivateConfirmation}
                title="Deactivate Group?"
                description={
                    selectedGroup
                        ? `Are you sure you want to deactivate ${selectedGroup.title}? The group will no longer be available for normal operations.`
                        : ""
                }
                confirmText="Deactivate Group"
                cancelText="Cancel"
                variant="warning"
                loading={deactivating}
                onConfirm={confirmDeactivate}
                onCancel={() => {
                    setShowDeactivateConfirmation(false);
                    setSelectedGroup(null);
                }}
            />
        </div>
    );
}