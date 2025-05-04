import { useState } from 'react';
import styles from './ConsumableTable.module.css';

const ConsumablesTable = ({
                              data,
                              sortConfig = { key: null, direction: 'asc' },
                              onSort,
                              onView
                          }) => {
    const [hoveredRow, setHoveredRow] = useState(null);

    const categoryMap = {
        office: 'Канцелярия',
        printer: 'Расходники для принтеров',
        cleaning: 'Чистящие средства',
        other: 'Прочее'
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
                        Количество
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('quantity')}
                        >
                            {getSortIndicator('quantity')}
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
                        <td>{item.quantity}</td>
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
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsumablesTable;