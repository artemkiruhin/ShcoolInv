import { useState, useEffect } from 'react';
import styles from './UserProfile.module.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const mockUser = {
                    id: 1,
                    username: 'ivan_petrov',
                    email: 'ivan.petrov@example.com',
                    full_name: 'Иван Петров',
                    phone_number: '+7 (912) 345-67-89',
                    registered_at: '15.03.2022',
                    is_admin: true,
                    avatar: null
                };

                setTimeout(() => {
                    setUser(mockUser);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const getAvatarContent = (user) => {
        if (user.avatar) {
            return <img src={user.avatar} alt={`Аватар ${user.full_name}`} className={styles.avatarImage} />;
        }

        const letter = (user.full_name).charAt(0).toUpperCase();
        const colors = ['#6c5ce7', '#00b894', '#fd79a8', '#0984e3', '#e17055'];
        const color = colors[letter.charCodeAt(0) % colors.length];

        return (
            <div className={styles.avatarLetter} style={{ backgroundColor: color }}>
                {letter}
            </div>
        );
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (!user) {
        return <div className={styles.notFound}>Пользователь не найден</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Профиль пользователя</h1>
            </div>

            <div className={styles.profileContainer}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        {getAvatarContent(user)}
                    </div>

                    <div className={styles.userStatus}>
                        <span className={`${styles.statusBadge} ${user.is_admin ? styles.admin : styles.user}`}>
                            {user.is_admin ? 'Администратор' : 'Пользователь'}
                        </span>
                        <p className={styles.registrationDate}>
                            Зарегистрирован: {user.registered_at}
                        </p>
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.infoGroup}>
                        <h3 className={styles.sectionTitle}>Основная информация</h3>
                        <div className={styles.infoGrid}>
                            <InfoField label="Имя пользователя" value={user.username} />
                            <InfoField label="Полное имя" value={user.full_name} />
                        </div>
                    </div>

                    <div className={styles.infoGroup}>
                        <h3 className={styles.sectionTitle}>Контактная информация</h3>
                        <div className={styles.infoGrid}>
                            <InfoField label="Email" value={user.email} />
                            <InfoField label="Телефон" value={user.phone_number} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ label, value }) => {
    return (
        <div className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            <span className={styles.fieldValue}>{value || 'Не указано'}</span>
        </div>
    );
};

export default UserProfile;