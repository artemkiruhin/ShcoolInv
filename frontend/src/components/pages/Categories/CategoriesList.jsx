import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';
import {ReportType} from "../../../services/constants";
import {reportApi} from "../../../services";

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);

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
        if (window.confirm('Вы уверены, что хотите удалить категорию?')) {
            try {
                await api.categories.deleteCategory(id);
                setCategories(categories.filter(category => category.id !== id));
            } catch (err) {
                console.error('Error deleting category:', err);
            }
        }
    };

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const blob = await reportApi.generateExcelReport(ReportType.INVENTORY_CATEGORIES);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            a.download = `categories_export_${dateStr}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error exporting categories:', err);
            alert('Ошибка экспорта, попробуйте еще раз.');
        } finally {
            setExportLoading(false);
        }
    };
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Категории</h1>
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={exportLoading}
                    >
                        {exportLoading ? 'Экспортируется...' : 'Сформировать отчет'}
                    </Button>
                    <Link to="/categories/new" className="btn primary">
                        Добавить запись
                    </Link>
                </div>
            </div>

            <Table
                headers={['Название', 'Сокращенное название', 'Описание', 'Действия']}
                data={categories}
                renderRow={(category) => (
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{category.short_name}</td>
                        <td>{category.description || '-'}</td>
                        <td>
                            <div className="flex space-x-2">
                                <Link to={`/categories/${category.id}/edit`} className="btn warning sm">
                                    Редактировать
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(category.id)}>
                                    Удалить
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