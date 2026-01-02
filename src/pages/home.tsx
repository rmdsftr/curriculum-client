import React from 'react';
import Table, { type Column } from '../components/table';
import '../styles/home.css';

interface KurikulumData {
    no: number;
    namaKurikulum: string;
    revisi: string;
    status: 'Aktif' | 'Nonaktif';
}

const Home: React.FC = () => {

    const kurikulumData: KurikulumData[] = [
        {
            no: 1,
            namaKurikulum: 'Kurikulum Departemen Sistem Informasi 2025',
            revisi: 'Revisi 01',
            status: 'Aktif'
        },
        {
            no: 2,
            namaKurikulum: 'Kurikulum Departemen Sistem Informasi 2024',
            revisi: 'Revisi 02',
            status: 'Nonaktif'
        },
        {
            no: 3,
            namaKurikulum: 'Kurikulum Departemen Sistem Informasi 2023',
            revisi: 'Revisi 03',
            status: 'Nonaktif'
        }
    ];

    const columns: Column[] = [
        {
            key: 'no',
            header: 'No',
            width: '80px'
        },
        {
            key: 'namaKurikulum',
            header: 'Nama Kurikulum',
            width: 'auto'
        },
        {
            key: 'revisi',
            header: 'Revisi',
            width: '150px'
        },
        {
            key: 'status',
            header: 'Status',
            width: '150px',
            render: (value: string) => (
                <span className={`status-badge status-${value.toLowerCase()}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'aksi',
            header: 'Aksi',
            width: '120px',
            render: () => (
                <div className="action-buttons">
                    <button className="action-button edit" title="Edit">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                    <button className="action-button download" title="Download">
                        <svg viewBox="0 0 24 24">
                            <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 
           10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 
           8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <button className="add-button">
                <span className="plus-icon">+</span>
                Tambah Kurikulum
            </button>
            <Table columns={columns} data={kurikulumData} />
        </>
    );
};

export default Home;