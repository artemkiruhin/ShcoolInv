import { useState } from 'react';
import StatusBadge from '../common/StatusBadge/StatusBadge';
import styles from './InventoryTable.module.css';

const InventoryTable = ({
                            data,
                            sortConfig = { key: null, direction: 'asc' },
                            onSort,
                            onView,
                            onGenerateQr
                        }) => {
    const [hoveredRow, setHoveredRow] = useState(null);

    const categoryMap = {
        tech: 'Техника',
        furniture: 'Мебель',
        lab: 'Лабораторное оборудование',
        sport: 'Спортивный инвентарь',
        other: 'Другое'
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return '↓';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>
                        ID
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('id')}
                        >
                            {getSortIndicator('id')}
                        </button>
                    </th>
                    <th>
                        Название
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('name')}
                        >
                            {getSortIndicator('name')}
                        </button>
                    </th>
                    <th>Категория</th>
                    <th>
                        Кабинет
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('room')}
                        >
                            {getSortIndicator('room')}
                        </button>
                    </th>
                    <th>Состояние</th>
                    <th>
                        Дата добавления
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('date')}
                        >
                            {getSortIndicator('date')}
                        </button>
                    </th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr
                        key={item.id}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={hoveredRow === index ? styles.hoveredRow : ''}
                    >
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{categoryMap[item.category] || item.category}</td>
                        <td>{item.room}</td>
                        <td><StatusBadge status={item.status} /></td>
                        <td>{item.date}</td>
                        <td>
                            <button
                                className={`${styles.actionBtn} ${styles.view}`}
                                title="Просмотр"
                                onClick={() => onView(item)}
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/>
                                </svg>
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.edit}`}
                                title="Редактировать"
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                                </svg>
                            </button>
                            <button
                                className={`${styles.actionBtn} ${styles.qr}`}
                                title="Генерация QR-кода"
                                onClick={() => onGenerateQr(item)}
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;