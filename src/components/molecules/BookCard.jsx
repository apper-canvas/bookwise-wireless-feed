import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { wishlistService } from '@/services';

const BookCard = ({ book, onWishlistChange }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const inWishlist = await wishlistService.isInWishlist(book.id);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    checkWishlistStatus();
  }, [book.id]);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      const result = await wishlistService.toggleWishlist(book.id, book.currentPrice * 0.9);
      setIsInWishlist(!isInWishlist);
      
      if (result.added) {
        toast.success('Added to wishlist!');
      } else {
        toast.success('Removed from wishlist');
      }
      
      if (onWishlistChange) {
        onWishlistChange();
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  const discountPercentage = book.originalPrice 
    ? Math.round(((book.originalPrice - book.currentPrice) / book.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="deal" size="small">
              {discountPercentage}% OFF
            </Badge>
          </div>
        )}
        
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <ApperIcon 
              name="Heart" 
              size={20}
              className={`transition-colors ${
                isInWishlist ? 'text-error fill-current' : 'text-gray-400 hover:text-error'
              }`}
            />
          )}
        </motion.button>
      </div>
      
      <div className="p-4">
        <h3 className="font-heading font-semibold text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          by {book.author}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
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
          <div className="flex items-center gap-1">
            <ApperIcon name="Star" size={14} className="text-accent fill-current" />
            <span className="text-sm text-gray-600">{book.rating}</span>
          </div>
        </div>
        
        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {book.genres.slice(0, 2).map((genre, index) => (
            <Badge key={index} variant="primary" size="small">
              {genre}
            </Badge>
          ))}
          {book.genres.length > 2 && (
            <Badge variant="default" size="small">
              +{book.genres.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;