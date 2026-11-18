
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  ListTodo,
  PlayCircle,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  RefreshCw
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [counts, setCounts] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const projectResponse = await API.get("/projects", {
          signal: controller.signal,
        });

        const projectList = projectResponse.data.projects || [];

        if (controller.signal.aborted) return;

        setProjects(projectList);

        const taskResponses = await Promise.all(
          projectList.map(async (project) => {
            try {
              const response = await API.get(
                `/tasks/project/${project._id}`,
                { signal: controller.signal }
              );

              return response.data.tasks || [];
            } catch (err) {
              if (controller.signal.aborted) throw err;

              console.error("Task fetch error:", err);
              return [];
            }
          })
        );

        if (controller.signal.aborted) return;

        const allTasks = taskResponses.flat();

        const completed = allTasks.filter(
          (task) => task.status === "done"
        ).length;

        const inProgress = allTasks.filter(
          (task) => task.status === "in-progress"
        ).length;

        const pending = allTasks.filter(
          (task) => task.status === "todo"
        ).length;

        setCounts({
          totalProjects: projectList.length,
          totalTasks: allTasks.length,
          completedTasks: completed,
          inProgressTasks: inProgress,
          pendingTasks: pending,
        });
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Dashboard error:", err);
          setError(
            err.response?.data?.message ||
            "Unable to load dashboard data."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => controller.abort();
  }, []);

  const stats = [
    {
      title: "Total Projects",
      value: counts.totalProjects,
      subtitle: "Projects in workspace",
      icon: FolderKanban,
      color: "indigo",
    },
    {
      title: "Total Tasks",
      value: counts.totalTasks,
      subtitle: "Across all projects",
      icon: ListTodo,
      color: "blue",
    },
    {
      title: "Completed",
      value: counts.completedTasks,
      subtitle: "Successfully finished",
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      title: "In Progress",
      value: counts.inProgressTasks,
      subtitle: "Currently active",
      icon: PlayCircle,
      color: "violet",
    },
    {
      title: "Pending Tasks",
      value: counts.pendingTasks,
      subtitle: "Waiting to start",
      icon: Clock3,
      color: "amber",
    },
  ];

  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const getStatusStyle = (status) => {
    const styles = {
      planning: "bg-slate-100 text-slate-600",
      "in-progress": "bg-blue-50 text-blue-700",
      completed: "bg-emerald-50 text-emerald-700",
    };

    return styles[status] || styles.planning;
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      low: "bg-slate-100 text-slate-600",
      medium: "bg-amber-50 text-amber-700",
      high: "bg-rose-50 text-rose-700",
    };

    return styles[priority] || styles.medium;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] lg:flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="min-w-0 flex-1 pt-14 lg:pt-0">

        <Header />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">

          {/* Welcome Section */}
          <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Workspace Overview
                </p>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-500 sm:flex">
                <Sparkles size={15} className="text-indigo-500" />
                TeamFlow AI Workspace
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              <AlertCircle size={20} />
              <p className="flex-1 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1 text-xs font-semibold hover:underline"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {/* Statistics Heading */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Project Statistics
            </h2>
            <span className="text-xs text-slate-400">
              Live workspace data
            </span>
          </div>

          {/* Statistics Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorStyles[item.color]}`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                      {loading ? "—" : item.value}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Projects Section */}
          <section className="mt-8">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Projects
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage and track your ongoing work.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                <FolderKanban size={15} />
                {loading ? "Loading..." : `${projects.length} Projects`}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 h-10 w-10 rounded-xl bg-slate-100" />
                    <div className="mb-3 h-4 w-2/3 rounded bg-slate-100" />
                    <div className="mb-5 h-3 w-full rounded bg-slate-100" />
                    <div className="h-2 w-full rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && projects.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <FolderKanban size={27} className="text-indigo-500" />
                </div>

                <h3 className="font-semibold text-slate-800">
                  No projects yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Your projects will appear here once you create them.
                </p>
              </div>
            )}

            {/* Project Cards */}
            {!loading && projects.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}/tasks`}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 text-indigo-600">
                        <FolderKanban size={22} />
                      </div>

                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(project.status)}`}>
                        {(project.status || "planning").replace("-", " ")}
                      </span>
                    </div>

                    <div className="mt-5">
                      <h3 className="truncate text-base font-bold text-slate-800 transition group-hover:text-indigo-600">
                        {project.name}
                      </h3>

                      <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                        {project.description || "No project description available."}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <span className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize ${getPriorityStyle(project.priority)}`}>
                        {project.priority || "medium"} priority
                      </span>

                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition group-hover:gap-2">
                        View Tasks
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Bottom Info */}
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <Sparkles size={22} className="text-indigo-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Work smarter with TeamFlow AI
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Your project management workspace is getting smarter. AI-powered task suggestions are coming soon.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;

