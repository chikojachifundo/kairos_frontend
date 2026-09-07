"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ClientStatus } from "@/types/client";

interface BranchOption {
    id: number;
    name: string;
}

interface GroupOption {
    id: number;
    title: string;
    branchId: number;
}

interface ClientFiltersProps {
    search: string;
    branchId: number | "";
    groupId: number | "";
    status: ClientStatus | "";

    branches: BranchOption[];
    groups: GroupOption[];

    onSearchChange: (value: string) => void;
    onBranchChange: (value: number | "") => void;
    onGroupChange: (value: number | "") => void;
    onStatusChange: (value: ClientStatus | "") => void;

    onApply: () => void;
    onClear: () => void;
}

export function ClientFilters({
                                  search,
                                  branchId,
                                  groupId,
                                  status,
                                  branches,
                                  groups,
                                  onSearchChange,
                                  onBranchChange,
                                  onGroupChange,
                                  onStatusChange,
                                  onApply,
                                  onClear,
                              }: ClientFiltersProps) {
    const filteredGroups =
        branchId === ""
            ? groups
            : groups.filter((group) => group.branchId === branchId);

    return (
        <div className="rounded-xl border border-border bg-white p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label
                        htmlFor="client-search"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Search
                    </label>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            id="client-search"
                            value={search}
                            onChange={(event) =>
                                onSearchChange(event.target.value)
                            }
                            placeholder="Search by name, client number or national ID..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Branch */}
                <div>
                    <label
                        htmlFor="client-branch"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Branch
                    </label>

                    <select
                        id="client-branch"
                        value={branchId}
                        onChange={(event) =>
                            onBranchChange(
                                event.target.value === ""
                                    ? ""
                                    : Number(event.target.value),
                            )
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All branches</option>

                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Group */}
                <div>
                    <label
                        htmlFor="client-group"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Group
                    </label>

                    <select
                        id="client-group"
                        value={groupId}
                        onChange={(event) =>
                            onGroupChange(
                                event.target.value === ""
                                    ? ""
                                    : Number(event.target.value),
                            )
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All groups</option>

                        {filteredGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label
                        htmlFor="client-status"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                        Status
                    </label>

                    <select
                        id="client-status"
                        value={status}
                        onChange={(event) =>
                            onStatusChange(
                                event.target.value as ClientStatus | "",
                            )
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClear}
                >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                </Button>

                <Button type="button" onClick={onApply}>
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}