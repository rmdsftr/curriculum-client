import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import '../styles/home.css';

const MainLayout: React.FC = () => {
    return (
        <div className="home-container">
            <Navbar
                title="Departemen Sistem Informasi"
                subtitle="Universitas Andalas"
            />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
