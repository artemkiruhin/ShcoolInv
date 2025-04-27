import { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import StatsCard from '../../components/StatsCard/StatsCard';
import InventoryTable from '../../components/InventoryTable/InventoryTable';
import QrModal from '../../components/QrModal/QrModal';
import AddItemModal from '../../components/AddItemModal/AddItemModal';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [inventory, setInventory] = useState([
        { id: '#INV-1001', name: 'Проектор Epson EB-X41', room: 'Каб. 203', status: 'good', date: '15.03.2023' },
        { id: '#INV-1002', name: 'Ноутбук Lenovo IdeaPad 5', room: 'Каб. 301', status: 'warning', date: '22.05.2023' },
        { id: '#INV-1003', name: 'Микроскоп биологический', room: 'Каб. 112', status: 'bad', date: '10.01.2023' },
        { id: '#INV-1004', name: 'Принтер HP LaserJet Pro', room: 'Каб. 208', status: 'good', date: '05.09.2023' }
    ]);

    const handleAddItem = (newItem) => {
        const newId = `#INV-${1000 + inventory.length + 1}`;
        const today = new Date().toLocaleDateString('ru-RU');
        setInventory([...inventory, {
            ...newItem,
            id: newId,
            date: today
        }]);
    };

    const handleQrClick = (item) => {
        setSelectedItem(item);
        setShowQrModal(true);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.backgroundAnimation}></div>
            <Header />
            <main>
                <section className={styles.statsSection}>
                    <StatsCard
                        title="Всего предметов"
                        value="1,248"
                        change="+12 за неделю"
                        gradient="purple"
                    />
                    <StatsCard
                        title="В ремонте"
                        value="47"
                        change="-3 за неделю"
                        gradient="blue"
                    />
                    <StatsCard
                        title="Списано"
                        value="89"
                        change="+5 за месяц"
                        gradient="orange"
                    />
                    <StatsCard
                        title="Кабинеты"
                        value="28"
                        change="2 новых"
                        gradient="green"
                    />
                </section>

                <InventoryTable
                    data={inventory}
                    onAddClick={() => setShowAddModal(true)}
                    onQrClick={handleQrClick}
                />
            </main>
            <Footer />

            <AddItemModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddItem}
            />

            <QrModal
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                item={selectedItem}
            />
        </div>
    );
};

export default Dashboard;