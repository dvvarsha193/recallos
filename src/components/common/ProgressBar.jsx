/**
 * Unit II: Reusable ProgressBar Component
 * Demonstrates:
 * - Controlled value scaling
 * - Accessibility (role=progressbar, aria-valuenow, aria-valuemin, aria-valuemax)
 * - Tailwind gradient transitions
 */
import React from 'react';

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
