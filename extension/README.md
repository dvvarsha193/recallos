# RecallOS Screen & Learning Capture — Chrome Extension (Manifest V3)

This Chrome extension captures visible screens, tutorial video frames, and educational tabs directly into your **RecallOS Knowledge Vault**.

---

## 🚀 How to Install in Google Chrome (15-Second Setup)

1. Open **Google Chrome**.
2. In the address bar, type:
   ```
   chrome://extensions/
   ```
   and press **Enter**.
3. In the top-right corner of the page, toggle on **"Developer mode"**.
4. In the top-left corner, click the **"Load unpacked"** button.
5. In the file picker dialog, select the `extension` folder:
   ```
   C:\Users\ravur\.gemini\antigravity\scratch\recallos\extension
   ```
6. Click **Select Folder**.

Done! 🎉 The **RecallOS 🧠 icon** will now appear in your Chrome toolbar!

---

## 📸 How to Use It to Capture Screens

1. Open any educational website (e.g. YouTube tutorial, LeetCode problem, or MDN Web Docs).
2. Click the **RecallOS extension icon** in your Chrome toolbar.
3. Click **"📸 Capture Screen Snapshot"**:
   - Chrome immediately takes a real-time screenshot of the visible tab using `chrome.tabs.captureVisibleTab`.
   - A live thumbnail preview is displayed inside the popup.
4. Type any quick formula or takeaway into the note field.
5. Click **"💾 Save to RecallOS Knowledge Vault"**.
6. Click **"🌐 Open RecallOS Web Dashboard"** to view your interconnected knowledge graph and revision queues!
