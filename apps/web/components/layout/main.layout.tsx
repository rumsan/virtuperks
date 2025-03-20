import DesktopNav from "./nav/desktop.nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <main className="flex w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="h-[calc(100dvh-60px)] overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
