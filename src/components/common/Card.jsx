/**
 * Unit II: Reusable Card Component
 * Demonstrates component composition patterns (Compound components: Card, Card.Header, Card.Body, Card.Footer)
 */
import React from 'react';

export const Card = ({ children, className = '', hoverable = true, glow = false, onClick }) => {
  const hoverClass = hoverable ? 'glass-panel-hover' : '';
  const glowClass = glow ? 'glow-indigo' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <article
      onClick={onClick}
      className={`glass-panel rounded-2xl p-5 border border-slate-800/80 transition-all ${hoverClass} ${glowClass} ${cursorClass} ${className}`}
    >
      {children}
    </article>
  );
};

export const CardHeader = ({ children, className = '', action }) => (
  <header className={`flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4 ${className}`}>
    <div className="flex-1">{children}</div>
    {action && <div className="ml-3 shrink-0">{action}</div>}
  </header>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <footer className={`pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 ${className}`}>
    {children}
  </footer>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
