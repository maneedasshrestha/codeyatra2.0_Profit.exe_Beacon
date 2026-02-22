"use client";
import React from "react";
import ProfileHeader from "../components/ProfileHeader";
import AcademicCard from "../components/AcademicCard";
import ActionMenu from "../components/ActionMenu";

const USER = {
  name: "Sizzler Sahikarmi",
  email: "sizzler@ioe.edu.np",
  year: "1st Year",
  initials: "SS",
  imgSrc: "/assets/profile_picture.jpg",
};

const CREDENTIALS = [
  { label: "College", value: "Pulchowk Campus" },
  { label: "Stream", value: "BCT - Computer Eng." },
  { label: "Batch", value: "2080" },
  { label: "Semester", value: "1st Sem" },
];

const STATS = [
  { label: "Questions Replied", value: 12 },
  { label: "Questions Asked", value: 4 },
];

export default function AccountPage() {
  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: "#F8F7FA" }}
    >
      <div className="w-full max-w-103 flex flex-col min-h-screen pb-28">
        {/* ── Header ──────────────────────────────────────────────────────── */}
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
            Your Profile
          </span>
          <h1 className="text-3xl font-extrabold leading-none text-violet-900">
            Account
          </h1>
        </div>

        {/* ── Profile card ────────────────────────────────────────────────── */}
        <div
          className="mx-4 rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <ProfileHeader
            name={USER.name}
            email={USER.email}
            year={USER.year}
            initials={USER.initials}
            imgSrc={USER.imgSrc}
          />
        </div>

        {/* ── Stats row ───────────────────────────────────────────────────── */}
        <div
          className="mx-4 mt-4 rounded-2xl flex items-center"
          style={{
            background: "#fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <div
                  className="w-px self-stretch my-3"
                  style={{ background: "#ede9fe" }}
                />
              )}
              <div className="flex-1 flex flex-col items-center py-5">
                <span className="text-2xl font-extrabold text-violet-900">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* ── Academic card ───────────────────────────────────────────────── */}
        <div className="mt-4">
          <AcademicCard credentials={CREDENTIALS} />
        </div>

        {/* ── Actions menu ────────────────────────────────────────────────── */}
        <div className="mt-4">
          <ActionMenu
            items={[
              {
                label: "Saved Resources",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                label: "My Threads",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                label: "Sign Out",
                danger: true,
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
