import { useTransactions } from '../hooks/useTransactions';
import { Card, Skeleton } from './UIPrimitives';
import { MiniKPIChip } from './SummaryComponents';
import { Zap, BarChart3, PieChart, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatUtils';
import { motion } from 'framer-motion';

export function InsightsPanel() {
  const { insights } = useTransactions();

  const getSavingsRateQuality = (rate) => {
    if (rate >= 20) return { label: 'Excellent', color: 'text-success', icon: CheckCircle2 };
    if (rate >= 10) return { label: 'Good', color: 'text-primary', icon: Info };
    return { label: 'Needs Attention', color: 'text-destructive', icon: AlertTriangle };
  };

  const quality = getSavingsRateQuality(insights.savingsRate);
  const StatusIcon = quality.icon;

  return (
    <Card className="flex flex-col gap-6">
      <h3 className="text-xl font-bold tracking-tight">Financial Insights</h3>
      
      <div className="space-y-6 flex-1">
        {insights.transactionCount > 0 ? (
          <>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Savings Rate</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-background border ${quality.color}`}>{quality.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{insights.savingsRate.toFixed(1)}%</span>
                <StatusIcon size={18} className={quality.color} />
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(insights.savingsRate, 0), 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${insights.savingsRate >= 10 ? 'bg-primary' : 'bg-destructive'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <MiniKPIChip 
                label="Top Category" 
                value={insights.topCategory?.name || 'N/A'} 
                icon={PieChart} 
                delay={0.1}
              />
              <MiniKPIChip 
                label="Daily Avg Spend" 
                value={formatCurrency(insights.avgDailySpend)} 
                icon={Zap} 
                delay={0.2}
              />
              <MiniKPIChip 
                label="Transactions" 
                value={insights.transactionCount} 
                icon={BarChart3} 
                delay={0.3}
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {insights.savingsRate > 0 
                  ? "You're saving more than you spend this month. Keep it up!" 
                  : "Your expenses are exceeding your income. Consider reviewing your top spending categories."}
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
              <Zap size={32} className="opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-foreground">Not enough data to generate insights</p>
              <p className="text-xs">Add more transactions to see your financial analytics.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function InsightsSkeleton() {
  return (
    <Card className="flex flex-col gap-6">
      <Skeleton className="w-40 h-7" />
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-muted/10 border border-border/50 space-y-4">
          <div className="flex justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-5" />
          </div>
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-12 rounded-xl" />
          <Skeleton className="w-full h-12 rounded-xl" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}
