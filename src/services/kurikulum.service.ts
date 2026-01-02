import api from "./api";
import { AuthService } from "./auth.service";

// Types
export interface Kurikulum {
    id_kurikulum: number;
    nama_kurikulum: string;
    revisi: string;
    status_kurikulum: 'Aktif' | 'Nonaktif';
    created_at: string;
    updated_at: string;
}

export interface KurikulumListResponse {
    total: number;
    data: Kurikulum[];
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
};
