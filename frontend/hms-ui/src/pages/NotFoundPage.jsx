import { Link } from 'react-router-dom'
import { HiHome } from 'react-icons/hi'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-blue-600 dark:text-blue-500 opacity-20 select-none leading-none">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 -mt-4">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-4 mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <HiHome size={18} /> Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
