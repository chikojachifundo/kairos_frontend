export type ClientStatus =
    | "active"
    | "arrears"
    | "inactive";

export interface Client {
    id: number;

    clientNumber: string;

    name: string;
    initials: string;

    group: string;

    phone: string;

    activeLoans: number;

    totalBorrowed: number;

    status: ClientStatus;
}