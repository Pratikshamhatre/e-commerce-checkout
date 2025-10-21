"use client";

import React, { useState } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>MyShop</div>

        {/* Hamburger for mobile */}
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>

        {/* Navigation */}
        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/categories">Categories</a>
          <a href="/contact">Contact</a>
        </nav>

        {/* Cart */}
        <div className={styles.cart}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.cartIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
          <span className={styles.cartCount}>5</span>
        </div>
      </div>
    </header>
  );
}
