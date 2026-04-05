import { AppProvider } from './context/AppProvider';
import { Header } from './components/Header';
import { motion } from 'framer-motion';

import { useTransactions } from './hooks/useTransactions';
import { BalanceTrendChart, SpendingBreakdownChart, IncomeExpenseChart } from './components/DashboardCharts';
import { SummaryCard as CardSummary } from './components/SummaryComponents';
import { TransactionsList } from './components/TransactionsList';
import { InsightsPanel } from './components/InsightsPanel';
import { TransactionModal } from './components/TransactionModal';

function AppContent() {
  const { stats, allTimeStats, chartData, categoryData, modal, dispatch } = useTransactions();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 text-foreground transition-colors duration-300 relative">
      <Header />
      
      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col gap-1 px-1">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            Dashboard
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-muted-foreground"
          >
            Welcome back! Here's what's happening with your finances.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <CardSummary 
            title="Total Balance" 
            value={allTimeStats.balance} 
            type="balance" 
            delay={0.1}
          />
          <CardSummary 
            title="Total Income" 
            value={stats.income} 
            type="income" 
            delay={0.2}
          />
          <CardSummary 
            title="Total Expenses" 
            value={stats.expenses} 
            type="expense" 
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            <IncomeExpenseChart data={chartData} title="Cash Flow" />
            <BalanceTrendChart data={chartData} title="Balance Trend" />
            <TransactionsList />
          </div>
          <div className="space-y-6 md:space-y-8">
            <SpendingBreakdownChart data={categoryData} title="Spending by Category" />
            <InsightsPanel />
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto p-8 mt-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Zorvyn Finance. All rights reserved.</p>
      </footer>

      <TransactionModal 
        isOpen={modal.isOpen} 
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })} 
        transaction={modal.transaction}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
