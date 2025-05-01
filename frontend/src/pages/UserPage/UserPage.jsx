import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDetails from '../../components/UserDetails/UserDetails';
import Button from '../../components/common/Button/Button';
import styles from './UserPage.module.css';

const mockUsersData = [
    {
        idx: '1',
        id: '#USER-1001',
        username: 'ivanov',
        email: 'ivanov@example.com',
        full_name: 'Иванов Иван Иванович',
        phone_number: '+7 (900) 123-45-67',
        registered_at: '15.03.2023',
        is_admin: true,
        is_active: true,
        avatar: 'https://via.placeholder.com/400',
        position: 'Менеджер проектов',
        department: 'IT-отдел',
        last_login: '20.06.2023 14:30'
    },
    {
        idx: '2',
        id: '#USER-1002',
        username: 'petrov',
        email: 'petrov@example.com',
        full_name: 'Петров Пётр Петрович',
        phone_number: '+7 (900) 765-43-21',
        registered_at: '20.04.2023',
        is_admin: false,
        is_active: true,
        avatar: 'https://via.placeholder.com/400',
        position: 'Разработчик',
        department: 'Отдел разработки',
        last_login: '21.06.2023 09:15'
    }
];

const UserPage = ({ isAuthenticated = true, isAdmin = true }) => {
    const { id } = useParams();
    const userId = id;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = () => {
            try {
                setIsLoading(true);
                const timer = setTimeout(() => {
                    const foundUser = mockUsersData.find(u => u.idx === `${userId}`);
                    if (!foundUser) {
                        setError('Пользователь не найден');
                    }
                    setUser(foundUser || null);
                    setIsLoading(false);
                }, 500);

                return () => clearTimeout(timer);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleSave = () => {
        console.log('Сохранение изменений:', user);
        setIsEditing(false);
    };

    const handleCancel = () => {
        const originalUser = mockUsersData.find(u => u.idx === `${userId}`);
        setUser(originalUser);
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleUserChange = (updatedUser) => {
        setUser(updatedUser);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className={styles.container}>
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className={styles.backButton}
                >
                    ← Назад
                </Button>
                <div className={styles.errorContainer}>
                    <h2>Ошибка</h2>
                    <p>{error || `Пользователь с ID #${userId} не найден`}</p>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/users')}
                        className={styles.homeButton}
                    >
                        К списку пользователей
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button
                    variant="outline"
                    onClick={handleBack}
                    className={styles.backButton}
                >
                    ← Назад
                </Button>

                {(isAuthenticated && isAdmin) && (
                    <div className={styles.actions}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    className={styles.actionButton}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleCancel}
                                    className={styles.actionButton}
                                >
                                    Отмена
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={() => setIsEditing(true)}
                                className={styles.actionButton}
                            >
                                Редактировать
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <UserDetails
                user={user}
                isEditing={isEditing}
                onUserChange={handleUserChange}
            />
        </div>
    );
};

export default UserPage;