/**
 * Unit V & Practical 13: Protected Route Target Component
 * Displays restricted learning analytics and pro workspace
 */
import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useRecallStore } from '../../store/useRecallStore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Award, Cpu, Sparkles } from 'lucide-react';

export const ProWorkspaceView = () => {
  const { toggleProAuthorization } = useRecallStore();
  const navigate = useNavigate();

  const handleLockAndExit = () => {
    toggleProAuthorization();
    navigate('/unauthorized');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Protected Pro Scholar Workspace</h2>
              <Badge variant="success">Unit V Protected Route</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              You are viewing an authorized route guarded by `ProtectedRoute.jsx` in React Router.
            </p>
          </div>
        </div>

        <Button variant="danger" size="sm" icon={Lock} onClick={handleLockAndExit}>
          Lock Guard (Test Redirection)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm font-bold text-white">Advanced Diagnostic Analytics</h4>
          <p className="text-xs text-slate-400">
            Deep neural telemetry of your spaced repetition recall curves.
          </p>
        </Card>

        <Card className="space-y-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h4 className="text-sm font-bold text-white">Autonomous RAG Synthesis</h4>
          <p className="text-xs text-slate-400">
            Automated concept cross-linking across multi-tier repositories.
          </p>
        </Card>

        <Card className="space-y-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-bold text-white">Predictive Exam Readiness</h4>
          <p className="text-xs text-slate-400">
            Calculates 98.4% retention confidence for INT252 term examinations.
          </p>
        </Card>
      </div>
    </div>
  );
};
