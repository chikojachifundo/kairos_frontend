"use client";

import {useMemo, useState} from "react";
import {Info} from "lucide-react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {FormField} from "@/components/ui/form-field";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {
    useFeedback,
} from "@/components/ui/feedback-bar";

import type {ProductCharge} from "@/types/product-charge";
import type {ProductChargeRecord} from "@/types/product-charge-record";

interface ProductChargeRecordFormProps {
    mode: "create" | "edit";
    productId: number;
    record?: ProductChargeRecord;
    productName: string;
    charges: ProductCharge[];
    existingRecords: ProductChargeRecord[];
}

interface FormData {
    productChargeId: number | "";
    value: string;
    status: "active" | "inactive";
    description: string;
}

export function ProductChargeRecordForm({
                                            mode,
                                            productId,
                                            record,
                                            productName,
                                            charges,
                                            existingRecords,
                                        }: ProductChargeRecordFormProps) {
    const router = useRouter();
    const {showFeedback} = useFeedback();

    const [form, setForm] = useState<FormData>({
        productChargeId: record?.productChargeId ?? "",
        value:
            record?.value !== undefined
                ? String(record.value)
                : "",
        status: record?.status ?? "active",
        description: record?.description ?? "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof FormData, string>>
    >({});

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const selectedCharge = useMemo(() => {
        if (!form.productChargeId) {
            return undefined;
        }

        return charges.find(
            (charge) => charge.id === Number(form.productChargeId),
        );
    }, [form.productChargeId, charges]);

    const availableCharges = useMemo(() => {
        return charges.filter((charge) => {
            if (mode === "edit" && record) {
                if (charge.id === record.productChargeId) {
                    return true;
                }
            }

            return !existingRecords.some(
                (existing) =>
                    existing.productChargeId === charge.id &&
                    existing.id !== record?.id,
            );
        });
    }, [charges, existingRecords, mode, record]);

    function validate() {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!form.productChargeId) {
            newErrors.productChargeId = "Please select a charge.";
        }

        if (!form.value.trim()) {
            newErrors.value = "Value is required.";
        } else if (Number.isNaN(Number(form.value))) {
            newErrors.value = "Value must be a valid number.";
        } else if (Number(form.value) <= 0) {
            newErrors.value = "Value must be greater than zero.";
        }

        if (!form.status) {
            newErrors.status = "Please select a status.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSave() {
        if (!validate()) {
            return;
        }

        setConfirmOpen(true);
    }

    async function confirmSave() {
        setSaving(true);

        await new Promise((resolve) =>
            setTimeout(resolve, 700),
        );

        showFeedback(
            "success",
            "",
            mode === "create"
                ? `${selectedCharge?.name} has been added to ${productName}.`
                : `${selectedCharge?.name} has been updated successfully.`,
        );

        setSaving(false);
        setConfirmOpen(false);

        router.push(`/products/${productId}/charges`);
    }

    return (
        <>
            <div className="space-y-6">
                {/* Product */}
                <div className="rounded-xl border border-border bg-surface p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-foreground">
                            Product
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            The product this charge will apply to.
                        </p>
                    </div>

                    <div className="rounded-lg border border-border bg-surface-low px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Loan Product
                        </p>

                        <p className="mt-1 font-semibold text-foreground">
                            {productName}
                        </p>
                    </div>
                </div>

                {/* Charge configuration */}
                <div className="rounded-xl border border-border bg-surface p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-foreground">
                            Charge Configuration
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            Select the charge and configure the value that
                            applies to this product.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            label="Charge"
                            required
                            error={errors.productChargeId}
                        >
                            <Select
                                id="productChargeId"
                                value={form.productChargeId}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        productChargeId:
                                            event.target.value
                                                ? Number(
                                                    event.target.value,
                                                )
                                                : "",
                                    }))
                                }
                            >
                                <option value="">
                                    Select charge
                                </option>

                                {availableCharges.map((charge) => (
                                    <option
                                        key={charge.id}
                                        value={charge.id}
                                    >
                                        {charge.name} ({charge.code})
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField
                            label="Value"
                            required
                            error={errors.value}
                            hint={
                                selectedCharge
                                    ? selectedCharge.type ===
                                    "percentage"
                                        ? "Enter the percentage value, e.g. 15 for 15%."
                                        : "Enter the fixed amount in Malawi Kwacha."
                                    : undefined
                            }
                        >
                            <div className="relative">
                                <input
                                    id="value"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.value}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            value: event.target.value,
                                        }))
                                    }
                                    placeholder={
                                        selectedCharge?.type ===
                                        "percentage"
                                            ? "e.g. 15"
                                            : "e.g. 5000"
                                    }
                                    className="h-10 w-full rounded-lg border border-border bg-surface px-3 pr-16 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />

                                {selectedCharge && (
                                    <span
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted">
                                        {selectedCharge.type ===
                                        "percentage"
                                            ? "%"
                                            : "MWK"}
                                    </span>
                                )}
                            </div>
                        </FormField>

                        <FormField
                            label="Status"
                            required
                            error={errors.status}
                        >
                            <Select
                                id="status"
                                value={form.status}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        status: event.target.value as
                                            | "active"
                                            | "inactive",
                                    }))
                                }
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </Select>
                        </FormField>
                    </div>

                    {selectedCharge && (
                        <div className="mt-5 flex gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary"/>

                            <div>
                                <p className="text-sm font-medium text-primary">
                                    {selectedCharge.name}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-muted">
                                    This charge is configured as a{" "}
                                    {selectedCharge.type ===
                                    "percentage"
                                        ? "percentage"
                                        : "fixed amount"}
                                    . The value will be stored as a number
                                    and displayed using the appropriate
                                    unit.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="rounded-xl border border-border bg-surface p-6">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold text-foreground">
                            Additional Information
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            Add any notes specific to this charge
                            configuration.
                        </p>
                    </div>

                    <FormField
                        label="Description"
                        hint="Optional"
                    >
                        <Textarea
                            id="description"
                            rows={4}
                            value={form.description}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                            placeholder="Enter a description..."
                        />
                    </FormField>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            router.push(
                                `/products/${productId}/charges`,
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSave}
                    >
                        {mode === "create"
                            ? "Add Product Charge"
                            : "Save Changes"}
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title={
                    mode === "create"
                        ? "Add Product Charge?"
                        : "Save Changes?"
                }
                description={
                    mode === "create"
                        ? `Add ${selectedCharge?.name ?? "this charge"} to ${productName}?`
                        : `Save the changes made to ${selectedCharge?.name ?? "this charge"}?`
                }
                confirmText={
                    mode === "create"
                        ? "Add Charge"
                        : "Save Changes"
                }
                cancelText="Cancel"
                variant="save"
                loading={saving}
                onConfirm={confirmSave}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}