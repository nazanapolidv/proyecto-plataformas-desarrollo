import SinAuth from './SinAuth';
import '../css/index.css';
import '../css/MiSalud.css';
import { useEffect, useState } from 'react';
import profileImg from '../assets/profile.png';
import calendarImg from '../assets/calendar.png';

const MiSalud = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <main className='flex flex-row items-center justify-center h-[70vh] m-auto'>
            {user?.rol == "paciente" ? (
                <>
                    <div>
                        <h2 className="title">Mi Salud</h2>
                        <h3 className="subtitle">¡Hola, <b>{user ? user.nombre : ''}</b>!</h3>
                    </div>
                    <div className="container_mi_salud">
                        <div className="card_container">
                            <div className="card">
                                <a className="redireccion" href="/mis-citas">
                                    <div className="card_image_container">
                                        <img src={calendarImg} alt="Citas" />
                                    </div>
                                    <div className="card-content">
                                        <h3>Mis citas</h3>
                                        <p>Desde acá podes gestionar tus citas médicas</p>
                                    </div>
                                </a>
                            </div>
                            <div className="card">
                                <a className="redireccion" href="/mi-historial">
                                    <div className="card_image_container">
                                        <img src={calendarImg} alt="Historial" />
                                    </div>
                                    <div className="card-content">
                                        <h3>Mi historial</h3>
                                        <p>
                                            Consultá tu historial de atención en nuestros centros médicos
                                        </p>
                                    </div>
                                </a>
                            </div>
                            <div className="card">
                                <a className="redireccion" href="/mi-perfil">
                                    <div className="card_image_container">
                                        <img src={profileImg} alt="Perfil" />
                                    </div>
                                    <div className="card-content">
                                        <h3>Mi perfil</h3>
                                        <p>Actualizá tu perfil</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <SinAuth />
            )}

        </main>
    )
}

export default MiSalud;