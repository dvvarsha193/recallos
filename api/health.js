export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    status: 'healthy',
    project: 'RecallOS - Personal Learning Intelligence System',
    version: '1.0.0',
    backend: 'Node.js Serverless API',
    database: 'Supabase PostgreSQL Cloud Ready',
    timestamp: new Date().toISOString(),
  });
}
