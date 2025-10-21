"use client";

import React from "react";
import styles from "./Input.module.scss";

interface InputProps {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  required?: boolean;
  wrapperClassName?: string;
  maxLength?: number;
  register?: ReturnType<any>; // React Hook Form register function
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?:string

}
 function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = "",
  style,
  disabled = false,
  required = false,
  wrapperClassName = "",
  maxLength,
  register,
  onBlur,id
}: InputProps) {
  const inputProps = {
    id: id ? id :name,
    name,
    type,
    placeholder,
    disabled,
    required,
    maxLength,
    style,
    className: `${styles.input} ${icon ? styles.withIcon : ""} ${
      error ? styles.error : ""
    } ${className}`,
  };

  // correctly spread register if provided
  const inputElement = register ? (
    <input {...inputProps} {...register(name)} />
  ) : (
    <input {...inputProps} value={value ?? ""} onChange={onChange} onBlur={onBlur}/>
  );

  const inputWithIcon = icon ? (
    <div className={styles.inputWrapper}>
      <span className={styles.icon}>{icon}</span>
      {inputElement}
    </div>
  ) : (
    inputElement
  );

  if (!label && !error) return inputWithIcon;

  return (
    <div className={`${styles.inputGroup} ${wrapperClassName}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {inputWithIcon}
      {error && <p className="errorText">{error}</p>}
    </div>
  );
}


export default React.memo(Input)