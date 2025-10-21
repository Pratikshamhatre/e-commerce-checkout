import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Popup, { PopupProps } from "./Popup";

describe("Popup Component", () => {
  const defaultProps: PopupProps = {
    isOpen: true,
    title: "Test Title",
    message: "Test message",
    onClose: jest.fn(),
    primaryButtonLabel: "Confirm",
    onPrimaryButtonClick: jest.fn(),
    closeButtonLabel: "Cancel",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<Popup {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("renders title, message, and buttons when open", () => {
    render(<Popup {...defaultProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirm/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("calls onPrimaryButtonClick when primary button is clicked", async () => {
    const user = userEvent.setup();
    render(<Popup {...defaultProps} />);
    const primaryButton = screen.getByRole("button", { name: /Confirm/i });
    await user.click(primaryButton);
    expect(defaultProps.onPrimaryButtonClick).toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Popup {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("uses onClose as fallback if onPrimaryButtonClick is not provided", async () => {
    const user = userEvent.setup();
    const { onClose } = defaultProps;
    render(<Popup {...defaultProps} onPrimaryButtonClick={undefined} />);
    const primaryButton = screen.getByRole("button", { name: /Confirm/i });
    await user.click(primaryButton);
    expect(onClose).toHaveBeenCalled();
  });
});
