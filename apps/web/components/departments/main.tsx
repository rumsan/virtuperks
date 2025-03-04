import DepartmentList from "./list";

interface Department {
  router: any;
}

function Department({ router }: Department) {
  return (
    <main className="w-full">
      <DepartmentList router={router} />
    </main>
  );
}

export default Department;
