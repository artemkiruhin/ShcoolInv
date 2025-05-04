import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/common/Button/Button';
import styles from './ConsumableDetails.module.css';

const ConsumableDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consumable, setConsumable] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const mockData = {
            id: '1',
            name: 'Ручки шариковые',
            description: 'Синие шариковые ручки, 0.7 мм',
            quantity: 50,
            category: 'office',
            minQuantity: 10,
            supplier: 'ОфисМаркет',
            purchaseDate: '15.03.2023',
            price: '250 руб.'
        };
        setConsumable(mockData);
        setFormData(mockData);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setConsumable(formData);
        setIsEditing(false);
    };

    const categoryMap = {
        office: 'Канцелярия',
        printer: 'Расходники для принтеров',
        cleaning: 'Чистящие средства',
        other: 'Прочее'
    };

    if (!consumable) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={styles.consumableDetailsPage}>
            <div className={styles.backgroundAnimation}></div>
            <main>
                <section className={styles.detailsSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Детали расходника</h2>
                        <div className={styles.actions}>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/consumables')}
                            >
                                ← Назад к списку
                            </Button>
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Отменить
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                    >
                                        Сохранить
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Редактировать
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsContainer}>
                        <div className={styles.mainInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>ID:</span>
                                <span className={styles.infoValue}>{consumable.id}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Название:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <span className={styles.infoValue}>{consumable.name}</span>
                                )}
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Категория:</span>
                                {isEditing ? (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={styles.editSelect}
                                    >
                                        <option value="office">Канцелярия</option>
                                        <option value="printer">Расходники для принтеров</option>
                                        <option value="cleaning">Чистящие средства</option>
                                        <option value="other">Прочее</option>
                                    </select>
                                ) : (
                                    <span className={styles.infoValue}>
                                        {categoryMap[consumable.category] || consumable.category}
                                    </span>
                                )}
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Количество:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <span className={styles.infoValue}>{consumable.quantity}</span>
                                )}
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Минимальный запас:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="minQuantity"
                                        value={formData.minQuantity}
                                        onChange={handleChange}
                                        min="0"
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <span className={styles.infoValue}>{consumable.minQuantity}</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.additionalInfo}>
                            <div className={styles.infoGroup}>
                                <h3 className={styles.groupTitle}>Описание</h3>
                                {isEditing ? (
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={styles.editTextarea}
                                        rows="4"
                                    />
                                ) : (
                                    <p className={styles.description}>{consumable.description}</p>
                                )}
                            </div>

                            <div className={styles.infoGroup}>
                                <h3 className={styles.groupTitle}>Дополнительная информация</h3>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Поставщик:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="supplier"
                                            value={formData.supplier}
                                            onChange={handleChange}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{consumable.supplier}</span>
                                    )}
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Дата покупки:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="purchaseDate"
                                            value={formData.purchaseDate}
                                            onChange={handleChange}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{consumable.purchaseDate}</span>
                                    )}
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Цена:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{consumable.price}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ConsumableDetails;