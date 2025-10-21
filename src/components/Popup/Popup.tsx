"use client";

import React from "react";
import styles from "./Popup.module.scss";
import Button from "@/components/Button/Button";

export interface PopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  primaryButtonLabel?: string;
  onPrimaryButtonClick?: () => void;
  closeButtonLabel?:string
}

export default function Popup({
  isOpen,
  title,
  message,
  type = "success",
  onClose,
  primaryButtonLabel = "OK",
  onPrimaryButtonClick,
  closeButtonLabel="Close"
}: PopupProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}  data-testid="popup" role="dialog">
      <div className={`${styles.popup} ${styles[type]}`}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <Button
            label={primaryButtonLabel}
            onClick={onPrimaryButtonClick || onClose}
          />
          <Button variant="secondary" label={closeButtonLabel} onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
