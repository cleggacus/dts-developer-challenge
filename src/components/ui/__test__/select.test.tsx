import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Select from '../select';

describe('Select component', () => {
  it('renders a select element', () => {
    render(<Select />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders the label when label prop is provided', () => {
    render(<Select label="Choose Option" />);
    const label = screen.getByText('Choose Option');
    expect(label).toBeInTheDocument();
  });

  it('does not render a label when label prop is not provided', () => {
    render(<Select />);
    const label = screen.queryByText('Choose Option');
    expect(label).toBeNull();
  });

  it('shows error styles when error prop is passed', () => {
    render(<Select error="This field is required" />);
    const select = screen.getByRole('combobox');
    expect(select.parentElement).toHaveClass('error');
  });

  it('shows error message when error prop is passed', () => {
    render(<Select error="This field is required" />);
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('does not show error styles when no error prop is passed', () => {
    render(<Select />);
    const select = screen.getByRole('combobox');
    expect(select.parentElement).not.toHaveClass('error');
  });

  it('calls onChange when a selection is made', () => {
    const handleChange = jest.fn();
    render(
      <Select onChange={handleChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('clears error when a selection is made', () => {
    const handleChange = jest.fn();
    render(
      <Select error="This field is required" onChange={handleChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('This field is required')).toBeNull();
  });

  it('applies custom class correctly', () => {
    render(<Select className="custom-class" />);
    const select = screen.getByRole('combobox');
    expect(select.parentElement).toHaveClass('custom-class');
  });
});
