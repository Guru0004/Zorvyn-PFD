import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './UIPrimitives';
import { X, Save } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment Return', 'Gifts', 'Other Income'];
const EXPENSE_CATEGORIES = ['Dining', 'Food & Groceries', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'General'];

export function TransactionModal({ isOpen, onClose, transaction }) {
  const { dispatch } = useTransactions();
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    category: 'General',
    type: 'expense',
    date: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
    if (transaction) {
      setFormData({
        ...transaction,
        amount: Math.abs(transaction.amount)
      });
    } else {
      setFormData({
        description: '',
        amount: 0,
        category: 'General',
        type: 'expense',
        date: new Date().toISOString(),
      });
    }
  }, [transaction, isOpen]);

  const validate = React.useCallback(() => {
    const newErrors = {};
    
    const alphaCount = (formData.description || '').replace(/[^a-zA-Z]/g, '').length;
    if (alphaCount < 3) {
      newErrors.description = 'Description must contain at least 3 letters';
    }

    if (!formData.amount || formData.amount < 1) {
      newErrors.amount = 'Amount must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.description, formData.amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const finalTransaction = {
      ...formData,
      id: transaction?.id || `t_${Date.now()}`,
      amount: formData.type === 'expense' ? -Math.abs(formData.amount || 0) : Math.abs(formData.amount || 0),
    };

    if (transaction) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: finalTransaction });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: finalTransaction });
    }
    
    onClose();
  };
  
  const categories = React.useMemo(() => 
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES,
    [formData.type]
  );

  useEffect(() => {
    if (!categories.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, formData.category]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg md:h-auto max-h-[95vh] overflow-y-auto no-scrollbar"
          >
            <Card className="relative shadow-2xl border-primary/20 p-4 md:p-8">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-6">
                {transaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input
                    required
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none ${errors.description ? 'border-destructive/50' : ''}`}
                    placeholder="e.g. Weekly Groceries"
                  />
                  {errors.description && <p className="text-[10px] font-bold text-destructive uppercase tracking-wider">{errors.description}</p>}
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="1"
                      value={formData.amount === 0 ? '' : formData.amount}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setFormData({ ...formData, amount: val });
                      }}
                      className={`w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none ${errors.amount ? 'border-destructive/50' : ''}`}
                      placeholder="0.00"
                    />
                    {errors.amount && <p className="text-[10px] font-bold text-destructive uppercase tracking-wider">{errors.amount}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      required
                      type="date"
                      value={formData.date?.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                      className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <Save size={18} />
                    {transaction ? 'Update' : 'Save'} Transaction
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
