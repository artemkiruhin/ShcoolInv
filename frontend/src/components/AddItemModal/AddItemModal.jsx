import { useState } from 'react';
import Modal from '../../components/common/Modal/Modal';
import styles from './AddItemModal.module.css';

const AddItemModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        room: '',
        status: 'good',
        description: '',
        photo: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} ${styles.large} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Добавить новый предмет</h3>
                    <button className={styles.closeModal} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <form id="addItemForm" onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="itemName">Название предмета</label>
                                <input
                                    type="text"
                                    id="itemName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="itemCategory">Категория</label>
                                <select
                                    id="itemCategory"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите категорию</option>
                                    <option value="tech">Техника</option>
                                    <option value="furniture">Мебель</option>
                                    <option value="lab">Лабораторное оборудование</option>
                                    <option value="sport">Спортивный инвентарь</option>
                                    <option value="other">Другое</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="itemRoom">Кабинет</label>
                                <select
                                    id="itemRoom"
                                    name="room"
                                    value={formData.room}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите кабинет</option>
                                    <option value="101">Каб. 101</option>
                                    <option value="112">Каб. 112</option>
                                    <option value="203">Каб. 203</option>
                                    <option value="208">Каб. 208</option>
                                    <option value="301">Каб. 301</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="itemStatus">Состояние</label>
                                <select
                                    id="itemStatus"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="good">Отличное</option>
                                    <option value="warning">Требует проверки</option>
                                    <option value="bad">В ремонте</option>
                                    <option value="scrapped">Списано</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="itemDescription">Описание</label>
                            <textarea
                                id="itemDescription"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="itemPhoto">Фотография предмета</label>
                            <div className={styles.fileUpload}>
                                <input
                                    type="file"
                                    id="itemPhoto"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                <label htmlFor="itemPhoto" className={styles.fileUploadLabel}>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                    <span>{formData.photo ? formData.photo.name : 'Выберите файл'}</span>
                                </label>
                            </div>
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
                        form="addItemForm"
                    >
                        Сохранить предмет
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddItemModal;