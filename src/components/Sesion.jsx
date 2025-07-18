import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImagenPerfil from '../assets/profile.png';
import Exit from '../assets/exit.png';

const Sesion = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="session">
            {isAuthenticated() ? (
                <div className="sesion_container">
                    <button className='btn_sesion' onClick={handleLogout}>Cerrar Sesión</button>
                    <img src={Exit} alt="Cerrar sesion" />
                </div>
            ) : (
                <a href="/login">
                    <img src={ImagenPerfil} alt="iniciar sesion o registrarse" />
                </a>
            )}    
        </div>
    )
}

export default Sesion;