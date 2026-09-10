"use client";

import {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Banknote,
    Calculator,
    CalendarDays,
    Check,
    ClipboardCheck,
    UserRound,
} from "lucide-react";

import type {Client} from "@/types/client";
import type {Product} from "@/types/product";
import type {ProductCharge} from "@/types/product-charge";
import type {ProductChargeRecord} from "@/types/product-charge-record";
import type {Disbursement} from "@/types/disbursement";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {useFeedback} from "@/components/ui/feedback-bar";
import {disbursementService} from "@/services/disbursement-service";

interface DisbursementFormProps {
    mode: "create" | "edit";

    clients: Client[];
    products: Product[];
    productCharges: ProductCharge[];
    productChargeRecords: ProductChargeRecord[];

    disbursement?: Disbursement;
}

interface FormData {
    clientId: number | "";
    productId: number | "";

    applicationDate: string;
    approvalDate: string;
    disbursementDate: string;

    principalAmount: string;
    tenure: string;
    tenureUnits: NonNullable<Disbursement["tenureUnits"]>;

    status: Disbursement["status"];

    notes: string;
}

interface CalculatedCharge {
    productChargeId: number;
    code: string;
    name: string;
    type: "percentage" | "fixed-amount";
    rate: number;
    amount: number;
    description?: string;
}

const steps = [
    {
        number: 1,
        title: "Client & Product",
        shortTitle: "Client",
        description: "Select the client and loan product.",
        icon: UserRound,
    },
    {
        number: 2,
        title: "Loan Details",
        shortTitle: "Details",
        description: "Enter amount and important dates.",
        icon: Banknote,
    },
    {
        number: 3,
        title: "Charges",
        shortTitle: "Charges",
        description: "Review the charges applied to the loan.",
        icon: Calculator,
    },
    {
        number: 4,
        title: "Review",
        shortTitle: "Review",
        description: "Review everything before saving.",
        icon: ClipboardCheck,
    },
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-MW", {
        style: "currency",
        currency: "MWK",
        maximumFractionDigits: 0,
    }).format(amount);
}

function today() {
    return new Date().toISOString().split("T")[0];
}

function formatDate(date: string) {
    if (!date) {
        return "-";
    }

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsed);
}

export function DisbursementForm({
                                     mode,
                                     clients,
                                     products,
                                     productCharges,
                                     productChargeRecords,
                                     disbursement,
                                 }: DisbursementFormProps) {
    const router = useRouter();
    const {showFeedback} = useFeedback();

    const [form, setForm] = useState<FormData>({
        clientId: disbursement?.clientId ?? "",
        productId: disbursement?.productId ?? "",

        applicationDate:
            disbursement?.applicationDate ?? today(),

        approvalDate:
            disbursement?.approvalDate ?? "",

        disbursementDate:
            disbursement?.disbursementDate ?? today(),

        principalAmount:
            disbursement?.principalAmount?.toString() ?? "",

        tenure: disbursement?.tenure?.toString() ?? "",
        tenureUnits: disbursement?.tenureUnits ?? "months",

        status:
            disbursement?.status ?? "pending",

        notes:
            disbursement?.notes ?? "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof FormData, string>>
    >({});

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    /*
     * Selected client
     */
    const selectedClient = useMemo(() => {
        if (!form.clientId) {
            return undefined;
        }

        return clients.find(
            (client) =>
                client.id === Number(form.clientId),
        );
    }, [clients, form.clientId]);

    /*
     * Selected product
     */
    const selectedProduct = useMemo(() => {
        if (!form.productId) {
            return undefined;
        }

        return products.find(
            (product) =>
                product.id === Number(form.productId),
        );
    }, [products, form.productId]);

    /*
     * Product charge records belonging to
     * the selected product.
     */
    const selectedProductCharges = useMemo(() => {
        if (!form.productId) {
            return [];
        }

        const records = productChargeRecords.filter(
            (record) =>
                record.productId === Number(form.productId) &&
                record.status === "active",
        );

        return records
            .map((record) => {
                const charge = productCharges.find(
                    (item) =>
                        item.id === record.productChargeId,
                );

                if (
                    !charge ||
                    charge.status !== "active"
                ) {
                    return null;
                }

                return {
                    record,
                    charge,
                };
            })
            .filter(
                (
                    item,
                ): item is {
                    record: ProductChargeRecord;
                    charge: ProductCharge;
                } => item !== null,
            );
    }, [
        form.productId,
        productChargeRecords,
        productCharges,
    ]);

    /*
     * Calculate charges from the current
     * principal amount.
     */
    const calculatedCharges =
        useMemo<CalculatedCharge[]>(
            () => {
                const principal =
                    Number(form.principalAmount) || 0;

                return selectedProductCharges.map(
                    ({record, charge}) => {
                        let amount = 0;

                        if (record.status === "active") {
                            if (
                                charge.type ===
                                "percentage"
                            ) {
                                amount =
                                    principal *
                                    (record.value / 100);
                            } else {
                                amount = record.value;
                            }
                        }

                        return {
                            productChargeId:
                            charge.id,

                            code: charge.code,

                            name: charge.name,

                            type: charge.type,

                            rate: record.value,

                            amount,

                            description:
                                record.description ??
                                charge.description,
                        };
                    },
                );
            },
            [
                form.principalAmount,
                selectedProductCharges,
            ],
        );

    const totalCharges = useMemo(() => {
        return calculatedCharges.reduce(
            (total, charge) =>
                total + charge.amount,
            0,
        );
    }, [calculatedCharges]);

    const principalAmount =
        Number(form.principalAmount) || 0;

    const totalAmount =
        principalAmount + totalCharges;

    /*
     * Update form field.
     */
    const updateField = <
        K extends keyof FormData
    >(
        field: K,
        value: FormData[K],
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    };

    /*
     * Validate the current wizard step.
     */
    const validateStep = (step: number) => {
        const nextErrors: Partial<
            Record<keyof FormData, string>
        > = {};

        if (step === 1) {
            if (!form.clientId) {
                nextErrors.clientId =
                    "Please select a client.";
            }

            if (!form.productId) {
                nextErrors.productId =
                    "Please select a product.";
            }
        }

        if (step === 2) {
            if (!form.applicationDate) {
                nextErrors.applicationDate =
                    "Application date is required.";
            }

            if (!form.disbursementDate) {
                nextErrors.disbursementDate =
                    "Disbursement date is required.";
            }

            if (!form.principalAmount) {
                nextErrors.principalAmount =
                    "Principal amount is required.";
            } else if (principalAmount <= 0) {
                nextErrors.principalAmount =
                    "Principal amount must be greater than zero.";
            }

            if (!form.tenure || Number(form.tenure) <= 0) {
                nextErrors.tenure = "Tenure must be greater than zero.";
            }

            if (!form.tenureUnits) {
                nextErrors.tenureUnits = "Please select tenure units.";
            }

            if (
                form.applicationDate &&
                form.disbursementDate &&
                form.disbursementDate <
                form.applicationDate
            ) {
                nextErrors.disbursementDate =
                    "Disbursement date cannot be before the application date.";
            }

            if (
                form.approvalDate &&
                form.applicationDate &&
                form.approvalDate <
                form.applicationDate
            ) {
                nextErrors.approvalDate =
                    "Approval date cannot be before the application date.";
            }

            if (
                form.approvalDate &&
                form.disbursementDate &&
                form.approvalDate >
                form.disbursementDate
            ) {
                nextErrors.approvalDate =
                    "Approval date cannot be after the disbursement date.";
            }
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            showFeedback(
                "error",
                "",
                "Please correct the highlighted fields before continuing.",
            );

            return false;
        }

        return true;
    };

    /*
     * Final validation before confirmation.
     */
    const validate = () => {
        const nextErrors: Partial<
            Record<keyof FormData, string>
        > = {};

        if (!form.clientId) {
            nextErrors.clientId =
                "Please select a client.";
        }

        if (!form.productId) {
            nextErrors.productId =
                "Please select a product.";
        }

        if (!form.applicationDate) {
            nextErrors.applicationDate =
                "Application date is required.";
        }

        if (!form.disbursementDate) {
            nextErrors.disbursementDate =
                "Disbursement date is required.";
        }

        if (!form.principalAmount) {
            nextErrors.principalAmount =
                "Principal amount is required.";
        } else if (principalAmount <= 0) {
            nextErrors.principalAmount =
                "Principal amount must be greater than zero.";
        }

        if (!form.tenure || Number(form.tenure) <= 0) {
            nextErrors.tenure = "Tenure must be greater than zero.";
        }

        if (!form.tenureUnits) {
            nextErrors.tenureUnits = "Please select tenure units.";
        }

        if (
            form.applicationDate &&
            form.disbursementDate &&
            form.disbursementDate <
            form.applicationDate
        ) {
            nextErrors.disbursementDate =
                "Disbursement date cannot be before the application date.";
        }

        if (
            form.approvalDate &&
            form.applicationDate &&
            form.approvalDate <
            form.applicationDate
        ) {
            nextErrors.approvalDate =
                "Approval date cannot be before the application date.";
        }

        if (
            form.approvalDate &&
            form.disbursementDate &&
            form.approvalDate >
            form.disbursementDate
        ) {
            nextErrors.approvalDate =
                "Approval date cannot be after the disbursement date.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /*
     * Move to the next step.
     */
    const handleNext = () => {
        if (!validateStep(currentStep)) {
            return;
        }

        setCurrentStep((step) =>
            Math.min(
                step + 1,
                steps.length,
            ),
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * Move to the previous step.
     */
    const handleBack = () => {
        setCurrentStep((step) =>
            Math.max(step - 1, 1),
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * Final submit.
     */
    const handleSubmit = () => {
        if (!validate()) {
            showFeedback(
                "error",
                "",
                "Please correct the highlighted fields before continuing.",
            );

            return;
        }

        setConfirmOpen(true);
    };

    /*
     * Save disbursement.
     */
    const handleConfirmSave = async () => {
        if (
            !selectedClient ||
            !selectedProduct
        ) {
            return;
        }

        setSaving(true);

        /*
         * Snapshot charges.
         *
         * These values should be persisted as
         * DisbursementCharge records in the
         * real backend.
         */
        const snapshotCharges =
            calculatedCharges.map(
                (charge) => ({
                    productChargeId:
                    charge.productChargeId,

                    code: charge.code,

                    name: charge.name,

                    type: charge.type,

                    rate: charge.rate,

                    amount: charge.amount,

                    description:
                    charge.description,
                }),
            );

        try {
            const payload = {
                clientId: selectedClient.id,
                productId: selectedProduct.id,
                applicationDate: form.applicationDate,
                approvalDate: form.approvalDate || null,
                disbursementDate: form.disbursementDate,
                principalAmount,
                tenure: Number(form.tenure),
                tenureUnits: form.tenureUnits,
                status: form.status,
                notes: form.notes.trim() || undefined
            };
            if (mode === "create") {
                await disbursementService.createDisbursement(payload);
            } else {
                if (!disbursement) throw new Error("Disbursement information is missing.");
                await disbursementService.updateDisbursement(disbursement.id, payload);
            }
            setConfirmOpen(false);
            showFeedback("success", "", mode === "create" ? "Disbursement created successfully." : "Disbursement updated successfully.");
            router.push("/disbursements");
        } catch (error) {
            console.error("Failed to save disbursement:", error);
            showFeedback("error", "Unable to save disbursement", "Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="mx-auto w-full max-w-5xl space-y-4 pb-4">

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <Card className="overflow-hidden">
                    <div className="p-4 sm:p-6">

                        <div className="mb-5">
                            <h1 className="text-lg font-semibold text-primary">
                                {mode === "create"
                                    ? "Create Disbursement"
                                    : "Edit Disbursement"}
                            </h1>

                            <p className="mt-1 text-xs text-muted">
                                Complete the steps below to process the loan disbursement.
                            </p>
                        </div>

                        {/* Desktop / Tablet Step Indicator */}
                        <div className="hidden sm:block">
                            <div className="relative">
                                <div className="absolute left-0 right-0 top-5 h-0.5 bg-border"/>

                                <div
                                    className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-300"
                                    style={{
                                        width: `${
                                            ((currentStep - 1) /
                                                (steps.length - 1)) *
                                            100
                                        }%`,
                                    }}
                                />

                                <div className="relative flex items-start justify-between">
                                    {steps.map(
                                        (step) => {
                                            const Icon =
                                                step.icon;

                                            const isActive =
                                                currentStep ===
                                                step.number;

                                            const isCompleted =
                                                currentStep >
                                                step.number;

                                            return (
                                                <div
                                                    key={
                                                        step.number
                                                    }
                                                    className="flex flex-col items-center"
                                                >
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all ${
                                                            isCompleted
                                                                ? "border-primary bg-primary text-white"
                                                                : isActive
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-border text-muted"
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <Check className="h-4 w-4"/>
                                                        ) : (
                                                            <Icon className="h-4 w-4"/>
                                                        )}
                                                    </div>

                                                    <p
                                                        className={`mt-2 text-xs font-semibold ${
                                                            isActive ||
                                                            isCompleted
                                                                ? "text-primary"
                                                                : "text-muted"
                                                        }`}
                                                    >
                                                        {
                                                            step.title
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 hidden text-center text-[10px] text-muted md:block">
                                                        {
                                                            step.description
                                                        }
                                                    </p>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Step Indicator */}
                        <div className="sm:hidden">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-primary">
                                        Step{" "}
                                        {
                                            currentStep
                                        }{" "}
                                        of{" "}
                                        {
                                            steps.length
                                        }
                                    </p>

                                    <p className="mt-0.5 text-sm font-medium text-foreground">
                                        {
                                            steps[
                                            currentStep -
                                            1
                                                ].title
                                        }
                                    </p>
                                </div>

                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                    {
                                        currentStep
                                    }
                                </div>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-border">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-300"
                                    style={{
                                        width: `${
                                            (currentStep /
                                                steps.length) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* =====================================================
                    STEP 1 - CLIENT & PRODUCT
                ====================================================== */}
                {currentStep === 1 && (
                    <Card className="p-4 sm:p-6">

                        <div className="mb-5 sm:mb-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <UserRound className="h-5 w-5"/>
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-primary">
                                        Client & Product
                                    </h2>

                                    <p className="mt-1 text-xs text-muted">
                                        Select the client and loan product.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 md:gap-5">

                            {/* Client */}
                            <div>
                                <label
                                    htmlFor="clientId"
                                    className="mb-1.5 block text-xs font-medium text-muted"
                                >
                                    Client{" "}
                                    <span className="text-error">
                                        *
                                    </span>
                                </label>

                                <Select
                                    id="clientId"
                                    value={
                                        form.clientId
                                            ? String(
                                                form.clientId,
                                            )
                                            : ""
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateField(
                                            "clientId",
                                            event
                                                .target
                                                .value
                                                ? Number(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                                : "",
                                        )
                                    }
                                >
                                    <option value="">
                                        Select client
                                    </option>

                                    {clients
                                        .filter(
                                            (
                                                client,
                                            ) =>
                                                client.status ===
                                                "active",
                                        )
                                        .map(
                                            (
                                                client,
                                            ) => (
                                                <option
                                                    key={
                                                        client.id
                                                    }
                                                    value={
                                                        client.id
                                                    }
                                                >
                                                    {
                                                        client.clientNumber
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        client.firstName
                                                    }{" "}
                                                    {
                                                        client.lastName
                                                    }
                                                </option>
                                            ),
                                        )}
                                </Select>

                                {errors.clientId && (
                                    <p className="mt-1.5 text-xs text-error">
                                        {
                                            errors.clientId
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Product */}
                            <div>
                                <label
                                    htmlFor="productId"
                                    className="mb-1.5 block text-xs font-medium text-muted"
                                >
                                    Product{" "}
                                    <span className="text-error">
                                        *
                                    </span>
                                </label>

                                <Select
                                    id="productId"
                                    value={
                                        form.productId
                                            ? String(
                                                form.productId,
                                            )
                                            : ""
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateField(
                                            "productId",
                                            event
                                                .target
                                                .value
                                                ? Number(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                                : "",
                                        )
                                    }
                                >
                                    <option value="">
                                        Select product
                                    </option>

                                    {products
                                        .filter(
                                            (
                                                product,
                                            ) =>
                                                product.status ===
                                                "active",
                                        )
                                        .map(
                                            (
                                                product,
                                            ) => (
                                                <option
                                                    key={
                                                        product.id
                                                    }
                                                    value={
                                                        product.id
                                                    }
                                                >
                                                    {
                                                        product.code
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        product.name
                                                    }
                                                </option>
                                            ),
                                        )}
                                </Select>

                                {errors.productId && (
                                    <p className="mt-1.5 text-xs text-error">
                                        {
                                            errors.productId
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Selected Client */}
                        {selectedClient && (
                            <div className="mt-5 rounded-lg border border-border bg-surface-low p-4">

                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-primary">
                                        Selected Client
                                    </p>

                                    <span
                                        className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                                        Active
                                    </span>
                                </div>

                                <div className="grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-4">

                                    <div>
                                        <p className="text-xs text-muted">
                                            Client
                                        </p>

                                        <p className="mt-1 font-medium text-foreground">
                                            {
                                                selectedClient.firstName
                                            }{" "}
                                            {
                                                selectedClient.lastName
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted">
                                            Client Number
                                        </p>

                                        <p className="mt-1 font-medium text-foreground">
                                            {
                                                selectedClient.clientNumber
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted">
                                            National ID
                                        </p>

                                        <p className="mt-1 font-medium text-foreground">
                                            {
                                                selectedClient.nationalId
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted">
                                            Branch
                                        </p>

                                        <p className="mt-1 font-medium text-foreground">
                                            {
                                                selectedClient.branchName
                                            }
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-4 border-t border-border pt-4">
                                    <p className="text-xs text-muted">
                                        Group
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {
                                            selectedClient.groupName
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Selected Product */}
                        {selectedProduct && (
                            <div className="mt-4 rounded-lg border border-primary/10 bg-primary/5 p-4">

                                <p className="text-xs text-muted">
                                    Selected Product
                                </p>

                                <div className="mt-2 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold text-primary">
                                            {
                                                selectedProduct.name
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-muted">
                                            {
                                                selectedProduct.code
                                            }
                                        </p>
                                    </div>

                                    <span
                                        className="shrink-0 rounded-md bg-background px-2.5 py-1 text-xs font-medium text-muted">
                                        {
                                            selectedProduct.paymentTerm
                                        }
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Information */}
                        {!selectedClient ||
                        !selectedProduct ? (
                            <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-3">
                                <p className="text-xs text-muted">
                                    Select a client and
                                    product to continue.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-lg bg-primary/5 px-4 py-3">
                                <p className="text-xs text-primary">
                                    Client and product
                                    selected. Continue
                                    to enter the loan
                                    details.
                                </p>
                            </div>
                        )}
                    </Card>
                )}

                {/* =====================================================
                    STEP 2 - LOAN DETAILS
                ====================================================== */}
                {currentStep === 2 && (
                    <div className="space-y-4">

                        {/* Loan Amount */}
                        <Card className="p-4 sm:p-6">

                            <div className="mb-5 sm:mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Banknote className="h-5 w-5"/>
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-primary">
                                            Loan Amount
                                        </h2>

                                        <p className="mt-1 text-xs text-muted">
                                            Enter the principal amount for this disbursement.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md">
                                <label
                                    htmlFor="principalAmount"
                                    className="mb-1.5 block text-xs font-medium text-muted"
                                >
                                    Principal Amount{" "}
                                    <span className="text-error">
                                        *
                                    </span>
                                </label>

                                <div className="relative">
                                    <span
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                                        MWK
                                    </span>

                                    <Input
                                        id="principalAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.principalAmount
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "principalAmount",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        className="pl-14"
                                        placeholder="100000"
                                    />
                                </div>

                                {errors.principalAmount && (
                                    <p className="mt-1.5 text-xs text-error">
                                        {
                                            errors.principalAmount
                                        }
                                    </p>
                                )}

                                {principalAmount >
                                    0 && (
                                        <div className="mt-4 rounded-lg border border-primary/10 bg-primary/5 p-4">
                                            <div className="flex items-center justify-between gap-4">
                                            <span className="text-xs text-muted">
                                                Principal Amount
                                            </span>

                                                <span className="text-sm font-semibold text-primary">
                                                {formatCurrency(
                                                    principalAmount,
                                                )}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6">
                            <h2 className="mb-4 text-base font-semibold text-primary">Loan Tenure</h2>
                            <p className="mb-4 text-xs text-muted">Define the repayment period for this disbursement.</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="tenure" className="mb-1.5 block text-xs font-medium text-muted">Tenure</label>
                                    <Input id="tenure" type="number" min="1" value={form.tenure} onChange={(event) => updateField("tenure", event.target.value)} placeholder="e.g. 12" />
                                    {errors.tenure && <p className="mt-1 text-xs text-error">{errors.tenure}</p>}
                                </div>
                                <div>
                                    <label htmlFor="tenureUnits" className="mb-1.5 block text-xs font-medium text-muted">Tenure Units</label>
                                    <Select id="tenureUnits" value={form.tenureUnits} onChange={(event) => updateField("tenureUnits", event.target.value as FormData["tenureUnits"])}>
                                        <option value="days">Days</option><option value="weeks">Weeks</option><option value="fortnights">Fortnights</option><option value="months">Months</option><option value="years">Years</option>
                                    </Select>
                                    {errors.tenureUnits && <p className="mt-1 text-xs text-error">{errors.tenureUnits}</p>}
                                </div>
                            </div>
                        </Card>

                        {/* Dates */}
                        <Card className="p-4 sm:p-6">

                            <div className="mb-5 sm:mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CalendarDays className="h-5 w-5"/>
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-primary">
                                            Loan Dates
                                        </h2>

                                        <p className="mt-1 text-xs text-muted">
                                            Record the important dates for the loan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3 md:gap-5">

                                {/* Application Date */}
                                <div>
                                    <label
                                        htmlFor="applicationDate"
                                        className="mb-1.5 block text-xs font-medium text-muted"
                                    >
                                        Application Date{" "}
                                        <span className="text-error">
                                            *
                                        </span>
                                    </label>

                                    <Input
                                        id="applicationDate"
                                        type="date"
                                        value={
                                            form.applicationDate
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "applicationDate",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    {errors.applicationDate && (
                                        <p className="mt-1.5 text-xs text-error">
                                            {
                                                errors.applicationDate
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Approval Date */}
                                <div>
                                    <label
                                        htmlFor="approvalDate"
                                        className="mb-1.5 block text-xs font-medium text-muted"
                                    >
                                        Approval Date
                                    </label>

                                    <Input
                                        id="approvalDate"
                                        type="date"
                                        value={
                                            form.approvalDate
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "approvalDate",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    {errors.approvalDate && (
                                        <p className="mt-1.5 text-xs text-error">
                                            {
                                                errors.approvalDate
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Disbursement Date */}
                                <div>
                                    <label
                                        htmlFor="disbursementDate"
                                        className="mb-1.5 block text-xs font-medium text-muted"
                                    >
                                        Disbursement Date{" "}
                                        <span className="text-error">
                                            *
                                        </span>
                                    </label>

                                    <Input
                                        id="disbursementDate"
                                        type="date"
                                        value={
                                            form.disbursementDate
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            updateField(
                                                "disbursementDate",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                    />

                                    {errors.disbursementDate && (
                                        <p className="mt-1.5 text-xs text-error">
                                            {
                                                errors.disbursementDate
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Selected Loan Summary */}
                        <Card className="border-primary/10 bg-primary/5 p-4">

                            <p className="mb-4 text-xs font-semibold text-primary">
                                Loan Summary
                            </p>

                            <div className="grid gap-4 sm:grid-cols-3">

                                <div>
                                    <p className="text-xs text-muted">
                                        Client
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {selectedClient
                                            ? `${selectedClient.firstName} ${selectedClient.lastName}`
                                            : "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Product
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {
                                            selectedProduct?.name ??
                                            "-"
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Principal
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-primary">
                                        {principalAmount >
                                        0
                                            ? formatCurrency(
                                                principalAmount,
                                            )
                                            : "-"}
                                    </p>
                                </div>

                            </div>
                        </Card>
                    </div>
                )}

                {/* =====================================================
                    STEP 3 - CHARGES
                ====================================================== */}
                {currentStep === 3 && (
                    <Card className="overflow-hidden">

                        <div className="border-b border-border p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Calculator className="h-5 w-5"/>
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-primary">
                                        Product Charges
                                    </h2>

                                    <p className="mt-1 text-xs text-muted">
                                        Charges are automatically calculated from the selected product.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!form.productId ? (
                            <div className="p-8 text-center text-sm text-muted">
                                Select a product to load its charges.
                            </div>
                        ) : selectedProductCharges.length ===
                        0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-muted">
                                    This product does not currently have any active charges.
                                </p>

                                <p className="mt-1 text-xs text-muted">
                                    You can continue without product charges.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Charges Table */}
                                <div className="hidden sm:block">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b border-border bg-surface-low">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                                Charge
                                            </th>

                                            <th className="px-5 py-3 text-left text-xs font-semibold text-muted">
                                                Type
                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-semibold text-muted">
                                                Rate
                                            </th>

                                            <th className="px-5 py-3 text-right text-xs font-semibold text-muted">
                                                Amount
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody className="divide-y divide-border">
                                        {calculatedCharges.map(
                                            (
                                                charge,
                                            ) => (
                                                <tr
                                                    key={
                                                        charge.productChargeId
                                                    }
                                                >
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm font-medium text-foreground">
                                                            {
                                                                charge.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-muted">
                                                            {
                                                                charge.code
                                                            }
                                                        </p>

                                                        {charge.description && (
                                                            <p className="mt-1 text-xs text-muted">
                                                                {
                                                                    charge.description
                                                                }
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-muted">
                                                        {charge.type ===
                                                        "percentage"
                                                            ? "Percentage"
                                                            : "Fixed Amount"}
                                                    </td>

                                                    <td className="px-5 py-4 text-right text-sm text-foreground">
                                                        {charge.type ===
                                                        "percentage"
                                                            ? `${charge.rate}%`
                                                            : formatCurrency(
                                                                charge.rate,
                                                            )}
                                                    </td>

                                                    <td className="px-5 py-4 text-right text-sm font-semibold text-primary">
                                                        {formatCurrency(
                                                            charge.amount,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Charges */}
                                <div className="space-y-3 p-4 sm:hidden">
                                    {calculatedCharges.map(
                                        (
                                            charge,
                                        ) => (
                                            <div
                                                key={
                                                    charge.productChargeId
                                                }
                                                className="rounded-lg border border-border bg-background p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {
                                                                charge.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-muted">
                                                            {
                                                                charge.code
                                                            }
                                                        </p>
                                                    </div>

                                                    <span
                                                        className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                                                        {charge.type ===
                                                        "percentage"
                                                            ? `${charge.rate}%`
                                                            : "Fixed"}
                                                    </span>
                                                </div>

                                                {charge.description && (
                                                    <p className="mt-3 text-xs leading-5 text-muted">
                                                        {
                                                            charge.description
                                                        }
                                                    </p>
                                                )}

                                                <div
                                                    className="mt-4 flex items-center justify-between border-t border-border pt-3">
                                                    <span className="text-xs text-muted">
                                                        Charge Amount
                                                    </span>

                                                    <span className="text-sm font-semibold text-primary">
                                                        {formatCurrency(
                                                            charge.amount,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-border bg-surface-low p-4 sm:p-5">
                                    <div className="w-full sm:ml-auto sm:max-w-sm">

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-muted">
                                                Principal
                                            </span>

                                            <span className="font-medium text-foreground">
                                                {formatCurrency(
                                                    principalAmount,
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex justify-between gap-4 text-sm">
                                            <span className="text-muted">
                                                Total Charges
                                            </span>

                                            <span className="font-medium text-foreground">
                                                {formatCurrency(
                                                    totalCharges,
                                                )}
                                            </span>
                                        </div>

                                        <div
                                            className="mt-3 flex items-center justify-between gap-4 border-t border-border pt-3">
                                            <span className="font-semibold text-primary">
                                                Total Loan Amount
                                            </span>

                                            <span className="text-lg font-bold text-primary">
                                                {formatCurrency(
                                                    totalAmount,
                                                )}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                )}

                {/* =====================================================
                    STEP 4 - REVIEW
                ====================================================== */}
                {currentStep === 4 && (
                    <div className="space-y-4">

                        {/* Review Header */}
                        <Card className="border-primary/10 bg-primary/5 p-4 sm:p-6">
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                                    <ClipboardCheck className="h-5 w-5"/>
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-primary">
                                        Review Disbursement
                                    </h2>

                                    <p className="mt-1 text-xs text-muted">
                                        Review the information below before creating the disbursement.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Client & Product Review */}
                        <Card className="overflow-hidden">

                            <div className="border-b border-border p-4">
                                <h3 className="text-sm font-semibold text-primary">
                                    Client & Product
                                </h3>
                            </div>

                            <div className="grid gap-5 p-4 sm:grid-cols-2 md:grid-cols-4">

                                <div>
                                    <p className="text-xs text-muted">
                                        Client
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {selectedClient
                                            ? `${selectedClient.firstName} ${selectedClient.lastName}`
                                            : "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Client Number
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {
                                            selectedClient?.clientNumber ??
                                            "-"
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Product
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {
                                            selectedProduct?.name ??
                                            "-"
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Product Code
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {
                                            selectedProduct?.code ??
                                            "-"
                                        }
                                    </p>
                                </div>

                            </div>
                        </Card>

                        {/* Amount & Dates */}
                        <Card className="overflow-hidden">

                            <div className="border-b border-border p-4">
                                <h3 className="text-sm font-semibold text-primary">
                                    Loan Details
                                </h3>
                            </div>

                            <div className="grid gap-5 p-4 sm:grid-cols-2 md:grid-cols-4">

                                <div>
                                    <p className="text-xs text-muted">
                                        Principal Amount
                                    </p>

                                    <p className="mt-1 text-base font-bold text-primary">
                                        {formatCurrency(
                                            principalAmount,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Application Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {formatDate(
                                            form.applicationDate,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Approval Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {formatDate(
                                            form.approvalDate,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Disbursement Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {formatDate(
                                            form.disbursementDate,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Tenure
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {form.tenure || "-"} {form.tenure && form.tenureUnits}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted">
                                        Tenure Units
                                    </p>
                                    <p className="mt-1 text-sm font-medium capitalize text-foreground">
                                        {form.tenureUnits || "-"}
                                    </p>
                                </div>

                            </div>
                        </Card>

                        {/* Charges Review */}
                        <Card className="overflow-hidden">

                            <div className="border-b border-border p-4">
                                <h3 className="text-sm font-semibold text-primary">
                                    Charges
                                </h3>
                            </div>

                            {calculatedCharges.length ===
                            0 ? (
                                <div className="p-4">
                                    <p className="text-sm text-muted">
                                        No active charges are applied to this product.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {calculatedCharges.map(
                                        (
                                            charge,
                                        ) => (
                                            <div
                                                key={
                                                    charge.productChargeId
                                                }
                                                className="flex items-center justify-between gap-4 p-4"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {
                                                            charge.name
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-muted">
                                                        {
                                                            charge.code
                                                        }{" "}
                                                        ·{" "}
                                                        {charge.type ===
                                                        "percentage"
                                                            ? `${charge.rate}%`
                                                            : "Fixed Amount"}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-sm font-semibold text-primary">
                                                    {formatCurrency(
                                                        charge.amount,
                                                    )}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}

                            <div className="border-t border-border bg-surface-low p-4">

                                <div className="mx-auto w-full max-w-md space-y-3 sm:ml-auto">

                                    <div className="flex justify-between gap-4 text-sm">
                                        <span className="text-muted">
                                            Principal
                                        </span>

                                        <span className="font-medium text-foreground">
                                            {formatCurrency(
                                                principalAmount,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4 text-sm">
                                        <span className="text-muted">
                                            Total Charges
                                        </span>

                                        <span className="font-medium text-foreground">
                                            {formatCurrency(
                                                totalCharges,
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4 border-t border-border pt-3">
                                        <span className="font-semibold text-primary">
                                            Total Loan Amount
                                        </span>

                                        <span className="text-lg font-bold text-primary">
                                            {formatCurrency(
                                                totalAmount,
                                            )}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </Card>

                        {/* Notes */}
                        <Card className="p-4 sm:p-6">

                            <div className="mb-3">
                                <label
                                    htmlFor="notes"
                                    className="block text-xs font-medium text-muted"
                                >
                                    Notes
                                </label>
                            </div>

                            <Textarea
                                id="notes"
                                value={form.notes}
                                onChange={(event) =>
                                    updateField(
                                        "notes",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter any additional notes..."
                                rows={4}
                            />
                        </Card>

                        {/* Final Total */}
                        <Card className="border-primary bg-primary/5 p-4 sm:p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-muted">
                                        Total Disbursement Amount
                                    </p>

                                    <p className="mt-1 text-xs text-muted">
                                        Principal plus applicable charges
                                    </p>
                                </div>

                                <p className="text-xl font-bold text-primary sm:text-2xl">
                                    {formatCurrency(
                                        totalAmount,
                                    )}
                                </p>
                            </div>
                        </Card>
                    </div>
                )}

                {/* =====================================================
                    NAVIGATION
                ====================================================== */}
                <div
                    className="sticky bottom-0 z-20 -mx-1 border-t border-border bg-background/95 px-1 py-3 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                    <div className="flex items-center justify-between gap-3">

                        {/* Left Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                currentStep ===
                                1
                                    ? () =>
                                        router.push(
                                            "/disbursements",
                                        )
                                    : handleBack
                            }
                            disabled={saving}
                        >
                            {currentStep ===
                            1 ? (
                                <>
                                    <ArrowLeft className="mr-1.5 h-4 w-4"/>
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="mr-1.5 h-4 w-4"/>
                                    Back
                                </>
                            )}
                        </Button>

                        {/* Right Button */}
                        {currentStep <
                        steps.length ? (
                            <Button
                                type="button"
                                onClick={
                                    handleNext
                                }
                                disabled={
                                    saving
                                }
                            >
                                Continue
                                <ArrowRight className="ml-1.5 h-4 w-4"/>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={
                                    handleSubmit
                                }
                                disabled={
                                    saving
                                }
                            >
                                <Check className="mr-1.5 h-4 w-4"/>

                                {mode ===
                                "create"
                                    ? "Create Disbursement"
                                    : "Save Changes"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* =========================================================
                CONFIRMATION DIALOG
            ========================================================== */}
            <ConfirmDialog
                open={confirmOpen}
                title={
                    mode === "create"
                        ? "Create Disbursement?"
                        : "Save Disbursement Changes?"
                }
                description={
                    mode === "create"
                        ? `Create a disbursement of ${formatCurrency(
                            principalAmount,
                        )} for ${
                            selectedClient
                                ? `${selectedClient.firstName} ${selectedClient.lastName}`
                                : "the selected client"
                        }? Total loan amount including charges is ${formatCurrency(
                            totalAmount,
                        )}.`
                        : `Save the changes to this disbursement? The recorded charges will remain as a historical snapshot.`
                }
                confirmText={
                    mode === "create"
                        ? "Create Disbursement"
                        : "Save Changes"
                }
                cancelText="Review Again"
                variant="save"
                loading={saving}
                onConfirm={
                    handleConfirmSave
                }
                onCancel={() =>
                    setConfirmOpen(false)
                }
            />
        </>
    );
}
