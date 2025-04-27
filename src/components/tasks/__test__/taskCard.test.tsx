import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../taskCard";
import { Task, TasksProvider } from "@/components/context/task";

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  status: "not_started",
  due: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TaskCard component", () => {
  it("renders the task title and description", () => {
    render(
      <TasksProvider>
        <TaskCard task={mockTask} />
      </TasksProvider>,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("opens update dialog when edit icon is clicked", () => {
    render(
      <TasksProvider>
        <TaskCard task={mockTask} />
      </TasksProvider>,
    );

    const editButton = screen.getByTestId("task-card-edit");

    fireEvent.click(editButton);

    expect(screen.getByTestId("task-update-form")).toBeInTheDocument();
  });

  it("opens delete dialog when delete icon is clicked", () => {
    render(
      <TasksProvider>
        <TaskCard task={mockTask} />
      </TasksProvider>,
    );

    const deleteButton = screen.getByTestId("task-card-delete");

    fireEvent.click(deleteButton);

    expect(screen.getByTestId("task-delete-form")).toBeInTheDocument();
  });
});
