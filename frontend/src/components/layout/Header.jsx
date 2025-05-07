import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../common/Button';

const Header = () => {
    const navItems = [
        { path: '/', name: 'Главная' },
        { path: '/inventory', name: 'Инвентарь' },
        { path: '/categories', name: 'Категории' },
        { path: '/consumables', name: 'Расходники' },
        { path: '/rooms', name: 'Кабинеты' },
        { path: '/users', name: 'Пользователи' },
        { path: '/logs', name: 'Логи' },
    ];

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
                                >
                                    {item.name}
                                    <span className="nav-underline"></span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header-actions">
                    <Button variant="secondary" className="logout-btn">
                        <span className="btn-icon">👋</span>
                        <span>Выйти</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;