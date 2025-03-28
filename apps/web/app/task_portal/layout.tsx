import TaskPortalNav from "@/components/layout/nav/task_portal.nav";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <TaskPortalNav>{children}</TaskPortalNav>
    </div>
  );
};

export default layout;
