/**
 * Dark Sun Chronicles — DM Companion
 * If you see this stub, the full app.js was not uploaded due to size limits.
 * Download the complete build from the latest release or artifacts/DSCToolkt-app.zip
 * and replace this file with js/app.js from the package.
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('app');
    if (!root) return;
    root.innerHTML = '<div style="max-width:32rem;margin:3rem auto;padding:1.5rem;font-family:system-ui,sans-serif;background:#1c1816;color:#e8e0d5;border-radius:12px;border:1px solid #3d342e">' +
      '<h1 style="color:#e8a838;margin:0 0 0.75rem">Dark Sun Chronicles</h1>' +
      '<p style="color:#a89888;line-height:1.5">The full companion app (Dynamic Influence Engine, character sheets, NPC generator) is in the distributable package.</p>' +
      '<p style="color:#a89888;line-height:1.5">Replace <code style="color:#e8a838">js/app.js</code> with the file from <strong>DSCToolkt-app.zip</strong>, then hard-refresh.</p>' +
      '<p style="margin-top:1rem"><a href="https://github.com/Cybermorf/DSCToolkt" style="color:#e8a838">GitHub repo</a></p></div>';
  });
})();
