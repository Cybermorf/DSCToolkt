# DSC Toolkt — Dark Sun Chronicles DM Companion

Offline-first companion for **The Dark Sun Chronicles** (Eldoria / Seven Worlds). Tracks campaigns, full 5e character sheets, DIE forces, bestiary, factions, and imports. Pure static HTML/CSS/JS — no backend.

**Repo:** https://github.com/Cybermorf/DSCToolkt  
**Player app:** https://github.com/Cybermorf/DSCPlayer-Companion  
**Combat Tracker (standalone):** https://github.com/Cybermorf/Cybervlachos-s-Combat-Tracker

---

## Quick start

1. Open `index.html` in a modern browser, **or**
   ```bash
   python -m http.server 8080
   # → http://localhost:8080
   ```
2. **Campaigns → New Campaign**
3. Use the sidebar (most sections need an active campaign)

**Storage**
- Campaign / party state → `localStorage`
- Large imports (Open5e, CritterDB, packs) → **IndexedDB** (avoids quota errors)

**Hard refresh after updates:** `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

---

## Section guide

### Campaigns
Create, switch, delete campaigns. Each has its own party, villains, forces, factions, sessions, and notes.

### Overview
Active campaign summary: world, tier, status, goals.

### Session Log
Date, title, summary, worlds visited — living table chronicle.

### Party & Character Sheets
Full **5e-style** PC/NPC sheets (races, classes, multiclass, ASI/feats, skills, equipment, spells, resources, Umbrarian, View/Print, export/import with stable `characterId`).

**Sheet lock (Player handoff):** On save, DM can lock the sheet for limited Player-app edits.

### Villains & NPCs
NPC generator; mark as villains; Umbrarian option.

### Combat Tracker — moved

Live combat tracking lives in a **separate app** so the Toolkit stays focused on campaign prep:

**→ [Cybervlachos's Combat Tracker](https://github.com/Cybermorf/Cybervlachos-s-Combat-Tracker)**

Export party/villain JSON from this Toolkit and import them there. The Combat section has been removed from this app’s sidebar.

### Bestiary
DSC creatures (ecology, behaviour, running notes, adventure seeds) plus **imported** material.

### Umbrarians / DSC Classes / Forces / Factions / Notes / Tools
Unchanged — see previous docs for DIE, Open5e, CritterDB, VTT I/O, custom content packs.

---

## Related

- Player Companion: https://github.com/Cybermorf/DSCPlayer-Companion
- Combat Tracker: https://github.com/Cybermorf/Cybervlachos-s-Combat-Tracker

## Attribution

SRD / Open5e under their respective licenses. CritterDB and third-party packs remain under their authors’ terms. Dark Sun Chronicles materials for the owning table.
