import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./components/Login.jsx";
import Misalud from "./components/MiSalud.jsx";
import Admin from "./components/Admin.jsx";
import Home from "./components/Home.jsx";
import { Routes, Route } from 'react-router-dom';
import MiPerfil from "./components/MiPerfil.jsx";
import MiHistorial from "./components/MiHistorial.jsx";
import MisCitas from "./components/MisCitas.jsx";
import Registro from "./components/Registro.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        {/* Rutas protegidas que requieren autenticación */}
        <Route 
          path="/mi-salud" 
          element={
            <ProtectedRoute>
              <Misalud />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mi-perfil" 
          element={
            <ProtectedRoute>
              <MiPerfil />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mi-historial" 
          element={
            <ProtectedRoute>
              <MiHistorial />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mis-citas" 
          element={
            <ProtectedRoute>
              <MisCitas />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta protegida solo para administradores */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="administrador">
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
