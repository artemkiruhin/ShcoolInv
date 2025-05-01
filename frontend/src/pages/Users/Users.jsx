import { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import SearchBox from '../../components/common/SearchBox/SearchBox';
import FilterDropdown from '../../components/common/FilterDropdown/FilterDropdown';
import UsersTable from '../../components/UsersTable/UsersTable';
import Pagination from '../../components/Pagination/Pagination';
import AddUserModal from '../../components/AddUserModal/AddUserModal';
import ViewUserModal from '../../components/ViewUserModal/ViewUserModal';
import Button from '../../components/common/Button/Button';
import styles from './Users.module.css';
import { useNavigate } from "react-router-dom";

const Users = () => {
    const navigate = useNavigate();

    const [usersData, setUsersData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const mockData = [
            {
                id: '#USER-1001',
                username: 'ivanov',
                email: 'ivanov@example.com',
                full_name: 'Иванов Иван Иванович',
                phone_number: '+7 (900) 123-45-67',
                registered_at: '15.03.2023',
                is_admin: true,
                is_active: true,
                avatar: 'https://via.placeholder.com/150'
            },
            {
                id: '#USER-1002',
                username: 'petrov',
                email: 'petrov@example.com',
                full_name: 'Петров Петр Петрович',
                phone_number: '+7 (900) 765-43-21',
                registered_at: '20.04.2023',
                is_admin: false,
                is_active: true,
                avatar: 'https://via.placeholder.com/150'
            },
        ];
        setUsersData(mockData);
        setFilteredData(mockData);
    }, []);

    useEffect(() => {
        const filtered = usersData.filter(user => {
            const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone_number.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterValue === 'all' ||
                (filterValue === 'admin' && user.is_admin) ||
                (filterValue === 'active' && user.is_active) ||
                (filterValue === 'inactive' && !user.is_active);
            return matchesSearch && matchesFilter;
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, filterValue, usersData]);

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let valueA, valueB;
        switch (sortConfig.key) {
            case 'id': valueA = a.id; valueB = b.id; break;
            case 'username': valueA = a.username; valueB = b.username; break;
            case 'full_name': valueA = a.full_name; valueB = b.full_name; break;
            case 'registered_at':
                valueA = new Date(a.registered_at.split('.').reverse().join('-'));
                valueB = new Date(b.registered_at.split('.').reverse().join('-'));
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

    const handleAddUser = (newUser) => {
        const newId = `#USER-${1000 + usersData.length + 1}`;
        const today = new Date().toLocaleDateString('ru-RU');
        const userToAdd = {
            ...newUser,
            id: newId,
            registered_at: today,
            is_active: true
        };
        setUsersData([userToAdd, ...usersData]);
        setShowAddModal(false);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleUserDetails = (user) => {
        navigate(`/users/${user.id}`);
    }

    const filterOptions = [
        { value: 'admin', label: 'Администраторы' },
        { value: 'active', label: 'Активные' },
        { value: 'inactive', label: 'Неактивные' }
    ];

    return (
        <div className={styles.usersPage}>
            <div className={styles.backgroundAnimation}></div>
            <main>
                <section className={styles.usersSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Управление пользователями</h2>
                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                + Добавить пользователя
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
                                defaultLabel="Все пользователи"
                            />
                        </div>
                    </div>

                    <UsersTable
                        data={currentItems}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onView={handleViewUser}
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

            <AddUserModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddUser}
            />

            <ViewUserModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                user={selectedUser}
                onDetails={() => handleUserDetails(selectedUser)}
            />
        </div>
    );
};

export default Users;