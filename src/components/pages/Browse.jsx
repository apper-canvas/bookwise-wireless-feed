import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPanel from '@/components/molecules/FilterPanel';
import BookGrid from '@/components/organisms/BookGrid';
import { bookService } from '@/services';

const Browse = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    priceRange: { min: 0, max: 1000 },
    format: [],
    rating: 0,
    sortBy: 'relevance'
  });

  const categories = [
    { name: 'All Books', icon: 'BookOpen', filter: null },
    { name: 'Best Deals', icon: 'Tag', filter: 'deals' },
    { name: 'Under ₹300', icon: 'IndianRupee', filter: 'under300' },
    { name: 'New Releases', icon: 'Sparkles', filter: 'new' },
    { name: 'Trending', icon: 'TrendingUp', filter: 'trending' },
    { name: 'Romance', icon: 'Heart', filter: 'romance' },
    { name: 'Mystery', icon: 'Search', filter: 'mystery' },
    { name: 'Self-Help', icon: 'Target', filter: 'self-help' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All Books');

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [books, activeFilters, searchQuery, selectedCategory]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const allBooks = await bookService.getAll();
      setBooks(allBooks);
    } catch (error) {
      toast.error('Failed to load books');
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...books];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genres.some(genre => genre.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All Books') {
      const categoryMap = {
        'Best Deals': () => filtered.filter(book => book.originalPrice && book.currentPrice < book.originalPrice),
        'Under ₹300': () => filtered.filter(book => book.currentPrice <= 300),
        'New Releases': () => filtered.slice().sort((a, b) => new Date(b.publishDate || '2024-01-01') - new Date(a.publishDate || '2024-01-01')),
        'Trending': () => filtered.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0)),
        'Romance': () => filtered.filter(book => book.genres.some(genre => genre.toLowerCase().includes('romance'))),
        'Mystery': () => filtered.filter(book => book.genres.some(genre => genre.toLowerCase().includes('mystery'))),
        'Self-Help': () => filtered.filter(book => book.genres.some(genre => genre.toLowerCase().includes('self-help')))
      };

      if (categoryMap[selectedCategory]) {
        filtered = categoryMap[selectedCategory]();
      }
    }

    // Apply genre filters
    if (activeFilters.genres.length > 0) {
      filtered = filtered.filter(book =>
        book.genres.some(genre =>
          activeFilters.genres.some(filterGenre =>
            genre.toLowerCase().includes(filterGenre.toLowerCase())
          )
        )
      );
    }

    // Apply price range filter
    filtered = filtered.filter(book =>
      book.currentPrice >= activeFilters.priceRange.min &&
      book.currentPrice <= activeFilters.priceRange.max
    );

    // Apply format filter
    if (activeFilters.format.length > 0) {
      filtered = filtered.filter(book =>
        activeFilters.format.includes(book.format)
      );
    }

    // Apply rating filter
    if (activeFilters.rating > 0) {
      filtered = filtered.filter(book =>
        (book.rating || 0) >= activeFilters.rating
      );
    }

    // Apply sorting
    switch (activeFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishDate || '2024-01-01') - new Date(a.publishDate || '2024-01-01'));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory('All Books'); // Reset category when searching
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchQuery(''); // Clear search when selecting category
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const getActiveFiltersCount = () => {
    return activeFilters.genres.length + 
           activeFilters.format.length + 
           (activeFilters.rating > 0 ? 1 : 0) +
           (activeFilters.sortBy !== 'relevance' ? 1 : 0) +
           (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 1000 ? 1 : 0);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Browse Books
          </h1>
          <p className="text-gray-600">
            Discover your next great read from our curated collection
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

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-card shadow-card p-4"
        >
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <motion.button
                key={category.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ApperIcon name={category.icon} size={16} />
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Filters and Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between bg-white rounded-card shadow-card p-4"
        >
          <div>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${filteredBooks.length} books found`}
              {searchQuery && (
                <span className="text-primary"> for "{searchQuery}"</span>
              )}
            </p>
            {selectedCategory !== 'All Books' && (
              <p className="text-sm text-gray-500">
                Category: {selectedCategory}
              </p>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="relative"
          >
            <ApperIcon name="Filter" size={16} />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BookGrid 
            books={filteredBooks} 
            loading={loading}
            onWishlistChange={loadBooks}
          />
        </motion.div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={activeFilters}
        />
      </div>
    </div>
  );
};

export default Browse;