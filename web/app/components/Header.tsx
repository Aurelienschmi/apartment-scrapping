import React, { useState } from "react";
import styles from "../styles/Header.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface HeaderProps {
  logged: boolean;
}

const Header: React.FC<HeaderProps> = ({ logged }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    if (logged) {
      setDropdownVisible(!dropdownVisible);
    } else {
      router.push("/pages/login");
    }
  };

  const handleLogout = async () => {
    setDropdownVisible(false);

    console.log("Sending logout request");

    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      console.log("Logout successful");

      Cookies.remove("token");

      router.push("/pages/login");
    } else {
      const errorText = await res.text();
      console.error("Failed to log out:", errorText);
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/images/logo.png" width={100} height={50} alt="Logo" />
        </Link>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={toggleDropdown}>
          <Image
            src="/images/profile.svg"
            width={20}
            height={20}
            alt="Profile"
          />
        </button>
        {logged && (
          <div className={`${styles.dropdownMenu} ${dropdownVisible ? styles.visible : ""}`}>
            <Link href="/pages/favorites" className={styles.dropdownItem}>
              Favoris
            </Link>
            <Link href="/pages/account" className={styles.dropdownItem}>
              Paramètre
            </Link>
            <button className={styles.dropdownItem} onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
        <button className={styles.button}>Info</button>
      </div>
    </header>
  );
};

export default Header;