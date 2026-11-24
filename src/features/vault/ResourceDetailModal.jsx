/**
 * Unit II & Unit IV: Resource Detail Modal
 * Detailed inspection of notes, review schedules, and concept links
 */
import React from 'react';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  ExternalLink,
  Clock,
  Calendar,
  Tag,
  Network,
  Trash2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const ResourceDetailModal = ({
  resource,
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!resource) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resource.title}
      subtitle={`Source: ${resource.platform} • Domain: ${resource.domain}`}
      maxWidth="max-w-3xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onDelete(resource.id);
              onClose();
            }}
          >
            Delete Resource
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <span>Visit Origin</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status & Mastery Bar */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge platform={resource.platform}>{resource.platform}</Badge>
              <Badge variant={resource.status === 'Needs Revision' ? 'danger' : 'success'}>
                {resource.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {resource.timeSpentMins} mins studied
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Next Review: {new Date(resource.reviewDueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <ProgressBar
            value={resource.masteryScore}
            label="Current Retention & Mastery Level"
            color={resource.masteryScore < 60 ? 'rose' : 'emerald'}
          />
        </div>

        {/* AI Summary */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Synthesized AI Takeaway
          </h4>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 leading-relaxed">
            {resource.summary}
          </div>
        </div>

        {/* Notes & In-depth Takeaways */}
        {resource.notes && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Detailed Notes & Architectural Insights
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line">
              {resource.notes}
            </div>
          </div>
        )}

        {/* Concepts and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Connected Concepts
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {resource.extractedConcepts?.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1"
                >
                  <Network className="w-3 h-3" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Categorical Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags?.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs font-mono flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-slate-500" />
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
