import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import api from '../../services/';

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
            <h1 className="dashboard-title">Главная страница</h1>

            <div className="stats-grid">
                <Card className="stat-card">
                    <h3 className="stat-title">Инвентарь</h3>
                    <p className="stat-value">{stats.inventoryItems}</p>
                </Card>
                <Card className="stat-card">
                    <h3 className="stat-title">Расходники</h3>
                    <p className="stat-value">{stats.consumables}</p>
                </Card>
                <Card className="stat-card">
                    <h3 className="stat-title">Пользователи</h3>
                    <p className="stat-value">{stats.users}</p>
                </Card>
                <Card className="stat-card">
                    <h3 className="stat-title">Кабинеты</h3>
                    <p className="stat-value">{stats.rooms}</p>
                </Card>
            </div>

            <div className="dashboard-content">
                <Card className="dashboard-card" title="Недавно добавленный инвентарь">
                    {recentItems.length > 0 ? (
                        <ul className="items-list">
                            {recentItems.map((item) => (
                                <li key={item.id} className="item-row">
                                    <div className="item-info">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-number">{item.inventory_number}</p>
                                    </div>
                                    <span className={`status-badge ${item.condition.toLowerCase()}`}>
                                        {api.constants.INVENTORY_CONDITIONS[item.condition]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data-message">Нет</p>
                    )}
                </Card>

                <Card className="dashboard-card" title="Расходники, которые заканчиваются">
                    {lowStockConsumables.length > 0 ? (
                        <ul className="items-list">
                            {lowStockConsumables.map((consumable) => (
                                <li key={consumable.id} className="item-row">
                                    <div className="item-info">
                                        <p className="item-name">{consumable.name}</p>
                                        <p className="item-quantity">
                                            {consumable.quantity} {consumable.unit} (min: {consumable.min_quantity})
                                        </p>
                                    </div>
                                    <span className="status-badge warning">Low Stock</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data-message">Нет</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;