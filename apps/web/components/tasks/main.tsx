import TaskDetails from "./list";

interface TaskProps {
  router: any;
}

function Task({ router }: TaskProps) {
  return <TaskDetails router={router} />;
}

export default Task;
