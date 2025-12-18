import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/login"
import Homepage from "./pages/home"

function App(){
  return(
    <Routes>
      <Route path="" element={<LoginPage/>}/>
      <Route path="home" element={<Homepage/>}/>
    </Routes>
  )
}

export default App