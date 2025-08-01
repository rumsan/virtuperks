import {
  Car,
  Coffee,
  Gamepad2,
  ShoppingBag,
  Smartphone,
  Ticket,
} from "lucide-react";
import React from "react";


export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Entertainment":
      return React.createElement(Ticket, { className: "h-6 w-6 text-[#334155" });
    case "Food & Beverage":
      return React.createElement(Coffee, { className: "h-6 w-6 text-[#334155" });
    case "Utilities":
      return React.createElement(Smartphone, { className: "h-6 w-6 text-[#334155" });
    case "Shopping":
      return React.createElement(ShoppingBag, { className: "h-6 w-6 text-[#334155" });
    case "Transportation":
      return React.createElement(Car, { className: "h-6 w-6 text-[#334155" });
    default:
      return React.createElement(Gamepad2, { className: "h-6 w-6 text-[#334155]" });
  }
};
