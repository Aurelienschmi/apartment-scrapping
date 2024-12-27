"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Apartment {
  id: number;
  title: string;
  price: number;
  date: string;
  location: string;
  description: string;
  images: string[];
  url: string;
}

export default function Page() {
  const [data, setData] = useState<Apartment[]>([]);
  const [loading, ] = useState(false);
  const [message, ] = useState("");

  const handleDeleteAll = async () => {
    const response = await fetch('/api/apartment', {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error deleting data:', errorData.error);
      return;
    }

    setData([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/apartment');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching data:', errorData.error);
        return;
      }

      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  const handleScrape = () => {
    window.location.href = "http://localhost:3000/api/scraping";
  };

  return (
    <div>
      <h1>Data from Supabase</h1>
      <button onClick={handleDeleteAll}>Delete All</button>
      <div>
        <h1>Scraping d Appartements</h1>
        <button onClick={handleScrape}>Scrape</button>
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
      </div>
      
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.price}</p>
            <p>{item.date}</p>
            <p>{item.location}</p>
            <p>{item.description}</p>
            <div>
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
            <Link href={item.url}>{item.url}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}