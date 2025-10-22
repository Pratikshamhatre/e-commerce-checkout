import React, { useMemo } from "react";
import styles from "./CartSummary.module.scss";
import Button from "@/components/Button/Button";
import Table, { TableColumn } from "@/components/Table/Table";
import Input from "@/components/Input/Input";
import { CartItem, CartSummaryProps } from "@/app/interfaces/cart";
import Image from 'next/image'

function CartSummary({
  cartItems,
  updateQty,
  removeItem,
}: CartSummaryProps) {
  const columns = useMemo<TableColumn<CartItem>[]>(() => [
    {
      header: "Product",
      key: "name",
      align: "left",
      className: styles.productCell,
      render: (item) => (
        <>
          <Image
            src={item.image}
            alt={item.name}
            className={styles.productImage}
            width={80}
            height={80}
            priority

          />
          <div>
            <p className={styles.productName}>{item.name}</p>
            <p className={styles.productDesc}>{item.description}</p>
          </div>
        </>
      ),
    },
    {
      header: "Price",
      key: "price",
      align: "center",
      render: (item) => <div className={styles.price}>${item.price}</div>,
      width: "120px",
    },
    {
      header: "Quantity",
      key: "quantity",
      align: "center",
      render: (item) => (
        <div className={styles.quantityControl}>
          <Button
            customStyle={styles.increaseQuantity}
            variant="transparent"
            onClick={() => updateQty(item.id, -1)}
            label="-"
          />
          <Input
            className={styles.quantity}
            name="quantity"
            value={item.quantity}
            onChange={() => { }}
            aria-label={`quantity-${item.id}`}
            id={`id-${item.id}`}
          />
          <Button
            customStyle={styles.decreaseQuantity}
            variant="transparent"
            onClick={() => updateQty(item.id, +1)}
            label="+"
          />
        </div>
      ),
      width: "150px",
    },
    {
      header: "Subtotal",
      key: "subtotal",
      align: "center",
      render: (item) => (
        <div className={styles.price}>
          ${(item.price * item.quantity).toFixed(2)}
        </div>
      ),
      width: "100px",
    },
    {
      header: "",
      key: "id",
      align: "center",
      render: (item) => (
        <Button
          variant="transparent"
          customStyle={styles.removeBtn}
          onClick={() => removeItem(item.id)}
          label="×"
        />
      ),
      width: "50px",
    },
], [updateQty, removeItem]);


  return (
    <div className={styles.cartSummary}>
      <Table<CartItem>
        columns={columns}
        data={cartItems}
        rowKey="id"
        className={styles.cartTable}
      />
    </div>
  );
}


export default React.memo(CartSummary) 