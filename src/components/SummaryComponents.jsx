import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Card } from './UIPrimitives';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatUtils';

export function SummaryCard({ title, value, type, trend, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  const icons = {
    balance: <Wallet size={24} className="text-primary" />,
    income: <ArrowUpRight size={24} className="text-success" />,
    expense: <ArrowDownRight size={24} className="text-destructive" />,
  };

  const bgColors = {
    balance: 'bg-primary/10',
    income: 'bg-success/10',
    expense: 'bg-destructive/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="flex flex-col gap-4 overflow-hidden relative group">
        <div className="flex items-center justify-between z-10">
          <div className={`p-3 rounded-xl ${bgColors[type]}`}>
            {icons[type]}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1 z-10">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">
            {formatCurrency(displayValue)}
          </h3>
        </div>

        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      </Card>
    </motion.div>
  );
}

export function MiniKPIChip({ label, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
    >
      <div className="p-1.5 rounded-lg bg-card text-muted-foreground">
        <Icon size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground leading-none mb-1">{label}</span>
        <span className="text-sm font-bold leading-none">{value}</span>
      </div>
    </motion.div>
  );
}
