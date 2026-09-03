"use client";

import { Eye, Pencil, Power, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { Branch } from "@/types/branch";

interface BranchActionsProps {
    branch: Branch;
    onDelete: (branch: Branch) => void;
    onDeactivate: (branch: Branch) => void;
}

export function BranchActions({
                                  branch,
                                  onDelete,
                                  onDeactivate,
                              }: BranchActionsProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuItem
                onClick={() =>
                    router.push(`/branches/${branch.id}`)
                }
            >
                <Eye className="mr-2 h-3.5 w-3.5" />
                View Branch
            </DropdownMenuItem>

            <DropdownMenuItem
                onClick={() =>
                    router.push(`/branches/${branch.id}/edit`)
                }
            >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit Branch
            </DropdownMenuItem>

            {branch.status === "active" && (
                <DropdownMenuItem
                    onClick={() => onDeactivate(branch)}
                >
                    <Power className="mr-2 h-3.5 w-3.5" />
                    Deactivate
                </DropdownMenuItem>
            )}

            <DropdownMenuItem
                danger
                onClick={() => onDelete(branch)}
            >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Branch
            </DropdownMenuItem>
        </DropdownMenu>
    );
}