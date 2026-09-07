"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    Edit,
    Phone,
    Trash2,
    UserRound,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFeedback } from "@/hooks/use-feedback";

import { getMockGroup } from "../mock-data";

export default function GroupShowPage() {
    const params = useParams();
    const router = useRouter();

    const { showFeedback } = useFeedback();

    const groupId = Number(params.id);
    const group = getMockGroup(groupId);

    if (!group) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Group Not Found"
                    description="The requested group could not be found."
                />

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Users className="mb-4 h-12 w-12 text-muted-foreground" />

                        <h2 className="text-lg font-semibold">
                            Group not found
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            The group you are looking for does not exist.
                        </p>

                        <Link href="/groups" className="mt-6">
                            <Button>
                                <ArrowLeft className="h-4 w-4" />
                                Back to Groups
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    function handleDelete() {
        if (!group) {
            showFeedback(
                "error",
                "Group not found",
                "The group could not be found.",
            );
            return;
        }

        showFeedback(
            "success",
            "Group deleted successfully",
            `${group.title} has been removed from the system.`,
        );

        setTimeout(() => {
            router.push("/groups");
        }, 1500);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={group.title}
                description="View group information and leadership details."
                action={
                    <div className="flex items-center gap-2">
                        <Link href="/groups">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>

                        <Link href={`/groups/${group.id}/edit`}>
                            <Button size="sm">
                                <Edit className="h-4 w-4" />
                                Edit Group
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Group summary */}
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
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {group.branchName}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Members
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
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
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Chairperson
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {group.chair}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5" />
                                    {group.cellphone}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-muted p-2">
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Vice Chairperson
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {group.viceChair}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5" />
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
                            {group.description || "No description provided."}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional information */}
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
    );
}