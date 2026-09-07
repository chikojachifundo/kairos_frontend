"use client";

import { PageHeader } from "@/components/ui/page-header";
import { ClientForm } from "@/components/clients/client-form";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

export default function CreateClientPage() {
    return (
        <div className="space-y-6">
            <Link href="/clients">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Clients
                </Button>
            </Link>

            <PageHeader
                title="Create Client"
                description="Register a new client and assign them to a branch and group."
            />

            <ClientForm mode="create" />
        </div>
    );
}