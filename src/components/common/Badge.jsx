/**
 * Unit II: Reusable Badge Component
 * Demonstrates props-driven reusability, conditional styling, and Tailwind utility maps
 */
import React from 'react';

const VARIANT_MAP = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const PLATFORM_MAP = {
  YouTube: 'bg-red-500/15 text-red-400 border-red-500/30',
  Medium: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Coursera: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  LeetCode: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'MDN Docs': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Dev.to': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  GitHub: 'bg-slate-700/50 text-slate-200 border-slate-600',
  'PDF / Document': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
};

export const Badge = ({
  children,
  variant = 'default',
  platform,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const colorClass = platform && PLATFORM_MAP[platform] ? PLATFORM_MAP[platform] : VARIANT_MAP[variant] || VARIANT_MAP.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
};
