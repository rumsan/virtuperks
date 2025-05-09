import MainLayout from "@/components/layout/main.layout";

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainLayout>{children}</MainLayout>
    </>
  );
};

export default HeaderLayout;
