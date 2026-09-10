
import api from "@/lib/api";
import type { Client, EmploymentStatus, Gender } from "@/types/client";

export type ClientPayload = Partial<
    Omit<Client, "dateOfBirth" | "gender" | "employmentStatus">
> & {
    dateOfBirth?: string | null;
    gender?: Gender;
    employmentStatus?: EmploymentStatus | null;
};

export interface ClientPaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface ClientPaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface ClientListResponse {
    data: Client[];
    links: ClientPaginationLinks;
    meta: ClientPaginationMeta;
}

export interface ClientResponse {
    data: Client;
}

function normalizeClient(client: Client): Client {
    return {
        ...client,
        branchName: client.branchName || client.branch?.name || "Unknown Branch",
        groupName: client.groupName || client.group?.title || "Unknown Group",
    };
}

export const clientService = {
    async getClients(page = 1): Promise<ClientListResponse> {
        const response = await api.get<ClientListResponse>(
            `/clients?page=${page}`,
        );

        return {
            ...response.data,
            data: response.data.data.map(normalizeClient),
        };
    },

    async getClient(id: number): Promise<Client> {
        const response = await api.get<ClientResponse>(
            `/clients/${id}`,
        );

        return normalizeClient(response.data.data);
    },

    async createClient(
        data: ClientPayload,
    ): Promise<Client> {
        const response = await api.post<ClientResponse>(
            "/clients",
            data,
        );

        return response.data.data;
    },

    async updateClient(
        id: number,
        data: ClientPayload,
    ): Promise<Client> {
        const response = await api.put<ClientResponse>(
            `/clients/${id}`,
            data,
        );

        return response.data.data;
    },

    async deleteClient(id: number): Promise<void> {
        await api.delete(`/clients/${id}`);
    },
};

