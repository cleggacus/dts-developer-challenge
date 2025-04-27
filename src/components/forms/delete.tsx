import styles from "./delete.module.css";
import Button from "../ui/button";
import Flex from "../ui/flex";
import Input from "../ui/input";
import { useState } from "react";
import { Task, useTasks } from "../context/task";

type DeleteProps = {
  task: Task;
  onDelete?: () => void;
};

export default function DeleteForm(props: DeleteProps) {
  const taskManager = useTasks();
  const [formState, setFormState] = useState<"idle" | "deleting" | "deleted">(
    "idle",
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const deleteTask = async () => {
    if (value != props.task.title) {
      setError("Does not match title");
      return;
    }

    setFormState("deleting");

    const response = await taskManager.deleteTask({
      id: props.task.id,
    });

    if (response.state === "error") {
      setError("Something went wrong :(");
      setFormState("idle");
    } else {
      setFormState("deleted");

      if (props.onDelete) {
        props.onDelete();
      }
    }
  };

  return (
    <form
      data-testid="task-delete-form"
      onSubmit={(e) => {
        e.preventDefault();
        deleteTask();
      }}
    >
      <Flex className={styles.container} gap="2xl" direction="column">
        {formState === "idle" ? (
          <>
            <h1>Are you sure?</h1>

            <Flex className={styles.container} direction="column">
              <Input
                data-testid="task-title-input"
                value={value}
                onChange={(e) => {
                  setError(undefined);
                  setValue(e.currentTarget.value);
                }}
                error={error}
                label={`Type "${props.task.title}" to confirm`}
                placeholder="Task title"
              />

              <Button variant="error" data-testid="task-delete-button">
                Delete
              </Button>
            </Flex>
          </>
        ) : formState === "deleting" ? (
          <h2 data-testid="task-deleting">Deleting</h2>
        ) : (
          <h2 data-testid="task-deleted">Deleted</h2>
        )}
      </Flex>
    </form>
  );
}
