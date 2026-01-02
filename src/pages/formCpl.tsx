import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/matkul.css';
import '../styles/formCpl.css';
import { CPLService } from '../services/cpl.service';

const FormCpl: React.FC = () => {
    const navigate = useNavigate();
    const [kodeCpl, setKodeCpl] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const kurId = searchParams.get('kurId');
    const cplId = searchParams.get('cplId');
    const isEdit: boolean = mode === 'edit' && Boolean(kurId) && Boolean(cplId);
    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({ visible: false, type: 'success', message: '' });

    const showToast = (type: 'success' | 'error', message: string, timeout = 2200) => {
        setToast({ visible: true, type, message });
        setTimeout(() => setToast({ visible: false, type, message: '' }), timeout);
    };

    useEffect(() => {
        const loadForEdit = async () => {
            if (!isEdit) return;
            try {
                setLoading(true);
                const res = await (await import('../services/cpl.service')).CPLService.getDetail(kurId ?? '', cplId ?? '');
                setKodeCpl(res.cpl?.id_cpl ?? '');
                setDeskripsi(res.cpl?.deskripsi ?? '');
            } catch (err: any) {
                console.error('Error loading CPL for edit', err);
                showToast('error', err?.response?.data?.detail || 'Gagal memuat data CPL');
            } finally {
                setLoading(false);
            }
        };

        loadForEdit();
    }, [isEdit, kurId, cplId]);

    const handleBack = () => navigate(-1);

    const handleSubmit = async () => {
        if (!kodeCpl.trim()) return showToast('error', 'Kode CPL harus diisi');
        if (!deskripsi.trim()) return showToast('error', 'Deskripsi CPL harus diisi');

        if (!isEdit && !/^CPL-[A-Za-z0-9]+$/.test(kodeCpl.trim())) {
            return showToast('error', 'Format kode CPL tidak valid. Contoh: CPL-01');
        }

        try {
            setLoading(true);

            if (isEdit) {
                await CPLService.update(kurId ?? '', cplId ?? '', { deskripsi });
                showToast('success', 'CPL berhasil diperbarui');
                setTimeout(() => navigate(`/home/${kurId}`), 800);
                return;
            }

            const active = await CPLService.getFromActiveKurikulum();
            const first = active.data.find(item => item.kurikulum && item.kurikulum.id_kurikulum);
            if (!first || !first.kurikulum) {
                return showToast('error', 'Tidak ditemukan kurikulum aktif. Tambah CPL gagal.');
            }

            const id_kurikulum = first.kurikulum.id_kurikulum;

            const exists = active.data.some(i => (i.id_cpl ?? '').toLowerCase() === kodeCpl.trim().toLowerCase());
            if (exists) return showToast('error', 'Kode CPL sudah ada');

            await CPLService.create(id_kurikulum, {
                id_cpl: kodeCpl,
                deskripsi
            });

            showToast('success', 'CPL berhasil ditambahkan');
            setTimeout(() => navigate(`/home/${id_kurikulum}`), 800);
        } catch (err: any) {
            console.error('Error create/update CPL', err);
            showToast('error', err?.response?.data?.detail || 'Gagal menyimpan CPL');
        } finally {
            setLoading(false);
        }
    };

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

                <h2 className="form-title">{isEdit ? 'Edit CPL' : 'Tambah CPL'}</h2>

                <div className="form-grid">
                    <div className="form-column">
                        <div className="form-group">
                            <label className="form-label">Kode CPL</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="CPL-XX"
                                value={kodeCpl}
                                onChange={(e) => setKodeCpl(e.target.value)}
                                disabled={isEdit}
                            />
                            <div className="code-guide">Contoh: CPL-01</div>
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-group">
                            <label className="form-label">Deskripsi CPL</label>
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
                    <button className="btn-simpan" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormCpl;
