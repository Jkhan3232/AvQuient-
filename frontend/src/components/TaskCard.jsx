import { CheckCircle2, Clock3, Edit3, Trash2 } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, isBusy }) => {
  const isCompleted = task.status === "completed";
  const nextStatus = isCompleted ? "pending" : "completed";
  const createdDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <article className="flex min-h-56 flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-base font-bold text-zinc-950 dark:text-white">{task.title}</h3>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{createdDate}</p>
        </div>

        <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold capitalize ${statusStyles[task.status]}`}>
          {task.status}
        </span>
      </div>

      <p className="line-clamp-5 flex-1 break-words text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {task.description || "No description added."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-neutral-800">
        <button
          className="btn-secondary px-3"
          type="button"
          disabled={isBusy}
          onClick={() => onToggleStatus(task, nextStatus)}
          title={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          {isCompleted ? <Clock3 size={17} /> : <CheckCircle2 size={17} />}
          <span className="hidden min-[420px]:inline">{isCompleted ? "Pending" : "Complete"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button className="icon-button" type="button" disabled={isBusy} onClick={() => onEdit(task)} title="Edit task">
            <Edit3 size={17} />
          </button>
          <button className="icon-button text-rose-600 dark:text-rose-300" type="button" disabled={isBusy} onClick={() => onDelete(task)} title="Delete task">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
