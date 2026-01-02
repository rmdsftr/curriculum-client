import api from "./api";
import { AuthService } from "./auth.service";

// Types
export interface CPL {
    id_cpl: string;
    deskripsi: string;
    id_kurikulum: string;
}

export interface IndikatorCPL {
    id_indikator: string;
    deskripsi: string;
}

export interface MataKuliahInCPL {
    id_matkul: string;
    mata_kuliah: string;
    sks: number;
    semester: number;
}

export interface CPLDetailResponse {
    cpl: {
        id_cpl: string;
        deskripsi: string;
    };
    kurikulum: {
        id_kurikulum: string;
        nama_kurikulum: string;
        revisi: string;
    } | null;
    indikator: IndikatorCPL[];
    mata_kuliah: MataKuliahInCPL[];
}

export interface CreateCPLRequest {
    id_cpl: string;
    deskripsi: string;
}

export interface UpdateCPLRequest {
    deskripsi?: string;
}

export interface CPLMutationResponse {
    message: string;
    cpl: CPL;
}

export interface ActiveCPLItem {
    id_cpl: string;
    deskripsi: string;
    kurikulum: {
        id_kurikulum: string;
        nama_kurikulum: string;
        revisi: string;
        status_kurikulum: string;
    } | null;
}

export interface ActiveCPLResponse {
    total: number;
    data: ActiveCPLItem[];
}

export const CPLService = {
    // Get all CPL from active kurikulum
    getFromActiveKurikulum: async (): Promise<ActiveCPLResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<ActiveCPLResponse>('/cpl/kurikulum-aktif', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Get CPL detail
    getDetail: async (id_kurikulum: string, id_cpl: string): Promise<CPLDetailResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<CPLDetailResponse>(`/cpl/${id_kurikulum}/${id_cpl}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Create new CPL
    create: async (id_kurikulum: string, data: CreateCPLRequest): Promise<CPLMutationResponse> => {
        const token = AuthService.getToken();
        const response = await api.post<CPLMutationResponse>(`/cpl/${id_kurikulum}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Update CPL
    update: async (id_kurikulum: string, id_cpl: string, data: UpdateCPLRequest): Promise<CPLMutationResponse> => {
        const token = AuthService.getToken();
        const response = await api.patch<CPLMutationResponse>(`/cpl/${id_kurikulum}/${id_cpl}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Delete CPL
    delete: async (id_kurikulum: string, id_cpl: string): Promise<void> => {
        const token = AuthService.getToken();
        await api.delete(`/cpl/${id_kurikulum}/${id_cpl}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
};
