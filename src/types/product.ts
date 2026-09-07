export  type ProductStatus = "active" | "inactive";

export type PaymentTerm =
    | "daily"
    | "weekly"
    | "biweekly"
    | "monthly"
    | "quarterly"
    | "annually";


export interface Product {
    id: number;
    code: string;
    name: string;
    paymentTerm: PaymentTerm;
    status: ProductStatus;
    description?: string;

    createdBy: string;
    approvedBy: string;
}


export interface ProductFormData {
    code: string;
    name: string;
    paymentTerm: PaymentTerm | "";
    status: ProductStatus;
    description?: string;
}