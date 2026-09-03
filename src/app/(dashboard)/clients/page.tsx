"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { ClientFilters } from "@/components/clients/client-filters";
import { ClientTable } from "@/components/clients/client-table";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import type { Client } from "@/types/client";
import Link from "next/link";


const clients: Client[] = [
    {
        id: 1,
        clientNumber: "CL-000001",
        name: "Sarah Jenkins",
        initials: "SJ",
        group: "Northside Traders",
        phone: "555-0123",
        activeLoans: 2,
        totalBorrowed: 14500,
        status: "active",
    },
    {
        id: 2,
        clientNumber: "CL-000002",
        name: "Marcus Rodriguez",
        initials: "MR",
        group: "Downtown Merchants",
        phone: "555-0987",
        activeLoans: 1,
        totalBorrowed: 8250,
        status: "arrears",
    },
    {
        id: 3,
        clientNumber: "CL-000003",
        name: "David Chen",
        initials: "DC",
        group: "Independent",
        phone: "555-4432",
        activeLoans: 3,
        totalBorrowed: 45000,
        status: "active",
    },

];

export default function ClientsPage() {
    const [search, setSearch] = useState("");
    const [group, setGroup] = useState("");
    const [status, setStatus] = useState("");

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const searchTerm = search.toLowerCase();

            const matchesSearch =
                client.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                client.phone
                    .toLowerCase()
                    .includes(searchTerm) ||
                client.clientNumber
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesGroup =
                !group || client.group === group;

            const matchesStatus =
                !status || client.status === status;

            return (
                matchesSearch &&
                matchesGroup &&
                matchesStatus
            );
        });
    }, [search, group, status]);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Client Directory"
                action={
                    <Link href="/clients/create">
                        <Button variant="secondary">
                            <Plus className="h-4 w-4" />
                            Add New Client
                        </Button>
                    </Link>
                }
            />

            <ClientFilters
                search={search}
                group={group}
                status={status}
                onSearchChange={setSearch}
                onGroupChange={setGroup}
                onStatusChange={setStatus}
            />

            <ClientTable clients={filteredClients} />
        </div>
    );
}