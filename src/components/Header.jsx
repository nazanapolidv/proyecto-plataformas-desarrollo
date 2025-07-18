import '../css/Header.css';
import '../css/index.css';
import Sesion from './Sesion';
import Logo from '../assets/logo-removebg-preview.png';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, isAdmin } = useAuth();

    return (
        <header>
        <div className="container_header">
            <div className="logo">
                <Link to="/"><img src={Logo} alt="Logo"/></Link>
            </div>
            <nav className="menu">
                <ul className="menu_list">
                    <li><Link to="/">Inicio</Link></li>
                    {isAdmin() ? <li><Link to="/admin">Administración</Link></li> : <li><Link to="/mi-salud">Mi Salud</Link></li>}
                </ul>
            </nav>
            <Sesion/>
        </div>
    </header>
    );
}

export default Header;