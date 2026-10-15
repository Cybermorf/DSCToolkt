# DSC Toolkt — Dark Sun Chronicles DM Companion

Offline-first companion for **The Dark Sun Chronicles** (Eldoria / Seven Worlds). Tracks campaigns, full 5e character sheets, DIE forces, bestiary, combat, factions, and imports. Pure static HTML/CSS/JS — no backend.

**Repo:** https://github.com/Cybermorf/DSCToolkt  
**Player app:** https://github.com/Cybermorf/DSCPlayer-Companion

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
Create, switch, delete campaigns. Each has its own party, villains, forces, factions, sessions, notes, and combat state.

### Overview
Active campaign summary: world, tier, status, goals.

### Session Log
Date, title, summary, worlds visited — living table chronicle.

### Party & Character Sheets
Full **5e-style** PC/NPC sheets:

| Area | Details |
|------|---------|
| **Races** | DSC · Official 5e · Homebrew/Imported (separate groups) |
| **Classes** | PHB + DSC (Moon Guardian paths) + imported subclasses |
| **Multiclass** | Official rules; total level sums class levels; epic levels allowed (DM) |
| **ASI / Feats** | Per-class slots (4/8/12/16/19; Fighter/Rogue extras; epic every 4 after 20). Stack across multiclass. +2 ability **or** one feat per slot |
| **Skills** | Proficiency limits from each class (summed when multiclassing) |
| **Ability scores** | Manual · Point buy · Standard array (click-to-assign) |
| **Equipment** | Searchable catalog; equip armor/weapons → AC & attacks |
| **Spells** | Slots, known/prepared, full spell cards; multiclass caster table |
| **Resources** | Ki, Lunar Charges, Rage, etc. tracked per class |
| **Umbrarian** | Stage, shard, auto Shard DC, corruption, gifts (lockable for Player export) |
| **View / Print** | Multi-page sheet (Combat → Attacks & Spells → Progression → Story); A4 print |
| **Export / Import** | JSON with stable `characterId` — re-import **updates** the same sheet |

**Sheet lock (Player handoff):** On save, DM can lock the sheet. Player app may then only change equipment, HP/conditions, Level Up / multiclass levels, and unclaimed ASI slots.

### Villains & NPCs
NPC generator; mark as villains; Umbrarian option; send to combat.

### Combat Tracker
Initiative, HP, conditions, turn order. Detail panel on select. Add from party, villains, or **Bestiary**. Random encounter helper.

### Bestiary
DSC creatures (ecology, behaviour, running notes, adventure seeds) plus **imported** material.  
Source filter: All / DSC / Imported. Add to combat. **Refresh Bestiary** reloads from storage.

### Umbrarians
Reference: stages, shards, corruption, gifts. Apply template on character creation/edit.

### DSC Classes
Moon Guardian paths and other DSC class details + progression tables.

### Forces / Factions (DIE)
Dynamic Influence Engine: agenda clocks, awareness/pressure, Force Turn (including player disruption → faction goal retraction).

### Notes
Free-form campaign notes (auto-save).

### Tools
| Tool | Purpose |
|------|---------|
| **Dice roller** | Always available |
| **Open5e v2 sync** | Spells, equipment, creatures (SRD filter optional) |
| **JSON pack import** | Flexible packs (spells, equipment, races, classes, subclasses, feats) |
| **CritterDB** | Bulk crawl script → import JSON (`tools/critterdb-bulk-crawl.mjs`) |
| **Class tables** | Wild Surge and similar class tables |
| **VTT I/O** | Foundry actor JSON & Roll20 handouts/tables (import/export) |
| **Compendium** | Searchable features, feats, abilities |

---

## Character ID & import upsert

Every character has a stable internal `id` (also exported as `characterId`).  
It is **not** shown on View / Edit / Print.

- **Import** of a JSON with a matching id → **updates** that character  
- New id → adds a new character  

Works the same in the Player Companion.

---

## Multiclass & ASI (summary)

- Character level = sum of class levels (epic > 20 allowed for DM)
- Spell slots use the multiclass caster table (+ Warlock pact slots)
- **ASI slots are per class** and **stack** (e.g. three standard classes at 20 ≈ 15 slots)
- Subclasses unlock at class-specific levels (e.g. Barbarian 3, Warlock **3** per 2024 PHB)
- Moon Guardian **Path** syncs only with the Moon Guardian subclass row

---


### Custom content (homebrew)

Create or import races, classes, subclasses, feats, weapons, armor, and spells.

1. **Tools → Custom Content** — quick-add a single item, **Import Pack JSON**, or **Export Custom Pack** (Player-safe: no creatures).
2. **Template:** [`templates/custom-compendium-pack.template.json`](templates/custom-compendium-pack.template.json) — copy, edit, import.
3. Format: `DSCToolkt-compendium-v2` (v1 packs with only spells/equipment still work).

**Player Companion** can import the same pack for spells, equipment, races, classes, subclasses, and feats. Bestiary creatures stay DM-only.

## CritterDB bulk import

```bash
node tools/critterdb-bulk-crawl.mjs
```

Writes a JSON pack; import it from Tools. Duplicates are skipped/updated by name/id.  
Then use **Bestiary → Refresh** if the list does not update immediately.

---

## Deploy (GitHub Pages)

Settings → Pages → GitHub Actions (workflow included), or publish the repo root as static files.

**From release zip:** extract so `index.html` is at the site root.

---

## Related

- Player Companion: https://github.com/Cybermorf/DSCPlayer-Companion

## Attribution

SRD / Open5e under their respective licenses (including CC-BY-4.0 for Wizards SRD content where applicable). CritterDB and third-party packs remain under their authors’ terms. Dark Sun Chronicles materials for the owning table.

---

*The Dark Sun Chronicles · DM Companion (DSC Toolkt)*
