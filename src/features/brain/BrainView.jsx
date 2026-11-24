/**
 * Module 5: Ask Your Brain (AI Learning Assistant / Second Brain RAG)
 * Allows students to query their collected learning materials and receive AI answers
 * with exact source citations.
 * Demonstrates:
 * - Unit III: Controlled chat input & synthetic event handling
 * - Unit VI: Zustand global state management for conversation history
 * - Source citation attribution components
 */
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useRecallStore } from '../../store/useRecallStore';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  Link2,
  ExternalLink,
  User,
  Brain,
  Quote,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Why does useEffect need a cleanup function?',
  'What are the rules of reconciliation in React Virtual DOM?',
  'What is the difference between Zustand and Context API?',
  'How does Zod safeParse handle form validation errors?',
  'What are my current knowledge gaps?',
];

export const BrainView = () => {
  const {
    brainMessages,
    isBrainThinking,
    askBrainQuery,
    clearBrainHistory,
  } = useRecallStore();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState('all');
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [brainMessages, isBrainThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isBrainThinking) return;

    askBrainQuery(inputQuery.trim(), selectedScope);
    setInputQuery('');
  };

  const handlePromptClick = (prompt) => {
    askBrainQuery(prompt, selectedScope);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <BotMessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Ask Your Brain</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            A conversational intelligence layer indexed over your personal learning vault.
            Every generated answer is strictly grounded in the articles, videos, and notes you’ve studied.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Scope: Entire Vault</option>
            <option value="frontend">Frontend Notes</option>
            <option value="backend">Backend & APIs</option>
            <option value="dsa">DSA & Algorithms</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={clearBrainHistory}
            className="text-xs text-slate-400 hover:text-white"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          Suggested Questions from Your Saved Resources:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Window */}
      <Card className="min-h-[480px] flex flex-col justify-between p-0 overflow-hidden">
        {/* Chat History */}
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          {brainMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-indigo-400" />
                  </div>
                )}

                <div className={`space-y-2 max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* AI Source Citations */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                        <Quote className="w-3 h-3 text-indigo-400" />
                        <span>Source Citations:</span>
                      </div>
                      <div className="space-y-1">
                        {msg.citations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center justify-between text-xs text-indigo-300 font-mono px-2 py-1 rounded bg-slate-900/80 border border-slate-800"
                          >
                            <span className="truncate">{cite.source}</span>
                            <span className="text-[10px] text-slate-500 ml-2 shrink-0">
                              {cite.anchor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 px-1 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Indicator */}
          {isBrainThinking && (
            <div className="flex gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-400 rounded-bl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-mono ml-2">Searching indexed knowledge graph...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask your brain a concept, interview question, or summary..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputQuery.trim() || isBrainThinking}
              icon={Send}
            >
              Ask
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
