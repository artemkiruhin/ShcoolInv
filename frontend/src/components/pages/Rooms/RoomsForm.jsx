import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';

const RoomForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isEditMode) {
            const fetchRoom = async () => {
                try {
                    const room = await api.rooms.getRoomById(parseInt(id));
                    setFormData({
                        name: room.name,
                        description: room.description || '',
                    });
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching room:', error);
                    setLoading(false);
                }
            };

            fetchRoom();
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
                await api.rooms.updateRoom(parseInt(id), formData);
            } else {
                await api.rooms.createRoom(formData);
            }
            navigate('/rooms');
        } catch (error) {
            console.error('Error saving room:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="page-title">
                {isEditMode ? 'Edit Room' : 'Create New Room'}
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
                            onClick={() => navigate('/rooms')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditMode ? 'Update Room' : 'Create Room'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RoomForm;