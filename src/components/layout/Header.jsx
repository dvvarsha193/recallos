import React from 'react';
import { useRecallStore } from '../../store/useRecallStore';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import {
  Brain,
  PlusCircle,
  Code2,
  Flame,
  Database,
} from 'lucide-react';

export const Header = () => {
  const {
    searchQuery,
    setSearchQuery,
    setCaptureModalOpen,
    setSyllabusModalOpen,
    setDatabaseModalOpen,
    userStats,
  } = useRecallStore();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3.5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-sans">
                Recall<span className="text-indigo-400">OS</span>
              </h1>
              <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Full Stack
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block italic">
              Your learning is scattered. Your knowledge shouldn't be.
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden sm:block flex-1 max-w-md mx-2">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search vault, concepts, notes, citations..."
          />
        </div>

        {/* Action Controls & Database Status */}
        <div className="flex items-center gap-2.5">
          {/* Supabase Database Button */}
          <button
            type="button"
            onClick={() => setDatabaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400 transition"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Database: Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Syllabus Topics Covered */}
          <button
            type="button"
            onClick={() => setSyllabusModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-400 transition"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Syllabus Covered</span>
          </button>

          {/* Learning Streak */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">{userStats.streakDays}d Streak</span>
          </div>

          {/* Quick Capture Button */}
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setCaptureModalOpen(true)}
          >
            <span className="hidden xs:inline">Capture</span> Resource
          </Button>
        </div>
      </div>
    </header>
  );
};
