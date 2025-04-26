import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TextArea from '../textarea';

describe('TextArea component', () => {
  it('renders a textarea element', () => {
    render(<TextArea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('renders the label when label prop is provided', () => {
    render(<TextArea label="Enter text" />);
    const label = screen.getByText('Enter text');
    expect(label).toBeInTheDocument();
  });

  it('does not render a label when label prop is not provided', () => {
    render(<TextArea />);
    const label = screen.queryByText('Enter text');
    expect(label).toBeNull();
  });

  it('shows error styles when error prop is passed', () => {
    render(<TextArea error="This field is required" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.parentElement).toHaveClass('error');
  });

  it('shows error message when error prop is passed', () => {
    render(<TextArea error="This field is required" />);
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('does not show error styles when no error prop is passed', () => {
    render(<TextArea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.parentElement).not.toHaveClass('error');
  });

  it('calls onChange when the textarea value changes', () => {
    const handleChange = jest.fn();
    render(<TextArea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('clears error message when the value is changed', () => {
    const handleChange = jest.fn();
    render(<TextArea error="This field is required" onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('This field is required')).toBeNull();
  });

  it('applies custom class correctly', () => {
    render(<TextArea className="custom-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
  });
});
