/**
 * Pre-populated mock dataset for RecallOS:
 * - Resources captured from YouTube, Medium, MDN, LeetCode, GitHub, PDFs
 * - Knowledge Graph Nodes & Edges (hierarchical & relational)
 * - Concept Mastery & Knowledge Gap ratings
 * - Pre-compiled Quiz Question banks with explanations
 * - Ask Your Brain citations
 */

export const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    title: 'React Fiber Architecture & Reconciliation Deep Dive',
    url: 'https://github.com/acdlite/react-fiber-architecture',
    platform: 'GitHub',
    domain: 'Frontend',
    tags: ['react', 'fiber', 'reconciliation', 'virtual-dom', 'performance'],
    timeSpentMins: 45,
    summary: 'Explains how the Virtual DOM uses fiber nodes with child, sibling, and return pointers for incremental rendering and prioritization.',
    extractedConcepts: ['Virtual DOM', 'Reconciliation', 'Fiber Node Architecture', 'Time Slicing'],
    masteryScore: 88,
    status: 'Mastered',
    capturedAt: '2026-11-20T10:30:00Z',
    reviewDueDate: '2026-11-28T10:30:00Z',
    reviewIntervalDays: 8,
    notes: 'Virtual DOM is not a real DOM copy; it is a tree of lightweight JS objects. Reconciliation algorithm uses heuristics: elements of different types produce different trees, keys help preserve identity across re-renders.',
  },
  {
    id: 'res-2',
    title: 'A Complete Guide to useEffect & Effect Cleanups',
    url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
    platform: 'Medium',
    domain: 'Frontend',
    tags: ['react', 'hooks', 'useeffect', 'closures', 'synchronization'],
    timeSpentMins: 60,
    summary: 'Dan Abramov’s seminal essay explaining that effects run after paint and capture props and state from the render they belong to.',
    extractedConcepts: ['useEffect Lifecycle', 'Dependency Array Semantics', 'Effect Cleanup', 'Stale Closures'],
    masteryScore: 42, // GAP topic!
    status: 'Needs Revision',
    capturedAt: '2026-11-21T14:15:00Z',
    reviewDueDate: '2026-11-24T14:15:00Z',
    reviewIntervalDays: 1,
    notes: 'Common pitfall: omitting dependencies causes stale closure bugs. Effect cleanups run before re-running the effect and upon component unmount to prevent memory leaks and cancel stale promises.',
  },
  {
    id: 'res-3',
    title: 'Zustand vs Redux Toolkit: Modern State Architecture',
    url: 'https://dev.to/pmndrs/zustand-state-management-simplified',
    platform: 'Dev.to',
    domain: 'Frontend',
    tags: ['zustand', 'redux-toolkit', 'global-state', 'flux'],
    timeSpentMins: 35,
    summary: 'Comparison of lightweight store selectors with Redux slice reducers and boilerplate elimination in modern SPAs.',
    extractedConcepts: ['Global State', 'Selective Re-rendering', 'State Slices', 'Immutability in Stores'],
    masteryScore: 78,
    status: 'Reviewing',
    capturedAt: '2026-11-22T09:00:00Z',
    reviewDueDate: '2026-11-26T09:00:00Z',
    reviewIntervalDays: 4,
    notes: 'Zustand does not wrap components in Context Providers, which avoids re-rendering the whole tree when only a single slice property mutates.',
  },
  {
    id: 'res-4',
    title: 'RESTful API Design & HTTP Status Idempotency',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods',
    platform: 'MDN Docs',
    domain: 'Backend',
    tags: ['http', 'rest', 'idempotency', 'status-codes', 'axios'],
    timeSpentMins: 50,
    summary: 'Detailed RFC guidelines for GET, POST, PUT, DELETE, and PATCH methods with caching headers and idempotency guarantees.',
    extractedConcepts: ['HTTP Idempotency', 'REST Architectural Constraints', 'Status Code Semantics', 'Cache-Control'],
    masteryScore: 92,
    status: 'Mastered',
    capturedAt: '2026-11-19T16:00:00Z',
    reviewDueDate: '2026-12-02T16:00:00Z',
    reviewIntervalDays: 14,
    notes: 'PUT and DELETE are idempotent; POST is not. 200 OK vs 201 Created vs 204 No Content. Handled properly via Axios interceptors.',
  },
  {
    id: 'res-5',
    title: 'Zod: Type-Safe Schema Validation in Frontend Forms',
    url: 'https://zod.dev/?id=basic-usage',
    platform: 'PDF / Document',
    domain: 'Frontend',
    tags: ['zod', 'forms', 'validation', 'typescript', 'schema'],
    timeSpentMins: 40,
    summary: 'Schema declaration, error maps, safeParse vs parse, and integrating dynamic validation errors into controlled React inputs.',
    extractedConcepts: ['Schema Validation', 'safeParse Error Handling', 'Controlled Input State', 'Dynamic Error UI'],
    masteryScore: 85,
    status: 'Mastered',
    capturedAt: '2026-11-22T11:20:00Z',
    reviewDueDate: '2026-11-29T11:20:00Z',
    reviewIntervalDays: 7,
    notes: 'Zod parse throws ZodError; safeParse returns a discriminated union { success: true, data } or { success: false, error } with issues array.',
  },
  {
    id: 'res-6',
    title: 'Binary Search & Two Pointer Patterns for Coding Interviews',
    url: 'https://leetcode.com/explore/learn/card/binary-search/',
    platform: 'LeetCode',
    domain: 'Data Structures',
    tags: ['dsa', 'binary-search', 'two-pointers', 'algorithms', 'time-complexity'],
    timeSpentMins: 75,
    summary: 'Covers edge cases, loop invariants, lower bound vs upper bound binary search, and integer overflow prevention in mid computation.',
    extractedConcepts: ['Binary Search Invariant', 'Two Pointer Technique', 'O(log N) Time Complexity', 'Off-by-one Prevention'],
    masteryScore: 58, // Moderate gap
    status: 'Needs Revision',
    capturedAt: '2026-11-21T18:40:00Z',
    reviewDueDate: '2026-11-25T18:40:00Z',
    reviewIntervalDays: 2,
    notes: 'Always compute mid as low + Math.floor((high - low) / 2) to avoid 32-bit integer overflow in languages with fixed width numbers.',
  },
  {
    id: 'res-7',
    title: 'React 19 Server Actions & Optimistic UI Updates',
    url: 'https://youtube.com/watch?v=react-19-actions',
    platform: 'YouTube',
    domain: 'Frontend',
    tags: ['react19', 'server-actions', 'useoptimistic', 'useactionstate'],
    timeSpentMins: 55,
    summary: 'Interactive breakdown of useActionState, useOptimistic, and asynchronous transitions without manual loading boolean states.',
    extractedConcepts: ['Optimistic UI', 'useActionState Hook', 'Transitions', 'Pending State Handling'],
    masteryScore: 50,
    status: 'Reviewing',
    capturedAt: '2026-11-23T15:00:00Z',
    reviewDueDate: '2026-11-26T15:00:00Z',
    reviewIntervalDays: 3,
    notes: 'Optimistic updates render immediate client speculation and automatically rollback if the underlying server promise rejects.',
  }
];

export const INITIAL_CONCEPTS = [
  {
    id: 'c-1',
    name: 'Virtual DOM & Reconciliation',
    domain: 'Frontend',
    category: 'React Core',
    masteryScore: 88,
    importance: 'High',
    description: 'Declarative UI rendering engine that calculates diffs between virtual trees before touching the browser DOM.',
    resourceCount: 4,
    lastTested: '2026-11-20',
    color: '#6366f1',
  },
  {
    id: 'c-2',
    name: 'useEffect & Side Effects',
    domain: 'Frontend',
    category: 'React Hooks',
    masteryScore: 42, // GAP
    importance: 'Critical',
    description: 'Hook for managing side effects, API subscriptions, event listeners, and cleanups in functional components.',
    resourceCount: 5,
    lastTested: '2026-11-21',
    color: '#f43f5e',
  },
  {
    id: 'c-3',
    name: 'Global State Management',
    domain: 'Frontend',
    category: 'Architecture',
    masteryScore: 78,
    importance: 'High',
    description: 'Decoupling application-wide shared state from UI component tree using Context API and Zustand.',
    resourceCount: 3,
    lastTested: '2026-11-22',
    color: '#8b5cf6',
  },
  {
    id: 'c-4',
    name: 'Form Handling & Zod Validation',
    domain: 'Frontend',
    category: 'Forms',
    masteryScore: 85,
    importance: 'High',
    description: 'Controlled and uncontrolled inputs combined with schema-first validation and dynamic error messaging.',
    resourceCount: 3,
    lastTested: '2026-11-22',
    color: '#10b981',
  },
  {
    id: 'c-5',
    name: 'HTTP & RESTful Principles',
    domain: 'Backend',
    category: 'Networking',
    masteryScore: 92,
    importance: 'Medium',
    description: 'Client-server communication protocols, standard HTTP verb idempotency, headers, and status code taxonomy.',
    resourceCount: 2,
    lastTested: '2026-11-19',
    color: '#06b6d4',
  },
  {
    id: 'c-6',
    name: 'Binary Search & Two Pointers',
    domain: 'Data Structures',
    category: 'Algorithms',
    masteryScore: 58,
    importance: 'High',
    description: 'Divide-and-conquer search technique and multi-pointer space optimization across sorted arrays.',
    resourceCount: 2,
    lastTested: '2026-11-21',
    color: '#f59e0b',
  },
  {
    id: 'c-7',
    name: 'Client-Side Routing',
    domain: 'Frontend',
    category: 'React Router',
    masteryScore: 82,
    importance: 'High',
    description: 'SPA routing with nested layouts, URL search parameters, dynamic route segments, and protected route wrappers.',
    resourceCount: 3,
    lastTested: '2026-11-23',
    color: '#3b82f6',
  },
  {
    id: 'c-8',
    name: 'Server State & React Query',
    domain: 'Frontend',
    category: 'Data Fetching',
    masteryScore: 64,
    importance: 'Critical',
    description: 'Caching, stale-while-revalidate, mutations, and automatic background re-synchronization.',
    resourceCount: 2,
    lastTested: '2026-11-18',
    color: '#ec4899',
  }
];

export const GRAPH_NODES = [
  { id: 'c-1', label: 'Virtual DOM', group: 'Frontend', x: 220, y: 150, size: 28, mastery: 88 },
  { id: 'c-2', label: 'useEffect & Hooks', group: 'Frontend', x: 380, y: 130, size: 30, mastery: 42 },
  { id: 'c-3', label: 'Global State (Zustand)', group: 'Frontend', x: 520, y: 220, size: 26, mastery: 78 },
  { id: 'c-4', label: 'Zod Validation', group: 'Frontend', x: 440, y: 340, size: 24, mastery: 85 },
  { id: 'c-7', label: 'React Router', group: 'Frontend', x: 240, y: 310, size: 25, mastery: 82 },
  { id: 'c-8', label: 'React Query (Server State)', group: 'Frontend', x: 340, y: 230, size: 27, mastery: 64 },
  { id: 'c-5', label: 'REST & HTTP APIs', group: 'Backend', x: 140, y: 230, size: 26, mastery: 92 },
  { id: 'c-6', label: 'Binary Search & DSA', group: 'Data Structures', x: 580, y: 120, size: 22, mastery: 58 },
];

export const GRAPH_EDGES = [
  { source: 'c-1', target: 'c-2', label: 'lifecycle triggers', strength: 0.9 },
  { source: 'c-2', target: 'c-8', label: 'data fetching', strength: 0.8 },
  { source: 'c-8', target: 'c-5', label: 'fetches from', strength: 0.9 },
  { source: 'c-2', target: 'c-3', label: 'syncs with', strength: 0.7 },
  { source: 'c-7', target: 'c-8', label: 'loads route data', strength: 0.6 },
  { source: 'c-4', target: 'c-5', label: 'validates payload', strength: 0.75 },
  { source: 'c-1', target: 'c-7', label: 'renders view', strength: 0.8 },
  { source: 'c-3', target: 'c-4', label: 'holds form state', strength: 0.5 },
];

export const MOCK_QUIZ_QUESTIONS = [
  {
    id: 'q-1',
    conceptId: 'c-2',
    topic: 'useEffect & Side Effects',
    question: 'Why does an empty dependency array `[]` in `useEffect` sometimes lead to stale closure bugs?',
    options: [
      'Because React unmounts the component after the first render.',
      'Because the effect callback permanently captures the initial values of props and state from the first render.',
      'Because empty arrays trigger an infinite re-render loop in React reconciliation.',
      'Because the browser DOM garbage-collects the listener callback automatically.'
    ],
    correctAnswerIndex: 1,
    explanation: 'When an effect has an empty dependency array `[]`, the effect only runs once on mount. Any functions or variables referenced inside it remain closed over the initial render’s values (stale closures), failing to see future state updates.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-2',
    conceptId: 'c-1',
    topic: 'Virtual DOM & Reconciliation',
    question: 'During React’s reconciliation algorithm, what happens when an element switches from `<div>` to `<span>`?',
    options: [
      'React updates the existing DOM node attributes without re-mounting.',
      'React destroys the entire old subtree and builds a completely new DOM tree from scratch.',
      'React converts the span into a div using CSS display: inline.',
      'React pauses rendering until the next animation frame.'
    ],
    correctAnswerIndex: 1,
    explanation: 'React’s diffing heuristic states that whenever the root elements have different types, React tears down the old tree and constructs the new tree from scratch, unmounting any previous state.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-3',
    conceptId: 'c-3',
    topic: 'Global State Management',
    question: 'What is the primary rendering advantage of Zustand over React Context API when updating nested state?',
    options: [
      'Zustand runs in a web worker thread outside JavaScript execution.',
      'Zustand allows components to subscribe only to specific atomic slices of state, preventing unnecessary re-renders of unrelated consumers.',
      'Context API cannot hold arrays or objects in its value prop.',
      'Zustand disables React reconciliation completely.'
    ],
    correctAnswerIndex: 1,
    explanation: 'With React Context, any state change forces every component calling `useContext` to re-render unless partitioned into multiple contexts. Zustand uses selector subscriptions (`useStore(state => state.property)`) so components only re-render when their selected slice changes.',
    difficulty: 'Advanced'
  },
  {
    id: 'q-4',
    conceptId: 'c-4',
    topic: 'Form Handling & Zod Validation',
    question: 'In Zod, what is the key difference between calling `schema.parse(input)` versus `schema.safeParse(input)`?',
    options: [
      'parse encrypts data with SHA-256 while safeParse keeps it plain text.',
      'parse throws an uncaught ZodError exception on failure, whereas safeParse returns a discriminated result object `{ success: true, data }` or `{ success: false, error }`.',
      'safeParse only works for strings, while parse works for objects.',
      'parse operates asynchronously using async/await.'
    ],
    correctAnswerIndex: 1,
    explanation: '`safeParse` is ideal for React form validation because it avoids `try/catch` boilerplate, giving you a clean result object that can be queried to display user-friendly errors.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-5',
    conceptId: 'c-5',
    topic: 'HTTP & RESTful Principles',
    question: 'Which of the following HTTP methods is considered NON-IDEMPOTENT according to RFC specifications?',
    options: [
      'GET',
      'PUT',
      'DELETE',
      'POST'
    ],
    correctAnswerIndex: 3,
    explanation: 'An HTTP method is idempotent if making multiple identical requests has the same effect as making a single request. GET, PUT, and DELETE are idempotent. Calling POST multiple times creates multiple duplicate resources.',
    difficulty: 'Beginner'
  },
  {
    id: 'q-6',
    conceptId: 'c-6',
    topic: 'Binary Search & DSA',
    question: 'To avoid 32-bit signed integer overflow in binary search when `low` and `high` are large positive integers, how should `mid` be calculated?',
    options: [
      'mid = (low + high) / 2',
      'mid = low + Math.floor((high - low) / 2)',
      'mid = (low * high) / 2',
      'mid = high - (low / 2)'
    ],
    correctAnswerIndex: 1,
    explanation: '`low + Math.floor((high - low) / 2)` prevents the intermediate sum `(low + high)` from exceeding the maximum integer limit before division.',
    difficulty: 'Intermediate'
  }
];

export const MOCK_BRAIN_KNOWLEDGE_BASE = [
  {
    id: 'kb-1',
    keywords: ['virtual dom', 'reconciliation', 'fiber', 'diffing'],
    answer: 'The Virtual DOM in React is an in-memory representation of real DOM UI elements. When state changes occur, React creates a new Virtual DOM tree and runs the Reconciliation algorithm (using the Fiber architecture) to determine the minimal number of mutations needed on the real browser DOM.',
    citations: [
      { source: 'React Fiber Architecture Deep Dive', platform: 'GitHub', anchor: 'Section: Incremental Rendering' },
      { source: 'React 19 Core Documentation', platform: 'Docs', anchor: 'Reconciliation Heuristics' }
    ]
  },
  {
    id: 'kb-2',
    keywords: ['useeffect', 'effect cleanup', 'stale closure', 'dependency array'],
    answer: '`useEffect` synchronizes functional components with external systems. To prevent stale closures, include every reactive variable (props & state) read inside the effect in the dependency array. Provide a cleanup return function `() => {...}` to cancel active subscriptions, timers, or abort fetch controllers to prevent race conditions.',
    citations: [
      { source: 'A Complete Guide to useEffect by Dan Abramov', platform: 'Medium', anchor: 'Paragraph 14: Don\'t Lie to React About Dependencies' }
    ]
  },
  {
    id: 'kb-3',
    keywords: ['zod', 'validation', 'safeparse', 'form'],
    answer: 'Zod provides schema-based type-safe validation in React applications. Instead of manual if-else statements across input fields, developers define a schema object `z.object({...})` and invoke `schema.safeParse(formData)`. This yields typed issues and error maps that can be directly mapped to UI field errors.',
    citations: [
      { source: 'Zod Schema Validation in Modern React', platform: 'PDF / Document', anchor: 'Page 3: Form Error Boundaries' }
    ]
  },
  {
    id: 'kb-4',
    keywords: ['zustand', 'redux', 'context', 'state management'],
    answer: 'Zustand is a lightweight, flux-inspired state management library built on React hooks. Unlike React Context (which can cause cascading renders across all context consumers), Zustand uses transient subscriptions and selector functions (`useStore(s => s.item)`) so only components watching the exact changed property re-render.',
    citations: [
      { source: 'Zustand vs Redux Toolkit: Modern State Architecture', platform: 'Dev.to', anchor: 'Section: Performance Benchmarks' }
    ]
  },
  {
    id: 'kb-5',
    keywords: ['radar', 'gap', 'knowledge gap', 'spaced repetition'],
    answer: 'RecallOS Knowledge Gap Radar calculates a normalized 0-100% mastery score across your learning taxonomy by combining quiz scores, retention recency, and resource count. Topics under 60% are flagged as active gaps and queued for immediate revision using the SM-2 spaced repetition engine.',
    citations: [
      { source: 'RecallOS Learning Intelligence Whitepaper', platform: 'RecallOS Core', anchor: 'Retention Algorithm v2.4' }
    ]
  }
];
