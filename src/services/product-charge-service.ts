import api from "@/lib/api";
import type {ChargeType, ProductCharge, Status} from "@/types/product-charge";

export interface ProductChargePaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface ProductChargeListResponse {
    data: ProductCharge[];
    meta: ProductChargePaginationMeta;
}

export interface ProductChargeResponse {
    data: ProductCharge;
}

export interface ProductChargePayload {
    code: string;
    name: string;
    type: ChargeType;
    status: Status;
    description?: string;
}

export const productChargeService = {
    async getProductCharges(page = 1): Promise<ProductChargeListResponse> {
        const response = await api.get<ProductChargeListResponse>(`/product-charges?page=${page}`);
        return response.data;
    },

    async getProductCharge(id: number): Promise<ProductCharge> {
        const response = await api.get<ProductChargeResponse>(`/product-charges/${id}`);
        return response.data.data;
    },

    async createProductCharge(data: ProductChargePayload): Promise<ProductCharge> {
        const response = await api.post<ProductChargeResponse>("/product-charges", data);
        return response.data.data;
    },

    async updateProductCharge(id: number, data: Partial<ProductChargePayload>): Promise<ProductCharge> {
        const response = await api.put<ProductChargeResponse>(`/product-charges/${id}`, data);
        return response.data.data;
    },

    async deleteProductCharge(id: number): Promise<void> {
        await api.delete(`/product-charges/${id}`);
    },
};
