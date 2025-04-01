import MyTaskListMain from "./list";

interface TaskProps {
  router: any;
}

function Task({ router }: TaskProps) {
  return <MyTaskListMain router={router} />;
}

export default Task;