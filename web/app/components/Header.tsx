import React from 'react';
import styles from '../styles/Header.module.scss';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.logo}>
        <Image
          src="/images/logo.png"
          width={100}
          height={50}
          alt="Logo"
        />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <Image
            src="/images/profile.svg"
            width={20}
            height={20}
            alt="Profile"
          />
        </button>
        <button className={styles.button}>Info</button>
      </div>
    </header>
  );
};

export default Header;