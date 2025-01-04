"use client";
import React, { useState } from 'react';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import Footer from './components/Footer';
import Filters from './components/Filters';
import { useApartments } from './hooks/useApartments';
import styles from './styles/Page.module.scss';

interface AdditionalFilters {
  is_shared: string;
  has_garage: string;
  is_furnished: string;
  has_balcony: string;
}

const Page: React.FC = () => {
  const { data } = useApartments();
  const [sortType, setSortType] = useState('recent');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [additionalFilters, setAdditionalFilters] = useState<AdditionalFilters>({
    is_shared: '',
    has_garage: '',
    is_furnished: '',
    has_balcony: ''
  });

  const handleSetPriceRange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const uniqueLocations = Array.from(new Set(data.map(apartment => apartment.location)));

  const filteredData = data.filter(apartment => {
    const matchesPrice = !priceRange || (apartment.price >= priceRange.min && apartment.price <= priceRange.max);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(apartment.location);
    const matchesShared = additionalFilters.is_shared === '' || (additionalFilters.is_shared === 'OUI' ? apartment.is_shared : !apartment.is_shared);
    const matchesGarage = additionalFilters.has_garage === '' || (additionalFilters.has_garage === 'OUI' ? apartment.has_garage : !apartment.has_garage);
    const matchesFurnished = additionalFilters.is_furnished === '' || (additionalFilters.is_furnished === 'OUI' ? apartment.is_furnished : !apartment.is_furnished);
    const matchesBalcony = additionalFilters.has_balcony === '' || (additionalFilters.has_balcony === 'OUI' ? apartment.has_balcony : !apartment.has_balcony);
    return matchesPrice && matchesLocation && matchesShared && matchesGarage && matchesFurnished && matchesBalcony;
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
        setAdditionalFilters={setAdditionalFilters}
      />
      <ApartmentList
        data={filteredData}
        sortType={sortType}
        priceRange={priceRange}
        selectedLocations={selectedLocations}
        additionalFilters={additionalFilters}
      />
      <Footer />
    </div>
  );
};

export default Page;