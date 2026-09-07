"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CreditCard,
    Edit,
    Mail,
    MapPin,
    Phone,
    Trash2,
    User,
    Users, UserX,
} from "lucide-react";

import { mockClients } from "../mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    ConfirmDialog,
} from "@/components/ui/confirm-dialog";
import {
    useFeedback,
} from "@/components/ui/feedback-bar";
import {useState} from "react";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: string) {
    if (!value) return "-";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function DetailItem({
                        label,
                        value,
                        icon: Icon,
                    }: {
    label: string;
    value: React.ReactNode;
    icon?: React.ElementType;
}) {
    return (
        <div className="flex gap-3">
            {Icon && (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-low text-muted">
                    <Icon className="h-4 w-4" />
                </div>
            )}

            <div className={Icon ? "" : "w-full"}>
                <p className="text-xs font-medium text-muted">{label}</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}

export default function ClientShowPage() {
    const params = useParams();
    const router = useRouter();
    const { showFeedback } = useFeedback();
    const [showDeactivateDialog, setShowDeactivateDialog] =
        useState(false);

    const [showDeleteDialog, setShowDeleteDialog] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);
    const clientId = Number(params.id);

    const client = mockClients.find(
        (item) => item.id === clientId
    );

    if (!client) {
        return (
            <div className="space-y-6">
                <div>
                    <Link
                        href="/clients"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Clients
                    </Link>
                </div>

                <Card className="p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-low">
                        <User className="h-6 w-6 text-muted" />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-foreground">
                        Client not found
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        The client you are looking for does not exist or has
                        been removed.
                    </p>

                    <div className="mt-5">
                        <Button asChild variant="outline">
                            <Link href="/clients">
                                Back to Clients
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const fullName = [
        client.firstName,
        client.middleName,
        client.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    const confirmDeactivate = () => {
        setActionLoading(true);

        // Simulate API request
        setTimeout(() => {
            setActionLoading(false);
            setShowDeactivateDialog(false);

            showFeedback(
                "success",
                "Client deactivated",
                `${fullName} has been deactivated successfully.`,
            );
        }, 800);
    };

    const confirmDelete = () => {
        setActionLoading(true);

        // Simulate API request
        setTimeout(() => {
            setActionLoading(false);
            setShowDeleteDialog(false);

            showFeedback(
                "success",
                "Client deleted",
                `${fullName} has been deleted successfully.`,
            );

            setTimeout(() => {
                router.push("/clients");
            }, 1000);
        }, 800);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Link
                        href="/clients"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Clients
                    </Link>

                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-primary">
                            {fullName}
                        </h1>

                        <Badge
                            variant={
                                client.status === "active"
                                    ? "success"
                                    : "neutral"
                            }
                        >
                            {client.status === "active"
                                ? "Active"
                                : "Inactive"}
                        </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted">
                        Client No. {client.clientNumber}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/clients/${client.id}/edit`} className="flex items-center gap-2 whitespace-nowrap">
                            <Edit className="h-4 w-4" />
                            Edit Client
                        </Link>
                    </Button>

                    <DropdownMenu>
                        {client.status === "active" && (
                            <DropdownMenuItem danger
                                onClick={() => {
                                    setShowDeactivateDialog(true);
                                }}
                            >

                                <UserX className="mr-2 h-4 w-4"/>
                                Deactivate
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                            danger
                            onClick={() => {
                                setShowDeleteDialog(true);
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </div>

            {/* Client Overview */}
            <Card className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                            {client.firstName.charAt(0)}
                            {client.lastName.charAt(0)}
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                {fullName}
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                {client.branchName} · {client.groupName}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                        <div>
                            <p className="text-xs text-muted">
                                Active Loans
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {client.activeLoans}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Total Loans
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {client.totalLoans}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Outstanding
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {formatCurrency(
                                    client.outstandingBalance
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Registered
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {formatDate(client.registrationDate)}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Information Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Information */}
                <Card className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Personal Information
                            </h2>
                            <p className="text-xs text-muted">
                                Basic client identification details
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Client Number"
                            value={client.clientNumber}
                        />

                        <DetailItem
                            label="National ID"
                            value={client.nationalId}
                        />

                        <DetailItem
                            label="Gender"
                            value={
                                client.gender
                                    ? client.gender
                                        .charAt(0)
                                        .toUpperCase() +
                                    client.gender.slice(1)
                                    : "-"
                            }
                        />

                        <DetailItem
                            label="Date of Birth"
                            value={formatDate(client.dateOfBirth)}
                            icon={CalendarDays}
                        />
                    </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Phone className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Contact Information
                            </h2>
                            <p className="text-xs text-muted">
                                Client contact and address details
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <DetailItem
                            label="Phone"
                            value={client.phone}
                            icon={Phone}
                        />

                        <DetailItem
                            label="Alternative Phone"
                            value={client.alternativePhone}
                            icon={Phone}
                        />

                        <DetailItem
                            label="Email"
                            value={client.email}
                            icon={Mail}
                        />

                        <DetailItem
                            label="Address"
                            value={[
                                client.address,
                                client.city,
                                client.region,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                            icon={MapPin}
                        />
                    </div>
                </Card>

                {/* Branch & Group */}
                <Card className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Users className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Branch & Group
                            </h2>
                            <p className="text-xs text-muted">
                                Client organizational assignment
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Branch"
                            value={client.branchName}
                        />

                        <DetailItem
                            label="Group"
                            value={client.groupName}
                        />
                    </div>
                </Card>

                {/* Employment */}
                <Card className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <BriefcaseBusiness className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Employment & Income
                            </h2>
                            <p className="text-xs text-muted">
                                Employment and financial information
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Employment Status"
                            value={client.employmentStatus
                                .replaceAll("_", " ")
                                .replace(/\b\w/g, (letter) =>
                                    letter.toUpperCase()
                                )}
                        />

                        <DetailItem
                            label="Employer"
                            value={client.employer}
                        />

                        <DetailItem
                            label="Occupation"
                            value={client.occupation}
                        />

                        <DetailItem
                            label="Monthly Income"
                            value={formatCurrency(
                                client.monthlyIncome
                            )}
                        />
                    </div>
                </Card>
            </div>

            {/* Loan Summary */}
            <Card className="p-5">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CreditCard className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-foreground">
                            Loan Summary
                        </h2>
                        <p className="text-xs text-muted">
                            Overview of the client's loan activity
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg bg-surface-low p-4">
                        <p className="text-xs text-muted">
                            Total Loans
                        </p>
                        <p className="mt-2 text-xl font-semibold text-foreground">
                            {client.totalLoans}
                        </p>
                    </div>

                    <div className="rounded-lg bg-surface-low p-4">
                        <p className="text-xs text-muted">
                            Active Loans
                        </p>
                        <p className="mt-2 text-xl font-semibold text-foreground">
                            {client.activeLoans}
                        </p>
                    </div>

                    <div className="rounded-lg bg-surface-low p-4">
                        <p className="text-xs text-muted">
                            Total Disbursed
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                            {formatCurrency(client.totalDisbursed)}
                        </p>
                    </div>

                    <div className="rounded-lg bg-surface-low p-4">
                        <p className="text-xs text-muted">
                            Total Repaid
                        </p>
                        <p className="mt-2 text-lg font-semibold text-foreground">
                            {formatCurrency(client.totalRepaid)}
                        </p>
                    </div>

                    <div className="rounded-lg bg-primary p-4 text-white">
                        <p className="text-xs opacity-80">
                            Outstanding Balance
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                            {formatCurrency(
                                client.outstandingBalance
                            )}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Additional Information */}
            <Card className="p-5">
                <div className="mb-5">
                    <h2 className="font-semibold text-foreground">
                        Additional Information
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                        Registration and other client information
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <DetailItem
                        label="Registration Date"
                        value={formatDate(client.registrationDate)}
                        icon={CalendarDays}
                    />

                    <DetailItem
                        label="Status"
                        value={
                            <Badge
                                variant={
                                    client.status === "active"
                                        ? "success"
                                        : "neutral"
                                }
                            >
                                {client.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </Badge>
                        }
                    />

                    {client.status === "inactive" &&
                        client.deactivatedAt && (
                            <DetailItem
                                label="Deactivated At"
                                value={formatDate(
                                    client.deactivatedAt
                                )}
                            />
                        )}

                    {client.status === "inactive" &&
                        client.deactivationReason && (
                            <DetailItem
                                label="Deactivation Reason"
                                value={client.deactivationReason}
                            />
                        )}

                    <div className="sm:col-span-2">
                        <DetailItem
                            label="Notes"
                            value={client.notes || "No notes recorded."}
                        />
                    </div>
                </div>
            </Card>

            <ConfirmDialog
                open={showDeactivateDialog}
                title="Deactivate Client?"
                description={`Are you sure you want to deactivate ${fullName}? The client will no longer be treated as an active client.`}
                confirmText="Deactivate"
                cancelText="Cancel"
                variant="warning"
                loading={actionLoading}
                onConfirm={confirmDeactivate}
                onCancel={() => {
                    if (!actionLoading) {
                        setShowDeactivateDialog(false);
                    }
                }}
            />

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete Client?"
                description={`Are you sure you want to delete ${fullName}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
                loading={actionLoading}
                onConfirm={confirmDelete}
                onCancel={() => {
                    if (!actionLoading) {
                        setShowDeleteDialog(false);
                    }
                }}
            />

        </div>
    );
}