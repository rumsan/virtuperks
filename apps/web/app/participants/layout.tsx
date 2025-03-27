import SuperAdminNav from "@/components/layout/nav/super_admin.nav";
import Validation from "@/providers/validation";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Validation role={process.env.NEXT_PUBLIC_SUPER_ADMIN_ROLE || ""}>
        <SuperAdminNav>{children}</SuperAdminNav>
      </Validation>
    </div>
  );
};

export default layout;
