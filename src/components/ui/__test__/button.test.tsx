import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../button';

describe('Button component', () => {
  it('should render button with text', () => {
    render(<Button>test</Button>);

    const button = screen.getByText('test');
    expect(button).toBeInTheDocument();
  });

  it('applies variant 1 class corerctly', () => {
    const { container } = render(<Button>test</Button>);
    expect(container.firstChild).toHaveClass('variant-1');
  });

  it('applies variant 2 class corerctly', () => {
    const { container } = render(<Button variant="2">test</Button>);
    expect(container.firstChild).toHaveClass('variant-2');
  });

  it('applies variant error class corerctly', () => {
    const { container } = render(<Button variant="error">test</Button>);
    expect(container.firstChild).toHaveClass('variant-error');
  });

  it('applies flex 1 corretly', () => {
    const { container } = render(<Button flex={1}>test</Button>);
    expect(container.firstChild).toHaveStyle('flex: 1');
  });

  it('applies custom class correctly', () => {
    const { container } = render(<Button className="custom-class">test</Button>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies an empty style object by default', () => {
    const { container } = render(<Button>test</Button>);
    expect(container.firstChild).toHaveStyle({ flex: undefined });
  });

  it('passes down onClick prop', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>test</Button>);
    fireEvent.click(screen.getByText('test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

