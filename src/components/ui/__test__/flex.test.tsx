import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Flex, { Row, Column } from '../flex';

describe('Flex component', () => {
  it('renders children correctly', () => {
    render(<Flex>flex content</Flex>);
    const content = screen.getByText('flex content');
    expect(content).toBeInTheDocument();
  });

  it('applies default direction (row)', () => {
    const { container } = render(<Flex>flex content</Flex>);
    expect(container.firstChild).toHaveClass('row');
  });

  it('applies column direction correctly', () => {
    const { container } = render(<Flex direction="column">flex content</Flex>);
    expect(container.firstChild).toHaveClass('column');
  });

  it('applies default gap correctly', () => {
    const { container } = render(<Flex>flex content</Flex>);
    expect(container.firstChild).toHaveStyle('gap: var(--spacing-md)');
  });

  it('applies custom gap correctly', () => {
    const { container } = render(<Flex gap="xl">flex content</Flex>);
    expect(container.firstChild).toHaveStyle('gap: var(--spacing-xl)');
  });

  it('does not apply gap when gap is "none"', () => {
    const { container } = render(<Flex gap="none">flex content</Flex>);
    expect(container.firstChild).toHaveStyle({ gap: undefined });
  });

  it('applies custom class correctly', () => {
    const { container } = render(<Flex className="custom-class">flex content</Flex>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom style correctly', () => {
    const { container } = render(<Flex style={{ backgroundColor: 'blue' }}>flex content</Flex>);
    expect(container.firstChild).toHaveStyle('background-color: blue');
  });
});

describe('Row component', () => {
  it('renders as a Flex with row direction', () => {
    const { container } = render(<Row>row content</Row>);
    expect(container.firstChild).toHaveClass('row');
    expect(screen.getByText('row content')).toBeInTheDocument();
  });
});

describe('Column component', () => {
  it('renders as a Flex with column direction', () => {
    const { container } = render(<Column>column content</Column>);
    expect(container.firstChild).toHaveClass('column');
    expect(screen.getByText('column content')).toBeInTheDocument();
  });
});
