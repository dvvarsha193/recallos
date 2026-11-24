/**
 * RecallOS Chrome Extension - Content Script
 * Extracts learning metadata, headings, and video duration from the active page.
 */

// Helper to extract educational metadata
function extractPageMetadata() {
  const url = window.location.href;
  const title = document.title || 'Untitled Learning Resource';
  let platform = 'Web Document';
  let videoCurrentTime = null;

  if (url.includes('youtube.com/watch')) {
    platform = 'YouTube';
    const video = document.querySelector('video');
    if (video) {
      videoCurrentTime = Math.floor(video.currentTime);
    }
  } else if (url.includes('leetcode.com')) {
    platform = 'LeetCode';
  } else if (url.includes('medium.com')) {
    platform = 'Medium';
  } else if (url.includes('developer.mozilla.org')) {
    platform = 'MDN Docs';
  } else if (url.includes('github.com')) {
    platform = 'GitHub';
  }

  // Selected text on the page
  const selection = window.getSelection().toString().trim();

  // Primary headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .slice(0, 5)
    .map((h) => h.innerText.trim())
    .filter(Boolean);

  return {
    url,
    title,
    platform,
    videoCurrentTime,
    selectedText: selection,
    headings,
  };
}

// Respond to popup query
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PAGE_METADATA') {
    sendResponse(extractPageMetadata());
  }
});
