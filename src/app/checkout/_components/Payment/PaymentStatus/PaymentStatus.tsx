"use client";

import React from "react";
import styles from "./PaymentStatus.module.scss";
import Button from "@/components/Button/Button";

export interface PaymentStatusProps {
  status: "success" | "failed";
  title?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  imageSrc?: string;
}

export default function PaymentStatus({
  status,
  title,
  description,
  buttonLabel,
  onButtonClick,
  imageSrc,
}: PaymentStatusProps) {
  const defaultTitle =
    status === "success" ? "Payment Successful!" : "Payment Failed";
  const defaultDescription =
    status === "success"
      ? "Thank you for your purchase. Your order has been confirmed."
      : "Something went wrong while processing your payment. Please try again.";

  return (
    <div className={styles.paymentStatusContainer}>
      {imageSrc && <img src={imageSrc} alt={status} className={styles.image} />}
      <h2>{title || defaultTitle}</h2>
      <p>{description || defaultDescription}</p>
      {buttonLabel && onButtonClick && (
        <Button
          label={buttonLabel}
          onClick={onButtonClick}
          variant={status === "success" ? "primary" : "secondary"}
        />
      )}
    </div>
  );
}
