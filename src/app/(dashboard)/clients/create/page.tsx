import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ClientForm } from "@/components/clients/client-form";
import { PageHeader } from "@/components/ui/page-header";

export default function CreateClientPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Link
                    href="/clients"
                    className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Clients
                </Link>

                <PageHeader
                    title="Add New Client"
                    description="Create a new client profile and capture their information."
                />
            </div>

            <ClientForm />
        </div>
    );
}