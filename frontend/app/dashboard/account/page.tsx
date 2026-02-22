import React from "react";
import {
  ChevronLeft,
  Settings,
  Bookmark,
  MessageSquare,
  Users,
  LogOut,
} from "lucide-react";
import Image from "next/image";

const AccountPage = () => {
  return (
    <div className="min-h-dvh bg-[#F9FAFB] flex flex-col items-center w-full">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center mt-16 mb-6">
        <div className="relative">
          <span className="block rounded-full border-4 border-[#BDB2FF] p-1">
            <Image
              src="/assets/profile_picture.jpg"
              alt="Profile Picture"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          </span>
        </div>
        <div className="mt-3 text-2xl font-bold text-gray-900">
          Sizzler Sahikarmi
        </div>
        <div className="text-sm text-gray-500">sizzler@ioe.edu.np</div>
        <div className="mt-2">
          <span className="px-3 py-1 rounded-full bg-[#F3F0FF] text-[#BDB2FF] text-xs font-semibold">
            1st Year
          </span>
        </div>
      </div>

      {/* Academic Credentials Card */}
      <div className="w-[90%] max-w-sm bg-white rounded-2xl shadow-sm border border-[#F3F0FF] mb-6">
        <div className="px-5 pt-4 pb-2 text-xs text-gray-400 font-semibold">
          Academic Profile
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 px-5 pb-4">
          <div>
            <div className="text-xs text-gray-400">College</div>
            <div className="font-bold text-gray-900">Pulchowk Campus</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Stream</div>
            <div className="font-bold text-gray-900">BCT - Computer Eng.</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Batch</div>
            <div className="font-bold text-gray-900">2080</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Semester</div>
            <div className="font-bold text-gray-900">1st Sem</div>
          </div>
        </div>
      </div>

      {/* App Stats Row */}
      <div className="w-[90%] max-w-sm flex justify-between items-center mb-6">
        <div className="flex-1 flex flex-col items-center">
          <div className="font-bold text-lg text-gray-900">12</div>
          <div className="text-[11px] text-gray-400">Questions Replied</div>
        </div>
        <div className="w-px h-8 bg-gray-200 mx-2" />
        <div className="flex-1 flex flex-col items-center">
          <div className="font-bold text-lg text-gray-900">4</div>
          <div className="text-[11px] text-gray-400">Questions Asked</div>
        </div>
      </div>

      {/* Action Menu */}
      <div className="w-[90%] max-w-sm bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-8">
        <button className="w-full flex items-center px-5 py-4 text-left hover:bg-[#F3F0FF]">
          <Bookmark className="w-5 h-5 text-[#BDB2FF] mr-4" />
          <span className="flex-1 text-gray-900 font-medium">
            Saved Resources
          </span>
          <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
        </button>
        <button className="w-full flex items-center px-5 py-4 text-left hover:bg-[#F3F0FF]">
          <MessageSquare className="w-5 h-5 text-[#BDB2FF] mr-4" />
          <span className="flex-1 text-gray-900 font-medium">My Threads</span>
          <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
        </button>

        <div className="h-px bg-gray-100 mx-5" />
        <button className="w-full flex items-center px-5 py-4 text-left hover:bg-[#F9FAFB]">
          <LogOut className="w-5 h-5 text-red-400 mr-4" />
          <span className="flex-1 text-gray-900 font-medium">Sign Out</span>
          <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
