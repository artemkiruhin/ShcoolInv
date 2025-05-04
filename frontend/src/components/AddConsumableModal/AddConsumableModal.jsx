import { useState } from 'react';
import Modal from '../../components/common/Modal/Modal';
import styles from './AddConsumableModal.module.css';

const AddConsumableModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: 1,
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            quantity: parseInt(formData.quantity)
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Добавить новый расходник</h3>
                    <button className={styles.closeModal} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <form id="addConsumableForm" onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="consumableName">Название</label>
                                <input
                                    type="text"
                                    id="consumableName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="consumableCategory">Категория</label>
                                <select
                                    id="consumableCategory"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    <option value="office">Канцелярия</option>
                                    <option value="printer">Расходники для принтеров</option>
                                    <option value="cleaning">Чистящие средства</option>
                                    <option value="other">Прочее</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="consumableQuantity">Количество</label>
                                <input
                                    type="number"
                                    id="consumableQuantity"
                                    name="quantity"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="consumableDescription">Описание</label>
                            <textarea
                                id="consumableDescription"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </form>
                </div>
                <div className={styles.modalFooter}>
                    <button className={`${styles.btn} ${styles.secondary}`} onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className={`${styles.btn} ${styles.primary}`}
                        type="submit"
                        form="addConsumableForm"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddConsumableModal;