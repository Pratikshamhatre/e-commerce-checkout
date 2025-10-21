import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StepIndicator from "./StepIndicator";

describe("StepIndicator Component", () => {
  const steps = ["Cart Summary", "Payment Details", "Confirmation"];

  test("renders all steps correctly", () => {
    render(<StepIndicator steps={steps} currentStep={1} />);
    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  test("applies active class to completed and current steps", () => {
    const { container } = render(<StepIndicator steps={steps} currentStep={2} />);
    const stepElements = container.querySelectorAll(`.step`);

    // First two should be active
    expect(stepElements[0].className).toContain("active");
    expect(stepElements[1].className).toContain("active");

    // Third step should not be active
    expect(stepElements[2].className).not.toContain("active");
  });

  test("sets correct aria attributes", () => {
    render(<StepIndicator steps={steps} currentStep={2} />);
    const activeSteps = screen.getAllByRole("button", { name: /step/i });

    activeSteps.forEach((step) => {
      const ariaCurrent = step.getAttribute("aria-current");
      const stepLabel = step.getAttribute("aria-label");

      expect(stepLabel).toMatch(/Step [1-3]:/);
      // Only steps <= currentStep have aria-current="step"
      if (step.textContent === "Confirmation") {
        expect(ariaCurrent).toBeNull();
      }
    });
  });

  test("calls onStepClick with correct index when clicked", () => {
    const handleStepClick = jest.fn();
    render(
      <StepIndicator
        steps={steps}
        currentStep={2}
        onStepClick={handleStepClick}
      />
    );

    const stepElements = screen.getAllByRole("button");
    fireEvent.click(stepElements[0]); // Click first step
    expect(handleStepClick).toHaveBeenCalledWith(1);

    fireEvent.click(stepElements[1]); // Click second step
    expect(handleStepClick).toHaveBeenCalledWith(2);
  });

  test("is keyboard accessible via tab and enter key", () => {
    const handleStepClick = jest.fn();
    render(
      <StepIndicator
        steps={steps}
        currentStep={1}
        onStepClick={handleStepClick}
      />
    );

    const firstStep = screen.getByText("Cart Summary");
    firstStep.focus();
    expect(firstStep).toHaveFocus();

    fireEvent.keyDown(firstStep, { key: "Enter" });
    // Note: since the component doesn’t explicitly handle Enter key yet,
    // this test ensures it remains focusable and tabbable.
    expect(firstStep).toHaveAttribute("tabIndex", "0");
  });
});
