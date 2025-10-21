"use client";

import React from "react";
import styles from "./EmptyPlaceholder.module.scss";
import Button from "@/components/Button/Button";
import Image from "next/image";

interface EmptyPlaceholderProps {
  title: string;
  description?: string;
  imageSrc?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function EmptyPlaceholder({
  title,
  description,
  imageSrc = "/empty-cart.svg",
  buttonLabel,
  onButtonClick,
}: EmptyPlaceholderProps) {
  return (
    <div className={styles.emptyPlaceholder} data-testid="empty-placeholder">
      {imageSrc && <Image width={200} height={200} src={imageSrc} alt={title} className={styles.image} priority />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {buttonLabel && onButtonClick && (
        <Button
          label={buttonLabel}
          variant="primary"
          onClick={onButtonClick}
          customStyle={styles.button}
        />
      )}
    </div>
  );
}
