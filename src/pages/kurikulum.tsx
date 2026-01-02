import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Table, { type Column } from '../components/table';
import { KurikulumService, type Kurikulum, type CPLInKurikulum } from '../services/kurikulum.service';
import '../styles/kurikulum.css';
import '../styles/home.css';

interface CplTableRow {
    no: number;
    id_cpl: string;
    deskripsi: string;
}

const KurikulumPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [kurikulum, setKurikulum] = useState<(Kurikulum & { cpl?: CPLInKurikulum[] }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) {
                setError('ID kurikulum tidak ditemukan');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await KurikulumService.getDetail(id);
                setKurikulum(res.kurikulum);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching kurikulum detail:', err);
                setError('Gagal memuat detail kurikulum');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) return <div className="loading-container">Memuat detail kurikulum...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!kurikulum) return <div className="empty-container">Tidak ada data kurikulum.</div>;

    const cplList = kurikulum.cpl ?? [];
    const tableData: CplTableRow[] = cplList.map((cpl, idx) => ({
        no: idx + 1,
        id_cpl: cpl.id_cpl,
        deskripsi: cpl.deskripsi
    }));

    const columns: Column[] = [
        { key: 'no', header: 'No', width: '80px' },
        { key: 'id_cpl', header: 'Kode CPL', width: '150px' },
        { key: 'deskripsi', header: 'Deskripsi', width: 'auto', render: (value: string) => <div className="cell-left">{value}</div> },
        {
            key: 'aksi',
            header: 'Aksi',
            width: '180px',
            render: (_v: any, row: any) => (
                <div className="action-buttons">
                    <button className="action-button edit" title="Edit">
                        <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </button>
                    <Link to={`/home/${kurikulum.id_kurikulum}/${row.id_cpl}`} className="action-button download" title="Detail">
                        <svg viewBox="0 0 24 24"><path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    </Link>
                    <button className="action-button delete" title="Hapus">
                        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            )
        }
    ];

    const handleBack = () => navigate('/home');

    return (
        <div className="matkul-container">
            <button className="btn-kembali" onClick={handleBack}>
                <span className="arrow-icon">←</span>
                Kembali
            </button>

            <div className="form-card">
                <h2 className="form-title">Detail Kurikulum</h2>

                <div className="detail-grid">
                    <div className="detail-label">Nama Kurikulum</div>
                    <div className="detail-colon">:</div>
                    <div className="detail-value">{kurikulum.nama_kurikulum}</div>

                    <div className="detail-label">Revisi</div>
                    <div className="detail-colon">:</div>
                    <div className="detail-value">{kurikulum.revisi}</div>

                    <div className="detail-label">Status</div>
                    <div className="detail-colon">:</div>
                    <div className="detail-value"><span className={`status-badge status-${kurikulum.status_kurikulum}`}>{kurikulum.status_kurikulum}</span></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <button className="add-button">Tambah CPL</button>
                </div>

                <Table columns={columns} data={tableData} />
            </div>
        </div>
    );
};

export default KurikulumPage;
