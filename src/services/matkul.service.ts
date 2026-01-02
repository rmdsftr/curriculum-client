import api from "./api";
import { AuthService } from "./auth.service";

// Types
export interface CPLItem {
    id_kurikulum: string;
    id_cpl: string;
    deskripsi: string;
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
};
