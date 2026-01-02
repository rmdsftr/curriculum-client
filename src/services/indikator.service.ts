import api from './api';
import { AuthService } from './auth.service';

export interface Indikator {
    id_indikator: string;
    deskripsi: string;
}

export interface IndikatorDetailResponse {
    id_indikator: string;
    deskripsi: string;
}

export interface CreateIndikatorRequest {
    id_indikator: string;
    deskripsi: string;
}

export interface UpdateIndikatorRequest {
    deskripsi?: string;
}

export const IndikatorService = {
    // Create indikator under a CPL
    // Endpoint: POST /cpl/{id_kurikulum}/{id_cpl}/indikator
    create: async (id_kurikulum: string, id_cpl: string, data: CreateIndikatorRequest) => {
        const token = AuthService.getToken();
        const response = await api.post(`/cpl/${id_kurikulum}/${id_cpl}/indikator`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Get indikator detail
    // Endpoint: GET /cpl/{id_kurikulum}/{id_cpl}/indikator/{id_indikator}
    getDetail: async (id_kurikulum: string, id_cpl: string, id_indikator: string): Promise<IndikatorDetailResponse> => {
        const token = AuthService.getToken();
        const response = await api.get<IndikatorDetailResponse>(
            `/cpl/${id_kurikulum}/${id_cpl}/indikator/${id_indikator}`, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Update indikator
    // Endpoint: PATCH /cpl/{id_kurikulum}/{id_cpl}/indikator/{id_indikator}
    update: async (id_kurikulum: string, id_cpl: string, id_indikator: string, data: UpdateIndikatorRequest) => {
        const token = AuthService.getToken();
        const response = await api.patch(
            `/cpl/${id_kurikulum}/${id_cpl}/indikator/${id_indikator}`, 
            data, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Delete indikator
    // Endpoint: DELETE /cpl/{id_kurikulum}/{id_cpl}/indikator/{id_indikator}
    delete: async (id_kurikulum: string, id_cpl: string, id_indikator: string) => {
        const token = AuthService.getToken();
        const response = await api.delete(
            `/cpl/${id_kurikulum}/${id_cpl}/indikator/${id_indikator}`, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    }
};