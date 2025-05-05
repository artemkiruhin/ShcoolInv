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
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.inventoryItems.deleteItem(parseInt(id));
                navigate('/inventory');
            } catch (err) {
                console.error('Error deleting item:', err);
            }
        }
    };

    const handleWriteOff = async () => {
        if (window.confirm('Are you sure you want to write off this item?')) {
            try {
                const updatedItem = await api.inventoryItems.writeOffItem(parseInt(id));
                setItem(updatedItem);
            } catch (err) {
                console.error('Error writing off item:', err);
            }
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!item) return <div className="not-found">Item not found</div>;

    return (
        <div className="inventory-view">
            <div className="header-section">
                <h1 className="page-title">
                    <span className="title-text">Inventory Item:</span>
                    <span className="item-name">{item.name}</span>
                </h1>
                <div className="action-buttons">
                    <Button
                        variant="secondary"
                        onClick={() => setShowQRModal(true)}
                        className="qr-button"
                    >
                        Generate QR Code
                    </Button>
                    <Link
                        to={`/inventory/${id}/edit`}
                        className="btn warning edit-button"
                    >
                        Edit
                    </Link>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="delete-button"
                    >
                        Delete
                    </Button>
                    {item.condition !== 'WRITTEN_OFF' && (
                        <Button
                            variant="danger"
                            onClick={handleWriteOff}
                            className="writeoff-button"
                        >
                            Write Off
                        </Button>
                    )}
                </div>
            </div>

            <div className="content-grid">
                <div className="main-details">
                    <Card className="details-card">
                        <div className="detail-grid">
                            <div className="detail-group">
                                <h4 className="detail-label">Inventory Number</h4>
                                <p className="detail-value">{item.inventory_number}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Name</h4>
                                <p className="detail-value">{item.name}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Category</h4>
                                <p className="detail-value">{item.category?.name}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Condition</h4>
                                <p className="detail-value">
                  <span className={`status-badge ${item.condition.toLowerCase()}`}>
                    {api.constants.INVENTORY_CONDITIONS[item.condition]}
                  </span>
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Room</h4>
                                <p className="detail-value">{item.room?.name || '-'}</p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Assigned User</h4>
                                <p className="detail-value">
                                    {item.user ? (
                                        <Link to={`/users/${item.user.id}`} className="user-link">
                                            {item.user.full_name}
                                        </Link>
                                    ) : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Purchase Date</h4>
                                <p className="detail-value">
                                    {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Purchase Price</h4>
                                <p className="detail-value">
                                    {item.purchase_price ? `$${item.purchase_price}` : '-'}
                                </p>
                            </div>
                            <div className="detail-group">
                                <h4 className="detail-label">Warranty Until</h4>
                                <p className="detail-value">
                                    {item.warranty_until ? (
                                        <>
                                            {new Date(item.warranty_until).toLocaleDateString()}
                                            {new Date(item.warranty_until) > new Date() ? (
                                                <span className="warranty-active"> (Active)</span>
                                            ) : (
                                                <span className="warranty-expired"> (Expired)</span>
                                            )}
                                        </>
                                    ) : '-'}
                                </p>
                            </div>
                            <div className="detail-group full-width">
                                <h4 className="detail-label">Description</h4>
                                <p className="detail-value">
                                    {item.description || 'No description available'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="sidebar-section">
                    {item.photo && (
                        <Card className="photo-card">
                            <h3 className="card-title">Item Photo</h3>
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
                            <h3 className="card-title">Related Items</h3>
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