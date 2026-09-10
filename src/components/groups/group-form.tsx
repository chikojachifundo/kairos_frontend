"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFeedback } from "@/components/ui/feedback-bar";

import type {
    GroupFormData,
    GroupStatus,
} from "@/types/group";
import {groupService} from "@/services/group-service";


interface Branch {
    id: number;
    name: string;
}

interface GroupFormProps {
    mode?: "create" | "edit";
    groupId?: number;
    branches: Branch[];
    initialData?: Partial<GroupFormData>;
}

const defaultData: GroupFormData = {
    title: "",
    chair: "",
    cellphone: "",
    viceChair: "",
    viceChairCell: "",
    description: "",
    status: "active",
    branchId: "",
};

export function GroupForm({
                              mode = "create",
                              groupId,
                              branches,
                              initialData,
                          }: GroupFormProps) {
    const router = useRouter();
    const { showFeedback } = useFeedback();

    const isEdit = mode === "edit";

    const [formData, setFormData] = useState<GroupFormData>({
        ...defaultData,
        ...initialData,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof GroupFormData, string>>
    >({});

    const [showSaveConfirmation, setShowSaveConfirmation] =
        useState(false);

    const [saving, setSaving] = useState(false);


    function updateField<K extends keyof GroupFormData>(
        field: K,
        value: GroupFormData[K],
    ) {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    function validate(): boolean {
        const newErrors: Partial<
            Record<keyof GroupFormData, string>
        > = {};

        if (!formData.title.trim()) {
            newErrors.title = "Group title is required.";
        }

        if (!formData.branchId) {
            newErrors.branchId = "Please select a branch.";
        }

        if (!formData.chair.trim()) {
            newErrors.chair = "Chairperson name is required.";
        }

        if (!formData.cellphone.trim()) {
            newErrors.cellphone =
                "Chairperson cellphone is required.";
        }

        if (!formData.viceChair.trim()) {
            newErrors.viceChair =
                "Vice chairperson name is required.";
        }

        if (!formData.viceChairCell.trim()) {
            newErrors.viceChairCell =
                "Vice chairperson cellphone is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setShowSaveConfirmation(true);
    }

    async function confirmSave() {
        setSaving(true);

        try {
            const payload = {
                title: formData.title.trim(),
                chair: formData.chair.trim(),
                cellphone: formData.cellphone.trim(),
                viceChair: formData.viceChair.trim(),
                viceChairCell: formData.viceChairCell.trim(),
                description: formData.description.trim(),
                status: formData.status,
                branchId: formData.branchId,
            };

            if (isEdit && groupId) {
                await groupService.updateGroup(groupId, payload);

                setShowSaveConfirmation(false);

                showFeedback(
                    "success",
                    "Group updated successfully",
                    `${formData.title} has been updated successfully.`,
                );

                router.push(`/groups/${groupId}`);
            } else {
                await groupService.createGroup(payload);

                setShowSaveConfirmation(false);

                showFeedback(
                    "success",
                    "Group created successfully",
                    `${formData.title} has been added successfully.`,
                );

                router.push("/groups");
            }
        } catch (error: any) {
            console.error("Failed to save group:", error);

            const message =
                error?.response?.data?.message ||
                "An error occurred while saving the group. Please try again.";

            showFeedback(
                "error",
                "Unable to save group",
                message,
            );
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        if (isEdit && groupId) {
            router.push(`/groups/${groupId}`);
        } else {
            router.push("/groups");
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Group Information */}
                <Card>
                    <div className="border-b border-border px-5 py-4">
                        <h2 className="text-sm font-semibold text-foreground">
                            Group Information
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Enter the basic information for this client
                            group.
                        </p>
                    </div>

                    <div className="grid gap-4 p-5 md:grid-cols-2">
                        <FormField
                            label="Group Title"
                            htmlFor="title"
                            required
                            error={errors.title}
                        >
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(event) =>
                                    updateField("title", event.target.value)
                                }
                                placeholder="e.g. Northside Traders"
                            />
                        </FormField>

                        <FormField
                            label="Branch"
                            htmlFor="branchId"
                            required
                            error={errors.branchId}
                        >
                            <Select
                                id="branchId"
                                value={String(formData.branchId)}
                                onChange={(event) =>
                                    updateField(
                                        "branchId",
                                        event.target.value
                                            ? Number(event.target.value)
                                            : "",
                                    )
                                }
                            >
                                <option value="">
                                    Select branch
                                </option>

                                {branches.map((branch) => (
                                    <option
                                        key={branch.id}
                                        value={branch.id}
                                    >
                                        {branch.name}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField
                            label="Status"
                            htmlFor="status"
                            required
                        >
                            <Select
                                id="status"
                                value={formData.status}
                                onChange={(event) =>
                                    updateField(
                                        "status",
                                        event.target.value as GroupStatus,
                                    )
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

                        <div className="md:col-span-2">
                            <FormField
                                label="Description"
                                htmlFor="description"
                                hint="Optional description of the group."
                            >
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(event) =>
                                        updateField(
                                            "description",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Enter a brief description of the group..."
                                    rows={4}
                                />
                            </FormField>
                        </div>
                    </div>
                </Card>

                {/* Leadership */}
                <Card>
                    <div className="border-b border-border px-5 py-4">
                        <h2 className="text-sm font-semibold text-foreground">
                            Group Leadership
                        </h2>

                        <p className="mt-1 text-xs text-muted">
                            Enter the group's chairperson and vice
                            chairperson details.
                        </p>
                    </div>

                    <div className="grid gap-4 p-5 md:grid-cols-2">
                        <FormField
                            label="Chairperson"
                            htmlFor="chair"
                            required
                            error={errors.chair}
                        >
                            <Input
                                id="chair"
                                value={formData.chair}
                                onChange={(event) =>
                                    updateField(
                                        "chair",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter chairperson name"
                            />
                        </FormField>

                        <FormField
                            label="Chairperson Cellphone"
                            htmlFor="cellphone"
                            required
                            error={errors.cellphone}
                        >
                            <Input
                                id="cellphone"
                                type="tel"
                                value={formData.cellphone}
                                onChange={(event) =>
                                    updateField(
                                        "cellphone",
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. 0999 123 456"
                            />
                        </FormField>

                        <FormField
                            label="Vice Chairperson"
                            htmlFor="viceChair"
                            required
                            error={errors.viceChair}
                        >
                            <Input
                                id="viceChair"
                                value={formData.viceChair}
                                onChange={(event) =>
                                    updateField(
                                        "viceChair",
                                        event.target.value,
                                    )
                                }
                                placeholder="Enter vice chairperson name"
                            />
                        </FormField>

                        <FormField
                            label="Vice Chairperson Cellphone"
                            htmlFor="viceChairCell"
                            required
                            error={errors.viceChairCell}
                        >
                            <Input
                                id="viceChairCell"
                                type="tel"
                                value={formData.viceChairCell}
                                onChange={(event) =>
                                    updateField(
                                        "viceChairCell",
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. 0888 123 456"
                            />
                        </FormField>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                    <Button type="submit">
                        <Save className="h-4 w-4" />

                        {isEdit ? "Save Changes" : "Save Group"}
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showSaveConfirmation}
                title={
                    isEdit
                        ? "Save Changes?"
                        : "Save Group?"
                }
                description={
                    isEdit
                        ? `Are you sure you want to save the changes made to ${formData.title}?`
                        : `Are you sure you want to create the group ${formData.title}?`
                }
                confirmText={
                    isEdit
                        ? "Yes, Save Changes"
                        : "Yes, Save Group"
                }
                cancelText="Review Again"
                variant="save"
                loading={saving}
                onConfirm={confirmSave}
                onCancel={() =>
                    setShowSaveConfirmation(false)
                }
            />
        </>
    );
}