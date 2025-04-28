import Modal from '../common/Modal/Modal';
import styles from './ViewItemModal.module.css';

const ViewItemModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    const categoryMap = {
        tech: 'Техника',
        furniture: 'Мебель',
        lab: 'Лабораторное оборудование',
        sport: 'Спортивный инвентарь',
        other: 'Другое'
    };

    const statusMap = {
        good: 'Отличное',
        warning: 'Требует проверки',
        bad: 'В ремонте',
        scrapped: 'Списано'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Просмотр предмета</h3>
                    <button className={styles.closeModal} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.itemViewContainer}>
                        <div className={styles.itemImage}>
                            <img
                                src={item.image || 'https://via.placeholder.com/300'}
                                alt="Изображение предмета"
                            />
                        </div>
                        <div className={styles.itemDetails}>
                            <h4>{item.name}</h4>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>ID:</span>
                                <span className={styles.detailValue}>{item.id}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Категория:</span>
                                <span className={styles.detailValue}>{categoryMap[item.category] || item.category}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Кабинет:</span>
                                <span className={styles.detailValue}>{item.room}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Состояние:</span>
                                <span className={styles.detailValue}>{statusMap[item.status] || item.status}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Дата добавления:</span>
                                <span className={styles.detailValue}>{item.date}</span>
                            </div>
                            <div className={`${styles.detailRow} ${styles.fullWidth}`}>
                                <span className={styles.detailLabel}>Описание:</span>
                                <span className={styles.detailValue}>{item.description || 'Нет описания'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button
                        className={`${styles.btn} ${styles.primary}`}
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewItemModal;