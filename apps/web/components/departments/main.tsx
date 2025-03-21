import { NextRouter } from "next/router";
import DepartmentList from "./list";

interface Department {
  router: NextRouter;
}

function Department({ router }: Department) {
  return (
    <main className="w-full">
      <DepartmentList router={router} />
    </main>
  );
}

export default Department;
