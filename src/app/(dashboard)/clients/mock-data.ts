import type {Client} from "@/types/client";

export const mockClients: Client[] = [
    {
        id: 1,
        clientNumber: "CL-000001",
        nationalId: "M12345678",
        firstName: "John",
        middleName: "James",
        lastName: "Phiri",
        gender: "male",
        dateOfBirth: "1988-04-12",

        phone: "0999 123 456",
        alternativePhone: "0888 123 456",
        email: "john.phiri@example.com",

        address: "Area 25",
        city: "Lilongwe",
        region: "Central",

        branchId: 1,
        branchName: "Lilongwe Branch",
        groupId: 1,
        groupName: "Area 25 Group",

        employmentStatus: "employed",
        employer: "ABC Limited",
        occupation: "Accountant",
        monthlyIncome: 650000,

        status: "active",
        registrationDate: "2025-01-15",

        activeLoans: 2,
        totalLoans: 4,
        totalDisbursed: 3500000,
        totalRepaid: 2100000,
        outstandingBalance: 1400000,

        notes: "",
    },

    {
        id: 2,
        clientNumber: "CL-000002",
        nationalId: "M23456789",
        firstName: "Mary",
        middleName: "",
        lastName: "Banda",
        gender: "female",
        dateOfBirth: "1992-08-20",

        phone: "0888 456 789",
        alternativePhone: "",
        email: "mary.banda@example.com",

        address: "Area 47",
        city: "Lilongwe",
        region: "Central",

        branchId: 1,
        branchName: "Lilongwe Branch",
        groupId: 2,
        groupName: "Area 47 Women Group",

        employmentStatus: "business_owner",
        employer: "",
        occupation: "Retailer",
        monthlyIncome: 850000,

        status: "active",
        registrationDate: "2025-03-10",

        activeLoans: 1,
        totalLoans: 2,
        totalDisbursed: 2000000,
        totalRepaid: 1250000,
        outstandingBalance: 750000,

        notes: "",
    },

    {
        id: 3,
        clientNumber: "CL-000003",
        nationalId: "M34567890",
        firstName: "Peter",
        middleName: "Andrew",
        lastName: "Chirwa",
        gender: "male",
        dateOfBirth: "1985-02-14",

        phone: "0998 222 333",
        alternativePhone: "",
        email: "",

        address: "Zomba Urban",
        city: "Zomba",
        region: "Southern",

        branchId: 2,
        branchName: "Zomba Branch",
        groupId: 3,
        groupName: "Zomba Business Group",

        employmentStatus: "self_employed",
        employer: "",
        occupation: "Trader",
        monthlyIncome: 550000,

        status: "active",
        registrationDate: "2025-05-22",

        activeLoans: 1,
        totalLoans: 3,
        totalDisbursed: 1800000,
        totalRepaid: 1200000,
        outstandingBalance: 600000,

        notes: "",
    },

    {
        id: 4,
        clientNumber: "CL-000004",
        nationalId: "M45678901",
        firstName: "Grace",
        middleName: "",
        lastName: "Mbewe",
        gender: "female",
        dateOfBirth: "1990-11-03",

        phone: "0888 777 111",
        alternativePhone: "",
        email: "grace.mbewe@example.com",

        address: "Blantyre CBD",
        city: "Blantyre",
        region: "Southern",

        branchId: 3,
        branchName: "Blantyre Branch",
        groupId: 4,
        groupName: "Blantyre Traders Group",

        employmentStatus: "self_employed",
        employer: "",
        occupation: "Shop Owner",
        monthlyIncome: 900000,

        status: "inactive",
        registrationDate: "2024-11-18",
        deactivatedAt: "2026-02-10",
        deactivationReason: "Client account closed",

        activeLoans: 0,
        totalLoans: 2,
        totalDisbursed: 1200000,
        totalRepaid: 1200000,
        outstandingBalance: 0,

        notes: "",
    },
];

