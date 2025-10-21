import React, { useMemo } from "react";
import styles from "./OrderSummary.module.scss";
import Button from "@/components/Button/Button";
import { CartItem } from "@/app/interfaces/cart";

interface OrderSummaryProps {
  cartItems: CartItem[];
  goToNextStep?: () => void;
  showCheckoutBtn?: boolean;
}

 function OrderSummary({
  cartItems,
  goToNextStep,
  showCheckoutBtn,
}: OrderSummaryProps) {
  //cart total
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <div className={styles.orderSummary}>
      <h2>Order Summary</h2>

      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>{`$${subtotal.toFixed(2)}`}</span>
      </div>

      <div className={`${styles.summaryRow} ${styles["summaryRow--shipping"]}`}>
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <hr />

      <div className={styles.total}>
        <span>Total</span>
        <span>{`$${subtotal.toFixed(2)}`}</span>
      </div>

      {showCheckoutBtn && (
        <Button
          customStyle={styles.checkoutBtn}
          label="Checkout"
          aria-label="Checkout"
          onClick={goToNextStep}
        />
      )}
    </div>
  );
}


export default React.memo(OrderSummary)