import React from "react";
import Checkout from "./_components/Checkout/Checkout";
import { mockCartItems } from "@/data/cartItems";

export default async function CheckoutPage() {
  return <Checkout initialCartItems={mockCartItems} />;
}
