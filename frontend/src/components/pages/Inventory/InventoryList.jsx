import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';

const QRCodeModal = ({ item, show, onClose }) => {
    const modalRef = useRef(null);
    const [downloadUrl, setDownloadUrl] = useState('');

    useEffect(() => {
        if (show && modalRef.current) {
            const svg = modalRef.current.querySelector('svg');
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    setDownloadUrl(canvas.toDataURL('image/png'));
                };

                img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
            }
        }
    }, [show]);

    const handleDownload = () => {
        if (!downloadUrl) return;
        const link = document.createElement('a');
        link.download = `qr-code-${item.inventory_number}.png`;
        link.href = downloadUrl;
        link.click();
    };

    if (!show || !item) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3 className="modal-title">QR-код для {item.name}</h3>
                    <button
                        onClick={onClose}
                        className="modal-close-button"
                        aria-label="Закрыть"
                    >
                        ✕
                    </button>
                </div>

                <div ref={modalRef} className="qr-code-container">
                    <QRCodeSVG
                        value={`${window.location.origin}/inventory/${item.id}`}
                        size={240}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                <div className="modal-content">
                    <p className="inventory-number">Инв. номер: {item.inventory_number}</p>
                    <p className="modal-description">
                        Отсканируйте QR-код для быстрого доступа к странице инвентаря
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="modal-button modal-button-secondary"
                    >
                        Закрыть
                    </button>
                    <button
                        onClick={handleDownload}
                        className="modal-button modal-button-primary download-button"
                        disabled={!downloadUrl}
                    >
                        <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Скачать QR-код
                    </button>
                </div>
            </div>
        </div>
    );
};

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

    if (loading) return <div className="loading-spinner">Загрузка...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;

    return (
        <div className="inventory-list">
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Инвентарь</h1>
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="export-button"
                    >
                        {exportLoading ? 'Экспортируется...' : 'Отчет в Excel'}
                    </Button>
                    <Link to="/inventory/new" className="btn primary add-button">
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
                        <td>{item.category_name}</td>
                        <td>
                            <span className={`badge ${item.condition.toLowerCase()}`}>
                                {api.constants.INVENTORY_CONDITIONS[item.condition]}
                            </span>
                        </td>
                        <td>{item.room_name || '-'}</td>
                        <td>
                            <div className="flex space-x-2 action-buttons">
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
            <QRCodeModal
                item={selectedItem}
                show={showQRModal}
                onClose={() => setShowQRModal(false)}
            />
        </div>
    );
};

export default InventoryList;