import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';
import {ReportType} from "../../../services/constants";

const ConsumablesList = () => {
    const [consumables, setConsumables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);

    useEffect(() => {
        const fetchConsumables = async () => {
            try {
                const data = await api.consumables.getConsumables();
                setConsumables(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchConsumables();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот расходник?')) {
            try {
                await api.consumables.deleteConsumable(id);
                setConsumables(consumables.filter(consumable => consumable.id !== id));
            } catch (err) {
                console.error('Error deleting consumable:', err);
            }
        }
    };

    const handleIncrease = async (id) => {
        const amount = prompt('Введите количество, на которое надо увеличить:');
        if (amount && !isNaN(amount)) {
            try {
                await api.consumables.increaseConsumable(id, parseInt(amount));
                const updatedConsumables = await api.consumables.getConsumables();
                setConsumables(updatedConsumables);
            } catch (err) {
                console.error('Error increasing quantity:', err);
            }
        }
    };

    const handleDecrease = async (id) => {
        const amount = prompt('Введите количество, на которое надо уменьшить:');
        if (amount && !isNaN(amount)) {
            try {
                await api.consumables.decreaseConsumable(id, parseInt(amount));
                const updatedConsumables = await api.consumables.getConsumables();
                setConsumables(updatedConsumables);
            } catch (err) {
                console.error('Error decreasing quantity:', err);
            }
        }
    };

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const blob = await api.reports.generateExcelReport(ReportType.CONSUMABLES);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            a.download = `consumables_export_${dateStr}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error exporting consumables:', err);
            alert('Ошибка экспорта, попробуйте снова.');
        } finally {
            setExportLoading(false);
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Расходники</h1>
                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={handleExport}
                        disabled={exportLoading}
                    >
                        {exportLoading ? 'Экспортируется...' : 'Сформировать отчет'}
                    </Button>
                    <Link to="/consumables/new" className="btn primary">
                        Добавить запись
                    </Link>
                </div>
            </div>

            <Table
                headers={['Название', 'Описание', 'Количество', 'Минимальное количество', 'Мера', 'Действия']}
                data={consumables}
                renderRow={(consumable) => (
                    <tr key={consumable.id}>
                        <td>{consumable.name}</td>
                        <td>{consumable.description || '-'}</td>
                        <td className={consumable.quantity < consumable.min_quantity ? 'text-red-500 font-bold' : ''}>
                            {consumable.quantity}
                        </td>
                        <td>{consumable.min_quantity}</td>
                        <td>{consumable.unit}</td>
                        <td>
                            <div className="flex space-x-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleIncrease(consumable.id)}
                                >
                                    Увеличить
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleDecrease(consumable.id)}
                                >
                                    Уменьшить
                                </Button>
                                <Link to={`/consumables/${consumable.id}/edit`} className="btn warning sm">
                                    Редактировать
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(consumable.id)}
                                >
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

export default ConsumablesList;