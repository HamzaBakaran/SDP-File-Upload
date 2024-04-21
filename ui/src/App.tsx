import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom"
import Navbar from './components/Navbar/Navbar';
import { Home, Login,NotFound,Registration,Files } from './pages'
import parseJwt from './utils/parseJwt';
import ProtectedRoute from './utils/ProtectedRoute';



function App() {
  console.log(parseJwt(localStorage.getItem('userToken')!));


  return (
    <>
    <Navbar/>
    <Routes>
        <Route path="/home" element={<Home />} /> {/* Home page/product page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/files" element={<Files />} />
  

        </Route>
        
        <Route path="*" element={<NotFound />} />
    </Routes>
    <ToastContainer />
    </>
  )
}

export default App