import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/login"
import Homepage from "./pages/home"
import SecondHome from "./pages/home2"
import MainLayout from "./components/MainLayout"
import Matkul from "./pages/matkul"
import FormCpl from "./pages/formCpl"
import FormIndikator from "./pages/formIndikator"
import KurikulumPage from "./pages/kurikulum"
import CplPage from "./pages/cpl"
import TambahKurikulum from "./pages/tambahKurikulum"
import EditKurikulum from "./pages/editKurikulum"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="home" element={<Homepage />} />
        <Route path="home/tambah" element={<TambahKurikulum />} />
        <Route path="home/:id/edit" element={<EditKurikulum />} />
        <Route path="home2" element={<SecondHome />} />
        <Route path="matkul" element={<Matkul />} />
        <Route path="cpl" element={<FormCpl />} />
        <Route path="indikator" element={<FormIndikator />} />
        <Route path="home/:id" element={<KurikulumPage />} />
        <Route path="home/:id/:cplId" element={<CplPage />} />
      </Route>
    </Routes>
  )
}

export default App