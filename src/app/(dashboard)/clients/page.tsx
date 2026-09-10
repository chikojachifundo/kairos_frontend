"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {Plus, UsersIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";

import {ClientFilters} from "@/components/clients/client-filters";
import {ClientTable} from "@/components/clients/client-table";

import {useFeedback} from "@/components/ui/feedback-bar";

import type {Client, ClientStatus} from "@/types/client";
import {branches, mockGroups} from "../groups/mock-data";
import {clientService} from "@/services/client-service";

export default function ClientsPage() {
    const {showFeedback} = useFeedback();

    const [clients, setClients] = useState<Client[]>([]);


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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    async function loadClients(page = currentPage) {
        try {

            setLoading(true);
            setError(null);


            const response = await clientService.getClients(page);
            setClients(response.data)

            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
            setTotalItems(response.meta.total);

        }catch (error){
            console.error("Failed to load clients:", error);

            setError(
                "Unable to load clients. Please try again.",
            );

            showFeedback(
                "error",
                "Failed to load clients. Please try again.",
                "There was a problem communicating with the server.",
            );
        }finally {
            setLoading(false);
        }

    }

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

    useEffect(() => {
        loadClients(1)
    },[])

    return (
        <div className="space-y-6">
            <PageHeader
                title="Clients"
                icon={UsersIcon}
                description="Manage client accounts and view their loan information."
                action={
                    <Button size="sm">
                        <Link href="/clients/create" className="flex items-center gap-2 whitespace-nowrap">
                            <Plus className="h-4 w-4"/>
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

            {/* Loading */}
            {loading && (
                <div className="rounded-lg border bg-white p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Loading clients...
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
                            loadClients(currentPage)
                        }
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {!loading && !error && (
                <ClientTable
                    clients={filteredClients}
                    onDeactivate={handleDeactivate}
                    onDelete={handleDelete}
                />
            )}

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
                onCancel={() => {
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
                onCancel={() => {
                    setShowDeleteConfirmation(false);
                }}
            />
        </div>
    );
}