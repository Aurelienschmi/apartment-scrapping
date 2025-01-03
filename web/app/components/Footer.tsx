import React from 'react';
import styles from '../styles/Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <p>Connect with me:</p>
            <a href="www.linkedin.com/in/aurelien-schmieder-0017391ab" target="_blank" rel="noopener noreferrer">
                LinkedIn
            </a>
            {' | '}
            <a href="https://github.com/Aurelienschmi" target="_blank" rel="noopener noreferrer">
                GitHub
            </a>
            {' | '}
            <a href="https://aurelien-schmieder.vercel.app/"> Mon portfolio</a>
        </footer>
    );
};

export default Footer;