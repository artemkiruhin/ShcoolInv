import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InventoryItemDetails from '../../components/InventoryItemDetails/InventoryItemDetails';
import Button from '../../components/common/Button/Button';
import styles from './InventoryItemPage.module.css';

const mockInventoryData = [
    {
        idx: '1',
        id: '#INV-1001',
        name: 'Проектор Epson EB-X41',
        category: 'Техника',
        room: 'Каб. 203',
        status: 'good',
        date: '15.03.2023',
        description: 'Мультимедийный проектор с разрешением XGA, 3400 люмен',
        image: 'https://via.placeholder.com/400',
        serialNumber: 'SN-EP-2023-001',
        purchaseDate: '10.03.2023',
        warrantyUntil: '10.03.2025',
        price: '45 999 ₽',
        supplier: 'ООО "ТехноПро"'
    },
    {
        idx: '2',
        id: '#INV-1002',
        name: 'Ноутбук Lenovo IdeaPad 5',
        category: 'Техника',
        room: 'Каб. 301',
        status: 'warning',
        date: '22.05.2023',
        description: '15.6" Ноутбук с процессором Intel Core i5',
        image: 'https://via.placeholder.com/400',
        serialNumber: 'SN-LN-2023-042',
        purchaseDate: '15.05.2023',
        warrantyUntil: '15.05.2025',
        price: '64 499 ₽',
        supplier: 'ООО "КомпьютерМаркет"'
    }
];

const InventoryItemPage = ({ isAuthenticated = true, isAdmin = true }) => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = () => {
            try {
                setIsLoading(true);
                const timer = setTimeout(() => {
                    const foundItem = mockInventoryData.find(i => i.idx === `${itemId}`);
                    if (!foundItem) {
                        setError('Item not found');
                    }
                    setItem(foundItem || null);
                    setIsLoading(false);
                }, 500);

                return () => clearTimeout(timer);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [itemId]);

    const handleSave = () => {
        console.log('Сохранение изменений:', item);
        setIsEditing(false);
    };

    const handleCancel = () => {
        const originalItem = mockInventoryData.find(i => i.idx === `${itemId}`);
        setItem(originalItem);
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleItemChange = (updatedItem) => {
        setItem(updatedItem);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className={styles.container}>
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className={styles.backButton}
                >
                    ← Назад
                </Button>
                <div className={styles.errorContainer}>
                    <h2>Ошибка</h2>
                    <p>{error || `Предмет с ID #${itemId} не найден`}</p>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/inventory')}
                        className={styles.homeButton}
                    >
                        К списку инвентаря
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className={styles.backButton}
                >
                    ← Назад
                </Button>

                {(isAuthenticated && isAdmin) && (
                    <div className={styles.actions}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    className={styles.actionButton}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleCancel}
                                    className={styles.actionButton}
                                >
                                    Отмена
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={() => setIsEditing(true)}
                                className={styles.actionButton}
                            >
                                Редактировать
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <InventoryItemDetails
                item={item}
                isEditing={isEditing}
                onItemChange={handleItemChange}
            />
        </div>
    );
};

export default InventoryItemPage;