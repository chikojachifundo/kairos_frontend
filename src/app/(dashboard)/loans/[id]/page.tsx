"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Banknote, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loanService } from "@/services/loan-service";
import type { Loan } from "@/types/loan";

const money = (value: number) => new Intl.NumberFormat("en-MW", {
  style: "currency",
  currency: "MWK",
  maximumFractionDigits: 0,
}).format(value || 0);

const date = (value?: string) => value ? new Date(value).toLocaleDateString("en-GB") : "-";

export default function LoanPage() {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loanService.getLoan(Number(id)).then(setLoan).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader2 className="h-7 w-7 animate-spin" />;
  if (!loan) return <PageHeader title="Loan Not Found" description="The requested loan could not be loaded." icon={Banknote} />;

  const client = loan.client;
  const disbursement = loan.disbursement;
  const product = disbursement?.product;

  return (
    <div className="space-y-6">
      <PageHeader title={`Loan #${loan.id}`} description="Loan account details." icon={Banknote} />
      <Card className="p-6">
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-semibold">Loan Summary</h2><Badge variant={loan.status === "active" ? "success" : "neutral"}>{loan.status}</Badge></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <D l="Loan ID" v={`#${loan.id}`} />
          <D l="Client" v={client ? `${client.firstName} ${client.lastName}` : `Client #${loan.clientId}`} />
          <D l="Disbursement" v={`#${loan.disbursementId}`} />
          <Balance value={loan.balance} />
          <D l="Principal" v={money(disbursement?.principalAmount || 0)} />
          <D l="Total Charges" v={money(disbursement?.totalCharges || 0)} />
          <D l="Total Amount" v={money(disbursement?.totalAmount || 0)} />
          <D l="Tenure" v={disbursement?.tenure ? `${disbursement.tenure} ${disbursement.tenureUnits || "months"}` : "-"} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Client</h2><D l="Full Name" v={client ? `${client.firstName} ${client.middleName || ""} ${client.lastName}`.replace(/\s+/g, " ") : "-"} /><D l="Client Number" v={client?.clientNumber || "-"} /><D l="National ID" v={client?.nationalId || "-"} /><D l="Phone" v={client?.phone || "-"} /><D l="Email" v={client?.email || "-"} /></Card>
        <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Branch &amp; Group</h2><D l="Branch" v={client?.branch ? `${client.branch.name} (${client.branch.branchCode})` : client?.branchName || "-"} /><D l="Manager" v={client?.branch?.manager || "-"} /><D l="Group" v={client?.group?.title || client?.groupName || "-"} /><D l="Group Chair" v={client?.group?.chair || "-"} /></Card>
      </div>

      <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Loan Product</h2><D l="Product" v={product?.name || "-"} /><D l="Code" v={product?.code || "-"} /><D l="Payment Term" v={product?.paymentTerm || "-"} /><D l="Description" v={product?.description || "-"} /></Card>
      <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Disbursement</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><D l="Application" v={date(disbursement?.applicationDate)} /><D l="Approval" v={date(disbursement?.approvalDate)} /><D l="Disbursed" v={date(disbursement?.disbursementDate)} /><D l="Status" v={disbursement?.status || "-"} /></div></Card>
      <Card className="p-6"><h2 className="mb-4 text-lg font-semibold">Charges</h2>{disbursement?.charges?.length ? disbursement.charges.map((charge) => { const detail = charge.productChargeRecord?.productCharge; const rate = charge.productChargeRecord?.value ?? charge.value; const amount = detail?.type === "percentage" ? (disbursement.principalAmount * rate) / 100 : rate; return <div className="mb-3 rounded border p-4" key={charge.id}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><D l="Name" v={detail?.name || "-"} /><D l="Code" v={detail?.code || "-"} /><D l="Type" v={detail?.type || "fixed-amount"} /><D l="Rate" v={detail?.type === "percentage" ? `${rate}%` : money(rate)} /><D l="Amount" v={money(amount)} /></div><p className="mt-2 text-sm text-muted">{charge.description || detail?.description || "No description"}</p></div>; }) : <p className="text-sm text-muted">No charges recorded.</p>}</Card>
    </div>
  );
}

function D({ l, v }: { l: string; v: string }) { return <div className="mb-3"><p className="text-xs text-muted">{l}</p><p className="mt-1 text-sm font-medium">{v}</p></div>; }
function Balance({ value }: { value: number }) { return <div className="rounded-lg border border-primary/30 bg-primary/10 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Outstanding Balance</p><p className="mt-1 text-2xl font-bold text-primary">{money(value)}</p></div>; }
