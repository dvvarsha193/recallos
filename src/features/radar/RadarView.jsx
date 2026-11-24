/**
 * Module 6: Knowledge Gap Radar
 * Identifies topics that need improvement based on quiz and assessment performance.
 * Demonstrates:
 * - SVG Radar Polygon Chart visualization
 * - Diagnostic categorization (<60% Critical Gap, 60-80% Moderate, >80% Mastered)
 * - Actionable spaced repetition revision recommendations
 */
import React, { useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { apiService } from '../../services/apiService';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Radar,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Zap,
} from 'lucide-react';

export const RadarView = () => {
  const navigate = useNavigate();

  const { data: concepts = [], isLoading } = useQuery({
    queryKey: ['concepts'],
    queryFn: apiService.getConcepts,
  });

  // Calculate gaps (<60%) and strengths (>=80%)
  const { gaps, solid, mastered } = useMemo(() => {
    const gaps = [];
    const solid = [];
    const mastered = [];

    concepts.forEach((c) => {
      if (c.masteryScore < 60) {
        gaps.push(c);
      } else if (c.masteryScore < 80) {
        solid.push(c);
      } else {
        mastered.push(c);
      }
    });

    return { gaps, solid, mastered };
  }, [concepts]);

  // Generate SVG Radar Polygon points for up to 6 key concepts
  const radarChartData = useMemo(() => {
    const sample = concepts.slice(0, 6);
    const count = sample.length || 6;
    const center = 150;
    const radius = 110;

    const angleStep = (Math.PI * 2) / count;

    const points = sample.map((item, idx) => {
      const angle = idx * angleStep - Math.PI / 2;
      const normalizedDist = (item.masteryScore / 100) * radius;
      const x = center + normalizedDist * Math.cos(angle);
      const y = center + normalizedDist * Math.sin(angle);
      return { x, y, label: item.name, score: item.masteryScore, angle };
    });

    const polygonPointsString = points.map((p) => `${p.x},${p.y}`).join(' ');

    return { center, radius, points, polygonPointsString, sample };
  }, [concepts]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Radar className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Knowledge Gap Radar</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Diagnoses the blind spots in your knowledge. Rather than reviewing what you already know,
            the Gap Radar isolates the specific sub-topics where your quiz accuracy drops.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            icon={Zap}
            onClick={() => navigate('/quiz')}
          >
            Fix Gaps Now
          </Button>
        </div>
      </div>

      {/* Radar Chart & High-Level Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Polygon Visual */}
        <Card className="lg:col-span-5 flex flex-col items-center justify-center p-6 relative">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 self-start mb-4">
            Skill Dimension Polygon
          </h3>

          <div className="relative w-[300px] h-[300px]">
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Background Concentric Circles */}
              {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                <circle
                  key={i}
                  cx="150"
                  cy="150"
                  r={110 * scale}
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Axis lines */}
              {radarChartData.points.map((p, idx) => {
                const angle = idx * ((Math.PI * 2) / (radarChartData.points.length || 6)) - Math.PI / 2;
                const endX = 150 + 110 * Math.cos(angle);
                const endY = 150 + 110 * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1="150"
                    y1="150"
                    x2={endX}
                    y2={endY}
                    stroke="#1E293B"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Polygon Area */}
              {radarChartData.polygonPointsString && (
                <polygon
                  points={radarChartData.polygonPointsString}
                  fill="rgba(99, 102, 241, 0.25)"
                  stroke="#818CF8"
                  strokeWidth="2"
                  className="transition-all duration-700"
                />
              )}

              {/* Data Point Dots */}
              {radarChartData.points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={p.score < 60 ? '#F43F5E' : p.score < 80 ? '#6366F1' : '#10B981'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between w-full mt-4 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Critical Threshold: &lt;60%</span>
            <span className="text-rose-400 font-semibold">{gaps.length} Active Gaps</span>
          </div>
        </Card>

        {/* Diagnostic Action Plan */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-4 rounded-xl border border-rose-500/30 bg-rose-950/20">
              <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider block">
                Critical Gaps
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1">{gaps.length}</div>
              <span className="text-[11px] text-slate-400">Needs immediate review</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20">
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block">
                Developing
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1">{solid.length}</div>
              <span className="text-[11px] text-slate-400">Moderate retention</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                Mastered
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1">{mastered.length}</div>
              <span className="text-[11px] text-slate-400">Solid grasp</span>
            </div>
          </div>

          {/* Active Gaps Targeted List */}
          <Card className="space-y-3">
            <Card.Header>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Targeted Gap Diagnoses & Next Steps</h3>
              </div>
            </Card.Header>

            <Card.Body className="space-y-3">
              {gaps.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <span className="text-xs text-rose-400 font-mono">
                        Mastery: {item.masteryScore}% • Domain: {item.domain}
                      </span>
                    </div>
                    <Badge variant="danger">Low Retention</Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Diagnostic: Students frequently trip up on cleanup timing and stale closures when referencing mutable state inside un-cleaned effects.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Recommended: Take 3-question targeted drill
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs"
                      onClick={() => navigate('/quiz')}
                    >
                      Start Drill
                    </Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Complete Concept Breakdown Table */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Complete Knowledge Concept Index ({concepts.length} tracked)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Unit I & III: Derived Mastery</span>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="space-y-3">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{concept.name}</span>
                    <Badge variant="primary">{concept.domain}</Badge>
                    <span className="text-xs text-slate-500">({concept.category})</span>
                  </div>
                  <p className="text-xs text-slate-400">{concept.description}</p>
                </div>

                <div className="w-full sm:w-48 space-y-1 shrink-0">
                  <ProgressBar
                    value={concept.masteryScore}
                    color={concept.masteryScore < 60 ? 'rose' : 'emerald'}
                    size="sm"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Score: {concept.masteryScore}%</span>
                    <span>Last tested: {concept.lastTested}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
