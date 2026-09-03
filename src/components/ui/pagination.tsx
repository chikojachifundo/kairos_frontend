"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    from: number;
    to: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
                               currentPage,
                               totalPages,
                               totalItems,
                               from,
                               to,
                               onPageChange,
                           }: PaginationProps) {
    return (
        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
                Showing {from} to {to} of {totalItems} entries
            </p>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                ).map((page) => (
                    <Button
                        key={page}
                        size="sm"
                        variant={
                            page === currentPage
                                ? "primary"
                                : "outline"
                        }
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}