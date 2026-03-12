import React from "react";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
  pageSize?: number;
}

const Pagination: React.FC<PaginationProps> = ({ current, total, onChange, pageSize }) => {
  if (total <= 1) return null;

  const prev = () => onChange(Math.max(1, current - 1));
  const next = () => onChange(Math.min(total, current + 1));

  return (
    <div className="mt-auto pt-2 flex justify-between items-center text-sm">
      <button
        onClick={prev}
        disabled={current === 1}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        « Prev
      </button>
      <span>
        {pageSize !== undefined && <>{pageSize} items por página · </>}
        Página {current} de {total}
      </span>
      <button
        onClick={next}
        disabled={current === total}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next »
      </button>
    </div>
  );
};

export default Pagination;
