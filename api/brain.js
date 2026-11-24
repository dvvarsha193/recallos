import { MOCK_BRAIN_KNOWLEDGE_BASE } from '../src/services/mockData.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, scope = 'all' } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const lower = query.toLowerCase();
  const matched = MOCK_BRAIN_KNOWLEDGE_BASE.find((entry) =>
    entry.keywords.some((kw) => lower.includes(kw))
  );

  const answer = matched
    ? matched.answer
    : `Synthesized answer for "${query}" from indexed learning materials in scope "${scope}": Focus on core architectural constraints, eliminate redundant side-effects, and maintain strict data invariants.`;

  const citations = matched
    ? matched.citations
    : [{ source: 'Knowledge Vault Index', platform: 'Vault', anchor: 'Top Matching Section' }];

  return res.status(200).json({
    answer,
    citations,
    timestamp: new Date().toISOString(),
  });
}
