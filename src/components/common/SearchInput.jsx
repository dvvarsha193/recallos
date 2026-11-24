/**
 * Unit II: Reusable SearchInput and ProgressBar Components
 * Demonstrates:
 * - Controlled input handling
 * - Accessibility (aria-valuenow, aria-valuemin, aria-valuemax)
 * - Clear action triggers
 */
import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search knowledge vault, concepts, tags...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search query"
          className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = 'indigo',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorVariants = {
    indigo: 'from-indigo-500 to-cyan-400',
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-orange-400',
    rose: 'from-rose-500 to-pink-500',
    purple: 'from-purple-500 to-indigo-500',
  };

  const heightClasses = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium text-slate-400">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-slate-300">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heightClasses}`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out ${
            colorVariants[color] || colorVariants.indigo
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
