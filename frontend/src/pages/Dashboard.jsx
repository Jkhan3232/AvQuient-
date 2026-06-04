import { CheckCircle2, ClipboardList, Loader2, Plus, Timer } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";

const TASK_LIMIT = 6;

const getErrorMessage = (error) => {
  if (!error.response) {
    return "Unable to reach API. Check VITE_API_URL, CORS, and deployment protection.";
  }

  const validationMessage = error.response?.data?.errors?.[0]?.message;
  return validationMessage || error.response.data?.message || "Unable to complete request.";
};

const useDebouncedValue = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
};

const statCards = [
  { key: "total", label: "Total", icon: ClipboardList, color: "text-sky-600 dark:text-sky-300" },
  { key: "pending", label: "Pending", icon: Timer, color: "text-amber-600 dark:text-amber-300" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-300" }
];

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: TASK_LIMIT, pages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const debouncedSearch = useDebouncedValue(search);

  const taskParams = useMemo(
    () => ({
      page,
      limit: TASK_LIMIT,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(status !== "all" ? { status } : {})
    }),
    [debouncedSearch, page, status]
  );

  const handleUnauthorized = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        logout();
        navigate("/login", { replace: true });
      }
    },
    [logout, navigate]
  );

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/tasks", { params: taskParams });
      setTasks(data.tasks);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (error) {
      handleUnauthorized(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized, taskParams]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (!isSubmitting) {
      setEditingTask(null);
      setIsFormOpen(false);
    }
  };

  const submitTask = async (values) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, values);
        toast.success("Task updated.");
      } else {
        await api.post("/tasks", values);
        toast.success("Task created.");
        setPage(1);
      }

      setIsFormOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (error) {
      handleUnauthorized(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTask = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    setBusyTaskId(task._id);
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Task deleted.");

      if (tasks.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchTasks();
      }
    } catch (error) {
      handleUnauthorized(error);
      toast.error(getErrorMessage(error));
    } finally {
      setBusyTaskId(null);
    }
  };

  const toggleTaskStatus = async (task, nextStatus) => {
    setBusyTaskId(task._id);
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
      toast.success(`Marked as ${nextStatus}.`);
      await fetchTasks();
    } catch (error) {
      handleUnauthorized(error);
      toast.error(getErrorMessage(error));
    } finally {
      setBusyTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-neutral-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{pagination.total} matching tasks</p>
          </div>

          <button className="btn-primary" type="button" onClick={openCreateForm}>
            <Plus size={18} />
            Add Task
          </button>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          {statCards.map(({ key, label, icon: Icon, color }) => (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900" key={key}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
                <Icon className={color} size={20} />
              </div>
              <p className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">{stats[key] || 0}</p>
            </div>
          ))}
        </section>

        <SearchBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} />

        <section className="mt-6">
          {isLoading ? (
            <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-center gap-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                <Loader2 className="animate-spin" size={20} />
                Loading tasks
              </div>
            </div>
          ) : tasks.length ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={openEditForm}
                    onDelete={deleteTask}
                    onToggleStatus={toggleTaskStatus}
                    isBusy={busyTaskId === task._id}
                  />
                ))}
              </div>

              <Pagination pagination={pagination} setPage={setPage} />
            </div>
          ) : (
            <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-4 text-center dark:border-neutral-700 dark:bg-neutral-900">
              <div>
                <ClipboardList className="mx-auto text-zinc-400 dark:text-zinc-500" size={36} />
                <h2 className="mt-3 text-lg font-bold text-zinc-950 dark:text-white">No tasks found</h2>
                <button className="btn-primary mt-5" type="button" onClick={openCreateForm}>
                  <Plus size={18} />
                  Add Task
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {isFormOpen ? (
        <TaskForm initialTask={editingTask} onClose={closeForm} onSubmit={submitTask} isSubmitting={isSubmitting} />
      ) : null}
    </div>
  );
};

export default Dashboard;
