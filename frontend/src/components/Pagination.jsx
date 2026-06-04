import { ChevronLeft, ChevronRight } from "lucide-react";

const getVisiblePages = (currentPage, totalPages) => {
  const visibleCount = Math.min(totalPages, 5);
  let start = Math.max(currentPage - 2, 1);
  const end = Math.min(start + visibleCount - 1, totalPages);
  start = Math.max(end - visibleCount + 1, 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const Pagination = ({ pagination, setPage }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  const pages = getVisiblePages(pagination.page, pagination.pages);

  return (
    <nav className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-neutral-800 sm:flex-row">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {pagination.page} of {pagination.pages}
      </p>

      <div className="flex items-center gap-2">
        <button
          className="icon-button"
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => setPage((page) => Math.max(page - 1, 1))}
          title="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((page) => (
          <button
            className={`h-9 min-w-9 rounded-md px-3 text-sm font-semibold transition ${
              page === pagination.page
                ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-neutral-950"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-zinc-200 dark:hover:bg-neutral-800"
            }`}
            type="button"
            key={page}
            onClick={() => setPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="icon-button"
          type="button"
          disabled={pagination.page >= pagination.pages}
          onClick={() => setPage((page) => Math.min(page + 1, pagination.pages))}
          title="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
