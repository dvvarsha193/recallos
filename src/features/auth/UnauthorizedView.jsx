/**
 * Unit V & Practical 13: Unauthorized Protected Route Fallback
 * Demonstrates route protection redirection and state preservation
 */
import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useRecallStore } from '../../store/useRecallStore';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Unlock, ArrowLeft } from 'lucide-react';

export const UnauthorizedView = () => {
  const { toggleProAuthorization } = useRecallStore();
  const navigate = useNavigate();

  const handleUnlockAndEnter = () => {
    toggleProAuthorization();
    navigate('/pro-workspace');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-5 border-rose-500/30 bg-rose-950/10">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Protected Route Guard Active</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Unit V Practical 13 requires demonstrating protected routes in React Router.
            This view is locked by the client-side authorization guard.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          Guard State: <span className="text-rose-400 font-bold">isProAuthorized = false</span>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="emerald" icon={Unlock} onClick={handleUnlockAndEnter}>
            Unlock Access & Enter
          </Button>
        </div>
      </Card>
    </div>
  );
};
