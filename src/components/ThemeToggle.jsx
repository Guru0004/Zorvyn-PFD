import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppProvider';

export function ThemeToggle() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';

  return (
    <motion.button
      onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
      className="relative p-2 rounded-xl overflow-hidden group border border-border/50 hover:border-primary/50 transition-colors bg-secondary/30 backdrop-blur-sm"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle theme"
    >
      {/* Animated Background Glow */}
      <motion.div
        className={`absolute inset-0 opacity-30 blur-2xl transition-colors duration-1000 ${
          isDark ? 'bg-primary' : 'bg-warning'
        }`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Moving Color Burst */}
      <motion.div
        className="absolute -inset-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at center, ${isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(245, 159, 10, 0.2)'} 0%, transparent 70%)`
        }}
        animate={{
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: 15, rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
              exit={{ y: -15, rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 20 
              }}
            >
              <Moon size={20} className="text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 15, rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
              exit={{ y: -15, rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ 
                type: 'spring', 
                stiffness: 260, 
                damping: 20 
              }}
            >
              <Sun size={20} className="text-warning drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orbiting particles for extra "wow" */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
         <div className={`absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isDark ? 'bg-warning' : 'bg-accent'} blur-[1px] opacity-40`} />
      </motion.div>
    </motion.button>
  );
}
