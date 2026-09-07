import type { Product } from "@/types/product";
import type { ProductCharge } from "@/types/product-charge";
import type { ProductChargeRecord } from "@/types/product-charge-record";

export const mockProducts: Product[] = [
    {
        id: 1,
        code: "BL001",
        name: "Business Loan",
        paymentTerm: "monthly",
        status: "active",
        description:
            "Loan product designed for small and medium-sized businesses.",
        createdBy: "System Administrator",
        approvedBy: "Finance Manager",
    },
    {
        id: 2,
        code: "SL001",
        name: "Salary Loan",
        paymentTerm: "monthly",
        status: "active",
        description:
            "Short-term financing facility for salaried employees.",
        createdBy: "System Administrator",
        approvedBy: "Finance Manager",
    },
    {
        id: 3,
        code: "STL001",
        name: "Short Term Loan",
        paymentTerm: "weekly",
        status: "inactive",
        description:
            "Short-term loan product with weekly repayment requirements.",
        createdBy: "System Administrator",
        approvedBy: "Finance Manager",
    },
];

export const mockProductCharges: ProductCharge[] = [
    {
        id: 1,
        code: "INTEREST",
        name: "Interest",
        type: "percentage",
        status: "active",
        description: "Interest charged on the loan.",
    },
    {
        id: 2,
        code: "COLLECTION",
        name: "Collection Fees",
        type: "percentage",
        status: "active",
        description: "Fees charged for loan collection.",
    },
    {
        id: 3,
        code: "LEDGER",
        name: "Ledger Fees",
        type: "fixed-amount",
        status: "active",
        description: "Ledger maintenance fee.",
    },
    {
        id: 4,
        code: "ADMIN",
        name: "Administration Fees",
        type: "fixed-amount",
        status: "active",
        description: "Administrative processing fee.",
    },
    {
        id: 5,
        code: "PROCESSING",
        name: "Processing Fees",
        type: "fixed-amount",
        status: "active",
        description: "Loan processing fee.",
    },
    {
        id: 6,
        code: "TRANSACTION",
        name: "Transaction Fees",
        type: "fixed-amount",
        status: "active",
        description: "Transaction processing fee.",
    },
    {
        id: 7,
        code: "CRB",
        name: "Credit Reference Bureau",
        type: "fixed-amount",
        status: "active",
        description: "Credit reference bureau fee.",
    },
    {
        id: 8,
        code: "INSURANCE",
        name: "Insurance",
        type: "percentage",
        status: "active",
        description: "Loan insurance charge.",
    },
];

export const mockProductChargeRecords: ProductChargeRecord[] = [
    {
        id: 1,
        productId: 1,
        productChargeId: 1,
        value: 15,
        status: "active",
        description: "Business loan interest rate.",
    },
    {
        id: 2,
        productId: 1,
        productChargeId: 3,
        value: 500,
        status: "active",
        description: "Ledger fee per loan.",
    },
    {
        id: 3,
        productId: 1,
        productChargeId: 5,
        value: 2500,
        status: "active",
        description: "Business loan processing fee.",
    },
    {
        id: 4,
        productId: 1,
        productChargeId: 8,
        value: 2,
        status: "active",
        description: "Business loan insurance.",
    },

    {
        id: 5,
        productId: 2,
        productChargeId: 1,
        value: 12,
        status: "active",
        description: "Salary loan interest rate.",
    },
    {
        id: 6,
        productId: 2,
        productChargeId: 5,
        value: 1500,
        status: "active",
        description: "Salary loan processing fee.",
    },
    {
        id: 7,
        productId: 2,
        productChargeId: 8,
        value: 1.5,
        status: "active",
        description: "Salary loan insurance.",
    },
];