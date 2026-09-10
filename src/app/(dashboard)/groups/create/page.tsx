"use client"
import Link from "next/link";

import {ArrowLeft} from "lucide-react";

import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {GroupForm} from "@/components/groups/group-form";
import {useEffect, useState} from "react";
import {Branch} from "@/types/branch";
import {branchService} from "@/services/branch-service";
import {useFeedback} from "@/components/ui/feedback-bar";


export default function CreateGroupPage() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const {showFeedback} = useFeedback();


    const [branches, setBranches] = useState<Branch[]>([]);

    async function loadBranches(branchId: number) {


        try {
            setLoading(true);

            const response = await branchService.getBranches(branchId);

            setBranches(response.data);

            setCurrentPage(response.meta.current_page);
            setTotalPages(response.meta.last_page);
            setTotalItems(response.meta.total);
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

    /**
     * Load branches when pages opens
     */
    useEffect(() => {
        loadBranches(currentPage);
    }, [])

    return (
        <div className="space-y-5">
            <Link href="/groups">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    Back to Groups
                </Button>
            </Link>

            <PageHeader
                title="Add New Group"
                description="Create a new client group and assign it to a branch."
            />

            {/* Loading */}
            {loading && (
                <div className="rounded-lg border bg-white p-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-primary"/>

                        <p className="text-sm text-muted-foreground">
                            Loading branches...
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
                            loadBranches(currentPage)
                        }
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {!loading && !error && (
                <GroupForm branches={branches}/>
            )}

        </div>
    );
}