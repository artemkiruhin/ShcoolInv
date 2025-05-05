import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/';
import Table from '../../common/Table';
import Button from '../../common/Button';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.users.getUsers();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.users.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="users-list">
            <div className="users-header">
                <h1 className="users-title">Users</h1>
                <Link to="/users/new" className="btn btn-primary">
                    Add New User
                </Link>
            </div>

            <Table
                headers={['Username', 'Full Name', 'Email', 'Phone', 'Admin', 'Status', 'Actions']}
                data={users}
                renderRow={(user) => (
                    <tr key={user.id} className="user-row">
                        <td>{user.username}</td>
                        <td>{user.full_name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone_number}</td>
                        <td>
                            {user.is_admin ? (
                                <span className="badge badge-primary">Yes</span>
                            ) : (
                                <span className="badge badge-secondary">No</span>
                            )}
                        </td>
                        <td>
                            {user.is_active ? (
                                <span className="badge badge-success">Active</span>
                            ) : (
                                <span className="badge badge-danger">Inactive</span>
                            )}
                        </td>
                        <td>
                            <div className="user-actions">
                                <Link to={`/users/${user.id}/edit`} className="btn btn-warning btn-sm">
                                    Edit
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(user.id)}
                                    className="btn btn-danger btn-sm"
                                >
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

export default UsersList;