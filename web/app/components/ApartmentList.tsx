import React, { useState } from 'react';
import styles from '../styles/ApartmentList.module.scss';
import Image from 'next/image';


interface Apartment {
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
}

interface ApartmentListProps {
  data: Apartment[];
}

const ApartmentList: React.FC<ApartmentListProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Générer les numéros de page à afficher
  const pageNumbers = [];
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const maxPageNumbersToShow = 3;

  if (totalPages <= maxPageNumbersToShow + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (currentPage > 2) {
      pageNumbers.push('...');
    }
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    pageNumbers.push(totalPages);
  }

  return (
    <div>
      <ul className={styles.container}>
        {currentItems.map((item) => (
          <li key={item.id} className={styles.item}>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.price}>{item.price} €</p>
            <p className={styles.date}>{new Date(item.publication_date).toLocaleDateString()}</p>
            <p className={styles.location}>{item.location}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.details}>Nombre de pièces: {item.number_of_rooms}</p>
            <p className={styles.details}>Surface: {item.surface_area} m²</p>
            <p className={styles.details}>Colocation: {item.is_shared !== null ? (item.is_shared ? 'OUI' : 'NON') : 'Pas renseigné'}</p>
            <p className={styles.details}>Garage: {item.has_garage !== null ? (item.has_garage ? 'OUI' : 'NON') : 'Pas renseigné'}</p>
            <p className={styles.details}>Meublé: {item.is_furnished !== null ? (item.is_furnished ? 'OUI' : 'NON') : 'Pas renseigné'}</p>
            <p className={styles.details}>Balcon: {item.has_balcony !== null ? (item.has_balcony ? 'OUI' : 'NON') : 'Pas renseigné'}</p>
            <div className={styles.images}>
              {item.images &&
                item.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={item.title}
                    width={200}
                    height={200}
                  />
                ))}
            </div>
            <a href={item.url} className={styles.link}>
              Lien vers l&apos;annonce
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' && paginate(number)}
            className={currentPage === number ? styles.active : ''}
            disabled={typeof number !== 'number'}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApartmentList;