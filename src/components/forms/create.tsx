import styles from "./create.module.css";
import Button from "../ui/button";
import Flex from "../ui/flex";
import Input from "../ui/input";
import TextArea from "../ui/textarea";
import Select from "../ui/select";
import Option from "../ui/option";
import { useForm } from "@/hooks/useForm";
import { CreateTaskSchema, createTaskSchema } from "@/schemas/tasks";
import { useState } from "react";
import { useTasks } from "../context/task";

type Props = {
  onCreated?: () => void;
};

export default function CreateForm(props: Props) {
  const [formState, setFormState] = useState<"idle" | "creating" | "created">(
    "idle",
  );
  const tasksManager = useTasks();

  const { register, handleSubmit, setErrors, errors } = useForm({
    schema: createTaskSchema,
    default: {
      status: "not_started",
    },
  });

  const createTask = async (data: CreateTaskSchema) => {
    setFormState("creating");
    const response = await tasksManager.createTask(data);

    if (response.state === "error") {
      setErrors(response.errors);
      setFormState("idle");
    } else {
      setFormState("created");

      if (props.onCreated) {
        props.onCreated();
      }
    }
  };

  return (
    <form
      className={styles.container}
      data-testid="task-create-form"
      onSubmit={handleSubmit(createTask)}
    >
      <Flex gap="2xl" direction="column">
        {formState === "idle" ? (
          <>
            <h1>Create new task</h1>

            <Flex direction="column">
              <Input
                {...register("title")}
                label="Title*"
                placeholder="Name your task"
                data-testid="task-title-input"
              />

              <TextArea
                {...register("description")}
                label="Description (optional)"
                placeholder="Describe your task"
                data-testid="task-description-input"
              />

              <Input
                {...register("due")}
                grow
                type="datetime-local"
                label="Due date/time*"
                data-testid="task-due-input"
              />

              <Select
                {...register("status")}
                label="Status*"
                data-testid="task-status-select"
              >
                <Option value="not_started">Not Started</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="complete">Complete</Option>
              </Select>

              {errors.root?.length && (
                <p className={styles.error} data-testid="task-error">
                  {errors.root[0]}
                </p>
              )}
            </Flex>

            <Button data-testid="task-create-button">Create</Button>
          </>
        ) : formState === "creating" ? (
          <h2 data-testid="task-creating">Creating</h2>
        ) : (
          <h2 data-testid="task-created">Created</h2>
        )}
      </Flex>
    </form>
  );
}
