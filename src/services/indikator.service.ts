import api from './api';
import { AuthService } from './auth.service';

export interface Indikator {
    id_indikator: string;
    deskripsi: string;
}

export interface IndikatorDetailResponse {
    id_kurikulum: string;
    id_cpl: string;
    id_indikator: string;
    deskripsi: string;
}

export interface CreateIndikatorRequest {
    id_indikator: string;
    deskripsi: string;
}

export interface UpdateIndikatorRequest {
    id_cpl?: string;
    deskripsi?: string;
}

export const IndikatorService = {
    // Create indikator under a CPL
    // Backend endpoint: POST /indikator/{id_kurikulum}/{id_cpl}
    create: async (id_kurikulum: string, id_cpl: string, data: CreateIndikatorRequest) => {
        const token = AuthService.getToken();
        const response = await api.post(`/indikator/${id_kurikulum}/${id_cpl}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Get indikator detail - uses CPL detail endpoint and filters
    // Note: Backend doesn't have a dedicated GET endpoint for single indikator,
    // so we get all indikators from CPL and filter
    getDetail: async (id_kurikulum: string, id_cpl: string, id_indikator: string): Promise<IndikatorDetailResponse> => {
        const token = AuthService.getToken();
        // Use the CPL detail endpoint which includes indikator list
        const response = await api.get(
            `/cpl/${id_kurikulum}/${id_cpl}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        // Find the specific indikator from the list
        const indikatorList = response.data.indikator || [];
        const found = indikatorList.find((ind: any) => ind.id_indikator === id_indikator);

        if (!found) {
            throw new Error('Indikator tidak ditemukan');
        }

        return {
            id_kurikulum: id_kurikulum,
            id_cpl: id_cpl,
            id_indikator: found.id_indikator,
            deskripsi: found.deskripsi
        };
    },

    // Update indikator
    // Backend endpoint: PATCH /indikator/{id_kurikulum}/{id_cpl}/{id_indikator}
    update: async (id_kurikulum: string, id_cpl: string, id_indikator: string, data: UpdateIndikatorRequest) => {
        const token = AuthService.getToken();
        const response = await api.patch(
            `/indikator/${id_kurikulum}/${id_cpl}/${id_indikator}`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Delete indikator
    // Backend endpoint: DELETE /indikator/{id_kurikulum}/{id_cpl}/{id_indikator}
    delete: async (id_kurikulum: string, id_cpl: string, id_indikator: string) => {
        const token = AuthService.getToken();
        const response = await api.delete(
            `/indikator/${id_kurikulum}/${id_cpl}/${id_indikator}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    }
};