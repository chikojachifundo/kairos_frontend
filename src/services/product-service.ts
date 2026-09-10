import api from "@/lib/api";
import type { Product, ProductStatus, PaymentTerm } from "@/types/product";

export interface ProductPaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface ProductPaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface ProductListResponse {
    data: Product[];
    links: ProductPaginationLinks;
    meta: ProductPaginationMeta;
}

export interface ProductResponse {
    data: Product;
}

export interface ProductPayload {
    code: string;
    name: string;
    paymentTerm: PaymentTerm;
    status: ProductStatus;
    description?: string;
}

export const productService = {
    async getProducts(page = 1): Promise<ProductListResponse> {
        const response = await api.get<ProductListResponse>(`/products?page=${page}`);
        return response.data;
    },

    async getProduct(id: number): Promise<Product> {
        const response = await api.get<ProductResponse>(`/products/${id}`);
        return response.data.data;
    },

    async createProduct(data: ProductPayload): Promise<Product> {
        const response = await api.post<ProductResponse>("/products", data);
        return response.data.data;
    },

    async updateProduct(id: number, data: Partial<ProductPayload>): Promise<Product> {
        const response = await api.put<ProductResponse>(`/products/${id}`, data);
        return response.data.data;
    },

    async deleteProduct(id: number): Promise<void> {
        await api.delete(`/products/${id}`);
    },
};
