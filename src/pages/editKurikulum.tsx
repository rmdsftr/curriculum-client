import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KurikulumService, type Kurikulum } from '../services/kurikulum.service';
import '../styles/kurikulum.css';
import '../styles/input.css';

const EditKurikulum: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [namaKurikulum, setNamaKurikulum] = useState('');
  const [revisi, setRevisi] = useState('');
  const [status, setStatus] = useState<'aktif' | 'nonaktif'>('aktif');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        const kur = res.kurikulum as Kurikulum;
        setNamaKurikulum(kur.nama_kurikulum);
        setRevisi(kur.revisi);
        setStatus(kur.status_kurikulum);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching kurikulum detail:', err);
        setError('Gagal memuat data kurikulum');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleBack = () => navigate('/home');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id) {
      setError('ID tidak tersedia');
      return;
    }

    if (!namaKurikulum.trim()) {
      setError('Nama kurikulum wajib diisi');
      return;
    }

    setSaving(true);
    try {
      await KurikulumService.update(id, {
        nama_kurikulum: namaKurikulum,
        revisi,
        status_kurikulum: status,
      });

      navigate('/home');
    } catch (err: any) {
      console.error('Error updating kurikulum:', err);
      setError(err?.response?.data?.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container">Memuat data kurikulum...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="matkul-container">
      <button className="btn-kembali" onClick={handleBack}>
        <span className="arrow-icon">←</span>
        Kembali
      </button>

      <div className="form-card" style={{ maxWidth: 1000, padding: 40 }}>
        <h2 className="form-title">Edit Kurikulum</h2>

        <form onSubmit={handleSubmit}>
          <div className="detail-grid">
            <div className="detail-label">Nama Kurikulum</div>
            <div className="detail-colon">:</div>
            <div>
              <div className="input-wrapper">
                <input
                  className="input-field input-large"
                  type="text"
                  placeholder="Masukkan nama kurikulum"
                  value={namaKurikulum}
                  onChange={(e) => setNamaKurikulum(e.target.value)}
                />
              </div>
            </div>

            <div className="detail-label">Revisi</div>
            <div className="detail-colon">:</div>
            <div>
              <div className="input-wrapper">
                <input
                  className="input-field input-large"
                  type="text"
                  placeholder="Contoh: 2025"
                  value={revisi}
                  onChange={(e) => setRevisi(e.target.value)}
                />
              </div>
            </div>

            <div className="detail-label">Status</div>
            <div className="detail-colon">:</div>
            <div>
              <select
                className="input-field input-large"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'aktif' | 'nonaktif')}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="add-button" onClick={handleBack} disabled={saving}>
              Batal
            </button>
            <button type="submit" className="add-button" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKurikulum;
