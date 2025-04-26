import { CreateTaskResponse } from "@/app/api/tasks/create/route";
import { DeleteTaskResponse } from "@/app/api/tasks/delete/route";
import { GetTaskResponse } from "@/app/api/tasks/get/route";
import { ListTaskResponse } from "@/app/api/tasks/list/route";
import { UpdateTaskResponse } from "@/app/api/tasks/update/route";
import { task } from "@/db/schema";
import { ErrorMap, ZodFormSchema } from "@/hooks/useForm";
import { createTaskSchema, deleteTaskSchema, getTaskSchema, updateTaskSchema } from "@/schemas/tasks";
import { InferSelectModel } from "drizzle-orm";
import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

export type Task = InferSelectModel<typeof task>;

type Tasks =
  | { state: "fetching" }
  | { state: "failed" }
  | ({ state: "fetched", taskList: Task[] });

type ActionResult<T extends ZodFormSchema, U> =
  | ({ state: "success" } & U)
  | { state: "error"; errors: ErrorMap<T> };

type Action<T extends ZodFormSchema, U = {}> = (data: z.infer<T>) => Promise<ActionResult<T, U>>;

export type TasksContextType = {
  tasks: Tasks;
  refetch: () => Promise<void>;
  createTask: Action<typeof createTaskSchema>;
  updateTask: Action<typeof updateTaskSchema>;
  deleteTask: Action<typeof deleteTaskSchema>;
  fetchTask: Action<typeof getTaskSchema, Task>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Tasks>({
    state: "fetching"
  });

  const context: TasksContextType = {
    tasks,
    async refetch() {
      try {
        const response = await fetch("/api/tasks/list");
        const data: ListTaskResponse = await response.json();

        const tasks: Tasks = {
          state: "fetched",
          taskList: [],
        };

        for (const task of data) {
          task.updatedAt = new Date(task.updatedAt);
          task.createdAt = new Date(task.createdAt);
          task.due = new Date(task.due);

          tasks.taskList.push(task);
        }

        setTasks(tasks);
      } catch {
        setTasks({
          state: "failed"
        })
      }
    },
    async createTask(task) {
      try {
        const response = await fetch("/api/tasks/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        const data: CreateTaskResponse = await response.json();

        if ("error" in data) {
          return {
            state: "error",
            errors: data.error
          }
        }

        if (!response.ok) {
          return {
            state: "error",
            errors: {
              root: ["Something went wrong"]
            }
          }
        }

        data.updatedAt = new Date(data.updatedAt);
        data.createdAt = new Date(data.createdAt);
        data.due = new Date(data.due);

        // creates task locally
        setTasks(tasks => {
          if (tasks.state == "fetched") {
            tasks = {
              state: "fetched",
              taskList: [...tasks.taskList, data]
            }
          }

          return tasks;
        })

        return {
          state: "success"
        }
      } catch {
        return {
          state: "error",
          errors: {
            root: ["Something went wrong"]
          }
        }
      }
    },
    async updateTask(task) {
      try {
        const response = await fetch("/api/tasks/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        const data: UpdateTaskResponse = await response.json();

        if ("error" in data) {
          return {
            state: "error",
            errors: data.error
          }
        }

        if (!response.ok) {
          return {
            state: "error",
            errors: {
              root: ["Something went wrong"]
            }
          }
        }

        data.updatedAt = new Date(data.updatedAt);
        data.createdAt = new Date(data.createdAt);
        data.due = new Date(data.due);

        // update task locally
        setTasks(tasks => {
          if (tasks.state == "fetched") {
            const index = tasks.taskList.findIndex(item => item.id === data.id);

            tasks = {
              state: "fetched",
              taskList: index === -1 ?
                [...tasks.taskList, data] :
                [
                  ...tasks.taskList.slice(0, index),
                  data,
                  ...tasks.taskList.slice(index + 1),
                ]
            }
          }

          return tasks;
        })

        return {
          state: "success"
        }
      } catch {
        return {
          state: "error",
          errors: {
            root: ["Something went wrong"]
          }
        }
      }
    },
    async deleteTask(task) {
      try {
        const response = await fetch("/api/tasks/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        const data: DeleteTaskResponse = await response.json();

        if ("error" in data) {
          return {
            state: "error",
            errors: data.error
          }
        }

        if (!response.ok) {
          return {
            state: "error",
            errors: {
              root: ["Something went wrong"]
            }
          }
        }

        data.updatedAt = new Date(data.updatedAt);
        data.createdAt = new Date(data.createdAt);
        data.due = new Date(data.due);

        // delete task locally 
        setTasks(tasks => {
          if (tasks.state == "fetched") {
            const index = tasks.taskList.findIndex(item => item.id === data.id);

            if (index != -1) {
              tasks = {
                state: "fetched",
                taskList: [
                  ...tasks.taskList.slice(0, index),
                  ...tasks.taskList.slice(index + 1),
                ]
              }
            }
          }

          return tasks;
        })

        return {
          state: "success"
        }
      } catch {
        return {
          state: "error",
          errors: {
            root: ["Something went wrong"]
          }
        }
      }
    },
    async fetchTask(task) {
      try {
        const response = await fetch("/api/tasks/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });

        const data: GetTaskResponse = await response.json();

        if ("error" in data) {
          return {
            state: "error",
            errors: data.error
          }
        }

        if (!response.ok) {
          return {
            state: "error",
            errors: {
              root: ["Something went wrong"]
            }
          }
        }

        data.updatedAt = new Date(data.updatedAt);
        data.createdAt = new Date(data.createdAt);
        data.due = new Date(data.due);

        setTasks(tasks => {
          if (tasks.state == "fetched") {
            const index = tasks.taskList.findIndex(item => item.id === data.id);

            tasks = {
              state: "fetched",
              taskList: index === -1 ?
                [...tasks.taskList, data] :
                [
                  ...tasks.taskList.slice(0, index),
                  data,
                  ...tasks.taskList.slice(index + 1),
                ]
            }
          }

          return tasks;
        })

        return {
          state: "success",
          ...data
        }
      } catch {
        return {
          state: "error",
          errors: {
            root: ["Something went wrong"]
          }
        }
      }
    },
  }

  useEffect(() => {
    context.refetch();
  }, [])

  return (
    <TasksContext.Provider value={context}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("TasksProvider was no wrapped around useTasks hook");
  }

  return context;
};

