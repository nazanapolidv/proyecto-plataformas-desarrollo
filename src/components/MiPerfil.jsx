import { useState } from "react";
import "../css/Index.css";
import "../css/MiPerfil.css";
import SinAuth from "./SinAuth";
import userImg from "../assets/profile.png";
import usuariosData from "../data/usuarios.json";

const MiPerfil = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState(user?.email || '');

    if (!user) {
        return (
            <SinAuth />
        );
    }

    const handleEdit = () => {
        setIsEditing(true);
        setNewEmail(user.email);
    };

    const handleSave = () => {
        const savedUsers = localStorage.getItem('usuarios');
        let usuarios = savedUsers ? JSON.parse(savedUsers) : usuariosData;

        const emailExists = usuarios.some(u => u.email === newEmail && u.email !== user.email);
        if (emailExists) {
            alert('Este email ya está en uso');
            return;
        }

        usuarios = usuarios.map(u => 
            u.email === user.email ? { ...u, email: newEmail } : u
        );

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        const updatedUser = { ...user, email: newEmail };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setIsEditing(false);
        
        window.location.reload();
    };

    const handleCancel = () => {
        setNewEmail(user.email);
        setIsEditing(false);
    };

    if (!user) {
        return (
            <SinAuth />
        );
    }

    return (
        <>
            <main className="flex flex-col items-center justify-center h-[70vh]">
                <h2 className="title">Mi Perfil</h2>
                <img src={userImg} className="user_img" alt="foto de perfil" />
                
                {isEditing ? (
                    <div className=" bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h3 className="text-xl font-bold mb-4 text-center">Editar Correo Electrónico</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nuevo correo electrónico
                            </label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005F73] focus:border-transparent"
                                placeholder="ejemplo@gmail.com"
                            />
                        </div>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow cursor-pointer w-[120px]"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-shadow cursor-pointer w-[120px]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    // Modo visualización
                    <>
                        <div className="datos">
                            <div className="columna">
                                <p><strong>Nombre: </strong>{user.nombre}</p>
                                <p><strong>Correo electrónico: </strong>{user.email}</p>
                            </div>
                            <div className="columna">
                                <p><strong>Apellido: </strong>{user.apellido}</p>
                                <p><strong>Fecha de nacimiento: </strong>15 de marzo de 1995</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleEdit}
                            className="bg-[#005F73] text-white font-bold py-2 px-4 rounded-full w-40 hover:cursor-pointer hover:bg-[#004A5A] transition duration-300 ease-in-out"
                        >
                            Editar datos
                        </button>
                    </>
                )}
            </main>
        </>
    );
}

export default MiPerfil