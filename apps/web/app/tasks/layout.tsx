import EntityOwnerNav from "@/components/layout/nav/entity_owner.nav";
import Validation from "@/providers/validation";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
    
  {children}
      
    </div>
  );
};

export default layout;
