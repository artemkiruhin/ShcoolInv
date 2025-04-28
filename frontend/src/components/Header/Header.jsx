import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={`${styles.header} glass-effect`}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                    <svg viewBox="0 0 24 24">
                        <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                    </svg>
                </div>
                <h1>School<span>Inv</span></h1>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? styles.active : ''}
                        >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/inventory"
                            className={({ isActive }) => isActive ? styles.active : ''}
                        >
                            Инвентарь
                        </NavLink>
                    </li>
                    <li><a href="#">Отчеты</a></li>
                    <li><a href="#">Настройки</a></li>
                </ul>
            </nav>
            <div className={styles.userProfile}>
                <div className={styles.avatar}>АП</div>
                <span>Админ Петров</span>
            </div>
        </header>
    );
};

export default Header;