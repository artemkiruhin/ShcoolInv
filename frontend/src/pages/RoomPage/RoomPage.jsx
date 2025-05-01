import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomDetails from '../../components/RoomDetails/RoomDetails';
import Button from '../../components/common/Button/Button';
import styles from './RoomPage.module.css';

const mockRoomsData = [
    { id: '1', name: 'Кабинет информатики', short_name: 'к. 203' },
    { id: '2', name: 'Физическая лаборатория', short_name: 'к. 305' },
];

const RoomPage = ({ isAuthenticated = true, isAdmin = true }) => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const foundRoom = mockRoomsData.find(r => r.id === roomId);
            if (!foundRoom) setError('Кабинет не найден');
            setRoom(foundRoom || null);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [roomId]);

    const handleSave = () => {
        console.log('Сохранение изменений:', room);
        setIsEditing(false);
    };

    const handleCancel = () => {
        const originalRoom = mockRoomsData.find(r => r.id === roomId);
        setRoom(originalRoom);
        setIsEditing(false);
    };

    const handleBack = () => navigate(-1);

    if (isLoading) return <div className={styles.loading}>Загрузка...</div>;

    if (error || !room) return (
        <div className={styles.errorContainer}>
            <h2>Ошибка</h2>
            <p>{error || `Кабинет с ID ${roomId} не найден`}</p>
            <Button onClick={() => navigate('/rooms')}>К списку кабинетов</Button>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button variant="outline" onClick={handleBack}>← Назад</Button>
                {isAdmin && (
                    <div className={styles.actions}>
                        {isEditing ? (
                            <>
                                <Button variant="primary" onClick={handleSave}>Сохранить</Button>
                                <Button variant="secondary" onClick={handleCancel}>Отмена</Button>
                            </>
                        ) : (
                            <Button variant="primary" onClick={() => setIsEditing(true)}>Редактировать</Button>
                        )}
                    </div>
                )}
            </div>

            <RoomDetails
                room={room}
                isEditing={isEditing}
                onRoomChange={setRoom}
            />
        </div>
    );
};

export default RoomPage;