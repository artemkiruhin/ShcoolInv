import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import SearchBox from '../../components/common/SearchBox/SearchBox';
import FilterDropdown from '../../components/common/FilterDropdown/FilterDropdown';
import ConsumablesTable from '../../components/ConsumableTable/ConsumableTable';
import Pagination from '../../components/Pagination/Pagination';
import AddConsumableModal from '../../components/AddConsumableModal/AddConsumableModal';
import ViewConsumableModal from '../../components/ViewConsumableModal/ViewConsumableModal';
import Button from '../../components/common/Button/Button';
import styles from './Consumables.module.css';
import { useNavigate } from "react-router-dom";

const Consumables = () => {
    const navigate = useNavigate();

    const [consumablesData, setConsumablesData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const mockData = [
            {
                id: '#CONS-1001',
                name: 'Ручки шариковые',
                description: 'Синие шариковые ручки, 0.7 мм',
                quantity: 50,
                category: 'office'
            },
            {
                id: '#CONS-1002',
                name: 'Бумага А4',
                description: 'Белая офисная бумага 80 г/м²',
                quantity: 10,
                category: 'office'
            },
            {
                id: '#CONS-1003',
                name: 'Скрепки',
                description: 'Металлические скрепки, 28 мм',
                quantity: 200,
                category: 'office'
            },
            {
                id: '#CONS-1004',
                name: 'Картридж для принтера',
                description: 'Картридж HP 123 для лазерных принтеров',
                quantity: 3,
                category: 'printer'
            },
            {
                id: '#CONS-1005',
                name: 'Карандаши',
                description: 'Графитовые карандаши HB',
                quantity: 30,
                category: 'office'
            }
        ];
        setConsumablesData(mockData);
        setFilteredData(mockData);
    }, []);

    useEffect(() => {
        const filtered = consumablesData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterValue === 'all' || item.category === filterValue;
            return matchesSearch && matchesFilter;
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, filterValue, consumablesData]);

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let valueA, valueB;
        switch (sortConfig.key) {
            case 'id': valueA = a.id; valueB = b.id; break;
            case 'name': valueA = a.name; valueB = b.name; break;
            case 'quantity': valueA = a.quantity; valueB = b.quantity; break;
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
        const newId = `#CONS-${1000 + consumablesData.length + 1}`;
        const itemToAdd = {
            ...newItem,
            id: newId
        };
        setConsumablesData([itemToAdd, ...consumablesData]);
        setShowAddModal(false);
    };

    const handleViewItem = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleItemDetails = (item) => {
        navigate(`/consumables/${item.id}`)
    }

    const filterOptions = [
        { value: 'office', label: 'Канцелярия' },
        { value: 'printer', label: 'Расходники для принтеров' },
        { value: 'cleaning', label: 'Чистящие средства' },
        { value: 'other', label: 'Прочее' }
    ];

    return (
        <div className={styles.consumablesPage}>
            <div className={styles.backgroundAnimation}></div>
            <main>
                <section className={styles.consumablesSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Управление расходниками</h2>
                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                + Добавить расходник
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

                    <ConsumablesTable
                        data={currentItems}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onView={handleViewItem}
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

            <AddConsumableModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddItem}
            />

            <ViewConsumableModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                item={selectedItem}
                onDetails={() => handleItemDetails(selectedItem)}
            />
        </div>
    );
};

export default Consumables;