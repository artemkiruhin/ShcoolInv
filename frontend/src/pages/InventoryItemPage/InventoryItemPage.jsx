import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InventoryItemDetails from '../../components/InventoryItemDetails/InventoryItemDetails';
import styles from './InventoryItemPage.module.css';

const mockInventoryData = [
    {
        idx: '1',
        id: '#INV-1001',
        name: 'Проектор Epson EB-X41',
        category: 'tech',
        room: 'Каб. 203',
        status: 'good',
        date: '15.03.2023',
        description: 'Мультимедийный проектор с разрешением XGA, 3400 люмен',
        image: 'https://via.placeholder.com/400'
    },
    {
        idx: '2',
        id: '#INV-1002',
        name: 'Ноутбук Lenovo IdeaPad 5',
        category: 'tech',
        room: 'Каб. 301',
        status: 'warning',
        date: '22.05.2023',
        description: '15.6" Ноутбук с процессором Intel Core i5',
        image: 'https://via.placeholder.com/400'
    }
];

const InventoryItemPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const foundItem = mockInventoryData.find(i => i.idx === `${itemId}`);
            setItem(foundItem || null);
        }, 500);

        return () => clearTimeout(timer);
    }, [itemId]);

    if (!item) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <h2>Предмет не найден</h2>
                    <p>Инвентарный предмет с ID #{itemId} не существует в системе</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <InventoryItemDetails item={item} />
        </div>
    );
};

export default InventoryItemPage;