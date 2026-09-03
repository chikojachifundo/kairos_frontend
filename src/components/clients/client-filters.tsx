"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientFiltersProps {
    search: string;
    group: string;
    status: string;
    onSearchChange: (value: string) => void;
    onGroupChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export function ClientFilters({
                                  search,
                                  group,
                                  status,
                                  onSearchChange,
                                  onGroupChange,
                                  onStatusChange,
                              }: ClientFiltersProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                <Input
                    value={search}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="Search clients by name, phone, or ID..."
                    className="pl-10"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <select
                    value={group}
                    onChange={(event) =>
                        onGroupChange(event.target.value)
                    }
                    className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                    <option value="">All Groups</option>
                    <option value="Northside Traders">
                        Northside Traders
                    </option>
                    <option value="Downtown Merchants">
                        Downtown Merchants
                    </option>
                    <option value="Independent">
                        Independent
                    </option>
                </select>

                <select
                    value={status}
                    onChange={(event) =>
                        onStatusChange(event.target.value)
                    }
                    className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                    <option value="">Any Status</option>
                    <option value="active">Active</option>
                    <option value="arrears">Arrears</option>
                    <option value="inactive">Inactive</option>
                </select>

                <Button
                    type="button"
                    variant="outline"
                    size="md"
                    aria-label="More filters"
                >
                    <Filter className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}