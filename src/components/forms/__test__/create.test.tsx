import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateForm from "../create";
import { useTasks } from "@/components/context/task";

jest.mock("@/components/context/task", () => ({
  useTasks: jest.fn(),
}));

const mockedUseTasks = useTasks as jest.Mock;

describe("CreateForm", () => {
  const mockCreateTask = jest.fn();

  beforeEach(() => {
    mockCreateTask.mockReset();
    mockedUseTasks.mockReturnValue({
      createTask: mockCreateTask,
    });
  });

  it("should render form in idle state by default", () => {
    render(<CreateForm />);

    expect(screen.getByText("Create new task")).toBeInTheDocument();

    const createButton = screen.getByTestId("task-create-button");
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeEnabled();
  });

  it('should change state to "creating" when submitting the form', async () => {
    mockCreateTask.mockResolvedValueOnce({ state: "success" });

    render(<CreateForm />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T12:00" },
    });

    fireEvent.change(screen.getByTestId("task-description-input"), {
      target: { value: "Task description" },
    });

    fireEvent.click(screen.getByTestId("task-create-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-creating")).toBeInTheDocument();
    });

    expect(mockCreateTask).toHaveBeenCalledTimes(1);
    expect(mockCreateTask).toHaveBeenCalledWith({
      title: "Test Task",
      description: "Task description",
      due: "2025-12-31T12:00",
      status: "not_started",
    });
  });

  it('should show "Created" after successful form submission', async () => {
    mockCreateTask.mockResolvedValueOnce({ state: "success" });

    render(<CreateForm />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T12:00" },
    });

    fireEvent.change(screen.getByTestId("task-description-input"), {
      target: { value: "Task description" },
    });

    fireEvent.click(screen.getByTestId("task-create-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-created")).toBeInTheDocument();
    });
  });

  it("should display error message when there is an error during task creation", async () => {
    mockCreateTask.mockResolvedValueOnce({
      state: "error",
      errors: {
        root: ["Something went wrong"],
      },
    });

    render(<CreateForm />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T12:00" },
    });

    fireEvent.change(screen.getByTestId("task-description-input"), {
      target: { value: "Task description" },
    });

    fireEvent.click(screen.getByTestId("task-create-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-error")).toHaveTextContent(
        "Something went wrong",
      );
    });
  });

  it("should call onCreated prop when task is successfully created", async () => {
    const mockOnCreated = jest.fn();
    mockCreateTask.mockResolvedValueOnce({ state: "success" });

    render(<CreateForm onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByTestId("task-title-input"), {
      target: { value: "Test Task" },
    });

    fireEvent.change(screen.getByTestId("task-due-input"), {
      target: { value: "2025-12-31T12:00" },
    });

    fireEvent.change(screen.getByTestId("task-description-input"), {
      target: { value: "Task description" },
    });

    fireEvent.click(screen.getByTestId("task-create-button"));

    await waitFor(() => {
      expect(screen.getByTestId("task-created")).toBeInTheDocument();
    });

    expect(mockOnCreated).toHaveBeenCalledTimes(1);
  });
});
