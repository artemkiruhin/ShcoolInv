import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';

const ConsumableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 0,
        min_quantity: 1,
        unit: 'шт.',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isEditMode) {
            const fetchConsumable = async () => {
                try {
                    const consumable = await api.consumables.getConsumableById(parseInt(id));
                    setFormData({
                        name: consumable.name,
                        description: consumable.description || '',
                        quantity: consumable.quantity,
                        min_quantity: consumable.min_quantity,
                        unit: consumable.unit,
                    });
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching consumable:', error);
                    setLoading(false);
                }
            };

            fetchConsumable();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'min_quantity' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                await api.consumables.updateConsumable(parseInt(id), formData);
            } else {
                await api.consumables.createConsumable(formData);
            }
            navigate('/consumables');
        } catch (error) {
            console.error('Error saving consumable:', error);
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
                    <div className="grid grid-cols-1 gap-6">
                        <div className="form-group">
                            <label className="form-label">Название</label>
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label">Количество</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Минимальное количество</label>
                                <input
                                    type="number"
                                    name="min_quantity"
                                    value={formData.min_quantity}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Мера</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="шт.">шт.</option>
                                    <option value="л">л</option>
                                    <option value="кг">кг</option>
                                    <option value="м">м</option>
                                    <option value="упак.">упак.</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/consumables')}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditMode ? 'Сохранить изменения' : 'Добавить'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ConsumableForm;