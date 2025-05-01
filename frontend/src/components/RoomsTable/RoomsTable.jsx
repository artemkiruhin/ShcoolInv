import styles from './RoomsTable.module.css';
import {useState} from "react";

const RoomsTable = ({ data, sortConfig, onSort, onView }) => {
    const [hoveredRow, setHoveredRow] = useState(null);

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
                        Название
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('name')}
                        >
                            {getSortIndicator('name')}
                        </button>
                    </th>
                    <th>
                        Короткое название
                        <button
                            className={styles.sortBtn}
                            onClick={() => onSort('short_name')}
                        >
                            {getSortIndicator('short_name')}
                        </button>
                    </th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {data.map((room, index) => (
                    <tr
                        key={room.id}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={hoveredRow === index ? styles.hoveredRow : ''}
                    >
                        <td>{room.name}</td>
                        <td>{room.short_name}</td>
                        <td>
                            <button
                                className={`${styles.actionBtn} ${styles.view}`}
                                onClick={() => onView(room)}
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/>
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

export default RoomsTable;