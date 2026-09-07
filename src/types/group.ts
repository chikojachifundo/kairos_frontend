export type GroupStatus = "active" | "inactive";

export interface Group {
    id: number;
    title: string;
    chair: string;
    cellphone: string;
    viceChair: string;
    viceChairCell: string;
    description: string;
    status: GroupStatus;
    branchId: number;
    branchName: string;
    memberCount: number;
}

export interface GroupFormData {
    title: string;
    chair: string;
    cellphone: string;
    viceChair: string;
    viceChairCell: string;
    description: string;
    status: GroupStatus;
    branchId: number | "";
}