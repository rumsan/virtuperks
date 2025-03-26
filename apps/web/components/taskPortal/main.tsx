import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TaskPortalMain from "./list";

interface TaskProps {
  router: AppRouterInstance;
}

function TaskPortal({ router }: TaskProps) {
  return <TaskPortalMain router={router} />;
}

export default TaskPortal;
