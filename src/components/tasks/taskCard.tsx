import styles from "./taskCard.module.css";
import Card from "../ui/card";
import Flex from "../ui/flex";
import { HiPencil, HiTrash } from "react-icons/hi";
import { useState } from "react";
import { Task } from "../context/task";
import Dialog from "../ui/dialog";
import DeleteForm from "../forms/delete";
import UpdateForm from "../forms/update";

type TaskCardProps = {
  task: Task;
}

export function TaskCard(props: TaskCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  return <Card variant="2">
    <Dialog open={deleteOpen} setOpen={setDeleteOpen}>
      <DeleteForm task={props.task} onDelete={() => setDeleteOpen(false)} />
    </Dialog>

    <Dialog open={updateOpen} setOpen={setUpdateOpen}>
      <UpdateForm task={props.task} onUpdate={() => setUpdateOpen(false)} />
    </Dialog>

    <Flex direction="column">
      <Flex className={styles.header} direction="row">
        <h2>{props.task.title}</h2>

        <Flex direction="row" gap="xs">
          <HiPencil data-testid="task-card-edit" aria-label="Edit task" onClick={() => setUpdateOpen(true)} className={styles.edit} />
          <HiTrash data-testid="task-card-delete" aria-label="Delete task" onClick={() => setDeleteOpen(true)} className={styles.trash} />
        </Flex>
      </Flex>

      <p>{props.task.description}</p>
    </Flex>
  </Card>
}
