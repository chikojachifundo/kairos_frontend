"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Branch {
    id: number;
    name: string;
}

interface GroupFiltersProps {
    search: string;
    branchId: string;
    status: string;
    branches: Branch[];
    onSearchChange: (value: string) => void;
    onBranchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onFilter: () => void;
}

export function GroupFilters({
                                 search,
                                 branchId,
                                 status,
                                 branches,
                                 onSearchChange,
                                 onBranchChange,
                                 onStatusChange,
                                 onFilter,
                             }: GroupFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const hasFilters = Boolean(branchId || status);

    function clearFilters() {
        onBranchChange("");
        onStatusChange("");
        onFilter();
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search groups..."
                        className="h-9 pl-9 text-xs"
                    />
                </div>

                <Button
                    type="button"
                    variant={showFilters || hasFilters ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setShowFilters((value) => !value)}
                    className="h-9"
                >
                    <Filter className="h-3.5 w-3.5" />

                    Filters

                    {hasFilters && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] text-primary">
              {(branchId ? 1 : 0) + (status ? 1 : 0)}
            </span>
                    )}
                </Button>
            </div>

            {showFilters && (
                <div className="rounded-lg border border-border bg-surface-low p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Select
                            value={branchId}
                            onChange={(event) => onBranchChange(event.target.value)}
                            className="h-9 text-xs sm:w-52"
                            aria-label="Branch"
                        >
                            <option value="">All Branches</option>

                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </Select>

                        <Select
                            value={status}
                            onChange={(event) => onStatusChange(event.target.value)}
                            className="h-9 text-xs sm:w-40"
                            aria-label="Group status"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>

                        <Button
                            type="button"
                            size="sm"
                            className="h-9"
                            onClick={onFilter}
                        >
                            Apply
                        </Button>

                        {hasFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-9"
                                onClick={clearFilters}
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}