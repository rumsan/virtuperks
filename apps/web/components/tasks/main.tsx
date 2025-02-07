import TaskListMain from "./list";

interface TaskProps {
  router: any;
}

function Task({ router }: TaskProps) {
  return <TaskListMain router={router} />;
}

export default Task;
