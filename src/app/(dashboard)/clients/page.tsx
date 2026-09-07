"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {Plus, UsersIcon} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { ClientFilters } from "@/components/clients/client-filters";
import { ClientTable } from "@/components/clients/client-table";

import { useFeedback } from "@/components/ui/feedback-bar";

import type { Client, ClientStatus } from "@/types/client";
import { branches, mockGroups } from "../groups/mock-data";

const mockClients: Client[] = [
    {
        id: 1,
        clientNumber: "CL-000001",
        nationalId: "M12345678",
        firstName: "John",
        middleName: "James",
        lastName: "Phiri",
        gender: "male",
        dateOfBirth: "1988-04-12",

        phone: "0999 123 456",
        alternativePhone: "0888 123 456",
        email: "john.phiri@example.com",

        address: "Area 25",
        city: "Lilongwe",
        region: "Central",

        branchId: 1,
        branchName: "Lilongwe Branch",
        groupId: 1,
        groupName: "Area 25 Group",

        employmentStatus: "employed",
        employer: "ABC Limited",
        occupation: "Accountant",
        monthlyIncome: 650000,

        status: "active",
        registrationDate: "2025-01-15",

        activeLoans: 2,
        totalLoans: 4,
        totalDisbursed: 3500000,
        totalRepaid: 2100000,
        outstandingBalance: 1400000,

        notes: "",
    },

    {
        id: 2,
        clientNumber: "CL-000002",
        nationalId: "M23456789",
        firstName: "Mary",
        middleName: "",
        lastName: "Banda",
        gender: "female",
        dateOfBirth: "1992-08-20",

        phone: "0888 456 789",
        alternativePhone: "",
        email: "mary.banda@example.com",

        address: "Area 47",
        city: "Lilongwe",
        region: "Central",

        branchId: 1,
        branchName: "Lilongwe Branch",
        groupId: 2,
        groupName: "Area 47 Women Group",

        employmentStatus: "business_owner",
        employer: "",
        occupation: "Retailer",
        monthlyIncome: 850000,

        status: "active",
        registrationDate: "2025-03-10",

        activeLoans: 1,
        totalLoans: 2,
        totalDisbursed: 2000000,
        totalRepaid: 1250000,
        outstandingBalance: 750000,

        notes: "",
    },

    {
        id: 3,
        clientNumber: "CL-000003",
        nationalId: "M34567890",
        firstName: "Peter",
        middleName: "Andrew",
        lastName: "Chirwa",
        gender: "male",
        dateOfBirth: "1985-02-14",

        phone: "0998 222 333",
        alternativePhone: "",
        email: "",

        address: "Zomba Urban",
        city: "Zomba",
        region: "Southern",

        branchId: 2,
        branchName: "Zomba Branch",
        groupId: 3,
        groupName: "Zomba Business Group",

        employmentStatus: "self_employed",
        employer: "",
        occupation: "Trader",
        monthlyIncome: 550000,

        status: "active",
        registrationDate: "2025-05-22",

        activeLoans: 1,
        totalLoans: 3,
        totalDisbursed: 1800000,
        totalRepaid: 1200000,
        outstandingBalance: 600000,

        notes: "",
    },

    {
        id: 4,
        clientNumber: "CL-000004",
        nationalId: "M45678901",
        firstName: "Grace",
        middleName: "",
        lastName: "Mbewe",
        gender: "female",
        dateOfBirth: "1990-11-03",

        phone: "0888 777 111",
        alternativePhone: "",
        email: "grace.mbewe@example.com",

        address: "Blantyre CBD",
        city: "Blantyre",
        region: "Southern",

        branchId: 3,
        branchName: "Blantyre Branch",
        groupId: 4,
        groupName: "Blantyre Traders Group",

        employmentStatus: "self_employed",
        employer: "",
        occupation: "Shop Owner",
        monthlyIncome: 900000,

        status: "inactive",
        registrationDate: "2024-11-18",
        deactivatedAt: "2026-02-10",
        deactivationReason: "Client account closed",

        activeLoans: 0,
        totalLoans: 2,
        totalDisbursed: 1200000,
        totalRepaid: 1200000,
        outstandingBalance: 0,

        notes: "",
    },
];

export default function ClientsPage() {
    const { showFeedback } = useFeedback();

    const [clients, setClients] = useState<Client[]>(mockClients);

    const [search, setSearch] = useState("");
    const [branchId, setBranchId] = useState<number | "">("");
    const [groupId, setGroupId] = useState<number | "">("");
    const [status, setStatus] = useState<ClientStatus | "">("");

    const [appliedFilters, setAppliedFilters] = useState({
        search: "",
        branchId: "" as number | "",
        groupId: "" as number | "",
        status: "" as ClientStatus | "",
    });

    const [selectedClient, setSelectedClient] = useState<Client | null>(
        null,
    );

    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        useState(false);

    const [showDeactivateConfirmation, setShowDeactivateConfirmation] =
        useState(false);

    const [processing, setProcessing] = useState(false);

    const filteredClients = useMemo(() => {
        const normalizedSearch = appliedFilters.search
            .trim()
            .toLowerCase();

        return clients.filter((client) => {
            const matchesSearch =
                normalizedSearch === "" ||
                `${client.firstName} ${client.middleName} ${client.lastName}`
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                client.clientNumber
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                client.nationalId
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                client.phone
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesBranch =
                appliedFilters.branchId === "" ||
                client.branchId === appliedFilters.branchId;

            const matchesGroup =
                appliedFilters.groupId === "" ||
                client.groupId === appliedFilters.groupId;

            const matchesStatus =
                appliedFilters.status === "" ||
                client.status === appliedFilters.status;

            return (
                matchesSearch &&
                matchesBranch &&
                matchesGroup &&
                matchesStatus
            );
        });
    }, [clients, appliedFilters]);

    function handleApplyFilters() {
        setAppliedFilters({
            search,
            branchId,
            groupId,
            status,
        });
    }

    function handleClearFilters() {
        setSearch("");
        setBranchId("");
        setGroupId("");
        setStatus("");

        setAppliedFilters({
            search: "",
            branchId: "",
            groupId: "",
            status: "",
        });
    }

    function handleDeactivate(client: Client) {
        setSelectedClient(client);
        setShowDeactivateConfirmation(true);
    }

    function handleDelete(client: Client) {
        setSelectedClient(client);
        setShowDeleteConfirmation(true);
    }

    async function confirmDeactivate() {
        if (!selectedClient) {
            return;
        }

        setProcessing(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 700));

            const clientName = `${selectedClient.firstName} ${selectedClient.lastName}`;

            setClients((currentClients) =>
                currentClients.map((client) =>
                    client.id === selectedClient.id
                        ? {
                            ...client,
                            status: "inactive",
                            deactivatedAt: new Date()
                                .toISOString()
                                .split("T")[0],
                            deactivationReason:
                                "Account deactivated by administrator",
                        }
                        : client,
                ),
            );

            setShowDeactivateConfirmation(false);
            setSelectedClient(null);

            showFeedback(
                "success",
                "Client deactivated successfully",
                `${clientName}'s account has been deactivated.`,
            );
        } finally {
            setProcessing(false);
        }
    }

    async function confirmDelete() {
        if (!selectedClient) {
            return;
        }

        setProcessing(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 700));

            const clientName = `${selectedClient.firstName} ${selectedClient.lastName}`;

            setClients((currentClients) =>
                currentClients.filter(
                    (client) => client.id !== selectedClient.id,
                ),
            );

            setShowDeleteConfirmation(false);
            setSelectedClient(null);

            showFeedback(
                "success",
                "Client deleted successfully",
                `${clientName} has been removed from the client directory.`,
            );
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Clients"
                icon={UsersIcon}
                description="Manage client accounts and view their loan information."
                action={
                    <Button size="sm">
                        <Link href="/clients/create" className="flex items-center gap-2 whitespace-nowrap">
                            <Plus className="h-4 w-4" />
                            New Client
                        </Link>
                    </Button>
                }
            />

            <ClientFilters
                search={search}
                branchId={branchId}
                groupId={groupId}
                status={status}
                branches={branches}
                groups={mockGroups}
                onSearchChange={setSearch}
                onBranchChange={(value) => {
                    setBranchId(value);

                    // Reset group when changing branch
                    setGroupId("");
                }}
                onGroupChange={setGroupId}
                onStatusChange={setStatus}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            <ClientTable
                clients={filteredClients}
                onDeactivate={handleDeactivate}
                onDelete={handleDelete}
            />

            <ConfirmDialog
                open={showDeactivateConfirmation}
                title="Deactivate Client"
                description={
                    selectedClient
                        ? `Are you sure you want to deactivate ${selectedClient.firstName} ${selectedClient.lastName}? The client will no longer have an active account.`
                        : ""
                }
                confirmText="Deactivate"
                cancelText="Cancel"
                variant="delete"
                loading={processing}
                onConfirm={confirmDeactivate}
                onCancel={()=>{
                    setShowDeactivateConfirmation(false);
                }}
            />

            <ConfirmDialog
                open={showDeleteConfirmation}
                title="Delete Client"
                description={
                    selectedClient
                        ? `Are you sure you want to permanently delete ${selectedClient.firstName} ${selectedClient.lastName}? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete"
                cancelText="Cancel"
                variant="delete"
                loading={processing}
                onConfirm={confirmDelete}
                onCancel={()=>{
                    setShowDeleteConfirmation(false);
                }}
            />
        </div>
    );
}