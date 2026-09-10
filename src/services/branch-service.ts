import api from "@/lib/api";
import type { Branch } from "@/types/branch";

export interface BranchPaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface BranchPaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface BranchListResponse {
    data: Branch[];
    links: BranchPaginationLinks;
    meta: BranchPaginationMeta;
}

export interface BranchResponse {
    data: Branch;
}

export const branchService = {
    async getBranches(page = 1): Promise<BranchListResponse> {
        const response = await api.get<BranchListResponse>(
            `/branches?page=${page}`,
        );

        return response.data;
    },

    async getBranch(id: number): Promise<Branch> {
        const response = await api.get<BranchResponse>(
            `/branches/${id}`,
        );

        return response.data.data;
    },

    async createBranch(data: Partial<Branch>): Promise<Branch> {
        const response = await api.post<BranchResponse>(
            "/branches",
            data,
        );

        return response.data.data;
    },

    async updateBranch(
        id: number,
        data: Partial<Branch>,
    ): Promise<Branch> {
        const response = await api.put<BranchResponse>(
            `/branches/${id}`,
            data,
        );

        return response.data.data;
    },

    async deleteBranch(id: number): Promise<void> {
        await api.delete(`/branches/${id}`);
    },
};