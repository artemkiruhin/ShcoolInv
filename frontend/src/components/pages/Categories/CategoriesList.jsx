import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.categories.getCategories();
                setCategories(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.categories.deleteCategory(id);
                setCategories(categories.filter(category => category.id !== id));
            } catch (err) {
                console.error('Error deleting category:', err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Categories</h1>
                <Link to="/categories/new" className="btn primary">
                    Add New Category
                </Link>
            </div>

            <Table
                headers={['Name', 'Short Name', 'Description', 'Actions']}
                data={categories}
                renderRow={(category) => (
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{category.short_name}</td>
                        <td>{category.description || '-'}</td>
                        <td>
                            <div className="flex space-x-2">
                                <Link to={`/categories/${category.id}/edit`} className="btn warning sm">
                                    Edit
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>
                                    Delete
                                </Button>
                            </div>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
};

export default CategoriesList;