import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DepartmentList from "./list";

interface Department {
  router: AppRouterInstance;
}

function Department({ router }: Department) {
  return (
    <main className="w-full">
      <DepartmentList router={router} />
    </main>
  );
}

export default Department;
