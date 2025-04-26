import { StatusEnum } from "@/db/schema"
import { useTasks } from "../context/task"
import { TaskCard } from "./taskCard";

type TaskListProps = {
  status: StatusEnum
}

export default function TaskList(props: TaskListProps) {
  const tasksManger = useTasks();

  if (tasksManger.tasks.state === "fetching") {
    return <p>Loading . . .</p>
  }

  if (tasksManger.tasks.state === "failed") {
    return <p>Failed to fetch :(</p>
  }

  return <>
    {
      tasksManger.tasks.taskList
        .filter(task => task.status === props.status)
        .map((task, i) =>
          <TaskCard key={i} task={task} />
        )
    }
  </>
}
