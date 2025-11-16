import React, { useState } from "react";
import '../css/index.css';
import Sesion from './Sesion';
import Logo from '../assets/logo-removebg-preview.png';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { to: '/', label: 'Inicio' },
        isAdmin()
            ? { to: '/admin', label: 'Administración' }
            : { to: '/mi-salud', label: 'Mi Salud' },
    ];

    const handleToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <header className="sticky top-0 z-40 bg-[#ECEFF1]/95 backdrop-blur border-b border-slate-200/60">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={Logo} alt="Hospital Polaco" className="h-12 w-auto" />
                        <span className="text-lg font-semibold text-slate-600">Hospital Polaco</span>
                    </Link>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:block">
                            <Sesion />
                        </div>
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:bg-slate-200/70 transition-colors md:hidden"
                            aria-label="Abrir o cerrar menú"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                {isMenuOpen ? (
                                    <path d="M18 6 6 18M6 6l12 12" />
                                ) : (
                                    <>
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                <nav
                    className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-6 pb-6 text-sm text-slate-600 md:flex md:flex-row md:items-center md:justify-between md:pb-4`}
                >
                    <ul className="flex flex-col gap-4 font-medium md:flex-row md:items-center md:gap-8">
                        {navigation.map((item) => (
                            <li key={item.to}>
                                <Link
                                    to={item.to}
                                    className="block rounded-full px-4 py-2 transition-colors hover:bg-white/70 hover:text-slate-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="md:hidden">
                        <Sesion />
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;