/**
 * Dark Sun Chronicles — DM Companion
 *
 * If you see this stub, the full app.js (~80 KB) could not be uploaded via the
 * GitHub API connector due to payload size limits.
 *
 * FULL BUILD (Dynamic Influence Engine, full PC character sheets, NPC generator):
 * 1. Download DSCToolkt-app.zip from the repo artifacts / releases / local build
 * 2. Extract and replace this file with js/app.js from the package
 * 3. Hard-refresh the site (Ctrl+Shift+R or Cmd+Shift+R)
 *
 * Or clone the repo, copy the local js/app.js, and push from your machine:
 *   git add js/app.js && git commit -m "Full app.js" && git push
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('app');
    if (!root) return;
    root.innerHTML =
      '<div style="max-width:36rem;margin:3rem auto;padding:1.75rem;font-family:system-ui,sans-serif;background:#1c1816;color:#e8e0d5;border-radius:12px;border:1px solid #3d342e;line-height:1.55">' +
      '<h1 style="color:#e8a838;margin:0 0 0.75rem;font-size:1.4rem">Dark Sun Chronicles</h1>' +
      '<p style="color:#a89888;margin:0 0 0.75rem">The full companion app is ready in the distributable package:</p>' +
      '<ul style="color:#a89888;margin:0 0 1rem;padding-left:1.25rem">' +
      '<li>Dynamic Influence Engine (influences, agenda clocks, Force Turn)</li>' +
      '<li>Full 5e-compatible PC character sheets + corruption</li>' +
      '<li>NPC generator with complete stat blocks</li>' +
      '<li>Campaign tracker, factions, dice roller, generators</li>' +
      '</ul>' +
      '<p style="color:#a89888;margin:0 0 0.5rem"><strong style="color:#e8a838">To activate:</strong></p>' +
      '<ol style="color:#a89888;margin:0 0 1rem;padding-left:1.25rem">' +
      '<li>Download <code style="color:#e8a838">DSCToolkt-app.zip</code></li>' +
      '<li>Replace <code style="color:#e8a838">js/app.js</code> with the file from the zip</li>' +
      '<li>Hard-refresh this page (Ctrl+Shift+R)</li>' +
      '</ol>' +
      '<p style="margin:0"><a href="https://github.com/Cybermorf/DSCToolkt" style="color:#e8a838">GitHub repo</a></p></div>';
  });
})();
