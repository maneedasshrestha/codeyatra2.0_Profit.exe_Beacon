"use client";
import { useRouter } from "next/navigation";
import ProfileHeader from "../components/account/ProfileHeader";
import AcademicCard from "../components/account/AcademicCard";
import ActionMenu from "../components/account/ActionMenu";
import HeaderSection from "../components/account/HeaderSection";
import StatsRow from "../components/account/StatsRow";
import { USER, CREDENTIALS, STATS } from "./mockData";
import {
  SavedResourcesIcon,
  MyThreadsIcon,
  SignOutIcon,
} from "../components/account/AccountMenuIcons";
import TopBarAccount from "../components/TopBarAccount";

export default function AccountPage() {
  const router = useRouter();
  return (
    <>
      <TopBarAccount />
      <div
        className="min-h-screen w-full flex justify-center"
        style={{ background: "#F8F7FA" }}
      >
        <div className="w-full max-w-103 flex flex-col min-h-screen pb-28">
          <HeaderSection title="Account" subtitle="Your Profile" />

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

          <StatsRow stats={STATS} />

          <div className="mt-4">
            <AcademicCard credentials={CREDENTIALS} />
          </div>

          <div className="mt-4">
            <ActionMenu
              items={[
                {
                  label: "Saved Resources",
                  icon: <SavedResourcesIcon />,
                },
                {
                  label: "My Threads",
                  icon: <MyThreadsIcon />,
                },
                {
                  label: "Sign Out",
                  danger: true,
                  onClick: () => router.push("/setup/login"),
                  icon: <SignOutIcon />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
