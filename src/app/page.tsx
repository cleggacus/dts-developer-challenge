"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Dialog from "@/components/ui/dialog";
import styles from "./page.module.css";
import { HiOutlinePlusSm } from "react-icons/hi";
import CreateForm from "@/components/forms/create";
import TaskView from "@/components/tasks/taskView";
import { TasksProvider } from "@/components/context/task";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <TasksProvider>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Tasks</h1>
          <div>
            <Button onClick={() => setOpen(true)}>
              New Task <HiOutlinePlusSm />
            </Button>

            <Dialog open={open} setOpen={setOpen}>
              <CreateForm onCreated={() => setOpen(false)} />
            </Dialog>
          </div>
        </div>

        <TaskView />
      </div>
      ;
    </TasksProvider>
  );
}
