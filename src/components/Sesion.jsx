import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ImagenPerfil from '../assets/profile.png';
import Exit from '../assets/exit.png';
import '../css/index.css';

const Sesion = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="">
            {user ? (
                <div className="">
                    <button className='flex items-center gap-2 cursor-pointer border border-slate-300 rounded-full px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors' onClick={handleLogout}>
                        Cerrar sesión
                        <img src={Exit} className='w-6' alt="Cerrar sesión" />
                    </button>
                </div>
            ) : (
                <Link to="/login">
                    <img src={ImagenPerfil} className='w-10' alt="iniciar sesión o registrarse" />
                </Link>
            )}    
        </div>
    )
}

export default Sesion;