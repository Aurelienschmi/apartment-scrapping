import { useState, useEffect } from 'react';

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

export const useApartments = () => {
  const [data, setData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/apartment');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        const data: Apartment[] = await response.json();
        setData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteAll = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/apartment', {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      setData([]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, deleteAll };
};