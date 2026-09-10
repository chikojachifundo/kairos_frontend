
import api from "@/lib/api";

import type { Group } from "@/types/group";

export interface GroupPaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface GroupPaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface GroupListResponse {
    data: Group[];
    links: GroupPaginationLinks;
    meta: GroupPaginationMeta;
}

export interface GroupResponse {
    data: Group;
}

export const groupService = {
    async getGroups(page = 1): Promise<GroupListResponse> {
        const response = await api.get<GroupListResponse>(
            `/groups?page=${page}`,
        );

        return response.data;
    },

    async getGroup(id: number): Promise<Group> {
        const response = await api.get<GroupResponse>(
            `/groups/${id}`,
        );

        return response.data.data;
    },

    async createGroup(data: Partial<Group>): Promise<Group> {
        const response = await api.post<GroupResponse>(
            "/groups",
            data,
        );

        return response.data.data;
    },

    async updateGroup(
        id: number,
        data: Partial<Group>,
    ): Promise<Group> {
        const response = await api.put<GroupResponse>(
            `/groups/${id}`,
            data,
        );

        return response.data.data;
    },

    async deleteGroup(id: number): Promise<void> {
        await api.delete(`/groups/${id}`);
    },
};

