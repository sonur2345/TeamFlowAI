
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Plus,
  HelpCircle,
  // Command
} from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const mainMenu = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Projects", icon: FolderKanban, path: null },
    { name: "My Tasks", icon: CheckSquare, path: null },
    { name: "Team Members", icon: Users, path: null },
  ];

  const closeMenu = () => setIsOpen(false);

  const navLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-500/15 text-white shadow-inner shadow-indigo-500/10"
        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
    }`;

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex h-[76px] items-center justify-between border-b border-white/[0.08] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 shadow-lg shadow-indigo-900/40">
            <Sparkles size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-[17px] font-bold tracking-tight text-white">
              TeamFlow <span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[2px] text-slate-500">
              Workspace
            </p>
          </div>
        </div>

        <button
          onClick={closeMenu}
          aria-label="Close sidebar"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Workspace Switcher */}
      <div className="px-4 pb-5 pt-5">
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.08]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
            T
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              Team Workspace
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Free workspace
            </p>
          </div>

          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-slate-500">
          Main Menu
        </p>

        {mainMenu.map((item) => {
          const Icon = item.icon;

          if (!item.path) {
            return (
              <button
                key={item.name}
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm text-slate-500 opacity-70"
                title="Coming soon"
              >
                <Icon size={19} />
                <span>{item.name}</span>
                <span className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px]">
                  Soon
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end
              onClick={closeMenu}
              className={navLinkClass}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={
                      isActive
                        ? "text-indigo-300"
                        : "text-slate-500 group-hover:text-slate-200"
                    }
                  />
                  <span>{item.name}</span>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Projects section */}
        <div className="flex items-center justify-between px-3 pb-2 pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-slate-500">
            Your Workspace
          </p>
          <button
            type="button"
            disabled
            title="Project creation is available from the dashboard"
            className="rounded-md p-1 text-slate-500 hover:bg-white/10 hover:text-white"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center">
          <FolderKanban
            size={21}
            className="mx-auto mb-2 text-slate-500"
          />
          <p className="text-xs font-medium text-slate-400">
            Your projects
          </p>
          <p className="mt-1 text-[10px] text-slate-600">
            Manage projects from Overview
          </p>
        </div>
      </nav>

      {/* Bottom */}
      <div className="space-y-2 border-t border-white/[0.08] p-4">
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
        >
          <HelpCircle size={18} />
          Help & Support
        </button>

        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400"
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="rounded-xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 to-blue-500/5 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={15} className="text-indigo-300" />
            <span className="text-xs font-semibold text-indigo-100">
              AI Workspace
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Smarter project management is coming soon.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="font-bold text-slate-900">
            TeamFlow <span className="text-indigo-600">AI</span>
          </span>
        </div>

        <div className="w-9" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col bg-[#111827] lg:sticky lg:top-0 lg:flex lg:h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        >
          <aside
            className="flex h-full w-[280px] max-w-[85vw] flex-col bg-[#111827] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;

