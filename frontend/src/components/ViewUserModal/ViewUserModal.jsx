import Modal from '../common/Modal/Modal';
import styles from './ViewUserModal.module.css';
import Button from '../common/Button/Button';

const ViewUserModal = ({
                           isOpen,
                           onClose,
                           user,
                           onEdit,
                           onDelete,
                           onDetails
                       }) => {
    if (!isOpen || !user) return null;

    const statusMap = {
        active: 'Активен',
        inactive: 'Неактивен',
        admin: 'Администратор'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Детали пользователя</h3>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatarSection}>
                            <img
                                src={user.avatar || '/default-avatar.png'}
                                alt="Аватар"
                                className={styles.avatar}
                            />
                            <h2 className={styles.userName}>{user.full_name}</h2>
                            <p className={styles.userRole}>{statusMap[user.is_admin ? 'admin' : user.is_active ? 'active' : 'inactive']}</p>
                        </div>

                        <div className={styles.detailsSection}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>ID:</span>
                                <span className={styles.detailValue}>{user.id}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Логин:</span>
                                <span className={styles.detailValue}>{user.username}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span className={styles.detailValue}>{user.email}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Телефон:</span>
                                <span className={styles.detailValue}>{user.phone_number || 'Не указан'}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Дата регистрации:</span>
                                <span className={styles.detailValue}>{user.registered_at}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <Button variant="secondary" onClick={onClose}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={onDetails}>
                        Подробная информация
                    </Button>
                    <div className={styles.actionButtons}>
                        <Button variant="warning" onClick={onEdit}>
                            Редактировать
                        </Button>
                        <Button variant="danger" onClick={onDelete}>
                            Удалить
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewUserModal;