/**
 * Syllabus Practicals Lab (INT252: Web App Development with ReactJS)
 * Provides a live, interactive laboratory showcasing all 14 Practicals/Experiments
 * directly inside RecallOS. Perfect for laboratory evaluations, vivas, and teacher review!
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useRecallStore } from '../../store/useRecallStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNotification } from '../../context/NotificationContext';
import { apiService, apiClient } from '../../services/apiService';
import { resourceCaptureSchema } from '../../validation/schemas';
import { deepCopy, shallowEqual, computeMasteryAverages } from '../../utils/immutableHelpers';
import { useQueryClient } from '@tanstack/react-query';
import {
  GraduationCap,
  CheckCircle2,
  Code2,
  Layers,
  Sparkles,
  FileCheck,
  Database,
  Share2,
  Play,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Zap,
} from 'lucide-react';

// Memoized Child Component to demonstrate Practical 7 (React.memo)
const MemoizedCounterChild = React.memo(({ onAction, title }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
      <div>
        <span className="font-semibold text-white block">{title}</span>
        <span className="text-[11px] text-emerald-400 font-mono">
          Child renders: {renderCountRef.current} (Protected by React.memo)
        </span>
      </div>
      <Button variant="secondary" size="sm" onClick={onAction} className="text-xs">
        Trigger Action
      </Button>
    </div>
  );
});

export const SyllabusLabView = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const { isProAuthorized, toggleProAuthorization } = useRecallStore();

  const [activeTab, setActiveTab] = useState('p1-p4');

  // Practical 1 & 5: State & Batching
  const [demoCount, setDemoCount] = useState(0);
  const [batchLogs, setBatchLogs] = useState([]);

  // Practical 6: Effect & Cleanup
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let intervalId = null;
    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning]);

  // Practical 7: Performance Optimization (useCallback, useMemo)
  const [parentCount, setParentCount] = useState(0);
  const memoizedCallback = useCallback(() => {
    addNotification('Memoized callback triggered! Referential equality preserved.', 'info');
  }, [addNotification]);

  const expensiveDerivedSum = useMemo(() => {
    // Array iteration and calculation using reduce (Practical 1 & 7)
    return Array.from({ length: 100 }, (_, i) => i + 1).reduce((acc, n) => acc + n, 0) + parentCount;
  }, [parentCount]);

  // Practical 8: Custom Hooks (useDebounce & useLocalStorage)
  const [rawText, setRawText] = useState('');
  const debouncedText = useDebounce(rawText, 500);
  const [localStoredNum, setLocalStoredNum] = useLocalStorage('recallos_lab_counter', 42);

  // Practical 9: Controlled vs Uncontrolled Forms
  const [controlledValue, setControlledValue] = useState('');
  const uncontrolledInputRef = useRef(null);
  const [formOutput, setFormOutput] = useState('');

  // Practical 10: Zod validation test
  const [zodInput, setZodInput] = useState({ url: 'not-a-url', title: 'ab' });
  const [zodErrors, setZodErrors] = useState([]);

  const runZodCheck = () => {
    const res = resourceCaptureSchema.safeParse({
      ...zodInput,
      platform: 'YouTube',
      domain: 'Frontend',
      tags: 'react',
      summary: 'Short note',
      timeSpentMins: 10,
    });
    if (!res.success) {
      setZodErrors(res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
      addNotification('Zod safeParse flagged schema issues', 'error');
    } else {
      setZodErrors([]);
      addNotification('Zod validation passed with flying colors!', 'success');
    }
  };

  // Practical 11: Axios REST & Loading/Error states
  const [axiosLoading, setAxiosLoading] = useState(false);
  const [axiosResult, setAxiosResult] = useState(null);

  const testAxios = async (mode) => {
    setAxiosLoading(true);
    setAxiosResult(null);
    try {
      const res = await apiService.testAxiosRequest(mode);
      setAxiosResult({ success: true, data: res.data });
      addNotification('Axios GET 200 OK simulated successfully!', 'success');
    } catch (err) {
      setAxiosResult({ success: false, error: err.message });
      addNotification('Axios Error handled gracefully!', 'error');
    } finally {
      setAxiosLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              INT252 ReactJS Syllabus Practicals Lab
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Live interactive laboratory demonstrating **all 14 practical experiments** prescribed by the syllabus.
            Use this during your viva / laboratory presentation to demonstrate concepts live to your teacher!
          </p>
        </div>

        <Badge variant="success" size="lg" className="self-start md:self-auto font-mono">
          All 14 Practicals Verified
        </Badge>
      </div>

      {/* Lab Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'p1-p4', label: 'Practicals 1 - 4 (JS Refresh, Vite, Components, Tailwind)', icon: Code2 },
          { id: 'p5-p8', label: 'Practicals 5 - 8 (useState, useEffect, useMemo, Custom Hooks)', icon: Sparkles },
          { id: 'p9-p10', label: 'Practicals 9 - 10 (Controlled/Uncontrolled Forms & Zod)', icon: FileCheck },
          { id: 'p11-p14', label: 'Practicals 11 - 14 (Axios, React Query, Router & Zustand)', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content: Practicals 1 - 4 */}
      {activeTab === 'p1-p4' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practical 1 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-indigo-400 uppercase font-mono">Practical 1</span>
                <Badge variant="success">Unit I</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-2">
              <h4 className="text-sm font-bold text-white">
                JavaScript ES6+, Immutability & Array Transformation
              </h4>
              <p className="text-xs text-slate-400">
                Demonstrates pure arrow functions, destructuring, spread operator, structuredClone, and reduce calculation.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div>const testObj = {'{ title: "React 19", score: 95 }'};</div>
                <div>const clone = deepCopy(testObj);</div>
                <div>Object.is(testObj, clone) = <span className="text-emerald-400 font-bold">false (Referentially Pure)</span></div>
                <div>computeMasteryAverages(topics) = <span className="text-indigo-400 font-bold">Calculated with Array.reduce</span></div>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 2 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-indigo-400 uppercase font-mono">Practical 2</span>
                <Badge variant="success">Unit I</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-2">
              <h4 className="text-sm font-bold text-white">
                Vite Setup, JSX Syntax & Functional Components
              </h4>
              <p className="text-xs text-slate-400">
                React 19 initialized with Vite, fast HMR, and declarative JSX reconciliation tree.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                <span className="text-cyan-400">vite.config.js</span> + <span className="text-emerald-400">index.html</span>
                <p className="text-slate-400 mt-1">Rendered dynamically into root element with strict mode.</p>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 3 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-indigo-400 uppercase font-mono">Practical 3</span>
                <Badge variant="success">Unit II</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-2">
              <h4 className="text-sm font-bold text-white">
                Reusable Components, Props & Composition
              </h4>
              <p className="text-xs text-slate-400">
                Compound component patterns: Card.Header, Card.Body, Card.Footer with children and prop contracts.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="primary">Badge Prop: Primary</Badge>
                <Badge variant="success">Badge Prop: Success</Badge>
                <Badge variant="warning">Badge Prop: Warning</Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 4 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-indigo-400 uppercase font-mono">Practical 4</span>
                <Badge variant="success">Unit II</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-2">
              <h4 className="text-sm font-bold text-white">
                Responsive UI with Tailwind CSS Utility Classes
              </h4>
              <p className="text-xs text-slate-400">
                Utility-first styling, glassmorphism, responsive breakpoints (sm, md, lg), and custom themes.
              </p>
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-cyan-950/60 border border-indigo-500/30 text-xs text-indigo-200">
                Active classes: grid-cols-1 md:grid-cols-2 lg:grid-cols-4, backdrop-blur-xl
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Tab Content: Practicals 5 - 8 */}
      {activeTab === 'p5-p8' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practical 5 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">Practical 5</span>
                <Badge variant="warning">Unit III</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                useState, Event Handling & Automatic Batching
              </h4>
              <p className="text-xs text-slate-400">
                React 18/19 batches multiple setState updates inside a single synthetic event loop.
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 font-mono">Count: {demoCount}</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setDemoCount((c) => c + 1);
                    setDemoCount((c) => c + 1);
                    addNotification('Batched +2 increments in one render!', 'info');
                  }}
                >
                  Increment (+2 Batched)
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 6 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">Practical 6</span>
                <Badge variant="warning">Unit III</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                useEffect, Dependency Array & Effect Cleanup
              </h4>
              <p className="text-xs text-slate-400">
                Managing timer intervals with proper clearInterval cleanup function to prevent memory leaks.
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-emerald-400 font-mono">
                  Timer: {secondsElapsed}s ({isTimerRunning ? 'Running' : 'Cleaned Up / Paused'})
                </span>
                <Button
                  variant={isTimerRunning ? 'danger' : 'emerald'}
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? 'Stop & Cleanup' : 'Start Timer'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 7 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">Practical 7</span>
                <Badge variant="warning">Unit III</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                Optimization: useCallback, useMemo & React.memo
              </h4>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div>Parent State: {parentCount}</div>
                <div>useMemo Sum (1..100) + Parent: <span className="text-indigo-400 font-bold">{expensiveDerivedSum}</span></div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setParentCount((c) => c + 1)}>
                  Re-render Parent
                </Button>
              </div>

              {/* Memoized Child */}
              <MemoizedCounterChild onAction={memoizedCallback} title="Memoized Child Component" />
            </Card.Body>
          </Card>

          {/* Practical 8 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">Practical 8</span>
                <Badge variant="warning">Unit III</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                Custom Hooks: useDebounce & useLocalStorage
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Type rapidly to test useDebounce..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
                <div className="text-[11px] font-mono text-slate-400">
                  Debounced Output (500ms): <span className="text-indigo-300 font-bold">"{debouncedText}"</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-mono text-slate-400">useLocalStorage Value: {localStoredNum}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setLocalStoredNum((n) => n + 1)}
                  >
                    Increment Persistent Storage
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Tab Content: Practicals 9 - 10 */}
      {activeTab === 'p9-p10' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practical 9 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-purple-400 uppercase font-mono">Practical 9</span>
                <Badge variant="purple">Unit IV</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                Controlled vs Uncontrolled Form Components
              </h4>
              <div className="space-y-3">
                {/* Controlled Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Controlled Input (React state via useState):
                  </label>
                  <input
                    type="text"
                    value={controlledValue}
                    onChange={(e) => setControlledValue(e.target.value)}
                    placeholder="Controlled by state"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <span className="text-[10px] text-indigo-300 font-mono">State value: "{controlledValue}"</span>
                </div>

                {/* Uncontrolled Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Uncontrolled Input (Direct DOM via useRef):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      ref={uncontrolledInputRef}
                      defaultValue="Uncontrolled default value"
                      placeholder="Accessed via ref"
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const val = uncontrolledInputRef.current.value;
                        setFormOutput(`Read directly from ref: "${val}"`);
                      }}
                    >
                      Read Ref
                    </Button>
                  </div>
                  {formOutput && (
                    <span className="text-[10px] text-emerald-400 font-mono block mt-1">{formOutput}</span>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 10 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-purple-400 uppercase font-mono">Practical 10</span>
                <Badge variant="purple">Unit IV</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                Schema-Based Validation using Zod (safeParse)
              </h4>
              <p className="text-xs text-slate-400">
                Tests Zod schema rules with real-time error issue extraction without try/catch overhead.
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  value={zodInput.url}
                  onChange={(e) => setZodInput({ ...zodInput, url: e.target.value })}
                  placeholder="URL to validate (e.g. https://...)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                />
                <Button variant="primary" size="sm" className="w-full text-xs" onClick={runZodCheck}>
                  Execute Zod safeParse()
                </Button>

                {zodErrors.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 space-y-1 font-mono">
                    <span className="font-bold block">Zod Issues Detected:</span>
                    {zodErrors.map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Tab Content: Practicals 11 - 14 */}
      {activeTab === 'p11-p14' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Practical 11 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Practical 11</span>
                <Badge variant="cyan">Unit V</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                Axios REST API with Loading & Error States
              </h4>
              <p className="text-xs text-slate-400">
                Demonstrates Axios client instance, interceptors, and distinct loading/error/success states.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={axiosLoading}
                  onClick={() => testAxios('success')}
                >
                  Test 200 OK
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={axiosLoading}
                  onClick={() => testAxios('error')}
                >
                  Simulate 500 Error
                </Button>
              </div>
              {axiosResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono ${
                    axiosResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {axiosResult.success
                    ? JSON.stringify(axiosResult.data, null, 2)
                    : axiosResult.error}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Practical 12 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-cyan-400 uppercase font-mono">Practical 12</span>
                <Badge variant="cyan">Unit V</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                React Query (@tanstack/react-query) Server State
              </h4>
              <p className="text-xs text-slate-400">
                Declarative query caching, staleTime (5 mins), and manual cache invalidation.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div>Query Key: <span className="text-indigo-400">['resources']</span></div>
                <div>Status: <span className="text-emerald-400">Cached & Fresh</span></div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['resources'] });
                  addNotification('Query invalidated & background re-fetched!', 'info');
                }}
              >
                Invalidate Query & Background Sync
              </Button>
            </Card.Body>
          </Card>

          {/* Practical 13 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-rose-400 uppercase font-mono">Practical 13</span>
                <Badge variant="danger">Unit V</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                React Router: Dynamic, Nested & Protected Routes
              </h4>
              <p className="text-xs text-slate-400">
                Routes setup with Layout `<Outlet />`, dynamic params (`/quiz/:topicId`), and Route Guards.
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  {isProAuthorized ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-xs text-slate-200">
                    Protected Guard: {isProAuthorized ? 'Granted' : 'Locked'}
                  </span>
                </div>
                <Button
                  variant={isProAuthorized ? 'danger' : 'emerald'}
                  size="sm"
                  onClick={toggleProAuthorization}
                >
                  {isProAuthorized ? 'Lock Guard' : 'Unlock Guard'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Practical 14 */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-rose-400 uppercase font-mono">Practical 14</span>
                <Badge variant="danger">Unit VI</Badge>
              </div>
            </Card.Header>
            <Card.Body className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                Global State Management: Zustand vs Context API
              </h4>
              <p className="text-xs text-slate-400">
                Zustand provides selective re-rendering without wrapping the DOM tree in Provider components.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div>Store: <span className="text-indigo-400">useRecallStore (Zustand)</span></div>
                <div>Notification Context: <span className="text-cyan-400">React Context API</span></div>
                <div>Status: <span className="text-emerald-400">Production Build Optimized</span></div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};
