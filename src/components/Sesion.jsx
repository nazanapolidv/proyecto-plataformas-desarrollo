import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ImagenPerfil from '../assets/profile.png';
import Exit from '../assets/exit.png';
import '../css/index.css';
import '../css/Sesion.css';

const Sesion = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="session">
            {user ? (
                <div className="sesion_container">
                    <button className='btn_sesion' onClick={handleLogout}>Cerrar Sesión</button>
                    <img src={Exit} alt="Cerrar sesion" />
                </div>
            ) : (
                <Link to="/login"><img src={ImagenPerfil} alt="iniciar sesion o registrarse" /></Link>
            )}    
        </div>
    )
}

export default Sesion;