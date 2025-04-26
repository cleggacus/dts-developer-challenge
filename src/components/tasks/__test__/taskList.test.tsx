import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import TaskList from '../taskList';
import { useTasks } from '@/components/context/task';

jest.mock('@/components/context/task', () => ({
  useTasks: jest.fn(),
}));

const mockedUseTasks = useTasks as jest.Mock;

describe('TaskList component', () => {
  it('renders loading state when tasks are fetching', () => {
    mockedUseTasks.mockReturnValue({
      tasks: {
        state: 'fetching',
      },
    });

    render(<TaskList status="not_started" />);

    expect(screen.getByText("Loading . . .")).toBeInTheDocument();
  });

  it('renders error message when fetching tasks fails', () => {
    mockedUseTasks.mockReturnValue({
      tasks: {
        state: 'failed',
      },
    });

    render(<TaskList status="not_started" />);

    expect(screen.getByText("Failed to fetch :(")).toBeInTheDocument();
  });

  it('renders task cards filtered by status', () => {
    mockedUseTasks.mockReturnValue({
      tasks: {
        state: 'success',
        taskList: [
          { id: 1, status: "not_started", title: 'Task 1' },
          { id: 2, status: "in_progress", title: 'Task 2' },
          { id: 3, status: "not_started", title: 'Task 3' },
        ],
      },
    });

    render(<TaskList status="not_started" />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).toBeNull();
  });

  it('renders nothing when no tasks match the given status', () => {
    mockedUseTasks.mockReturnValue({
      tasks: {
        state: 'success',
        taskList: [
          { id: 1, status: "in_progress", title: 'Task 1' },
          { id: 2, status: "complete", title: 'Task 2' },
        ],
      },
    });

    render(<TaskList status="not_started" />);

    expect(screen.queryByText('Task 1')).toBeNull();
    expect(screen.queryByText('Task 2')).toBeNull();
  });
});
