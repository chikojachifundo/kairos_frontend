"use client";

import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import {Save, X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {useFeedback} from "@/components/ui/feedback-bar";
import {ChargeType, ProductCharge, Status} from "@/types/product-charge";
import {productChargeService} from "@/services/product-charge-service";


interface ProductChargeFormProps {
    mode: "create" | "edit";
    charge?: ProductCharge;
}

interface FormData {
    code: string;
    name: string;
    type: ChargeType | "";
    status: Status;
    description: string;
}

interface FormErrors {
    code?: string;
    name?: string;
    type?: string;
    status?: string;
    description?: string;
}

const chargeTypeOptions = [
    {
        value: "percentage",
        label: "Percentage",
    },
    {
        value: "fixed-amount",
        label: "Fixed Amount",
    },
];

const statusOptions = [
    {
        value: "active",
        label: "Active",
    },
    {
        value: "inactive",
        label: "Inactive",
    },
];

export function ProductChargeForm({
                                      mode,
                                      charge,
                                  }: ProductChargeFormProps) {
    const router = useRouter();
    const {showFeedback} = useFeedback();

    const isEdit = mode === "edit";

    const [form, setForm] = useState<FormData>({
        code: charge?.code ?? "",
        name: charge?.name ?? "",
        type: charge?.type ?? "",
        status: charge?.status ?? "active",
        description: charge?.description ?? "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    function updateField<K extends keyof FormData>(
        field: K,
        value: FormData[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        if (errors[field as keyof FormErrors]) {
            setErrors((current) => ({
                ...current,
                [field]: undefined,
            }));
        }
    }

    function validate(): boolean {
        const newErrors: FormErrors = {};

        if (!form.code.trim()) {
            newErrors.code = "Charge code is required.";
        } else if (form.code.trim().length < 2) {
            newErrors.code =
                "Charge code must be at least 2 characters.";
        }

        if (!form.name.trim()) {
            newErrors.name = "Charge name is required.";
        } else if (form.name.trim().length < 3) {
            newErrors.name =
                "Charge name must be at least 3 characters.";
        }

        if (!form.type) {
            newErrors.type = "Please select a charge type.";
        }

        if (!form.status) {
            newErrors.status = "Please select a status.";
        }

        if (form.description.length > 500) {
            newErrors.description =
                "Description cannot exceed 500 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!validate()) {
            showFeedback(
                "error",
                "Validation failed",
                "Please correct the errors before continuing.",
            );

            return;
        }

        setShowConfirmDialog(true);
    }

    async function confirmSave() {
        setLoading(true);

        try {
            if (!form.type) return;

            const payload = {
                code: form.code.trim(),
                name: form.name.trim(),
                type: form.type,
                status: form.status,
                description: form.description.trim() || undefined,
            };

            if (isEdit) {
                if (!charge) throw new Error("Charge information is missing.");
                await productChargeService.updateProductCharge(charge.id, payload);
            } else {
                await productChargeService.createProductCharge(payload);
            }

            setShowConfirmDialog(false);

            showFeedback(
                "success",
                "",
                isEdit
                    ? `${form.name} has been updated successfully.`
                    : `${form.name} has been created successfully.`,
            );

            router.push("/products");
        } catch (error: unknown) {
            console.error("Failed to save product charge:", error);
            const message = axios.isAxiosError<{message?: string}>(error)
                ? error.response?.data?.message || "Please try again."
                : error instanceof Error ? error.message : "Please try again.";
            showFeedback("error", isEdit ? "Unable to update charge" : "Unable to create charge", message);
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        router.push("/products");
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Charge Information */}
                <div className="rounded-xl border border-border bg-surface">
                    <div className="border-b border-border px-6 py-4">
                        <h2 className="text-sm font-semibold text-foreground">
                            Charge Information
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Define a charge that can be assigned to
                            loan products.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        {/* Code */}
                        <div>
                            <label
                                htmlFor="code"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Charge Code
                                <span className="ml-1 text-error">
                                    *
                                </span>
                            </label>

                            <Input
                                id="code"
                                value={form.code}
                                onChange={(event) =>
                                    updateField(
                                        "code",
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="e.g. INT"
                                className={
                                    errors.code
                                        ? "border-error focus:ring-error/20"
                                        : ""
                                }
                            />

                            {errors.code && (
                                <p className="mt-1 text-xs text-error">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Charge Name
                                <span className="ml-1 text-error">
                                    *
                                </span>
                            </label>

                            <Input
                                id="name"
                                value={form.name}
                                onChange={(event) =>
                                    updateField(
                                        "name",
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. Interest"
                                className={
                                    errors.name
                                        ? "border-error focus:ring-error/20"
                                        : ""
                                }
                            />

                            {errors.name && (
                                <p className="mt-1 text-xs text-error">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label
                                htmlFor="type"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Charge Type
                                <span className="ml-1 text-error">
                                    *
                                </span>
                            </label>

                            <Select
                                id="type"
                                value={form.type}
                                onChange={(event) =>
                                    updateField(
                                        "type",
                                        event.target.value as ChargeType,
                                    )
                                }
                            >
                                <option value="">
                                    Select charge type
                                </option>

                                {chargeTypeOptions.map(
                                    (option) => (
                                        <option
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </Select>

                            {errors.type && (
                                <p className="mt-1 text-xs text-error">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Status
                                <span className="ml-1 text-error">
                                    *
                                </span>
                            </label>

                            <Select
                                id="status"
                                value={form.status}
                                onChange={(event) =>
                                    updateField(
                                        "status",
                                        event.target.value as Status,
                                    )
                                }
                            >
                                {statusOptions.map(
                                    (option) => (
                                        <option
                                            value={option.value}
                                            key={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </Select>

                            {errors.status && (
                                <p className="mt-1 text-xs text-error">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Description
                            </label>

                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(event) =>
                                    updateField(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                placeholder="Describe how this charge is applied..."
                                rows={4}
                                className={
                                    errors.description
                                        ? "border-error focus:ring-error/20"
                                        : ""
                                }
                            />

                            <div className="mt-1 flex justify-between">
                                {errors.description ? (
                                    <p className="text-xs text-error">
                                        {errors.description}
                                    </p>
                                ) : (
                                    <span/>
                                )}

                                <span className="text-xs text-muted">
                                    {form.description.length}/500
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charge Type Explanation */}
                <div className="rounded-xl border border-border bg-surface">
                    <div className="p-6">
                        <h2 className="text-sm font-semibold text-foreground">
                            Charge Type
                        </h2>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-surface-low p-4">
                                <p className="text-sm font-medium text-foreground">
                                    Percentage
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted">
                                    Used when the charge is calculated
                                    as a percentage of the applicable
                                    loan amount or balance.
                                </p>

                                <p className="mt-2 text-xs font-medium text-primary">
                                    Example: 15%
                                </p>
                            </div>

                            <div className="rounded-lg bg-surface-low p-4">
                                <p className="text-sm font-medium text-foreground">
                                    Fixed Amount
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted">
                                    Used when the charge has a fixed
                                    monetary value.
                                </p>

                                <p className="mt-2 text-xs font-medium text-primary">
                                    Example: MK 5,000
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        <X className="h-4 w-4"/>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        <Save className="h-4 w-4"/>
                        {isEdit
                            ? "Update Charge"
                            : "Create Charge"}
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirmDialog}
                title={
                    isEdit
                        ? "Update Product Charge?"
                        : "Create Product Charge?"
                }
                description={
                    isEdit
                        ? `Are you sure you want to update ${form.name}?`
                        : `Are you sure you want to create ${form.name}?`
                }
                confirmText={
                    isEdit
                        ? "Update Charge"
                        : "Create Charge"
                }
                cancelText="Cancel"
                variant="save"
                loading={loading}
                onConfirm={confirmSave}
                onCancel={() =>
                    setShowConfirmDialog(false)
                }
            />
        </>
    );
}
