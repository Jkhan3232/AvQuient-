import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const defaultValues = {
  title: "",
  description: "",
  status: "pending"
};

const TaskForm = ({ initialTask, onClose, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: initialTask || defaultValues
  });

  useEffect(() => {
    reset(
      initialTask
        ? {
            title: initialTask.title,
            description: initialTask.description || "",
            status: initialTask.status
          }
        : defaultValues
    );
  }, [initialTask, reset]);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-neutral-950/50 p-0 sm:items-center sm:p-4">
      <div className="w-full rounded-t-lg border border-zinc-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:max-w-xl sm:rounded-lg sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">{initialTask ? "Edit Task" : "Add Task"}</h2>
          <button className="icon-button" type="button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              className="input-field"
              type="text"
              {...register("title", {
                required: "Title is required.",
                minLength: { value: 2, message: "Title must be at least 2 characters." },
                maxLength: { value: 120, message: "Title cannot exceed 120 characters." }
              })}
            />
            {errors.title ? <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">{errors.title.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="task-description">
              Description
            </label>
            <textarea
              id="task-description"
              className="input-field min-h-32 resize-y"
              {...register("description", {
                maxLength: { value: 2000, message: "Description cannot exceed 2000 characters." }
              })}
            />
            {errors.description ? (
              <p className="mt-1 text-sm text-rose-600 dark:text-rose-300">{errors.description.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200" htmlFor="task-status">
              Status
            </label>
            <select id="task-status" className="input-field" {...register("status")}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button className="btn-secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {initialTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
