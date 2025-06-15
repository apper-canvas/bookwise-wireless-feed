import wishlistData from '@/services/mockData/wishlist.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let wishlistItems = [...wishlistData];

const wishlistService = {
  async getAll() {
    await delay(250);
    return [...wishlistItems];
  },

  async getById(id) {
    await delay(200);
    const item = wishlistItems.find(item => item.id === id);
    if (!item) {
      throw new Error('Wishlist item not found');
    }
    return { ...item };
  },

  async create(item) {
    await delay(300);
    const newItem = {
      ...item,
      id: Date.now().toString(),
      addedDate: new Date().toISOString(),
      priority: wishlistItems.length + 1
    };
    wishlistItems.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await delay(250);
    const index = wishlistItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Wishlist item not found');
    }
    wishlistItems[index] = { ...wishlistItems[index], ...data };
    return { ...wishlistItems[index] };
  },

  async delete(id) {
    await delay(200);
    const index = wishlistItems.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Wishlist item not found');
    }
    const deletedItem = wishlistItems.splice(index, 1)[0];
    return { ...deletedItem };
  },

  async isInWishlist(bookId) {
    await delay(100);
    return wishlistItems.some(item => item.bookId === bookId);
  },

  async toggleWishlist(bookId, targetPrice = null) {
    await delay(250);
    const existingIndex = wishlistItems.findIndex(item => item.bookId === bookId);
    
    if (existingIndex !== -1) {
      // Remove from wishlist
      const removedItem = wishlistItems.splice(existingIndex, 1)[0];
      return { removed: true, item: { ...removedItem } };
    } else {
      // Add to wishlist
      const newItem = {
        id: Date.now().toString(),
        bookId,
        targetPrice,
        addedDate: new Date().toISOString(),
        notifyOnDrop: true,
        priority: wishlistItems.length + 1
      };
      wishlistItems.push(newItem);
      return { added: true, item: { ...newItem } };
    }
  }
};

export default wishlistService;