"use client";

import Link from "next/link";
import {
    CheckCircle2,
    Eye,
    MoreHorizontal,
    Pencil,
    XCircle,
    Trash2,
} from "lucide-react";

import type { Disbursement } from "@/types/disbursement";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface DisbursementTableProps {
    disbursements: Disbursement[];

    getClientName: (clientId: number) => string;
    getProductName: (productId: number) => string;
    getBranchName: (disbursement: Disbursement) => string;
    getGroupName: (disbursement: Disbursement) => string;

    onApprove: (disbursement: Disbursement) => void;
    onCancel: (disbursement: Disbursement) => void;
    onDelete: (disbursement: Disbursement) => void;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(date: string) {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

function getStatusVariant(status: Disbursement["status"]) {
    switch (status) {
        case "disbursed":
            return "success";

        case "approved":
            return "warning";

        case "cancelled":
            return "danger";

        case "rejected":
            return "danger";

        case "pending":
        default:
            return "neutral";
    }
}

function getStatusLabel(status: Disbursement["status"]) {
    switch (status) {
        case "disbursed":
            return "Disbursed";

        case "approved":
            return "Approved";

        case "cancelled":
            return "Cancelled";

        case "rejected":
            return "Rejected";

        case "pending":
        default:
            return "Pending";
    }
}

export function DisbursementTable({
                                      disbursements,
                                      getClientName,
                                      getProductName,
                                      getBranchName,
                                      getGroupName,
                                      onApprove,
                                      onCancel,
                                      onDelete,
                                  }: DisbursementTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
                <thead>
                <tr className="border-b border-border bg-surface-low">

                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                        ID
                    </th>


                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                        Group
                    </th>



                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                        Client
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                        Product
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted">
                        Principal
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted">
                        Charges
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted">
                        Total
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                        Date
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted">
                        Status
                    </th>

                    <th className="w-12 px-4 py-3" />
                </tr>
                </thead>

                <tbody className="divide-y divide-border">
                {disbursements.length === 0 ? (
                    <tr>
                        <td
                            colSpan={10}
                            className="px-4 py-12 text-center text-sm text-muted"
                        >
                            No disbursements found.
                        </td>
                    </tr>
                ) : (
                    disbursements.map((disbursement) => (
                        <tr
                            key={disbursement.id}
                            className="transition-colors hover:bg-surface-low/60"
                        >


                            <td className="px-4 py-4 font-mono text-xs text-muted">
                                #{disbursement.id}
                            </td>

                            {/* Disbursement Number */}
                            <td className="px-4 py-4">
                                <div>
                                    <Link
                                        href={`/disbursements/${disbursement.id}`}
                                        className="text-sm font-semibold text-primary hover:underline"
                                    >
                                        {disbursement.disbursementNumber}
                                    </Link>

                                    <p className="mt-0.5 text-xs text-muted">
                                        {getBranchName(disbursement)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted">
                                        Group: {getGroupName(disbursement)}
                                    </p>
                                </div>
                            </td>

                            {/* Client */}
                            <td className="px-4 py-4">
                                <p className="text-sm font-medium text-foreground">
                                    {getClientName(disbursement.clientId)}
                                </p>
                            </td>

                            {/* Product */}
                            <td className="px-4 py-4">
                                <p className="text-sm text-foreground">
                                    {getProductName(
                                        disbursement.productId,
                                    )}
                                </p>
                            </td>

                            {/* Principal */}
                            <td className="px-4 py-4 text-right">
                                    <span className="text-sm font-medium text-foreground">
                                        {formatCurrency(
                                            disbursement.principalAmount,
                                        )}
                                    </span>
                            </td>

                            {/* Charges */}
                            <td className="px-4 py-4 text-right">
                                    <span className="text-sm text-muted">
                                        {formatCurrency(
                                            disbursement.totalCharges,
                                        )}
                                    </span>
                            </td>

                            {/* Total */}
                            <td className="px-4 py-4 text-right">
                                    <span className="text-sm font-semibold text-primary">
                                        {formatCurrency(
                                            disbursement.totalAmount,
                                        )}
                                    </span>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-4">
                                    <span className="text-sm text-foreground">
                                        {formatDate(
                                            disbursement.disbursementDate,
                                        )}
                                    </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                                <Badge
                                    variant={getStatusVariant(
                                        disbursement.status,
                                    )}
                                >
                                    {getStatusLabel(
                                        disbursement.status,
                                    )}
                                </Badge>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4">
                                <DropdownMenu>
                                    <DropdownMenuItem>
                                        <Link
                                            href={`/disbursements/${disbursement.id}`}
                                            className="flex w-full items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Link>
                                    </DropdownMenuItem>

                                    {disbursement.status === "pending" && (
                                        <>
                                            <DropdownMenuItem>
                                                <Link
                                                    href={`/disbursements/${disbursement.id}/edit`}
                                                    className="flex w-full items-center gap-2"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onApprove(
                                                        disbursement,
                                                    )
                                                }
                                            >
                                                <CheckCircle2 className="h-4 w-4" /> &nbsp;
                                                Approve
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                danger
                                                onClick={() =>
                                                    onCancel(
                                                        disbursement,
                                                    )
                                                }
                                            >
                                                <XCircle className="h-4 w-4" /> &nbsp;
                                                Cancel
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {disbursement.status === "approved" && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onApprove(disbursement)
                                            }
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            Mark Disbursed
                                        </DropdownMenuItem>
                                    )}

                                    {/*{disbursement.status !== "disbursed" && (*/}
                                    {/*    <DropdownMenuItem*/}
                                    {/*        danger*/}
                                    {/*        onClick={() =>*/}
                                    {/*            onDelete(disbursement)*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        <Trash2 className="h-4 w-4" />*/}
                                    {/*        Delete*/}
                                    {/*    </DropdownMenuItem>*/}
                                    {/*)}*/}
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
