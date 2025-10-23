const Input = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false,
  step,
  min,
  prefix,
  ...props 
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          min={min}
          className={`w-full ${prefix ? 'pl-8' : 'pl-4'} pr-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400`}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  )
}

export default Input