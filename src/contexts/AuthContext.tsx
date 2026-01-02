import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../services/auth.service';
import api from '../services/api';

// Types
export interface User {
    user_id: string;
    nama: string;
    role: 'kadep' | 'dosen';
    created_at?: string;
    updated_at?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user_id: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = AuthService.getToken();
            if (token) {
                try {
                    await refreshUser();
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Refresh user data from API
    const refreshUser = async () => {
        const token = AuthService.getToken();
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const response = await api.get<User>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            // If API fails, try to get from token payload
            const userData = AuthService.getUserData();
            if (userData) {
                setUser({
                    user_id: userData.user_id,
                    nama: userData.nama,
                    role: userData.role as 'kadep' | 'dosen'
                });
            } else {
                setUser(null);
            }
        }
    };

    // Login function
    const login = async (user_id: string, password: string) => {
        setIsLoading(true);
        try {
            await AuthService.login(user_id, password);
            await refreshUser();
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        const token = AuthService.getToken();
        if (token) {
            try {
                await api.post('/auth/logout', null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                // Ignore error, still logout locally
                console.error('Logout API error:', error);
            }
        }

        setUser(null);
        AuthService.logout();
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
