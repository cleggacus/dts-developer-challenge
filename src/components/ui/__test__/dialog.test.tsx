import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Dialog from '../dialog';

describe('Dialog component', () => {
  it('does not render when open is false', () => {
    const setOpen = jest.fn();
    const { container } = render(<Dialog open={false} setOpen={setOpen}>content</Dialog>);
    expect(container.firstChild).toBeNull();
  });

  it('renders when open is true', () => {
    const setOpen = jest.fn();
    render(<Dialog open={true} setOpen={setOpen}>content</Dialog>);
    const content = screen.getByText('content');
    expect(content).toBeInTheDocument();
  });

  it('calls setOpen(false) when background is clicked', () => {
    const setOpen = jest.fn();
    render(<Dialog open={true} setOpen={setOpen}>content</Dialog>);

    const bg = screen.getByTestId('dialog-bg');
    fireEvent.click(bg);

    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('renders children inside Card', () => {
    const setOpen = jest.fn();
    render(<Dialog open={true} setOpen={setOpen}>dialog content</Dialog>);
    expect(screen.getByText('dialog content')).toBeInTheDocument();
  });
});

