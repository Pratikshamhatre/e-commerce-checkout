import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OrderSummary from "../_components/OrderSummary/OrderSummary";
import { cartItems } from "./CartSummary.test";

describe("OrderSummary", () => {
  const goToNextStep = jest.fn();

  it("renders subtotal and total correctly", () => {
    render(<OrderSummary cartItems={cartItems} />);

    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    const subtotalRow = screen.getByText("Subtotal").parentElement;
    expect(subtotalRow).toHaveTextContent("$8.00");
    const totalRow = screen.getByText("Total").parentElement;
    expect(totalRow).toHaveTextContent("$8.00");
  });

  it("renders checkout button when showCheckoutBtn is true", () => {
    render(
      <OrderSummary
        cartItems={cartItems}
        showCheckoutBtn={true}
        goToNextStep={goToNextStep}
      />
    );

    const checkoutBtn = screen.getByRole("button", { name: /Checkout/i });
    expect(checkoutBtn).toBeInTheDocument();

    fireEvent.click(checkoutBtn);
    expect(goToNextStep).toHaveBeenCalled();
  });

  it("does not render checkout button when showCheckoutBtn is false", () => {
    render(<OrderSummary cartItems={cartItems} showCheckoutBtn={false} />);

    expect(screen.queryByRole("button", { name: /Checkout/i })).toBeNull();
  });
});
