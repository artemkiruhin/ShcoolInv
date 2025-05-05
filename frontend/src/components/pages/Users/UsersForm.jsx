import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/';
import Button from '../../common/Button';
import Card from '../../common/Card';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        phone_number: '',
        is_admin: false,
        is_active: true,
        password_hash: '',
        avatar: null,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const user = await api.users.getUserById(parseInt(id));
                    setFormData({
                        username: user.username,
                        email: user.email,
                        full_name: user.full_name,
                        phone_number: user.phone_number,
                        is_admin: user.is_admin,
                        is_active: user.is_active,
                        password_hash: '',
                        avatar: user.avatar,
                    });
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setLoading(false);
                }
            };

            fetchUser();
        } else {
            setLoading(false);
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatar: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                await api.users.updateUser(parseInt(id), formData);
            } else {
                await api.users.createUser(formData);
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="page-title">
                {isEditMode ? 'Edit User' : 'Create New User'}
            </h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password_hash"
                                value={formData.password_hash}
                                onChange={handleChange}
                                className="form-control"
                                required={!isEditMode}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="form-control"
                            />
                            {formData.avatar && (
                                <div className="mt-2">
                                    <img
                                        src={formData.avatar}
                                        alt="Avatar"
                                        className="h-20 w-20 object-cover rounded-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group flex items-center">
                            <input
                                type="checkbox"
                                name="is_admin"
                                id="is_admin"
                                checked={formData.is_admin}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor="is_admin" className="form-label mb-0">
                                Administrator
                            </label>
                        </div>

                        <div className="form-group flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label htmlFor="is_active" className="form-label mb-0">
                                Active
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/users')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            {isEditMode ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default UserForm;