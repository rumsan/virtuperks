import { NavItem } from "../../../type/nav.types";

export const navItemPaths: Record<NavItem, string[]> = {
  [NavItem.PARTICIPANTS]: ["/participants"],
  [NavItem.DEPARTMENTS]: ["/departments", "/treasurer/department/allocate"],
  [NavItem.TREASURER_TOKEN]: ["/treasurer/token"],
  [NavItem.TASK_PORTAL]: ["/task_portal"],
  [NavItem.MY_TASKS]: ["/tasks"],
  [NavItem.TASKS]: [],
  [NavItem.TOKEN]: [],
  [NavItem.TREASURER_DEPARTMENT]: [],
};
