import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../common/Button';

const Header = () => {
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
        window.location.href = '/login';
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-brand">
                    <NavLink to="/" className="logo-link">
                        <span className="logo-icon">📦</span>
                        <span className="logo-text">Инвентарь</span>
                    </NavLink>
                </div>

                <nav className="main-nav">
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    end
                                >
                                    {item.name}
                                    <span className="nav-underline"></span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-actions">
                    <Button
                        variant="secondary"
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <span className="btn-icon">👋</span>
                        <span>Выйти</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;