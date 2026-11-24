/**
 * Dashboard Overview: Central Command Center for RecallOS
 * Demonstrates:
 * - Unit I: Array transformation & aggregation with reduce
 * - Unit II: Component composition with Card, Badge, and Stat widgets
 * - Unit III: Derived state & local/global sync
 * - Unit V: React Query client-server data synchronization
 */
import React, { useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useRecallStore } from '../../store/useRecallStore';
import { apiService } from '../../services/apiService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Cpu,
  FolderLock,
  Network,
  BotMessageSquare,
  Radar,
  HelpCircle,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const DashboardView = () => {
  const navigate = useNavigate();
  const { userStats, setCaptureModalOpen } = useRecallStore();

  const { data: resources = [] } = useQuery({
    queryKey: ['resources'],
    queryFn: apiService.getResources,
  });

  const { data: concepts = [] } = useQuery({
    queryKey: ['concepts'],
    queryFn: apiService.getConcepts,
  });

  // Derived revision items due for review
  const revisionDueItems = useMemo(() => {
    return resources.filter((r) => r.status === 'Needs Revision' || r.masteryScore < 60);
  }, [resources]);

  // Overall average mastery
  const averageMastery = useMemo(() => {
    if (!concepts.length) return 72;
    const total = concepts.reduce((acc, c) => acc + c.masteryScore, 0);
    return Math.round(total / concepts.length);
  }, [concepts]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Personal Learning Intelligence System</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your learning is scattered. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              Your knowledge shouldn't be.
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            RecallOS connects your scattered tutorials, articles, and documentation into a single
            intelligent graph. It diagnoses what you actually understand and recommends what to revise next.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <Button
              variant="primary"
              icon={Compass}
              onClick={() => setCaptureModalOpen(true)}
            >
              Capture New Learning
            </Button>
            <Button
              variant="secondary"
              icon={HelpCircle}
              onClick={() => navigate('/quiz')}
            >
              Start Adaptive Quiz
            </Button>
            <Button
              variant="ghost"
              icon={BotMessageSquare}
              onClick={() => navigate('/brain')}
            >
              Ask Your Brain
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Gamified Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2">
            {userStats.streakDays} <span className="text-sm font-sans font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1">
            <span>🔥 Daily habit maintained</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Study Duration</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2">
            {userStats.totalMinutesLearned}{' '}
            <span className="text-sm font-sans font-normal text-slate-400">mins</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            +{userStats.todayMinutes} mins logged today
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Overall Mastery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            {averageMastery}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {concepts.length} indexed topics
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-rose-500/30">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
              Knowledge Gaps
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">
            {revisionDueItems.length}
          </div>
          <div className="text-[11px] text-rose-300 mt-1">
            Topics needing active revision
          </div>
        </Card>
      </div>

      {/* 2-Column Section: Revision Queue & Knowledge Map Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revision Queue (Spaced Repetition) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Due for Revision Today (Spaced Repetition)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {revisionDueItems.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {revisionDueItems.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge platform={item.platform}>{item.platform}</Badge>
                    <Badge variant="danger">Gap: {item.masteryScore}%</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white hover:text-indigo-300 transition line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.summary}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    icon={HelpCircle}
                    onClick={() => navigate('/quiz')}
                  >
                    Quick Drill
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Launchpad to 7 Core Modules */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              RecallOS Module Launchpad
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => navigate('/tracker')}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                    1. Smart Learning Tracker
                  </h4>
                  <p className="text-[11px] text-slate-400">Capture browser & video tutorials</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => navigate('/builder')}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    2. AI Knowledge Builder
                  </h4>
                  <p className="text-[11px] text-slate-400">Extract concepts from raw notes & PDFs</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => navigate('/vault')}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400">
                  <FolderLock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    3. Personal Knowledge Vault
                  </h4>
                  <p className="text-[11px] text-slate-400">Centralized search & retention index</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => navigate('/graph')}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                    4. Interactive Knowledge Graph
                  </h4>
                  <p className="text-[11px] text-slate-400">Explore concept relationships visually</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => navigate('/radar')}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/90 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                  <Radar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition">
                    6. Knowledge Gap Radar
                  </h4>
                  <p className="text-[11px] text-slate-400">Detect diagnostic weak spots</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
