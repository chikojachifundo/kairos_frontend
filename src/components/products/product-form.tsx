"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Save, X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {useFeedback} from "@/components/ui/feedback-bar";

import type {
    PaymentTerm,
    Product,
    ProductFormData,
    ProductStatus,
} from "@/types/product";

interface ProductFormProps {
    mode: "create" | "edit";
    product?: Product;
}

interface FormErrors {
    code?: string;
    name?: string;
    paymentTerm?: string;
    status?: string;
    description?: string;
}

const paymentTermOptions = [
    {value: "daily", label: "Daily"},
    {value: "weekly", label: "Weekly"},
    {value: "biweekly", label: "Bi-Weekly"},
    {value: "monthly", label: "Monthly"},
    {value: "quarterly", label: "Quarterly"},
    {value: "annually", label: "Annually"},
];

const statusOptions = [
    {value: "active", label: "Active"},
    {value: "inactive", label: "Inactive"},
];

export function ProductForm({
                                mode,
                                product,
                            }: ProductFormProps) {
    const router = useRouter();
    const {showFeedback} = useFeedback();

    const [form, setForm] = useState<ProductFormData>({
        code: product?.code ?? "",
        name: product?.name ?? "",
        paymentTerm: product?.paymentTerm ?? "",
        status: product?.status ?? "active",
        description: product?.description ?? "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const isEdit = mode === "edit";

    function updateField<K extends keyof ProductFormData>(
        field: K,
        value: ProductFormData[K],
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
            newErrors.code = "Product code is required.";
        } else if (form.code.trim().length < 2) {
            newErrors.code = "Product code must be at least 2 characters.";
        }

        if (!form.name.trim()) {
            newErrors.name = "Product name is required.";
        } else if (form.name.trim().length < 3) {
            newErrors.name = "Product name must be at least 3 characters.";
        }

        if (!form.paymentTerm) {
            newErrors.paymentTerm = "Please select a payment term.";
        }

        if (!form.status) {
            newErrors.status = "Please select a status.";
        }

        if (form.description && form.description.length > 500) {
            newErrors.description =
                "Description cannot exceed 500 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) {
            showFeedback(
                "error",
                "Invalid Values",
                "Please correct the errors before continuing."
            );

            return;
        }

        setShowConfirmDialog(true);
    }

    function confirmSave() {
        setLoading(true);

        // Simulate API request.
        setTimeout(() => {
            setLoading(false);
            setShowConfirmDialog(false);

            if (isEdit) {
                showFeedback(
                    "success",
                    "Update successful",
                    `${form.name} has been updated successfully.`,
                );
            } else {
                showFeedback(
                    "success",
                    "Registration successful",
                    `${form.name} has been created successfully.`,
                );
            }


            router.push("/products");
        }, 800);
    }

    function handleCancel() {
        router.push("/products");
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Information */}
                <div className="rounded-xl border border-border bg-surface">
                    <div className="border-b border-border px-6 py-4">
                        <h2 className="text-sm font-semibold text-foreground">
                            Product Information
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Enter the basic information for this loan product.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="code"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Product Code
                                <span className="ml-1 text-error">*</span>
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
                                placeholder="e.g. PL001"
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

                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Product Name
                                <span className="ml-1 text-error">*</span>
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
                                placeholder="e.g. Personal Loan"
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

                        <div>
                            <label
                                htmlFor="paymentTerm"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Payment Term
                                <span className="ml-1 text-error">*</span>
                            </label>

                            <Select
                                id="paymentTerm"
                                value={form.paymentTerm}
                                onChange={(event) =>
                                    updateField(
                                        "paymentTerm",
                                        event.target.value as PaymentTerm,
                                    )
                                }
                            >
                                <option value="">Select payment term</option>

                                {paymentTermOptions.map((option) => (
                                    <option
                                        value={option.value}
                                        key={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Select>

                            {errors.paymentTerm && (
                                <p className="mt-1 text-xs text-error">
                                    {errors.paymentTerm}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Status
                                <span className="ml-1 text-error">*</span>
                            </label>

                            <Select
                                id="status"
                                value={form.status}
                                onChange={(event) =>
                                    updateField(
                                        "status",
                                        event.target.value as ProductStatus,
                                    )
                                }
                            >
                                <option value="">Select status</option>

                                {statusOptions.map((option) => (
                                    <option
                                        value={option.value}
                                        key={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Select>

                            {errors.status && (
                                <p className="mt-1 text-xs text-error">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Description
                            </label>

                            <Textarea
                                id="description"
                                value={form.description ?? ""}
                                onChange={(event) =>
                                    updateField(
                                        "description",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter a brief description of this loan product..."
                                rows={4}
                                className={
                                    errors.description
                                        ? "border-error focus:ring-error/20"
                                        : ""
                                }
                            />

                            <div className="mt-1 flex items-center justify-between">
                                {errors.description ? (
                                    <p className="text-xs text-error">
                                        {errors.description}
                                    </p>
                                ) : (
                                    <span/>
                                )}

                                <span className="text-xs text-muted">
                                    {(form.description ?? "").length}/500
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charges Information */}
                <div className="rounded-xl border border-border bg-surface">
                    <div className="border-b border-border px-6 py-4">
                        <h2 className="text-sm font-semibold text-foreground">
                            Product Charges
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Product charges are managed separately after the
                            product has been created.
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="rounded-lg bg-surface-low px-4 py-3">
                            <p className="text-sm font-medium text-foreground">
                                Manage charges after saving
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted">
                                Save this product first, then use{" "}
                                <span className="font-medium text-primary">
                                    Manage Charges
                                </span>{" "}
                                from the Products list to assign interest,
                                collection fees, administration fees,
                                insurance and other applicable charges.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
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
                        {isEdit ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirmDialog}
                title={isEdit ? "Update Product?" : "Create Product?"}
                description={
                    isEdit
                        ? `Are you sure you want to update ${form.name}?`
                        : `Are you sure you want to create ${form.name}?`
                }
                confirmText={isEdit ? "Update Product" : "Create Product"}
                cancelText="Cancel"
                variant="save"
                loading={loading}
                onConfirm={confirmSave}
                onCancel={() => setShowConfirmDialog(false)}
            />
        </>
    );
}

