/**
 * Unit IV: Form Handling & Zod Validation in ResourceCaptureModal
 * Demonstrates:
 * - Controlled components
 * - Form state management patterns
 * - Zod safeParse validation with field-level dynamic error display
 * - Accessibility considerations in forms (labels, aria-invalid, aria-describedby)
 * - Auto-fill simulation from educational URLs (YouTube, LeetCode, GitHub, etc.)
 */
import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { resourceCaptureSchema } from '../../validation/schemas';
import { useRecallStore } from '../../store/useRecallStore';
import { apiService } from '../../services/apiService';
import { useNotification } from '../../context/NotificationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Globe, Link2, Clock, Tag, BookOpen, AlertCircle } from 'lucide-react';

const INITIAL_FORM_STATE = {
  url: '',
  title: '',
  platform: 'YouTube',
  domain: 'Frontend',
  tags: '',
  summary: '',
  timeSpentMins: 30,
};

export const ResourceCaptureModal = () => {
  const { isCaptureModalOpen, setCaptureModalOpen, incrementLearningTime } = useRecallStore();
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Unit V: React Query Mutation for creating resource
  const createResourceMutation = useMutation({
    mutationFn: (newResource) => apiService.createResource(newResource),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      incrementLearningTime(data.timeSpentMins);
      addNotification(`"${data.title.substring(0, 30)}..." captured into Knowledge Vault!`, 'success');
      handleClose();
    },
    onError: (err) => {
      addNotification(`Failed to save resource: ${err.message}`, 'error');
    },
  });

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setCaptureModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const formattedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Smart URL analysis simulation
  const handleSmartAnalyze = async () => {
    if (!formData.url) {
      setErrors((prev) => ({ ...prev, url: 'Enter a URL to auto-extract details' }));
      return;
    }

    try {
      setIsAnalyzing(true);
      const extracted = await apiService.analyzeUrl(formData.url);
      setFormData((prev) => ({
        ...prev,
        title: extracted.title,
        platform: extracted.platform,
        domain: extracted.domain,
        tags: extracted.tags,
        summary: extracted.summary,
        timeSpentMins: extracted.timeSpentMins,
      }));
      setErrors({});
      addNotification('AI extracted metadata & concepts successfully!', 'success');
    } catch (err) {
      addNotification('AI extraction error: ' + err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Unit IV: Schema validation with Zod safeParse
    const validationResult = resourceCaptureSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0];
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      addNotification('Please fix form validation errors', 'error');
      return;
    }

    // Transform comma-separated tags into array
    const tagArray = formData.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    createResourceMutation.mutate({
      ...formData,
      tags: tagArray,
      extractedConcepts: tagArray.slice(0, 3).map((t) => t.toUpperCase()),
    });
  };

  return (
    <Modal
      isOpen={isCaptureModalOpen}
      onClose={handleClose}
      title="Smart Learning Tracker — Capture Resource"
      subtitle="Paste any educational link or notes to build your structured knowledge vault"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Quick URL Input & AI Auto-Fill button */}
        <div>
          <label htmlFor="url-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Resource URL <span className="text-rose-400">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                id="url-input"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=... or https://leetcode.com/..."
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? 'url-error' : undefined}
                className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
                  errors.url
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Sparkles}
              isLoading={isAnalyzing}
              onClick={handleSmartAnalyze}
              className="text-indigo-400 hover:text-indigo-300 border-indigo-500/30"
            >
              AI Auto-Fill
            </Button>
          </div>
          {errors.url && (
            <p id="url-error" className="flex items-center gap-1 text-xs text-rose-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.url}</span>
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Resource Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="title-input"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. React 19 Reconciliation & Virtual DOM Architecture"
            aria-invalid={!!errors.title}
            className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
              errors.title
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500'
                : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
        </div>

        {/* Platform & Domain Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="platform-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Platform Source <span className="text-rose-400">*</span>
            </label>
            <select
              id="platform-select"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="YouTube">YouTube Video</option>
              <option value="Medium">Medium Article</option>
              <option value="Coursera">Online Course</option>
              <option value="LeetCode">LeetCode Problem</option>
              <option value="MDN Docs">MDN Web Docs</option>
              <option value="Dev.to">Dev.to Post</option>
              <option value="GitHub">GitHub Repository</option>
              <option value="PDF / Document">PDF / Research Paper</option>
            </select>
          </div>

          <div>
            <label htmlFor="domain-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Educational Domain <span className="text-rose-400">*</span>
            </label>
            <select
              id="domain-select"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Frontend">Frontend Development</option>
              <option value="Backend">Backend & Systems</option>
              <option value="Data Structures">Data Structures & Algorithms</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="DevOps">DevOps & Cloud</option>
            </select>
          </div>
        </div>

        {/* Tags & Time Spent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="tags-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tags (comma separated) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                id="tags-input"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, virtual-dom, performance"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {errors.tags && <p className="text-xs text-rose-400 mt-1">{errors.tags}</p>}
          </div>

          <div>
            <label htmlFor="time-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Time Spent (min) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                id="time-input"
                name="timeSpentMins"
                type="number"
                min="1"
                max="1440"
                value={formData.timeSpentMins}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {errors.timeSpentMins && <p className="text-xs text-rose-400 mt-1">{errors.timeSpentMins}</p>}
          </div>
        </div>

        {/* Summary & Key Takeaways */}
        <div>
          <label htmlFor="summary-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Key Takeaways & Summary <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="summary-input"
            name="summary"
            rows="3"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Write key takeaways or notes to help your future self remember..."
            className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
              errors.summary
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-slate-700/80 focus:border-indigo-500'
            }`}
          ></textarea>
          {errors.summary && <p className="text-xs text-rose-400 mt-1">{errors.summary}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createResourceMutation.isPending}
            icon={BookOpen}
          >
            Save to RecallOS
          </Button>
        </div>
      </form>
    </Modal>
  );
};
