"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Save, X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {FormField} from "@/components/ui/form-field";
import {useFeedback} from "@/components/ui/feedback-bar";

import type {
    Client,
    ClientFormData,
} from "@/types/client";

import {branches} from "@/app/(dashboard)/groups/mock-data";
import {mockGroups} from "@/app/(dashboard)/groups/mock-data";
import {Branch} from "@/types/branch";
import {Group} from "@/types/group";
import {branchService} from "@/services/branch-service";
import {groupService} from "@/services/group-service";
import {clientService} from "@/services/client-service";

interface ClientFormProps {
    client?: Client;
    mode: "create" | "edit";
}

const defaultForm: ClientFormData = {
    clientNumber: "",
    nationalId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    alternativePhone: "",
    email: "",
    address: "",
    city: "",
    region: "",
    branchId: "",
    groupId: "",
    employmentStatus: "",
    employer: "",
    occupation: "",
    monthlyIncome: "",
    status: "active",
    registrationDate: new Date().toISOString().split("T")[0],
    notes: "",
};

export function ClientForm({
                               client,
                               mode,
                           }: ClientFormProps) {
    const router = useRouter();
    const {showFeedback} = useFeedback();

    const [form, setForm] = useState<ClientFormData>(() => {
        if (!client) {
            return defaultForm;
        }

        return {
            clientNumber: client.clientNumber,
            nationalId: client.nationalId,
            firstName: client.firstName,
            middleName: client.middleName,
            lastName: client.lastName,
            gender: client.gender,
            dateOfBirth: client.dateOfBirth,
            phone: client.phone,
            alternativePhone: client.alternativePhone,
            email: client.email,
            address: client.address,
            city: client.city,
            region: client.region,
            branchId: client.branchId,
            groupId: client.groupId,
            employmentStatus: client.employmentStatus,
            employer: client.employer,
            occupation: client.occupation,
            monthlyIncome: String(client.monthlyIncome),
            status: client.status,
            registrationDate: client.registrationDate,
            notes: client.notes,
        };
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [branches, setBranches] = useState<Branch[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadBranches = async () => {
        try {
            setLoading(true);
            const response = await branchService.getBranches()

            setBranches(response.data)

        } catch (error) {
            console.error("Failed to load branches:", error);

            setError(
                "Unable to load branches. Please try again.",
            );

            showFeedback(
                "error",
                "Failed to load branches",
                "There was a problem communicating with the server.",
            );
        } finally {
            setLoading(false);
        }
    }


    const loadGroups = async () => {
        try {
            setLoading(true);
            const response = await groupService.getGroups()

            setGroups(response.data)

        } catch (error) {
            console.error("Failed to load groups:", error);

            setError(
                "Unable to load groups. Please try again.",
            );

            showFeedback(
                "error",
                "Failed to load groups",
                "There was a problem communicating with the server.",
            );
        } finally {
            setLoading(false);
        }
    }


    const selectedBranchId =
        form.branchId === ""
            ? null
            : Number(form.branchId);

    /**
     * Only show groups belonging to the selected branch.
     */
    const filteredGroups = useMemo(() => {
        if (!selectedBranchId) {
            return [];
        }

        return groups.filter(
            (group) =>
                group.branchId === selectedBranchId &&
                group.status === "active"
        );
    }, [selectedBranchId]);

    /**
     * If the selected group no longer belongs to the
     * selected branch, clear the group.
     */
    useEffect(() => {
        loadBranches();
        loadGroups();
        if (
            form.groupId !== "" &&
            !filteredGroups.some(
                (group) => group.id === Number(form.groupId)
            )
        ) {
            setForm((current) => ({
                ...current,
                groupId: "",
            }));
        }
    }, [filteredGroups, form.groupId]);

    const updateField = <K extends keyof ClientFormData>(
        field: K,
        value: ClientFormData[K]
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleBranchChange = (value: string) => {
        setForm((current) => ({
            ...current,
            branchId: value === "" ? "" : Number(value),
            groupId: "",
        }));
    };

    const validateForm = () => {
        if (!form.clientNumber.trim()) {
            showFeedback(
                "error",
                "Client number is required."
            );
            return false;
        }

        if (!form.nationalId.trim()) {
            showFeedback(
                "error",
                "National ID is required."
            );
            return false;
        }

        if (!form.firstName.trim()) {
            showFeedback(
                "error",
                "First name is required."
            );
            return false;
        }

        if (!form.lastName.trim()) {
            showFeedback(
                "error",
                "Last name is required."
            );
            return false;
        }

        if (!form.phone.trim()) {
            showFeedback(
                "error",
                "Phone number is required."
            );
            return false;
        }

        if (form.branchId === "") {
            showFeedback(
                "error",
                "Please select a branch."
            );
            return false;
        }

        if (form.groupId === "") {
            showFeedback(
                "error",
                "Please select a group."
            );
            return false;
        }

        if (form.gender === "") {
            showFeedback(
                "error",
                "Please select a gender."
            );
            return false;
        }

        return true;
    };

    const handleSaveClick = () => {
        if (!validateForm()) {
            return;
        }

        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setSaving(true);

        try {
            const payload = {
                clientNumber: form.clientNumber.trim(),
                nationalId: form.nationalId.trim(),
                firstName: form.firstName.trim(),
                middleName: form.middleName.trim(),
                lastName: form.lastName.trim(),
                gender: form.gender || undefined,
                dateOfBirth: form.dateOfBirth || null,
                phone: form.phone.trim(),
                alternativePhone: form.alternativePhone.trim(),
                email: form.email.trim(),
                address: form.address.trim(),
                city: form.city.trim(),
                region: form.region.trim(),
                branchId: Number(form.branchId),
                groupId: Number(form.groupId),
                employmentStatus: form.employmentStatus || null,
                employer: form.employer.trim(),
                occupation: form.occupation.trim(),
                monthlyIncome:
                    form.monthlyIncome === ""
                        ? 0
                        : Number(form.monthlyIncome),
                status: form.status,
                registrationDate: form.registrationDate,
                notes: form.notes.trim(),
            };

            let savedClient: Client;

            if (mode === "create") {
                savedClient = await clientService.createClient(payload);
            } else {
                if (!client) {
                    throw new Error("Client information is missing.");
                }

                savedClient = await clientService.updateClient(
                    client.id,
                    payload,
                );
            }

            setShowConfirm(false);

            const clientName =
                `${savedClient.firstName} ${savedClient.lastName}`.trim();

            showFeedback(
                "success",
                mode === "create"
                    ? "Client created successfully"
                    : "Client updated successfully",
                `${clientName} has been ${
                    mode === "create" ? "created" : "updated"
                } successfully.`,
            );

            if (mode === "create") {
                router.push("/clients");
            } else {
                router.push(`/clients/${savedClient.id}`);
            }
        } catch (error: any) {
            console.error("Failed to save client:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errors
                    ? JSON.stringify(error.response.data.errors)
                    : error?.message ||
                    (mode === "create"
                        ? "Failed to create client."
                        : "Failed to update client.");

            showFeedback(
                "error",
                mode === "create"
                    ? "Unable to create client"
                    : "Unable to update client",
                message,
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>

            {/* Loading */}
            {loading && (
                <div className="rounded-lg border bg-white p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading data...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>

                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                            loadBranches()
                        }
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-base font-semibold text-foreground">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Enter the client's personal details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                                label="Client Number"
                                required
                            >
                                <Input
                                    value={form.clientNumber}
                                    onChange={(e) =>
                                        updateField(
                                            "clientNumber",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. CL-00001"
                                />
                            </FormField>

                            <FormField
                                label="National ID"
                                required
                            >
                                <Input
                                    value={form.nationalId}
                                    onChange={(e) =>
                                        updateField(
                                            "nationalId",
                                            e.target.value
                                        )
                                    }
                                    placeholder="National ID number"
                                />
                            </FormField>

                            <FormField
                                label="First Name"
                                required
                            >
                                <Input
                                    value={form.firstName}
                                    onChange={(e) =>
                                        updateField(
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="First name"
                                />
                            </FormField>

                            <FormField label="Middle Name">
                                <Input
                                    value={form.middleName}
                                    onChange={(e) =>
                                        updateField(
                                            "middleName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Middle name"
                                />
                            </FormField>

                            <FormField
                                label="Last Name"
                                required
                            >
                                <Input
                                    value={form.lastName}
                                    onChange={(e) =>
                                        updateField(
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Last name"
                                />
                            </FormField>

                            <FormField
                                label="Gender"
                                required
                            >
                                <Select
                                    value={form.gender}
                                    onChange={(e) =>
                                        updateField(
                                            "gender",
                                            e.target.value as ClientFormData["gender"]
                                        )
                                    }
                                >
                                    <option value="">
                                        Select gender
                                    </option>
                                    <option value="male">
                                        Male
                                    </option>
                                    <option value="female">
                                        Female
                                    </option>
                                    <option value="other">
                                        Other
                                    </option>
                                </Select>
                            </FormField>

                            <FormField label="Date of Birth">
                                <Input
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={(e) =>
                                        updateField(
                                            "dateOfBirth",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-base font-semibold text-foreground">
                                Contact Information
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Enter the client's contact details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                                label="Phone Number"
                                required
                            >
                                <Input
                                    value={form.phone}
                                    onChange={(e) =>
                                        updateField(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+265..."
                                />
                            </FormField>

                            <FormField label="Alternative Phone">
                                <Input
                                    value={form.alternativePhone}
                                    onChange={(e) =>
                                        updateField(
                                            "alternativePhone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+265..."
                                />
                            </FormField>

                            <FormField label="Email">
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        updateField(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="client@example.com"
                                />
                            </FormField>

                            <FormField label="Address">
                                <Input
                                    value={form.address}
                                    onChange={(e) =>
                                        updateField(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Physical address"
                                />
                            </FormField>

                            <FormField label="City">
                                <Input
                                    value={form.city}
                                    onChange={(e) =>
                                        updateField(
                                            "city",
                                            e.target.value
                                        )
                                    }
                                    placeholder="City"
                                />
                            </FormField>

                            <FormField label="Region">
                                <Input
                                    value={form.region}
                                    onChange={(e) =>
                                        updateField(
                                            "region",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Region"
                                />
                            </FormField>
                        </div>
                    </Card>

                    {/* Branch & Group */}
                    <Card>
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-base font-semibold text-foreground">
                                Branch & Group
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Assign the client to a branch and
                                group.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                            <FormField
                                label="Branch"
                                required
                            >
                                <Select
                                    value={String(
                                        form.branchId
                                    )}
                                    onChange={(e) =>
                                        handleBranchChange(
                                            e.target.value
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
                                label="Group"
                                required
                            >
                                <Select
                                    value={String(
                                        form.groupId
                                    )}
                                    onChange={(e) =>
                                        updateField(
                                            "groupId",
                                            e.target.value === ""
                                                ? ""
                                                : Number(
                                                    e.target.value
                                                )
                                        )
                                    }
                                    disabled={
                                        form.branchId === ""
                                    }
                                >
                                    <option value="">
                                        {form.branchId === ""
                                            ? "Select a branch first"
                                            : filteredGroups.length ===
                                            0
                                                ? "No groups available"
                                                : "Select group"}
                                    </option>

                                    {filteredGroups.map(
                                        (group) => (
                                            <option
                                                key={group.id}
                                                value={group.id}
                                            >
                                                {group.title}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </FormField>
                        </div>
                    </Card>

                    {/* Employment */}
                    <Card>
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-base font-semibold text-foreground">
                                Employment & Income
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Enter employment and income information.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                                label="Employment Status"
                            >
                                <Select
                                    value={
                                        form.employmentStatus
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "employmentStatus",
                                            e.target.value as ClientFormData["employmentStatus"]
                                        )
                                    }
                                >
                                    <option value="">
                                        Select employment status
                                    </option>
                                    <option value="employed">
                                        Employed
                                    </option>
                                    <option value="self_employed">
                                        Self Employed
                                    </option>
                                    <option value="business_owner">
                                        Business Owner
                                    </option>
                                    <option value="unemployed">
                                        Unemployed
                                    </option>
                                    <option value="other">
                                        Other
                                    </option>
                                </Select>
                            </FormField>

                            <FormField label="Employer">
                                <Input
                                    value={form.employer}
                                    onChange={(e) =>
                                        updateField(
                                            "employer",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Employer name"
                                />
                            </FormField>

                            <FormField label="Occupation">
                                <Input
                                    value={form.occupation}
                                    onChange={(e) =>
                                        updateField(
                                            "occupation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Occupation"
                                />
                            </FormField>

                            <FormField label="Monthly Income">
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.monthlyIncome}
                                    onChange={(e) =>
                                        updateField(
                                            "monthlyIncome",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                />
                            </FormField>
                        </div>
                    </Card>

                    {/* Registration */}
                    <Card>
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-base font-semibold text-foreground">
                                Registration
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                            <FormField
                                label="Registration Date"
                                required
                            >
                                <Input
                                    type="date"
                                    value={
                                        form.registrationDate
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "registrationDate",
                                            e.target.value
                                        )
                                    }
                                />
                            </FormField>

                            <FormField label="Status">
                                <Select
                                    value={form.status}
                                    onChange={(e) =>
                                        updateField(
                                            "status",
                                            e.target.value as ClientFormData["status"]
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
                        </div>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <div className="border-b border-border px-6 py-4">
                            <h2 className="text-base font-semibold text-foreground">
                                Additional Information
                            </h2>
                        </div>

                        <div className="p-6">
                            <FormField label="Notes">
                                <Textarea
                                    value={form.notes}
                                    onChange={(e) =>
                                        updateField(
                                            "notes",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Additional notes about the client..."
                                    rows={4}
                                />
                            </FormField>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.push(
                                    mode === "create"
                                        ? "/clients"
                                        : client
                                            ? `/clients/${client.id}`
                                            : "/clients"
                                )
                            }
                        >
                            <X className="h-4 w-4"/>
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSaveClick}
                            disabled={saving}
                        >
                            <Save className="h-4 w-4"/>
                            {mode === "create"
                                ? "Create Client"
                                : "Save Changes"}
                        </Button>
                    </div>
                </div>
            )}


            {/* Save Confirmation */}
            <ConfirmDialog
                open={showConfirm}
                title={
                    mode === "create"
                        ? "Create Client?"
                        : "Save Changes?"
                }
                description={
                    mode === "create"
                        ? `Are you sure you want to create client ${form.firstName} ${form.lastName}?`
                        : `Are you sure you want to save the changes made to ${form.firstName} ${form.lastName}?`
                }
                confirmText={
                    mode === "create"
                        ? "Create Client"
                        : "Save Changes"
                }
                cancelText="Cancel"
                onConfirm={confirmSave}
                onCancel={() => setShowConfirm(false)}
                loading={saving}
            />
        </>
    );
}
