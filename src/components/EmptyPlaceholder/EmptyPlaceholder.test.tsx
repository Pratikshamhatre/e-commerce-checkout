import { render, screen, fireEvent } from "@testing-library/react";
import EmptyPlaceholder from "./EmptyPlaceholder";

describe("EmptyPlaceholder Component", () => {
  const defaultProps = {
    title: "No Items Found",
    description: "Your cart is empty.",
    imageSrc: "/test-image.svg",
    buttonLabel: "Go Shopping",
    onButtonClick: jest.fn(),
  };

  it("renders the title", () => {
    render(<EmptyPlaceholder title={defaultProps.title} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it("renders the description if provided", () => {
    render(
      <EmptyPlaceholder
        title={defaultProps.title}
        description={defaultProps.description}
      />
    );
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it("renders the image with alt text", () => {
    render(
      <EmptyPlaceholder
        title={defaultProps.title}
        imageSrc={defaultProps.imageSrc}
      />
    );
    const img = screen.getByAltText(defaultProps.title) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(defaultProps.imageSrc);
  });

  it("renders the button and calls onButtonClick when clicked", () => {
    render(<EmptyPlaceholder {...defaultProps} />);
    const button = screen.getByRole("button", { name: defaultProps.buttonLabel });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(defaultProps.onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("does not render button if buttonLabel or onButtonClick is missing", () => {
    render(<EmptyPlaceholder title={defaultProps.title} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("uses default image if imageSrc is not provided", () => {
    render(<EmptyPlaceholder title={defaultProps.title} />);
    const img = screen.getByAltText(defaultProps.title) as HTMLImageElement;
    expect(img.src).toContain("/empty-cart.svg");
  });
});
