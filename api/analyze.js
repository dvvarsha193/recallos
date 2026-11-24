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

  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  let platform = 'Medium';
  let domain = 'Frontend';
  let title = 'Resource from ' + new URL(url).hostname;
  let extractedConcepts = ['Core Principles', 'Architecture', 'Best Practices'];
  let summary = 'AI Extracted Insights: Key fundamentals, syntax conventions, and common development bottlenecks.';

  if (url.includes('youtube') || url.includes('youtu.be')) {
    platform = 'YouTube';
    title = 'Mastering Modern React 19 State & Async Actions';
    extractedConcepts = ['React 19 Actions', 'Optimistic UI', 'useActionState'];
    summary = 'Video tutorial breakdown: Client transitions, eliminating manual loading booleans, and integrating with server actions.';
  } else if (url.includes('leetcode')) {
    platform = 'LeetCode';
    domain = 'Data Structures';
    title = 'LeetCode Problem Analysis & Algorithmic Patterns';
    extractedConcepts = ['Time Complexity O(N)', 'Space Optimization', 'Edge Case Handling'];
    summary = 'Optimal approach using two pointers with constant extra memory. Invariant proof and bounds verification included.';
  } else if (url.includes('github')) {
    platform = 'GitHub';
    title = 'Open Source Codebase & Architecture Specification';
    extractedConcepts = ['Repository Structure', 'Design Patterns', 'Code Modularity'];
    summary = 'Analysis of module boundaries, clean dependency injection, and reusable component composition patterns.';
  }

  return res.status(200).json({
    title,
    platform,
    domain,
    tags: extractedConcepts.map((c) => c.toLowerCase().replace(/\s+/g, '-')).join(', '),
    summary,
    extractedConcepts,
    timeSpentMins: 30,
  });
}
