/**
 * RecallOS Chrome Extension - Background Service Worker
 * Handles screen capture via chrome.tabs.captureVisibleTab
 * and coordinates saving learning sessions into the Knowledge Vault.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('RecallOS Screen & Learning Capture Extension installed successfully.');
});

// Listen for capture requests from popup or keyboard shortcuts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CAPTURE_SCREEN') {
    // Capture the visible tab as a PNG data URL
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error('Screen capture error:', chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, screenshotUrl: dataUrl });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'SAVE_LEARNING_SESSION') {
    const session = request.payload;
    // Save to chrome.storage.local
    chrome.storage.local.get(['recallos_sessions'], (result) => {
      const existing = result.recallos_sessions || [];
      const updated = [session, ...existing];
      chrome.storage.local.set({ recallos_sessions: updated }, () => {
        sendResponse({ success: true, total: updated.length });
      });
    });
    return true;
  }
});
