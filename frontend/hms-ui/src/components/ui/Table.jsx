export function Table({ headers, children, loading, emptyMessage = 'No data found' }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="table-header">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="py-8 text-center">
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </td>
            </tr>
          ) : children}
        </tbody>
      </table>
      {!loading && !children && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">{emptyMessage}</div>
      )}
    </div>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`table-cell ${className}`}>{children}</td>
}
