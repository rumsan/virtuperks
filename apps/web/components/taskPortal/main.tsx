import TaskPortalMain from "./list";

interface TaskProps {
  router: any;
}

function TaskPortal({ router }: TaskProps) {
  return <TaskPortalMain router={router} />;
}

export default TaskPortal;
