import React from 'react';
import './Header.css';

const Header = ({ isLoggedIn, handleLogout, onLoginClick, onRegisterClick, onOrdersClick, onBackToProductsClick }) => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <img
                        src="logo.png"
                        alt="Logo"
                        className="logo"
                        onClick={onBackToProductsClick}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="buttonyy">
                    {isLoggedIn && !isAdmin && (
                    <>
                        <button
                            className="orders-button"
                            onClick={onOrdersClick}
                        >
                            Moje zamowienia
                        </button>
                    </>
                )}
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <button className="logout-button" onClick={handleLogout}>
                            Wyloguj sie
                        </button>
                    ) : (
                        <>
                            <button className="login-button" onClick={onLoginClick}>
                                Zaloguj sie
                            </button>
                            <button className="register-button" onClick={onRegisterClick}>
                                Zarejestruj sie
                            </button>
                        </>
                    )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
