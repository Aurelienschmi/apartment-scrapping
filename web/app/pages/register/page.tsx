"use client";
import { useState } from "react";
import styles from "../../styles/Register.module.scss";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Registration successful!");
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <Header logged={false} />
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Register</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleRegister} className={styles.button}>
            Register
          </button>
          {message && <p className={styles.message}>{message}</p>}
          <a href="/pages/login" className={styles.link}>Retour à la page de connexion</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}