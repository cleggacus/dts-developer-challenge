import styles from "./create.module.css";
import Button from "../ui/button";
import Flex from "../ui/flex";
import Input from "../ui/input";
import TextArea from "../ui/textarea";
import Select from "../ui/select";
import Option from "../ui/option";
import { useForm } from "@/hooks/useForm";
import { CreateTaskSchema, createTaskSchema, UpdateTaskSchema, updateTaskSchema } from "@/schemas/tasks";
import { useState } from "react";
import { Task, useTasks } from "../context/task";

type Props = {
  task: Task,
  onUpdate?: () => void
}

export default function UpdateForm(props: Props) {
  const [formState, setFormState] = useState<"idle" | "updating" | "updated">("idle")
  const tasksManager = useTasks();

  const { register, handleSubmit, errors, setErrors } = useForm({
    schema: updateTaskSchema,
    default: {
      id: props.task.id,
      status: props.task.status,
      title: props.task.title,
      description: props.task.description ?? undefined,
      due: props.task.due.toISOString().slice(0, 16),
    }
  });

  const updateTask = async (data: UpdateTaskSchema) => {
    setFormState("updating");
    const response = await tasksManager.updateTask(data);

    if (response.state === "error") {
      setErrors(response.errors);
      setFormState("idle");
    } else {
      setFormState("updated");

      if (props.onUpdate) {
        props.onUpdate();
      }
    }
  }

  return <form onSubmit={handleSubmit(updateTask)}>
    <Flex className={styles.container} gap="2xl" direction="column">
      {
        formState === "idle" ? <>
          <h1>Update task</h1>

          <Flex className={styles.container} direction="column">
            <Input
              {...register("title")}
              label="Title*"
              placeholder="Name your task"
            />

            <TextArea
              {...register("description")}
              label="Description (optional)"
              placeholder="Describe your task"
            />

            <Input
              {...register("due")}
              grow
              type="datetime-local"
              label="Due data/time*"
            />

            <Select {...register("status")} label="Status*">
              <Option value="not_started">Not Started</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="complete">Complete</Option>
            </Select>

            {
              errors.root && <p className={styles.error}>{errors.root[0]}</p>
            }
          </Flex>

          <Button>Update</Button>
        </> :
          formState === "updating" ?
            <>
              <h2>Updating</h2>
            </> :
            <>
              <h2>Updated</h2>
            </>
      }
    </Flex>
  </form>
}
