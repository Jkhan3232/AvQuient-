import { Search, SlidersHorizontal, X } from "lucide-react";

const SearchBar = ({ search, setSearch, status, setStatus }) => {
  const hasFilters = search || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          className="input-field pl-10"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks by title"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative min-w-40 flex-1 sm:flex-none">
          <SlidersHorizontal
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <select className="input-field appearance-none pl-10" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {hasFilters ? (
          <button className="icon-button shrink-0" type="button" onClick={clearFilters} title="Clear filters">
            <X size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
