"use client";

import Link from "next/link";
import {ArrowLeft, Edit, Package} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {productChargeService} from "@/services/product-charge-service";
import type {ProductCharge} from "@/types/product-charge";

export default function ProductChargeShowPage() {
    const params = useParams();

    const id = params.id;

    const numericId = Number(id);

    const [charge, setCharge] = useState<ProductCharge | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadCharge() {
            if (!numericId || Number.isNaN(numericId)) {
                setError("Invalid charge ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setCharge(await productChargeService.getProductCharge(numericId));
            } catch (error: unknown) {
                console.error("Failed to load product charge:", error);
                setError(
                    axios.isAxiosError<{message?: string}>(error)
                        ? error.response?.data?.message || "Unable to load charge information."
                        : "Unable to load charge information.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadCharge();
    }, [numericId]);

    if (loading) {
        return <div className="space-y-6"><PageHeader title="Product Charge" description="Loading charge information..." icon={Package}/></div>;
    }

    /*
    |--------------------------------------------------------------------------
    | Charge Not Found
    |--------------------------------------------------------------------------
    */

    if (!charge) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Charge Not Found"
                    description="The requested charge definition could not be found."
                    icon={Package}
                />

                <div className="rounded-xl border border-border bg-surface p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Package className="h-6 w-6"/>
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-foreground">
                            Charge Not Found
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-muted">
                            {error || "The charge you are looking for does not exist or may have been removed."}
                        </p>

                        <p className="mt-2 text-xs text-muted">
                            Charge ID:{" "}
                            <span className="font-mono text-foreground">
                                {String(id)}
                            </span>
                        </p>

                        <div className="mt-6">
                            <Button asChild variant="outline">
                                <Link href="/products">
                                    <ArrowLeft className="h-4 w-4"/>
                                    Back to Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Charge Details
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title={charge.name}
                description="View and manage charge definition details."
                icon={Package}
                action={
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <Link href="/products" className="flex items-center gap-2 whitespace-nowrap">
                                <ArrowLeft className="h-4 w-4"/>
                                Back
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link
                                href={`/products/charges/${charge.id}/edit`} className="flex items-center gap-2 whitespace-nowrap"
                            >
                                <Edit className="h-4 w-4"/>
                                Edit Charge
                            </Link>
                        </Button>
                    </div>
                }
            />

            {/* Charge Overview */}
            <div className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border px-6 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                Charge Information
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                Basic information about this charge definition.
                            </p>
                        </div>

                        <Badge
                            variant={
                                charge.status === "active"
                                    ? "success"
                                    : "neutral"
                            }
                        >
                            {charge.status === "active"
                                ? "Active"
                                : "Inactive"}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Charge Name */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Charge Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-foreground">
                            {charge.name}
                        </p>
                    </div>

                    {/* Charge Code */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Charge Code
                        </p>

                        <p className="mt-1 font-mono text-sm font-medium text-foreground">
                            {charge.code}
                        </p>
                    </div>

                    {/* Charge Type */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Charge Type
                        </p>

                        <div className="mt-1">
                            <Badge variant="neutral">
                                {charge.type === "percentage"
                                    ? "Percentage"
                                    : "Fixed Amount"}
                            </Badge>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Status
                        </p>

                        <div className="mt-1">
                            <Badge
                                variant={
                                    charge.status === "active"
                                        ? "success"
                                        : "neutral"
                                }
                            >
                                {charge.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </Badge>
                        </div>
                    </div>

                    {/* Charge ID */}
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                            Charge ID
                        </p>

                        <p className="mt-1 font-mono text-sm text-foreground">
                            {charge.id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border px-6 py-4">
                    <h2 className="text-base font-semibold text-foreground">
                        Description
                    </h2>
                </div>

                <div className="p-6">
                    {charge.description ? (
                        <p className="text-sm leading-6 text-foreground">
                            {charge.description}
                        </p>
                    ) : (
                        <p className="text-sm italic text-muted">
                            No description has been provided for this charge.
                        </p>
                    )}
                </div>
            </div>

            {/* Charge Type Explanation */}
            <div className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border px-6 py-4">
                    <h2 className="text-base font-semibold text-foreground">
                        Charge Configuration
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        How this charge is expected to be applied to a loan
                        product.
                    </p>
                </div>

                <div className="p-6">
                    {charge.type === "percentage" ? (
                        <div className="rounded-lg bg-primary/5 p-4">
                            <h3 className="text-sm font-semibold text-primary">
                                Percentage-Based Charge
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-muted">
                                This charge is calculated as a percentage of
                                the applicable loan amount or configured
                                calculation base.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg bg-secondary/5 p-4">
                            <h3 className="text-sm font-semibold text-secondary">
                                Fixed Amount Charge
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-muted">
                                This charge is applied as a fixed monetary
                                amount according to the value configured when
                                the charge is assigned to a product.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href="/products" className="flex items-center gap-2 whitespace-nowrap">
                        <ArrowLeft className="h-4 w-4"/>
                        Back to Products
                    </Link>
                </Button>

                <Button asChild>
                    <Link
                        href={`/products/charges/${charge.id}/edit`} className="flex items-center gap-2 whitespace-nowrap"
                    >
                        <Edit className="h-4 w-4"/>
                        Edit Charge
                    </Link>
                </Button>
            </div>
        </div>
    );
}

