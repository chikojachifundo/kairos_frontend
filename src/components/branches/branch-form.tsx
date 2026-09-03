"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft, Save} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {FormField} from "@/components/ui/form-field";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";

import type {BranchFormData} from "@/types/branch";

interface BranchFormProps {
    mode?: "create" | "edit";
    branchId?: number;
    initialData?: Partial<BranchFormData>;
}

type FormErrors = Partial<Record<keyof BranchFormData, string>>;

const defaultFormData: BranchFormData = {
    branchCode: "",
    name: "",
    type: "",
    status: "active",
    phone: "",
    email: "",
    address: "",
    city: "",
    region: "",
    manager: "",
    openingDate: "",
    notes: "",
};

export function BranchForm({
                               mode = "create",
                               initialData,
                               branchId,
                           }: BranchFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<BranchFormData>({
        ...defaultFormData,
        ...initialData,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [saving, setSaving] = useState(false);

    const isEdit = mode === "edit";

    function updateField<K extends keyof BranchFormData>(
        field: K,
        value: BranchFormData[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    function validate(): boolean {
        const newErrors: FormErrors = {};

        if (!form.branchCode.trim()) {
            newErrors.branchCode = "Branch code is required.";
        }

        if (!form.name.trim()) {
            newErrors.name = "Branch name is required.";
        }

        if (!form.type) {
            newErrors.type = "Branch type is required.";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!form.address.trim()) {
            newErrors.address = "Address is required.";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required.";
        }

        if (!form.region.trim()) {
            newErrors.region = "Region is required.";
        }

        if (!form.manager.trim()) {
            newErrors.manager = "Branch manager is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setShowConfirmation(true);
    }

    async function confirmSave() {
        setSaving(true);

        try {
            // API call will be added here later.
            await new Promise((resolve) => setTimeout(resolve, 700));

            setShowConfirmation(false);

            // router.push(isEdit ? `/branches/${initialData?.branchCode}` : "/branches");
            if (isEdit && branchId) {
                router.push(`/branches/${branchId}`);
            } else {
                router.push("/branches");
            }
        } finally {

            setSaving(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Branch Information */}
                <Card className="p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">
                            Branch Information
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                            Basic information about the branch.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="Branch Code"
                            htmlFor="branchCode"
                            required
                            error={errors.branchCode}
                            hint="A unique code used to identify the branch."
                        >
                            <Input
                                id="branchCode"
                                value={form.branchCode}
                                onChange={(event) =>
                                    updateField("branchCode", event.target.value.toUpperCase())
                                }
                                placeholder="e.g. BR-001"
                            />
                        </FormField>

                        <FormField
                            label="Branch Name"
                            htmlFor="name"
                            required
                            error={errors.name}
                        >
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(event) =>
                                    updateField("name", event.target.value)
                                }
                                placeholder="e.g. Blantyre Branch"
                            />
                        </FormField>

                        <FormField
                            label="Branch Type"
                            htmlFor="type"
                            required
                            error={errors.type}
                        >
                            <Select
                                id="type"
                                value={form.type}
                                onChange={(event) =>
                                    updateField(
                                        "type",
                                        event.target.value as BranchFormData["type"],
                                    )
                                }
                            >
                                <option value="">Select branch type</option>
                                <option value="head_office">Head Office</option>
                                <option value="regional">Regional</option>
                                <option value="branch">Branch</option>
                                <option value="satellite">Satellite</option>
                            </Select>
                        </FormField>

                        <FormField
                            label="Status"
                            htmlFor="status"
                            required
                        >
                            <Select
                                id="status"
                                value={form.status}
                                onChange={(event) =>
                                    updateField(
                                        "status",
                                        event.target.value as BranchFormData["status"],
                                    )
                                }
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Select>
                        </FormField>
                    </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">
                            Contact Information
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                            Contact details for the branch.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="Phone Number"
                            htmlFor="phone"
                            required
                            error={errors.phone}
                        >
                            <Input
                                id="phone"
                                type="tel"
                                value={form.phone}
                                onChange={(event) =>
                                    updateField("phone", event.target.value)
                                }
                                placeholder="e.g. +265 888 123 456"
                            />
                        </FormField>

                        <FormField
                            label="Email Address"
                            htmlFor="email"
                            required
                            error={errors.email}
                        >
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    updateField("email", event.target.value)
                                }
                                placeholder="e.g. blantyre@company.com"
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Location */}
                <Card className="p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">
                            Location
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                            Physical location of the branch.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <FormField
                                label="Physical Address"
                                htmlFor="address"
                                required
                                error={errors.address}
                            >
                                <Textarea
                                    id="address"
                                    value={form.address}
                                    onChange={(event) =>
                                        updateField("address", event.target.value)
                                    }
                                    placeholder="Enter the physical address"
                                    rows={3}
                                />
                            </FormField>
                        </div>

                        <FormField
                            label="City / Town"
                            htmlFor="city"
                            required
                            error={errors.city}
                        >
                            <Input
                                id="city"
                                value={form.city}
                                onChange={(event) =>
                                    updateField("city", event.target.value)
                                }
                                placeholder="e.g. Blantyre"
                            />
                        </FormField>

                        <FormField
                            label="Region"
                            htmlFor="region"
                            required
                            error={errors.region}
                        >
                            <Input
                                id="region"
                                value={form.region}
                                onChange={(event) =>
                                    updateField("region", event.target.value)
                                }
                                placeholder="e.g. Southern Region"
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Management */}
                <Card className="p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">
                            Management
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                            Branch management information.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="Branch Manager"
                            htmlFor="manager"
                            required
                            error={errors.manager}
                        >
                            <Input
                                id="manager"
                                value={form.manager}
                                onChange={(event) =>
                                    updateField("manager", event.target.value)
                                }
                                placeholder="Enter branch manager name"
                            />
                        </FormField>

                        <FormField
                            label="Opening Date"
                            htmlFor="openingDate"
                        >
                            <Input
                                id="openingDate"
                                type="date"
                                value={form.openingDate}
                                onChange={(event) =>
                                    updateField("openingDate", event.target.value)
                                }
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Additional Information */}
                <Card className="p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">
                            Additional Information
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                            Optional notes about the branch.
                        </p>
                    </div>

                    <FormField
                        label="Notes"
                        htmlFor="notes"
                    >
                        <Textarea
                            id="notes"
                            value={form.notes}
                            onChange={(event) =>
                                updateField("notes", event.target.value)
                            }
                            placeholder="Enter any additional information..."
                            rows={4}
                        />
                    </FormField>
                </Card>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/branches")}
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        Cancel
                    </Button>

                    <Button type="submit">
                        <Save className="h-4 w-4"/>
                        {isEdit ? "Update Branch" : "Save Branch"}
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirmation}
                title={isEdit ? "Update Branch?" : "Save Branch?"}
                description={
                    form.name
                        ? isEdit
                            ? `Are you sure you want to update ${form.name}?`
                            : `Are you sure you want to save ${form.name} as a new branch?`
                        : ""
                }
                confirmText={isEdit ? "Yes, Update Branch" : "Yes, Save Branch"}
                cancelText="Review Again"
                variant="save"
                loading={saving}
                onConfirm={confirmSave}
                onCancel={() => setShowConfirmation(false)}
            />
        </>
    );
}

