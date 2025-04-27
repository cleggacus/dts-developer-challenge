import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Input from "../input";

describe("Input component", () => {
  it("renders an input element", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("displays a label when label prop is provided", () => {
    render(<Input label="Username" />);
    const label = screen.getByText("Username");
    expect(label).toBeInTheDocument();
  });

  it("does not display a label when label prop is not provided", () => {
    render(<Input />);
    const label = screen.queryByText("Username");
    expect(label).toBeNull();
  });

  it("shows error styles when error is passed", () => {
    render(<Input error="This field is required" />);
    const input = screen.getByRole("textbox").parentElement;
    expect(input).toHaveClass("error");
  });

  it("shows error message when error prop is passed", () => {
    render(<Input error="This field is required" />);
    const errorMessage = screen.getByText("This field is required");
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not show error styles when no error prop is passed", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).not.toHaveClass("error");
  });

  it("calls onChange when text is entered", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("clears error onChange", () => {
    const handleChange = jest.fn();
    render(<Input error="This field is required" onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("This field is required")).toBeNull();
  });

  it("applies grow class when grow prop is true", () => {
    render(<Input grow={true} />);
    const input = screen.getByRole("textbox");
    expect(input.parentElement).toHaveClass("grow");
  });

  it("does not apply grow class when grow prop is false", () => {
    render(<Input grow={false} />);
    const input = screen.getByRole("textbox");
    expect(input.parentElement).not.toHaveClass("grow");
  });
});
