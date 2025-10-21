import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentForm from "../_components/Payment/PaymentForm/PaymentForm";
import { CartItem } from "@/app/interfaces/cart";
import userEvent from "@testing-library/user-event";
import { cartItems } from "./CartSummary.test";

// Mock functions
const mockSetSuccess = jest.fn();
const mockSetStep = jest.fn();

// Mock global fetch
beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;
});

// Mock Popup component
jest.mock("../../../components/Popup/Popup", () => (props: any) => {
  if (!props.isOpen) return null;
  return (
    <div data-testid="popup">
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      <button onClick={props.onPrimaryButtonClick}>
        {props.primaryButtonLabel}
      </button>
      <button onClick={props.onClose}>{props.closeButtonLabel}</button>
    </div>
  );
});

describe("PaymentForm", () => {
  it("opens popup and submits form when Yes is clicked", async () => {
    render(
      <PaymentForm
        cartItems={cartItems}
        setSuccess={mockSetSuccess}
        setStep={mockSetStep}
      />
    );

    // Fill all inputs

    const user = userEvent.setup();

    // Fill all required inputs correctly
    await user.type(screen.getByLabelText(/Cardholder Name/i), "Test name");
    await user.type(
      screen.getByLabelText(/Card Number/i),
      "1234 5678 1234 5678"
    );
    await user.type(screen.getByLabelText(/Expiry/i), "12/45");
    await user.type(screen.getByLabelText(/CVV/i), "123");

    // Now button is enabled
    await user.click(screen.getByRole("button", { name: /Pay Now/i }));

    fireEvent.change(screen.getByLabelText(/Cardholder Name/i), {
      target: { value: "Test name" },
    });
    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "1234 5678 1234 5678" },
    });
    fireEvent.change(screen.getByLabelText(/Expiry/i), {
      target: { value: "12/45" },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: "123" },
    });

    // Click Pay Now
    fireEvent.click(screen.getByRole("button", { name: /Pay Now/i }));

    // Wait for popup to appear
    const popup = await screen.findByTestId("popup");
    expect(popup).toBeInTheDocument();
    expect(screen.getByText(/Payment Confirmation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to proceed/i)
    ).toBeInTheDocument();

    // Click Yes
    fireEvent.click(screen.getByRole("button", { name: /Yes/i }));

    // Wait for form submission
    await waitFor(() => {
      expect(mockSetSuccess).toHaveBeenCalledWith(true);
      expect(mockSetStep).toHaveBeenCalledWith(3);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
  it("disables Pay Now button until all fields are valid", async () => {
    render(
      <PaymentForm
        cartItems={cartItems}
        setSuccess={mockSetSuccess}
        setStep={mockSetStep}
      />
    );

    const button = screen.getByRole("button", { name: /Pay Now/i });
    expect(button).toBeDisabled();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Cardholder Name/i), "Test name");
    await user.type(
      screen.getByLabelText(/Card Number/i),
      "1234 5678 1234 5678"
    );
    await user.type(screen.getByLabelText(/Expiry/i), "12/45");
    await user.type(screen.getByLabelText(/CVV/i), "123");

    expect(button).toBeEnabled();
  });

  it("handles payment failure and displays error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({ message: "Payment failed due to server error" }),
    });

    render(
      <PaymentForm
        cartItems={cartItems}
        setSuccess={mockSetSuccess}
        setStep={mockSetStep}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Cardholder Name/i), "Test name");
    await user.type(
      screen.getByLabelText(/Card Number/i),
      "1234 5678 1234 5678"
    );
    await user.type(screen.getByLabelText(/Expiry/i), "12/45");
    await user.type(screen.getByLabelText(/CVV/i), "123");

    await user.click(screen.getByRole("button", { name: /Pay Now/i }));

    // Wait for popup
    const popup = await screen.findByTestId("popup");
    expect(popup).toBeInTheDocument();

    // Click Yes
    await user.click(screen.getByRole("button", { name: /Yes/i }));
    await user.click(screen.getByRole("button", { name: /Pay Now/i }));

    // Wait for async fetch and state update
    const errorMessage = await screen.findByText(
      /Payment failed due to server error/i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(mockSetSuccess).toHaveBeenCalledWith(false);
  });
  
});
