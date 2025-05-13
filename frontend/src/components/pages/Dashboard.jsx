import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import api from '../../services/';
import "../../assets/styles/Dashboard.css"

const Dashboard = () => {
    const [stats, setStats] = useState({
        inventoryItems: 0,
        consumables: 0,
        users: 0,
        rooms: 0,
    });

    const [recentItems, setRecentItems] = useState([]);
    const [lowStockConsumables, setLowStockConsumables] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventoryResponse = await api.inventoryItems.getAll();
                const consumablesResponse = await api.consumables.getConsumables();
                const usersResponse = await api.users.getUsers();
                const roomsResponse = await api.rooms.getRooms();

                setStats({
                    inventoryItems: inventoryResponse.length,
                    consumables: consumablesResponse.length,
                    users: usersResponse.length,
                    rooms: roomsResponse.length,
                });

                // Fetch recent inventory items
                const recentItemsResponse = await api.inventoryItems.getItems(0, 5);
                setRecentItems(recentItemsResponse);

                // Fetch low stock consumables
                const lowStockResponse = await api.consumables.getLowStockConsumables();
                setLowStockConsumables(lowStockResponse);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Главная страница</h1>
            </div>

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-card-content">
                        <h3 className="stat-title">Инвентарь</h3>
                        <p className="stat-value">{stats.inventoryItems}</p>
                        <div className="stat-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5H21V7H3V5ZM3 11H21V13H3V11ZM3 17H21V19H3V17Z" fill="var(--accent-color)"/>
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-card-content">
                        <h3 className="stat-title">Расходники</h3>
                        <p className="stat-value">{stats.consumables}</p>
                        <div className="stat-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                                      fill="var(--success-color)"/>
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-card-content">
                        <h3 className="stat-title">Пользователи</h3>
                        <p className="stat-value">{stats.users}</p>
                        <div className="stat-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
                                    fill="var(--primary-color)"/>
                            </svg>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-card-content">
                        <h3 className="stat-title">Кабинеты</h3>
                        <p className="stat-value">{stats.rooms}</p>
                        <div className="stat-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM5 13.11V17.5L12 21L19 17.5V13.11L12 17L5 13.11Z"
                                    fill="var(--warning-color)"/>
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="dashboard-content">
                <Card className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Недавно добавленный инвентарь</h3>
                        <a href="/inventory" className="view-all-link">Все →</a>
                    </div>
                    <div className="card-body">
                        {recentItems.length > 0 ? (
                            <ul className="items-list">
                                {recentItems.map((item) => (
                                    <li key={item.id} className="item-row">
                                        <div className="item-info">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-number text-muted">{item.inventory_number}</p>
                                        </div>
                                        <span className={`status-badge ${item.condition.toLowerCase()}`}>
                  {api.constants.INVENTORY_CONDITIONS[item.condition]}
                </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">—</div>
                                <p className="no-data-message text-muted">Нет данных</p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Расходники, которые заканчиваются</h3>
                        <a href="/consumables" className="view-all-link">Все →</a>
                    </div>
                    <div className="card-body">
                        {lowStockConsumables.length > 0 ? (
                            <ul className="items-list">
                                {lowStockConsumables.map((consumable) => (
                                    <li key={consumable.id} className="item-row">
                                        <div className="item-info">
                                            <p className="item-name">{consumable.name}</p>
                                            <p className="item-quantity text-muted">
                                                {consumable.quantity} {consumable.unit} (min: {consumable.min_quantity})
                                            </p>
                                        </div>
                                        <span className="status-badge warning">Low Stock</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">—</div>
                                <p className="no-data-message text-muted">Нет данных</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;