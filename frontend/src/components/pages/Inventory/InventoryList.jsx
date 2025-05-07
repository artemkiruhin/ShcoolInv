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
    const [exportLoading, setExportLoading] = useState(false);

    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const data = await api.inventoryItems.getAll();
                console.log(data);
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
        if (window.confirm('Вы уверены, что хотите удалить запись?')) {
            try {
                await api.inventoryItems.deleteItem(id);
                setInventoryItems(inventoryItems.filter(item => item.id !== id));
            } catch (err) {
                console.error('Error deleting item:', err);
            }
        }
    };

    const handleWriteOff = async (id) => {
        if (window.confirm('Вы уверены, что хотите списать инвентарь?')) {
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

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const blob = await api.reports.generateExcelReport(api.constants.ReportType.INVENTORY_ITEMS);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            a.download = `inventory_export_${dateStr}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error exporting inventory:', err);
            alert('Ошибка экспорта, попробуйте снова.');
        } finally {
            setExportLoading(false);
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Инвентарь</h1>
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={exportLoading}
                    >
                        {exportLoading ? 'Экспортируется...' : 'Отчет в Excel'}
                    </Button>
                    <Link to="/inventory/new" className="btn primary">
                        Добавить запись
                    </Link>
                </div>
            </div>

            <Table
                headers={['Инвентаризационный номер', 'Название', 'Категория', 'Состояние', 'Кабинет', 'Действия']}
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
                                    QR-код
                                </Button>
                                <Link to={`/inventory/${item.id}`} className="btn primary sm">
                                    Подробнее
                                </Link>
                                <Link to={`/inventory/${item.id}/edit`} className="btn warning sm">
                                    Редактировать
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                    Удалить
                                </Button>
                                {item.condition !== 'WRITTEN_OFF' && (
                                    <Button variant="danger" size="sm" onClick={() => handleWriteOff(item.id)}>
                                        Списать
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