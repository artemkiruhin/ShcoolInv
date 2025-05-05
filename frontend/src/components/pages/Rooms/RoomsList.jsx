import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';

const RoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await api.rooms.getRooms();
                setRooms(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await api.rooms.deleteRoom(id);
                setRooms(rooms.filter(room => room.id !== id));
            } catch (err) {
                console.error('Error deleting room:', err);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title">Rooms</h1>
                <Link to="/rooms/new" className="btn primary">
                    Add New Room
                </Link>
            </div>

            <Table
                headers={['Name', 'Description', 'Actions']}
                data={rooms}
                renderRow={(room) => (
                    <tr key={room.id}>
                        <td>{room.name}</td>
                        <td>{room.description || '-'}</td>
                        <td>
                            <div className="flex space-x-2">
                                <Link to={`/rooms/${room.id}/edit`} className="btn warning sm">
                                    Edit
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(room.id)}>
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

export default RoomsList;