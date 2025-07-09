import "../css/Index.css";
import "../css/MiPerfil.css";
import SinAuth from "./SinAuth";
import userImg from "../assets/profile.png";

const MiPerfil = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return (
            <SinAuth />
        );
    }

    return (
        <>
            <main>
                <h2 className="title">Mi Perfil</h2>
                <img src={userImg} className="user_img" alt="foto de perfil" />
                <div className="datos">
                    <div className="columna">
                        <p><strong>Nombre</strong>{user.nombre}</p>
                        <p><strong>Correo electrónico</strong>{user.email}</p>
                    </div>
                    <div className="columna">
                        <p><strong>Apellido</strong>{user.apellido}</p>
                        <p><strong>Fecha de nacimiento</strong>15 de marzo de 1995</p>
                    </div>
                </div>
            </main>
        </>
    );
}

export default MiPerfil