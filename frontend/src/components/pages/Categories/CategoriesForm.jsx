import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        short_name: '',
        description: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isEditMode) {
            const fetchCategory = async () => {
                try {
                    const category = await api.categories.getCategoryById(parseInt(id));
                    setFormData({
                        name: category.name,
                        short_name: category.short_name,
                        description: category.description || '',
                    });
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching category:', error);
                    setLoading(false);
                }
            };

            fetchCategory();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                await api.categories.updateCategory(parseInt(id), formData);
            } else {
                await api.categories.createCategory(formData);
            }
            navigate('/categories');
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="page-title">
                {isEditMode ? 'Edit Category' : 'Create New Category'}
            </h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="form-group">
                            <label className="form-label">Name</label>
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
                            <label className="form-label">Short Name</label>
                            <input
                                type="text"
                                name="short_name"
                                value={formData.short_name}
                                onChange={handleChange}
                                className="form-control"
                                required
                                maxLength="10"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/categories')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditMode ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CategoryForm;