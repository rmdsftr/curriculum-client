import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table, { type Column } from '../components/table';
import { KurikulumService, type Kurikulum } from '../services/kurikulum.service';
import '../styles/home.css';

interface KurikulumTableData {
    no: number;
    id_kurikulum: string;
    namaKurikulum: string;
    revisi: string;
    status: 'aktif' | 'nonaktif';
}

const Home: React.FC = () => {
    const [kurikulumData, setKurikulumData] = useState<KurikulumTableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch kurikulum data from API
    useEffect(() => {
        const fetchKurikulum = async () => {
            try {
                setLoading(true);
                const response = await KurikulumService.getAll();

                // Transform data untuk tabel
                const tableData: KurikulumTableData[] = response.data.map((item: Kurikulum, index: number) => ({
                    no: index + 1,
                    id_kurikulum: item.id_kurikulum,
                    namaKurikulum: item.nama_kurikulum,
                    revisi: item.revisi,
                    status: item.status_kurikulum
                }));

                setKurikulumData(tableData);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching kurikulum:', err);
                setError('Gagal memuat data kurikulum');
            } finally {
                setLoading(false);
            }
        };

        fetchKurikulum();
    }, []);

    const columns: Column[] = [
        {
            key: 'no',
            header: 'No',
            width: '80px'
        },
        {
            key: 'namaKurikulum',
            header: 'Nama Kurikulum',
            width: 'auto',
            render: (value: string) => <div className="cell-left">{value}</div>
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
            width: '140px',
            render: (_value: any, row: any) => (
                <div className="action-buttons">
                    <button className="action-button edit" title="Edit">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    </button>
                    <Link to={`/home/${row.id_kurikulum}`} className="action-button download" title="Detail">
                        <svg viewBox="0 0 24 24">
                            <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                    </Link>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <p>Memuat data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Coba Lagi</button>
            </div>
        );
    }

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