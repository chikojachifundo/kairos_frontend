"use client";

import { MoreHorizontal } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BranchActions } from "@/components/branches/branch-actions";

import type { Branch } from "@/types/branch";

interface BranchTableProps {
    branches: Branch[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onDelete: (branch: Branch) => void;
    onDeactivate: (branch: Branch) => void;
}

export function BranchTable({
                                branches,
                                currentPage,
                                totalPages,
                                totalItems,
                                onPageChange,
                                onDelete,
                                onDeactivate,
                            }: BranchTableProps) {
    const from =
        branches.length === 0
            ? 0
            : (currentPage - 1) * branches.length + 1;

    const to =
        branches.length === 0
            ? 0
            : from + branches.length - 1;

    const columns = [
        {
            key: "branch",
            header: "Branch",
            render: (branch: Branch) => (
                <div className="min-w-[180px]">
                    <div className="text-xs font-semibold text-foreground">
                        {branch.name}
                    </div>

                    <div className="mt-0.5 text-[10px] text-muted">
                        {branch.branchCode}
                    </div>
                </div>
            ),
        },

        {
            key: "manager",
            header: "Manager",
            render: (branch: Branch) => (
                <span className="text-xs text-foreground">
          {branch.manager}
        </span>
            ),
        },

        {
            key: "location",
            header: "Location",
            render: (branch: Branch) => (
                <span className="text-xs text-muted">
          {branch.location}
        </span>
            ),
        },

        {
            key: "status",
            header: "Status",
            render: (branch: Branch) => (
                <Badge
                    variant={
                        branch.status === "active"
                            ? "success"
                            : "neutral"
                    }
                    className="px-2 py-0.5 text-[10px]"
                >
                    {branch.status === "active"
                        ? "Active"
                        : "Inactive"}
                </Badge>
            ),
        },

        {
            key: "actions",
            header: "",
            className: "w-10 text-right",
            render: (branch: Branch) => (
                <BranchActions
                    branch={branch}
                    onDelete={onDelete}
                    onDeactivate={onDeactivate}
                />
            ),
        },
    ];

    return (
        <div className="overflow-hidden">
            <DataTable
                data={branches}
                columns={columns}
                rowKey={(branch) => branch.id}
                emptyMessage="No branches found."
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                from={from}
                to={to}
                onPageChange={onPageChange}
            />
        </div>
    );
}