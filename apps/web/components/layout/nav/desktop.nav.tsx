import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu";
import { HandCoins, Layers, Users } from "lucide-react";
import Link from "next/link";

const DesktopNav = () => {
  return (
    <div className="w-full h-16 flex items-center p-3">
      <NavigationMenu className="">
        <NavigationMenuList className="flex items-center justify-center w-full h-16 gap-4">
          <div className="flex items-center justify-center h-full bg-red-400">
            <Link
              href="#"
              className="bg-logo bg-cover bg-center bg-auto bg-no-repeat"
            >
              Logo
            </Link>
          </div>

          <div className="grid grid-cols-4 h-full items-center justify-center gap-3 bg-pink-200">
            <NavigationMenuItem className="flex items-center gap-2">
              <Users />
              <span>Participants</span>
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center gap-2">
              <HandCoins />
              <span>Treasury</span>
            </NavigationMenuItem>

            <NavigationMenuItem className="flex items-center gap-2">
              <Layers />
              <span>Departments</span>
            </NavigationMenuItem>
          </div>

          <div className="h-full items-center justify-end gap-3 bg-pink-200">
            Hello
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopNav;
