import { INITIAL_CONCEPTS } from '../src/services/mockData.js';

let conceptsStore = [...INITIAL_CONCEPTS];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(conceptsStore);
  }

  if (req.method === 'PUT') {
    const { id, masteryScore } = req.body || {};
    conceptsStore = conceptsStore.map((c) =>
      c.id === id
        ? {
            ...c,
            masteryScore: Math.min(100, Math.max(0, masteryScore)),
            lastTested: new Date().toISOString().split('T')[0],
          }
        : c
    );
    const updated = conceptsStore.find((c) => c.id === id);
    return res.status(200).json(updated || {});
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
