import BottomNavBar from "../components/BottomNav";
import TopBar from "../components/TopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      {children}
      <BottomNavBar />
    </>
  );
}
