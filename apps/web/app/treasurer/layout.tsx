import TreasurerNav from "@/components/layout/nav/treasurer.nav";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <TreasurerNav>{children}</TreasurerNav>
    </div>
  );
};

export default layout;
