"use client";

import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "transparent";
  disabled?: boolean;
  icon?: React.ReactNode;
  customStyle?: string;
}

export default function Button({
  label="Submit",
  onClick=()=>{},
  type = "button",
  variant = "primary",
  disabled = false,
  icon,
  customStyle="",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${customStyle} ${styles.button} ${styles[variant]} ${
        disabled ? styles.disabled : ""
      }`}
    
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </button>
  );
}
