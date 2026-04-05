export const calculateTotals = (transactions) => {
  return transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
        acc.balance += t.amount;
      } else {
        acc.expenses += Math.abs(t.amount);
        acc.balance += t.amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expenses: 0 }
  );
};

export const groupByDate = (transactions, initialBalance = 0) => {
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const dailyData = {};
  let runningBalance = initialBalance;

  sorted.forEach((t) => {
    const day = t.date.split('T')[0];
    if (!dailyData[day]) {
      dailyData[day] = { date: day, balance: 0, income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      dailyData[day].income += t.amount;
      runningBalance += t.amount;
    } else {
      dailyData[day].expenses += Math.abs(t.amount);
      runningBalance += t.amount;
    }
    dailyData[day].balance = runningBalance;
  });

  return Object.values(dailyData);
};

export const groupByCategory = (transactions) => {
  const categories = {};
  
  transactions.filter(t => t.type === 'expense').forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
  });

  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

export const getInsights = (transactions) => {
  const totals = calculateTotals(transactions);
  const categories = groupByCategory(transactions);
  const topCategory = categories.length > 0 ? categories.sort((a, b) => b.value - a.value)[0] : null;

  return {
    topCategory,
    savingsRate: totals.income > 0 ? ((totals.income - totals.expenses) / totals.income) * 100 : 0,
    transactionCount: transactions.length,
    avgDailySpend: totals.expenses / 30, // Rough estimate for a month
  };
};
