import api from "@/lib/api";
import type {Disbursement, DisbursementStatus} from "@/types/disbursement";

export interface DisbursementResponse {
    data: Disbursement;
}

export interface DisbursementListResponse {
    data: Disbursement[];
    meta?: { current_page: number; last_page: number; total: number };
}

export interface DisbursementPayload {
    clientId: number;
    productId: number;
    applicationDate: string;
    approvalDate?: string | null;
    disbursementDate: string;
    principalAmount: number;
    tenure: number;
    tenureUnits: Disbursement["tenureUnits"];
    status: DisbursementStatus;
    notes?: string;
}

function normalizeDisbursement(disbursement: Disbursement): Disbursement {
    const embeddedCharges = disbursement.charges ?? [];
    const principal = Number(disbursement.principalAmount || 0);
    const calculatedCharges = embeddedCharges.reduce((total, charge) => {
        const rate = Number(
            charge.productChargeRecord?.value ?? charge.value ?? 0,
        );
        const type = charge.productChargeRecord?.productCharge?.type;

        return total + (
            type === "percentage"
                ? principal * rate / 100
                : rate
        );
    }, 0);
    const totalCharges = embeddedCharges.length > 0
        ? calculatedCharges
        : Number(disbursement.totalCharges || 0);
    const totalAmount = embeddedCharges.length > 0
        ? principal + totalCharges
        : Number(disbursement.totalAmount || 0) || principal + totalCharges;

    return {
        ...disbursement,
        totalCharges,
        totalAmount,
    };
}

export const disbursementService = {
    async getDisbursements(page = 1): Promise<DisbursementListResponse> {
        const response = (await api.get<DisbursementListResponse>(`/disbursements?page=${page}`)).data;
        return {
            ...response,
            data: response.data.map(normalizeDisbursement),
        };
    },
    async getDisbursement(id: number): Promise<Disbursement> {
        const response = (await api.get<DisbursementResponse>(`/disbursements/${id}`)).data;
        return normalizeDisbursement(response.data);
    },
    async createDisbursement(data: DisbursementPayload): Promise<Disbursement> {
        return (await api.post<DisbursementResponse>("/disbursements", data)).data.data;
    },
    async updateDisbursement(id: number, data: Partial<DisbursementPayload>): Promise<Disbursement> {
        return (await api.put<DisbursementResponse>(`/disbursements/${id}`, data)).data.data;
    },
    async deleteDisbursement(id: number): Promise<void> {
        await api.delete(`/disbursements/${id}`);
    },

    async approveDisbursement(id:number): Promise<Disbursement> {
        return (await api.post<DisbursementResponse>(`/disbursements/${id}/approve`)).data.data
    },
    async rejectDisbursement(id:number): Promise<Disbursement> {
        return (await api.post<DisbursementResponse>(`/disbursements/${id}/reject`)).data.data
    }
};
