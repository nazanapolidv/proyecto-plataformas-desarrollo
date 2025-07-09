import React from "react";
import '../css/index.css';
import XLogo from '../assets/x.png';
import Instagram from '../assets/instagram.png';
import Facebook from '../assets/fb.png';
import Logo from '../assets/logo-removebg-preview.png';

const Footer = () => {
    return (
        <footer>
        <div className="container_footer">
            <div className="logo">
                <a href="/"><img src={Logo} alt="Logo"/></a>
            </div>
            <div className="contact_info">
                <p><b>Hospital Polaco</b></p>
                <p>hola@hospitalpolaco.com</p>
                <p>0800 888 9090</p>
            </div>
            <div className="footer_content">
                <div className="social_media">
                    <a href="#"><img src={Facebook} alt="Facebook"/></a>
                    <a href="#"><img src={XLogo} alt="X"/></a>
                    <a href="#"><img src={Instagram} alt="Instagram"/></a>
                </div>

                <div className="legal">
                    <p>©2025 Todos los derechos reservados</p>
                    <p>Política de privacidad</p>
                    <p>Términos y condiciones</p>
                </div>
            </div>
        </div>
    </footer>
    );
}

export default Footer;