"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ArrowLeft, Banknote, CheckCircle2, Edit, Loader2, XCircle} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ConfirmDialog} from "@/components/ui/confirm-dialog";
import {PageHeader} from "@/components/ui/page-header";
import {useFeedback} from "@/components/ui/feedback-bar";
import {disbursementService} from "@/services/disbursement-service";
import type {Disbursement} from "@/types/disbursement";

const money = (n: number) => new Intl.NumberFormat("en-MW", {
    style: "currency",
    currency: "MWK",
    maximumFractionDigits: 0
}).format(n || 0);
const date = (v?: string | null) => v ? new Date(v).toLocaleDateString("en-GB") : "—";
export default function Page() {
    const {id} = useParams<{ id: string }>();
    const {showFeedback} = useFeedback();
    const [item, setItem] = useState<Disbursement | null>(null);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState<"approve" | "reject" | null>(null);
    const [processing, setProcessing] = useState(false);
    useEffect(() => {
        disbursementService.getDisbursement(Number(id)).then(setItem).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    async function confirm() {
        if (!item || !action) return;
        setProcessing(true);
        try {

            if (action === 'approve') {
                const updated = await disbursementService.approveDisbursement(item.id);
                setItem({...item, ...updated});
                setAction(null);
                showFeedback("success", "Disbursement Approved", "Disbursement has been approved successfully.");
            } else if (action === "reject") {
                const updated = await disbursementService.rejectDisbursement(item.id);
                setItem({...item, ...updated});
                setAction(null);
                showFeedback("success", "Disbursement Rejected", "Disbursement has been rejected.");
            }
        } catch {
            showFeedback("error", "Update failed", "Please try again.");
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <Loader2 className="h-7 w-7 animate-spin"/>;
    if (!item) return <PageHeader title="Disbursement Not Found" description="Could not load disbursement."
                                  icon={Banknote}/>;
    const c = item.client, p = item.product;
    return <div className="space-y-6"><PageHeader title={item.disbursementNumber || `Disbursement #${item.id}`}
                                                  description="Detailed disbursement summary" icon={Banknote}
                                                  action={<div className="flex gap-2"><Button variant="outline" asChild><Link
                                                      href="/disbursements"
                                                      className="flex items-center gap-2 whitespace-nowrap"><ArrowLeft/>Back</Link></Button>{item.status === "pending" && <>
                                                      <Button onClick={() => setAction("approve")}><CheckCircle2/>Approve</Button><Button
                                                      variant="danger" onClick={() => setAction("reject")}><XCircle/>Reject</Button><Button
                                                      asChild><Link href={`/disbursements/${item.id}/edit`}
                                                                    className="flex items-center gap-2 whitespace-nowrap"><Edit/>Edit</Link></Button></>}
                                                  </div>}/>
        <Card className="p-6">
            <div className="mb-5 flex justify-between"><h2 className="text-lg font-semibold">Disbursement Summary</h2>
                <Badge
                    variant={item.status === "disbursed" ? "success" : item.status === "approved" ? "warning" : item.status === "rejected" || item.status === "cancelled" ? "danger" : "neutral"}>{item.status}</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <D l="Client" v={c ? `${c.firstName} ${c.lastName}` : String(item.clientId)}/>
                <D l="Product" v={p?.name || String(item.productId)}/><D l="Principal" v={money(item.principalAmount)}/>
                <D l="Total Charges" v={money(item.totalCharges)}/><D l="Total Amount" v={money(item.totalAmount)}/>
                <D l="Application Date" v={date(item.applicationDate)}/>
                <D l="Approval Date" v={date(item.approvalDate)}/>
                <D l="Disbursement Date" v={date(item.disbursementDate)}/>
                <D l="Tenure Units" v={String(item.tenureUnits)}/>
                <D l="Tenure Units" v={String(item.tenure)}/>
            </div>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2"><Card className="p-6"><h2
            className="mb-4 text-lg font-semibold">Client Details</h2><D l="Full Name"
                                                                         v={c ? `${c.firstName} ${c.middleName || ""} ${c.lastName}`.replace(/\s+/g, " ") : "—"}/><D
            l="Client Number" v={c?.clientNumber || "—"}/><D l="National ID" v={c?.nationalId || "—"}/><D l="Phone"
                                                                                                          v={c?.phone || "—"}/><D
            l="Email" v={c?.email || "—"}/></Card><Card className="p-6"><h2
            className="mb-4 text-lg font-semibold">Branch & Group</h2><D l="Branch"
                                                                         v={c?.branch ? `${c.branch.name} (${c.branch.branchCode})` : c?.branchName || "—"}/><D
            l="Manager" v={c?.branch?.manager || "—"}/><D l="Location" v={c?.branch?.location || "—"}/><D l="Group"
                                                                                                          v={c?.group?.title || c?.groupName || "—"}/><D
            l="Group Chair" v={c?.group?.chair || "—"}/></Card></div>
        <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Product Details</h2>
            <div className="grid gap-4 sm:grid-cols-2"><D l="Name" v={p?.name || "—"}/><D l="Code"
                                                                                          v={p?.code || "—"}/><D
                l="Payment Term" v={p?.paymentTerm || "—"}/><D l="Status" v={p?.status || "—"}/><D l="Description"
                                                                                                   v={p?.description || "—"}/><D
                l="Created By" v={p?.createdBy || "—"}/></div>
        </Card>
        <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Charges &
            Calculation</h2>{item.charges?.length ? item.charges.map(x => {
            const pc = x.productChargeRecord?.productCharge;
            const rate = x.productChargeRecord?.value ?? x.value;
            const amount = pc?.type === "percentage" ? item.principalAmount * rate / 100 : rate;
            return <div className="mb-3 rounded-lg border p-4" key={x.id}>
                <div className="grid gap-3 sm:grid-cols-4"><D l="Charge"
                                                              v={pc?.name || `Charge #${x.productChargeRecordId}`}/><D
                    l="Code" v={pc?.code || "—"}/><D l="Type"
                                                     v={pc?.type === "percentage" ? "Percentage" : "Fixed Amount"}/><D
                    l="Rate" v={pc?.type === "percentage" ? `${rate}%` : money(rate)}/><D l="Amount" v={money(amount)}/>
                </div>
                <p className="mt-2 text-sm text-muted">{x.description || pc?.description || "No description"}</p></div>
        }) : <p className="text-sm text-muted">No charges recorded.</p>}</Card>
        <ConfirmDialog open={action !== null}
                       title={action === "approve" ? "Approve Disbursement?" : "Reject Disbursement?"}
                       description={action === "approve" ? "Approve this pending disbursement?" : "Reject and cancel this pending disbursement?"}
                       confirmText={action === "approve" ? "Approve" : "Reject"}
                       variant={action === "approve" ? "save" : "delete"} loading={processing} onConfirm={confirm}
                       onCancel={() => setAction(null)}/></div>;
}

function D({l, v}: { l: string; v: string }) {
    return <div className="mb-3"><p className="text-xs text-muted">{l}</p><p
        className="mt-1 text-sm font-medium">{v}</p></div>
}
