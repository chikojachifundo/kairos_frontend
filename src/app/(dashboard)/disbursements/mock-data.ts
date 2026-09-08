import type { Disbursement } from "@/types/disbursement";
import type { DisbursementCharge } from "@/types/disbursement-charge";

export const mockDisbursements: Disbursement[] = [
    {
        id: 1,
        disbursementNumber: "DIS-20260901-0001",

        clientId: 1,
        productId: 1,
        branchId: 1,
        groupId: 1,

        applicationDate: "2026-08-28",
        approvalDate: "2026-08-30",
        disbursementDate: "2026-09-01",

        principalAmount: 100000,
        totalCharges: 22000,
        totalAmount: 122000,

        status: "disbursed",

        createdBy: "Chifundo Chikoja",
        approvedBy: "Branch Manager",

        notes: "Standard business loan disbursement.",
    },
    {
        id: 2,
        disbursementNumber: "DIS-20260902-0002",

        clientId: 2,
        productId: 2,
        branchId: 1,
        groupId: 2,

        applicationDate: "2026-09-01",
        approvalDate: "2026-09-02",
        disbursementDate: "2026-09-02",

        principalAmount: 150000,
        totalCharges: 32000,
        totalAmount: 182000,

        status: "approved",

        createdBy: "Chifundo Chikoja",
        approvedBy: "Branch Manager",

        notes: "Approved pending disbursement.",
    },
    {
        id: 3,
        disbursementNumber: "DIS-20260903-0003",

        clientId: 3,
        productId: 1,
        branchId: 2,
        groupId: 3,

        applicationDate: "2026-09-03",
        disbursementDate: "2026-09-03",

        principalAmount: 75000,
        totalCharges: 16500,
        totalAmount: 91500,

        status: "pending",

        createdBy: "Chifundo Chikoja",

        notes: "Awaiting approval.",
    },
];


export const mockDisbursementCharges: DisbursementCharge[] = [
    // ---------------------------------------------------------
    // Disbursement #1
    // ---------------------------------------------------------

    {
        id: 1,
        disbursementId: 1,

        productChargeId: 1,

        code: "INTEREST",
        name: "Interest",
        type: "percentage",

        rate: 15,
        amount: 15000,

        description: "Standard interest rate at time of disbursement.",
    },

    {
        id: 2,
        disbursementId: 1,

        productChargeId: 5,

        code: "PROCESSING",
        name: "Processing Fee",
        type: "fixed-amount",

        rate: 5000,
        amount: 5000,

        description: "Loan processing fee.",
    },

    {
        id: 3,
        disbursementId: 1,

        productChargeId: 8,

        code: "INSURANCE",
        name: "Insurance",
        type: "percentage",

        rate: 2,
        amount: 2000,

        description: "Loan insurance charge.",
    },

    // ---------------------------------------------------------
    // Disbursement #2
    // ---------------------------------------------------------

    {
        id: 4,
        disbursementId: 2,

        productChargeId: 1,

        code: "INTEREST",
        name: "Interest",
        type: "percentage",

        rate: 18,
        amount: 27000,

        description: "Interest rate applicable when loan was created.",
    },

    {
        id: 5,
        disbursementId: 2,

        productChargeId: 5,

        code: "PROCESSING",
        name: "Processing Fee",
        type: "fixed-amount",

        rate: 5000,
        amount: 5000,

        description: "Loan processing fee.",
    },

    // ---------------------------------------------------------
    // Disbursement #3
    // ---------------------------------------------------------

    {
        id: 6,
        disbursementId: 3,

        productChargeId: 1,

        code: "INTEREST",
        name: "Interest",
        type: "percentage",

        rate: 15,
        amount: 11250,

        description: "Standard interest rate.",
    },

    {
        id: 7,
        disbursementId: 3,

        productChargeId: 5,

        code: "PROCESSING",
        name: "Processing Fee",
        type: "fixed-amount",

        rate: 5000,
        amount: 5000,

        description: "Loan processing fee.",
    },
];