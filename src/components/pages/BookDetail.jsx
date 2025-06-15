import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { bookService, wishlistService } from '@/services';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [bookData, wishlistStatus] = await Promise.all([
        bookService.getById(id),
        wishlistService.isInWishlist(id)
      ]);
      
      setBook(bookData);
      setIsInWishlist(wishlistStatus);
      setTargetPrice((bookData.currentPrice * 0.9).toString());
    } catch (err) {
      setError(err.message || 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    setWishlistLoading(true);
    
    try {
      const result = await wishlistService.toggleWishlist(
        book.id, 
        isInWishlist ? null : parseFloat(targetPrice)
      );
      
      setIsInWishlist(!isInWishlist);
      
      if (result.added) {
        toast.success('Added to wishlist with price alert!');
        setShowPriceAlert(false);
      } else {
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
      console.error('Wishlist error:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddWithPriceAlert = async () => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid target price');
      return;
    }

    if (price >= book.currentPrice) {
      toast.error('Target price should be lower than current price');
      return;
    }

    handleWishlistToggle();
  };

  const getDiscountPercentage = () => {
    if (!book.originalPrice || book.originalPrice <= book.currentPrice) return 0;
    return Math.round(((book.originalPrice - book.currentPrice) / book.originalPrice) * 100);
  };

  const getBestRetailerPrice = () => {
    if (!book.retailerPrices) return null;
    
    const retailers = Object.entries(book.retailerPrices);
    return retailers.reduce((best, [retailer, price]) => {
      if (!best || price < best.price) {
        return { retailer, price };
      }
      return best;
    }, null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="mb-4">
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-card" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded w-1/4" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ApperIcon name="BookX" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            Book not found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The book you\'re looking for doesn\'t exist.'}
          </p>
          <Button onClick={() => navigate(-1)} variant="primary">
            <ApperIcon name="ArrowLeft" size={16} />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const discountPercentage = getDiscountPercentage();
  const bestPrice = getBestRetailerPrice();

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span>Back</span>
        </motion.button>

        {/* Book Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              <img 
                src={book.coverUrl} 
                alt={book.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="deal" size="medium">
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>

          {/* Book Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                by <span className="font-medium">{book.author}</span>
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon 
                      key={i}
                      name="Star" 
                      size={16}
                      className={`${
                        i < Math.floor(book.rating) 
                          ? 'text-accent fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-900">{book.rating}</span>
                <span className="text-sm text-gray-500">out of 5</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {book.genres.map(genre => (
                  <Badge key={genre} variant="primary" size="small">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-primary">
                  ₹{book.currentPrice}
                </span>
                {book.originalPrice && book.originalPrice > book.currentPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{book.originalPrice}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="success" size="small">
                    Save ₹{book.originalPrice - book.currentPrice}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Package" size={14} />
                <span>{book.format} • {book.language}</span>
              </div>
            </div>

            {/* Wishlist Actions */}
            <div className="space-y-3">
              {!isInWishlist ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setShowPriceAlert(true)}
                    className="w-full"
                    disabled={wishlistLoading}
                  >
                    <ApperIcon name="Heart" size={16} />
                    Add to Wishlist & Set Price Alert
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="w-full"
                    loading={wishlistLoading}
                  >
                    <ApperIcon name="Plus" size={16} />
                    Just Add to Wishlist
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleWishlistToggle}
                  className="w-full"
                  loading={wishlistLoading}
                >
                  <ApperIcon name="HeartOff" size={16} />
                  Remove from Wishlist
                </Button>
              )}
            </div>

            {/* Best Price Alert */}
            {bestPrice && bestPrice.retailer && (
              <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingDown" className="text-success" size={16} />
                  <span className="text-sm font-medium text-success">
                    Best price at {bestPrice.retailer}: ₹{bestPrice.price}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Synopsis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-card shadow-card p-6 mb-8"
        >
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
            About this book
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {book.synopsis}
          </p>
        </motion.div>

        {/* Price Comparison */}
        {book.retailerPrices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-card shadow-card p-6"
          >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
              Price Comparison
            </h2>
            <div className="space-y-3">
              {Object.entries(book.retailerPrices).map(([retailer, price]) => (
                <div
                  key={retailer}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    price === Math.min(...Object.values(book.retailerPrices))
                      ? 'border-success bg-success/5'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Store" size={16} className="text-gray-500" />
                    <span className="font-medium">{retailer}</span>
                    {price === Math.min(...Object.values(book.retailerPrices)) && (
                      <Badge variant="success" size="small">
                        Best Price
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold text-lg">₹{price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Price Alert Modal */}
        <AnimatePresence>
          {showPriceAlert && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowPriceAlert(false)}
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
                      Set Price Alert
                    </h3>
                    <button
                      onClick={() => setShowPriceAlert(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notify me when price drops to:
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          placeholder="Enter target price"
                          className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Current price: ₹{book.currentPrice}
                      </p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-sm text-primary">
                        💡 We'll send you a notification when "{book.title}" drops to your target price or below.
                      </p>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowPriceAlert(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleAddWithPriceAlert}
                        className="flex-1"
                        loading={wishlistLoading}
                      >
                        Set Alert
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

export default BookDetail;