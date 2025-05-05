import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import QRCodeGenerator from '../../common/QRCodeGenerator';

const InventoryList = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const data = await api.inventoryItems.getAll();
                setInventoryItems(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchInventoryItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.inventoryItems.deleteItem(id);
                setInventoryItems(inventoryItems.filter(item => item.id !== id));
            } catch (err) {
                console.error('Error deleting item:', err);
            }
        }
    };

    const handleWriteOff = async (id) => {
        if (window.confirm('Are you sure you want to write off this item?')) {
            try {
                const updatedItem = await api.inventoryItems.writeOffItem(id);
                setInventoryItems(inventoryItems.map(item =>
                    item.id === id ? updatedItem : item
                ));
            } catch (err) {
                console.error('Error writing off item:', err);
            }
        }
    };

    const handleShowQR = (item) => {
        setSelectedItem(item);
        setShowQRModal(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Inventory Items</h1>
                <Link to="/inventory/new" className="btn primary">
                    Add New Item
                </Link>
            </div>

            <Table
                headers={['Inventory Number', 'Name', 'Category', 'Condition', 'Room', 'Actions']}
                data={inventoryItems}
                renderRow={(item) => (
                    <tr key={item.id}>
                        <td>{item.inventory_number}</td>
                        <td>{item.name}</td>
                        <td>{item.category?.name}</td>
                        <td>
              <span className={`badge ${item.condition.toLowerCase()}`}>
                {api.constants.INVENTORY_CONDITIONS[item.condition]}
              </span>
                        </td>
                        <td>{item.room?.name || '-'}</td>
                        <td>
                            <div className="flex space-x-2">
                                <Button variant="secondary" size="sm" onClick={() => handleShowQR(item)}>
                                    QR Code
                                </Button>
                                <Link to={`/inventory/${item.id}`} className="btn primary sm">
                                    View
                                </Link>
                                <Link to={`/inventory/${item.id}/edit`} className="btn warning sm">
                                    Edit
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </Button>
                                {item.condition !== 'WRITTEN_OFF' && (
                                    <Button variant="danger" size="sm" onClick={() => handleWriteOff(item.id)}>
                                        Write Off
                                    </Button>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            />

            <Modal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                title={`QR Code for ${selectedItem?.name}`}
            >
                {selectedItem && (
                    <QRCodeGenerator
                        value={`Inventory Item: ${selectedItem.name}\nNumber: ${selectedItem.inventory_number}`}
                        downloadName={`inventory-${selectedItem.inventory_number}`}
                    />
                )}
            </Modal>
        </div>
    );
};

export default InventoryList;