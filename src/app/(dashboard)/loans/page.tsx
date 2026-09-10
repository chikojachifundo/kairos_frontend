"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {Banknote, Eye, Loader2} from "lucide-react";
import {PageHeader} from "@/components/ui/page-header";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {loanService} from "@/services/loan-service";
import type {Loan} from "@/types/loan";

const money = (value: number) => new Intl.NumberFormat("en-MW", {style: "currency", currency: "MWK", maximumFractionDigits: 0}).format(value || 0);

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loanService.getLoans().then((response) => setLoans(response.data)).catch(() => setError("Unable to load loans.")).finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => loans.filter((loan) => {
        const query = search.toLowerCase();
        const client = loan.client;
        const name = client ? `${client.firstName} ${client.middleName || ""} ${client.lastName}`.toLowerCase() : "";
        return !query || name.includes(query) || client?.nationalId?.toLowerCase().includes(query) || client?.groupName?.toLowerCase().includes(query) || client?.branchName?.toLowerCase().includes(query) || String(loan.id).includes(query) || String(loan.disbursementId).includes(query);
    }), [loans, search]);

    return <div className="space-y-6"><PageHeader title="Loans" description="View and manage client loans." icon={Banknote}/><Card className="p-5"><Input placeholder="Search loan, client, national ID, group or branch..." value={search} onChange={(event) => setSearch(event.target.value)}/></Card><Card className="overflow-hidden"><div className="overflow-x-auto">{loading ? <div className="p-10 text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin"/></div> : error ? <p className="p-8 text-center text-sm text-error">{error}</p> : <table className="w-full min-w-[1250px] text-sm"><thead><tr className="border-b bg-surface-low"><th className="p-4 text-left">Loan ID</th><th className="p-4 text-left">Client</th><th className="p-4 text-left">National ID</th><th className="p-4 text-left">Group</th><th className="p-4 text-left">Branch</th><th className="p-4 text-left">Tenure</th><th className="p-4 text-left">Disbursement</th><th className="p-4 text-right">Balance</th><th className="p-4 text-left">Status</th><th className="p-4"/></tr></thead><tbody>{filtered.map((loan) => {const client=loan.client; const disbursement=loan.disbursement; return <tr key={loan.id} className="border-b"><td className="p-4 font-mono">#{loan.id}</td><td className="p-4"><p className="font-medium">{client ? `${client.firstName} ${client.middleName || ""} ${client.lastName}` : `Client #${loan.clientId}`}</p><p className="text-xs text-muted">{client?.clientNumber || "—"}</p></td><td className="p-4">{client?.nationalId || "—"}</td><td className="p-4">{client?.group?.title || client?.groupName || "Unknown Group"}</td><td className="p-4">{client?.branch?.name || client?.branchName || "Unknown Branch"}</td><td className="p-4">{disbursement?.tenure ? `${disbursement.tenure} ${disbursement.tenureUnits || "months"}` : "—"}</td><td className="p-4"><Link className="text-primary hover:underline" href={`/disbursements/${loan.disbursementId}`}>#{loan.disbursementId}</Link></td><td className="p-4 text-right font-semibold">{money(loan.balance)}</td><td className="p-4"><Badge variant={loan.status === "active" ? "success" : "neutral"}>{loan.status}</Badge></td><td className="p-4"><Link href={`/loans/${loan.id}`}><Eye className="h-4 w-4"/></Link></td></tr>;})}</tbody></table>}</div></Card></div>;
}
