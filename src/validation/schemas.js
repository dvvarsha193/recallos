/**
 * Unit IV: Form Handling & Schema-Based Validation using Zod
 * Demonstrates:
 * - Declarative schema definitions
 * - Client-side validation with dynamic error messages
 * - Custom refinement rules and regex validation
 */
import { z } from 'zod';

export const resourceCaptureSchema = z.object({
  url: z
    .string()
    .min(1, 'Resource URL is required')
    .url('Please enter a valid HTTP or HTTPS URL'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  platform: z.enum(['YouTube', 'Medium', 'Coursera', 'LeetCode', 'MDN Docs', 'Dev.to', 'GitHub', 'PDF / Document'], {
    errorMap: () => ({ message: 'Please select a valid platform source' }),
  }),
  domain: z.enum(['Frontend', 'Backend', 'Data Structures', 'System Design', 'AI & Machine Learning', 'DevOps'], {
    errorMap: () => ({ message: 'Please choose an educational domain' }),
  }),
  tags: z
    .string()
    .min(2, 'Provide at least one comma-separated tag (e.g. react, hooks, performance)'),
  summary: z
    .string()
    .min(10, 'Please write a brief note or takeaway (minimum 10 characters)'),
  timeSpentMins: z
    .number({ invalid_type_error: 'Time spent must be a number in minutes' })
    .min(1, 'Minimum learning duration is 1 minute')
    .max(1440, 'Duration cannot exceed 24 hours'),
});

export const manualNoteSchema = z.object({
  title: z.string().min(3, 'Note title must be at least 3 characters'),
  category: z.string().min(2, 'Category is required'),
  content: z.string().min(15, 'Note content must have at least 15 characters of structured knowledge'),
  tags: z.string().min(2, 'Add tags separated by comma'),
});

export const askBrainSchema = z.object({
  query: z
    .string()
    .min(3, 'Query must be at least 3 characters')
    .max(500, 'Query cannot exceed 500 characters'),
  scope: z.enum(['all', 'frontend', 'backend', 'dsa', 'recent'], {
    errorMap: () => ({ message: 'Invalid knowledge scope' }),
  }),
});
