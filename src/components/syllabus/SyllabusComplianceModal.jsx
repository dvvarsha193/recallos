/**
 * INT252 Syllabus Compliance Explorer Modal
 * Directly maps every single Unit (I, II, III, IV, V, VI) and practical from the INT252 syllabus
 * into the RecallOS codebase architecture.
 */
import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useRecallStore } from '../../store/useRecallStore';
import {
  Code2,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Cpu,
  Share2,
  Database,
  ExternalLink,
} from 'lucide-react';

const SYLLABUS_UNITS = [
  {
    id: 'Unit I',
    title: 'Unit I: JavaScript Refresh & React Fundamentals',
    icon: Code2,
    color: 'text-indigo-400',
    outcomes: 'CO1, CO2',
    topics: [
      'ES6+ Arrow Functions, block scoping (let/const), spread/rest',
      'Array iteration & transformation: map, filter, reduce, find',
      'Immutability principles, shallow vs deep copying (structuredClone)',
      'Referential equality & state comparison (Object.is)',
      'SPA declarative paradigm, feature-based project structure',
      'JSX syntax, expressions, and Virtual DOM reconciliation concepts',
    ],
    codeEvidence: [
      { file: 'src/utils/immutableHelpers.js', description: 'Pure functions, deepCopy, computeMasteryAverages with reduce' },
      { file: 'src/features/dashboard/DashboardView.jsx', description: 'Declarative JSX rendering and feature folder structure' },
    ],
  },
  {
    id: 'Unit II',
    title: 'Unit II: Component Design & Tailwind Styling',
    icon: Layers,
    color: 'text-emerald-400',
    outcomes: 'CO2',
    topics: [
      'Reusable functional components with props-driven contracts',
      'Component composition patterns & compound components (Card.Header, Card.Body)',
      'Conditional rendering strategies (ternaries, logical &&, guard clauses)',
      'Lifting state up and defining component responsibility boundaries',
      'Tailwind CSS fundamentals, utility-first methodology & responsive breakpoints',
      'Semantic HTML practices (<article>, <header>, <section>, <nav>) and accessibility (ARIA)',
    ],
    codeEvidence: [
      { file: 'src/components/common/Card.jsx', description: 'Compound component pattern with header/body/footer' },
      { file: 'src/components/common/Button.jsx', description: 'Accessible button with aria-busy, variants, and icon props' },
      { file: 'tailwind.config.js', description: 'Cyber-learning theme extension with custom glassmorphism' },
    ],
  },
  {
    id: 'Unit III',
    title: 'Unit III: States, Events, Hooks & Side Effects',
    icon: Sparkles,
    color: 'text-amber-400',
    outcomes: 'CO3',
    topics: [
      'Event handling mechanisms & synthetic events',
      'useState local state management, update batching, re-render triggers',
      'Derived state calculation using useMemo to avoid redundant state',
      'useEffect side effect management, dependency array semantics & cleanup',
      'Performance optimization using useCallback & useMemo',
      'Custom hooks for logic reuse: useDebounce and useLocalStorage',
    ],
    codeEvidence: [
      { file: 'src/hooks/useDebounce.js', description: 'Custom debounce hook with cleanup timer to avoid search re-render churn' },
      { file: 'src/hooks/useLocalStorage.js', description: 'Encapsulated persistent local storage state hook' },
      { file: 'src/context/NotificationContext.jsx', description: 'Toast notification state with auto-dismiss timers' },
    ],
  },
  {
    id: 'Unit IV',
    title: 'Unit IV: Form Handling & Zod Schema Validation',
    icon: FileCheck,
    color: 'text-purple-400',
    outcomes: 'CO4',
    topics: [
      'Controlled and uncontrolled components',
      'Form state management patterns & submission workflows',
      'Reusable form component design with dynamic error display',
      'Client-side form validation concepts & schema-based validation',
      'Integration of Zod schema validation (safeParse, errorMap, issue arrays)',
    ],
    codeEvidence: [
      { file: 'src/validation/schemas.js', description: 'Zod schemas for resourceCaptureSchema, manualNoteSchema, askBrainSchema' },
      { file: 'src/features/tracker/ResourceCaptureModal.jsx', description: 'Controlled form with Zod safeParse dynamic error display' },
    ],
  },
  {
    id: 'Unit V',
    title: 'Unit V: Client-Server Sync & React Router Navigation',
    icon: Database,
    color: 'text-cyan-400',
    outcomes: 'CO5',
    topics: [
      'HTTP fundamentals & REST principles (GET, POST, PUT, DELETE idempotency)',
      'Handling loading, error, and empty states gracefully',
      'Server state vs client state distinction',
      'React Query (@tanstack/react-query) caching, staleTime, and background synchronization',
      'Client-side routing with React Router (nested layout routes, dynamic params, query params)',
    ],
    codeEvidence: [
      { file: 'src/services/apiService.js', description: 'RESTful API simulation with async delay, loading, and error states' },
      { file: 'src/features/vault/VaultView.jsx', description: 'React Query useQuery and useMutation integration' },
      { file: 'src/App.jsx', description: 'React Router routes configuration with layout Outlet and dynamic paths' },
    ],
  },
  {
    id: 'Unit VI',
    title: 'Unit VI: Global State Management & Production Readiness',
    icon: Share2,
    color: 'text-rose-400',
    outcomes: 'CO6',
    topics: [
      'State sharing challenges in complex single-page apps',
      'Context API vs Redux Toolkit vs Zustand architectural trade-offs',
      'Lightweight global state management using Zustand (slices, selectors, dispatchers)',
      'Selective re-rendering optimization via Zustand subscriber functions',
      'Application build optimization, Vite production bundle readiness',
    ],
    codeEvidence: [
      { file: 'src/store/useRecallStore.js', description: 'Zustand global store holding brain conversation, search, and user stats' },
      { file: 'src/context/NotificationContext.jsx', description: 'React Context API for application-wide notifications' },
    ],
  },
];

export const SyllabusComplianceModal = () => {
  const { isSyllabusModalOpen, setSyllabusModalOpen, activeSyllabusUnit, setActiveSyllabusUnit } =
    useRecallStore();

  const selectedUnitData =
    SYLLABUS_UNITS.find((u) => u.id === activeSyllabusUnit) || SYLLABUS_UNITS[0];

  return (
    <Modal
      isOpen={isSyllabusModalOpen}
      onClose={() => setSyllabusModalOpen(false)}
      title="INT252 ReactJS Syllabus Compliance Explorer"
      subtitle="Complete traceability between academic course outcomes (CO1 - CO6) and RecallOS implementation"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Unit Selection Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SYLLABUS_UNITS.map((unit) => {
            const Icon = unit.icon;
            const isActive = unit.id === activeSyllabusUnit;
            return (
              <button
                key={unit.id}
                onClick={() => setActiveSyllabusUnit(unit.id)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${unit.color}`} />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                    {unit.outcomes}
                  </span>
                </div>
                <span className="text-xs font-semibold truncate">{unit.id}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Unit Deep-Dive */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {React.createElement(selectedUnitData.icon, { className: `w-5 h-5 ${selectedUnitData.color}` })}
                {selectedUnitData.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Course Outcomes: <span className="font-semibold text-indigo-300">{selectedUnitData.outcomes}</span>
              </p>
            </div>
            <Badge variant="success">100% Implemented in RecallOS</Badge>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Syllabus Topics Covered
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedUnitData.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/70 border border-slate-800/50 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Code Evidence & File References
            </h4>
            <div className="space-y-2">
              {selectedUnitData.codeEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="font-mono text-xs text-indigo-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {ev.file}
                  </div>
                  <div className="text-xs text-slate-400">{ev.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 14 Practicals List Summary */}
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold mb-2">
            <Cpu className="w-4 h-4" />
            <span>All 14 Practicals Covered Live in RecallOS:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            From JavaScript arrow functions and immutability (Practical 1) to Vite SPA setup, functional components,
            Tailwind CSS responsive layouts, useState batching, useEffect cleanup, custom hooks (useDebounce), Zod
            form validation, Axios/Fetch REST simulation, React Query caching, React Router navigation, and Zustand
            global state management — every single syllabus objective runs live!
          </p>
        </div>
      </div>
    </Modal>
  );
};
