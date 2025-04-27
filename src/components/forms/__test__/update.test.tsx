import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UpdateForm from "../update";
import { Task, useTasks } from "@/components/context/task";

jest.mock("@/components/context/task", () => ({
  useTasks: jest.fn(),
}));

const mockedUseTasks = useTasks as jest.Mock;

describe("UpdateForm", () => {
  const mockUpdateTask = jest.fn();
  const mockOnUpdate = jest.fn();

  const task: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    due: new Date("2025-12-31T12:00"),
    status: "not_started",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockUpdateTask.mockReset();
    mockedUseTasks.mockReturnValue({
      updateTask: mockUpdateTask,
    });
  });

  it("should render form in idle state by default", () => {
    render(<UpdateForm task={task} />);

    expect(screen.getByText("Update task")).toBeInTheDocument();
    expect(screen.getByTestId("task-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-due-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-status-select")).toBeInTheDocument();
    expect(screen.getByTestId("task-update-button")).toBeInTheDocument();
  });

  it('should show "Updating" state when the form is being submitted', async () => {
    mockUpdateTask.mockResolvedValueOnce({ state: "success" });

    render(<UpdateForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Updated Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T14:00" },
    });

    fireEvent.click(screen.getByTestId("task-update-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-updating")).toBeInTheDocument();
    });
  });

  it('should show "Updated" state after successful task update', async () => {
    mockUpdateTask.mockResolvedValueOnce({ state: "success" });

    render(<UpdateForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Updated Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T14:00" },
    });

    fireEvent.click(screen.getByTestId("task-update-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-updated")).toBeInTheDocument();
    });
  });

  it("should display error message when there is an error during task update", async () => {
    mockUpdateTask.mockResolvedValueOnce({
      state: "error",
      errors: {
        root: ["Something went wrong"],
      },
    });

    render(<UpdateForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Updated Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T14:00" },
    });

    fireEvent.click(screen.getByTestId("task-update-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-error")).toHaveTextContent(
        "Something went wrong",
      );
    });
  });

  it("should call onUpdate prop when task is successfully updated", async () => {
    mockUpdateTask.mockResolvedValueOnce({ state: "success" });

    render(<UpdateForm task={task} onUpdate={mockOnUpdate} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Updated Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T14:00" },
    });

    fireEvent.click(screen.getByTestId("task-update-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-updated")).toBeInTheDocument();
    });

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
  });

  it("should pass correct data to the updateTask function", async () => {
    mockUpdateTask.mockResolvedValueOnce({ state: "success" });

    render(<UpdateForm task={task} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Updated Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T14:00" },
    });

    fireEvent.click(screen.getByTestId("task-update-button"));

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledTimes(1);
      expect(mockUpdateTask).toHaveBeenCalledWith({
        id: "1",
        title: "Updated Test Task",
        description: "Test Description",
        due: "2025-12-31T14:00",
        status: "not_started",
      });
    });
  });
});
