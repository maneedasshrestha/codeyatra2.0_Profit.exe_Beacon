import BottomNavBar from "../components/BottomNav";
import TopBar from "../components/TopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-[#F8F7FA]">
      <TopBar />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
}
