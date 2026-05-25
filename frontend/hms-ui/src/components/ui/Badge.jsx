const variants = {
  success: 'badge-green',
  danger: 'badge-red',
  warning: 'badge-yellow',
  info: 'badge-blue',
  gray: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

export default function Badge({ children, variant = 'info' }) {
  return <span className={variants[variant]}>{children}</span>
}
