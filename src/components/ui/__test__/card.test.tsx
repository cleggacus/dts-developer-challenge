import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Card from "../card";

describe("Card component", () => {
  it("should render card", () => {
    render(<Card>content</Card>);
    const card = screen.getByText("content");
    expect(card).toBeInTheDocument();
  });

  it("applies variant 1 class correctly", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).toHaveClass("variant-1");
  });

  it("applies variant 2 class correctly", () => {
    const { container } = render(<Card variant="2">content</Card>);
    expect(container.firstChild).toHaveClass("variant-2");
  });

  it("applies default padding correctly", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).toHaveStyle("padding: var(--spacing-lg)");
  });

  it("applies custom padding correctly", () => {
    const { container } = render(<Card padding="2xl">content</Card>);
    expect(container.firstChild).toHaveStyle("padding: var(--spacing-2xl)");
  });

  it("applies custom class correctly", () => {
    const { container } = render(<Card className="custom-class">content</Card>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies custom style correctly", () => {
    const { container } = render(
      <Card style={{ backgroundColor: "red" }}>content</Card>,
    );
    expect(container.firstChild).toHaveStyle("background-color: red");
  });
});
