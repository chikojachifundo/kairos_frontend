import api from "@/lib/api";
import type {Loan} from "@/types/loan";
export interface LoanListResponse {data: Loan[]; links?: Record<string, unknown>; meta?: Record<string, unknown>;}
export interface LoanResponse {data: Loan;}
export const loanService = {
    async getLoans(page = 1): Promise<LoanListResponse> { return (await api.get<LoanListResponse>(`/loans?page=${page}`)).data; },
    async getLoan(id: number): Promise<Loan> { return (await api.get<LoanResponse>(`/loans/${id}`)).data.data; },
};
