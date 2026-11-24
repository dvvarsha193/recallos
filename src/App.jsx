import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Lazy loading feature modules for route-based code splitting
const DashboardView = lazy(() =>
  import('./features/dashboard/DashboardView').then((m) => ({ default: m.DashboardView }))
);
const TrackerView = lazy(() =>
  import('./features/tracker/TrackerView').then((m) => ({ default: m.TrackerView }))
);
const BuilderView = lazy(() =>
  import('./features/builder/BuilderView').then((m) => ({ default: m.BuilderView }))
);
const VaultView = lazy(() =>
  import('./features/vault/VaultView').then((m) => ({ default: m.VaultView }))
);
const GraphView = lazy(() =>
  import('./features/graph/GraphView').then((m) => ({ default: m.GraphView }))
);
const BrainView = lazy(() =>
  import('./features/brain/BrainView').then((m) => ({ default: m.BrainView }))
);
const RadarView = lazy(() =>
  import('./features/radar/RadarView').then((m) => ({ default: m.RadarView }))
);
const QuizView = lazy(() =>
  import('./features/quiz/QuizView').then((m) => ({ default: m.QuizView }))
);

const RouteFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
    <span className="text-xs font-mono">Loading RecallOS module...</span>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* 1. Dashboard Overview */}
            <Route index element={<DashboardView />} />

            {/* 2. Smart Learning Tracker */}
            <Route path="tracker" element={<TrackerView />} />

            {/* 3. AI Knowledge Builder */}
            <Route path="builder" element={<BuilderView />} />

            {/* 4. Personal Knowledge Vault */}
            <Route path="vault" element={<VaultView />} />

            {/* 5. Interactive Knowledge Graph */}
            <Route path="graph" element={<GraphView />} />

            {/* 6. Ask Your Brain */}
            <Route path="brain" element={<BrainView />} />

            {/* 7. Knowledge Gap Radar */}
            <Route path="radar" element={<RadarView />} />

            {/* 8. Adaptive Quiz & Revision */}
            <Route path="quiz" element={<QuizView />} />
            <Route path="quiz/:topicId" element={<QuizView />} />

            {/* Catch-all redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
