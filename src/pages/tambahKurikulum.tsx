import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KurikulumService } from '../services/kurikulum.service';
import '../styles/kurikulum.css';
import '../styles/input.css';

const TambahKurikulum: React.FC = () => {
  const navigate = useNavigate();
  const [namaKurikulum, setNamaKurikulum] = useState('');
  const [revisi, setRevisi] = useState('');
  const [status, setStatus] = useState<'aktif' | 'nonaktif'>('aktif');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => navigate('/home');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!namaKurikulum.trim()) {
      setError('Nama kurikulum wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await KurikulumService.create({
        nama_kurikulum: namaKurikulum,
        revisi,
        status_kurikulum: status,
      });

      // On success, go back to kurikulum list
      navigate('/home');
    } catch (err: any) {
      console.error('Error creating kurikulum:', err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      const message = data?.message || data || err.message || 'Gagal menyimpan kurikulum';
      setError(status ? `(${status}) ${JSON.stringify(message)}` : String(message));
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

      <div className="form-card" style={{ maxWidth: 1000, padding: 40 }}>
        <h2 className="form-title">Tambah Kurikulum</h2>

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

          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="add-button" onClick={handleBack} disabled={loading}>
              Batal
            </button>
            <button type="submit" className="add-button" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahKurikulum;
