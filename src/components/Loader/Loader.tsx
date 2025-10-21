"use client";

import React from "react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
