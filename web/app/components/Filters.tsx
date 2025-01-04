import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Filters.module.scss';

interface FiltersProps {
  sortType: string;
  setSortType: (sortType: string) => void;
  setPriceRange: (min: number, max: number) => void;
  locations: string[];
  setSelectedLocations: (locations: string[]) => void;
  totalItems: number;
}

const Filters: React.FC<FiltersProps> = ({ sortType, setSortType, setPriceRange, locations, setSelectedLocations, totalItems }) => {
  const [isPricePopupOpen, setIsPricePopupOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedLocations, setSelectedLocationsState] = useState<string[]>([]);

  const closePopup = useCallback((event: MouseEvent) => {
    if (isPricePopupOpen && !document.querySelector(`.${styles.pricePopup}`)?.contains(event.target as Node)) {
      setIsPricePopupOpen(false);
    }
    if (isLocationPopupOpen && !document.querySelector(`.${styles.locationPopup}`)?.contains(event.target as Node)) {
      setIsLocationPopupOpen(false);
    }
  }, [isPricePopupOpen, isLocationPopupOpen]);

  useEffect(() => {
    if (isPricePopupOpen || isLocationPopupOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('click', closePopup);
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('click', closePopup);
    }

    return () => {
      document.removeEventListener('click', closePopup);
    };
  }, [isPricePopupOpen, isLocationPopupOpen, closePopup]);

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
    </div>
  );
};

export default Filters;