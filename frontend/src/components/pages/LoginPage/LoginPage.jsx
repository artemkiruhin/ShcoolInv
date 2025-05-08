import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.auth.login(username, password);

            localStorage.setItem('authToken', 'dummy-token');
            localStorage.setItem('userData', JSON.stringify({
                is_admin: response.is_admin,
                user_id: response.user_id,
                full_name: response.full_name
            }));

            navigate('/');
        } catch (err) {
            setError(err.message || 'Неверное имя пользователя или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Добро пожаловать</h2>
                    <p>Войдите в свой аккаунт</p>
                </div>

                {error && (
                    <div className="login-error">
                        <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p>{error}</p>
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Введите имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-button"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Вход...
                            </>
                        ) : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;