import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from './UIPrimitives';
import { X, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppProvider';

export function SettingsModal() {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef(null);
  const isOpen = state.settingsModal?.isOpen;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_SETTINGS' });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state.transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `zorvyn-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        
        const data = JSON.parse(result);
        
        // Basic validation: must be an array of objects
        if (Array.isArray(data)) {
          if (confirm('Importing this file will OVERWRITE your current data. Are you sure?')) {
            dispatch({ type: 'SET_TRANSACTIONS', payload: data });
            handleClose();
          }
        } else {
          alert('Invalid data format. Please upload a valid PFD backup file.');
        }
      } catch (err) {
        alert('Failed to parse file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    
    // Clear the input so it triggers again for the same file if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md"
          >
            <Card className="relative shadow-2xl border-primary/20 p-8">
              <button 
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <p className="text-sm text-muted-foreground mb-8">Manage your data and platform preferences.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Data Management</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="secondary" 
                      className="justify-start gap-3 h-12 bg-secondary/50 hover:bg-secondary"
                      onClick={handleExport}
                    >
                      <Download size={18} className="text-primary" />
                      <div className="text-left">
                        <div className="text-sm font-bold">Export Backup</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Save as JSON file</div>
                      </div>
                    </Button>

                    <Button 
                      variant="secondary" 
                      className="justify-start gap-3 h-12 bg-secondary/50 hover:bg-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={18} className="text-success" />
                      <div className="text-left">
                        <div className="text-sm font-bold">Import Backup</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tighter">Restore from JSON file</div>
                      </div>
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImport} 
                      accept=".json" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                  PFD v1.0.0
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
