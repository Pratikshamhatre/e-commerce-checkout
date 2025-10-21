import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Checkout from "../_components/Checkout/Checkout";
// -------------------------
// Mock child components
// -------------------------

jest.mock("../_components/CartSummary/CartSummary", () => ({
  __esModule: true,
  default: ({ cartItems }: any) => (
    <div data-testid="cart-summary">Cart Items: {cartItems.length}</div>
  ),
}));

jest.mock("../_components/OrderSummary/OrderSummary", () => ({
  __esModule: true,
  default: ({ goToNextStep, showCheckoutBtn }: any) =>
    showCheckoutBtn ? (
      <button onClick={goToNextStep}>Proceed to Payment</button>
    ) : (
      <p>Order Summary</p>
    ),
}));

jest.mock("../_components/Payment/PaymentForm/PaymentForm", () => ({
  __esModule: true,
  default: ({ setSuccess, setStep }: any) => (
    <div data-testid="payment-form">
      <p>Payment Form</p>
      <button
        onClick={() => {
          setSuccess(true);
          setStep(3);
        }}
      >
        Pay Now
      </button>
    </div>
  ),
}));



jest.mock("../_components/Payment/PaymentStatus/PaymentStatus", () => ({
  __esModule: true,
  default: ({ status, onButtonClick }: any) => (
    <div data-testid="payment-status">
      <p>Payment {status}</p>
      <button onClick={onButtonClick}>Continue Shopping</button>
    </div>
  ),
}));



jest.mock("../../../components/EmptyPlaceholder/EmptyPlaceholder", () => ({
  __esModule: true,
  default: ({ title, buttonLabel, onButtonClick }: any) => (
    <div data-testid="empty-placeholder">
      <p>{title}</p>
      <button onClick={onButtonClick}>{buttonLabel}</button>
    </div>
  ),
}));

jest.mock("../../../components/StepIndicator/StepIndicator", () => ({
  __esModule: true,
  default: ({ steps, currentStep, onStepClick }: any) => (
    <div data-testid="step-indicator">
      {steps.map((label: string, index: number) => (
        <button
          key={label}
          data-testid={`step-${index + 1}`}
          onClick={() => onStepClick(index + 1)}
          className={currentStep === index + 1 ? "active" : ""}
        >
          {label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("../../../components/Loader/Loader", () => ({
  __esModule: true,
  default: ({ message }: any) => <div data-testid="loader">{message}</div>,
}));

// -------------------------
// Mock Data
// -------------------------
const mockCartItems = [
  { id: 1, name: "Test Product", price: 100, quantity: 1, description: "", image: "" },
];

// -------------------------
// Tests
// -------------------------
describe("Checkout", () => {
  it("renders Cart Summary and OrderSummary initially", () => {
    render(<Checkout  
      initialCartItems={mockCartItems} />);
    expect(screen.getByTestId("cart-summary")).toBeInTheDocument();
  });

  it("navigates to PaymentForm when Proceed to Payment is clicked", async () => {
    render(<Checkout initialCartItems={mockCartItems} />);

    fireEvent.click(screen.getByText("Proceed to Payment"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-form")).toBeInTheDocument();
    });
    expect(screen.getByText("Pay Now")).toBeInTheDocument();
  });

  it("shows PaymentStatus with success after Pay Now is clicked", async () => {
    render(<Checkout initialCartItems={mockCartItems} />);

    fireEvent.click(screen.getByText("Proceed to Payment"));
    await waitFor(() => screen.getByTestId("payment-form"));

    fireEvent.click(screen.getByText("Pay Now"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-status")).toBeInTheDocument();
      expect(screen.getByText("Payment success")).toBeInTheDocument();
    });
  });

  it("resets to Cart Summary when Continue Shopping is clicked", async () => {
    render(<Checkout initialCartItems={mockCartItems} />);

    // Step 1 → Step 2 → Step 3
    fireEvent.click(screen.getByText("Proceed to Payment"));
    await waitFor(() => screen.getByTestId("payment-form"));
    fireEvent.click(screen.getByText("Pay Now"));
    await waitFor(() => screen.getByTestId("payment-status"));

    fireEvent.click(screen.getByText("Continue Shopping"));
    await waitFor(() => screen.getByTestId("cart-summary"));
    expect(screen.getByText("Proceed to Payment")).toBeInTheDocument();
  });


  it("renders StepIndicator and allows clicking previous steps", async () => {
    render(<Checkout initialCartItems={mockCartItems} />);
    const step1 = screen.getByTestId("step-1");
    const step2 = screen.getByTestId("step-2");

    // Initially at step 1
    expect(step1).toHaveClass("active");

    // Move to step 2
    fireEvent.click(screen.getByText("Proceed to Payment"));
    await waitFor(() => screen.getByTestId("payment-form"));
    expect(step2).toHaveClass("active");

    // Click step 1 to go back
    fireEvent.click(step1);
    await waitFor(() => screen.getByTestId("cart-summary"));
  });
});
