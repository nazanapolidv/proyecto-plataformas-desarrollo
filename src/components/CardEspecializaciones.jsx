import React from "react";
import '../css/index.css';
import '../css/cardEspecializaciones.css';

const images = import.meta.glob('../assets/*.png', { eager: true, import: 'default' });

const CardEspecializaciones = ({nombreImg, altImg, titulo, desc}) => {
    const imgSrc = images[`../assets/${nombreImg}`];
    return (
        <div className="cardEspecializaciones">
            <img src={imgSrc} alt={altImg} />
            <div className="card-content">
                <h3>{titulo}</h3>
                <p>{desc}</p>
            </div>
        </div>
    );
}

export default CardEspecializaciones;