import budgetData from '@/services/mockData/budget.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let budgetTrackers = [...budgetData];

const budgetService = {
  async getAll() {
    await delay(250);
    return [...budgetTrackers];
  },

  async getCurrentMonth() {
    await delay(200);
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    let currentBudget = budgetTrackers.find(budget => budget.month === currentMonth);
    
    if (!currentBudget) {
      // Create new budget for current month
      currentBudget = {
        id: Date.now().toString(),
        month: currentMonth,
        budgetAmount: 1000, // Default budget
        spentAmount: 0,
        purchases: []
      };
      budgetTrackers.push(currentBudget);
    }
    
    return { ...currentBudget };
  },

  async updateBudget(month, budgetAmount) {
    await delay(300);
    let budgetIndex = budgetTrackers.findIndex(budget => budget.month === month);
    
    if (budgetIndex === -1) {
      const newBudget = {
        id: Date.now().toString(),
        month,
        budgetAmount,
        spentAmount: 0,
        purchases: []
      };
      budgetTrackers.push(newBudget);
      return { ...newBudget };
    }
    
    budgetTrackers[budgetIndex].budgetAmount = budgetAmount;
    return { ...budgetTrackers[budgetIndex] };
  },

  async addPurchase(month, purchase) {
    await delay(300);
    let budgetIndex = budgetTrackers.findIndex(budget => budget.month === month);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found for this month');
    }
    
    const newPurchase = {
      ...purchase,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    budgetTrackers[budgetIndex].purchases.push(newPurchase);
    budgetTrackers[budgetIndex].spentAmount += purchase.amount;
    
    return { ...budgetTrackers[budgetIndex] };
  },

  async getRemainingBudget(month) {
    await delay(150);
    const budget = budgetTrackers.find(b => b.month === month);
    if (!budget) {
      return 1000; // Default remaining budget
    }
    return Math.max(0, budget.budgetAmount - budget.spentAmount);
  }
};

export default budgetService;