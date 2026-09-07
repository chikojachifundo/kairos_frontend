"use client";

import {Badge} from "@/components/ui/badge";
import {DataTable} from "@/components/ui/data-table";
import {Pagination} from "@/components/ui/pagination";

import {GroupActions} from "@/components/groups/group-actions";

import type {Group} from "@/types/group";

interface GroupTableProps {
    groups: Group[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onDelete: (group: Group) => void;
    onDeactivate: (group: Group) => void;
}

export function GroupTable({
                               groups,
                               currentPage,
                               totalPages,
                               totalItems,
                               onPageChange,
                               onDelete,
                               onDeactivate,
                           }: GroupTableProps) {
    const from =
        groups.length === 0
            ? 0
            : (currentPage - 1) * groups.length + 1;

    const to =
        groups.length === 0
            ? 0
            : from + groups.length - 1;

    const columns = [
        {
            key: "group",
            header: "Group",
            render: (group: Group) => (
                <div className="min-w-[190px]">
                    <div className="text-xs font-semibold text-foreground">
                        {group.title}
                    </div>

                    <div className="mt-0.5 text-[10px] text-muted">
                        {group.branchName}
                    </div>
                </div>
            ),
        },

        {
            key: "chair",
            header: "Chair",
            render: (group: Group) => (
                <div>
                    <div className="text-xs font-medium text-foreground">
                        {group.chair}
                    </div>

                    <div className="mt-0.5 text-[10px] text-muted">
                        {group.cellphone}
                    </div>
                </div>
            ),
        },

        {
            key: "viceChair",
            header: "Vice Chair",
            render: (group: Group) => (
                <div>
                    <div className="text-xs font-medium text-foreground">
                        {group.viceChair}
                    </div>

                    <div className="mt-0.5 text-[10px] text-muted">
                        {group.viceChairCell}
                    </div>
                </div>
            ),
        },

        {
            key: "members",
            header: "Members",
            className: "text-right",
            render: (group: Group) => (
                <span className="text-xs font-medium text-foreground">
          {group.memberCount.toLocaleString()}
        </span>
            ),
        },

        {
            key: "status",
            header: "Status",
            render: (group: Group) => (
                <Badge
                    variant={
                        group.status === "active"
                            ? "success"
                            : "neutral"
                    }
                    className="px-2 py-0.5 text-[10px]"
                >
                    {group.status === "active"
                        ? "Active"
                        : "Inactive"}
                </Badge>
            ),
        },

        {
            key: "actions",
            header: "",
            className: "w-10 text-right",
            render: (group: Group) => (
                <GroupActions
                    group={group}
                    onDelete={onDelete}
                    onDeactivate={onDeactivate}
                />
            ),
        },
    ];

    return (
        <div className="overflow-hidden">
            <DataTable
                data={groups}
                columns={columns}
                rowKey={(group) => group.id}
                emptyMessage="No groups found."
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