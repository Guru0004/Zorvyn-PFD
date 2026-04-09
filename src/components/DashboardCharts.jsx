import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, Skeleton } from './UIPrimitives';
import { formatCurrency, formatCompactNumber } from '../utils/formatUtils';

export function BalanceTrendChart({ data, title }) {
  return (
    <Card className="h-[350px] sm:h-[400px] flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          Balance
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-0">
        <div className="absolute inset-0">
          {data.length > 0 ? (
            <div className="absolute inset-0 -ml-4 md:-ml-6 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    width={40}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(val) => formatCompactNumber(val)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [formatCurrency(value), 'Balance']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                <AreaChart size={24} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Not enough data for this period</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function SpendingBreakdownChart({ data, title, onSliceClick }) {
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
  ];

  return (
    <Card className="h-[400px] sm:h-[450px] flex flex-col gap-4 overflow-hidden">
      <h3 className="text-lg font-bold tracking-tight shrink-0">{title}</h3>
      
      <div className="flex-1 w-full relative min-h-0">
        <div className="absolute inset-0">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(entry) => onSliceClick?.(entry.name)}
                  animationDuration={1000}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="cursor-pointer hover:opacity-80 transition-opacity outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                <PieChart size={24} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">No expenses found</p>
            </div>
          )}
        </div>
      </div>
 
      {data.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 px-2 shrink-0">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 min-w-[80px]">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-[11px] font-medium text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function IncomeExpenseChart({ data, title }) {
  return (
    <Card className="h-[350px] sm:h-[400px] flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            Income
          </div>
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            Expenses
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-0">
        <div className="absolute inset-0">
          {data.length > 0 ? (
            <div className="absolute inset-0 -ml-4 md:-ml-6 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    width={40}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(val) => formatCompactNumber(val)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4, stroke: 'hsl(var(--card))' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4, stroke: 'hsl(var(--card))' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                <LineChart size={24} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Not enough data for this period</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="h-[350px] sm:h-[400px] flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-24 h-4" />
      </div>
      <div className="flex-1 w-full flex items-end justify-between px-2 pb-2 gap-2">
        {[...Array(12)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-lg bg-primary/10" 
            style={{ height: `${Math.random() * 60 + 20}%` }} 
          />
        ))}
      </div>
    </Card>
  );
}
