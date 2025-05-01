import styles from './RoomDetails.module.css';

const RoomDetails = ({ room, isEditing, onRoomChange }) => {
    const handleChange = (field, value) => {
        onRoomChange({ ...room, [field]: value });
    };

    return (
        <div className={styles.detailsContainer}>
            <div className={styles.section}>
                <h2 className={styles.title}>
                    {isEditing ? (
                        <input
                            value={room.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={styles.editInput}
                        />
                    ) : (
                        room.name
                    )}
                </h2>

                <div className={styles.detailItem}>
                    <span className={styles.label}>Короткое название:</span>
                    {isEditing ? (
                        <input
                            value={room.short_name}
                            onChange={(e) => handleChange('short_name', e.target.value)}
                            className={styles.editInput}
                        />
                    ) : (
                        <span className={styles.value}>{room.short_name}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;