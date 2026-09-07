"use client";

import { useParams } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { ClientForm } from "@/components/clients/client-form";

import { mockClients } from "../../mock-data";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export default function EditClientPage() {
    const params = useParams();

    const clientId = Number(params.id);

    const client = mockClients.find(
        (item) => item.id === clientId
    );

    if (!client) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Client Not Found"
                    description="The requested client could not be found."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <Link
                href="/clients"
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Clients
            </Link>


            <PageHeader
                title="Edit Client"
                description={`Update information for ${client.firstName} ${client.lastName}.`}
            />

            <ClientForm
                client={client}
                mode="edit"
            />
        </div>
    );
}