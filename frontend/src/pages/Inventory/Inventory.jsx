import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SearchBox from '../../components/common/SearchBox/SearchBox';
import FilterDropdown from '../../components/common/FilterDropdown/FilterDropdown';
import InventoryTable from '../../components/InventoryTable/InventoryTable';
import Pagination from '../../components/Pagination/Pagination';
import AddItemModal from '../../components/AddItemModal/AddItemModal';
import QrModal from '../../components/QrModal/QrModal';
import ViewItemModal from '../../components/ViewItemModal/ViewItemModal';
import Button from '../../components/common/Button/Button';
import styles from './Inventory.module.css';

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const mockData = [
            {
                id: '#INV-1001',
                name: 'Проектор Epson EB-X41',
                category: 'tech',
                room: 'Каб. 203',
                status: 'good',
                date: '15.03.2023',
                description: 'Мультимедийный проектор с разрешением XGA, 3400 люмен'
            },
        ];
        setInventoryData(mockData);
        setFilteredData(mockData);
    }, []);

    useEffect(() => {
        const filtered = inventoryData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.room.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterValue === 'all' || item.category === filterValue;
            return matchesSearch && matchesFilter;
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, filterValue, inventoryData]);

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let valueA, valueB;
        switch (sortConfig.key) {
            case 'id': valueA = a.id; valueB = b.id; break;
            case 'name': valueA = a.name; valueB = b.name; break;
            case 'room': valueA = a.room; valueB = b.room; break;
            case 'date':
                valueA = new Date(a.date.split('.').reverse().join('-'));
                valueB = new Date(b.date.split('.').reverse().join('-'));
                break;
            default: return 0;
        }

        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleAddItem = (newItem) => {
        const newId = `#INV-${1000 + inventoryData.length + 1}`;
        const today = new Date().toLocaleDateString('ru-RU');
        const itemToAdd = {
            ...newItem,
            id: newId,
            date: today
        };
        setInventoryData([itemToAdd, ...inventoryData]);
        setShowAddModal(false);
    };

    const handleViewItem = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleGenerateQr = (item) => {
        setSelectedItem(item);
        setShowViewModal(false);
        setShowQrModal(true);
    };

    const filterOptions = [
        { value: 'tech', label: 'Техника' },
        { value: 'furniture', label: 'Мебель' },
        { value: 'lab', label: 'Лабораторное оборудование' },
        { value: 'sport', label: 'Спортивный инвентарь' }
    ];

    return (
        <div className={styles.inventoryPage}>
            <div className={styles.backgroundAnimation}></div>
            <Header />
            <main>
                <section className={styles.inventorySection}>
                    <div className={styles.sectionHeader}>
                        <h2>Управление инвентарем</h2>
                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                + Добавить предмет
                            </Button>
                            <SearchBox
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Поиск..."
                            />
                            <FilterDropdown
                                options={filterOptions}
                                selectedValue={filterValue}
                                onChange={setFilterValue}
                                defaultLabel="Все категории"
                            />
                        </div>
                    </div>

                    <InventoryTable
                        data={currentItems}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onView={handleViewItem}
                        onGenerateQr={handleGenerateQr}
                    />

                    {sortedData.length === 0 && (
                        <div className={styles.noResults}>Нет данных для отображения</div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </section>
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

            <ViewItemModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                item={selectedItem}
                onGenerateQr={handleGenerateQr}
            />
        </div>
    );
};

export default Inventory;