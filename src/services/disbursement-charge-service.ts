import api from "@/lib/api";
import type {DisbursementCharge, DisbursementChargeType} from "@/types/disbursement-charge";

export interface DisbursementChargeResponse { data: DisbursementCharge; }
export interface DisbursementChargePayload {
    disbursementId: number;
    productChargeId: number;
    code: string;
    name: string;
    type: DisbursementChargeType;
    rate: number;
    amount: number;
    description?: string;
}

export const disbursementChargeService = {
    async createDisbursementCharge(data: DisbursementChargePayload): Promise<DisbursementCharge> {
        const response = await api.post<DisbursementChargeResponse>("/disbursement-charges", data);
        return response.data.data;
    },
};
