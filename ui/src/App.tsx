import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, Navigate } from "react-router-dom"
import Navbar from './components/Navbar/Navbar';
import { Home, Login,NotFound,Registration,Files, Folders } from './pages'
import parseJwt from './utils/parseJwt';
import ProtectedRoute from './utils/ProtectedRoute';



function App() {
  console.log(parseJwt(localStorage.getItem('userToken')!));


  return (
    <>
    <Navbar/>
    <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect from root to /home */}
        <Route path="/home" element={<Home />} /> {/* Home page/product page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/files" element={<Files />} />
          <Route path="/folders" element={<Folders />} />
  

        </Route>
        
        <Route path="*" element={<NotFound />} />
    </Routes>
    <ToastContainer />
    </>
  )
}

export default App