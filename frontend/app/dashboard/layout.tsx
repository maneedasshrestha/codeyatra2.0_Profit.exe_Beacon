import BottomNavBar from "../components/BottomNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <BottomNavBar />
    </>
  );
}
