/**
 * Unit V: Client Server Communication & RESTful API Service Layer
 * Demonstrates:
 * - REST architectural principles (GET, POST, PUT, DELETE)
 * - Axios usage patterns with request/response interceptors
 * - Fetch API abstraction
 * - Explicit handling of loading, error, and empty states
 * - Server state management integration with React Query
 */

import axios from 'axios';
import { INITIAL_RESOURCES, INITIAL_CONCEPTS, MOCK_QUIZ_QUESTIONS } from './mockData';
import { deepCopy } from '../utils/immutableHelpers';

const STORAGE_KEYS = {
  RESOURCES: 'recallos_resources_v1',
  CONCEPTS: 'recallos_concepts_v1',
  QUIZZES: 'recallos_quizzes_v1',
};

const getStoredData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
};

// Initialize localStorage if empty
if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
  setStoredData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
}
if (!localStorage.getItem(STORAGE_KEYS.CONCEPTS)) {
  setStoredData(STORAGE_KEYS.CONCEPTS, INITIAL_CONCEPTS);
}
if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
  setStoredData(STORAGE_KEYS.QUIZZES, MOCK_QUIZ_QUESTIONS);
}

// Axios Mock Client with Interceptor (Unit V)
export const apiClient = axios.create({
  baseURL: 'https://api.recallos.local/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Syllabus': 'INT252-ReactJS',
  },
});

// Interceptor demonstration: logging and headers
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    return config;
  },
  (error) => Promise.reject(error)
);

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // GET /api/resources (Demonstrates REST GET & Fetch/Axios pattern)
  async getResources() {
    await delay(300);
    const data = getStoredData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    return deepCopy(data);
  },

  // POST /api/resources (Demonstrates REST POST)
  async createResource(newResource) {
    await delay(400);
    const resources = getStoredData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const item = {
      ...newResource,
      id: `res-${Date.now()}`,
      capturedAt: new Date().toISOString(),
      reviewDueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      reviewIntervalDays: 3,
      masteryScore: 65,
      status: 'Reviewing',
      extractedConcepts: newResource.extractedConcepts || ['New Topic'],
    };
    const updated = [item, ...resources];
    setStoredData(STORAGE_KEYS.RESOURCES, updated);
    return deepCopy(item);
  },

  // DELETE /api/resources/:id (Demonstrates REST DELETE idempotency)
  async deleteResource(id) {
    await delay(250);
    const resources = getStoredData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    const updated = resources.filter((r) => r.id !== id);
    setStoredData(STORAGE_KEYS.RESOURCES, updated);
    return { success: true, id };
  },

  // GET /api/concepts
  async getConcepts() {
    await delay(250);
    const data = getStoredData(STORAGE_KEYS.CONCEPTS, INITIAL_CONCEPTS);
    return deepCopy(data);
  },

  // PUT /api/concepts/:id/mastery (Demonstrates REST PUT idempotency)
  async updateConceptMastery(conceptId, newMasteryScore) {
    await delay(200);
    const concepts = getStoredData(STORAGE_KEYS.CONCEPTS, INITIAL_CONCEPTS);
    const updated = concepts.map((c) =>
      c.id === conceptId
        ? {
            ...c,
            masteryScore: Math.min(100, Math.max(0, newMasteryScore)),
            lastTested: new Date().toISOString().split('T')[0],
          }
        : c
    );
    setStoredData(STORAGE_KEYS.CONCEPTS, updated);
    return updated.find((c) => c.id === conceptId);
  },

  // GET /api/quizzes
  async getQuizzes() {
    await delay(300);
    const data = getStoredData(STORAGE_KEYS.QUIZZES, MOCK_QUIZ_QUESTIONS);
    return deepCopy(data);
  },

  // POST /api/quizzes/generate
  async generateAdaptiveQuiz(topicFilter = null) {
    await delay(500);
    const all = getStoredData(STORAGE_KEYS.QUIZZES, MOCK_QUIZ_QUESTIONS);
    if (!topicFilter || topicFilter === 'all') {
      return deepCopy(all);
    }
    const filtered = all.filter(
      (q) => q.conceptId === topicFilter || q.topic.toLowerCase().includes(topicFilter.toLowerCase())
    );
    return deepCopy(filtered.length > 0 ? filtered : all);
  },

  // Simulated Axios REST fetcher for Practical 11 demo
  async testAxiosRequest(endpoint) {
    await delay(400);
    if (endpoint === 'error') {
      throw new Error('HTTP 500: Server Internal Error Simulated via Axios');
    }
    return {
      status: 200,
      statusText: 'OK',
      client: 'Axios 1.7+ Instance',
      headers: { 'content-type': 'application/json' },
      data: {
        timestamp: new Date().toISOString(),
        totalResources: getStoredData(STORAGE_KEYS.RESOURCES, []).length,
        syncStatus: 'Background Sync Active',
      },
    };
  },

  // POST /api/ai/analyze-url
  async analyzeUrl(url) {
    await delay(800);
    const hostname = (() => {
      try {
        return new URL(url).hostname;
      } catch {
        return 'web-resource';
      }
    })();

    let platform = 'Medium';
    let domain = 'Frontend';
    let title = 'Extracted Learning Resource from ' + hostname;
    let extractedConcepts = ['Core Principles', 'Architecture', 'Best Practices'];
    let summary = 'AI Extracted Insights: Key fundamentals, syntax conventions, and common development bottlenecks.';

    if (url.includes('youtube') || url.includes('youtu.be')) {
      platform = 'YouTube';
      title = 'Mastering Modern React 19 State & Async Actions';
      extractedConcepts = ['React 19 Actions', 'Optimistic UI', 'useActionState'];
      summary =
        'Video tutorial breakdown: Detailed exploration of client transitions, eliminating manual isLoading booleans, and integrating with server actions.';
    } else if (url.includes('leetcode')) {
      platform = 'LeetCode';
      domain = 'Data Structures';
      title = 'LeetCode Problem Analysis & Algorithmic Patterns';
      extractedConcepts = ['Time Complexity O(N)', 'Space Optimization', 'Edge Case Handling'];
      summary =
        'Optimal approach using two pointers with constant extra memory. Invariant proof and bounds verification included.';
    } else if (url.includes('github')) {
      platform = 'GitHub';
      title = 'Open Source Codebase & Architecture Specification';
      extractedConcepts = ['Repository Structure', 'Design Patterns', 'Code Modularity'];
      summary =
        'Analysis of module boundaries, clean dependency injection, and reusable component composition patterns.';
    }

    return {
      title,
      platform,
      domain,
      tags: extractedConcepts.map((c) => c.toLowerCase().replace(/\s+/g, '-')).join(', '),
      summary,
      extractedConcepts,
      timeSpentMins: 30,
    };
  },
};
