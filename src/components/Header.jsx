import '../css/Header.css';
import '../css/index.css';
import Sesion from './Sesion';
import Logo from '../assets/logo-removebg-preview.png';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const isAdmin = user?.rol === 'administrador';

    return (
        <header>
        <div className="container_header">
            <div className="logo">
                <a href="/"><img src={Logo} alt="Logo"/></a>
            </div>
            <nav className="menu">
                <ul className="menu_list">
                    <li><a href="/">Inicio</a></li>
                    {isAdmin ? <li><a href="/admin">Administración</a></li> : <li><a href="/mi-salud">Mi Salud</a></li>}
                </ul>
            </nav>
            <Sesion/>
        </div>
    </header>
    );
}

export default Header;