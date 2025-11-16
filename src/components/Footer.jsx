import React from "react";
import '../css/index.css';
import XLogo from '../assets/x.png';
import Instagram from '../assets/instagram.png';
import Facebook from '../assets/fb.png';
import Logo from '../assets/logo-removebg-preview.png';

const Footer = () => {
    return (
        <footer className="bg-[#ECEFF1] text-slate-100">
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    <a href="/" className="flex items-center gap-4">
                        <img src={Logo} alt="Hospital Polaco" className="h-12 w-auto" />
                        <div>
                            <p className="text-lg font-semibold text-slate-400">Hospital Polaco</p>
                            <p className="text-sm text-slate-400">Cuidamos tu salud, estés donde estés.</p>
                        </div>
                    </a>

                    <div className="grid gap-6 text-sm sm:grid-cols-2 md:flex md:items-center md:gap-10">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Contacto</p>
                            <a href="mailto:hola@hospitalpolaco.com" className="block text-slate-400 hover:text-slate-500 transition-colors">
                                hola@hospitalpolaco.com
                            </a>
                            <a href="tel:08008889090" className="block text-slate-400 hover:text-slate-500 transition-colors">
                                0800 888 9090
                            </a>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Seguinos</p>
                            <div className="flex items-center gap-3">
                                <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-slate-300 transition-colors">
                                    <img src={Facebook} alt="Facebook" className="h-5 w-5" />
                                </a>
                                <a href="#" aria-label="X" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-slate-300 transition-colors">
                                    <img src={XLogo} alt="X" className="h-5 w-5" />
                                </a>
                                <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-slate-300 transition-colors">
                                    <img src={Instagram} alt="Instagram" className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col gap-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <p>©2025 Hospital Polaco. Todos los derechos reservados.</p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-500 transition-colors">Política de privacidad</a>
                        <a href="#" className="text-slate-400 hover:text-slate-500 transition-colors">Términos y condiciones</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;