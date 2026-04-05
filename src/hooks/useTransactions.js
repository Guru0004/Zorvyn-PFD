import { useMemo } from 'react';
import { useApp } from '../context/AppProvider';
import { calculateTotals, groupByDate, groupByCategory, getInsights } from '../utils/aggregation';

export function useTransactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, listFilters } = state;

  // 1. All-time Stats (For Total Balance card)
  const allTimeStats = useMemo(() => calculateTotals(transactions), [transactions]);

  // 2. Global Filter (Affects Period Stats, Charts, and the base for the list)
  const globalFilteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(t.category);
      
      if (filters.dateRange === 'all') return matchesCategory;
      
      const date = new Date(t.date);
      const now = new Date();
      
      // Calculate start of the comparison day (midnight) for better stability
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const diffDays = Math.floor((today.getTime() - txDate.getTime()) / (1000 * 3600 * 24));
      
      const daysLimit = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
      const matchesDate = diffDays <= daysLimit;

      return matchesCategory && matchesDate;
    });
  }, [transactions, filters]);

  // 3. Initial Balance (Sum of all transactions BEFORE the global filter period)
  const initialBalance = useMemo(() => {
    if (filters.dateRange === 'all') return 0;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysLimit = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
    
    return transactions
      .filter((t) => {
        const date = new Date(t.date);
        const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffDays = Math.floor((today.getTime() - txDate.getTime()) / (1000 * 3600 * 24));
        return diffDays > daysLimit;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions, filters.dateRange]);

  // 4. List-Specific Filter and Sort (Only affects the Recent Transactions list)
  const listFilteredTransactions = useMemo(() => {
    const filtered = globalFilteredTransactions.filter((t) => {
      const matchesQuery = t.description.toLowerCase().includes(listFilters.query.toLowerCase()) ||
                          t.category.toLowerCase().includes(listFilters.query.toLowerCase());
      
      const matchesType = listFilters.type === 'all' || t.type === listFilters.type;
      
      return matchesQuery && matchesType;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return listFilters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [globalFilteredTransactions, listFilters.query, listFilters.type, listFilters.sortOrder]);

  // Calculations use ONLY global filters or appropriate offsets
  const periodStats = useMemo(() => calculateTotals(globalFilteredTransactions), [globalFilteredTransactions]);
  const chartData = useMemo(() => groupByDate(globalFilteredTransactions, initialBalance), [globalFilteredTransactions, initialBalance]);
  const categoryData = useMemo(() => groupByCategory(globalFilteredTransactions), [globalFilteredTransactions]);
  const insights = useMemo(() => getInsights(globalFilteredTransactions), [globalFilteredTransactions]);

  return {
    transactions: listFilteredTransactions,
    stats: periodStats,          // For period-specific Income/Expense cards
    allTimeStats,                // For the Total Balance card
    chartData,
    categoryData,
    insights,
    filters,
    listFilters,
    role: state.role,
    modal: state.modal,
    dispatch
  };
}
