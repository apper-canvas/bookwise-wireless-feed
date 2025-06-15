import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import BookCard from '@/components/molecules/BookCard';
import { wishlistService, bookService } from '@/services';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [booksData, setBooksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const items = await wishlistService.getAll();
      setWishlistItems(items);

      // Fetch book details for each wishlist item
      const bookPromises = items.map(item => 
        bookService.getById(item.bookId).catch(() => null)
      );
      const books = await Promise.all(bookPromises);
      
      const booksMap = {};
      books.forEach(book => {
        if (book) {
          booksMap[book.id] = book;
        }
      });
      setBooksData(booksMap);
    } catch (err) {
      setError(err.message || 'Failed to load wishlist');
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await wishlistService.toggleWishlist(bookId);
      setWishlistItems(prev => prev.filter(item => item.bookId !== bookId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleUpdateTargetPrice = async (itemId, newTargetPrice) => {
    try {
      await wishlistService.update(itemId, { targetPrice: newTargetPrice });
      setWishlistItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, targetPrice: newTargetPrice }
            : item
        )
      );
      toast.success('Target price updated');
    } catch (error) {
      toast.error('Failed to update target price');
    }
  };

  const handleToggleNotifications = async (itemId, notifyOnDrop) => {
    try {
      await wishlistService.update(itemId, { notifyOnDrop: !notifyOnDrop });
      setWishlistItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, notifyOnDrop: !notifyOnDrop }
            : item
        )
      );
      toast.success(
        !notifyOnDrop ? 'Notifications enabled' : 'Notifications disabled'
      );
    } catch (error) {
      toast.error('Failed to update notification settings');
    }
  };

  const getPriceStatus = (currentPrice, targetPrice) => {
    if (!targetPrice) return null;
    if (currentPrice <= targetPrice) {
      return { status: 'target-met', message: 'Target price reached!', color: 'success' };
    }
    const difference = currentPrice - targetPrice;
    const percentage = Math.round((difference / currentPrice) * 100);
    return { 
      status: 'above-target', 
      message: `₹${difference} above target (${percentage}%)`, 
      color: 'warning' 
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-card p-6 space-y-4">
                  <div className="h-48 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadWishlist} variant="primary">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Heart" className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start adding books you'd like to read and we'll notify you when prices drop!
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="primary"
          >
            <ApperIcon name="Search" size={16} />
            Discover Books
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-1">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} book{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary">
                <ApperIcon name="Bell" size={14} />
                Price Alerts Active
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item, index) => {
              const book = booksData[item.bookId];
              if (!book) return null;

              const priceStatus = getPriceStatus(book.currentPrice, item.targetPrice);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-card shadow-card overflow-hidden"
                >
                  {/* Book Cover and Info */}
                  <div className="relative">
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(book.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors group"
                    >
                      <ApperIcon 
                        name="X" 
                        size={16}
                        className="text-gray-500 group-hover:text-error transition-colors"
                      />
                    </button>

                    {/* Price Status Badge */}
                    {priceStatus && (
                      <div className="absolute top-2 left-2">
                        <Badge 
                          variant={priceStatus.status === 'target-met' ? 'success' : 'warning'}
                          size="small"
                        >
                          {priceStatus.status === 'target-met' ? '🎯' : '⏳'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Book Details */}
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {book.author}
                      </p>
                      
                      {/* Current Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{book.currentPrice}
                        </span>
                        {book.originalPrice && book.originalPrice > book.currentPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{book.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Target Price */}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Target Price
                        </label>
                        <button
                          onClick={() => handleToggleNotifications(item.id, item.notifyOnDrop)}
                          className={`p-1 rounded transition-colors ${
                            item.notifyOnDrop
                              ? 'text-primary hover:text-primary/80'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <ApperIcon 
                            name={item.notifyOnDrop ? 'Bell' : 'BellOff'} 
                            size={16}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">₹</span>
                        <input
                          type="number"
                          value={item.targetPrice || ''}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value);
                            if (!isNaN(newPrice)) {
                              handleUpdateTargetPrice(item.id, newPrice);
                            }
                          }}
                          placeholder={`Max ₹${book.currentPrice}`}
                          className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>

                      {/* Price Status Message */}
                      {priceStatus && (
                        <p className={`text-xs mt-1 ${
                          priceStatus.status === 'target-met' ? 'text-success' : 'text-warning'
                        }`}>
                          {priceStatus.message}
                        </p>
                      )}
                    </div>

                    {/* Added Date */}
                    <div className="text-xs text-gray-500 border-t pt-2">
                      Added {new Date(item.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;