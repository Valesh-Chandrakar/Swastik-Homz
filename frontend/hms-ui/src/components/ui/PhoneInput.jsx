import { useState, useEffect } from 'react'

/**
 * Strict 10-digit phone number input.
 * - Strips any non-digit characters
 * - Enforces max length of 10
 * - Shows inline validation feedback
 *
 * Props:
 *   value      — string
 *   onChange   — callback(digitsOnlyString)
 *   placeholder
 *   required
 *   className
 *   label      — optional, displays a label above the input
 */
export default function PhoneInput({
  value = '',
  onChange,
  placeholder = '10-digit number',
  required = false,
  className = '',
  label,
  id,
}) {
  const [error, setError] = useState('')

  useEffect(() => {
    if (!value) setError('')
    else if (value.length < 10) setError('Phone must be exactly 10 digits')
    else if (!/^[6-9][0-9]{9}$/.test(value)) setError('Indian mobile numbers start with 6–9')
    else setError('')
  }, [value])

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(digits)
  }

  return (
    <div>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        pattern="[6-9][0-9]{9}"
        className={`input ${error ? 'border-red-400 focus:ring-red-300' : ''} ${className}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {!error && value.length === 10 && <p className="text-xs text-green-600 mt-1">✓ Valid mobile number</p>}
    </div>
  )
}
