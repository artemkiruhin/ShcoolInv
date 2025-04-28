import React from 'react';
import StatusBadge from '../common/StatusBadge/StatusBadge';
import styles from './InventoryItemDetails.module.css';

const InventoryItemDetails = ({ item }) => {
    const statusMap = {
        good: 'Отличное',
        warning: 'Требует проверки',
        bad: 'В ремонте',
        scrapped: 'Списано'
    };

    const categoryMap = {
        tech: 'Техника',
        furniture: 'Мебель',
        lab: 'Лабораторное оборудование',
        sport: 'Спортивный инвентарь',
        other: 'Другое'
    };

    return (
        <div className={styles.detailsContainer}>
            <h1 className={styles.title}>{item.name}</h1>

            <div className={styles.grid}>
                <div className={styles.imageSection}>
                    <img
                        src={item.image || '/placeholder-item.jpg'}
                        alt={item.name}
                        className={styles.itemImage}
                    />
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>ID:</span>
                        <span className={styles.value}>{item.id}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Категория:</span>
                        <span className={styles.value}>{categoryMap[item.category]}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Кабинет:</span>
                        <span className={styles.value}>{item.room}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Состояние:</span>
                        <StatusBadge status={item.status}>
                            {statusMap[item.status]}
                        </StatusBadge>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.label}>Дата добавления:</span>
                        <span className={styles.value}>{item.date}</span>
                    </div>

                    {item.description && (
                        <div className={styles.description}>
                            <h3>Описание:</h3>
                            <p>{item.description}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.qrSection}>
                <p className={styles.qrHint}>Отсканируйте QR-код для быстрого доступа</p>
                <div className={styles.qrCode}>
                </div>
            </div>
        </div>
    );
};

export default InventoryItemDetails;