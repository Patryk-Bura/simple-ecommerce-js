import React, { useState } from 'react';
import { registerUser } from '../services/api';
import './Login.css';

const Register = ({ setIsLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Has³a nie pasuj¹ do siebie!');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(username, email, password);
            setSuccessMessage('Rejestracja zakoñczona sukcesem!');
            setLoading(false);
        } catch (err) {
            setError(err || 'Nie uda³o siê zarejestrowaæ.');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Rejestracja</h2>
                <form onSubmit={handleRegister} className="form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Nazwa uzytkownika</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Wpisz swoja nazwe uzytkownika"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Wpisz swoj e-mail"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Haslo</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wpisz swoje haslo"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Potwierdz haslo</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Potwierdz haslo"
                            className="form-input"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Rejestracja...' : 'Zarejestruj sie'}
                    </button>
                </form>

                <p className="text-center mt-4">
                    Masz juz konto?
                    <button
                        onClick={() => setIsLogin(true)}
                        className="masz-button"
                    >
                        Zaloguj sie
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
