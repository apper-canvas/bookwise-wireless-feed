import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import BudgetWidget from '@/components/molecules/BudgetWidget';
import DealsCarousel from '@/components/organisms/DealsCarousel';
import BookGrid from '@/components/organisms/BookGrid';
import { bookService, budgetService, userPreferencesService } from '@/services';

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [deals, setDeals] = useState([]);
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [userPrefs, currentBudget, dealsData] = await Promise.all([
        userPreferencesService.get(),
        budgetService.getCurrentMonth(),
        bookService.getDeals()
      ]);

      setBudgetInfo(currentBudget);
      setDeals(dealsData.slice(0, 8));

      // Get recommendations based on preferences and remaining budget
      const remainingBudget = currentBudget.budgetAmount - currentBudget.spentAmount;
      const recommendationsData = await bookService.getRecommendations({
        ...userPrefs,
        priceRange: { min: 0, max: remainingBudget }
      });
      
      setRecommendations(recommendationsData);
    } catch (error) {
      toast.error('Failed to load recommendations');
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchQuery('');
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      const results = await bookService.search(query);
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
    setIsSearching(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-12 bg-white rounded-card mb-6" />
          </div>
          
          {/* Budget Widget Skeleton */}
          <div className="animate-pulse bg-white rounded-card p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto" />
          </div>
          
          {/* Content Skeletons */}
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-card p-6">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-3">
                      <div className="h-48 bg-gray-200 rounded-card" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Welcome back! 📚
          </h1>
          <p className="text-gray-600">
            Discover your next favorite book within budget
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search books, authors, genres..."
          />
        </motion.div>

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-card shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold">
                Search Results for "{searchQuery}"
              </h2>
              <button
                onClick={clearSearch}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <BookGrid 
              books={searchResults} 
              loading={isSearching}
              onWishlistChange={loadHomeData}
            />
          </motion.div>
        )}

        {!searchQuery && (
          <>
            {/* Budget Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {budgetInfo && (
                <BudgetWidget
                  budgetAmount={budgetInfo.budgetAmount}
                  spentAmount={budgetInfo.spentAmount}
                />
              )}
            </motion.div>

            {/* Today's Deals */}
            {deals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <DealsCarousel 
                  books={deals} 
                  title="🔥 Today's Best Deals"
                />
              </motion.div>
            )}

            {/* Personalized Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-card shadow-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="Sparkles" className="text-primary" size={20} />
                <h2 className="text-xl font-heading font-semibold text-gray-900">
                  Picked Just for You
                </h2>
              </div>
              <BookGrid 
                books={recommendations} 
                onWishlistChange={loadHomeData}
              />
            </motion.div>

            {/* Quick Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-card shadow-card p-6"
            >
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Romance', icon: 'Heart', color: 'text-pink-500 bg-pink-50' },
                  { name: 'Mystery', icon: 'Search', color: 'text-purple-500 bg-purple-50' },
                  { name: 'Self-Help', icon: 'TrendingUp', color: 'text-green-500 bg-green-50' },
                  { name: 'Fiction', icon: 'BookOpen', color: 'text-blue-500 bg-blue-50' }
                ].map((category, index) => (
                  <motion.button
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-card border border-gray-200 hover:border-primary/30 transition-all text-center group"
                  >
                    <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      <ApperIcon name={category.icon} size={20} />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;