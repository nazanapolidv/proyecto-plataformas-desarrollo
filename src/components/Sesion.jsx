import { useEffect, useState } from 'react';
import ImagenPerfil from '../assets/profile.png';
import Exit from '../assets/exit.png';
import '../css/index.css';
import '../css/Sesion.css';

const Sesion = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    return (
        <div className="session">
            {user ? (
                <div className="sesion_container">
                    <button className='btn_sesion' onClick={handleLogout}>Cerrar Sesión</button>
                    <img src={Exit} alt="Cerrar sesion" />
                </div>
            ) : (
                <a href="/login"><img src={ImagenPerfil} alt="iniciar sesion o registrarse" /></a>
            )}    
        </div>
    )
}

export default Sesion;