import api from "./api";
import { AuthService } from "./auth.service";

// Types
export interface Kurikulum {
    id_kurikulum: string;
    nama_kurikulum: string;
    revisi: string;
    status_kurikulum: 'aktif' | 'nonaktif';
    created_at: string;
    updated_at: string;
}

export interface CPLInKurikulum {
    id_cpl: string;
    deskripsi: string;
}

export interface KurikulumListResponse {
    total: number;
    data: Kurikulum[];
}

export interface KurikulumDetailResponse {
    kurikulum: Kurikulum & {
        cpl: CPLInKurikulum[];
    };
}

export const KurikulumService = {
    // Get all kurikulum
    getAll: async (): Promise<KurikulumListResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<KurikulumListResponse>('/kurikulum/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Get kurikulum detail with CPL list
    getDetail: async (id_kurikulum: string): Promise<KurikulumDetailResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<KurikulumDetailResponse>(`/kurikulum/${id_kurikulum}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
};

