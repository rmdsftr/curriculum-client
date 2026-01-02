import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table, { type Column } from '../components/table';
import { MatkulService } from '../services/matkul.service';
import { useAuth } from '../contexts/AuthContext';
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
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mataKuliahData, setMataKuliahData] = useState<MataKuliahData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [deleting, setDeleting] = useState<string | null>(null);

    const isKadep = user?.role === 'kadep';
    const canEdit = user?.role === 'kadep' || user?.role === 'dosen';

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

    const handleDelete = async (kode: string) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus mata kuliah dengan kode ${kode}?`)) {
            return;
        }

        try {
            setDeleting(kode);
            await MatkulService.delete(kode);
            // Refresh data setelah berhasil menghapus
            await fetchMataKuliah();
        } catch (err: any) {
            console.error('Error deleting mata kuliah:', err);
            alert(err.response?.data?.detail || 'Gagal menghapus mata kuliah');
        } finally {
            setDeleting(null);
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
            render: (_value: unknown, row: MataKuliahData) => (
                <div className="action-buttons">
                    {canEdit && (
                        <button
                            className="action-button edit"
                            title="Edit"
                            onClick={() => navigate(`/matkul?id=${row.kode}`)}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                        </button>
                    )}
                    {isKadep && (
                        <button
                            className="action-button delete"
                            title="Delete"
                            onClick={() => handleDelete(row.kode)}
                            disabled={deleting === row.kode}
                        >
                            {deleting === row.kode ? (
                                <span>...</span>
                            ) : (
                                <svg viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <>
            <button className="add-button" onClick={() => navigate('/matkul')}>
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