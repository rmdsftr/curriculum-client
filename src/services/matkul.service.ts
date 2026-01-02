import api from "./api";
import { AuthService } from "./auth.service";

// Types
export interface CPLItem {
    id_kurikulum: string;
    id_cpl: string;
    deskripsi: string;
}

export interface IndikatorCPL {
    id_indikator: string;
    deskripsi: string;
}

export interface CPLWithIndikator extends CPLItem {
    indikator: IndikatorCPL[];
}

export interface MataKuliah {
    id_matkul: string;
    mata_kuliah: string;
    sks: number;
    semester: number;
    cpl: CPLItem[];
}

export interface MatkulListResponse {
    message: string;
    data: MataKuliah[];
}

export interface MatkulDetailResponse {
    mata_kuliah: {
        id_matkul: string;
        mata_kuliah: string;
        sks: number;
        semester: number;
        created_at: string;
        updated_at: string;
    };
    cpl: CPLWithIndikator[];
}

// Request types
export interface CPLInput {
    id_kurikulum: string;
    id_cpl: string;
}

export interface CreateMatkulRequest {
    id_matkul: string;
    mata_kuliah: string;
    sks: number;
    semester: number;
    cpl_list: CPLInput[];
}

export interface UpdateMatkulRequest {
    mata_kuliah?: string;
    sks?: number;
    semester?: number;
    cpl_list?: CPLInput[];
}

export interface MatkulMutationResponse {
    message: string;
    matkul: {
        id_matkul: string;
        mata_kuliah: string;
        sks: number;
        semester: number;
        created_at: string;
        updated_at: string;
    };
    relasi: {
        id_kurikulum: string;
        id_cpl: string;
        id_matkul: string;
    }[];
}

export const MatkulService = {
    // Get all mata kuliah
    getAll: async (): Promise<MatkulListResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<MatkulListResponse>('/matkul/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Get mata kuliah detail by id
    getDetail: async (id_matkul: string): Promise<MatkulDetailResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<MatkulDetailResponse>(`/matkul/${id_matkul}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Create new mata kuliah
    create: async (data: CreateMatkulRequest): Promise<MatkulMutationResponse> => {
        const token = AuthService.getToken();
        const response = await api.post<MatkulMutationResponse>('/matkul/', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Update mata kuliah
    update: async (id_matkul: string, data: UpdateMatkulRequest): Promise<MatkulMutationResponse> => {
        const token = AuthService.getToken();
        const response = await api.patch<MatkulMutationResponse>(`/matkul/${id_matkul}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Delete mata kuliah by id
    delete: async (id_matkul: string): Promise<void> => {
        const token = AuthService.getToken();
        await api.delete(`/matkul/${id_matkul}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
};

