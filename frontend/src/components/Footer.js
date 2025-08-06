import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Elektropol. All rights reserved.</p>
            <p>Na rynku od 50 lat!</p>
            {showButton && (
                <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
                    ↑
                </button>
            )}
        </footer>
    );
};

export default Footer;
