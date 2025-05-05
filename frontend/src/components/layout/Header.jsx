import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../common/Button';

const Header = () => {
    const navItems = [
        { path: '/', name: 'Dashboard' },
        { path: '/inventory', name: 'Inventory' },
        { path: '/categories', name: 'Categories' },
        { path: '/consumables', name: 'Consumables' },
        { path: '/rooms', name: 'Rooms' },
        { path: '/users', name: 'Users' },
        { path: '/logs', name: 'Logs' },
    ];

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="header-brand">
                    <NavLink to="/" className="logo-link">
                        <span className="logo-icon">📦</span>
                        <span className="logo-text">InventoryPro</span>
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
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;