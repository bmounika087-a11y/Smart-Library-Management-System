import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLibrary();

  if (toasts.length === 0) return null;

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
        };

        const bgColors = {
          success: 'bg-white border-emerald-300 shadow-emerald-100 text-emerald-950',
          error: 'bg-white border-red-300 shadow-red-100 text-red-950',
          warning: 'bg-white border-amber-300 shadow-amber-100 text-amber-950',
          info: 'bg-white border-blue-300 shadow-blue-100 text-blue-950'
        };

        return (
          <div
            key={toast.id}
            id={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              bgColors[toast.type]
            }`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              id={`close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
