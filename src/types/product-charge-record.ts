export type ProductChargeRecordStatus = "active" | "inactive";

export interface ProductChargeRecord {
    id: number;
    productId: number;
    productChargeId: number;
    status: ProductChargeRecordStatus;
    value: number;
    description: string;
}