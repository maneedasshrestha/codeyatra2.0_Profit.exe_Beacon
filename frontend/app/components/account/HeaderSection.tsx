import React from "react";

interface HeaderSectionProps {
  title?: string;
  subtitle?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title = "Account",
  subtitle = "Your Profile",
}) => (
  <div
    className="sticky top-0 z-20 pt-6 pb-4 px-5"
    style={{
      background: "linear-gradient(180deg,#F8F7FA 70%,#F8F7FAcc 100%)",
      backdropFilter: "blur(20px)",
    }}
  >
    <span
      className="text-[11px] font-bold tracking-widest uppercase"
      style={{ color: "#a78bfa", letterSpacing: "0.12em" }}
    >
      {subtitle}
    </span>
    <h1 className="text-3xl font-extrabold leading-none text-violet-900">
      {title}
    </h1>
  </div>
);

export default HeaderSection;
