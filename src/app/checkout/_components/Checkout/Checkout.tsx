"use client";

import React, { useState, useCallback, lazy, Suspense, useMemo } from "react";
import styles from "./Checkout.module.scss";
import CartSummary from "../CartSummary/CartSummary";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import StepIndicator from "@/components/StepIndicator/StepIndicator";
import dynamic from "next/dynamic";

const OrderSummary = dynamic(() => import("../OrderSummary/OrderSummary"), {
  ssr: false,
  loading: () => <Loader message="Loading order summary..." />,
});

const PaymentForm = dynamic(() => import("../Payment/PaymentForm/PaymentForm"), {
  ssr: false,
  loading: () => <Loader message="Loading payment form..." />,
});

const PaymentStatus = dynamic(() => import("../Payment/PaymentStatus/PaymentStatus"), {
  ssr: false,
  loading: () => <Loader message="Loading confirmation..." />,
});

const EmptyPlaceholder = lazy(() => import("@/components/EmptyPlaceholder/EmptyPlaceholder"));

interface CheckoutClientProps {
  initialCartItems: any[];
}

 function CheckoutClient({ initialCartItems }: CheckoutClientProps) {
  const [step, setStep] = useState<number>(1);
  const [success, setSuccess] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

  const steps = useMemo(() => ["Cart Summary", "Payment Details", "Confirmation"], []);

  // Memoized cartItems 
  const memoizedCartItems = useMemo(() => cartItems, [cartItems]);

  const updateQty = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const goToNextStep = useCallback(() => setStep((prev) => (prev < 3 ? prev + 1 : prev)), []);
  const goToPrevStep = useCallback(() => setStep((prev) => (prev > 1 ? prev - 1 : prev)), []);

  // used  useMemo so that re-renders only happen when dependencies change
  const renderStepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <>
            <CartSummary
              cartItems={memoizedCartItems}
              updateQty={updateQty}
              removeItem={removeItem}
            />
            <OrderSummary
              cartItems={memoizedCartItems}
              goToNextStep={goToNextStep}
              showCheckoutBtn
            />
          </>
        );
      case 2:
        return (
          <>
            <Suspense fallback={<Loader message="Loading payment form..." />}>
              <PaymentForm
                cartItems={memoizedCartItems}
                setSuccess={setSuccess}
                setStep={setStep}
              />
            </Suspense>
            <OrderSummary cartItems={memoizedCartItems} showCheckoutBtn={false} />
          </>
        );
      case 3:
        return (
          <Suspense fallback={<Loader message="Loading confirmation..." />}>
            <PaymentStatus
              status={success ? "success" : "failed"}
              buttonLabel="Continue Shopping"
              onButtonClick={() => {
                setStep(1);
                setCartItems(initialCartItems);
                setSuccess(false);
              }}
              imageSrc={success ? "/check.png" : "/remove.png"}
            />
          </Suspense>
        );
      default:
        return null;
    }
  }, [step, memoizedCartItems, success, goToNextStep, updateQty, removeItem, initialCartItems]);

  if (!memoizedCartItems.length) {
    return (
      <EmptyPlaceholder
        title="Your cart is empty"
        description="Looks like you haven’t added anything to your cart yet."
        buttonLabel="Continue Shopping"
        onButtonClick={() => setCartItems(initialCartItems)}
        imageSrc="/empty-cart.png"
      />
    );
  }

  return (
    <>
      <StepIndicator
        steps={steps}
        currentStep={step}
        onStepClick={(clickedStep) => {
          if (clickedStep < step) setStep(clickedStep);
        }}
      />

      <div className={step < 3 ? styles.checkoutContainer : "d-block"}>
        {renderStepContent}
      </div>

      <div className={`${styles.navigationButtons} ${step === 1 ? styles.justifyEnd : ""}`}>
        {step === 2 && (
          <Button customStyle={styles.prevBtn} onClick={goToPrevStep} label="Back" />
        )}
      </div>
    </>
  );
}


export default React.memo(CheckoutClient)