import express from 'express';
import cors from 'cors';
import { INITIAL_RESOURCES, INITIAL_CONCEPTS, MOCK_QUIZ_QUESTIONS, MOCK_BRAIN_KNOWLEDGE_BASE } from '../src/services/mockData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let resources = [...INITIAL_RESOURCES];
let concepts = [...INITIAL_CONCEPTS];
let quizzes = [...MOCK_QUIZ_QUESTIONS];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    backend: 'Express.js REST Server',
    database: 'Supabase PostgreSQL Cloud Ready',
    timestamp: new Date().toISOString(),
  });
});

// Resources CRUD
app.get('/api/resources', (req, res) => res.json(resources));

app.post('/api/resources', (req, res) => {
  const item = {
    ...req.body,
    id: `res-${Date.now()}`,
    capturedAt: new Date().toISOString(),
    reviewDueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    reviewIntervalDays: 3,
    masteryScore: req.body.masteryScore || 65,
    status: req.body.status || 'Reviewing',
  };
  resources = [item, ...resources];
  res.status(201).json(item);
});

app.delete('/api/resources/:id', (req, res) => {
  resources = resources.filter((r) => r.id !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Concepts API
app.get('/api/concepts', (req, res) => res.json(concepts));

app.put('/api/concepts/:id/mastery', (req, res) => {
  const { masteryScore } = req.body;
  concepts = concepts.map((c) =>
    c.id === req.params.id
      ? { ...c, masteryScore: Math.min(100, Math.max(0, masteryScore)), lastTested: new Date().toISOString().split('T')[0] }
      : c
  );
  res.json(concepts.find((c) => c.id === req.params.id));
});

// Quizzes API
app.get('/api/quizzes', (req, res) => {
  const { topic } = req.query;
  if (!topic || topic === 'all') return res.json(quizzes);
  res.json(quizzes.filter((q) => q.conceptId === topic || q.topic.toLowerCase().includes(topic.toLowerCase())));
});

// Ask Brain RAG API
app.post('/api/brain', (req, res) => {
  const { query, scope } = req.body;
  const lower = (query || '').toLowerCase();
  const matched = MOCK_BRAIN_KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((kw) => lower.includes(kw))
  );

  res.json({
    answer: matched ? matched.answer : `Synthesized answer for "${query}" across scope "${scope}": Focus on reactive dependencies and eliminate side-effects.`,
    citations: matched ? matched.citations : [{ source: 'RecallOS Knowledge Vault', platform: 'Vault', anchor: 'Indexed Document' }],
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`RecallOS Express Backend running on http://localhost:${PORT}`);
  });
}

export default app;
