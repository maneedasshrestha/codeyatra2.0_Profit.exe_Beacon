import { Bell } from "lucide-react";

const TopBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-white via-gray-50 to-white shadow-lg mb-6 rounded-3xl">
      <div className="flex items-center">
        <span className="font-extrabold text-xl tracking-tight text-gray-900">
          Beacon
        </span>
      </div>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-700" />
      </button>
    </nav>
  );
};

export default TopBar;
