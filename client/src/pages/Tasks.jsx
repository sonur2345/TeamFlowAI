
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  X,
  Trash2,
  Pencil,
  CalendarDays,
  ListTodo,
} from "lucide-react";

import API from "../services/api";

function Tasks() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const initialFormData = {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch Tasks
  useEffect(() => {
    if (!projectId) return;

    const controller = new AbortController();

    const fetchTasks = async () => {
      try {
        const response = await API.get(
          `/tasks/project/${projectId}`,
          { signal: controller.signal }
        );

        setTasks(response.data.tasks || []);
        setError("");
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Fetch tasks error:", err);
          setError(
            err.response?.data?.message || "Failed to load tasks."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => controller.abort();
  }, [projectId]);

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset Form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingTaskId(null);
    setShowForm(false);
    setError("");
  };

  // Open Create Form
  const handleCreateClick = () => {
    setFormData(initialFormData);
    setEditingTaskId(null);
    setError("");
    setShowForm(true);
  };

  // Open Edit Form
  const handleEditTask = (task) => {
    setEditingTaskId(task._id);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const taskData = {
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null,
      };

      if (editingTaskId) {
        await API.put(`/tasks/${editingTaskId}`, taskData);
      } else {
        await API.post("/tasks", {
          ...taskData,
          projectId,
        });
      }

      // Refresh Tasks
      const response = await API.get(
        `/tasks/project/${projectId}`
      );

      setTasks(response.data.tasks || []);
      resetForm();
    } catch (err) {
      console.error("Save task error:", err);
      setError(
        err.response?.data?.message || "Failed to save task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Update Status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTask(taskId);
      setError("");

      await API.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  // Update Priority
  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      setUpdatingTask(taskId);
      setError("");

      await API.put(`/tasks/${taskId}`, {
        priority: newPriority,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, priority: newPriority }
            : task
        )
      );
    } catch (err) {
      console.error("Update priority error:", err);
      setError(
        err.response?.data?.message || "Failed to update priority."
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setUpdatingTask(taskId);
      setError("");

      await API.delete(`/tasks/${taskId}`);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );

      if (editingTaskId === taskId) {
        resetForm();
      }
    } catch (err) {
      console.error("Delete task error:", err);
      setError(
        err.response?.data?.message || "Failed to delete task."
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  // Status Icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="text-green-500" size={20} />;

      case "in-progress":
        return <Clock className="text-blue-500" size={20} />;

      default:
        return <Circle className="text-gray-400" size={20} />;
    }
  };

  // Status Label
  const getStatusLabel = (status) => {
    switch (status) {
      case "done":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "To Do";
    }
  };

  // Priority Color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  // Missing Project ID
  if (!projectId) {
    return (
      <div className="p-6 text-red-500">
        Project ID is missing.
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Project Tasks
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and track your project tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5">
          <AlertCircle size={18} />

          <span className="text-sm">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Create / Edit Form Card */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6 shadow-sm">

          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <ListTodo className="text-blue-600" size={22} />

              <h2 className="text-lg font-semibold text-gray-800">
                {editingTaskId ? "Edit Task" : "Create New Task"}
              </h2>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="text-gray-500 hover:text-red-500 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                maxLength={100}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows={3}
                maxLength={1000}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <CalendarDays size={16} />
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg"
              >
                {submitting
                  ? "Saving..."
                  : editingTaskId
                    ? "Save Changes"
                    : "Create Task"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Task Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Total Tasks: <strong>{tasks.length}</strong>
        </p>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <Circle className="mx-auto text-gray-300 mb-3" size={40} />

          <h3 className="font-semibold text-gray-700">
            No tasks found
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Create your first task to get started.
          </p>

          {!showForm && (
            <button
              type="button"
              onClick={handleCreateClick}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Create Your First Task
            </button>
          )}
        </div>

      ) : (

        <div className="space-y-3">

          {tasks.map((task) => (

            <div
              key={task._id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
            >

              <div className="flex items-start gap-3">

                <div className="mt-1">
                  {getStatusIcon(task.status)}
                </div>

                <div className="flex-1 min-w-0">

                  {/* Task Title */}
                  <h3 className="font-semibold text-gray-800 break-words">
                    {task.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mt-1 whitespace-pre-wrap">
                    {task.description || "No description"}
                  </p>

                  {/* Task Information */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">

                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {getStatusLabel(task.status)}
                    </span>

                    <span
                      className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority} priority
                    </span>

                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}

                  </div>

                  {/* Task Controls */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">

                    {/* Status */}
                    <select
                      value={task.status}
                      disabled={updatingTask === task._id}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>

                    {/* Priority */}
                    <select
                      value={task.priority}
                      disabled={updatingTask === task._id}
                      onChange={(e) =>
                        handlePriorityChange(task._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleEditTask(task)}
                      disabled={updatingTask === task._id || submitting}
                      className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={updatingTask === task._id || submitting}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Tasks;

