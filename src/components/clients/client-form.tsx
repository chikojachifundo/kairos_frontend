"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ClientFormData {
    clientNumber: string;

    firstName: string;
    middleName: string;
    lastName: string;

    dateOfBirth: string;
    gender: string;
    nationality: string;

    idType: string;
    idNumber: string;
    idIssueDate: string;
    idExpiryDate: string;

    phone: string;
    alternativePhone: string;
    email: string;

    physicalAddress: string;
    postalAddress: string;

    group: string;
    membershipNumber: string;
    membershipDate: string;

    nextOfKinName: string;
    nextOfKinRelationship: string;
    nextOfKinPhone: string;
    nextOfKinAddress: string;

    employmentType: string;
    employerName: string;
    businessRegistrationNumber: string;
    occupation: string;
    monthlyIncome: string;

    notes: string;
}

const initialForm: ClientFormData = {
    clientNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    idType: "",
    idNumber: "",
    idIssueDate: "",
    idExpiryDate: "",
    phone: "",
    alternativePhone: "",
    email: "",
    physicalAddress: "",
    postalAddress: "",
    group: "",
    membershipNumber: "",
    membershipDate: "",
    nextOfKinName: "",
    nextOfKinRelationship: "",
    nextOfKinPhone: "",
    nextOfKinAddress: "",
    employmentType: "",
    employerName: "",
    businessRegistrationNumber: "",
    occupation: "",
    monthlyIncome: "",
    notes: "",
};

export function ClientForm() {
    const router = useRouter();

    const [form, setForm] =
        useState<ClientFormData>(initialForm);

    const [errors, setErrors] = useState<
        Partial<Record<keyof ClientFormData, string>>
    >({});

    const [saving, setSaving] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] =
        useState(false);

    function updateField(
        field: keyof ClientFormData,
        value: string,
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

    function validate() {
        const validationErrors: typeof errors = {};

        if (!form.firstName.trim()) {
            validationErrors.firstName =
                "First name is required.";
        }

        if (!form.lastName.trim()) {
            validationErrors.lastName =
                "Last name is required.";
        }

        if (!form.phone.trim()) {
            validationErrors.phone =
                "Phone number is required.";
        }

        if (!form.idType) {
            validationErrors.idType =
                "Identification type is required.";
        }

        if (!form.idNumber.trim()) {
            validationErrors.idNumber =
                "Identification number is required.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
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
            /*
             * Laravel API call will eventually go here.
             *
             * await clientApi.create(form);
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            setShowSaveConfirmation(false);

            router.push("/clients");
        } finally {
            setSaving(false);
        }
    }



    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Personal Information */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Personal Information
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Basic information about the client.
                    </p>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                        label="Client Number"
                        htmlFor="clientNumber"
                        hint="Leave blank to generate automatically."
                    >
                        <Input
                            id="clientNumber"
                            value={form.clientNumber}
                            onChange={(e) =>
                                updateField(
                                    "clientNumber",
                                    e.target.value,
                                )
                            }
                            placeholder="CL-000001"
                        />
                    </FormField>

                    <FormField
                        label="First Name"
                        htmlFor="firstName"
                        required
                        error={errors.firstName}
                    >
                        <Input
                            id="firstName"
                            value={form.firstName}
                            onChange={(e) =>
                                updateField(
                                    "firstName",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter first name"
                        />
                    </FormField>

                    <FormField
                        label="Middle Name"
                        htmlFor="middleName"
                    >
                        <Input
                            id="middleName"
                            value={form.middleName}
                            onChange={(e) =>
                                updateField(
                                    "middleName",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter middle name"
                        />
                    </FormField>

                    <FormField
                        label="Last Name"
                        htmlFor="lastName"
                        required
                        error={errors.lastName}
                    >
                        <Input
                            id="lastName"
                            value={form.lastName}
                            onChange={(e) =>
                                updateField(
                                    "lastName",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter last name"
                        />
                    </FormField>

                    <FormField
                        label="Date of Birth"
                        htmlFor="dateOfBirth"
                    >
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={(e) =>
                                updateField(
                                    "dateOfBirth",
                                    e.target.value,
                                )
                            }
                        />
                    </FormField>

                    <FormField label="Gender" htmlFor="gender">
                        <Select
                            id="gender"
                            value={form.gender}
                            onChange={(e) =>
                                updateField(
                                    "gender",
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Select>
                    </FormField>

                    <FormField
                        label="Nationality"
                        htmlFor="nationality"
                    >
                        <Input
                            id="nationality"
                            value={form.nationality}
                            onChange={(e) =>
                                updateField(
                                    "nationality",
                                    e.target.value,
                                )
                            }
                            placeholder="e.g. Malawian"
                        />
                    </FormField>
                </div>
            </Card>

            {/* Identification */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Identification
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Client identification and verification
                        details.
                    </p>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-4">
                    <FormField
                        label="ID Type"
                        htmlFor="idType"
                        required
                        error={errors.idType}
                    >
                        <Select
                            id="idType"
                            value={form.idType}
                            onChange={(e) =>
                                updateField(
                                    "idType",
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">
                                Select ID type
                            </option>
                            <option value="national_id">
                                National ID
                            </option>
                            <option value="passport">
                                Passport
                            </option>
                            <option value="driving_licence">
                                Driving Licence
                            </option>
                            <option value="other">Other</option>
                        </Select>
                    </FormField>

                    <FormField
                        label="ID Number"
                        htmlFor="idNumber"
                        required
                        error={errors.idNumber}
                    >
                        <Input
                            id="idNumber"
                            value={form.idNumber}
                            onChange={(e) =>
                                updateField(
                                    "idNumber",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter ID number"
                        />
                    </FormField>

                    <FormField
                        label="Issue Date"
                        htmlFor="idIssueDate"
                    >
                        <Input
                            id="idIssueDate"
                            type="date"
                            value={form.idIssueDate}
                            onChange={(e) =>
                                updateField(
                                    "idIssueDate",
                                    e.target.value,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Expiry Date"
                        htmlFor="idExpiryDate"
                    >
                        <Input
                            id="idExpiryDate"
                            type="date"
                            value={form.idExpiryDate}
                            onChange={(e) =>
                                updateField(
                                    "idExpiryDate",
                                    e.target.value,
                                )
                            }
                        />
                    </FormField>
                </div>
            </Card>

            {/* Contact Information */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Contact Information
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Contact details and addresses.
                    </p>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2">
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
                            onChange={(e) =>
                                updateField(
                                    "phone",
                                    e.target.value,
                                )
                            }
                            placeholder="+265 ..."
                        />
                    </FormField>

                    <FormField
                        label="Alternative Phone"
                        htmlFor="alternativePhone"
                    >
                        <Input
                            id="alternativePhone"
                            type="tel"
                            value={form.alternativePhone}
                            onChange={(e) =>
                                updateField(
                                    "alternativePhone",
                                    e.target.value,
                                )
                            }
                            placeholder="+265 ..."
                        />
                    </FormField>

                    <FormField
                        label="Email Address"
                        htmlFor="email"
                    >
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                updateField(
                                    "email",
                                    e.target.value,
                                )
                            }
                            placeholder="client@example.com"
                        />
                    </FormField>

                    <FormField
                        label="Physical Address"
                        htmlFor="physicalAddress"
                    >
                        <Textarea
                            id="physicalAddress"
                            value={form.physicalAddress}
                            onChange={(e) =>
                                updateField(
                                    "physicalAddress",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter physical address"
                        />
                    </FormField>

                    <FormField
                        label="Postal Address"
                        htmlFor="postalAddress"
                    >
                        <Textarea
                            id="postalAddress"
                            value={form.postalAddress}
                            onChange={(e) =>
                                updateField(
                                    "postalAddress",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter postal address"
                        />
                    </FormField>
                </div>
            </Card>

            {/* Group Information */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Group Information
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Assign the client to a lending group.
                    </p>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-3">
                    <FormField
                        label="Group"
                        htmlFor="group"
                    >
                        <Select
                            id="group"
                            value={form.group}
                            onChange={(e) =>
                                updateField(
                                    "group",
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">
                                Select group
                            </option>
                            <option value="Northside Traders">
                                Northside Traders
                            </option>
                            <option value="Downtown Merchants">
                                Downtown Merchants
                            </option>
                            <option value="Independent">
                                Independent
                            </option>
                        </Select>
                    </FormField>

                    <FormField
                        label="Membership Number"
                        htmlFor="membershipNumber"
                    >
                        <Input
                            id="membershipNumber"
                            value={form.membershipNumber}
                            onChange={(e) =>
                                updateField(
                                    "membershipNumber",
                                    e.target.value,
                                )
                            }
                            placeholder="Membership number"
                        />
                    </FormField>

                    <FormField
                        label="Membership Date"
                        htmlFor="membershipDate"
                    >
                        <Input
                            id="membershipDate"
                            type="date"
                            value={form.membershipDate}
                            onChange={(e) =>
                                updateField(
                                    "membershipDate",
                                    e.target.value,
                                )
                            }
                        />
                    </FormField>
                </div>
            </Card>

            {/* Next of Kin */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Next of Kin
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Emergency and beneficiary contact information.
                    </p>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2">
                    <FormField
                        label="Full Name"
                        htmlFor="nextOfKinName"
                    >
                        <Input
                            id="nextOfKinName"
                            value={form.nextOfKinName}
                            onChange={(e) =>
                                updateField(
                                    "nextOfKinName",
                                    e.target.value,
                                )
                            }
                            placeholder="Full name"
                        />
                    </FormField>

                    <FormField
                        label="Relationship"
                        htmlFor="nextOfKinRelationship"
                    >
                        <Input
                            id="nextOfKinRelationship"
                            value={form.nextOfKinRelationship}
                            onChange={(e) =>
                                updateField(
                                    "nextOfKinRelationship",
                                    e.target.value,
                                )
                            }
                            placeholder="e.g. Spouse, Parent"
                        />
                    </FormField>

                    <FormField
                        label="Phone Number"
                        htmlFor="nextOfKinPhone"
                    >
                        <Input
                            id="nextOfKinPhone"
                            type="tel"
                            value={form.nextOfKinPhone}
                            onChange={(e) =>
                                updateField(
                                    "nextOfKinPhone",
                                    e.target.value,
                                )
                            }
                            placeholder="+265 ..."
                        />
                    </FormField>

                    <FormField
                        label="Address"
                        htmlFor="nextOfKinAddress"
                    >
                        <Textarea
                            id="nextOfKinAddress"
                            value={form.nextOfKinAddress}
                            onChange={(e) =>
                                updateField(
                                    "nextOfKinAddress",
                                    e.target.value,
                                )
                            }
                            placeholder="Enter address"
                        />
                    </FormField>
                </div>
            </Card>

            {/* Employment */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Employment / Business Information
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Financial and employment information used
                        during credit assessment.
                    </p>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
                    <FormField
                        label="Employment Type"
                        htmlFor="employmentType"
                    >
                        <Select
                            id="employmentType"
                            value={form.employmentType}
                            onChange={(e) =>
                                updateField(
                                    "employmentType",
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">
                                Select employment type
                            </option>
                            <option value="employed">
                                Employed
                            </option>
                            <option value="self_employed">
                                Self Employed
                            </option>
                            <option value="business">
                                Business Owner
                            </option>
                            <option value="unemployed">
                                Unemployed
                            </option>
                            <option value="other">Other</option>
                        </Select>
                    </FormField>

                    <FormField
                        label="Employer / Business Name"
                        htmlFor="employerName"
                    >
                        <Input
                            id="employerName"
                            value={form.employerName}
                            onChange={(e) =>
                                updateField(
                                    "employerName",
                                    e.target.value,
                                )
                            }
                            placeholder="Employer or business"
                        />
                    </FormField>

                    <FormField
                        label="Business Registration Number"
                        htmlFor="businessRegistrationNumber"
                    >
                        <Input
                            id="businessRegistrationNumber"
                            value={form.businessRegistrationNumber}
                            onChange={(e) =>
                                updateField(
                                    "businessRegistrationNumber",
                                    e.target.value,
                                )
                            }
                            placeholder="Registration number"
                        />
                    </FormField>

                    <FormField
                        label="Occupation"
                        htmlFor="occupation"
                    >
                        <Input
                            id="occupation"
                            value={form.occupation}
                            onChange={(e) =>
                                updateField(
                                    "occupation",
                                    e.target.value,
                                )
                            }
                            placeholder="Occupation"
                        />
                    </FormField>

                    <FormField
                        label="Monthly Income"
                        htmlFor="monthlyIncome"
                    >
                        <Input
                            id="monthlyIncome"
                            type="number"
                            min="0"
                            value={form.monthlyIncome}
                            onChange={(e) =>
                                updateField(
                                    "monthlyIncome",
                                    e.target.value,
                                )
                            }
                            placeholder="0.00"
                        />
                    </FormField>
                </div>
            </Card>

            {/* Notes */}
            <Card>
                <div className="border-b border-border px-5 py-4">
                    <h2 className="font-semibold text-foreground">
                        Additional Information
                    </h2>
                </div>

                <div className="p-5">
                    <FormField
                        label="Notes"
                        htmlFor="notes"
                    >
                        <Textarea
                            id="notes"
                            rows={5}
                            value={form.notes}
                            onChange={(e) =>
                                updateField(
                                    "notes",
                                    e.target.value,
                                )
                            }
                            placeholder="Additional notes about the client..."
                        />
                    </FormField>
                </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={saving}
                >
                    <Save className="h-4 w-4" />

                    {saving
                        ? "Saving..."
                        : "Save Client"}
                </Button>

            </div>

            <ConfirmDialog
                open={showSaveConfirmation}
                title="Save Client?"
                description={`Are you sure you want to create ${form.firstName} ${form.lastName} as a new client? Please review the information before continuing.`}
                confirmText="Yes, Save Client"
                cancelText="Review Again"
                variant="save"
                loading={saving}
                onConfirm={confirmSave}
                onCancel={() =>
                    setShowSaveConfirmation(false)
                }
            />


        </form>
    );
}

