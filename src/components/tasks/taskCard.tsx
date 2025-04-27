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
};

export function TaskCard(props: TaskCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const absoluteDueText = () => {
    const dateTimeString = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(props.task.due);

    return `${dateTimeString} (${props.task.due < new Date() ? "Past Due" : "Upcoming"})`;
  };

  const relativeDueText = () => {
    const now = new Date();
    const deltaTime = (props.task.due.valueOf() - now.valueOf()) / 1000;
    const isNegative = deltaTime < 0;
    const seconds = Math.abs(deltaTime);

    const units = [
      { label: "century", amount: 60 * 60 * 24 * 365.25 * 100 },
      { label: "year", amount: 60 * 60 * 24 * 365.25 },
      { label: "month", amount: 60 * 60 * 24 * 30 },
      { label: "day", amount: 60 * 60 * 24 },
      { label: "hour", amount: 60 * 60 },
      { label: "minute", amount: 60 },
      { label: "second", amount: 1 },
    ];

    let result = "";

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const unitCount = Math.floor(seconds / unit.amount);

      if (unitCount > 0) {
        result = `${unitCount} ${unit.label}${unitCount > 1 ? "s" : ""}`;
        break;
      }
    }

    result = result.trim();
    return result
      ? `${isNegative ? "Due" : "Due in"} ${result}${isNegative ? " ago" : ""}`
      : "Due now";
  };

  return (
    <Card variant="2">
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
            <HiPencil
              data-testid="task-card-edit"
              aria-label="Edit task"
              onClick={() => setUpdateOpen(true)}
              className={styles.edit}
            />
            <HiTrash
              data-testid="task-card-delete"
              aria-label="Delete task"
              onClick={() => setDeleteOpen(true)}
              className={styles.trash}
            />
          </Flex>
        </Flex>

        <p>{props.task.description}</p>
        <p title={absoluteDueText()} className={styles.datetime}>
          {relativeDueText()}
        </p>
      </Flex>
    </Card>
  );
}
