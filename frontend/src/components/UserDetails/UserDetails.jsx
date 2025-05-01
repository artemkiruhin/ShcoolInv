import styles from './UserDetails.module.css';

const UserDetails = ({ user, isEditing = false, onUserChange }) => {
    const handleChange = (field, value) => {
        onUserChange({ ...user, [field]: value });
    };

    const statusLabels = {
        active: 'Активен',
        inactive: 'Неактивен',
        admin: 'Администратор'
    };

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.imageSection}>
                <img src={user.avatar} alt={user.full_name} className={styles.userImage} />
                {isEditing && (
                    <div className={styles.imageUpload}>
                        <button className={styles.uploadButton}>Загрузить новое фото</button>
                    </div>
                )}
            </div>

            <div className={styles.infoSection}>
                <div className={styles.section}>
                    <h2 className={styles.userName}>
                        {isEditing ? (
                            <input
                                type="text"
                                value={user.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                                className={styles.editInput}
                            />
                        ) : (
                            user.full_name
                        )}
                    </h2>

                    <div className={styles.statusBadge}>
                        {statusLabels[user.is_admin ? 'admin' : user.is_active ? 'active' : 'inactive']}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Основная информация</h3>
                    <div className={styles.detailGrid}>
                        <DetailRow
                            label="ID пользователя"
                            value={user.id}
                            isEditing={false}
                        />
                        <DetailRow
                            label="Логин"
                            value={user.username}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('username', value)}
                        />
                        <DetailRow
                            label="Email"
                            value={user.email}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('email', value)}
                        />
                        <DetailRow
                            label="Телефон"
                            value={user.phone_number}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('phone_number', value)}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Дополнительная информация</h3>
                    <div className={styles.detailGrid}>
                        <DetailRow
                            label="Должность"
                            value={user.position}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('position', value)}
                        />
                        <DetailRow
                            label="Отдел"
                            value={user.department}
                            isEditing={isEditing}
                            onChange={(value) => handleChange('department', value)}
                        />
                        <DetailRow
                            label="Дата регистрации"
                            value={user.registered_at}
                            isEditing={false}
                        />
                        <DetailRow
                            label="Последний вход"
                            value={user.last_login}
                            isEditing={false}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Статус</h3>
                    {isEditing ? (
                        <div className={styles.statusControls}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={user.is_admin}
                                    onChange={(e) => handleChange('is_admin', e.target.checked)}
                                />
                                Администратор
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={user.is_active}
                                    onChange={(e) => handleChange('is_active', e.target.checked)}
                                />
                                Активный
                            </label>
                        </div>
                    ) : (
                        <div className={styles.statusInfo}>
                            <span>{statusLabels[user.is_admin ? 'admin' : user.is_active ? 'active' : 'inactive']}</span>
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
                <span className={styles.detailValue}>{value || 'Не указано'}</span>
            )}
        </div>
    );
};

export default UserDetails;