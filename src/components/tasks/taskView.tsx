"use client"

import styles from "./taskView.module.css";
import Card from "../ui/card";
import Flex from "../ui/flex";
import TaskList from "./taskList";

export default function TaskView() {
  return <Flex direction="row" gap="lg" className={styles.container} data-testid="task-view">
    <Card>
      <Flex direction="column">
        <h2 data-testid="not-started-header">Not Started</h2>
        <TaskList status="not_started" />
      </Flex>
    </Card>

    <Card>
      <Flex direction="column">
        <h2 data-testid="in-progress-header">In Progress</h2>
        <TaskList status="in_progress" />
      </Flex>
    </Card>

    <Card>
      <Flex direction="column">
        <h2 data-testid="complete-header">Complete</h2>
        <TaskList status="complete" />
      </Flex>
    </Card>
  </Flex>
}

