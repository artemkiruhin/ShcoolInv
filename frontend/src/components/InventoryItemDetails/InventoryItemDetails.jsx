import styles from './InventoryItemDetails.module.css';

const InventoryItemDetails = ({ item, isEditing = false, onItemChange }) => {
    const handleChange = (field, value) => {
        onItemChange({ ...item, [field]: value });
    };

    const statusColors = {
        good: '#10b981',
        warning: '#f59e0b',
        bad: '#ef4444'
    };

    const statusLabels = {
        good: 'Хорошее',
        warning: 'Требует ремонта',
        bad: 'Списано'
    };

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.imageSection}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                {isEditing && (
                    <div className={styles.imageUpload}>
                        <button className={styles.uploadButton}>Загрузить новое фото</button>
                    </div>
                )}
            </div>

            <div className={styles.infoSection}>
                <div className={styles.section}>
                    <h2 className={styles.itemName}>
                        {isEditing ? (
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={styles.editInput}
                            />
                        ) : (
                            item.name
                        )}
                    </h2>

                    <div className={styles.statusBadge} style={{ backgroundColor: statusColors[item.status] }}>
                        {statusLabels[item.status]}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Основная информация</h3>
                    <div className={styles.detailGrid}>
                        <DetailRow
                            label="Инвентарный номер"
                            value={item.id}
                            isEditing={false}
                        />
                        <DetailRow
                            label="Категория"
                            value={item.category}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('category', value)}
                        />
                        <DetailRow
                            label="Кабинет"
                            value={item.room}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('room', value)}
                        />
                        <DetailRow
                            label="Дата постановки на учет"
                            value={item.date}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('date', value)}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Дополнительная информация</h3>
                    <div className={styles.detailGrid}>
                        <DetailRow
                            label="Серийный номер"
                            value={item.serialNumber}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('serialNumber', value)}
                        />
                        <DetailRow
                            label="Дата покупки"
                            value={item.purchaseDate}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('purchaseDate', value)}
                        />
                        <DetailRow
                            label="Гарантия до"
                            value={item.warrantyUntil}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('warrantyUntil', value)}
                        />
                        <DetailRow
                            label="Цена"
                            value={item.price}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('price', value)}
                        />
                        <DetailRow
                            label="Поставщик"
                            value={item.supplier}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('supplier', value)}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Описание</h3>
                    {isEditing ? (
                        <textarea
                            value={item.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={styles.editTextarea}
                            rows="4"
                        />
                    ) : (
                        <p className={styles.description}>{item.description}</p>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Состояние</h3>
                    {isEditing ? (
                        <select
                            value={item.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className={styles.statusSelect}
                        >
                            <option value="good">Хорошее</option>
                            <option value="warning">Требует ремонта</option>
                            <option value="bad">Списано</option>
                        </select>
                    ) : (
                        <div className={styles.statusInfo}>
                            <div className={styles.statusIndicator} style={{ backgroundColor: statusColors[item.status] }} />
                            <span>{statusLabels[item.status]}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ label, value, isEditing = false, onChange }) => {
    return (
        <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{label}:</span>
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.editInput}
                />
            ) : (
                <span className={styles.detailValue}>{value}</span>
            )}
        </div>
    );
};

export default InventoryItemDetails;