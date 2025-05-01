// src/components/AddRoomModal/AddRoomModal.js
import { useState } from 'react';
import Modal from '../common/Modal/Modal';
import styles from './AddRoomModal.module.css';

const AddRoomModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        short_name: ''
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
        if (!formData.name.trim() || !formData.short_name.trim()) {
            alert('Заполните все обязательные поля');
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Добавить новый кабинет</h3>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Полное название</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="short_name">Короткое название</label>
                        <input
                            type="text"
                            id="short_name"
                            name="short_name"
                            value={formData.short_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.secondary}`}
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={`${styles.btn} ${styles.primary}`}
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddRoomModal;