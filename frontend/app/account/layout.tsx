import TopBarAccount from "@/app/components/TopBarAccount";

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
