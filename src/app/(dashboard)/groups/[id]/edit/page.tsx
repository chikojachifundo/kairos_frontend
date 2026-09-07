"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { GroupForm } from "@/components/groups/group-form";

import { getMockGroup } from "../../mock-data";
import type { GroupFormData } from "@/types/group";

import { branches, mockGroups } from "../../mock-data";

export default function EditGroupPage() {
    const params = useParams();

    const groupId = Number(params.id);
    const group = getMockGroup(groupId);

    if (!group) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Group Not Found"
                    description="The requested group could not be found."
                />

                <div className="rounded-xl border border-border bg-surface p-8">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold">
                            Group not found
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            The group you are trying to edit does not exist.
                        </p>

                        <Link href="/groups" className="mt-6 inline-block">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Groups
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const initialData: GroupFormData = {
        title: group.title,
        chair: group.chair,
        cellphone: group.cellphone,
        viceChair: group.viceChair,
        viceChairCell: group.viceChairCell,
        description: group.description,
        status: group.status,
        branchId: group.branchId,
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Group"
                description={`Update the information for ${group.title}.`}
                action={
                    <Link href={`/groups/${group.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Group
                        </Button>
                    </Link>
                }
            />

            <GroupForm
                mode="edit"
                groupId={group.id}
                initialData={initialData}
                branches={branches}
            />
        </div>
    );
}