import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { GroupForm } from "@/components/groups/group-form";

const branches = [
    {
        id: 1,
        name: "Lilongwe Main Branch",
    },
    {
        id: 2,
        name: "Blantyre Branch",
    },
    {
        id: 3,
        name: "Mzuzu Branch",
    },
];

export default function CreateGroupPage() {
    return (
        <div className="space-y-5">
            <Link href="/groups">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Groups
                </Button>
            </Link>

            <PageHeader
                title="Add New Group"
                description="Create a new client group and assign it to a branch."
            />

            <GroupForm branches={branches} />
        </div>
    );
}