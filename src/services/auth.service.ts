import api from "./api";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserData {
  user_id: string;
  nama: string;
  role: string;
}

export const AuthService = {
  login: async (user_id: string, password: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', {
      user_id,
      password,
    });
    
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  },

  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  
  getUserData: (): UserData | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        user_id: payload.sub,
        nama: payload.nama,
        role: payload.role,
      };
    } catch (error) {
      return null;
    }
  },
};