"use client";
import React, { useState } from 'react';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import Footer from './components/Footer';
import Filters from './components/Filters';
import { useApartments } from './hooks/useApartments';
import styles from './styles/Page.module.scss';

const Page: React.FC = () => {
  const { data } = useApartments();
  const [sortType, setSortType] = useState('recent');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const handleSetPriceRange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const uniqueLocations = Array.from(new Set(data.map(apartment => apartment.location)));

  const filteredData = data.filter(apartment => {
    const matchesPrice = !priceRange || (apartment.price >= priceRange.min && apartment.price <= priceRange.max);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(apartment.location);
    return matchesPrice && matchesLocation;
  });

  return (
    <div className={styles.container}>
      <Header />
      <Filters
        sortType={sortType}
        setSortType={setSortType}
        setPriceRange={handleSetPriceRange}
        locations={uniqueLocations}
        setSelectedLocations={setSelectedLocations}
        totalItems={filteredData.length}
      />
      <ApartmentList
        data={filteredData}
        sortType={sortType}
        priceRange={priceRange}
        selectedLocations={selectedLocations}
      />
      <Footer />
    </div>
  );
};

export default Page;