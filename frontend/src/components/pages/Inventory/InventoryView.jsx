import React, {useState, useEffect, useRef} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';

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
                alert('Не удалось удалить запись');
            }
        }
    };

    const handleWriteOff = async () => {
        if (window.confirm('Вы уверены, что хотите сделать списание?')) {
            try {
                const updatedItem = await api.inventoryItems.writeOffItem(parseInt(id));
                setItem(updatedItem);
                alert('Инвентарь успешно списан');
            } catch (err) {
                console.error('Error writing off item:', err);
                alert('Не удалось списать инвентарь');
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

            <QRCodeModal
                item={item}
                show={showQRModal}
                onClose={() => setShowQRModal(false)}
            />

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
                                <p className="detail-value">{item.category_name || '-'}</p>
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
                                <p className="detail-value">{item.room_name || '-'}</p>
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
                                    {item.purchase_price ? `${item.purchase_price.toLocaleString()} ₽` : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Дата окончания гарантии</h4>
                                <p className="detail-value">
                                    {item.warranty_until ? (
                                        <>
                                            {new Date(item.warranty_until).toLocaleDateString()}
                                            {new Date(item.warranty_until) > new Date() ? (
                                                <span className="warranty-active"> (Активная)</span>
                                            ) : (
                                                <span className="warranty-expired"> (Истекла)</span>
                                            )}
                                        </>
                                    ) : '-'}
                                </p>
                            </div>
                            <div className="detail-group full-width">
                                <h4 className="detail-label">Описание</h4>
                                <p className="detail-value">
                                    {item.description || 'Нет описания'}
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
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/default-inventory-item.jpg';
                                    }}
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
        </div>
    );
};

export default InventoryView;