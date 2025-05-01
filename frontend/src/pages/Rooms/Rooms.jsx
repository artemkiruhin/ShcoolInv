import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../../components/Footer/Footer';
import SearchBox from '../../components/common/SearchBox/SearchBox';
import RoomsTable from '../../components/RoomsTable/RoomsTable';
import Pagination from '../../components/Pagination/Pagination';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import Button from '../../components/common/Button/Button';
import styles from './Rooms.module.css';

const Rooms = () => {
    const navigate = useNavigate();
    const [roomsData, setRoomsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const mockData = [
            { id: '1', name: 'Кабинет информатики', short_name: 'к. 203' },
            { id: '2', name: 'Физическая лаборатория', short_name: 'к. 305' },
            { id: '3', name: 'Актовый зал', short_name: 'к. 101' },
        ];
        setRoomsData(mockData);
        setFilteredData(mockData);
    }, []);

    useEffect(() => {
        const filtered = roomsData.filter(room =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.short_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, roomsData]);

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleAddRoom = (newRoom) => {
        setRoomsData([...roomsData, { ...newRoom, id: Date.now().toString() }]);
        setShowAddModal(false);
    };

    return (
        <div className={styles.roomsPage}>
            <div className={styles.backgroundAnimation}></div>
            <main>
                <section className={styles.roomsSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Управление кабинетами</h2>
                        <div className={styles.actions}>
                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                + Добавить кабинет
                            </Button>
                            <SearchBox
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Поиск кабинетов..."
                            />
                        </div>
                    </div>

                    <RoomsTable
                        data={currentItems}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onView={(room) => navigate(`/rooms/${room.id}`)}
                    />

                    {sortedData.length === 0 && (
                        <div className={styles.noResults}>Кабинеты не найдены</div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </section>
            </main>
            <Footer />

            <AddRoomModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddRoom}
            />
        </div>
    );
};

export default Rooms;