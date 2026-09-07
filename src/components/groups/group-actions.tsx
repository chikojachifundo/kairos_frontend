"use client";

import {
    Eye,
    Pencil,
    Power,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { Group } from "@/types/group";

interface GroupActionsProps {
    group: Group;
    onDelete: (group: Group) => void;
    onDeactivate: (group: Group) => void;
}

export function GroupActions({
                                 group,
                                 onDelete,
                                 onDeactivate,
                             }: GroupActionsProps) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuItem
                onClick={() => router.push(`/groups/${group.id}`)}
            >
                <Eye className="mr-2 h-3.5 w-3.5" />
                View Group
            </DropdownMenuItem>

            <DropdownMenuItem
                onClick={() => router.push(`/groups/${group.id}/edit`)}
            >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit Group
            </DropdownMenuItem>

            {group.status === "active" && (
                <DropdownMenuItem
                    onClick={() => onDeactivate(group)}
                >
                    <Power className="mr-2 h-3.5 w-3.5" />
                    Deactivate
                </DropdownMenuItem>
            )}

            <DropdownMenuItem
                danger
                onClick={() => onDelete(group)}
            >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Group
            </DropdownMenuItem>
        </DropdownMenu>
    );
}