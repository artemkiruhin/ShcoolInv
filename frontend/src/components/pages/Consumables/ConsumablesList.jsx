import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';

const ConsumablesList = () => {
    const [consumables, setConsumables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsumables = async () => {
            try {
                const data = await api.consumables.getConsumables();
                setConsumables(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchConsumables();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this consumable?')) {
            try {
                await api.consumables.deleteConsumable(id);
                setConsumables(consumables.filter(consumable => consumable.id !== id));
            } catch (err) {
                console.error('Error deleting consumable:', err);
            }
        }
    };

    const handleIncrease = async (id) => {
        const amount = prompt('Enter amount to increase:');
        if (amount && !isNaN(amount)) {
            try {
                await api.consumables.increaseQuantity(id, parseInt(amount));
                const updatedConsumables = await api.consumables.getAll();
                setConsumables(updatedConsumables);
            } catch (err) {
                console.error('Error increasing quantity:', err);
            }
        }
    };

    const handleDecrease = async (id) => {
        const amount = prompt('Enter amount to decrease:');
        if (amount && !isNaN(amount)) {
            try {
                await api.consumables.decreaseQuantity(id, parseInt(amount));
                const updatedConsumables = await api.consumables.getAll();
                setConsumables(updatedConsumables);
            } catch (err) {
                console.error('Error decreasing quantity:', err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Consumables</h1>
                <Link to="/consumables/new" className="btn primary">
                    Add New Consumable
                </Link>
            </div>

            <Table
                headers={['Name', 'Description', 'Quantity', 'Min Quantity', 'Unit', 'Actions']}
                data={consumables}
                renderRow={(consumable) => (
                    <tr key={consumable.id}>
                        <td>{consumable.name}</td>
                        <td>{consumable.description || '-'}</td>
                        <td className={consumable.quantity < consumable.min_quantity ? 'text-red-500 font-bold' : ''}>
                            {consumable.quantity}
                        </td>
                        <td>{consumable.min_quantity}</td>
                        <td>{consumable.unit}</td>
                        <td>
                            <div className="flex space-x-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleIncrease(consumable.id)}
                                >
                                    Increase
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleDecrease(consumable.id)}
                                >
                                    Decrease
                                </Button>
                                <Link to={`/consumables/${consumable.id}/edit`} className="btn warning sm">
                                    Edit
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(consumable.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
};

export default ConsumablesList;