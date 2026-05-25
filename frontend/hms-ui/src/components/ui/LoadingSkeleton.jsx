export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-8 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton h-4 w-24 mb-2 rounded" />
      <div className="skeleton h-8 w-16 rounded" />
    </div>
  )
}
