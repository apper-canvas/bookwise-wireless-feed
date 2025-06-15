import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { userPreferencesService } from '@/services';

const Welcome = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    favoriteGenres: [],
    monthlyBudget: 1000,
    preferredFormats: [],
    priceRange: { min: 0, max: 500 }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const genres = [
    'Contemporary Fiction', 'Romance', 'Mystery', 'Thriller',
    'Self-Help', 'Biography', 'Fantasy', 'Historical Fiction',
    'Non-fiction', 'Psychology', 'Business', 'Health'
  ];

  const formats = ['Paperback', 'Hardcover', 'Kindle', 'Audiobook'];
  const budgetOptions = [500, 750, 1000, 1500, 2000];

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const isOnboarded = await userPreferencesService.isOnboarded();
        if (isOnboarded) {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    checkOnboarding();
  }, [navigate]);

  const handleGenreToggle = (genre) => {
    setPreferences(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const handleFormatToggle = (format) => {
    setPreferences(prev => ({
      ...prev,
      preferredFormats: prev.preferredFormats.includes(format)
        ? prev.preferredFormats.filter(f => f !== format)
        : [...prev.preferredFormats, format]
    }));
  };

  const handleBudgetSelect = (budget) => {
    setPreferences(prev => ({
      ...prev,
      monthlyBudget: budget,
      priceRange: { min: 0, max: Math.floor(budget * 0.6) }
    }));
  };

  const handleComplete = async () => {
    if (preferences.favoriteGenres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }

    setLoading(true);
    try {
      await userPreferencesService.update(preferences);
      await userPreferencesService.completeOnboarding();
      toast.success('Welcome to BookWise! 📚');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Welcome to BookWise! 📚",
      subtitle: "Your personal book discovery companion",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-6"
          >
            <ApperIcon name="BookOpen" className="w-20 h-20 text-primary mx-auto" />
          </motion.div>
          <p className="text-lg text-gray-600 mb-8">
            Discover amazing books within your budget and never miss a great deal again!
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-primary/5 rounded-card">
              <ApperIcon name="Heart" className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-medium">Personalized Recommendations</p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-card">
              <ApperIcon name="Bell" className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="font-medium">Price Drop Alerts</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-card">
              <ApperIcon name="PiggyBank" className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="font-medium">Budget Tracking</p>
            </div>
            <div className="p-4 bg-success/5 rounded-card">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="font-medium">Daily Deals</p>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: "What do you love reading?",
      subtitle: "Select your favorite genres",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <div className="flex flex-wrap gap-3">
            {genres.map(genre => (
              <motion.button
                key={genre}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGenreToggle(genre)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  preferences.favoriteGenres.includes(genre)
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Selected: {preferences.favoriteGenres.length} genres
          </p>
        </motion.div>
      )
    },
    {
      title: "What's your monthly book budget?",
      subtitle: "This helps us show you the best deals",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <div className="space-y-3">
            {budgetOptions.map(budget => (
              <motion.button
                key={budget}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBudgetSelect(budget)}
                className={`w-full p-4 rounded-card border-2 text-left transition-all ${
                  preferences.monthlyBudget === budget
                    ? 'bg-primary/5 border-primary'
                    : 'bg-white border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold">₹{budget}</span>
                    <p className="text-sm text-gray-500">
                      ~{Math.floor(budget / 300)} books per month
                    </p>
                  </div>
                  {preferences.monthlyBudget === budget && (
                    <ApperIcon name="Check" className="w-5 h-5 text-primary" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )
    },
    {
      title: "Preferred book formats?",
      subtitle: "We'll prioritize these in your recommendations",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {formats.map(format => (
              <motion.button
                key={format}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFormatToggle(format)}
                className={`p-4 rounded-card border-2 text-center transition-all ${
                  preferences.preferredFormats.includes(format)
                    ? 'bg-secondary/5 border-secondary'
                    : 'bg-white border-gray-200 hover:border-secondary/50'
                }`}
              >
                <ApperIcon 
                  name={format === 'Kindle' ? 'Tablet' : format === 'Audiobook' ? 'Headphones' : 'Book'} 
                  className={`w-8 h-8 mx-auto mb-2 ${
                    preferences.preferredFormats.includes(format) ? 'text-secondary' : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">{format}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.h1
              key={currentStep}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-heading font-bold text-gray-900 mb-2"
            >
              {steps[currentStep].title}
            </motion.h1>
            <motion.p
              key={`subtitle-${currentStep}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600"
            >
              {steps[currentStep].subtitle}
            </motion.p>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ApperIcon name="ChevronLeft" size={16} />
              Back
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === 1 && preferences.favoriteGenres.length === 0}
              >
                Next
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                loading={loading}
                disabled={preferences.favoriteGenres.length === 0}
              >
                Get Started
                <ApperIcon name="Sparkles" size={16} />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;