import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";

const DepartmentAction = () => {
  return (
    <div className="w-full h-10 flex rounded-md border border-gray-200 rounded-md items-center p-3">
      <p className="text-gray-500">
        <Search size={20} strokeWidth={2.75} />
      </p>
      <Input
        type="text"
        placeholder="Search"
        className="border-none focus:outline-none"
      />
    </div>
  );
};

export default DepartmentAction;
