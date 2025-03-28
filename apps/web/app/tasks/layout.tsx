import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import Validation from "@/providers/validation";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Validation role={process.env.NEXT_PUBLIC_ENTITY_OWNER_ROLE || ""}>
        <EntityOwnerNav>{children}</EntityOwnerNav>
      </Validation>
    </div>
  );
};

export default layout;
