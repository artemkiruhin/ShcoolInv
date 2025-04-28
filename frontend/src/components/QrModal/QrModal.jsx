import { useEffect } from 'react';
import Modal from '../common/Modal/Modal';
import qrcode from 'qrcode-generator';
import styles from './QrModal.module.css';

const QrModal = ({ isOpen, onClose, item }) => {
    useEffect(() => {
        if (isOpen && item) {
            const qr = qrcode(0, 'L');
            qr.addData(`${window.location.origin}/items/${item.id}`);
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
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>QR-код предмета</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <div id="qrCodeContainer" className={styles.qrContainer}></div>
                    <div className={styles.itemInfo}>
                        <h4>{item.name}</h4>
                        <p>ID: {item.id}</p>
                        <p>Ссылка: {window.location.origin}/items/{item.id}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default QrModal;