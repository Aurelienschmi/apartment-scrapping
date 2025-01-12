"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Account.module.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Account() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/account", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Assurez-vous que les cookies sont envoyés avec la requête
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response:", errorText);
          setMessage(`Error: ${res.statusText}`);
          router.push("/pages/login"); // Rediriger vers la page de connexion si non authentifié
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage("Error fetching user data");
        router.push("/pages/login"); 
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/pages/login");
      } else {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        setMessage(`Error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error logging out:", err);
      setMessage("Error logging out");
    }
  };

  return (
    <div>
      <Header logged={true} />

      <div className={styles.container}>
        <h1>Account</h1>
        {user ? (
          <div className={styles["user-info"]}>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        ) : (
          <p className={styles.message}>{message}</p>
        )}
      </div>
      <Footer />
    </div>
  );
}