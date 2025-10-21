import React from "react";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
    </footer>
  );
}
