import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { userPreferencesService } from '@/services';

const Profile = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [editingGenres, setEditingGenres] = useState([]);
  const [editingFormats, setEditingFormats] = useState([]);

  const allGenres = [
    'Contemporary Fiction', 'Romance', 'Mystery', 'Thriller',
    'Self-Help', 'Biography', 'Fantasy', 'Historical Fiction',
    'Non-fiction', 'Psychology', 'Business', 'Health',
    'Science Fiction', 'Horror', 'Poetry', 'Drama'
  ];

  const allFormats = ['Paperback', 'Hardcover', 'Kindle', 'Audiobook'];

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const prefs = await userPreferencesService.get();
      setPreferences(prefs);
    } catch (error) {
      toast.error('Failed to load preferences');
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (newBudget) => {
    try {
      const updated = await userPreferencesService.updateBudget(newBudget);
      setPreferences(updated);
      toast.success('Budget updated successfully!');
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

  const handleUpdateGenres = async () => {
    try {
      const updated = await userPreferencesService.updateGenres(editingGenres);
      setPreferences(updated);
      setShowGenreModal(false);
      toast.success('Favorite genres updated!');
    } catch (error) {
      toast.error('Failed to update genres');
    }
  };

  const handleUpdateFormats = async () => {
    try {
      const updated = await userPreferencesService.update({
        ...preferences,
        preferredFormats: editingFormats
      });
      setPreferences(updated);
      setShowFormatModal(false);
      toast.success('Preferred formats updated!');
    } catch (error) {
      toast.error('Failed to update formats');
    }
  };

  const openGenreModal = () => {
    setEditingGenres([...preferences.favoriteGenres]);
    setShowGenreModal(true);
  };

  const openFormatModal = () => {
    setEditingFormats([...preferences.preferredFormats]);
    setShowFormatModal(true);
  };

  const toggleGenre = (genre) => {
    setEditingGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleFormat = (format) => {
    setEditingFormats(prev =>
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-card p-6 mb-4 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            Failed to load profile
          </h2>
          <Button onClick={loadPreferences} variant="primary">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="User" className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-1">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your reading preferences and settings
          </p>
        </motion.div>

        {/* Reading Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Reading Preferences
            </h2>
            <ApperIcon name="BookOpen" className="text-primary" size={20} />
          </div>

          <div className="space-y-6">
            {/* Favorite Genres */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Favorite Genres</h3>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={openGenreModal}
                >
                  <ApperIcon name="Edit" size={14} />
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.favoriteGenres.map(genre => (
                  <Badge key={genre} variant="primary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Formats */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Preferred Formats</h3>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={openFormatModal}
                >
                  <ApperIcon name="Edit" size={14} />
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.preferredFormats.map(format => (
                  <Badge key={format} variant="secondary">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
              <div className="flex items-center gap-4 text-gray-600">
                <span>₹{preferences.priceRange.min}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ 
                      marginLeft: `${(preferences.priceRange.min / 1000) * 100}%`,
                      width: `${((preferences.priceRange.max - preferences.priceRange.min) / 1000) * 100}%`
                    }}
                  />
                </div>
                <span>₹{preferences.priceRange.max}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Budget Settings
            </h2>
            <ApperIcon name="PiggyBank" className="text-accent" size={20} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Monthly Budget</h3>
                <p className="text-sm text-gray-600">
                  Your current monthly book budget
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-accent">
                  ₹{preferences.monthlyBudget}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleUpdateBudget(500)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  preferences.monthlyBudget === 500
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <span className="block font-semibold">₹500</span>
                <span className="text-xs text-gray-500">Light Reader</span>
              </button>
              <button
                onClick={() => handleUpdateBudget(1000)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  preferences.monthlyBudget === 1000
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <span className="block font-semibold">₹1000</span>
                <span className="text-xs text-gray-500">Regular Reader</span>
              </button>
              <button
                onClick={() => handleUpdateBudget(1500)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  preferences.monthlyBudget === 1500
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <span className="block font-semibold">₹1500</span>
                <span className="text-xs text-gray-500">Avid Reader</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-card shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              Notification Preferences
            </h2>
            <ApperIcon name="Bell" className="text-secondary" size={20} />
          </div>

          <div className="space-y-4">
            {[
              { key: 'priceAlerts', label: 'Price Drop Alerts', description: 'Get notified when books in your wishlist drop in price' },
              { key: 'newDeals', label: 'Daily Deals', description: 'Receive notifications about new book deals' },
              { key: 'monthlyWrapUp', label: 'Monthly Summary', description: 'Get a monthly summary of your reading budget and purchases' }
            ].map(setting => (
              <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{setting.label}</h3>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.notificationPreferences?.[setting.key]
                    ? 'bg-primary'
                    : 'bg-gray-300'
                } relative cursor-pointer`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform absolute top-0.5 ${
                    preferences.notificationPreferences?.[setting.key]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Genre Edit Modal */}
        <AnimatePresence>
          {showGenreModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowGenreModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-card shadow-xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold">
                      Edit Favorite Genres
                    </h3>
                    <button
                      onClick={() => setShowGenreModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {allGenres.map(genre => (
                        <motion.button
                          key={genre}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleGenre(genre)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                            editingGenres.includes(genre)
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                          }`}
                        >
                          {genre}
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowGenreModal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleUpdateGenres}
                        className="flex-1"
                        disabled={editingGenres.length === 0}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Format Edit Modal */}
        <AnimatePresence>
          {showFormatModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowFormatModal(false)}
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
                      Edit Preferred Formats
                    </h3>
                    <button
                      onClick={() => setShowFormatModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {allFormats.map(format => (
                        <motion.button
                          key={format}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFormat(format)}
                          className={`p-4 rounded-card border-2 text-center transition-all ${
                            editingFormats.includes(format)
                              ? 'bg-secondary/5 border-secondary'
                              : 'bg-white border-gray-200 hover:border-secondary/50'
                          }`}
                        >
                          <ApperIcon 
                            name={format === 'Kindle' ? 'Tablet' : format === 'Audiobook' ? 'Headphones' : 'Book'} 
                            className={`w-8 h-8 mx-auto mb-2 ${
                              editingFormats.includes(format) ? 'text-secondary' : 'text-gray-400'
                            }`}
                          />
                          <span className="font-medium">{format}</span>
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowFormatModal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleUpdateFormats}
                        className="flex-1"
                      >
                        Save Changes
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

export default Profile;