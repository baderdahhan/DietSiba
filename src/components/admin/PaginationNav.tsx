import Link from 'next/link';

export function PaginationNav({
  page,
  pageSize,
  total,
  basePath,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const linkClass =
    'px-3 py-1.5 rounded border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50';
  const disabledClass =
    'px-3 py-1.5 rounded border border-gray-100 bg-gray-50 text-sm text-gray-300 cursor-default';

  return (
    <div className="flex items-center justify-between mt-4">
      {page > 1 ? (
        <Link href={`${basePath}?page=${page - 1}`} prefetch={false} className={linkClass}>
          ← Previous
        </Link>
      ) : (
        <span className={disabledClass}>← Previous</span>
      )}
      <span className="text-xs text-gray-500">
        Page {page} of {totalPages} · {total} total
      </span>
      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} prefetch={false} className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}
    </div>
  );
}

/** Parse and clamp a `?page=` query value to a sane 1-based page number. */
export function parsePage(value: string | string[] | undefined): number {
  const n = parseInt(Array.isArray(value) ? value[0] : value || '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
