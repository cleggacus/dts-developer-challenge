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
  onCreated?: () => void
}

export default function CreateForm(props: Props) {
  const [formState, setFormState] = useState<"idle" | "creating" | "created">("idle")
  const tasksManager = useTasks();

  const { register, handleSubmit, setErrors, errors } = useForm({
    schema: createTaskSchema,
    default: {
      status: "not_started"
    }
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
  }

  return <form onSubmit={handleSubmit(createTask)}>
    <Flex className={styles.container} gap="2xl" direction="column">
      {
        formState === "idle" ? <>
          <h1>Create new task</h1>

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

          <Button>Create</Button>
        </> :
          formState === "creating" ?
            <>
              <h2>Creating</h2>
            </> :
            <>
              <h2>Created</h2>
            </>
      }
    </Flex>
  </form>
}
