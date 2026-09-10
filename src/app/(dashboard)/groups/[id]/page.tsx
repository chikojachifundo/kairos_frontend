"use client";

import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {
    ArrowLeft,
    Building2,
    Edit, Loader2,
    Phone,
    Trash2,
    UserRound,
    Users,
} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {PageHeader} from "@/components/ui/page-header";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {useFeedback} from "@/hooks/use-feedback";

import {groupService} from "@/services/group-service";
import type {Group} from "@/types/group";

export default function GroupShowPage() {
    const params = useParams();
    const router = useRouter();


    const {showFeedback} = useFeedback();

    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);

    const groupId = Number(params.id);

    useEffect(() => {
        if (!groupId || Number.isNaN(groupId)) {
            setLoading(false);
            return;
        }

        async function loadGroup() {
            try {
                setLoading(true);

                const data = await groupService.getGroup(groupId);

                setGroup(data);
            } catch (error) {
                console.error("Failed to load group:", error);

                showFeedback(
                    "error",
                    "Unable to load group",
                    "The requested group could not be loaded.",
                );

                setGroup(null);
            } finally {
                setLoading(false);
            }
        }

        loadGroup();
    }, [groupId, showFeedback]);

    async function handleDelete() {
        if (!group) {
            return;
        }

        setDeleting(true);

        try {
            await groupService.deleteGroup(group.id);

            setShowDeleteConfirmation(false);

            showFeedback(
                "success",
                "Group deleted successfully",
                `${group.title} has been removed from the system.`,
            );

            router.push("/groups");
        } catch (error: any) {
            console.error("Failed to delete group:", error);

            const message =
                error?.response?.data?.message ||
                "An error occurred while deleting the group. Please try again.";

            showFeedback(
                "error",
                "Unable to delete group",
                message,
            );
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return ( <div className="space-y-6"> <PageHeader
                title="Group"
                description="Loading group information..."
            />


                <Card>
                    <CardContent className="flex min-h-[400px] items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />

                            <p className="text-sm text-muted-foreground">
                                Loading group information...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );

}


    if (!group) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Group Not Found"
                    description="The requested group could not be found."
                />

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Users className="mb-4 h-12 w-12 text-muted-foreground"/>

                        <h2 className="text-lg font-semibold">
                            Group not found
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            The group you are looking for does not exist or
                            could not be loaded.
                        </p>

                        <Link href="/groups" className="mt-6">
                            <Button>
                                <ArrowLeft className="h-4 w-4"/>
                                Back to Groups
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <PageHeader
                    title={group.title}
                    description="View group information and leadership details."
                    action={
                        <div className="flex items-center gap-2">
                            <Link href="/groups">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4"/>
                                    Back
                                </Button>
                            </Link>

                            <Link href={`/groups/${group.id}/edit`}>
                                <Button size="sm">
                                    <Edit className="h-4 w-4"/>
                                    Edit Group
                                </Button>
                            </Link>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                    setShowDeleteConfirmation(true)
                                }
                            >
                                <Trash2 className="h-4 w-4"/>
                                Delete
                            </Button>
                        </div>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Group Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Group Overview</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Group Name
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {group.title}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Branch
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-muted-foreground"/>
                                    {group.branchName}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Members
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground"/>
                                    {group.memberCount} members
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Status
                                </p>

                                <div className="mt-2">
                                    <Badge
                                        className={
                                            group.status === "active"
                                                ? "border-green-200 bg-green-50 text-green-700"
                                                : "border-gray-200 bg-gray-100 text-gray-600"
                                        }
                                    >
                                        {group.status === "active"
                                            ? "Active"
                                            : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leadership */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Group Leadership</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-muted p-2">
                                    <UserRound className="h-5 w-5"/>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Chairperson
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {group.chair}
                                    </p>

                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5"/>
                                        {group.cellphone}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-muted p-2">
                                    <UserRound className="h-5 w-5"/>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Vice Chairperson
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        {group.viceChair}
                                    </p>

                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5"/>
                                        {group.viceChairCell}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm leading-6 text-muted-foreground">
                                {group.description ||
                                    "No description provided."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Group Information</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Group ID
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    #{group.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Branch
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {group.branchName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Member Count
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {group.memberCount}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Status
                                </p>

                                <p className="mt-1 text-sm font-medium capitalize">
                                    {group.status}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={showDeleteConfirmation}
                title="Delete Group?"
                description={`Are you sure you want to delete "${group.title}"? This action cannot be undone.`}
                confirmText="Delete Group"
                cancelText="Cancel"
                variant="delete"
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirmation(false)}
            />

        </>
    );
}
