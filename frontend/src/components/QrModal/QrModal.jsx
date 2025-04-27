import { useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import styles from './QrModal.module.css';
import qrcode from 'qrcode-generator';

const QrModal = ({ isOpen, onClose, item }) => {
    useEffect(() => {
        if (isOpen && item) {
            const qr = qrcode(0, 'L');
            qr.addData(`${item.name} | ${item.id} | ${item.room}`);
            qr.make();

            const qrContainer = document.getElementById('qrCodeContainer');
            if (qrContainer) {
                qrContainer.innerHTML = qr.createImgTag(4);
                qrContainer.querySelector('img').style.maxWidth = '100%';
            }
        }
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={`${styles.modalContent} glass-effect`}>
                <div className={styles.modalHeader}>
                    <h3>QR-код для инвентарного предмета</h3>
                    <button className={styles.closeModal} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.qrCodeContainer} id="qrCodeContainer"></div>
                    <div className={styles.itemInfo}>
                        <h4>{item.name}</h4>
                        <p>ID: <span>{item.id}</span></p>
                        <p>Кабинет: <span>{item.room}</span></p>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={`${styles.btn} ${styles.secondary}`} id="downloadQrBtn">
                        Скачать PNG
                    </button>
                    <button className={`${styles.btn} ${styles.primary}`} id="printQrBtn">
                        Распечатать
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default QrModal;