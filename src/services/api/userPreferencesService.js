import preferencesData from '@/services/mockData/userPreferences.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let userPreferences = { ...preferencesData };

const userPreferencesService = {
  async get() {
    await delay(200);
    return { ...userPreferences };
  },

  async update(data) {
    await delay(300);
    userPreferences = { ...userPreferences, ...data };
    return { ...userPreferences };
  },

  async updateBudget(monthlyBudget) {
    await delay(250);
    userPreferences.monthlyBudget = monthlyBudget;
    return { ...userPreferences };
  },

  async updateGenres(favoriteGenres) {
    await delay(250);
    userPreferences.favoriteGenres = favoriteGenres;
    return { ...userPreferences };
  },

  async isOnboarded() {
    await delay(100);
    return userPreferences.isOnboarded || false;
  },

  async completeOnboarding() {
    await delay(200);
    userPreferences.isOnboarded = true;
    return { ...userPreferences };
  }
};

export default userPreferencesService;