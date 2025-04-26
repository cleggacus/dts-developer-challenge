"use client";

import styles from "./taskView.module.css";
import Card from "../ui/card";
import Flex from "../ui/flex";
import TaskList from "./taskList";

export default function TaskView() {
  return <Flex direction="row" gap="lg" className={styles.container}>
    <Card>
      <Flex direction="column">
        <h2>Not Started</h2>
        <TaskList status="not_started" />
      </Flex>
    </Card>

    <Card>
      <Flex direction="column">
        <h2>In Progress</h2>
        <TaskList status="in_progress" />
      </Flex>
    </Card>

    <Card>
      <Flex direction="column">
        <h2>Complete</h2>
        <TaskList status="complete" />
      </Flex>
    </Card>

  </Flex>
}
