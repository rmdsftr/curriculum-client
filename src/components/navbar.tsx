import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/navbar.css';
import logo from '../assets/Logo Unand.png';

interface NavbarProps {
    title: string;
    subtitle: string;
    logoSrc?: string;
}

const Navbar: React.FC<NavbarProps> = ({
    title,
    subtitle,
    logoSrc = logo
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const activeTab = location.pathname === '/home2' ? 'mataKuliah' : 'kurikulum';

    // Format role untuk display
    const formatRole = (role: string | undefined) => {
        if (!role) return '';
        if (role === 'kadep') return 'Ketua Departemen';
        if (role === 'dosen') return 'Dosen';
        return role;
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logoSrc} alt="Logo" className="navbar-logo" />
                    <div className="navbar-title">
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="user-info">
                        <p className="user-name">{user?.nama || '-'}</p>
                        <p className="user-role">{formatRole(user?.role)}</p>
                    </div>
                    <div className="user-avatar">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="20" fill="#9CA3AF" />
                            <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z" fill="white" />
                            <path d="M20 22C13.3726 22 8 27.3726 8 34V36H32V34C32 27.3726 26.6274 22 20 22Z" fill="white" />
                        </svg>
                    </div>
                </div>
            </nav>
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'kurikulum' ? 'active' : ''}`}
                    onClick={() => navigate('/home')}
                >
                    Kurikulum
                </button>
                <button
                    className={`tab ${activeTab === 'mataKuliah' ? 'active' : ''}`}
                    onClick={() => navigate('/home2')}
                >
                    Mata Kuliah
                </button>
            </div>
        </div>
    );
};

export default Navbar;