import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import Button from '../common/Button';
import "../../assets/styles/Header.css"

const Header = () => {
    const navigate = useNavigate();

    const getUserData = () => {
        try {
            const userDataString = localStorage.getItem('userData');
            return userDataString ? JSON.parse(userDataString) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    };

    const userData = getUserData();
    const isAdmin = userData?.is_admin === true;

    const baseNavItems = [
        { path: '/', name: 'Главная' },
        { path: '/inventory', name: 'Инвентарь' },
        { path: '/categories', name: 'Категории' },
        { path: '/consumables', name: 'Расходники' },
        { path: '/rooms', name: 'Кабинеты' },
    ];

    const adminNavItems = [
        { path: '/users', name: 'Пользователи' },
        { path: '/logs', name: 'Логи' },
    ];

    const navItems = isAdmin
        ? [...baseNavItems, ...adminNavItems]
        : baseNavItems;

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-brand">
                    <NavLink to="/" className="logo-link">
                        <div className="logo-icon-container">
                            <svg className="logo-icon" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="2"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="logo-text">InventoryPro</span>
                    </NavLink>
                </div>

                <nav className="main-nav">
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <NavLink
                                    to={item.path}
                                    className={({isActive}) =>
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    end
                                >
                                    <span className="nav-text">{item.name}</span>
                                    <span className="nav-indicator"></span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-actions">
                    <div className="user-info">
                        <span className="user-name">{userData.name}</span>
                        <span className="user-role">{userData.role}</span>
                    </div>
                    <Button
                        variant="text"
                        className="logout-btn"
                        onClick={handleLogout}
                        startIcon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        }
                    >
                        Выход
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;