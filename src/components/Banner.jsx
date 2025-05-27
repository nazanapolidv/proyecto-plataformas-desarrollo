import Banner from '../assets/banner.png';
import '../css/index.css';

const BannerComponent = () => {
    return (
        <div class="main_image">
            <img src={Banner} alt="Hospital Polaco"/>
        </div>
    );
}

export default BannerComponent;