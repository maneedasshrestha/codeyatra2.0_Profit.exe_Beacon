interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div
      className="rounded-3xl px-6 py-7 flex flex-col gap-5"
      style={{
        background: "#fff",
        boxShadow: "0 8px 40px rgba(124,58,237,0.10)",
        border: "1.5px solid rgba(196,181,253,0.4)",
      }}
    >
      {children}
    </div>
  );
}
