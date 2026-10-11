# DSC Toolkt — Dark Sun Chronicles DM Companion

Offline-first companion app for **The Dark Sun Chronicles** (Eldoria / Seven Worlds). Tracks campaigns, party sheets, DIE forces, bestiary, combat, and more. Pure static HTML/CSS/JS — no backend.

Deploy: GitHub Pages ready. Local: open `index.html` or serve the folder.

---

## Quick start

1. Open `index.html` in a modern browser, **or**
   ```bash
   python -m http.server 8080
   # then http://localhost:8080
   ```
2. **Campaigns → New Campaign**
3. Use the sidebar to open sections (most need an active campaign)

**Data:** campaign state in `localStorage` (`darkSunChronicles_v1`).  
**Compendium imports** (Open5e / JSON packs) use **IndexedDB** so large bestiaries do not hit storage quotas.

**Hard refresh** after updates: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).

---

## Section guide

### Campaigns
Create, switch, and delete campaigns. Each holds its own party, villains, forces, factions, sessions, notes, and combat state.

### Overview
Active campaign summary: world, tier, status, goals. Quick glance before a session.

### Session Log
Record sessions (date, title, summary, worlds visited). Living chronicle of the table.

### Party
Full **5e-style character sheets** for PCs (and allied NPCs):

- Races (DSC + official basics), classes (PHB + DSC / Moon Guardian paths)
- Ability scores: manual, **point buy**, or **standard array** (click-to-assign, high→low, reset)
- HP, AC (armor/shield from inventory), proficiency, skills, features
- **Equipment** catalog with search; equip armor/weapons to affect AC & attacks
- **Spellcasting**: slots by class/level, known/prepared spells with full cards
- **Umbrarian** template: stage, shard, auto Shard DC (highest of INT/WIS/CHA), corruption, gifts
- Avatar upload (falls back to monogram)
- **View Sheet** (multi-page), **Edit**, **Export/Import JSON**, **Print** (A4, parchment style)

### Villains / NPCs
NPC generator with stat blocks; can mark as villains. Supports Umbrarian option. Add to combat as enemies.

### Combat Tracker
Initiative order, HP editing, turn advance. Click a combatant for the detail panel.  
Add from party, villains, or **Bestiary**. Random encounter helper available.

### Bestiary
DSC creatures with ecology, behaviour, running notes, adventure seeds.  
**Source filter:** All / DSC only / **Imported** (Open5e or JSON).  
Add to combat or villains. Random encounter by world/CR.

### Umbrarians
Reference section: definition (host ≠ Umbralite race), stages (Dormant / Awakened / Ascendant), common traits, corruption track (0–6), Dark Bargains, Shard Demands, the Seven Shards, NPC/PC guidance.  
On sheets: Shard DC, attack bonus, corruption state text, stage text, generic gifts, bargains.

### DSC Classes
Moon Guardian and other DSC class writeups with progression tables and path features (e.g. Path of Luna).

### Factions & Reputation
Track factions on a **−3 to +3** scale. Notes and quick adjustments.  
Linked to Force Turn when a force shares the faction’s name (disruption updates rep + notes).

### Active Forces (Dynamic Influence Engine)
Living antagonists with Public Face, Goal, Political / Corruptive / Disruptive influence (0–6), **Agenda Clock** (0–6), Awareness (0–4), Pressure (0–4).

**Force Turn:**

1. For each force, set **party disruption**: None / Minor / Major / Thwarted  
2. Agenda clocks **retract** on disruption; influence/pressure/awareness adjust  
3. Forces then act (disrupted ones retaliate more, advance less)  
4. Results report + optional link to matching **Factions**

### Campaign Notes
Free-form notes; auto-save.

### Tools
- Dice roller (also always in the header)
- Random generators (faction, force, etc.)
- **Compendium Import** — JSON packs (`DSCToolkt-compendium-v1`: spells, equipment, creatures)
- **Open5e API Sync** (v2 — `api.open5e.com/v2`):
  - SRD 5.2 only (`document__key=srd-2024`) or full library  
  - Sync **Spells**, **Weapons & Armor**, **Bestiary (creatures)**, or all  
  - Merges into user compendium (IndexedDB); does not wipe built-in DSC/SRD seeds  

### Export / Import (header)
Full campaign JSON backup and restore. Export characters individually from the sheet.

---

## Character sheet notes

| Feature | Behaviour |
|--------|-----------|
| Standard array | Click ability labels to assign 15→8; dim used values; Reset available |
| Point buy | Live cost display within 5e budget |
| Equipment | Search + category; equip toggles AC and attack list |
| Spells | Only for casters; cards show time/range/duration/components + full text |
| Print | A4 continuous layout; Attacks, Spellcasting, Equipment as their own sections |
| Umbrarian | Stage + shard on create/edit; DC auto from best mental score |

---

## Open5e sync

1. Open **Tools**  
2. Optionally leave **SRD 5.2 only** checked  
3. **Sync Spells + Equipment + Bestiary** (or a subset)  
4. Progress appears in the status line  
5. Bestiary → source filter **Imported** to browse; use in combat as usual  

If storage errors appear after an old version, run once in the console:

```js
localStorage.removeItem('dsc_compendium_extra');
```

Then hard-refresh and sync again (data now lives in IndexedDB).

---

## Attribution

- Built-in SRD-derived spell/equipment seeds and Open5e pulls include material from the **System Reference Document** (Wizards of the Coast) under **CC-BY-4.0** where applicable.  
- Open5e: [github.com/open5e/open5e-api](https://github.com/open5e/open5e-api) — individual documents keep their own licenses.  
- **The Dark Sun Chronicles** content is for the owning Player/DM’s table materials.

---

## Project layout

```
dark-sun-companion/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js              # SPA logic
│   ├── bestiary-data.js    # DSC creatures
│   ├── phb-data.js         # Races, classes, Umbrarians, paths
│   ├── equipment-data.js   # Armor, weapons, gear + spell slot tables
│   └── spells-data.js      # Spell catalog
├── data/                   # Optional sample packs
├── manifest.webmanifest
└── README.md
```

## Deploy (GitHub Pages)

Settings → Pages → GitHub Actions (workflow included), or deploy `main` root as static files.  
Site: `https://<user>.github.io/<repo>/`

---

*The Dark Sun Chronicles · DM Companion*
