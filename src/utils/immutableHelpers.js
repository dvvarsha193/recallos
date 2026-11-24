/**
 * Unit I: Immutability Principles, Functional Programming & ES6+ Utilities
 * Demonstrates:
 * - Pure arrow functions
 * - Spread and rest operators
 * - Destructuring assignments
 * - Array iteration & transformation (map, filter, reduce)
 * - Deep & shallow copying
 * - Referential equality and state comparison
 */

// Deep copy using native structuredClone with JSON fallback
export const deepCopy = (obj) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
};

// Shallow copy helper using spread operator
export const shallowCopy = (obj) => ({ ...obj });

// Referential equality check and shallow comparison
export const shallowEqual = (objA, objB) => {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.prototype.hasOwnProperty.call(objB, key) && Object.is(objA[key], objB[key]));
};

// Immutable item addition
export const addItemImmutable = (list, item) => [...list, item];

// Immutable item update
export const updateItemImmutable = (list, id, patch) =>
  list.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));

// Immutable item removal
export const removeItemImmutable = (list, id) => list.filter((item) => item.id !== id);

// Immutable property toggle
export const togglePropertyImmutable = (list, id, prop) =>
  list.map((item) => (item.id === id ? { ...item, [prop]: !item[prop] } : item));

// Functional array reduction: Calculate topic mastery aggregation
export const computeMasteryAverages = (topics) => {
  if (!topics || topics.length === 0) return { overall: 0, count: 0, byDomain: {} };

  const initialAcc = { totalScore: 0, count: 0, byDomain: {} };

  const { totalScore, count, byDomain } = topics.reduce((acc, curr) => {
    const domain = curr.domain || 'General';
    const score = Number(curr.masteryScore) || 0;

    const currentDomainStats = acc.byDomain[domain] || { sum: 0, count: 0 };
    return {
      totalScore: acc.totalScore + score,
      count: acc.count + 1,
      byDomain: {
        ...acc.byDomain,
        [domain]: {
          sum: currentDomainStats.sum + score,
          count: currentDomainStats.count + 1,
        },
      },
    };
  }, initialAcc);

  const domainAverages = Object.entries(byDomain).reduce((acc, [domain, { sum, count }]) => {
    return {
      ...acc,
      [domain]: Math.round(sum / count),
    };
  }, {});

  return {
    overall: Math.round(totalScore / count),
    count,
    byDomain: domainAverages,
  };
};

// Spaced repetition interval calculator (simplified SM-2 algorithm)
export const calculateNextRevision = (currentIntervalDays, scorePercent) => {
  let nextInterval;
  if (scorePercent >= 80) {
    nextInterval = currentIntervalDays === 0 ? 1 : Math.round(currentIntervalDays * 2.2);
  } else if (scorePercent >= 50) {
    nextInterval = currentIntervalDays === 0 ? 1 : Math.round(currentIntervalDays * 1.3);
  } else {
    nextInterval = 1; // reset for weak concepts
  }
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + nextInterval);
  return {
    intervalDays: nextInterval,
    nextReviewDate: dueDate.toISOString(),
  };
};

// Date relative formatter
export const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Just now';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};
