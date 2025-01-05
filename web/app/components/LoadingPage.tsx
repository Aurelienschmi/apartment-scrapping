import React from 'react';
import styles from '../styles/LoadingPage.module.scss';

const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loaderContainer}>
        <section className={styles['dots-container']}>
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
          <div className={styles.dot} />
        </section>
        <p className={styles.text}>Chargement des Appartements !</p>
      </div>
    </div>
  );
}

export default Loader;