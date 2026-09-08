export type DisbursementStatus =
    | "pending"
    | "approved"
    | "disbursed"
    | "cancelled";

export interface Disbursement {
    id: number;
    disbursementNumber: string;

    clientId: number;
    productId: number;
    branchId: number;
    groupId?: number;

    applicationDate: string;
    approvalDate?: string;
    disbursementDate: string;

    principalAmount: number;
    totalCharges: number;
    totalAmount: number;

    status: DisbursementStatus;

    createdBy: string;
    approvedBy?: string;

    notes?: string;
}