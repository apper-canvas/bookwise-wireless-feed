import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    genres: initialFilters.genres || [],
    priceRange: initialFilters.priceRange || { min: 0, max: 1000 },
    format: initialFilters.format || [],
    rating: initialFilters.rating || 0,
    sortBy: initialFilters.sortBy || 'relevance'
  });

  const genres = [
    'Contemporary Fiction', 'Romance', 'Mystery', 'Thriller',
    'Self-Help', 'Biography', 'Fantasy', 'Historical Fiction',
    'Non-fiction', 'Psychology', 'Business', 'Health'
  ];

  const formats = ['Paperback', 'Hardcover', 'Kindle', 'Audiobook'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  const handleGenreToggle = (genre) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleFormatToggle = (format) => {
    setFilters(prev => ({
      ...prev,
      format: prev.format.includes(format)
        ? prev.format.filter(f => f !== format)
        : [...prev.format, format]
    }));
  };

  const handlePriceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      genres: [],
      priceRange: { min: 0, max: 1000 },
      format: [],
      rating: 0,
      sortBy: 'relevance'
    });
  };

  const getActiveFiltersCount = () => {
    return filters.genres.length + 
           filters.format.length + 
           (filters.rating > 0 ? 1 : 0) +
           (filters.sortBy !== 'relevance' ? 1 : 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-semibold">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="primary" size="small">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Sort By */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <motion.button
                      key={genre}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        filters.genres.includes(genre)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                      }`}
                    >
                      {genre}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Format</h3>
                <div className="flex flex-wrap gap-2">
                  {formats.map(format => (
                    <motion.button
                      key={format}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFormatToggle(format)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        filters.format.includes(format)
                          ? 'bg-secondary text-white border-secondary'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-secondary'
                      }`}
                    >
                      {format}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters(prev => ({ ...prev, rating }))}
                      className="p-1"
                    >
                      <ApperIcon 
                        name="Star" 
                        size={20}
                        className={`${
                          rating <= filters.rating
                            ? 'text-accent fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApply}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;