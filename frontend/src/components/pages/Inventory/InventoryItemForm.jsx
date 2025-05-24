import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';

const InventoryItemForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        inventory_number: '',
        name: '',
        description: '',
        category_id: '',
        condition: 'NORMAL',
        room_id: '',
        user_id: '',
        photo: null,
        purchase_date: '',
        purchase_price: '',
        warranty_until: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, roomsRes, usersRes] = await Promise.all([
                    api.categories.getCategories(),
                    api.rooms.getRooms(),
                    api.users.getUsers(),
                ]);

                setCategories(categoriesRes);
                setRooms(roomsRes);
                setUsers(usersRes);

                if (isEditMode) {
                    const item = await api.inventoryItems.getItemById(parseInt(id));
                    setFormData({
                        inventory_number: item.inventory_number || '',
                        name: item.name || '',
                        description: item.description || '',
                        category_id: item.category_id || '',
                        condition: item.condition || 'NORMAL',
                        room_id: item.room_id || '',
                        user_id: item.user_id || '',
                        photo: item.photo || null,
                        purchase_date: item.purchase_date ? item.purchase_date.split('T')[0] : '',
                        purchase_price: item.purchase_price || '',
                        warranty_until: item.warranty_until ? item.warranty_until.split('T')[0] : '',
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Название обязательно';
        if (!formData.category_id) errors.category_id = 'Категория обязательна';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setFormData(prev => ({
                    ...prev,
                    photo: base64String,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const preparedData = api.inventoryItems.prepareInventoryItemData(formData);

            if (isEditMode) {
                await api.inventoryItems.updateItem(parseInt(id), preparedData);
            } else {
                await api.inventoryItems.createItem(preparedData);
            }
            navigate('/inventory');
        } catch (error) {
            console.error('Error saving item:', error);
            navigate('/inventory');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="page-title">
                {isEditMode ? 'Редактирование' : 'Добавление'}
            </h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Инвентаризационный номер</label>
                            <input
                                type="text"
                                name="inventory_number"
                                value={formData.inventory_number}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Название <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Описание</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Категория <span className="text-red-500">*</span></label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="form-control"
                                required
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Состояние</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="form-control"
                            >
                                {Object.entries(api.constants.INVENTORY_CONDITIONS).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Кабинет</label>
                            <select
                                name="room_id"
                                value={formData.room_id}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">Выберите кабинет</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ответственный</label>
                            <select
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="">Выберите ответственного</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Фотография</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control"
                            />
                            {formData.photo && (
                                <div className="mt-2">
                                    <img
                                        src={formData.photo}
                                        alt="Item"
                                        className="h-20 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Дата покупки</label>
                            <input
                                type="date"
                                name="purchase_date"
                                value={formData.purchase_date}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Стоимость</label>
                            <input
                                type="number"
                                step="0.01"
                                name="purchase_price"
                                value={formData.purchase_price}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Дата окончания гарантии</label>
                            <input
                                type="date"
                                name="warranty_until"
                                value={formData.warranty_until}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/inventory')}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditMode ? 'Сохранить изменения' : 'Добавить'}
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Поля, отмеченные <span className="text-red-500">*</span>, обязательны для заполнения
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default InventoryItemForm;