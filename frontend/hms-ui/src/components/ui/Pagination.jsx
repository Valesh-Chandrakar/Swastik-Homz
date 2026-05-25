import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">Page {page + 1} of {totalPages}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = Math.max(0, Math.min(page - 2, totalPages - 5)) + i
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                pageNum === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {pageNum + 1}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
