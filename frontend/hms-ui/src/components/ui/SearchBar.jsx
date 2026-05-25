import { HiSearch } from 'react-icons/hi'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 w-64"
      />
    </div>
  )
}
