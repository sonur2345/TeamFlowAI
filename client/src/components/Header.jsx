
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Command,
  HelpCircle
} from "lucide-react";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || "User";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:h-[76px] lg:px-8">

      {/* Left: Breadcrumb */}
      <div className="hidden min-w-0 items-center gap-2 md:flex">
        <span className="text-sm text-slate-400">Workspace</span>
        <span className="text-slate-300">/</span>
        <span className="truncate text-sm font-semibold text-slate-800">
          Overview
        </span>
      </div>

      {/* Mobile Search */}
      <button
        type="button"
        aria-label="Search"
        className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 md:hidden"
      >
        <Search size={19} />
      </button>

      {/* Search */}
      <div className="hidden w-full max-w-[360px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 md:flex">
        <Search size={18} className="shrink-0 text-slate-400" />

        <input
          type="search"
          placeholder="Search anything..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <div className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-medium text-slate-400">
          <Command size={11} />
          K
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Help */}
        <button
          type="button"
          aria-label="Help"
          className="hidden rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:block"
        >
          <HelpCircle size={19} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <Bell size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
        </button>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-indigo-500/20">
            {initial}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
              {userName}
            </p>
            <p className="max-w-[130px] truncate text-[11px] text-slate-400">
              {user?.email || "Team Member"}
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:px-3.5"
        >
          <LogOut size={17} />
          <span className="hidden lg:inline">Logout</span>
        </button>

      </div>
    </header>
  );
}

export default Header;


