import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/matkul.css';
import '../styles/formCpl.css';
import { IndikatorService } from '../services/indikator.service';

interface LocationState {
    mode?: 'create' | 'edit';
    kurId?: string;
    cplId?: string;
    indId?: string;
}

const FormIndikator: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state as LocationState) || {};
    
    const { mode, kurId, cplId, indId } = state;
    const isEdit = mode === 'edit' && Boolean(kurId) && Boolean(cplId) && Boolean(indId);

    const [kodeInd, setKodeInd] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({ 
        visible: false, 
        type: 'success', 
        message: '' 
    });

    const showToast = (type: 'success' | 'error', message: string, timeout = 2200) => {
        setToast({ visible: true, type, message });
        setTimeout(() => setToast({ visible: false, type, message: '' }), timeout);
    };

    // Load data untuk edit mode
    useEffect(() => {
        const load = async () => {
            if (!isEdit) return;
            
            if (!kurId || !cplId || !indId) {
                showToast('error', 'Data tidak lengkap');
                return;
            }

            try {
                setInitialLoading(true);
                const res = await IndikatorService.getDetail(kurId, cplId, indId);
                
                // Set data dari response
                setKodeInd(res.id_indikator || indId);
                setDeskripsi(res.deskripsi || '');
                
            } catch (err: any) {
                console.error('Error loading indikator:', err);
                showToast('error', err?.response?.data?.detail || 'Gagal memuat indikator');
            } finally {
                setInitialLoading(false);
            }
        };
        load();
    }, [isEdit, kurId, cplId, indId]);

    const handleBack = () => {
        if (kurId && cplId) {
            navigate(`/home/${kurId}/${cplId}`);
        } else {
            navigate(-1);
        }
    };

    const handleSubmit = async () => {
        // Validasi input
        if (!kodeInd.trim()) return showToast('error', 'Kode Indikator harus diisi');
        if (!deskripsi.trim()) return showToast('error', 'Deskripsi harus diisi');

        if (!kurId || !cplId) {
            return showToast('error', 'Data kurikulum atau CPL tidak ditemukan');
        }

        // Validasi format kode indikator untuk mode create
        if (!isEdit && !/^IND-[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(kodeInd.trim())) {
            return showToast('error', 'Format kode indikator tidak valid. Contoh: IND-01-01');
        }

        try {
            setLoading(true);
            
            if (isEdit && indId) {
                // UPDATE: hanya kirim deskripsi
                await IndikatorService.update(kurId, cplId, indId, { deskripsi });
                showToast('success', 'Indikator berhasil diperbarui');
                setTimeout(() => navigate(`/home/${kurId}/${cplId}`), 800);
            } else {
                // CREATE: kirim id_indikator dan deskripsi
                await IndikatorService.create(kurId, cplId, { 
                    id_indikator: kodeInd.trim(), 
                    deskripsi: deskripsi.trim()
                });
                showToast('success', 'Indikator berhasil ditambahkan');
                setTimeout(() => navigate(`/home/${kurId}/${cplId}`), 800);
            }
            
        } catch (err: any) {
            console.error('Error submit:', err);
            const errorMsg = err?.response?.data?.detail || 'Gagal menyimpan indikator';
            showToast('error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Guard: jika tidak ada state yang lengkap
    if (!mode || !kurId || !cplId) {
        return (
            <div className="matkul-container">
                <div className="error-container">
                    <p>Data tidak lengkap. Silakan kembali dan coba lagi.</p>
                    <button className="add-button" onClick={() => navigate(-1)}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // Loading state saat fetch data edit
    if (initialLoading) {
        return (
            <div className="matkul-container">
                <div className="loading-container">Memuat data indikator...</div>
            </div>
        );
    }

    return (
        <div className="matkul-container">
            <button className="btn-kembali" onClick={handleBack}>
                <span className="arrow-icon">←</span>
                Kembali
            </button>

            <div className="form-card">
                {toast.visible && (
                    <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                        {toast.message}
                    </div>
                )}

                <h2 className="form-title">{isEdit ? 'Edit Indikator' : 'Tambah Indikator'}</h2>

                <div className="form-grid">
                    <div className="form-column">
                        <div className="form-group">
                            <label className="form-label">Kode Indikator</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="IND-XX-YY"
                                value={kodeInd}
                                onChange={(e) => setKodeInd(e.target.value)}
                                disabled={isEdit}
                            />
                            <div className="code-guide">Contoh: IND-01-01 (XX untuk nomor CPL, YY untuk nomor indikator)</div>
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-group">
                            <label className="form-label">Deskripsi Indikator</label>
                            <textarea 
                                className="form-input" 
                                rows={5} 
                                value={deskripsi} 
                                onChange={(e) => setDeskripsi(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-simpan" onClick={handleSubmit} disabled={loading || initialLoading}>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormIndikator;