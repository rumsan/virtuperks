import MainLayout from "@/components/layout/main.layout";

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  );
};

export default HeaderLayout;
