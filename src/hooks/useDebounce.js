/**
 * Unit III: Custom Hook for Debouncing Values
 * Demonstrates:
 * - Effect cleanup pattern
 * - Cancelling active setTimeout timers
 * - Preventing unnecessary derived state calculations and re-render spam
 */
import { useState, useEffect } from 'react';

export const useDebounce = (value, delayMs = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Effect cleanup: cancel timer if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
};
