import { useState } from 'react';
import Header from '../../components/Header/Header';
import StatsCard from '../../components/StatsCard/StatsCard';
import Button from '../../components/common/Button/Button';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [isAdmin] = useState(true); // Заглушка для проверки прав админа

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

    const handleQuickReport = (type) => {
        console.log(`Генерация отчета: ${type}`);
        alert(`Отчет по ${type} будет сгенерирован`);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.backgroundAnimation}></div>
            <main>
                <section className={styles.statsSection}>
                    <StatsCard
                        title="Всего предметов"
                        value="1,248"
                        change="+24 за месяц"
                        gradient="purple"
                    />
                    <StatsCard
                        title="В ремонте"
                        value="47"
                        change="+2 за месяц"
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

                {isAdmin && (
                    <section className={styles.adminSection}>
                        <h2 className={styles.sectionTitle}>Администратор</h2>
                        <div className={styles.statsSection}>
                            <StatsCard
                                title="Сотрудников"
                                value="42"
                                change="+3 за месяц"
                                gradient="red"
                            />
                            <StatsCard
                                title="Активных сессий"
                                value="18"
                                change="-2 за неделю"
                                gradient="cyan"
                            />
                        </div>
                        <div className={styles.adminActions}>
                            <Button variant="outline" onClick={() => console.log('Переход к сотрудникам')}>
                                Управление сотрудниками
                            </Button>
                            <Button variant="outline" onClick={() => console.log('Переход к кабинетам')}>
                                Управление кабинетами
                            </Button>
                        </div>
                    </section>
                )}

                <section className={styles.actionsSection}>
                    <div className={styles.quickReports}>
                        <h2 className={styles.sectionTitle}>Быстрые отчеты</h2>
                        <div className={styles.reportButtons}>
                            <Button variant="secondary" onClick={() => handleQuickReport('всему инвентарю')}>
                                Полный отчет
                            </Button>
                            <Button variant="secondary" onClick={() => handleQuickReport('состоянию "Хорошее"')}>
                                По состоянию "Хорошее"
                            </Button>
                            <Button variant="secondary" onClick={() => handleQuickReport('состоянию "Требует ремонта"')}>
                                По состоянию "Требует ремонта"
                            </Button>
                            <Button variant="secondary" onClick={() => handleQuickReport('состоянию "Списано"')}>
                                По состоянию "Списано"
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;