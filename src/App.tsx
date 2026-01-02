import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/login"
import Homepage from "./pages/home"
import SecondHome from "./pages/home2"
import MainLayout from "./components/MainLayout"
import Matkul from "./pages/matkul"

function App() {
  return (
    <Routes>
      <Route path="" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="home" element={<Homepage />} />
        <Route path="home2" element={<SecondHome />} />
        <Route path="matkul" element={<Matkul />} />
      </Route>
    </Routes>
  )
}

export default App