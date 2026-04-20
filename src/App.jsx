import React, { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppProvider';
import { Header } from './components/Header';

import { useTransactions } from './hooks/useTransactions';
import { ChartSkeleton } from './components/DashboardCharts';
import { SummaryCard as CardSummary, SummaryCardSkeleton } from './components/SummaryComponents';
import { InsightsSkeleton } from './components/InsightsPanel';

// Lazy load heavy components
const BalanceTrendChart = lazy(() => import('./components/DashboardCharts').then(m => ({ default: m.BalanceTrendChart })));
const SpendingBreakdownChart = lazy(() => import('./components/DashboardCharts').then(m => ({ default: m.SpendingBreakdownChart })));
const IncomeExpenseChart = lazy(() => import('./components/DashboardCharts').then(m => ({ default: m.IncomeExpenseChart })));
const TransactionsList = lazy(() => import('./components/TransactionsList').then(m => ({ default: m.TransactionsList })));
const InsightsPanel = lazy(() => import('./components/InsightsPanel').then(m => ({ default: m.InsightsPanel })));
const TransactionModal = lazy(() => import('./components/TransactionModal').then(m => ({ default: m.TransactionModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));

function AppContent() {
  const { stats, allTimeStats, chartData, categoryData, modal, dispatch, isInitialLoad } = useTransactions();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 text-foreground transition-colors duration-300 relative">
      <Header />
      
      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col gap-1 px-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back! Here's what's happening with your finances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isInitialLoad ? (
            <>
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
            </>
          ) : (
            <>
              <CardSummary 
                title="Total Balance" 
                value={allTimeStats.balance} 
                type="balance" 
              />
              <CardSummary 
                title="Total Income" 
                value={stats.income} 
                type="income" 
              />
              <CardSummary 
                title="Total Expenses" 
                value={stats.expenses} 
                type="expense" 
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            <Suspense fallback={<><ChartSkeleton /><ChartSkeleton /></>}>
              {!isInitialLoad && (
                <>
                  <IncomeExpenseChart data={chartData} title="Cash Flow" />
                  <BalanceTrendChart data={chartData} title="Balance Trend" />
                </>
              )}
              {isInitialLoad && <><ChartSkeleton /><ChartSkeleton /></>}
            </Suspense>
            
            <Suspense fallback={<ChartSkeleton />}>
              <TransactionsList />
            </Suspense>
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <Suspense fallback={<><ChartSkeleton /><InsightsSkeleton /></>}>
              {!isInitialLoad ? (
                <>
                  <SpendingBreakdownChart data={categoryData} title="Spending by Category" />
                  <InsightsPanel />
                </>
              ) : (
                <>
                  <ChartSkeleton />
                  <InsightsSkeleton />
                </>
              )}
            </Suspense>
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto p-8 mt-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; 2026 Guru veera prasath M. All rights reserved.</p>
      </footer>

      <Suspense fallback={null}>
        <TransactionModal 
          isOpen={modal.isOpen} 
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })} 
          transaction={modal.transaction}
        />
        <SettingsModal />
      </Suspense>
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
