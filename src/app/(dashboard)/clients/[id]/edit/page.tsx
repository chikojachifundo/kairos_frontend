"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import { PageHeader } from "@/components/ui/page-header";
import { ClientForm } from "@/components/clients/client-form";

import Link from "next/link";
import {ArrowLeft, Loader2, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {clientService} from "@/services/client-service";
import type {Client} from "@/types/client";

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

export default function EditClientPage() {
    const params = useParams();
    const clientId = Number(params.id);
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadClient() {
            if (!clientId || Number.isNaN(clientId)) {
                setError("Invalid client ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                setClient(await clientService.getClient(clientId));
            } catch (error: unknown) {
                console.error("Failed to load client:", error);
                setError(
                    getErrorMessage(error, "Unable to load client information."),
                );
                setClient(null);
            } finally {
                setLoading(false);
            }
        }

        loadClient();
    }, [clientId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Link href="/clients">
                    <Button variant="ghost" size="sm" className="-ml-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Clients
                    </Button>
                </Link>

                <PageHeader title="Edit Client" description="Loading client information..." />

                <Card className="p-10 text-center">
                    <Loader2 className="mx-auto h-7 w-7 animate-spin text-muted" />
                    <p className="mt-3 text-sm text-muted">Loading client information...</p>
                </Card>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="space-y-6">
                <Link href="/clients">
                    <Button variant="ghost" size="sm" className="-ml-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Clients
                    </Button>
                </Link>

                <PageHeader
                    title="Client Not Found"
                    description={error || "The requested client could not be found."}
                />

                <Card className="p-10 text-center">
                    <User className="mx-auto h-10 w-10 text-muted" />
                    <p className="mt-3 text-sm text-muted">
                        The client you are looking for does not exist or could not be loaded.
                    </p>
                </Card>
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
