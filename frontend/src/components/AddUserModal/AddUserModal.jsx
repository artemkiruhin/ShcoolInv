import { useState } from 'react';
import Modal from '../../components/common/Modal/Modal';
import styles from './AddUserModal.module.css';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        phone_number: '',
        is_admin: false,
        password: '',
        password_confirm: '',
        avatar: null
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (files ? files[0] : value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirm) {
            alert('Пароли не совпадают');
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} ${styles.large} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>Добавить нового пользователя</h3>
                    <button className={styles.closeModal} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <form id="addUserForm" onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Логин</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="full_name">ФИО</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone_number">Телефон</label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password_confirm">Подтверждение пароля</label>
                                <input
                                    type="password"
                                    id="password_confirm"
                                    name="password_confirm"
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="is_admin"
                                    checked={formData.is_admin}
                                    onChange={handleChange}
                                />
                                <span>Администратор</span>
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="avatar">Аватар</label>
                            <div className={styles.fileUpload}>
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                <label htmlFor="avatar" className={styles.fileUploadLabel}>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                    <span>{formData.avatar ? formData.avatar.name : 'Выберите файл'}</span>
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
                        form="addUserForm"
                    >
                        Сохранить пользователя
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddUserModal;