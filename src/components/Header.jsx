import React from 'react';
import { useApp } from '../context/AppProvider';
import { Settings, User, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export function UserProfile() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);

  const roles = ['Viewer', 'Admin'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/80 flex items-center justify-center overflow-hidden border-2 transition-all shrink-0 hover:border-primary/40 ${
          state.role === 'Admin' ? 'border-primary/20' : 'border-success/20'
        }`}
      >
        <User size={18} className="text-muted-foreground" />
        {/* Dynamic Role Indicator */}
        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background shadow-sm ${
          state.role === 'Admin' ? 'bg-primary' : 'bg-success'
        }`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-3 w-48 z-20 overflow-hidden rounded-2xl border bg-card p-1.5 shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-border/50 mb-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Role Management</p>
                <p className="text-sm font-bold truncate">Logged in as <span className="text-primary">{state.role}</span></p>
              </div>

              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    dispatch({ type: 'SET_ROLE', payload: role });
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary/20 group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${role === 'Admin' ? 'bg-primary' : 'bg-success'} opacity-70`} />
                    <span className="font-medium">{role}</span>
                  </div>
                  {state.role === role && (
                    <motion.div layoutId="activeRole">
                      <Check size={14} className="text-primary" />
                    </motion.div>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const { state, dispatch } = useApp();

  const handleDateRange = (range) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: range });
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <span className="text-primary-foreground font-bold text-xl leading-none">PFD</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight xs:block">Personal Finance Dashboard</h1>
          </div>
          
          
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:flex items-center bg-secondary/40 rounded-xl p-1 gap-1 border border-border/50">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => handleDateRange(range)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  state.filters.dateRange === range
                    ? 'bg-card text-foreground shadow-sm shadow-black/5'
                    : 'text-muted-foreground/50 hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="h-6 w-[1px] bg-border mx-0.5 opacity-50" />
          <ThemeToggle />
          <div className="h-6 w-[1px] bg-border mx-0.5 opacity-50" />
          <div className="flex items-center gap-2">
            <button 
              onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}
              className="flex p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground border border-border/50"
            >
              <Settings size={18} />
            </button>
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Mobile Date Filter */}
      <div className="flex justify-center items-center lg:hidden sticky top-[57px] md:top-[65px] z-20 w-full bg-background/80 backdrop-blur-md border-b px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 w-max">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2 ml-1">Range:</span>
          {['7d', '30d', '90d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => handleDateRange(range)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                state.filters.dateRange === range
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-secondary/50 text-muted-foreground border-border/50 hover:border-muted-foreground/30'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
