"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./PaymentForm.module.scss";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { CartItem } from "@/app/interfaces/cart";
import { PaymentFormData } from "@/app/interfaces/payment";
import Popup from "@/components/Popup/Popup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .transform((val) => val.replace(/\s+/g, ""))
    .matches(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: yup
    .string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format")
    .test("expiry-date", "Card has expired", (value) => {
      if (!value) return false;
      const [month, year] = value.split("/").map(Number);
      const now = new Date();
      const expiryDate = new Date(2000 + year, month - 1, 1);
      return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
    }),
  cvv: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "CVV must be 3 digits"),
});

export interface PaymentFormProps {
  cartItems: CartItem[];
  setSuccess: (value: boolean) => void;
  setStep: (val: number) => void;
}

export default function PaymentForm({
  cartItems,
  setSuccess,
  setStep,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "Payment Confirmation!",
    message: "Are you sure you want to proceed with this payment?",
  });
  const [retryData, setRetryData] = useState<PaymentFormData | null>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const handlePaymentClick = () => {
    setPopup((prev) => ({ ...prev, open: true }));
  };

  const handleConfirmPayment = () => {
    setPopup((prev) => ({ ...prev, open: false }));
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: PaymentFormData) => {
    setLoading(true);
    setError("");
    setRetryData(data); // Save the last entered data

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, cartItems }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Payment failed");
      }

      setSuccess(true);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Payment failed. Try again.");
      setSuccess(false);
      // Open retry popup
      setPopup({
        open: true,
        type: "error",
        title: "Transaction Failed",
        message: err.message || "Something went wrong. Do you want to retry?",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPopup((prev) => ({ ...prev, open: false }));
    if (retryData) {
      onSubmit(retryData);
    }
  };

  return (
    <form
      className={styles.paymentForm}
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="payment-form-title"
    >
      <h2 id="payment-form-title" className={styles.formTitle}>
        Payment Details
      </h2>

      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id="cardholder-name"
            placeholder="Name on Card"
            error={errors.name?.message}
            onBlur={field.onBlur}
            label="Cardholder Name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        )}
      />

      {/* Card Number */}
      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id="card-number"
            placeholder="Card Number"
            maxLength={19}
            aria-invalid={!!errors.cardNumber}
            aria-describedby={errors.cardNumber ? "card-error" : undefined}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              value = value.slice(0, 16);
              const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
              field.onChange(formatted);
            }}
            onBlur={field.onBlur}
            error={errors.cardNumber?.message}
            label="Card Number"
          />
        )}
      />

      {/* Expiry */}
      <Controller
        name="expiry"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id="card-expiry"
            placeholder="MM/YY"
            maxLength={5}
            aria-invalid={!!errors.expiry}
            aria-describedby={errors.expiry ? "expiry-error" : undefined}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length > 2) {
                value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
              }
              field.onChange(value.slice(0, 5));
            }}
            onBlur={field.onBlur}
            error={errors.expiry?.message}
            label="Expiry"
          />
        )}
      />

      {/* CVV */}
      <Controller
        name="cvv"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id="card-cvv"
            placeholder="CVV"
            maxLength={3}
            type="password"
            aria-invalid={!!errors.cvv}
            aria-describedby={errors.cvv ? "cvv-error" : undefined}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 3);
              field.onChange(value);
            }}
            onBlur={field.onBlur}
            error={errors.cvv?.message}
            label="CVV"
          />
        )}
      />

      <Button
        type="button"
        disabled={loading || !isValid}
        label={loading ? "Processing..." : "Pay Now"}
        onClick={handlePaymentClick}
        aria-label="Proceed to payment confirmation"
      />

      <Popup
        isOpen={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((prev) => ({ ...prev, open: false }))}
        primaryButtonLabel={popup.type === "success" ? "Yes" : "Retry"}
        closeButtonLabel={popup.type === "success" ? "No" : "Cancel"}
        onPrimaryButtonClick={
          popup.type === "success" ? handleConfirmPayment : handleRetry
        }
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-message"
      />
    </form>
  );
}
