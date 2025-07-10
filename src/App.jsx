import React, { useEffect, useState } from "react";
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

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/mi-salud" element={<Misalud />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mi-perfil" element={<MiPerfil />} />
        <Route path="/mi-historial" element={<MiHistorial />} />
        <Route path="/mis-citas" element={<MisCitas />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
