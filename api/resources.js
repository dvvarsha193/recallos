import { INITIAL_RESOURCES } from '../src/services/mockData.js';

let inMemoryStore = [...INITIAL_RESOURCES];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all learning resources
  if (req.method === 'GET') {
    return res.status(200).json(inMemoryStore);
  }

  // POST: Create a new learning resource
  if (req.method === 'POST') {
    const body = req.body || {};
    const newItem = {
      ...body,
      id: `res-${Date.now()}`,
      capturedAt: new Date().toISOString(),
      reviewDueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      reviewIntervalDays: 3,
      masteryScore: body.masteryScore || 65,
      status: body.status || 'Reviewing',
      extractedConcepts: body.extractedConcepts || ['Core Principles'],
    };
    inMemoryStore = [newItem, ...inMemoryStore];
    return res.status(201).json(newItem);
  }

  // DELETE: Remove a resource
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (id) {
      inMemoryStore = inMemoryStore.filter((r) => r.id !== id);
    }
    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
