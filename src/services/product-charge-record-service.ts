import api from "@/lib/api";
import type {ProductChargeRecord, ProductChargeRecordStatus} from "@/types/product-charge-record";

export interface ProductChargeRecordResponse { data: ProductChargeRecord; }
export interface ProductChargeRecordListResponse {
    data: ProductChargeRecord[];
    meta?: {current_page: number; last_page: number; total: number;};
}
export interface ProductChargeRecordPayload {
    productId: number;
    productChargeId: number;
    value: number;
    status: ProductChargeRecordStatus;
    description: string;
}

export const productChargeRecordService = {
    async getProductChargeRecords(productId?: number): Promise<ProductChargeRecordListResponse> {
        const suffix = productId ? `?productId=${productId}` : "";
        const response = await api.get<ProductChargeRecordListResponse>(`/product-charge-records${suffix}`);
        return response.data;
    },
    async getProductChargeRecord(id: number): Promise<ProductChargeRecord> {
        const response = await api.get<ProductChargeRecordResponse>(`/product-charge-records/${id}`);
        return response.data.data;
    },
    async createProductChargeRecord(data: ProductChargeRecordPayload): Promise<ProductChargeRecord> {
        const response = await api.post<ProductChargeRecordResponse>("/product-charge-records", data);
        return response.data.data;
    },
    async updateProductChargeRecord(id: number, data: Partial<ProductChargeRecordPayload>): Promise<ProductChargeRecord> {
        const response = await api.put<ProductChargeRecordResponse>(`/product-charge-records/${id}`, data);
        return response.data.data;
    },
    async deleteProductChargeRecord(id: number): Promise<void> {
        await api.delete(`/product-charge-records/${id}`);
    },
};
