import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Filters.module.scss';
import Image from 'next/image';

interface FiltersProps {
  sortType: string;
  setSortType: (sortType: string) => void;
  setPriceRange: (min: number, max: number) => void;
  locations: string[];
  setSelectedLocations: (locations: string[]) => void;
  totalItems: number;
  setAdditionalFilters: (filters: AdditionalFilters) => void;
}

interface AdditionalFilters {
  is_shared: string;
  has_garage: string;
  is_furnished: string;
  has_balcony: string;
}

const Filters: React.FC<FiltersProps> = ({ sortType, setSortType, setPriceRange, locations, setSelectedLocations, totalItems, setAdditionalFilters }) => {
  const [isPricePopupOpen, setIsPricePopupOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isAdditionalFiltersPopupOpen, setIsAdditionalFiltersPopupOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedLocations, setSelectedLocationsState] = useState<string[]>([]);
  const [additionalFilters, setAdditionalFiltersState] = useState<AdditionalFilters>({
    is_shared: '',
    has_garage: '',
    is_furnished: '',
    has_balcony: ''
  });

  const closePopup = useCallback((event: MouseEvent) => {
    if (isPricePopupOpen && !document.querySelector(`.${styles.pricePopup}`)?.contains(event.target as Node)) {
      setIsPricePopupOpen(false);
    }
    if (isLocationPopupOpen && !document.querySelector(`.${styles.locationPopup}`)?.contains(event.target as Node)) {
      setIsLocationPopupOpen(false);
    }
    if (isAdditionalFiltersPopupOpen && !document.querySelector(`.${styles.additionalFiltersPopup}`)?.contains(event.target as Node)) {
      setIsAdditionalFiltersPopupOpen(false);
    }
  }, [isPricePopupOpen, isLocationPopupOpen, isAdditionalFiltersPopupOpen]);

  useEffect(() => {
    if (isPricePopupOpen || isLocationPopupOpen || isAdditionalFiltersPopupOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('click', closePopup);
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('click', closePopup);
    }

    return () => {
      document.removeEventListener('click', closePopup);
    };
  }, [isPricePopupOpen, isLocationPopupOpen, isAdditionalFiltersPopupOpen, closePopup]);

  const toggleDateSort = () => {
    setSortType(sortType === 'recent' ? 'oldest' : 'recent');
  };

  const togglePriceSort = () => {
    setSortType(sortType === 'price-asc' ? 'price-desc' : 'price-asc');
  };

  const handlePriceFilter = () => {
    setPriceRange(minPrice === '' ? 0 : Number(minPrice), maxPrice === '' ? Infinity : Number(maxPrice));
    setIsPricePopupOpen(false);
  };

  const handleResetPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setPriceRange(0, Infinity);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocationsState((prevSelected) =>
      prevSelected.includes(location)
        ? prevSelected.filter((loc) => loc !== location)
        : [...prevSelected, location]
    );
  };

  const handleLocationFilter = () => {
    setSelectedLocations(selectedLocations);
    setIsLocationPopupOpen(false);
  };

  const handleResetLocationFilter = () => {
    setSelectedLocationsState([]);
    setSelectedLocations([]);
  };

  const handleAdditionalFiltersChange = (filter: keyof AdditionalFilters, value: string) => {
    setAdditionalFiltersState(prevFilters => ({
      ...prevFilters,
      [filter]: value
    }));
  };

  const handleAdditionalFiltersApply = () => {
    setAdditionalFilters(additionalFilters);
    setIsAdditionalFiltersPopupOpen(false);
  };

  const handleResetAdditionalFilters = () => {
    setAdditionalFiltersState({
      is_shared: '',
      has_garage: '',
      is_furnished: '',
      has_balcony: ''
    });
    setAdditionalFilters({
      is_shared: '',
      has_garage: '',
      is_furnished: '',
      has_balcony: ''
    });
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.sortButtons}>
        <button
          className={`${styles.filterButton} ${sortType === 'recent' || sortType === 'oldest' ? styles.active : ''}`}
          onClick={toggleDateSort}
          aria-label={`Trier par ${sortType === 'recent' ? 'plus ancien' : 'plus récent'}`}
        >
          {sortType === 'recent' ? 'Plus récent ⬇️' : 'Plus ancien ⬆️'}
        </button>
        <button
          className={`${styles.filterButton} ${sortType === 'price-asc' || sortType === 'price-desc' ? styles.active : ''}`}
          onClick={togglePriceSort}
          aria-label={`Trier par ${sortType === 'price-asc' ? 'prix décroissant' : 'prix croissant'}`}
        >
          {sortType === 'price-asc' ? 'Prix croissant ⬇️' : 'Prix décroissant ⬆️'}
        </button>
      </div>
      <div className={styles.totalItems}>
        {totalItems} annonces affichées
      </div>
      <div className={styles.filterButtons}>
        <button
          className={styles.filterButton}
          onClick={() => setIsLocationPopupOpen(true)}
          aria-label="Filtrer par localisation"
        >
          Filtrer par localisation
        </button>
        <button
          className={styles.filterButton}
          onClick={() => setIsPricePopupOpen(true)}
          aria-label="Filtrer par prix"
        >
          Filtrer par prix
        </button>
        <button
          className={styles.filterButton}
          onClick={() => setIsAdditionalFiltersPopupOpen(true)}
          aria-label="Filtres supplémentaires"
        >
          <Image src="/images/filter.svg" alt="Filtres supplémentaires" width={15} height={15} />
        </button>
      </div>
      {isPricePopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.pricePopup}>
            <div className={styles.pricePopupContent}>
              <button className={styles.closeButton} onClick={() => setIsPricePopupOpen(false)}>&times;</button>
              <label>
                Prix minimum:
                <input
                  type="number"
                  value={minPrice}
                  placeholder="Min:"
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </label>
              <label>
                Prix maximum:
                <input
                  type="number"
                  value={maxPrice}
                  placeholder="Max:"
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </label>
              <button className={styles.filterButton} onClick={handlePriceFilter}>Appliquer</button>
              <button className={styles.filterButtonReinitilisation} onClick={handleResetPriceFilter}>Réinitialiser</button>
            </div>
          </div>
        </div>
      )}
      {isLocationPopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.locationPopup}>
            <div className={styles.locationPopupContent}>
              <button className={styles.closeButton} onClick={() => setIsLocationPopupOpen(false)}>&times;</button>
              <div className={styles.locationList}>
                {locations.map((location) => (
                  <label key={location}>
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationChange(location)}
                    />
                    {location}
                  </label>
                ))}
              </div>
              <button className={styles.filterButton} onClick={handleLocationFilter}>Appliquer</button>
              <button className={styles.filterButtonReinitilisation} onClick={handleResetLocationFilter}>Réinitialiser</button>
            </div>
          </div>
        </div>
      )}
      {isAdditionalFiltersPopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.additionalFiltersPopup}>
            <div className={styles.additionalFiltersContent}>
              <button className={styles.closeButton} onClick={() => setIsAdditionalFiltersPopupOpen(false)}>&times;</button>
              <label>
                Colocation:
                <select value={additionalFilters.is_shared} onChange={(e) => handleAdditionalFiltersChange('is_shared', e.target.value)}>
                  <option value="">Non spécifié</option>
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </label>
              <label>
                Garage:
                <select value={additionalFilters.has_garage} onChange={(e) => handleAdditionalFiltersChange('has_garage', e.target.value)}>
                  <option value="">Non spécifié</option>
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </label>
              <label>
                Meublé:
                <select value={additionalFilters.is_furnished} onChange={(e) => handleAdditionalFiltersChange('is_furnished', e.target.value)}>
                  <option value="">Non spécifié</option>
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </label>
              <label>
                Balcon:
                <select value={additionalFilters.has_balcony} onChange={(e) => handleAdditionalFiltersChange('has_balcony', e.target.value)}>
                  <option value="">Non spécifié</option>
                  <option value="OUI">OUI</option>
                  <option value="NON">NON</option>
                </select>
              </label>
              <button className={styles.filterButton} onClick={handleAdditionalFiltersApply}>Appliquer</button>
              <button className={styles.filterButtonReinitilisation} onClick={handleResetAdditionalFilters}>Réinitialiser</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;