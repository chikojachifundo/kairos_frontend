export type ChargeType = "percentage" | "fixed-amount";

export type Status = "active" | "inactive";

export interface ProductCharge {
    id: number;
    code: string;
    name: string;
    type: ChargeType;
    status: Status;
    description?: string;
}