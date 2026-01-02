import React, { useState, useRef, useEffect } from 'react';
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
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const activeTab = (location.pathname === '/home2' || location.pathname === '/matkul') ? 'mataKuliah' : 'kurikulum';

    // Format role untuk display
    const formatRole = (role: string | undefined) => {
        if (!role) return '';
        if (role === 'kadep') return 'Ketua Departemen';
        if (role === 'dosen') return 'Dosen';
        return role;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setShowDropdown(false);
        await logout();
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
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
                    <div className="profile-dropdown-container" ref={dropdownRef}>
                        <div className="user-avatar" onClick={toggleDropdown}>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="20" fill="#9CA3AF" />
                                <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z" fill="white" />
                                <path d="M20 22C13.3726 22 8 27.3726 8 34V36H32V34C32 27.3726 26.6274 22 20 22Z" fill="white" />
                            </svg>
                        </div>
                        {showDropdown && (
                            <div className="profile-dropdown">
                                <div className="dropdown-user-info">
                                    <p className="dropdown-user-name">{user?.nama || '-'}</p>
                                    <p className="dropdown-user-role">{formatRole(user?.role)}</p>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-logout-btn" onClick={handleLogout}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
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