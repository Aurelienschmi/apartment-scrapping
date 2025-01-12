"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import ApartmentList from './components/ApartmentList';
import Footer from './components/Footer';
import Filters from './components/Filters';
import Loader from './components/LoadingPage';
import { useApartments } from './hooks/useApartments';
import styles from './styles/Page.module.scss';

export interface Apartment {
  id: number;
  title: string;
  price: number;
  publication_date: string;
  location: string;
  description: string;
  images: string[];
  url: string;
  number_of_rooms: number;
  surface_area: number;
  is_shared: boolean;
  has_garage: boolean;
  is_furnished: boolean;
  has_balcony: boolean;
  is_liked: boolean;
}
interface AdditionalFilters {
  is_shared: string;
  has_garage: string;
  is_furnished: string;
  has_balcony: string;
}

const Page: React.FC = () => {
  const { data, loading } = useApartments();
  const [isLogged, setIsLogged] = useState(false);
  const [sortType, setSortType] = useState('recent');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [additionalFilters, setAdditionalFilters] = useState<AdditionalFilters>({
    is_shared: '',
    has_garage: '',
    is_furnished: '',
    has_balcony: ''
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (res.ok) {
          setIsLogged(true);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        router.push('/pages/login');
      }
    };

    checkAuth();
  }, [router]);

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
      <Header logged={isLogged}/>
      {loading ? (
        <Loader />
      ) : (
        <>
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
        </>
      )}
      <Footer />
    </div>
  );
};

export default Page;