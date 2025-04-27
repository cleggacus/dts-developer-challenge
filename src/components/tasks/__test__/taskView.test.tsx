import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import TaskView from "../taskView";
import { TasksProvider } from "@/components/context/task";

describe("TaskView component", () => {
  it("renders without crashing", () => {
    render(
      <TasksProvider>
        <TaskView />
      </TasksProvider>,
    );
    const taskViewContainer = screen.getByTestId("task-view");
    expect(taskViewContainer).toBeInTheDocument();
  });

  it("renders all status sections (Not Started, In Progress, Complete)", () => {
    render(
      <TasksProvider>
        <TaskView />
      </TasksProvider>,
    );

    expect(screen.getByTestId("not-started-header")).toBeInTheDocument();
    expect(screen.getByTestId("in-progress-header")).toBeInTheDocument();
    expect(screen.getByTestId("complete-header")).toBeInTheDocument();
  });

  it("applies the correct layout and gap using Flex component", () => {
    render(
      <TasksProvider>
        <TaskView />
      </TasksProvider>,
    );

    const flexContainer = screen.getByTestId("task-view");
    expect(flexContainer).toHaveClass("row");
    expect(flexContainer).toHaveStyle("gap: var(--spacing-lg)");
  });
});
