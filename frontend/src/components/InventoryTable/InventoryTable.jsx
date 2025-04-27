import { useState } from 'react';
import StatusBadge from '../common/StatusBadge/StatusBadge';
import styles from './InventoryTable.module.css';

const InventoryTable = ({ data, onAddClick, onQrClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className={styles.inventorySection}>
            <div className={styles.sectionHeader}>
                <h2>Управление инвентарем</h2>
                <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.primary}`} onClick={onAddClick}>
                        + Добавить предмет
                    </button>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg viewBox="0 0 24 24">
                            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Кабинет</th>
                        <th>Состояние</th>
                        <th>Дата добавления</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.room}</td>
                            <td><StatusBadge status={item.status} /></td>
                            <td>{item.date}</td>
                            <td>
                                <button className={`${styles.actionBtn} ${styles.view}`} title="Просмотр">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/>
                                    </svg>
                                </button>
                                <button className={`${styles.actionBtn} ${styles.edit}`} title="Редактировать">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                                    </svg>
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.qr}`}
                                    title="Генерация QR-кода"
                                    onClick={() => onQrClick(item)}
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
        </section>
    );
};

export default InventoryTable;