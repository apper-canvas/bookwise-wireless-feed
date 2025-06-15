import { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={focused ? placeholder : ''}
        className={`
          w-full px-4 py-3 border rounded-lg transition-all duration-200
          bg-white focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-error' : 'border-gray-200 focus:border-primary'}
          ${label ? 'pt-6' : ''}
        `}
        {...props}
      />
      
      {label && (
        <motion.label
          animate={{
            top: focused || hasValue ? '8px' : '12px',
            fontSize: focused || hasValue ? '12px' : '16px',
            color: focused ? '#9B7EBD' : error ? '#E76F51' : '#6B7280'
          }}
          className="absolute left-4 pointer-events-none transition-all duration-200"
        >
          {label}
        </motion.label>
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;