/**
 * Unit V & Practical 13: Protected Route Implementation
 * Demonstrates:
 * - Route guards in React Router
 * - Conditional redirection using <Navigate /> and location state
 * - Access control verification before rendering sensitive views
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecallStore } from '../../store/useRecallStore';

export const ProtectedRoute = ({ children }) => {
  const { isProAuthorized } = useRecallStore();
  const location = useLocation();

  if (!isProAuthorized) {
    // Redirect to login or unauthorized view with return path
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};
