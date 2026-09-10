"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";

import {
    Banknote,
    CheckCircle2,
    Clock3, Loader2,
    Plus,
} from "lucide-react";

import {PageHeader} from "@/components/ui/page-header";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Card} from "@/components/ui/card";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {useFeedback} from "@/components/ui/feedback-bar";

import {DisbursementTable} from "@/components/disbursements/disbursement-table";

import type {Disbursement} from "@/types/disbursement";

import {mockClients} from "@/app/(dashboard)/clients/mock-data";
import {mockProducts} from "@/app/(dashboard)/products/mock-data";
import {mockBranches} from "@/app/(dashboard)/branches/mock-data";
import {disbursementService} from "@/services/disbursement-service";
import {ProductTable} from "@/components/products/product-table";
import {Product} from "@/types/product";
import {productService} from "@/services/product-service";
import {Client} from "@/types/client";
import {clientService} from "@/services/client-service";
import {Branch} from "@/types/branch";
import {branchService} from "@/services/branch-service";

type StatusFilter = "all" | Disbursement["status"];

export default function DisbursementsPage() {
    const {showFeedback} = useFeedback();


    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [productId, setProductId] = useState("all");


    const [selectedDisbursement, setSelectedDisbursement] =
        useState<Disbursement | null>(null);

    const [dialogType, setDialogType] = useState<
        "approve" | "cancel" | "delete" | null
    >(null);

    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");


    const [disbursements, setDisbursements] =
        useState<Disbursement[]>([]);

    const [clients, setClients] =
        useState<Client[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [branches, setBranches] =
        useState<Branch[]>([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const [
                    disbursementResponse,
                    clientResponse,
                    productResponse,
                    branchResponse,
                ] = await Promise.all([
                    disbursementService.getDisbursements(),
                    clientService.getClients(),
                    productService.getProducts(),
                    branchService.getBranches(),
                ]);

                setDisbursements(disbursementResponse.data);
                setClients(clientResponse.data);
                setProducts(productResponse.data);
                setBranches(branchResponse.data);
            } catch (e) {
                console.error("Failed to load data " + e);
            } finally {
                setLoading(false);
            }
        }
        loadData()
    }, [showFeedback]);

    const getClientName = (clientId: number) => {
        const client = clients.find((item) => item.id === clientId);

        if (!client) {
            return "Unknown Client";
        }

        return `${client.firstName} ${client.lastName}`;
    };

    const getProductName = (productId: number) => {
        const product = products.find((item) => item.id === productId);

        return product?.name ?? "Unknown Product";
    };

    const getBranchName = (disbursement: Disbursement) => {
        return disbursement.client?.branch?.name ||
            clients.find((client) => client.id === disbursement.clientId)?.branchName ||
            branches.find((branch) => branch.id === disbursement.branchId)?.name ||
            "Unknown Branch";
    };

    const getGroupName = (disbursement: Disbursement) => {
        return disbursement.client?.group?.title ||
            clients.find((client) => client.id === disbursement.clientId)?.groupName ||
            "Unknown Group";
    };

    const filteredDisbursements = useMemo(() => {
        const query = search.trim().toLowerCase();

        return disbursements.filter((disbursement) => {
            const clientName = getClientName(
                disbursement.clientId,
            ).toLowerCase();

            const productName = getProductName(
                disbursement.productId,
            ).toLowerCase();

            const matchesSearch =
                !query ||
                disbursement.disbursementNumber
                    .toLowerCase()
                    .includes(query) ||
                clientName.includes(query) ||
                productName.includes(query);

            const matchesStatus =
                status === "all" ||
                disbursement.status === status;

            const matchesProduct =
                productId === "all" ||
                disbursement.productId === Number(productId);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesProduct
            );
        });
    }, [disbursements, search, status, productId]);

    const summary = useMemo(() => {
        const total = disbursements.length;

        const pending = disbursements.filter(
            (item) => item.status === "pending",
        ).length;

        const approved = disbursements.filter(
            (item) => item.status === "approved",
        ).length;

        const disbursed = disbursements.filter(
            (item) => item.status === "disbursed",
        ).length;

        const cancelled = disbursements.filter(
            (item) => item.status === "cancelled",
        ).length;

        const totalPrincipal = disbursements
            .filter((item) => item.status === "disbursed")
            .reduce(
                (total, item) =>
                    total + item.principalAmount,
                0,
            );

        return {
            total,
            pending,
            approved,
            disbursed,
            cancelled,
            totalPrincipal,
        };
    }, [disbursements]);

    const openDialog = (
        type: "approve" | "cancel" | "delete",
        disbursement: Disbursement,
    ) => {
        setSelectedDisbursement(disbursement);
        setDialogType(type);
    };

    const closeDialog = () => {
        if (actionLoading) {
            return;
        }

        setSelectedDisbursement(null);
        setDialogType(null);
    };

    const handleConfirmAction = async () => {
        if (!selectedDisbursement || !dialogType) {
            return;
        }

        setActionLoading(true);
        try {

            if (dialogType === "approve") {
                const nextStatus = selectedDisbursement.status === "pending" ? "approved" : "disbursed";
                const updated = await disbursementService.approveDisbursement(selectedDisbursement.id);
                setDisbursements((current) =>
                    current.map((item) => {
                        if (item.id !== selectedDisbursement.id) {
                            return item;
                        }

                        return updated;
                    }),
                );

                showFeedback(
                    "success",
                    "",

                    selectedDisbursement.status === "pending"
                        ? `${selectedDisbursement.disbursementNumber} has been approved successfully.`
                        : `${selectedDisbursement.disbursementNumber} has been marked as disbursed.`,
                );
            }

            if (dialogType === "cancel") {
                const updated = await disbursementService.rejectDisbursement(selectedDisbursement.id);
                setDisbursements((current) =>
                    current.map((item) =>
                        item.id === selectedDisbursement.id
                            ? updated
                            : item,
                    ),
                );

                showFeedback(
                    "warning",
                    "",
                    `${selectedDisbursement.disbursementNumber} has been cancelled.`,
                );
            }

            if (dialogType === "delete") {
                await disbursementService.deleteDisbursement(selectedDisbursement.id);
                setDisbursements((current) =>
                    current.filter(
                        (item) =>
                            item.id !== selectedDisbursement.id,
                    ),
                );

                showFeedback(
                    "success",
                    "",
                    `${selectedDisbursement.disbursementNumber} has been deleted.`,
                );
            }

            setSelectedDisbursement(null);
            setDialogType(null);
        } catch (error) {
            console.error("Failed to update disbursement:", error);
            showFeedback("error", "Unable to update disbursement", "Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const getDialogTitle = () => {
        if (!selectedDisbursement) {
            return "";
        }

        switch (dialogType) {
            case "approve":
                return selectedDisbursement.status === "pending"
                    ? "Approve Disbursement?"
                    : "Mark Disbursement as Disbursed?";

            case "cancel":
                return "Cancel Disbursement?";

            case "delete":
                return "Delete Disbursement?";

            default:
                return "";
        }
    };

    const getDialogDescription = () => {
        if (!selectedDisbursement) {
            return "";
        }

        switch (dialogType) {
            case "approve":
                return selectedDisbursement.status === "pending"
                    ? `Are you sure you want to approve ${selectedDisbursement.disbursementNumber}?`
                    : `Confirm that ${selectedDisbursement.disbursementNumber} has been disbursed.`;

            case "cancel":
                return `Are you sure you want to cancel ${selectedDisbursement.disbursementNumber}?`;

            case "delete":
                return `Are you sure you want to permanently delete ${selectedDisbursement.disbursementNumber}? This action cannot be undone.`;

            default:
                return "";
        }
    };

    const getDialogVariant = () => {
        switch (dialogType) {
            case "delete":
                return "delete" as const;

            case "cancel":
                return "warning" as const;

            default:
                return "save" as const;
        }
    };

    const getConfirmText = () => {
        switch (dialogType) {
            case "approve":
                return selectedDisbursement?.status === "pending"
                    ? "Approve"
                    : "Mark Disbursed";

            case "cancel":
                return "Cancel Disbursement";

            case "delete":
                return "Delete";

            default:
                return "Confirm";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Disbursements"
                description="Manage loan applications, approvals and disbursements."
                icon={Banknote}
                action={
                    <Button asChild>
                        <Link href="/disbursements/create" className="flex items-center gap-2 whitespace-nowrap">
                            <Plus className="h-4 w-4"/>
                            New Disbursement
                        </Link>
                    </Button>
                }
            />

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted">
                                Total Disbursements
                            </p>

                            <p className="mt-2 text-2xl font-bold text-primary">
                                {summary.total}
                            </p>
                        </div>

                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Banknote className="h-5 w-5"/>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted">
                                Pending
                            </p>

                            <p className="mt-2 text-2xl font-bold text-primary">
                                {summary.pending}
                            </p>
                        </div>

                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                            <Clock3 className="h-5 w-5"/>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted">
                                Approved
                            </p>

                            <p className="mt-2 text-2xl font-bold text-primary">
                                {summary.approved}
                            </p>
                        </div>

                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                            <CheckCircle2 className="h-5 w-5"/>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-muted">
                                Disbursed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-primary">
                                {summary.disbursed}
                            </p>
                        </div>

                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                            <CheckCircle2 className="h-5 w-5"/>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-5">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <label
                            htmlFor="search"
                            className="mb-1.5 block text-xs font-medium text-muted"
                        >
                            Search
                        </label>

                        <Input
                            id="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search disbursement number, client or product..."
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="product"
                            className="mb-1.5 block text-xs font-medium text-muted"
                        >
                            Product
                        </label>

                        <Select
                            id="product"
                            value={productId}
                            onChange={(event) =>
                                setProductId(event.target.value)
                            }
                        >
                            <option value="all">
                                All Products
                            </option>

                            {products.map((product) => (
                                <option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label
                            htmlFor="status"
                            className="mb-1.5 block text-xs font-medium text-muted"
                        >
                            Status
                        </label>

                        <Select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target
                                        .value as StatusFilter,
                                )
                            }
                        >
                            <option value="all">
                                All Statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="disbursed">
                                Disbursed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>
                        </Select>
                    </div>
                </div>

                {(search ||
                    status !== "all" ||
                    productId !== "all") && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch("");
                                setStatus("all");
                                setProductId("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
                <div className="border-b border-border px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-primary">
                                Disbursement Register
                            </h2>

                            <p className="mt-1 text-xs text-muted">
                                {filteredDisbursements.length}{" "}
                                record
                                {filteredDisbursements.length ===
                                1
                                    ? ""
                                    : "s"}{" "}
                                found
                            </p>
                        </div>
                    </div>
                </div>


                {loading ? (
                    <div className="flex min-h-40 items-center justify-center"><Loader2
                        className="h-6 w-6 animate-spin text-muted"/></div>
                ) : error ? (
                    <div className="p-6 text-center"><p className="text-sm text-error">{error}</p><Button
                        className="mt-4" variant="outline" size="sm" onClick={() => window.location.reload()}>Try
                        Again</Button></div>
                ) : (
                    <DisbursementTable
                        disbursements={filteredDisbursements}
                        getClientName={getClientName}
                        getProductName={getProductName}
                    getBranchName={getBranchName}
                    getGroupName={getGroupName}
                        onApprove={(disbursement) =>
                            openDialog(
                                "approve",
                                disbursement,
                            )
                        }
                        onCancel={(disbursement) =>
                            openDialog(
                                "cancel",
                                disbursement,
                            )
                        }
                        onDelete={(disbursement) =>
                            openDialog(
                                "delete",
                                disbursement,
                            )
                        }
                    />)}


            </Card>

            {/* Confirmation */}
            <ConfirmDialog
                open={
                    selectedDisbursement !== null &&
                    dialogType !== null
                }
                title={getDialogTitle()}
                description={getDialogDescription()}
                confirmText={getConfirmText()}
                cancelText="Go Back"
                variant={getDialogVariant()}
                loading={actionLoading}
                onConfirm={handleConfirmAction}
                onCancel={closeDialog}
            />
        </div>
    );
}
