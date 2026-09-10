import {Branch} from "@/types/branch";
import {Group} from "@/types/group";

export type ClientStatus = "active" | "inactive";

export type Gender = "male" | "female" | "other";

export type EmploymentStatus =
    | "employed"
    | "self_employed"
    | "business_owner"
    | "unemployed"
    | "other";

export interface Client {
    id: number;

    // Identification
    clientNumber: string;
    nationalId: string;

    // Personal Information
    firstName: string;
    middleName: string;
    lastName: string;
    gender: Gender;
    dateOfBirth: string;

    // Contact
    phone: string;
    alternativePhone: string;
    email: string;

    // Address
    address: string;
    city: string;
    region: string;

    // Organisation
    branchId: number;
    branchName: string;
    groupId: number;
    groupName: string;

    // Employment / Business
    employmentStatus: EmploymentStatus;
    employer: string;
    occupation: string;
    monthlyIncome: number;

    // Account
    status: ClientStatus;
    registrationDate: string;
    deactivatedAt?: string;
    deactivationReason?: string;

    // Loan summary
    activeLoans: number;
    totalLoans: number;
    totalDisbursed: number;
    totalRepaid: number;
    outstandingBalance: number;

    notes: string;

    /** Expanded relationships returned by the API. */
    branch?: Branch;
    group?: Group;
}

export interface ClientFormData {
    clientNumber: string;
    nationalId: string;

    firstName: string;
    middleName: string;
    lastName: string;
    gender: Gender | "";
    dateOfBirth: string;

    phone: string;
    alternativePhone: string;
    email: string;

    address: string;
    city: string;
    region: string;

    branchId: number | "";
    groupId: number | "";

    employmentStatus: EmploymentStatus | "";
    employer: string;
    occupation: string;
    monthlyIncome: string;

    status: ClientStatus;
    registrationDate: string;

    notes: string;

    branch?: Branch;
    group?: Group;
}
