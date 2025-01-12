"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/Login.module.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Sending email:", email);
    console.log("Sending password:", password);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Login successful!");
      router.push("/pages/account");
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div>
      <Header logged={false} />

      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Login</h1>
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
          <button onClick={handleLogin} className={styles.button}>
            Login
          </button>
          {message && <p className={styles.message}>{message}</p>}
          <p className={styles.text}>

            <a href="/pages/register" className={styles.link}>
              Créer un compte
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
