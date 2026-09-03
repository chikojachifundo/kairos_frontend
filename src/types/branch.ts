
export type BranchStatus = "active" | "inactive";

export type BranchType =
  | "head_office"
  | "regional"
  | "branch"
  | "satellite";

export interface Branch {
  id: number;
  branchCode: string;
  name: string;
  type: BranchType;
  manager: string;
  phone: string;
  email: string;
  location: string;
  activeClients: number;
  activeLoans: number;
  status: BranchStatus;
}

export interface BranchFormData {
  branchCode: string;
  name: string;
  type: BranchType | "";
  status: BranchStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  manager: string;
  openingDate: string;
  notes: string;
}
