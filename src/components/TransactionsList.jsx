import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Card, Button } from './UIPrimitives';
import { Search, Filter, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight, ArrowUpDown, Trash2, Edit } from 'lucide-react';
import { formatCurrency, formatDate, getRelativeDate } from '../utils/formatUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionModal } from './TransactionModal';

export function TransactionsList() {
  const { transactions, listFilters, dispatch, role } = useTransactions();
  const [searchTerm, setSearchTerm] = useState(listFilters.query);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 10);

  const handleAdd = () => {
    dispatch({ type: 'OPEN_MODAL' });
  };

  const handleEdit = (t) => {
    dispatch({ type: 'OPEN_MODAL', payload: t });
    setActiveMenuId(null);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
    setActiveMenuId(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch({ type: 'SET_QUERY', payload: value });
  };

  const handleTypeFilter = (type) => {
    dispatch({ type: 'SET_TYPE', payload: type });
  };

  const toggleSort = () => {
    dispatch({ type: 'TOGGLE_SORT' });
  };

  return (
    <Card className="flex flex-col gap-6 relative">
      <div className="flex flex-row md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
        
        <div className="flex items-center gap-2">
          {role === 'Admin' && (
            <Button className="gap-2" onClick={handleAdd}>
              <Plus size={16} />
              Add
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
          <input
            name='search'
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm shadow-black/5"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-between sm:justify-start gap-1 bg-secondary/40 p-1 rounded-xl border border-border/50 flex-1">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  listFilters.type === type
                    ? 'bg-card text-foreground shadow-sm shadow-black/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <button
            onClick={toggleSort}
            className={`p-2.5 rounded-xl border border-border/50 bg-secondary/40 hover:bg-secondary/60 transition-all ${
              listFilters.sortOrder === 'asc' ? 'text-primary' : 'text-muted-foreground'
            }`}
            title="Toggle Sort Order"
          >
            <ArrowUpDown size={17} />
          </button>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              <th className="px-4 py-4">Transaction</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4 text-right">Amount</th>
              {role !== 'Viewer' && <th className="px-4 py-4 w-12 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y relative">
            <AnimatePresence mode="popLayout">
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((t, index) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.01 }}
                    key={t.id}
                    className="group hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                          {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <span className="font-semibold text-sm line-clamp-1">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-lg bg-secondary/50 text-secondary-foreground border border-border/30">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{getRelativeDate(t.date)}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{formatDate(t.date)}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-5 text-right font-bold text-sm ${t.type === 'income' ? 'text-success' : ''}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                    </td>
                    {role !== 'Viewer' && (
                      <td className="px-4 py-5 text-center relative overflow-visible">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                            className={`p-2 rounded-lg transition-all border border-transparent ${
                              activeMenuId === t.id 
                              ? 'bg-secondary border-border text-foreground' 
                              : 'text-muted-foreground hover:bg-secondary hover:border-border'
                            }`}
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          
                          <AnimatePresence>
                            {activeMenuId === t.id && (
                              <>
                                <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                  className="absolute right-0 top-1/2 -translate-y-1/2 mr-10 z-40 bg-card border rounded-xl shadow-2xl p-1.5 flex flex-row items-center gap-1 min-w-max glass"
                                >
                                  <button
                                    onClick={() => handleEdit(t)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-secondary text-foreground transition-all"
                                  >
                                    <Edit size={14} className="text-primary" />
                                    Edit
                                  </button>
                                  {role === 'Admin' && (
                                    <button
                                      onClick={() => handleDelete(t.id)}
                                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-destructive/10 text-destructive transition-all"
                                    >
                                      <Trash2 size={14} />
                                      Delete
                                    </button>
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'Viewer' ? 4 : 5} className="px-4 py-12 text-center text-muted-foreground">
                    <EmptyState dispatch={dispatch} />
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedTransactions.length > 0 ? (
            displayedTransactions.map((t, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={t.id}
                className="group p-4 rounded-2xl border border-border/50 bg-secondary/5 relative"
              >
                <div 
                  className={`flex items-center gap-4 ${role !== 'Viewer' ? 'cursor-pointer' : ''}`} 
                  onClick={role !== 'Viewer' ? () => setActiveMenuId(activeMenuId === t.id ? null : t.id) : undefined}
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm truncate">{t.description}</span>
                      <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-success' : ''}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{t.category}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] text-muted-foreground uppercase">{getRelativeDate(t.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {role !== 'Viewer' && activeMenuId === t.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-2 pt-2 border-t border-border/50 flex gap-2"
                    >
                      <button
                        onClick={() => handleEdit(t)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary/80 text-[10px] font-bold uppercase tracking-wider text-foreground active:scale-[0.98]"
                      >
                        <Edit size={14} className="text-primary" />
                        Edit
                      </button>
                      {role === 'Admin' && (
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-destructive/10 text-[10px] font-bold uppercase tracking-wider text-destructive active:scale-[0.98]"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl">
              <EmptyState dispatch={dispatch} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {transactions.length > 10 && (
        <div className="pt-4 flex justify-center border-t border-border/30">
          <Button
            variant="secondary"
            onClick={() => setShowAll(!showAll)}
            className="w-full sm:w-auto text-[10px] font-bold uppercase tracking-widest gap-2 bg-secondary/40 hover:bg-secondary/60 py-2.5 px-6 rounded-xl border border-border/50"
          >
            {showAll ? 'Show Less' : `Show ${transactions.length - 10} More`}
          </Button>
        </div>
      )}
    </Card>
  );
}

function EmptyState({ dispatch }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Filter size={32} className="opacity-20" />
      <p className="text-sm">No transactions found matching your filters.</p>
      <Button 
        variant="ghost" 
        size="sm"
        className="mt-2"
        onClick={() => {
          dispatch({ type: 'SET_QUERY', payload: '' });
          dispatch({ type: 'SET_TYPE', payload: 'all' });
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
}
