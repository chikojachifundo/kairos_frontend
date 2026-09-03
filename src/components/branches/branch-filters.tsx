"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BranchFiltersProps {
    search: string;
    type: string;
    status: string;
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onFilter: () => void;
}

export function BranchFilters({
                                  search,
                                  type,
                                  status,
                                  onSearchChange,
                                  onTypeChange,
                                  onStatusChange,
                                  onFilter,
                              }: BranchFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const hasFilters = Boolean(type || status);

    function clearFilters() {
        onTypeChange("");
        onStatusChange("");
        onFilter();
    }

    return (
        <div className="space-y-2">
            {/* Compact toolbar */}
            <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                    <Input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search branches..."
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
              {(type ? 1 : 0) + (status ? 1 : 0)}
            </span>
                    )}
                </Button>
            </div>

            {/* Expanded filters */}
            {showFilters && (
                <div className="rounded-lg border border-border bg-surface-low p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Select
                            value={type}
                            onChange={(event) => onTypeChange(event.target.value)}
                            className="h-9 text-xs sm:w-48"
                            aria-label="Branch type"
                        >
                            <option value="">All Branch Types</option>
                            <option value="head_office">Head Office</option>
                            <option value="regional">Regional</option>
                            <option value="branch">Branch</option>
                            <option value="satellite">Satellite</option>
                        </Select>

                        <Select
                            value={status}
                            onChange={(event) => onStatusChange(event.target.value)}
                            className="h-9 text-xs sm:w-40"
                            aria-label="Branch status"
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