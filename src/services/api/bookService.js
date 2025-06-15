import booksData from '@/services/mockData/books.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let books = [...booksData];

const bookService = {
  async getAll() {
    await delay(300);
    return [...books];
  },

  async getById(id) {
    await delay(200);
    const book = books.find(book => book.id === id);
    if (!book) {
      throw new Error('Book not found');
    }
    return { ...book };
  },

  async getByGenre(genre) {
    await delay(250);
    const filteredBooks = books.filter(book => 
      book.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    );
    return [...filteredBooks];
  },

  async getDeals() {
    await delay(300);
    const dealsBooks = books.filter(book => 
      book.originalPrice && book.currentPrice < book.originalPrice
    );
    return [...dealsBooks];
  },

  async getByPriceRange(minPrice, maxPrice) {
    await delay(250);
    const filteredBooks = books.filter(book => 
      book.currentPrice >= minPrice && book.currentPrice <= maxPrice
    );
    return [...filteredBooks];
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    const results = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.genres.some(genre => genre.toLowerCase().includes(searchTerm))
    );
    return [...results];
  },

  async getRecommendations(preferences = {}) {
    await delay(400);
    let recommendedBooks = [...books];

    if (preferences.favoriteGenres && preferences.favoriteGenres.length > 0) {
      recommendedBooks = books.filter(book =>
        book.genres.some(genre =>
          preferences.favoriteGenres.some(favGenre =>
            genre.toLowerCase().includes(favGenre.toLowerCase())
          )
        )
      );
    }

    if (preferences.priceRange) {
      recommendedBooks = recommendedBooks.filter(book =>
        book.currentPrice <= preferences.priceRange.max &&
        book.currentPrice >= preferences.priceRange.min
      );
    }

    return recommendedBooks.slice(0, 10);
  }
};

export default bookService;