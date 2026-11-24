/**
 * Module 7: Adaptive Quiz and Revision Engine
 * Generates quizzes from collected learning materials, evaluates performance,
 * updates concept mastery ratings, and schedules spaced repetitions.
 * Demonstrates:
 * - Complex state transitions (in-progress, completed, review)
 * - Dynamic feedback with explanations
 * - Integration with confetti effects and React Query mutations
 */
import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { apiService } from '../../services/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Brain,
  Zap,
} from 'lucide-react';

export const QuizView = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [activeTopicFilter, setActiveTopicFilter] = useState('all');

  const { data: questions = [], isLoading, refetch } = useQuery({
    queryKey: ['quizzes', activeTopicFilter],
    queryFn: () => apiService.generateAdaptiveQuiz(activeTopicFilter),
  });

  const updateMasteryMutation = useMutation({
    mutationFn: ({ conceptId, newScore }) =>
      apiService.updateConceptMastery(conceptId, newScore),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] });
    },
  });

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === currentQ.correctAnswerIndex;

    if (isCorrect) {
      setUserScore((prev) => prev + 1);
      addNotification('Correct! Mastery boosted by +15%', 'success');
      // Boost mastery
      updateMasteryMutation.mutate({
        conceptId: currentQ.conceptId,
        newScore: 85,
      });
    } else {
      addNotification('Incorrect. Concept queued for adaptive revision.', 'error');
      // Reduce or keep in gap
      updateMasteryMutation.mutate({
        conceptId: currentQ.conceptId,
        newScore: 40,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizFinished(true);
      // Trigger celebratory confetti if score >= 60%
      const finalPercentage = Math.round(((userScore + (selectedAnswer === currentQ?.correctAnswerIndex ? 0 : 0)) / questions.length) * 100);
      if (finalPercentage >= 60) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    setIsQuizFinished(false);
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Adaptive Quiz & Revision</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Active recall is 300% more effective than passive re-reading. Dynamic quizzes test your
            understanding and recalibrate your Knowledge Gap Radar in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeTopicFilter}
            onChange={(e) => {
              setActiveTopicFilter(e.target.value);
              handleRestartQuiz();
            }}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Topics (Adaptive)</option>
            <option value="c-2">Targeted: useEffect & Hooks (Gap)</option>
            <option value="c-1">Virtual DOM & Reconciliation</option>
            <option value="c-4">Zod Form Validation</option>
            <option value="c-3">Zustand Global State</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400">Assembling adaptive questions...</div>
      ) : isQuizFinished ? (
        /* Quiz Finished Summary */
        <Card className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-600/20">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white">Assessment Complete!</h3>
            <p className="text-sm text-slate-400 mt-1">
              Your Knowledge Gap Radar and spaced repetition intervals have been recalibrated.
            </p>
          </div>

          <div className="max-w-xs mx-auto p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-xs uppercase tracking-wider text-slate-400">Final Score</div>
            <div className="text-4xl font-extrabold font-mono text-emerald-400">
              {Math.round((userScore / questions.length) * 100)}%
            </div>
            <div className="text-xs text-slate-400">
              {userScore} of {questions.length} questions answered correctly
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="primary" icon={RotateCcw} onClick={handleRestartQuiz}>
              Take Another Adaptive Drill
            </Button>
          </div>
        </Card>
      ) : currentQ ? (
        /* Question Card */
        <Card className="space-y-6 p-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="primary">{currentQ.topic}</Badge>
                <Badge variant="warning">{currentQ.difficulty}</Badge>
              </div>
            </div>
            <ProgressBar
              value={currentQuestionIndex + 1}
              max={questions.length}
              showPercentage={false}
              size="sm"
            />
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctAnswerIndex) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-950/40 border-rose-500/80 text-rose-200';
                } else {
                  optionStyle = 'bg-slate-900/40 border-slate-900 text-slate-500';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-600/20 border-indigo-500 text-white';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && (
                    <div className="shrink-0">
                      {idx === currentQ.correctAnswerIndex ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when submitted */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2 animate-fade-in">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> Explanation & Concept Deep Dive:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              Score: {userScore} / {questions.length}
            </span>

            {!isAnswerSubmitted ? (
              <Button
                variant="primary"
                disabled={selectedAnswer === null}
                onClick={handleSubmitAnswer}
                icon={Zap}
              >
                Submit Answer
              </Button>
            ) : (
              <Button variant="emerald" onClick={handleNextQuestion} icon={ArrowRight}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
};
