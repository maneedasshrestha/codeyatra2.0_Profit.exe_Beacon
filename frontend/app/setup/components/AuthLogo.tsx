import Image from "next/image";

interface AuthLogoProps {
  title: string;
  subtitle?: string;
  size?: number;
}

export function AuthLogo({ title, subtitle, size = 350 }: AuthLogoProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        src="/assets/beacon-logo1.png"
        alt="Beacon"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      <div className="text-center">
        <h1
          className="text-[28px] font-extrabold leading-none"
          style={{
            background: "linear-gradient(90deg, #6d28d9, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] font-medium mt-1.5" style={{ color: "#9ca3af" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
