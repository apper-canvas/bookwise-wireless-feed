import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white shadow-md hover:shadow-lg disabled:bg-gray-300",
    secondary: "bg-secondary text-white shadow-md hover:shadow-lg disabled:bg-gray-300",
    accent: "bg-accent text-white shadow-md hover:shadow-lg disabled:bg-gray-300",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white disabled:border-gray-300 disabled:text-gray-300",
    ghost: "text-primary bg-transparent hover:bg-primary/10 disabled:text-gray-300"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;