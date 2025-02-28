"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export default function ListFilter() {
  return (
    <div className="flex items-center gap-2">
      <Select>
        <SelectTrigger className="w-[280px] h-10">
          <SelectValue className="text-gray-400" placeholder="Select manager" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="managerA">Manager A</SelectItem>
            <SelectItem value="managerB">Manager B</SelectItem>
            <SelectItem value="managerC">Manager C</SelectItem>
            <SelectItem value="managerD">Manager D</SelectItem>
            <SelectItem value="managerE">Manager E</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[280px] h-10">
          <SelectValue
            className="text-gray-400"
            placeholder="Select department"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="departmentA">Department A</SelectItem>
            <SelectItem value="departmentB">Department B</SelectItem>
            <SelectItem value="departmentC">Department C</SelectItem>
            <SelectItem value="departmentD">Department D</SelectItem>
            <SelectItem value="departmentE">Department E</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
