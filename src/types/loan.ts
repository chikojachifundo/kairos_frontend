import type {Client} from "@/types/client";
import type {Disbursement} from "@/types/disbursement";

export type LoanStatus = "active" | "completed" | "defaulted" | "cancelled";
export interface Loan {
    id: number;
    clientId: number;
    disbursementId: number;
    balance: number;
    status: LoanStatus | string;
    client?: Client;
    disbursement?: Disbursement;
}
