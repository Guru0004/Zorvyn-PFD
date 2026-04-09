import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SEEDED_TRANSACTIONS } from '../data/seed';

const PERSISTENCE_KEYS = {
  TRANSACTIONS: 'pf_transactions_v1',
  ROLE: 'pf_role_v1',
  THEME: 'pf_theme_v1',
};


// Initial State
const initialState = {
  transactions: [],
  filters: {
    categories: [],
    dateRange: '30d',
  },
  listFilters: {
    query: '',
    type: 'all',
    sortOrder: 'desc',
  },
  role: 'Admin',
  theme: 'light',
  isInitialLoad: true,
  activeCategoryFilter: null,
  modal: {
    isOpen: false,
    transaction: null,
  },
  settingsModal: {
    isOpen: false,
  },
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'OPEN_SETTINGS':
      return { ...state, settingsModal: { isOpen: true } };
    case 'CLOSE_SETTINGS':
      return { ...state, settingsModal: { isOpen: false } };
    case 'OPEN_MODAL':
      return { ...state, modal: { isOpen: true, transaction: action.payload || null } };
    case 'CLOSE_MODAL':
      return { ...state, modal: { ...state.modal, isOpen: false } };
    case 'SET_TRANSACTIONS':
      if (!action.isInitialLoad) {
        localStorage.setItem(PERSISTENCE_KEYS.TRANSACTIONS, JSON.stringify(action.payload));
      }
      return { ...state, transactions: action.payload, isInitialLoad: false };
    case 'ADD_TRANSACTION':
      const newTransactionsAdd = [action.payload, ...state.transactions];
      localStorage.setItem(PERSISTENCE_KEYS.TRANSACTIONS, JSON.stringify(newTransactionsAdd));
      return { ...state, transactions: newTransactionsAdd };
    case 'EDIT_TRANSACTION':
      const newTransactionsEdit = state.transactions.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      localStorage.setItem(PERSISTENCE_KEYS.TRANSACTIONS, JSON.stringify(newTransactionsEdit));
      return { ...state, transactions: newTransactionsEdit };
    case 'DELETE_TRANSACTION':
      const newTransactionsDelete = state.transactions.filter((t) => t.id !== action.payload);
      localStorage.setItem(PERSISTENCE_KEYS.TRANSACTIONS, JSON.stringify(newTransactionsDelete));
      return { ...state, transactions: newTransactionsDelete };
    case 'SET_QUERY':
      // This is now purely for the transaction list
      return { ...state, listFilters: { ...state.listFilters, query: action.payload } };
    case 'SET_TYPE':
      // This is now purely for the transaction list
      return { ...state, listFilters: { ...state.listFilters, type: action.payload } };
    case 'TOGGLE_SORT':
      const nextSort = state.listFilters.sortOrder === 'desc' ? 'asc' : 'desc';
      return { ...state, listFilters: { ...state.listFilters, sortOrder: nextSort } };
    case 'TOGGLE_CATEGORY':
      const currentCategories = state.filters.categories;
      const newCategories = currentCategories.includes(action.payload)
        ? currentCategories.filter((c) => c !== action.payload)
        : [...currentCategories, action.payload];
      return { ...state, filters: { ...state.filters, categories: newCategories } };
    case 'SET_DATE_RANGE':
      return { ...state, filters: { ...state.filters, dateRange: action.payload } };
    case 'SET_ROLE':
      localStorage.setItem(PERSISTENCE_KEYS.ROLE, action.payload);
      return { ...state, role: action.payload };
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategoryFilter: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: newTheme };
    case 'RESET_DATA':
      localStorage.removeItem(PERSISTENCE_KEYS.TRANSACTIONS);
      return { ...state, transactions: SEEDED_TRANSACTIONS };
    default:
      return state;
  }
}

// Context
const AppContext = createContext(undefined);

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistence Load
  useEffect(() => {
    const savedTransactions = localStorage.getItem(PERSISTENCE_KEYS.TRANSACTIONS);
    const savedRole = localStorage.getItem(PERSISTENCE_KEYS.ROLE);
    const savedTheme = localStorage.getItem(PERSISTENCE_KEYS.THEME);

    const timer = setTimeout(() => {
      if (savedTransactions) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(savedTransactions), isInitialLoad: true });
      } else {
        dispatch({ type: 'SET_TRANSACTIONS', payload: SEEDED_TRANSACTIONS, isInitialLoad: true });
      }
    }, 600);

    return () => clearTimeout(timer);

    if (savedRole) {
      dispatch({ type: 'SET_ROLE', payload: savedRole });
    }

    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch({ type: 'SET_THEME', payload: 'dark' });
    }
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(PERSISTENCE_KEYS.THEME, state.theme);
  }, [state.theme]);


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
