import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Option from '../option';

describe('Option component', () => {
  it('renders an option element with the correct text', () => {
    render(<Option>Option 1</Option>);
    const option = screen.getByText('Option 1');
    expect(option).toBeInTheDocument();
  });

  it('sets the value correctly when value prop is passed', () => {
    render(<Option value="option1">Option 1</Option>);
    const option = screen.getByText('Option 1');
    expect(option).toHaveAttribute('value', 'option1');
  });
});
