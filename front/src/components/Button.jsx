const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false, 
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-300",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3"
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      )}
      {children}
    </button>
  )
}

export default Button