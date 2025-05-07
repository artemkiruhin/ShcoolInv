import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';
import Modal from '../../common/Modal';
import QRCodeGenerator from '../../common/QRCodeGenerator';

const InventoryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [relatedItems, setRelatedItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.inventoryItems.getItemById(parseInt(id));
                setItem(data);

                if (data.category_id) {
                    const allItems = await api.inventoryItems.getAll();
                    const related = allItems.filter(
                        i => i.category_id === data.category_id && i.id !== data.id
                    ).slice(0, 5);
                    setRelatedItems(related);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить запись?')) {
            try {
                await api.inventoryItems.deleteItem(parseInt(id));
                navigate('/inventory');
            } catch (err) {
                console.error('Error deleting item:', err);
            }
        }
    };

    const handleWriteOff = async () => {
        if (window.confirm('Вы уверены, что хотите сделать списание?')) {
            try {
                const updatedItem = await api.inventoryItems.writeOffItem(parseInt(id));
                setItem(updatedItem);
            } catch (err) {
                console.error('Error writing off item:', err);
            }
        }
    };

    if (loading) return <div className="loading-spinner">Загрузка...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;
    if (!item) return <div className="not-found">Инвентарь не найден</div>;

    return (
        <div className="inventory-view">
            <div className="header-section">
                <h1 className="page-title">
                    <span className="title-text">Инвентарь:</span>
                    <span className="item-name">{item.name}</span>
                </h1>
                <div className="action-buttons">
                    <Button
                        variant="secondary"
                        onClick={() => setShowQRModal(true)}
                        className="qr-button"
                    >
                        Сгенерировать QR код
                    </Button>
                    <Link
                        to={`/inventory/${id}/edit`}
                        className="btn warning edit-button"
                    >
                        Редактировать
                    </Link>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="delete-button"
                    >
                        Удалить
                    </Button>
                    {item.condition !== 'WRITTEN_OFF' && (
                        <Button
                            variant="danger"
                            onClick={handleWriteOff}
                            className="writeoff-button"
                        >
                            Списать
                        </Button>
                    )}
                </div>
            </div>

            <div className="content-grid">
                <div className="main-details">
                    <Card className="details-card">
                        <div className="detail-grid">
                            <div className="detail-group">
                                <h4 className="detail-label">Инвентаризационный номер</h4>
                                <p className="detail-value">{item.inventory_number}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Название</h4>
                                <p className="detail-value">{item.name}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Категория</h4>
                                <p className="detail-value">{item.category?.name}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Состояние</h4>
                                <p className="detail-value">
                  <span className={`status-badge ${item.condition.toLowerCase()}`}>
                    {api.constants.INVENTORY_CONDITIONS[item.condition]}
                  </span>
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Кабинет</h4>
                                <p className="detail-value">{item.room?.name || '-'}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Ответственный</h4>
                                <p className="detail-value">
                                    {item.user ? (
                                        <Link to={`/users/${item.user.id}`} className="user-link">
                                            {item.user.full_name}
                                        </Link>
                                    ) : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Дата покупки</h4>
                                <p className="detail-value">
                                    {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Стоимость</h4>
                                <p className="detail-value">
                                    {item.purchase_price ? `$${item.purchase_price}` : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Дата окончания гарантии</h4>
                                <p className="detail-value">
                                    {item.warranty_until ? (
                                        <>
                                            {new Date(item.warranty_until).toLocaleDateString()}
                                            {new Date(item.warranty_until) > new Date() ? (
                                                <span className="warranty-active"> (Активный)</span>
                                            ) : (
                                                <span className="warranty-expired"> (Не активный)</span>
                                            )}
                                        </>
                                    ) : '-'}
                                </p>
                            </div>
                            <div className="detail-group full-width">
                                <h4 className="detail-label">Описание</h4>
                                <p className="detail-value">
                                    {item.description || 'Нет'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="sidebar-section">
                    {item.photo && (
                        <Card className="photo-card">
                            <h3 className="card-title">Фотография</h3>
                            <div className="photo-container">
                                <img
                                    src={item.photo}
                                    alt={item.name}
                                    className="item-photo"
                                />
                            </div>
                        </Card>
                    )}

                    {relatedItems.length > 0 && (
                        <Card className="related-items-card">
                            <h3 className="card-title">Сопутствующие товары</h3>
                            <ul className="related-items-list">
                                {relatedItems.map(relatedItem => (
                                    <li key={relatedItem.id} className="related-item">
                                        <Link
                                            to={`/inventory/${relatedItem.id}`}
                                            className="related-item-link"
                                        >
                                            <span className="related-item-name">{relatedItem.name}</span>
                                            <span className={`related-item-status ${relatedItem.condition.toLowerCase()}`}>
                        {api.constants.INVENTORY_CONDITIONS[relatedItem.condition]}
                      </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                title={`QR Code for ${item.name}`}
                className="qr-modal"
            >
                {item && (
                    <QRCodeGenerator
                        value={`Inventory Item: ${item.name}\nNumber: ${item.inventory_number}\nCategory: ${item.category?.name}`}
                        downloadName={`inventory-${item.inventory_number}`}
                    />
                )}
            </Modal>
        </div>
    );
};

export default InventoryView;