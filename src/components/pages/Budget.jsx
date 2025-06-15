import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import BudgetWidget from '@/components/molecules/BudgetWidget';
import BookGrid from '@/components/organisms/BookGrid';
import { budgetService, bookService } from '@/services';

const Budget = () => {
  const [currentBudget, setCurrentBudget] = useState(null);
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    setLoading(true);
    try {
      const [current, history, allBooks] = await Promise.all([
        budgetService.getCurrentMonth(),
        budgetService.getAll(),
        bookService.getAll()
      ]);

      setCurrentBudget(current);
      setBudgetHistory(history.slice().reverse()); // Most recent first

      // Get book suggestions within remaining budget
      const remainingBudget = current.budgetAmount - current.spentAmount;
      const affordable = allBooks.filter(book => book.currentPrice <= remainingBudget);
      const shuffled = affordable.sort(() => 0.5 - Math.random()).slice(0, 8);
      setSuggestedBooks(shuffled);

      setNewBudgetAmount(current.budgetAmount.toString());
    } catch (error) {
      toast.error('Failed to load budget data');
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    try {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      const updated = await budgetService.updateBudget(currentMonth, amount);
      setCurrentBudget(updated);
      setShowUpdateModal(false);
      toast.success('Budget updated successfully!');
      
      // Refresh suggested books with new budget
      loadBudgetData();
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-card p-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="bg-white rounded-card p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBudget) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            Failed to load budget data
          </h2>
          <Button onClick={loadBudgetData} variant="primary">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const remainingBudget = Math.max(0, currentBudget.budgetAmount - currentBudget.spentAmount);
  const budgetPercentage = (currentBudget.spentAmount / currentBudget.budgetAmount) * 100;

  return (
    <div className="min-h-screen bg-surface-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-1">
              Budget Tracker
            </h1>
            <p className="text-gray-600">
              Manage your monthly book spending
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowUpdateModal(true)}
          >
            <ApperIcon name="Settings" size={16} />
            Update Budget
          </Button>
        </motion.div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Widget */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BudgetWidget
              budgetAmount={currentBudget.budgetAmount}
              spentAmount={currentBudget.spentAmount}
            />
          </motion.div>

          {/* Recent Purchases */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-card shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-gray-900">
                Recent Purchases
              </h3>
              <ApperIcon name="Receipt" size={20} className="text-primary" />
            </div>
            
            <div className="space-y-3">
              {currentBudget.purchases.length > 0 ? (
                currentBudget.purchases.slice(0, 5).map((purchase, index) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {purchase.bookTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(purchase.date).toLocaleDateString()} • {purchase.retailer}
                      </p>
                    </div>
                    <span className="font-semibold text-primary ml-2">
                      ₹{purchase.amount}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="ShoppingBag" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No purchases this month</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Budget Status Alert */}
        {budgetPercentage >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-card border ${
              budgetPercentage >= 100
                ? 'bg-error/5 border-error text-error'
                : 'bg-warning/5 border-warning text-warning'
            }`}
          >
            <div className="flex items-center gap-3">
              <ApperIcon 
                name={budgetPercentage >= 100 ? 'AlertTriangle' : 'AlertCircle'} 
                size={20} 
              />
              <div>
                <p className="font-medium">
                  {budgetPercentage >= 100 
                    ? 'Budget Exceeded!' 
                    : 'Approaching Budget Limit'
                  }
                </p>
                <p className="text-sm opacity-80">
                  You've spent {Math.round(budgetPercentage)}% of your monthly budget
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggested Books */}
        {remainingBudget > 0 && suggestedBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-card shadow-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <ApperIcon name="Lightbulb" className="text-accent" size={20} />
              <h2 className="text-xl font-heading font-semibold text-gray-900">
                Books Within Your Budget
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              You have ₹{remainingBudget} remaining. Here are some great books you can afford:
            </p>
            <BookGrid books={suggestedBooks} onWishlistChange={loadBudgetData} />
          </motion.div>
        )}

        {/* Budget History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
            Budget History
          </h2>
          <div className="space-y-3">
            {budgetHistory.map((budget, index) => {
              const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
              const monthName = new Date(budget.month + '-01').toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              });

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{monthName}</h4>
                      <span className="text-sm text-gray-500">
                        {budget.purchases.length} purchase{budget.purchases.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            percentage >= 100 ? 'bg-error' : 
                            percentage >= 80 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        ₹{budget.spentAmount} / ₹{budget.budgetAmount}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Update Budget Modal */}
        <AnimatePresence>
          {showUpdateModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowUpdateModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-card shadow-xl max-w-md w-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold">
                      Update Monthly Budget
                    </h3>
                    <button
                      onClick={() => setShowUpdateModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label="Monthly Budget Amount"
                      type="number"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                      placeholder="Enter amount in ₹"
                    />
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        💡 <strong>Tip:</strong> A good rule of thumb is to allocate 
                        ₹300-500 per book for paperbacks, and ₹150-250 for e-books.
                      </p>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowUpdateModal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleUpdateBudget}
                        className="flex-1"
                      >
                        Update Budget
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Budget;