export type DisbursementStatus =
    | "pending"
    | "approved"
    | "disbursed"
    | "cancelled"
    | "rejected";


export type DisbursementTenureUnits =
    | "days"
    | "weeks"
    | "fortnights"
    | "months"
    | "years"

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

    tenureUnits?: DisbursementTenureUnits;
    tenure?: number;


    principalAmount: number;
    totalCharges: number;
    totalAmount: number;

    status: DisbursementStatus;

    createdBy: string;
    approvedBy?: string;

    notes?: string;
    charges?: Array<{
        id: number;
        disbursementId: number;
        productChargeRecordId: number;
        value: number;
        description?: string;
        productChargeRecord?: {
            status?: "active" | "inactive";
            value: number;
            productCharge?: {
                code?: string;
                name?: string;
                type: "percentage" | "fixed-amount";
                description?: string;
            };
        };
    }>;
    client?: {
        clientNumber: string;
        nationalId?: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        phone?: string;
        email?: string;
        branchName?: string;
        groupName?: string;
        branch?: {
            branchCode: string;
            name: string;
            manager?: string;
            phone?: string;
            email?: string;
            location?: string
        };
        group?: {
            title: string;
            chair?: string;
            cellphone?: string;
            viceChair?: string;
            viceChairCell?: string;
            description?: string
        };
    };
    product?: {
        code: string;
        name: string;
        paymentTerm: string;
        status: string;
        description?: string;
        createdBy?: string;
        approvedBy?: string;
    };
}
