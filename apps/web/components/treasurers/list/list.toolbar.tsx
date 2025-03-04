"use client";

import TreasurerAdd from "../form/treasurer.add";

export default function ListToolBar() {
  return (
    <div className="w-full flex justify-end items-center space-x-2">
      <TreasurerAdd />
    </div>
  );
}

