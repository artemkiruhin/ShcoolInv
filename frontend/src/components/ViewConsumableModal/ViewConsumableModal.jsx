import Modal from '../../components/common/Modal/Modal';
import styles from './ViewConsumableModal.module.css';

const ViewConsumableModal = ({ isOpen, onClose, item, onDetails }) => {
    if (!item) return null;

    const categoryMap = {
        office: 'Канцелярия',
        printer: 'Расходники для принтеров',
        cleaning: 'Чистящие средства',
        other: 'Прочее'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Просмотр расходника</h3>
                    <button className={styles.closeModal} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>ID:</span>
                            <span className={styles.infoValue}>{item.id}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Название:</span>
                            <span className={styles.infoValue}>{item.name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Категория:</span>
                            <span className={styles.infoValue}>{categoryMap[item.category] || item.category}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Количество:</span>
                            <span className={styles.infoValue}>{item.quantity}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Описание:</span>
                            <span className={styles.infoValue}>{item.description}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button
                        className={`${styles.btn} ${styles.secondary}`}
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                    <button
                        className={`${styles.btn} ${styles.primary}`}
                        onClick={onDetails}
                    >
                        Подробнее
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewConsumableModal;