import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteForm from "../delete";
import { Task, useTasks } from "@/components/context/task";

jest.mock("@/components/context/task", () => ({
  useTasks: jest.fn(),
}));

const mockedUseTasks = useTasks as jest.Mock;

describe("DeleteForm", () => {
  const mockDeleteTask = jest.fn();
  const mockOnDelete = jest.fn();

  const task: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    due: new Date(),
    status: "not_started",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockDeleteTask.mockReset();
    mockedUseTasks.mockReturnValue({
      deleteTask: mockDeleteTask,
    });
  });

  it("should render form in idle state by default", () => {
    render(<DeleteForm task={task} />);

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByTestId("task-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-delete-button")).toBeInTheDocument();
  });

  it('should show "Deleting" state when the form is being submitted', async () => {
    mockDeleteTask.mockResolvedValueOnce({ state: "success" });

    render(<DeleteForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.click(screen.getByTestId("task-delete-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-deleting")).toBeInTheDocument();
    });
  });

  it('should show "Deleted" state after successful task deletion', async () => {
    mockDeleteTask.mockResolvedValueOnce({ state: "success" });

    render(<DeleteForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.click(screen.getByTestId("task-delete-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-deleted")).toBeInTheDocument();
    });
  });

  it("should display error when the title does not match", async () => {
    render(<DeleteForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Wrong Title" },
    });

    fireEvent.click(screen.getByTestId("task-delete-button"));

    await waitFor(() => {
      expect(screen.getByTestId("input-error")).toHaveTextContent(
        "Does not match title",
      );
    });
  });

  it("should call onDelete prop when task is successfully deleted", async () => {
    mockDeleteTask.mockResolvedValueOnce({ state: "success" });

    render(<DeleteForm task={task} onDelete={mockOnDelete} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.click(screen.getByTestId("task-delete-button"));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });
});
