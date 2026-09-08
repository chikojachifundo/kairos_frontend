"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Edit,
    FileText,
    MapPin,
    User,
    Wallet,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import { mockDisbursements, mockDisbursementCharges } from "../mock-data";
import { mockClients } from "@/app/(dashboard)/clients/mock-data";
import { mockProducts } from "@/app/(dashboard)/products/mock-data";
import { mockBranches } from "@/app/(dashboard)/branches/mock-data";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value?: string) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getStatusVariant(
    status: string,
): "success" | "warning" | "danger" | "neutral" {
    switch (status) {
        case "disbursed":
            return "success";

        case "approved":
            return "warning";

        case "cancelled":
            return "danger";

        default:
            return "neutral";
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case "pending":
            return "Pending";

        case "approved":
            return "Approved";

        case "disbursed":
            return "Disbursed";

        case "cancelled":
            return "Cancelled";

        default:
            return status;
    }
}

function getClientName(clientId: number) {
    const client = mockClients.find((item) => item.id === clientId);

    if (!client) return "Unknown Client";

    return `${client.firstName} ${client.middleName} ${client.lastName}`.replace(
        /\s+/g,
        " ",
    );
}

function getProductName(productId: number) {
    return (
        mockProducts.find((item) => item.id === productId)?.name ??
        "Unknown Product"
    );
}

function getBranchName(branchId: number) {
    return (
        mockBranches.find((item) => item.id === branchId)?.name ??
        "Unknown Branch"
    );
}

export default function DisbursementDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    const disbursement = mockDisbursements.find(
        (item) => item.id === id,
    );

    if (!disbursement) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Disbursement Not Found"
                    description="The requested disbursement could not be found."
                    icon={Banknote}
                />

                <Card className="p-8 text-center">
                    <p className="text-sm text-muted">
                        The disbursement you are looking for does not exist.
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        asChild
                    >
                        <Link href="/disbursements" className="flex items-center gap-2 whitespace-nowrap">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Disbursements
                        </Link>
                    </Button>
                </Card>
            </div>
        );
    }

    const client = mockClients.find(
        (item) => item.id === disbursement.clientId,
    );

    const product = mockProducts.find(
        (item) => item.id === disbursement.productId,
    );

    const branch = mockBranches.find(
        (item) => item.id === disbursement.branchId,
    );

    const charges = mockDisbursementCharges.filter(
        (item) => item.disbursementId === disbursement.id,
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title={disbursement.disbursementNumber}
                description="View disbursement details, charges and transaction history."
                icon={Banknote}
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href="/disbursements" className="flex items-center gap-2 whitespace-nowrap">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>

                        {disbursement.status !== "disbursed" &&
                            disbursement.status !== "cancelled" && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={`/disbursements/${disbursement.id}/edit`}
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                    </div>
                }
            />

            {/* Status Banner */}
            <Card className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Banknote className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Disbursement Status
                            </p>

                            <div className="mt-1">
                                <Badge
                                    variant={getStatusVariant(
                                        disbursement.status,
                                    )}
                                >
                                    {getStatusLabel(
                                        disbursement.status,
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted">
                            Total Loan Amount
                        </p>

                        <p className="mt-1 text-2xl font-bold text-primary">
                            {formatCurrency(
                                disbursement.totalAmount,
                            )}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Loan Summary */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Wallet className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Principal Amount
                            </p>

                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {formatCurrency(
                                    disbursement.principalAmount,
                                )}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Total Charges
                            </p>

                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {formatCurrency(
                                    disbursement.totalCharges,
                                )}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                            <Banknote className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Total Amount
                            </p>

                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {formatCurrency(
                                    disbursement.totalAmount,
                                )}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Client & Product */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Client Information
                            </h2>

                            <p className="text-xs text-muted">
                                Borrower associated with this disbursement
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted">
                                Client Name
                            </p>

                            <p className="mt-1 text-sm font-medium text-foreground">
                                {client
                                    ? `${client.firstName} ${client.middleName} ${client.lastName}`.replace(
                                        /\s+/g,
                                        " ",
                                    )
                                    : "Unknown Client"}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted">
                                    Client Number
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {client?.clientNumber ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted">
                                    National ID
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {client?.nationalId ?? "—"}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {client?.phone ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted">
                                    Group
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {client?.groupName ?? "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <Banknote className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Product Information
                            </h2>

                            <p className="text-xs text-muted">
                                Loan product used for this disbursement
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted">
                                Product
                            </p>

                            <p className="mt-1 text-sm font-medium text-foreground">
                                {product?.name ?? "Unknown Product"}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted">
                                    Product Code
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {product?.code ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted">
                                    Payment Term
                                </p>

                                <p className="mt-1 text-sm font-medium capitalize text-foreground">
                                    {product?.paymentTerm ?? "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-muted" />

                            <div>
                                <p className="text-xs text-muted">
                                    Branch
                                </p>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {branch?.name ??
                                        getBranchName(
                                            disbursement.branchId,
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Dates */}
            <Card className="p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarDays className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            Disbursement Dates
                        </h2>

                        <p className="text-xs text-muted">
                            Important dates associated with the loan
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted">
                            Application Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                            {formatDate(
                                disbursement.applicationDate,
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted">
                            Approval Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                            {formatDate(
                                disbursement.approvalDate,
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted">
                            Disbursement Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                            {formatDate(
                                disbursement.disbursementDate,
                            )}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Historical Charges */}
            <Card className="overflow-hidden">
                <div className="border-b border-border p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <FileText className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Disbursement Charges
                            </h2>

                            <p className="text-xs text-muted">
                                Charges captured at the time of
                                disbursement
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                        <tr className="border-b border-border bg-surface-low">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted">
                                Charge
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted">
                                Code
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-muted">
                                Type
                            </th>

                            <th className="px-6 py-3 text-right text-xs font-semibold text-muted">
                                Rate / Value
                            </th>

                            <th className="px-6 py-3 text-right text-xs font-semibold text-muted">
                                Amount
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {charges.map((charge) => (
                            <tr
                                key={charge.id}
                                className="border-b border-border last:border-0"
                            >
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-foreground">
                                        {charge.name}
                                    </p>

                                    {charge.description && (
                                        <p className="mt-1 text-xs text-muted">
                                            {charge.description}
                                        </p>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-sm text-muted">
                                    {charge.code}
                                </td>

                                <td className="px-6 py-4">
                                    <Badge variant="neutral">
                                        {charge.type ===
                                        "percentage"
                                            ? "Percentage"
                                            : "Fixed Amount"}
                                    </Badge>
                                </td>

                                <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                                    {charge.type ===
                                    "percentage"
                                        ? `${charge.rate}%`
                                        : formatCurrency(
                                            charge.rate,
                                        )}
                                </td>

                                <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                                    {formatCurrency(
                                        charge.amount,
                                    )}
                                </td>
                            </tr>
                        ))}

                        {charges.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-8 text-center text-sm text-muted"
                                >
                                    No charges were recorded for
                                    this disbursement.
                                </td>
                            </tr>
                        )}
                        </tbody>

                        <tfoot>
                        <tr className="bg-surface-low">
                            <td
                                colSpan={4}
                                className="px-6 py-4 text-right text-sm font-semibold text-foreground"
                            >
                                Total Charges
                            </td>

                            <td className="px-6 py-4 text-right text-sm font-bold text-primary">
                                {formatCurrency(
                                    disbursement.totalCharges,
                                )}
                            </td>
                        </tr>

                        <tr>
                            <td
                                colSpan={4}
                                className="px-6 py-4 text-right text-sm font-bold text-foreground"
                            >
                                Total Loan Amount
                            </td>

                            <td className="px-6 py-4 text-right text-base font-bold text-primary">
                                {formatCurrency(
                                    disbursement.totalAmount,
                                )}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>

            {/* Audit / Notes */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-primary" />

                        <h2 className="text-sm font-semibold text-foreground">
                            Processing Information
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted">
                                Created By
                            </p>

                            <p className="mt-1 text-sm font-medium text-foreground">
                                {disbursement.createdBy}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted">
                                Approved By
                            </p>

                            <p className="mt-1 text-sm font-medium text-foreground">
                                {disbursement.approvedBy ?? "—"}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />

                        <h2 className="text-sm font-semibold text-foreground">
                            Notes
                        </h2>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted">
                        {disbursement.notes ||
                            "No notes were recorded for this disbursement."}
                    </p>
                </Card>
            </div>
        </div>
    );
}