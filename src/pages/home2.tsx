// pages/SecondHome.tsx
import React, { useState, useEffect } from 'react';
import Table, { type Column } from '../components/table';
import { MatkulService } from '../services/matkul.service';
import '../styles/home.css';

interface MataKuliahData {
    no: number;
    mataKuliah: string;
    kode: string;
    sks: number;
    semester: number;
    cpl: string[];
}

const SecondHome: React.FC = () => {
    const [mataKuliahData, setMataKuliahData] = useState<MataKuliahData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchMataKuliah();
    }, []);

    const fetchMataKuliah = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await MatkulService.getAll();

            // Map data dari backend ke format tabel
            const formattedData: MataKuliahData[] = response.data.map((matkul, index) => ({
                no: index + 1,
                mataKuliah: matkul.mata_kuliah,
                kode: matkul.id_matkul,
                sks: matkul.sks,
                semester: matkul.semester,
                cpl: matkul.cpl.map(c => c.deskripsi)
            }));

            setMataKuliahData(formattedData);
        } catch (err: any) {
            console.error('Error fetching mata kuliah:', err);
            setError(err.response?.data?.detail || 'Gagal mengambil data mata kuliah');
        } finally {
            setLoading(false);
        }
    };

    const columns: Column[] = [
        {
            key: 'no',
            header: 'No',
            width: '60px'
        },
        {
            key: 'mataKuliah',
            header: 'Mata Kuliah',
            width: '200px'
        },
        {
            key: 'kode',
            header: 'Kode',
            width: '100px'
        },
        {
            key: 'sks',
            header: 'SKS',
            width: '80px'
        },
        {
            key: 'semester',
            header: 'Semester',
            width: '100px'
        },
        {
            key: 'cpl',
            header: 'CPL',
            width: 'auto',
            render: (value: string[]) => (
                <div className="cpl-list">
                    {value.map((cpl, index) => (
                        <div key={index} className="cpl-item">
                            {cpl}
                        </div>
                    ))}
                </div>
            )
        },
        {
            key: 'aksi',
            header: 'Aksi',
            width: '100px',
            render: () => (
                <div className="action-buttons">
                    <button className="action-button edit" title="Edit">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                    <button className="action-button delete" title="Delete">
                        <svg viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
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
                Tambah Mata Kuliah
            </button>

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Memuat data mata kuliah...</p>
                </div>
            )}

            {error && (
                <div style={{
                    color: 'red',
                    padding: '10px',
                    margin: '10px 0',
                    backgroundColor: '#ffe6e6',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )}

            {!loading && !error && <Table columns={columns} data={mataKuliahData} />}
        </>
    );
};

export default SecondHome;