/**
 * Module 2: AI Knowledge Builder
 * Analyzes saved resources, raw notes, and PDFs to generate summaries,
 * extract core concepts, and build structured relationships.
 * Demonstrates:
 * - Uncontrolled/Controlled text input handling
 * - Complex state transformations with pure functions
 * - Interactive AI synthesis workflows
 */
import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { apiService } from '../../services/apiService';
import { useQueryClient } from '@tanstack/react-query';
import {
  Cpu,
  Sparkles,
  FileText,
  Upload,
  ArrowRight,
  Network,
  CheckCircle,
  Tag,
  BookOpen,
} from 'lucide-react';

const PRESET_TOPICS = [
  {
    title: 'React 19 Actions & Asynchronous Transitions',
    content: `React 19 introduces Server Actions and the useActionState hook.
Traditional React code required useState(false) for isPending, another useState(null) for error, and a third for data.
With useActionState, React manages pending state transitions automatically.
Optimistic updates are powered by useOptimistic, allowing the UI to instantly reflect user input while awaiting network confirmation.
If the asynchronous mutation fails, React automatically rolls back the UI to the verified server state.`,
  },
  {
    title: 'Zustand Selector Optimization & Avoiding Context Re-renders',
    content: `In standard React Context API, any change to the context value object triggers a re-render for all consumer components calling useContext(MyContext).
Zustand solves this by introducing external store subscriptions with shallow equality checks.
By writing useStore(state => state.activeId), the component only re-renders when activeId changes, ignoring mutations in any other state slice.
This eliminates unnecessary Virtual DOM reconciliation and boosts large application performance.`,
  },
  {
    title: 'Binary Search Invariant & 32-bit Integer Overflow Prevention',
    content: `Binary search divides the search space in half with O(log N) time complexity.
A critical implementation detail in lower bound search is calculating the midpoint.
Writing (low + high) / 2 can cause signed integer overflow in low-level runtime environments when sum exceeds 2^31 - 1.
The robust mathematical invariant is mid = low + Math.floor((high - low) / 2).
Loop termination condition must preserve the invariant low <= high or low < high depending on closed vs half-open intervals.`,
  },
];

export const BuilderView = () => {
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  const [inputTitle, setInputTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleLoadPreset = (preset) => {
    setInputTitle(preset.title);
    setInputText(preset.content);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      addNotification('Please enter or select learning text to analyze', 'error');
      return;
    }

    setIsProcessing(true);
    // Simulate multi-step AI reasoning
    setTimeout(() => {
      const words = inputText.split(/\s+/).length;
      const title = inputTitle || 'Structured Learning Synthesis';

      // Deterministic extraction based on content
      let domain = 'Frontend';
      let extractedConcepts = ['Core Principle', 'Architecture', 'Syntax'];

      if (inputText.toLowerCase().includes('binary') || inputText.toLowerCase().includes('complexity')) {
        domain = 'Data Structures';
        extractedConcepts = ['Binary Search Invariant', 'O(log N) Complexity', 'Integer Overflow Prevention'];
      } else if (inputText.toLowerCase().includes('zustand') || inputText.toLowerCase().includes('context')) {
        domain = 'Frontend';
        extractedConcepts = ['Zustand Slices', 'Selective Re-renders', 'Context API Bottlenecks'];
      } else if (inputText.toLowerCase().includes('react 19') || inputText.toLowerCase().includes('action')) {
        domain = 'Frontend';
        extractedConcepts = ['useActionState', 'Optimistic UI', 'Transitions'];
      }

      setAnalysisResult({
        title,
        domain,
        wordCount: words,
        readTimeMins: Math.max(1, Math.round(words / 150)),
        executiveSummary: `Synthesized Takeaway: This material establishes the foundation of ${domain} architecture. Key advantages include reducing mental overhead, eliminating state race conditions, and maintaining consistent data invariants.`,
        keyTakeaways: [
          'Eliminates manual boilerplate through declarative abstractions.',
          'Maintains performance stability via selective evaluation and memoization.',
          'Protects against edge-case anomalies and runtime synchronization failures.',
        ],
        extractedConcepts,
        recommendedTags: extractedConcepts.map((c) => c.toLowerCase().replace(/\s+/g, '-')),
      });

      setIsProcessing(false);
      addNotification('AI Knowledge Builder generated structured concept graph!', 'success');
    }, 1000);
  };

  const handleExportToVault = async () => {
    if (!analysisResult) return;

    try {
      await apiService.createResource({
        title: analysisResult.title,
        url: 'https://recallos.local/notes/' + Date.now(),
        platform: 'PDF / Document',
        domain: analysisResult.domain,
        tags: analysisResult.recommendedTags,
        timeSpentMins: analysisResult.readTimeMins * 10,
        summary: analysisResult.executiveSummary,
        extractedConcepts: analysisResult.extractedConcepts,
      });

      queryClient.invalidateQueries({ queryKey: ['resources'] });
      addNotification('Saved successfully to Personal Knowledge Vault & Graph!', 'success');
      setAnalysisResult(null);
      setInputTitle('');
      setInputText('');
    } catch (err) {
      addNotification('Error exporting to vault: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Cpu className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Knowledge Builder</h2>
        </div>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Transforms messy notes, PDF lecture handouts, and documentation snippets into structured concepts,
          concise summaries, and relational knowledge graph nodes.
        </p>
      </div>

      {/* Preset Inspirations */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Quick-Load Educational Presets:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_TOPICS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-left transition"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="truncate">{preset.title}</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{preset.content}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Workspace & Analysis Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Editor */}
        <Card className="space-y-4">
          <Card.Header>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Input Notes, PDF Text or Documentation</h3>
            </div>
          </Card.Header>

          <Card.Body>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Concept or Document Title</label>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="e.g. Reconciliation Deep Dive & Fiber Architecture"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Raw Content / Extracted PDF Text
              </label>
              <textarea
                rows="10"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste tutorial notes, PDF chapter text, or code walkthrough here..."
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
              ></textarea>
            </div>

            <Button
              variant="primary"
              className="w-full"
              icon={Sparkles}
              isLoading={isProcessing}
              onClick={handleAnalyze}
            >
              AI Extract Concepts & Summarize
            </Button>
          </Card.Body>
        </Card>

        {/* Right: AI Synthesis Panel */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div>
            <Card.Header>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">Extracted Knowledge Blueprint</h3>
                </div>
                {analysisResult && <Badge variant="success">Synthesized</Badge>}
              </div>
            </Card.Header>

            <Card.Body>
              {!analysisResult ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-500">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <p className="text-sm">Click "AI Extract Concepts & Summarize" to generate structured output.</p>
                </div>
              ) : (
                <div className="space-y-4 animate-scale-up">
                  <div>
                    <h4 className="text-base font-bold text-white">{analysisResult.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary">{analysisResult.domain}</Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        {analysisResult.wordCount} words • ~{analysisResult.readTimeMins} min read
                      </span>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-indigo-300 block mb-1">Executive Summary:</span>
                    {analysisResult.executiveSummary}
                  </div>

                  {/* Core Concepts */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Extracted Concepts:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.extractedConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1"
                        >
                          <Network className="w-3 h-3" />
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Key Takeaways:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {analysisResult.keyTakeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card.Body>
          </div>

          {analysisResult && (
            <Card.Footer>
              <div className="w-full flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready to save?</span>
                <Button variant="emerald" size="sm" icon={BookOpen} onClick={handleExportToVault}>
                  Commit to Knowledge Vault
                </Button>
              </div>
            </Card.Footer>
          )}
        </Card>
      </div>
    </div>
  );
};
