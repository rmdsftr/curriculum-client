import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table, { type Column } from '../components/table';
import { CPLService, type IndikatorCPL } from '../services/cpl.service';
import { IndikatorService } from '../services/indikator.service';
import '../styles/kurikulum.css';
import '../styles/home.css';

interface IndTableRow {
    no: number;
    id_indikator: string;
    deskripsi: string;
}

const CplPage: React.FC = () => {
    const { id: id_kurikulum, cplId } = useParams();
    const navigate = useNavigate();
    const [indikator, setIndikator] = useState<IndTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cplKode, setCplKode] = useState<string | null>(null);
    const [cplDeskripsi, setCplDeskripsi] = useState<string | null>(null);
    const [pendingDeleteInd, setPendingDeleteInd] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({ 
        visible: false, 
        type: 'success', 
        message: '' 
    });

    const showToast = (type: 'success' | 'error', message: string, timeout = 2200) => {
        setToast({ visible: true, type, message });
        setTimeout(() => setToast({ visible: false, type, message: '' }), timeout);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await CPLService.getDetail(id_kurikulum ?? '', cplId ?? '');
            const list: IndikatorCPL[] = res.indikator ?? [];
            setIndikator(list.map((it, idx) => ({ 
                no: idx + 1, 
                id_indikator: it.id_indikator, 
                deskripsi: it.deskripsi 
            })));
            setCplKode(res.cpl?.id_cpl ?? cplId ?? null);
            setCplDeskripsi(res.cpl?.deskripsi ?? null);
        } catch (err: any) {
            console.error('fetchData error', err);
            const message = err?.response?.data?.detail || err?.message || 'Gagal memuat indikator';
            setError(message);
            setIndikator([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_kurikulum, cplId]);

    const handleDeleteInd = (id_indikator: string) => {
        setPendingDeleteInd(id_indikator);
    };

    const confirmDeleteInd = async () => {
        if (!id_kurikulum || !cplId || !pendingDeleteInd) {
            setPendingDeleteInd(null);
            return;
        }
        
        try {
            setIsDeleting(true);
            await IndikatorService.delete(id_kurikulum, cplId, pendingDeleteInd);
            await fetchData();
            setPendingDeleteInd(null);
            showToast('success', 'Indikator berhasil dihapus');
        } catch (err: any) {
            console.error('Error deleting indikator', err);
            showToast('error', err?.response?.data?.detail || 'Gagal menghapus indikator');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDeleteInd = () => setPendingDeleteInd(null);

    const columns: Column[] = [
        { key: 'no', header: 'No', width: '80px' },
        { key: 'id_indikator', header: 'Kode', width: '150px' },
        { 
            key: 'deskripsi', 
            header: 'Deskripsi', 
            width: 'auto', 
            render: (v: string) => <div className="cell-left">{v}</div> 
        },
        {
            key: 'aksi',
            header: 'Aksi',
            width: '180px',
            render: (_v: any, row: any) => (
                <div className="action-buttons">
                    <button 
                        className="action-button edit" 
                        title="Edit"
                        onClick={() => navigate('/indikator', {
                            state: {
                                mode: 'edit',
                                kurId: id_kurikulum,
                                cplId: cplId,
                                indId: row.id_indikator,
                            }
                        })}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button 
                        className="action-button delete" 
                        title="Hapus"
                        onClick={() => handleDeleteInd(row.id_indikator)}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    const handleBack = () => navigate(`/home/${id_kurikulum}`);

    if (loading) return <div className="loading-container">Memuat data...</div>;
    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <div style={{ marginTop: 8 }}>
                <button className="add-button" onClick={fetchData}>Coba Lagi</button>
            </div>
        </div>
    );

    return (
        <div className="matkul-container">
            <button className="btn-kembali" onClick={handleBack}>
                <span className="arrow-icon">←</span>
                Kembali
            </button>

            <div className="form-card">
                <h2 className="form-title">Detail CPL</h2>

                <div className="detail-grid">
                    <div className="detail-label">Kode CPL</div>
                    <div className="detail-colon">:</div>
                    <div className="detail-value">{cplKode}</div>

                    <div className="detail-label">Deskripsi</div>
                    <div className="detail-colon">:</div>
                    <div className="detail-value">{cplDeskripsi}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                    <button 
                        className="add-button" 
                        onClick={() => navigate('/indikator', {
                            state: {
                                mode: 'create',
                                kurId: id_kurikulum,
                                cplId: cplId,
                            }
                        })}
                    >
                        Tambah Indikator
                    </button>
                </div>

                {toast.visible && (
                    <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                        {toast.message}
                    </div>
                )}

                {pendingDeleteInd && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>Konfirmasi Hapus</h3>
                            <p>Yakin ingin menghapus indikator <strong>{pendingDeleteInd}</strong>?</p>
                            <div className="modal-actions">
                                <button 
                                    className="btn-cancel" 
                                    onClick={cancelDeleteInd} 
                                    disabled={isDeleting}
                                >
                                    Batal
                                </button>
                                <button 
                                    className="btn-danger" 
                                    onClick={confirmDeleteInd} 
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <Table columns={columns} data={indikator} />
            </div>
        </div>
    );
};

export default CplPage;