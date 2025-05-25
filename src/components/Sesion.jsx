import { useEffect, useState } from 'react';
import ImagenPerfil from '../assets/profile.png';
import '../css/index.css';

const Sesion = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <div className="session">
            {user ? (
                <div className="session_user">
                    <img src={ImagenPerfil} alt="iniciar sesion o registrarse" />
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            ) : (
                <a href="inicio-sesion.html"><img src={ImagenPerfil} alt="iniciar sesion o registrarse" /></a>
            )}    
        </div>
    )
}

export default Sesion;