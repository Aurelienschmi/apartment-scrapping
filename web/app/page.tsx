"use client";
import React from 'react';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import Footer from './components/Footer';
import { useApartments } from './hooks/useApartments';
import styles from './styles/Page.module.scss';

const Page: React.FC = () => {
  const { data } = useApartments();

  return (
    <div className={styles.container}>
      <Header />
      <ApartmentList data={data} />
      <Footer />
    </div>
  );
};

export default Page;