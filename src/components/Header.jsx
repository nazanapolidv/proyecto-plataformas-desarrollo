import '../css/Header.css';
import '../css/index.css';
import Sesion from './Sesion';
import Logo from '../assets/logo-removebg-preview.png';

const Header = () => {
    return (
        <header>
        <div className="container_header">
            <div className="logo">
                <a href="../index.html"><img src={Logo} alt="Logo"/></a>
            </div>
            <nav className="menu">
                <ul className="menu_list">
                    <li><a href="../index.html">Inicio</a></li>
                    <li><a href="misalud.html">Mi Salud</a></li>
                    <li><a href="contacto.html">Contacto</a></li>
                </ul>
            </nav>
            <Sesion/>
        </div>
    </header>
    );
}

export default Header;