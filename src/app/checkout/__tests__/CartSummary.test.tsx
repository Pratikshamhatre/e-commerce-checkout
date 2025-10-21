import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartSummary from "@/app/checkout/_components/CartSummary/CartSummary";

export const cartItems = [
  {
    id: 1,
    name: "Kiwi",
    description: "Fresh green kiwi",
    image: "https://via.placeholder.com/50",
    price: 2.5,
    quantity: 2,
    width: "100px",
  },
  {
    id: 2,
    name: "Mango",
    description: "Sweet mango",
    image: "https://via.placeholder.com/50",
    price: 3,
    quantity: 1,
    width: "100px",
  },
];

describe("CartSummary Component", () => {
  const mockUpdateQty = jest.fn();
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    render(
      <CartSummary
        cartItems={cartItems}
        updateQty={mockUpdateQty}
        removeItem={mockRemoveItem}
      />
    );
  });

  it("renders all cart items", () => {
    expect(screen.getByText("Kiwi")).toBeInTheDocument();
    expect(screen.getByText("Mango")).toBeInTheDocument();
  });

  it("renders correct subtotal for each product", () => {
    expect(screen.getByText("$5.00")).toBeInTheDocument(); // 2.5 * 2
    expect(screen.getByText("$3.00")).toBeInTheDocument(); // 3 * 1
  });

  it("calls updateQty with correct arguments when + or - clicked", () => {
    const buttons = screen.getAllByRole("button", { name: "+" });
    fireEvent.click(buttons[0]);
    expect(mockUpdateQty).toHaveBeenCalledWith(1, +1);

    const minusButtons = screen.getAllByRole("button", { name: "-" });
    fireEvent.click(minusButtons[0]);
    expect(mockUpdateQty).toHaveBeenCalledWith(1, -1);
  });

  it("calls removeItem when × button is clicked", () => {
    const removeButtons = screen.getAllByRole("button", { name: "×" });
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveItem).toHaveBeenCalledWith(1);
  });
});
