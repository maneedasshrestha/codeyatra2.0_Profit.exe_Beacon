import TopBarAccount from "../components/TopBarAccount";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBarAccount />
      {children}
    </>
  );
}
