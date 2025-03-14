import MainLayout from "@/components/layout/main.layout";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  );
};

export default layout;
