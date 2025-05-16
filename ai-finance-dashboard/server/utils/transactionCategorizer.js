const transactionCategorizer = {
  // Regex patterns for different categories
  patterns: {
    groceries: [
      /grocery/i,
      /supermarket/i,
      /market/i,
      /food/i,
      /fresh/i,
      /produce/i,
      /dairy/i,
      /meat/i,
      /vegetable/i
    ],
    restaurants: [
      /restaurant/i,
      /cafe/i,
      /dining/i,
      /meal/i,
      /lunch/i,
      /dinner/i,
      /breakfast/i,
      /eat/i,
      /dine/i,
      /food/i
    ],
    transportation: [
      /taxi/i,
      /uber/i,
      /lyft/i,
      /bus/i,
      /train/i,
      /subway/i,
      /metro/i,
      /fuel/i,
      /gas/i,
      /petrol/i,
      /toll/i,
      /parking/i
    ],
    utilities: [
      /electric/i,
      /water/i,
      /gas/i,
      /utility/i,
      /bill/i,
      /internet/i,
      /phone/i,
      /mobile/i,
      /cable/i,
      /tv/i
    ],
    entertainment: [
      /movie/i,
      /cinema/i,
      /theater/i,
      /concert/i,
      /music/i,
      /sport/i,
      /game/i,
      /ticket/i,
      /stream/i,
      /netflix/i,
      /hbo/i,
      /disney/i
    ],
    shopping: [
      /clothing/i,
      /clothes/i,
      /shoes/i,
      /apparel/i,
      /mall/i,
      /shopping/i,
      /store/i,
      /retail/i,
      /electronics/i,
      /furniture/i
    ],
    health: [
      /doctor/i,
      /hospital/i,
      /pharmacy/i,
      /medication/i,
      /prescription/i,
      /health/i,
      /medical/i,
      /dentist/i,
      /optical/i
    ],
    education: [
      /tuition/i,
      /school/i,
      /college/i,
      /university/i,
      /book/i,
      /textbook/i,
      /education/i,
      /course/i,
      /class/i
    ],
    bills: [
      /rent/i,
      /mortgage/i,
      /loan/i,
      /credit/i,
      /card/i,
      /payment/i,
      /bill/i,
      /fee/i,
      /charge/i
    ],
    income: [
      /salary/i,
      /wage/i,
      /income/i,
      /pay/i,
      /deposit/i,
      /refund/i,
      /bonus/i,
      /commission/i
    ]
  },

  // Function to categorize a single transaction
  categorizeTransaction: (description, amount) => {
    // If amount is positive and no other category matches, assume it's income
    if (amount > 0) {
      return 'Income';
    }

    // Check each category's patterns
    for (const [category, patterns] of Object.entries(transactionCategorizer.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(description)) {
          return category.charAt(0).toUpperCase() + category.slice(1);
        }
      }
    }

    // If no pattern matches, return 'Other'
    return 'Other';
  },

  // Function to categorize multiple transactions
  categorizeTransactions: (transactions) => {
    return transactions.map(transaction => {
      const category = transactionCategorizer.categorizeTransaction(
        transaction.description || '',
        parseFloat(transaction.amount)
      );
      return {
        ...transaction,
        category
      };
    });
  },

  // Function to add custom patterns
  addCustomPatterns: (category, patterns) => {
    if (!transactionCategorizer.patterns[category.toLowerCase()]) {
      transactionCategorizer.patterns[category.toLowerCase()] = [];
    }
    patterns.forEach(pattern => {
      if (typeof pattern === 'string') {
        transactionCategorizer.patterns[category.toLowerCase()].push(new RegExp(pattern, 'i'));
      } else if (pattern instanceof RegExp) {
        transactionCategorizer.patterns[category.toLowerCase()].push(pattern);
      }
    });
  },

  // Function to remove patterns
  removePatterns: (category, patternsToRemove) => {
    const categoryPatterns = transactionCategorizer.patterns[category.toLowerCase()];
    if (categoryPatterns) {
      categoryPatterns.forEach((pattern, index) => {
        if (patternsToRemove.includes(pattern.source)) {
          categoryPatterns.splice(index, 1);
        }
      });
    }
  }
};

// Export as a function for easier use
module.exports = transactionCategorizer;
