import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "./Loader";

// Mock the SCSS module so class names don't cause test issues
jest.mock("../Loader.module.scss", () => ({
  loaderContainer: "loaderContainer",
  spinner: "spinner",
}));

describe("Loader Component", () => {
  it("renders with default message", () => {
    render(<Loader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("paragraph", { hidden: true })).toBeTruthy;
  });

  it("renders custom message when provided", () => {
    render(<Loader message="Please wait" />);
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });

  it("contains spinner and loader container", () => {
    const { container } = render(<Loader />);
    expect(container.querySelector(".loaderContainer")).toBeInTheDocument();
    expect(container.querySelector(".spinner")).toBeInTheDocument();
  });
});
