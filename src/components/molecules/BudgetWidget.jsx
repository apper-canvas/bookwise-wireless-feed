import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const BudgetWidget = ({ 
  budgetAmount = 1000, 
  spentAmount = 0, 
  className = '' 
}) => {
  const remainingAmount = Math.max(0, budgetAmount - spentAmount);
  const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getStatusMessage = () => {
    if (percentage >= 100) return 'Budget exceeded';
    if (percentage >= 90) return 'Almost at limit';
    if (percentage >= 70) return 'Getting close';
    return 'Looking good';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-card shadow-card p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-gray-900">Monthly Budget</h3>
        <ApperIcon name="PiggyBank" size={20} className="text-primary" />
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={percentage >= 90 ? '#E76F51' : percentage >= 70 ? '#F4A261' : '#7FB069'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              ₹{remainingAmount}
            </span>
            <span className="text-sm text-gray-500">remaining</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium">₹{spentAmount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Budget</span>
          <span className="font-medium">₹{budgetAmount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusMessage()}
          </span>
        </div>
      </div>

      {remainingAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-primary/5 rounded-lg"
        >
          <p className="text-sm text-primary">
            💡 You can buy {Math.floor(remainingAmount / 300)} more books under ₹300
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BudgetWidget;