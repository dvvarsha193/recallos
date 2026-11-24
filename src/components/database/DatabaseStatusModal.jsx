/**
 * Supabase Database & Backend Telemetry Modal
 * Allows viewing real-time connection status, testing queries,
 * and configuring custom Supabase credentials directly from the UI.
 */
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  checkSupabaseConnection,
} from '../../services/supabaseClient';
import { useNotification } from '../../context/NotificationContext';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Key, Server, Link2 } from 'lucide-react';

export const DatabaseStatusModal = ({ isOpen, onClose }) => {
  const { addNotification } = useNotification();
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setConfig(cfg);
      setUrlInput(cfg.isCustom ? cfg.url : '');
      setKeyInput(cfg.isCustom ? cfg.anonKey : '');
      testConnection();
    }
  }, [isOpen]);

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await checkSupabaseConnection();
      setTestResult(result);
    } catch (err) {
      setTestResult({ connected: false, reason: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      addNotification('Please enter both Supabase URL and Anon Key', 'error');
      return;
    }
    saveCustomSupabaseConfig(urlInput.trim(), keyInput.trim());
    addNotification('Saved custom Supabase credentials! Reloading client...', 'success');
    window.location.reload();
  };

  const handleResetToDefault = () => {
    clearCustomSupabaseConfig();
    addNotification('Reset to default resilient layer', 'info');
    window.location.reload();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Database & Backend Integration"
      subtitle="Full-stack database architecture with PostgreSQL cloud persistence and resilient offline sync"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Status Card */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Database Status</h4>
            </div>
            {testResult?.connected ? (
              <Badge variant="success">Supabase Cloud Connected</Badge>
            ) : (
              <Badge variant="cyan">Resilient Storage Layer Active</Badge>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Active URL:</span>
              <span className="text-indigo-300 truncate max-w-[280px]">{config.url}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Engine:</span>
              <span className="text-emerald-400">PostgreSQL (Supabase) + LocalStorage Cache</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Backend API:</span>
              <span className="text-cyan-400">Vercel Serverless / Express REST API</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-slate-400">
              {testResult?.connected
                ? '🟢 Live queries executing against remote PostgreSQL'
                : '🛡️ Resilient zero-downtime offline storage active'}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              isLoading={isTesting}
              onClick={testConnection}
              className="text-xs"
            >
              Ping Database
            </Button>
          </div>
        </div>

        {/* Custom Supabase Credentials Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connect Your Personal Supabase Project (Optional)
            </h4>
            {config.isCustom && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Reset to Default
              </button>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Project URL:</label>
              <div className="relative">
                <Link2 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Anon / Public API Key:</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs mt-2"
              onClick={handleSaveConfig}
            >
              Connect & Reload Supabase
            </Button>
          </div>
        </div>

        {/* SQL Schema Notice */}
        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> Supabase SQL Schema Included:
          </span>
          <p className="text-[11px] text-slate-400">
            A full PostgreSQL schema file (<code className="text-indigo-300 font-mono">supabase_schema.sql</code>)
            defining tables for <code className="text-slate-300">resources</code>, <code className="text-slate-300">concepts</code>,
            and <code className="text-slate-300">quiz_questions</code> is included in the project root.
          </p>
        </div>
      </div>
    </Modal>
  );
};
