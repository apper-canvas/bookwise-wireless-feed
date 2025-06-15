import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import BookCard from '@/components/molecules/BookCard';

const DealsCarousel = ({ books = [], title = "Today's Best Deals" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleBooks, setVisibleBooks] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleBooks(4);
      } else if (window.innerWidth >= 768) {
        setVisibleBooks(3);
      } else {
        setVisibleBooks(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const canSlideLeft = currentIndex > 0;
  const canSlideRight = currentIndex < books.length - visibleBooks;

  const slideLeft = () => {
    if (canSlideLeft) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const slideRight = () => {
    if (canSlideRight) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={slideLeft}
            disabled={!canSlideLeft}
            className={`p-2 rounded-full transition-colors ${
              canSlideLeft
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </button>
          <button
            onClick={slideRight}
            disabled={!canSlideRight}
            className={`p-2 rounded-full transition-colors ${
              canSlideRight
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          animate={{ x: -currentIndex * (100 / visibleBooks) + '%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="flex"
          style={{ width: `${(books.length / visibleBooks) * 100}%` }}
        >
          {books.map((book, index) => (
            <div
              key={book.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / books.length}%` }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {books.length > visibleBooks && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(books.length / visibleBooks) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / visibleBooks) === index
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DealsCarousel;