import MainLayout from "@/components/layout/main.layout";
import Validation from "@/providers/validation";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Validation role={process.env.NEXT_PUBLIC_ENTITY_OWNER_ROLE || ""}>
        <MainLayout>{children}</MainLayout>
      </Validation>
    </div>
  );
};

export default layout;
