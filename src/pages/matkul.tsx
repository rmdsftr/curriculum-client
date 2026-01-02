import { useState, useEffect } from "react";
import "../styles/matkul.css"
import { useNavigate, useSearchParams } from "react-router-dom";
import { MatkulService, type CPLInput, type CPLWithIndikator } from "../services/matkul.service";
import { CPLService } from "../services/cpl.service";

interface CPLOption {
    id_kurikulum: string;
    id_cpl: string;
    deskripsi: string;
    selected: boolean;
}

const Matkul: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id'); // null jika create, id_matkul jika edit
    const isEditMode = !!editId;

    const [kodeMatkul, setKodeMatkul] = useState('');
    const [namaMatkul, setNamaMatkul] = useState('');
    const [semester, setSemester] = useState('');
    const [jumlahSks, setJumlahSks] = useState('');
    const [cplList, setCplList] = useState<CPLOption[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, [editId]);

    const fetchInitialData = async () => {
        try {
            setLoadingData(true);
            setError('');

            // Fetch CPL from active kurikulum
            const activeCPLResponse = await CPLService.getFromActiveKurikulum();

            // Map CPL data to CPLOption format
            const uniqueCPLMap = new Map<string, CPLOption>();
            activeCPLResponse.data.forEach(cpl => {
                if (cpl.kurikulum) {
                    const key = `${cpl.kurikulum.id_kurikulum}-${cpl.id_cpl}`;
                    if (!uniqueCPLMap.has(key)) {
                        uniqueCPLMap.set(key, {
                            id_kurikulum: cpl.kurikulum.id_kurikulum,
                            id_cpl: cpl.id_cpl,
                            deskripsi: cpl.deskripsi,
                            selected: false
                        });
                    }
                }
            });

            let availableCPL = Array.from(uniqueCPLMap.values());

            // If edit mode, fetch existing matkul data and mark selected CPLs
            if (editId) {
                const detailResponse = await MatkulService.getDetail(editId);
                const matkulData = detailResponse.mata_kuliah;
                const matkulCPL = detailResponse.cpl;

                setKodeMatkul(matkulData.id_matkul);
                setNamaMatkul(matkulData.mata_kuliah);
                setSemester(matkulData.semester.toString());
                setJumlahSks(matkulData.sks.toString());

                // Add any CPL from detail that might not be in the list (for backwards compatibility)
                matkulCPL.forEach((cpl: CPLWithIndikator) => {
                    const key = `${cpl.id_kurikulum}-${cpl.id_cpl}`;
                    if (!uniqueCPLMap.has(key)) {
                        uniqueCPLMap.set(key, {
                            id_kurikulum: cpl.id_kurikulum,
                            id_cpl: cpl.id_cpl,
                            deskripsi: cpl.deskripsi,
                            selected: true
                        });
                    }
                });

                // Rebuild list with selections
                availableCPL = Array.from(uniqueCPLMap.values()).map(cpl => {
                    const isSelected = matkulCPL.some(
                        (mc: CPLWithIndikator) => mc.id_kurikulum === cpl.id_kurikulum && mc.id_cpl === cpl.id_cpl
                    );
                    return { ...cpl, selected: isSelected };
                });
            }

            setCplList(availableCPL);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.detail || 'Gagal mengambil data CPL dari kurikulum aktif');
        } finally {
            setLoadingData(false);
        }
    };

    const toggleCPL = (id_kurikulum: string, id_cpl: string) => {
        setCplList(cplList.map(cpl =>
            cpl.id_kurikulum === id_kurikulum && cpl.id_cpl === id_cpl
                ? { ...cpl, selected: !cpl.selected }
                : cpl
        ));
    };

    const handleSubmit = async () => {
        // Validation
        if (!kodeMatkul.trim()) {
            alert('Kode Mata Kuliah harus diisi');
            return;
        }
        if (!namaMatkul.trim()) {
            alert('Nama Mata Kuliah harus diisi');
            return;
        }
        if (!semester.trim() || isNaN(Number(semester))) {
            alert('Semester harus diisi dengan angka');
            return;
        }
        if (!jumlahSks.trim() || isNaN(Number(jumlahSks))) {
            alert('Jumlah SKS harus diisi dengan angka');
            return;
        }

        const selectedCPLs: CPLInput[] = cplList
            .filter(cpl => cpl.selected)
            .map(cpl => ({
                id_kurikulum: cpl.id_kurikulum,
                id_cpl: cpl.id_cpl
            }));

        try {
            setLoading(true);
            setError('');

            if (isEditMode) {
                // Update existing matkul
                await MatkulService.update(editId!, {
                    mata_kuliah: namaMatkul,
                    sks: Number(jumlahSks),
                    semester: Number(semester),
                    cpl_list: selectedCPLs
                });
                alert('Data mata kuliah berhasil diupdate!');
            } else {
                // Create new matkul
                await MatkulService.create({
                    id_matkul: kodeMatkul,
                    mata_kuliah: namaMatkul,
                    sks: Number(jumlahSks),
                    semester: Number(semester),
                    cpl_list: selectedCPLs
                });
                alert('Data mata kuliah berhasil ditambahkan!');
            }

            navigate('/home2');
        } catch (err: any) {
            console.error('Error saving mata kuliah:', err);
            setError(err.response?.data?.detail || 'Gagal menyimpan data mata kuliah');
            alert(err.response?.data?.detail || 'Gagal menyimpan data mata kuliah');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingData) {
        return (
            <div className="matkul-container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Memuat data...</p>
                </div>
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
                <h2 className="form-title">
                    {isEditMode ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
                </h2>

                {error && (
                    <div style={{
                        color: 'red',
                        padding: '10px',
                        margin: '0 0 20px 0',
                        backgroundColor: '#ffe6e6',
                        borderRadius: '5px'
                    }}>
                        {error}
                    </div>
                )}

                <div className="form-grid">
                    <div className="form-column">
                        <div className="form-group">
                            <label className="form-label">Kode Mata Kuliah</label>
                            <input
                                type="text"
                                className="form-input"
                                value={kodeMatkul}
                                onChange={(e) => setKodeMatkul(e.target.value)}
                                disabled={isEditMode} // Kode tidak bisa diubah saat edit
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Semester</label>
                            <input
                                type="number"
                                className="form-input"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="form-group">
                            <label className="form-label">Nama Mata Kuliah</label>
                            <input
                                type="text"
                                className="form-input"
                                value={namaMatkul}
                                onChange={(e) => setNamaMatkul(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Jumlah SKS</label>
                            <input
                                type="number"
                                className="form-input"
                                value={jumlahSks}
                                onChange={(e) => setJumlahSks(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group-full">
                    <label className="form-label">CPL (Capaian Pembelajaran Lulusan)</label>
                    {cplList.length === 0 ? (
                        <div style={{ color: '#666', padding: '10px', fontStyle: 'italic' }}>
                            Tidak ada CPL tersedia. Silakan tambahkan CPL terlebih dahulu.
                        </div>
                    ) : (
                        <div className="cpl-list">
                            {cplList.map((cpl) => (
                                <div key={`${cpl.id_kurikulum}-${cpl.id_cpl}`} className="cpl-item">
                                    <input
                                        type="text"
                                        className="cpl-input"
                                        value={`[${cpl.id_cpl}] ${cpl.deskripsi}`}
                                        readOnly
                                    />
                                    <button
                                        className={`cpl-checkbox ${cpl.selected ? 'selected' : ''}`}
                                        onClick={() => toggleCPL(cpl.id_kurikulum, cpl.id_cpl)}
                                    >
                                        {cpl.selected && '✓'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        className="btn-simpan"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        <span className="save-icon">💾</span>
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Matkul;