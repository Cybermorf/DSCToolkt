/**
 * Dark Sun Chronicles — DM Companion
 * Local-first campaign tracker + dice roller for Eldoria living campaigns.
 * Includes random generators for Factions, Active Forces, and Dynamic Influence progression.
 * Data persists in localStorage. Export/import as JSON.
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'darkSunChronicles_v1';
  const WORLDS = ['Luminaris', 'Umbraria', 'Eternum', 'Solara', 'Aetheria', 'Harmonia', 'Celestia'];

    const BESTIARY = (typeof window !== 'undefined' && window.BESTIARY_DATA)
    ? window.BESTIARY_DATA
    : [];
  // short alias fields kept for older saves: n,w,o,cr,ac,hp + desc/eco/people/run/seeds
  // 115 creatures with descriptions
  // 115 principal creatures from Bestiary of the Seven Worlds

  // ─── Generators (setting-flavored) ───────────────────────────────────────
  const GENERATORS = {
    factionTypes: [
      'Government', 'Cult', 'Merchant House', 'Temple', 'Guild',
      'Military Order', 'Secret Society', 'Trade Consortium', 'Noble House',
      'Pilgrim Order', 'Arcane Cabal', 'Criminal Syndicate'
    ],
    factionPrefixes: [
      'Solar', 'Umbral', 'Aether', 'Celestial', 'Harmonic', 'Eternal', 'Radiant',
      'Ashen', 'Hollow', 'Gilded', 'Silent', 'Crimson', 'Ivory', 'Obsidian',
      'Verdant', 'Storm', 'Twin', 'Seventh', 'Bound', 'Unseen'
    ],
    factionNouns: [
      'Concord', 'Court', 'Circle', 'Syndicate', 'Legion', 'Covenant', 'Spire',
      'Assembly', 'Order', 'Conclave', 'Cabal', 'Throne', 'Gate', 'Fleet',
      'Archive', 'Chorus', 'Blade', 'Chain', 'Veil', 'Forge', 'Market', 'Host'
    ],
    forceTypes: ['Antagonist', 'Faction', 'Cult', 'Government', 'Disaster', 'Supernatural', 'Other'],
    forceNameTemplates: [
      'The {adj} {noun}',
      '{adj} {noun}',
      'The {noun} of {place}',
      '{name}\'s {noun}',
      'The {adj} {place} {noun}'
    ],
    forceAdjs: [
      'Hollow', 'Ashen', 'Silent', 'Burning', 'Forgotten', 'Radiant', 'Twisted',
      'Eternal', 'Shattered', 'Gilded', 'Umbral', 'Primordial', 'Starved',
      'Bound', 'Unraveling', 'Celestial', 'Corrupt', 'Wandering', 'Hungering'
    ],
    forceNouns: [
      'Sovereign', 'Plague', 'Court', 'Host', 'Tide', 'Engine', 'Prophet',
      'Shadow', 'Flame', 'Archive', 'Gate', 'Choir', 'Legion', 'Bargain',
      'Storm', 'Crown', 'Hunger', 'Mirror', 'Veil', 'Spire', 'Pact', 'Woe'
    ],
    forcePlaces: [
      'Luminaris', 'Umbraria', 'the Gateways', 'the Outer Dark', 'Solara',
      'the Aetherian Routes', 'Celestia', 'the Broken Clock', 'the Seven Suns',
      'Harmonia', 'the Deep Archives', 'the Ashen Sea'
    ],
    forceNames: [
      'Vaelith', 'Korr', 'Saphira', 'Thane', 'Mirael', 'Orrin', 'Leth',
      'Nyxara', 'Druin', 'Selene', 'Vorath', 'Elara', 'Kael', 'Zir'
    ],
    goals: [
      'Seize control of a major Celestial Gateway',
      'Corrupt a key faction from within',
      'Redirect trade routes to starve a rival world',
      'Awaken a dormant Primordial power',
      'Eliminate the party before they grow too strong',
      'Install a puppet ruler on a target world',
      'Harvest corruption from pilgrim routes',
      'Break a long-standing treaty between two worlds',
      'Recover an artifact sealed in Eternum',
      'Spread a supernatural plague or blight',
      'Force a celestial alignment for a ritual',
      'Undermine the reputation of the party\'s patrons',
      'Monopolize a critical resource (spice, crystal, memory-ink)',
      'Convert a major temple to a darker doctrine',
      'Open a permanent rift between two worlds',
      'Collect blood-debts from every major house',
      'Erase a prophecy that threatens its plans',
      'Bind a powerful spirit or entity as a permanent ally'
    ],
    resources: [
      'Loyal agents embedded in three courts',
      'A private fleet of shadow-vessels',
      'Vast merchant wealth and blackmail ledgers',
      'Access to a minor Celestial Gateway',
      'A cadre of corrupted priests',
      'Ancient knowledge from pre-Sundering archives',
      'Control of a vital trade choke-point',
      'A network of informants across two worlds',
      'A bound supernatural entity of moderate power',
      'Political leverage over a planetary government',
      'A growing cult of true believers',
      'Experimental rituals and forbidden lore',
      'A hidden fortress or sanctuary',
      'Stolen identities and forged documents',
      'Weather or environmental manipulation on a local scale'
    ],
    statusSnippets: [
      'Recently moved agents into position near the party\'s last known location.',
      'Suffered a setback and is regrouping; may seek temporary allies.',
      'Successfully expanded influence into a new world.',
      'Is watching the party with increased interest after recent events.',
      'Has begun a long-term ritual that will complete in 1d4 sessions if uninterrupted.',
      'Lost a key lieutenant; recruiting replacements.',
      'Offered a dark bargain to a secondary NPC the party knows.',
      'Diverted a trade caravan; shortages will be felt soon.',
      'Publicly denounced the party (or their patrons) on one world.',
      'Quietly secured a new source of power or funding.',
      'Is preparing a direct strike against a location the party cares about.',
      'Has gone silent — either in hiding or preparing something larger.'
    ],
    factionNotes: [
      'Values loyalty above all; remembers both favors and insults for years.',
      'Publicly neutral but privately advancing a long game.',
      'Currently locked in quiet conflict with another faction.',
      'Eager for capable outsiders who can solve problems deniably.',
      'Suspicious of anyone who travels freely between worlds.',
      'Holds a secret that could destabilize a planetary government.',
      'Recently suffered a leadership change; internal power struggle ongoing.',
      'Controls a key resource or route the party may need later.',
      'Has both a public face and a deeply hidden agenda.',
      'Open to alliance if the price (and the risk) is right.'
    ],
    complications: [
      'A rival force claims credit for the party\'s last success.',
      'A trusted contact has been compromised or replaced.',
      'A celestial alignment closes a major route for 1d3 sessions.',
      'A local power demands tribute or service for continued safe passage.',
      'Evidence of the party\'s actions reaches an unexpected faction.',
      'A prophecy or omen begins circulating that names the party.',
      'Supply lines the party relies on are disrupted by distant conflict.',
      'An old debt or favor is called in at the worst possible moment.',
      'A disaster (plague, storm, riot) erupts in a city the party just left.',
      'Two factions the party deals with declare open hostility toward each other.'
    ],
    // Dynamic Influence Engine tables
    publicFaces: [
      'A respected healing ministry and charity',
      'The only order capable of keeping the trade roads safe',
      'A scholarly archive preserving pre-Sundering knowledge',
      'A reform movement promising justice for the common folk',
      'A merchant consortium that stabilizes prices across worlds',
      'A temple devoted to balance and celestial harmony',
      'A private security company hired by nervous cities',
      'An obscure pilgrim order few take seriously',
      'A legitimate planetary ministry of transit and gateways',
      'A celebrated artistic collective with political patrons'
    ],
    assets: [
      'Loyal agents embedded in three courts',
      'Blackmail ledgers on mid-tier officials',
      'A minor Celestial Gateway under quiet control',
      'A cadre of corrupted or devoted priests',
      'Vast merchant wealth and shell companies',
      'A bound supernatural entity of moderate power',
      'Control of a vital trade choke-point',
      'Ancient knowledge from sealed archives',
      'A network of informants across two worlds',
      'Political leverage over a planetary office',
      'A hidden fortress or sanctuary',
      'Stolen identities and forged documents',
      'Experimental rituals and forbidden lore',
      'Weather or environmental manipulation on a local scale',
      'A private fleet of shadow-vessels'
    ],
    vulnerabilities: [
      'Depends on a single irreplaceable specialist',
      'Public face would collapse if true nature were exposed',
      'Rival force holds compromising evidence',
      'Supply line runs through a contested Gateway',
      'Internal schism between hardliners and pragmatists',
      'Key asset is a person the party could reach',
      'Ritual or plan requires a specific celestial window',
      'Overextended across too many worlds',
      'Recent failure damaged legitimacy',
      'A former member knows dangerous secrets'
    ],
    politicalActions: [
      'Secures a favorable treaty or edict on one world',
      'Redirects trade to starve a rival or reward allies',
      'Discredits a rival through public accusation',
      'Places a sympathetic official in a useful post',
      'Buys silence or loyalty from a mid-tier institution',
      'Announces a legitimate-seeming initiative that advances its goal',
      'Forms a temporary alliance of convenience with another force'
    ],
    corruptiveActions: [
      'Recruits a spy inside an institution the party trusts',
      'Offers a tempting bargain to a secondary NPC',
      'Infiltrates a temple or guild under false credentials',
      'Normalizes a harmful practice through soft pressure',
      'Blackmails a mid-level official into cooperation',
      'Spreads a doctrine or rumor that weakens resistance',
      'Compromises a contact the party has relied on'
    ],
    disruptiveActions: [
      'Blockades or disrupts a route the party uses',
      'Raids a resource depot or caravan',
      'Provokes unrest in a city the party cares about',
      'Releases a localized hazard or blight',
      'Assassinates or removes a supporting NPC',
      'Stages a military or paramilitary demonstration',
      'Sabotages a Gateway or vessel the party might need'
    ],
    clockStageLabels: [
      'Dormant',
      'Signs & rumors',
      'Local consequences',
      'Gains leverage',
      'Institutions react',
      'Goal imminent',
      'Goal achieved — campaign transforms'
    ],
    // NPC generator
    npcRoles: [
      'Gate warden', 'Merchant factor', 'Cult acolyte', 'City guard captain',
      'Pilgrim guide', 'Archive scribe', 'Shadow broker', 'Temple priest',
      'Caravan master', 'Dock smuggler', 'Court attendant', 'Wandering seer',
      'Guild enforcer', 'Refugee leader', 'Vessel navigator', 'Debt collector',
      'Shard-touched hermit', 'Planetary magistrate', 'Spy for a rival force',
      'Healer with a secret'
    ],
    npcNameParts: {
      first: ['Vael', 'Korr', 'Saph', 'Thane', 'Mir', 'Orrin', 'Leth', 'Nyx', 'Druin', 'Sel', 'Vor', 'Ela', 'Kael', 'Zir', 'Ash', 'Ren', 'Tova', 'Jor', 'Ilya', 'Brek'],
      second: ['ith', 'ara', 'en', 'is', 'ael', 'or', 'un', 'ara', 'eth', 'ene', 'ath', 'ra', 'os', 'an', 'e', 'na', 'ik', 'el', 'as', 'or'],
      titles: ['the Pale', 'of the Gate', 'Twice-Marked', 'the Silent', 'Sunscarred', 'of Seven Roads', 'the Bound', 'Ashwalker', 'the Ledger-Keeper', 'Star-Eyed']
    },
    npcTraits: [
      'Speaks in proverbs from another world',
      'Never removes a distinctive glove or veil',
      'Collects debts in favors, not coin',
      'Afraid of open Gateways',
      'Quietly devout to a forgotten power',
      'Knows the party by reputation already',
      'Owes a blood-debt to a major faction',
      'Hums a Harmonian work-song when nervous',
      'Carries a sealed letter they refuse to open',
      'Has one glass eye that sometimes tracks movement on its own'
    ],
    npcSecrets: [
      'Is an agent of an Active Force the party has not met',
      'Carries a minor Shard fragment without knowing it',
      'Falsified travel papers for a dangerous passenger',
      'Witnessed a celestial alignment ritual and survived',
      'Is blackmailing a mid-tier official on another world',
      'Plans to abandon their post at the next Gateway opening',
      'Once belonged to a cult they now hunt',
      'Has a sibling among the party\'s allies or enemies'
    ]
  };

  function generateNpcName() {
    const a = pick(GENERATORS.npcNameParts.first);
    const b = pick(GENERATORS.npcNameParts.second);
    const useTitle = Math.random() < 0.35;
    const name = a + b;
    return useTitle ? `${name} ${pick(GENERATORS.npcNameParts.titles)}` : name;
  }

  function scoresForCr(cr) {
    // Rough 5e-ish arrays by CR band
    const bands = {
      0:  [10, 10, 10, 10, 10, 10],
      1:  [13, 12, 12, 10, 11, 10],
      2:  [14, 13, 13, 10, 12, 10],
      3:  [15, 14, 14, 11, 12, 11],
      5:  [16, 14, 15, 12, 13, 12],
      8:  [18, 15, 16, 12, 14, 13],
      11: [19, 16, 17, 14, 15, 14]
    };
    const keys = Object.keys(bands).map(Number).sort((a, b) => a - b);
    let chosen = bands[0];
    for (const k of keys) { if (cr >= k) chosen = bands[k]; }
    // Shuffle assignment to abilities for variety
    const shuffled = [...chosen].sort(() => Math.random() - 0.5);
    return { str: shuffled[0], dex: shuffled[1], con: shuffled[2], int: shuffled[3], wis: shuffled[4], cha: shuffled[5] };
  }

  function generateNpc(opts = {}) {
    const crOptions = [0, 0.25, 0.5, 1, 2, 3, 5, 8];
    const cr = opts.cr != null ? opts.cr : pick(crOptions);
    const role = opts.role || pick(GENERATORS.npcRoles);
    const world = opts.world || pick(WORLDS);
    const scores = scoresForCr(Number(cr) || 0);
    const dexMod = abilityMod(scores.dex);
    const conMod = abilityMod(scores.con);
    const strMod = abilityMod(scores.str);
    const wisMod = abilityMod(scores.wis);

    // HP / AC heuristics by CR
    let hpMax, ac, attackBonus, damage;
    const crn = Number(cr) || 0;
    if (crn <= 0.5) { hpMax = 8 + Math.floor(Math.random() * 12) + conMod; ac = 11 + Math.max(0, dexMod); attackBonus = 3 + Math.max(strMod, dexMod); damage = '1d6+' + Math.max(0, strMod); }
    else if (crn <= 2) { hpMax = 22 + Math.floor(Math.random() * 18) + conMod * 2; ac = 13 + Math.max(0, Math.min(2, dexMod)); attackBonus = 4 + Math.max(strMod, dexMod); damage = '1d8+' + Math.max(0, strMod); }
    else if (crn <= 5) { hpMax = 45 + Math.floor(Math.random() * 30) + conMod * 3; ac = 14 + Math.max(0, Math.min(2, dexMod)); attackBonus = 5 + Math.max(strMod, dexMod); damage = '2d6+' + Math.max(0, strMod); }
    else { hpMax = 80 + Math.floor(Math.random() * 40) + conMod * 4; ac = 15 + Math.max(0, Math.min(3, dexMod)); attackBonus = 7 + Math.max(strMod, dexMod); damage = '2d8+' + Math.max(0, strMod); }

    const weapons = ['shortsword', 'spear', 'scimitar', 'light crossbow', 'dagger', 'mace', 'quarterstaff', 'handaxe'];
    const weapon = pick(weapons);
    const attackModStr = attackBonus >= 0 ? `+${attackBonus}` : `${attackBonus}`;

    return {
      name: generateNpcName(),
      role,
      world,
      cr: String(cr),
      ...scores,
      ac,
      hp: hpMax,
      hpMax,
      speed: '30 ft.',
      perception: 10 + wisMod + (Math.random() < 0.4 ? 2 : 0),
      attacks: `${weapon} ${attackModStr} to hit, ${damage} damage`,
      traits: pick(GENERATORS.npcTraits),
      secret: pick(GENERATORS.npcSecrets),
      notes: ''
    };
  }

  function formatNpcBlock(npc) {
    const abs = `STR ${npc.str} (${modStr(npc.str)})  DEX ${npc.dex} (${modStr(npc.dex)})  CON ${npc.con} (${modStr(npc.con)})  INT ${npc.int} (${modStr(npc.int)})  WIS ${npc.wis} (${modStr(npc.wis)})  CHA ${npc.cha} (${modStr(npc.cha)})`;
    return {
      title: npc.name,
      subtitle: `${npc.role} · ${npc.world} · CR ${npc.cr}`,
      lines: [
        `AC ${npc.ac} · HP ${npc.hp}/${npc.hpMax} · Speed ${npc.speed}`,
        abs,
        `Passive Perception ${npc.perception}`,
        `Attacks: ${npc.attacks}`,
        `Trait: ${npc.traits}`,
        `Secret: ${npc.secret}`
      ]
    };
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateFactionName() {
    return `The ${pick(GENERATORS.factionPrefixes)} ${pick(GENERATORS.factionNouns)}`;
  }

  function generateForceName() {
    const tpl = pick(GENERATORS.forceNameTemplates);
    return tpl
      .replace('{adj}', pick(GENERATORS.forceAdjs))
      .replace('{noun}', pick(GENERATORS.forceNouns))
      .replace('{place}', pick(GENERATORS.forcePlaces))
      .replace('{name}', pick(GENERATORS.forceNames));
  }

  function generateFaction() {
    return {
      name: generateFactionName(),
      type: pick(GENERATORS.factionTypes),
      world: pick(WORLDS),
      reputation: Math.floor(Math.random() * 3) - 1, // -1, 0, or +1
      notes: pick(GENERATORS.factionNotes)
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function generateForce() {
    const pol = Math.floor(Math.random() * 5);       // 0–4 typical
    const cor = Math.floor(Math.random() * 5);
    const dis = Math.floor(Math.random() * 5);
    // Ensure at least one influence is meaningful
    const maxInf = Math.max(pol, cor, dis);
    const bump = maxInf === 0 ? 2 : 0;
    return {
      name: generateForceName(),
      type: pick(GENERATORS.forceTypes),
      publicFace: pick(GENERATORS.publicFaces),
      goal: pick(GENERATORS.goals),
      political: clamp(pol + (bump && pol === maxInf ? bump : 0), 0, 6),
      corruptive: clamp(cor + (bump && cor === maxInf ? bump : 0), 0, 6),
      disruptive: clamp(dis + (bump && dis === maxInf ? bump : 0), 0, 6),
      agendaClock: Math.floor(Math.random() * 3), // start early
      awareness: Math.floor(Math.random() * 2),   // 0–1
      pressure: Math.floor(Math.random() * 2),
      assets: pick(GENERATORS.assets),
      vulnerabilities: pick(GENERATORS.vulnerabilities),
      resources: pick(GENERATORS.resources),
      status: pick(GENERATORS.statusSnippets),
      lastAction: ''
    };
  }

  function normalizeForce(f) {
    // Migrate older force records to full DIE shape
    return {
      id: f.id,
      name: f.name || 'Unnamed Force',
      type: f.type || 'Antagonist',
      publicFace: f.publicFace || '',
      goal: f.goal || '',
      political: clamp(Number(f.political) || 0, 0, 6),
      corruptive: clamp(Number(f.corruptive) || 0, 0, 6),
      disruptive: clamp(Number(f.disruptive) || 0, 0, 6),
      agendaClock: clamp(Number(f.agendaClock) || 0, 0, 6),
      awareness: clamp(Number(f.awareness) || 0, 0, 4),
      pressure: clamp(Number(f.pressure) || 0, 0, 4),
      assets: f.assets || f.resources || '',
      vulnerabilities: f.vulnerabilities || '',
      resources: f.resources || '',
      status: f.status || '',
      lastAction: f.lastAction || '',
      notes: f.notes || ''
    };
  }

  function dominantInfluence(f) {
    const scores = [
      { key: 'political', val: f.political || 0 },
      { key: 'corruptive', val: f.corruptive || 0 },
      { key: 'disruptive', val: f.disruptive || 0 }
    ];
    scores.sort((a, b) => b.val - a.val);
    return scores[0].key;
  }

  function influenceReach(rating) {
    const labels = [
      'none', 'individual / crew', 'settlement', 'regional',
      'planetary', 'multi-world', 'system-defining'
    ];
    return labels[clamp(rating, 0, 6)] || 'none';
  }

  // ─── State ───────────────────────────────────────────────────────────────
  let state = {
    campaigns: [],
    activeCampaignId: null,
    diceHistory: [],
    selectedDie: 20,
  };

  // ─── DOM refs ────────────────────────────────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ─── Persistence ─────────────────────────────────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.campaigns = (parsed.campaigns || []).map(ensureCampaignShape);
        state.activeCampaignId = parsed.activeCampaignId || null;
        state.diceHistory = parsed.diceHistory || [];
      }
    } catch (e) {
      console.warn('Failed to load state', e);
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        campaigns: state.campaigns,
        activeCampaignId: state.activeCampaignId,
        diceHistory: state.diceHistory.slice(0, 50),
      }));
    } catch (e) {
      toast('Storage full or unavailable');
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function getActive() {
    return state.campaigns.find(c => c.id === state.activeCampaignId) || null;
  }

  // ─── Toast ───────────────────────────────────────────────────────────────
  let toastTimer;
  function toast(msg, ms = 2200) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
  }

  // ─── Modal ───────────────────────────────────────────────────────────────
  let modalResolve = null;

  function openModal({ title, bodyHtml, confirmText = 'Save', onConfirm, afterOpen, wide = false }) {
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = bodyHtml;
    $('#modal-confirm').textContent = confirmText;
    const panel = $('.modal-panel');
    if (panel) panel.classList.toggle('wide', !!wide);
    $('#modal').classList.remove('hidden');

    // Run afterOpen immediately so generators / extra UI can bind while modal is visible
    if (typeof afterOpen === 'function') {
      try { afterOpen(); } catch (e) { console.warn('afterOpen error', e); }
    }

    return new Promise(resolve => {
      modalResolve = (result) => {
        $('#modal').classList.add('hidden');
        if (panel) panel.classList.remove('wide');
        resolve(result);
      };
      $('#modal-confirm').onclick = () => {
        if (onConfirm) {
          const ok = onConfirm();
          if (ok !== false) modalResolve(true);
        } else {
          modalResolve(true);
        }
      };
      $('#modal-cancel').onclick = () => modalResolve(false);
      $('#modal-close').onclick = () => modalResolve(false);
      $('.modal-backdrop').onclick = () => modalResolve(false);
    });
  }

  // ─── Navigation ──────────────────────────────────────────────────────────
  function setView(viewName) {
    $$('.view').forEach(v => v.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));

    const view = $(`#view-${viewName}`);
    const nav = $(`.nav-item[data-view="${viewName}"]`);
    if (view) view.classList.add('active');
    if (nav) nav.classList.add('active');

    $('#sidebar').classList.remove('open');

    if (viewName === 'campaigns') renderCampaigns();
    else if (viewName === 'overview') renderOverview();
    else if (viewName === 'sessions') renderSessions();
    else if (viewName === 'party') renderParty();
    else if (viewName === 'combat') renderCombat();
    else if (viewName === 'bestiary') renderBestiary();
    else if (viewName === 'umbrarians') renderUmbrarians();
    else if (viewName === 'factions') renderFactions();
    else if (viewName === 'forces') renderForces();
    else if (viewName === 'notes') renderNotes();
    else if (viewName === 'tools') renderTools();
  }

  function updateNavEnabled() {
    const hasActive = !!getActive();
    $$('.nav-item').forEach(btn => {
      const v = btn.dataset.view;
      if (v === 'campaigns' || v === 'tools' || v === 'bestiary') {
        btn.disabled = false;
      } else {
        btn.disabled = !hasActive;
      }
    });

    const badge = $('#active-campaign-badge');
    const active = getActive();
    if (active) {
      badge.textContent = active.name;
      badge.classList.remove('hidden');
      badge.title = active.name;
    } else {
      badge.classList.add('hidden');
    }
  }

  // ─── Campaigns ───────────────────────────────────────────────────────────
  function createCampaign(data) {
    const c = {
      id: uid(),
      name: data.name || 'Untitled Campaign',
      description: data.description || '',
      currentWorld: data.currentWorld || 'Luminaris',
      tier: data.tier || '1-4',
      status: data.status || '',
      goals: data.goals || '',
      notes: data.notes || '',
      sessions: [],
      party: [],
      villains: [],
      combat: null,
      factions: [],
      forces: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.campaigns.unshift(c);
    state.activeCampaignId = c.id;
    save();
    updateNavEnabled();
    return c;
  }

  function ensureCampaignShape(c) {
    if (!Array.isArray(c.party)) c.party = [];
    if (!Array.isArray(c.villains)) c.villains = [];
    if (!Array.isArray(c.factions)) c.factions = [];
    if (!Array.isArray(c.forces)) c.forces = [];
    if (!Array.isArray(c.sessions)) c.sessions = [];
    if (c.combat === undefined) c.combat = null;
    return c;
  }

  function deleteCampaign(id) {
    state.campaigns = state.campaigns.filter(c => c.id !== id);
    if (state.activeCampaignId === id) {
      state.activeCampaignId = state.campaigns[0]?.id || null;
    }
    save();
    updateNavEnabled();
  }

  function setActiveCampaign(id) {
    state.activeCampaignId = id;
    save();
    updateNavEnabled();
    setView('overview');
  }

  async function promptNewCampaign(existing = null) {
    const isEdit = !!existing;
    const body = `
      <div class="field">
        <label>Campaign Name</label>
        <input type="text" id="m-name" value="${escapeAttr(existing?.name || '')}" placeholder="e.g. Shadows of Umbraria" />
      </div>
      <div class="field">
        <label>Description / Premise</label>
        <textarea id="m-desc" rows="3" placeholder="Short premise or starting situation...">${escapeHtml(existing?.description || '')}</textarea>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Starting / Current World</label>
          <select id="m-world">
            ${WORLDS.map(w => `<option value="${w}" ${ (existing?.currentWorld || 'Luminaris') === w ? 'selected' : '' }>${w}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Tier</label>
          <select id="m-tier">
            <option value="1-4" ${existing?.tier === '1-4' ? 'selected' : ''}>Local (1–4)</option>
            <option value="5-10" ${existing?.tier === '5-10' ? 'selected' : ''}>Regional (5–10)</option>
            <option value="11-16" ${existing?.tier === '11-16' ? 'selected' : ''}>Planetary (11–16)</option>
            <option value="17-20" ${existing?.tier === '17-20' ? 'selected' : ''}>Cosmic (17–20)</option>
          </select>
        </div>
      </div>
    `;

    const confirmed = await openModal({
      title: isEdit ? 'Edit Campaign' : 'New Campaign',
      bodyHtml: body,
      confirmText: isEdit ? 'Update' : 'Create',
      onConfirm: () => {
        const name = $('#m-name').value.trim();
        if (!name) {
          toast('Name is required');
          return false;
        }
        if (isEdit) {
          existing.name = name;
          existing.description = $('#m-desc').value.trim();
          existing.currentWorld = $('#m-world').value;
          existing.tier = $('#m-tier').value;
          existing.updatedAt = new Date().toISOString();
          save();
        } else {
          createCampaign({
            name,
            description: $('#m-desc').value.trim(),
            currentWorld: $('#m-world').value,
            tier: $('#m-tier').value,
          });
        }
        return true;
      },
    });

    if (confirmed) {
      toast(isEdit ? 'Campaign updated' : 'Campaign created');
      renderCampaigns();
      if (!isEdit) setView('overview');
      else if (getActive()?.id === existing.id) renderOverview();
    }
  }

  function renderCampaigns() {
    const grid = $('#campaigns-grid');
    const empty = $('#empty-campaigns');
    grid.innerHTML = '';

    if (state.campaigns.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    state.campaigns.forEach(c => {
      const card = document.createElement('div');
      card.className = 'campaign-card' + (c.id === state.activeCampaignId ? ' active-card' : '');
      card.innerHTML = `
        <div class="actions">
          <button class="edit" title="Edit">✎</button>
          <button class="delete" title="Delete">✕</button>
        </div>
        <h3>${escapeHtml(c.name)}</h3>
        <div class="meta">${escapeHtml(c.currentWorld)} · Tier ${escapeHtml(c.tier)} · ${c.sessions.length} session${c.sessions.length !== 1 ? 's' : ''}</div>
        <div class="desc">${escapeHtml(c.description) || '<em>No description</em>'}</div>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.actions')) return;
        setActiveCampaign(c.id);
      });
      card.querySelector('.edit').addEventListener('click', (e) => {
        e.stopPropagation();
        promptNewCampaign(c);
      });
      card.querySelector('.delete').addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await openModal({
          title: 'Delete Campaign?',
          bodyHtml: `<p>Delete <strong>${escapeHtml(c.name)}</strong>? This cannot be undone.</p>`,
          confirmText: 'Delete',
          onConfirm: () => {
            deleteCampaign(c.id);
            return true;
          },
        });
        if (ok) {
          toast('Campaign deleted');
          renderCampaigns();
        }
      });
      grid.appendChild(card);
    });
  }

  // ─── Overview ────────────────────────────────────────────────────────────
  function renderOverview() {
    const c = getActive();
    if (!c) return setView('campaigns');

    $('#overview-title').textContent = c.name;
    $('#current-world').value = c.currentWorld || 'Luminaris';
    $('#campaign-tier').value = c.tier || '1-4';
    $('#campaign-status').value = c.status || '';
    $('#campaign-goals').value = c.goals || '';

    ensureCampaignShape(c);
    const stats = $('#quick-stats');
    stats.innerHTML = `
      <span class="stat-pill"><strong>${c.sessions.length}</strong> sessions</span>
      <span class="stat-pill"><strong>${c.party.length}</strong> characters</span>
      <span class="stat-pill"><strong>${c.villains.length}</strong> villains</span>
      <span class="stat-pill"><strong>${c.factions.length}</strong> factions</span>
      <span class="stat-pill"><strong>${c.forces.length}</strong> active forces</span>
    `;
  }

  function bindOverviewListeners() {
    $('#current-world').addEventListener('change', () => {
      const c = getActive();
      if (!c) return;
      c.currentWorld = $('#current-world').value;
      c.updatedAt = new Date().toISOString();
      save();
      updateNavEnabled();
    });
    $('#campaign-tier').addEventListener('change', () => {
      const c = getActive();
      if (!c) return;
      c.tier = $('#campaign-tier').value;
      c.updatedAt = new Date().toISOString();
      save();
    });
    let statusTimer, goalsTimer;
    $('#campaign-status').addEventListener('input', () => {
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => {
        const c = getActive();
        if (!c) return;
        c.status = $('#campaign-status').value;
        c.updatedAt = new Date().toISOString();
        save();
      }, 400);
    });
    $('#campaign-goals').addEventListener('input', () => {
      clearTimeout(goalsTimer);
      goalsTimer = setTimeout(() => {
        const c = getActive();
        if (!c) return;
        c.goals = $('#campaign-goals').value;
        c.updatedAt = new Date().toISOString();
        save();
      }, 400);
    });
    $('#edit-campaign-btn').addEventListener('click', () => {
      const c = getActive();
      if (c) promptNewCampaign(c);
    });
  }

  // ─── Sessions ────────────────────────────────────────────────────────────
  async function promptSession(existing = null) {
    const c = getActive();
    if (!c) return;

    const body = `
      <div class="field">
        <label>Session Title</label>
        <input type="text" id="m-title" value="${escapeAttr(existing?.title || '')}" placeholder="e.g. The Gate of Ashen Stars" />
      </div>
      <div class="field">
        <label>Date</label>
        <input type="date" id="m-date" value="${existing?.date || new Date().toISOString().slice(0, 10)}" />
      </div>
      <div class="field">
        <label>Summary / What Happened</label>
        <textarea id="m-summary" rows="5" placeholder="Key events, decisions, consequences, open threads...">${escapeHtml(existing?.summary || '')}</textarea>
      </div>
      <div class="field">
        <label>World(s) Visited</label>
        <input type="text" id="m-worlds" value="${escapeAttr(existing?.worlds || c.currentWorld || '')}" placeholder="e.g. Umbraria, Aetheria" />
      </div>
    `;

    const confirmed = await openModal({
      title: existing ? 'Edit Session' : 'Log Session',
      bodyHtml: body,
      onConfirm: () => {
        const title = $('#m-title').value.trim() || 'Untitled Session';
        const data = {
          title,
          date: $('#m-date').value,
          summary: $('#m-summary').value.trim(),
          worlds: $('#m-worlds').value.trim(),
        };
        if (existing) {
          Object.assign(existing, data);
        } else {
          c.sessions.unshift({ id: uid(), ...data });
        }
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      },
    });

    if (confirmed) {
      toast(existing ? 'Session updated' : 'Session logged');
      renderSessions();
    }
  }

  function renderSessions() {
    const c = getActive();
    if (!c) return setView('campaigns');

    const list = $('#sessions-list');
    const empty = $('#empty-sessions');
    list.innerHTML = '';

    if (c.sessions.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    c.sessions.forEach(s => {
      const card = document.createElement('div');
      card.className = 'session-card';
      card.innerHTML = `
        <div class="session-top">
          <h3>${escapeHtml(s.title)}</h3>
          <span class="date">${escapeHtml(s.date || '')}${s.worlds ? ' · ' + escapeHtml(s.worlds) : ''}</span>
        </div>
        <div class="summary">${escapeHtml(s.summary) || '<em>No summary</em>'}</div>
        <div class="actions">
          <button class="btn secondary edit-session">Edit</button>
          <button class="btn danger delete-session">Delete</button>
        </div>
      `;
      card.querySelector('.edit-session').addEventListener('click', () => promptSession(s));
      card.querySelector('.delete-session').addEventListener('click', async () => {
        const ok = await openModal({
          title: 'Delete Session?',
          bodyHtml: `<p>Remove <strong>${escapeHtml(s.title)}</strong>?</p>`,
          confirmText: 'Delete',
          onConfirm: () => {
            c.sessions = c.sessions.filter(x => x.id !== s.id);
            c.updatedAt = new Date().toISOString();
            save();
            return true;
          },
        });
        if (ok) {
          toast('Session deleted');
          renderSessions();
        }
      });
      list.appendChild(card);
    });
  }

  // ─── Party ───────────────────────────────────────────────────────────────
  function abilityMod(score) {
    const s = parseInt(score, 10);
    if (isNaN(s)) return 0;
    return Math.floor((s - 10) / 2);
  }

  function modStr(score) {
    const m = abilityMod(score);
    return m >= 0 ? `+${m}` : `${m}`;
  }

  function profBonusForLevel(level) {
    const lv = clamp(parseInt(level, 10) || 1, 1, 20);
    return 2 + Math.floor((lv - 1) / 4);
  }

  function normalizeCharacter(ch) {
    return {
      id: ch.id,
      name: ch.name || '',
      player: ch.player || '',
      type: ch.type || (ch.player === 'NPC' ? 'ally' : 'pc'),
      class: ch.class || '',
      subclass: ch.subclass || '',
      level: clamp(Number(ch.level) || 1, 1, 20),
      race: ch.race || '',
      background: ch.background || '',
      world: ch.world || '',
      alignment: ch.alignment || '',
      str: Number(ch.str) || 10,
      dex: Number(ch.dex) || 10,
      con: Number(ch.con) || 10,
      int: Number(ch.int) || 10,
      wis: Number(ch.wis) || 10,
      cha: Number(ch.cha) || 10,
      hp: Number(ch.hp) || 0,
      hpMax: Number(ch.hpMax) || 0,
      ac: Number(ch.ac) || 10,
      speed: ch.speed || '30 ft.',
      profBonus: Number(ch.profBonus) || profBonusForLevel(ch.level || 1),
      saves: ch.saves || '',
      skills: ch.skills || '',
      attacks: ch.attacks || '',
      features: ch.features || '',
      equipment: ch.equipment || '',
      corruption: clamp(Number(ch.corruption) || 0, 0, 10),
      notes: ch.notes || ''
    };
  }

  function abilityRowHtml(prefix, ch) {
    const abs = [
      ['str', 'STR'], ['dex', 'DEX'], ['con', 'CON'],
      ['int', 'INT'], ['wis', 'WIS'], ['cha', 'CHA']
    ];
    return abs.map(([k, label]) => {
      const v = ch[k] ?? 10;
      return `<div class="ability-box">
        <label class="small">${label}</label>
        <input type="number" id="${prefix}-${k}" min="1" max="30" value="${v}" class="ability-score" data-ab="${k}" />
        <span class="ability-mod" id="${prefix}-mod-${k}">${modStr(v)}</span>
      </div>`;
    }).join('');
  }

  function getPhbClasses() {
    return (typeof window !== 'undefined' && window.PHB_CLASSES) ? window.PHB_CLASSES : [];
  }
  function getPhbSkills() {
    return (typeof window !== 'undefined' && window.PHB_SKILLS) ? window.PHB_SKILLS : [];
  }
  function getPhbRaces() {
    return (typeof window !== 'undefined' && window.PHB_RACES) ? window.PHB_RACES : [];
  }
  function findPhbClass(name) {
    if (!name) return null;
    const n = String(name).toLowerCase();
    return getPhbClasses().find(c => c.name.toLowerCase() === n) || null;
  }

  function classOptionsHtml(selected) {
    const classes = getPhbClasses();
    const core = classes.filter(c => !c.setting);
    const dsc = classes.filter(c => c.setting);
    let html = `<option value="">— Select class —</option>`;
    html += `<optgroup label="Core Classes">`;
    core.forEach(c => {
      html += `<option value="${escapeAttr(c.name)}" ${selected === c.name ? 'selected' : ''}>${escapeHtml(c.name)}</option>`;
    });
    html += `</optgroup><optgroup label="Dark Sun Chronicles">`;
    dsc.forEach(c => {
      html += `<option value="${escapeAttr(c.name)}" ${selected === c.name ? 'selected' : ''}>${escapeHtml(c.name)}</option>`;
    });
    html += `</optgroup>`;
    if (selected && !classes.some(c => c.name === selected)) {
      html += `<option value="${escapeAttr(selected)}" selected>${escapeHtml(selected)} (custom)</option>`;
    }
    return html;
  }

  function raceOptionsHtml(selected) {
    const races = getPhbRaces();
    let html = `<option value="">— Select ancestry —</option>`;
    races.forEach(r => {
      html += `<option value="${escapeAttr(r.name)}" ${selected === r.name ? 'selected' : ''}>${escapeHtml(r.name)}${r.world ? ' (' + r.world + ')' : ''}</option>`;
    });
    if (selected && !races.some(r => r.name === selected)) {
      html += `<option value="${escapeAttr(selected)}" selected>${escapeHtml(selected)}</option>`;
    }
    return html;
  }

  function skillPickerHtml(className, selectedSkills) {
    const cls = findPhbClass(className);
    const all = getPhbSkills();
    const selected = new Set((selectedSkills || []).map(s => s.toLowerCase()));
    let allowed = all;
    if (cls && cls.skills !== 'Any') {
      const set = new Set(cls.skills.map(s => s.toLowerCase()));
      allowed = all.filter(s => set.has(s.name.toLowerCase()));
    }
    const choose = cls ? cls.skillsChoose : 2;
    return `
      <div class="skill-picker" data-choose="${choose}">
        <p class="muted small">Choose ${choose} skill${choose > 1 ? 's' : ''}${cls && cls.skills !== 'Any' ? ' from the class list' : ''}. Hover a skill for its description.</p>
        <div class="skill-grid">
          ${allowed.map(s => `
            <label class="skill-chip" title="${escapeAttr(s.desc)} (${s.ability})">
              <input type="checkbox" class="m-skill-cb" value="${escapeAttr(s.name)}" ${selected.has(s.name.toLowerCase()) ? 'checked' : ''} />
              <span>${escapeHtml(s.name)} <span class="muted">(${s.ability})</span></span>
            </label>
          `).join('')}
        </div>
      </div>`;
  }

  function progressionTableHtml(className) {
    const cls = findPhbClass(className);
    if (!cls || !cls.progression) return '<p class="muted small">Select a class to view its progression table.</p>';
    const rows = cls.progression.map(([lvl, feat]) =>
      `<tr><td>${lvl}</td><td>${escapeHtml(feat)}</td></tr>`).join('');
    return `
      <div class="class-summary">
        <p><strong>${escapeHtml(cls.name)}</strong> — ${escapeHtml(cls.summary)}</p>
        <p class="muted small">Hit Die ${cls.hitDie} · Primary ${escapeHtml(cls.primary)} · Saves ${escapeHtml(cls.saves)} · Armor: ${escapeHtml(cls.armor)}</p>
      </div>
      <table class="prog-table">
        <thead><tr><th>Level</th><th>Features</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function wireCharacterFormHelpers() {
    const classSel = $('#m-class');
    const levelInp = $('#m-level');
    const profInp = $('#m-prof');
    const raceSel = $('#m-race');
    const worldSel = $('#m-world');
    const skillBox = $('#m-skill-picker');
    const progBox = $('#m-class-prog');
    const features = $('#m-features');

    function refreshClassUI() {
      const cname = classSel ? classSel.value : '';
      if (skillBox) skillBox.innerHTML = skillPickerHtml(cname, []);
      if (progBox) progBox.innerHTML = progressionTableHtml(cname);
      const cls = findPhbClass(cname);
      if (cls && $('#m-saves') && !$('#m-saves').value) $('#m-saves').value = cls.saves;
    }
    function refreshProf() {
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 20);
      if (profInp && window.PHB_PROF_BY_LEVEL) {
        profInp.value = window.PHB_PROF_BY_LEVEL[lvl] || 2;
      }
    }
    function refreshRaceTraits() {
      const rname = raceSel ? raceSel.value : '';
      const race = getPhbRaces().find(r => r.name === rname);
      if (!race || !features) return;
      if (race.world && worldSel && !worldSel.value) worldSel.value = race.world;
      if (!race.traits || !race.traits.length) return;
      const marker = `— ${race.name} Traits —`;
      if (features.value.includes(marker)) return;
      const traits = race.traits.map(t => `${t.name}: ${t.text}`).join('\n');
      features.value = (features.value ? features.value + '\n\n' : '') + marker + '\n' + traits;
    }
    classSel?.addEventListener('change', refreshClassUI);
    levelInp?.addEventListener('change', refreshProf);
    levelInp?.addEventListener('input', refreshProf);
    raceSel?.addEventListener('change', refreshRaceTraits);
    refreshClassUI();
  }

  async function promptCharacter(existing = null) {
    const c = getActive();
    if (!c) return;

    const ch = existing ? normalizeCharacter(existing) : normalizeCharacter({ level: 1, str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, speed: '30 ft.', profBonus: 2 });
    const selectedSkills = (ch.skills || '').split(/[,;]+/).map(s => s.trim().split(/\s+\+/)[0].trim()).filter(Boolean);

    const body = `
      <div class="sheet-section">
        <div class="form-row">
          <div class="field"><label>Character Name</label><input type="text" id="m-name" value="${escapeAttr(ch.name)}" placeholder="Character name" /></div>
          <div class="field"><label>Player</label><input type="text" id="m-player" value="${escapeAttr(ch.player)}" placeholder="Player name" /></div>
        </div>
        <div class="form-row triple">
          <div class="field"><label>Class</label>
            <select id="m-class">${classOptionsHtml(ch.class)}</select>
          </div>
          <div class="field"><label>Subclass</label><input type="text" id="m-subclass" value="${escapeAttr(ch.subclass)}" placeholder="Optional" /></div>
          <div class="field"><label>Level</label><input type="number" id="m-level" min="1" max="20" value="${ch.level}" /></div>
        </div>
        <div class="form-row triple">
          <div class="field"><label>Ancestry / Race</label>
            <select id="m-race">${raceOptionsHtml(ch.race)}</select>
          </div>
          <div class="field"><label>Background</label><input type="text" id="m-background" value="${escapeAttr(ch.background)}" /></div>
          <div class="field"><label>Alignment</label><input type="text" id="m-alignment" value="${escapeAttr(ch.alignment)}" placeholder="e.g. NG" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Home World</label><select id="m-world"><option value="">—</option>${WORLDS.map(w => `<option value="${w}" ${ch.world === w ? 'selected' : ''}>${w}</option>`).join('')}</select></div>
          <div class="field"><label>Corruption (0–10)</label><input type="number" id="m-corruption" min="0" max="10" value="${ch.corruption}" title="Shard / dark influence track" /></div>
        </div>
      </div>
      <div class="sheet-section">
        <label class="section-label">Class Progression</label>
        <div id="m-class-prog">${progressionTableHtml(ch.class)}</div>
      </div>
      <div class="sheet-section">
        <label class="section-label">Ability Scores</label>
        <div class="ability-grid" id="ability-grid">${abilityRowHtml('m', ch)}</div>
      </div>
      <div class="sheet-section">
        <div class="form-row triple">
          <div class="field"><label>HP (current)</label><input type="number" id="m-hp" min="0" value="${ch.hp}" /></div>
          <div class="field"><label>HP (max)</label><input type="number" id="m-hpmax" min="0" value="${ch.hpMax}" /></div>
          <div class="field"><label>Armor Class</label><input type="number" id="m-ac" min="0" value="${ch.ac}" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Speed</label><input type="text" id="m-speed" value="${escapeAttr(ch.speed)}" placeholder="30 ft." /></div>
          <div class="field"><label>Proficiency Bonus</label><input type="number" id="m-prof" min="2" max="6" value="${ch.profBonus}" /></div>
        </div>
      </div>
      <div class="sheet-section">
        <div class="field"><label>Saving Throws</label><input type="text" id="m-saves" value="${escapeAttr(ch.saves)}" placeholder="e.g. DEX, WIS" /></div>
        <label class="section-label">Skill Proficiencies</label>
        <div id="m-skill-picker">${skillPickerHtml(ch.class, selectedSkills)}</div>
        <div class="field" style="margin-top:0.5rem"><label>Skills (text summary)</label><textarea id="m-skills" rows="2" placeholder="Auto-filled from checkboxes, or type freely">${escapeHtml(ch.skills)}</textarea></div>
        <div class="field"><label>Attacks &amp; Spell Attack</label><textarea id="m-attacks" rows="2" placeholder="Longbow +7 (1d8+3), Fire Bolt +5 (1d10)">${escapeHtml(ch.attacks)}</textarea></div>
        <div class="field"><label>Features &amp; Traits</label><textarea id="m-features" rows="3" placeholder="Class features, racial traits, feats…">${escapeHtml(ch.features)}</textarea></div>
        <div class="field"><label>Equipment</label><textarea id="m-equipment" rows="2" placeholder="Armor, weapons, tools, magic items…">${escapeHtml(ch.equipment)}</textarea></div>
        <div class="field"><label>Notes (bonds, ideals, flaws, status)</label><textarea id="m-notes" rows="2">${escapeHtml(ch.notes)}</textarea></div>
      </div>
    `;

    const confirmed = await openModal({
      title: existing ? `Character Sheet — ${ch.name || 'Edit'}` : 'New Character Sheet',
      bodyHtml: body,
      wide: true,
      onConfirm: () => {
        const name = $('#m-name').value.trim();
        if (!name) { toast('Name required'); return false; }
        const level = clamp(parseInt($('#m-level').value, 10) || 1, 1, 20);
        const playerVal = $('#m-player').value.trim();
        const checked = [...document.querySelectorAll('.m-skill-cb:checked')].map(cb => cb.value);
        let skillsText = $('#m-skills').value.trim();
        if (checked.length) {
          skillsText = checked.join(', ');
        }
        const data = {
          name,
          player: playerVal,
          type: existing?.type || (playerVal === 'NPC' ? 'ally' : 'pc'),
          class: $('#m-class').value.trim(),
          subclass: $('#m-subclass').value.trim(),
          level,
          race: $('#m-race').value.trim(),
          background: $('#m-background').value.trim(),
          alignment: $('#m-alignment').value.trim(),
          world: $('#m-world').value,
          corruption: clamp(parseInt($('#m-corruption').value, 10) || 0, 0, 10),
          str: parseInt($('#m-str').value, 10) || 10,
          dex: parseInt($('#m-dex').value, 10) || 10,
          con: parseInt($('#m-con').value, 10) || 10,
          int: parseInt($('#m-int').value, 10) || 10,
          wis: parseInt($('#m-wis').value, 10) || 10,
          cha: parseInt($('#m-cha').value, 10) || 10,
          hp: parseInt($('#m-hp').value, 10) || 0,
          hpMax: parseInt($('#m-hpmax').value, 10) || 0,
          ac: parseInt($('#m-ac').value, 10) || 10,
          speed: $('#m-speed').value.trim() || '30 ft.',
          profBonus: parseInt($('#m-prof').value, 10) || profBonusForLevel(level),
          saves: $('#m-saves').value.trim(),
          skills: skillsText,
          attacks: $('#m-attacks').value.trim(),
          features: $('#m-features').value.trim(),
          equipment: $('#m-equipment').value.trim(),
          notes: $('#m-notes').value.trim()
        };
        if (existing) Object.assign(existing, data);
        else c.party.push({ id: uid(), ...data });
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      },
      afterOpen: () => {
        wireCharacterFormHelpers();
        const grid = $('#ability-grid');
        if (!grid) return;
        grid.querySelectorAll('.ability-score').forEach(inp => {
          inp.addEventListener('input', () => {
            const ab = inp.dataset.ab;
            const modEl = $(`#m-mod-${ab}`);
            if (modEl) modEl.textContent = modStr(inp.value);
          });
        });
      }
    });

    if (confirmed) {
      toast(existing ? 'Character sheet saved' : 'Character added');
      renderParty();
    }
  }

  function characterCardHtml(ch, roleLabel, roleClass) {
    const corrClass = ch.corruption >= 5 ? 'high' : ch.corruption >= 3 ? 'mid' : '';
    return `
      <div class="char-top">
        <div>
          <h3>${escapeHtml(ch.name)}<span class="role-badge ${roleClass}">${roleLabel}</span></h3>
          <div class="level">${escapeHtml(ch.class || 'Adventurer')}${ch.subclass ? ' (' + escapeHtml(ch.subclass) + ')' : ''} · Level ${ch.level}${ch.race ? ' · ' + escapeHtml(ch.race) : ''}${ch.player && ch.player !== 'NPC' ? ' · ' + escapeHtml(ch.player) : ''}</div>
        </div>
        <div class="char-combat">
          <span class="stat-chip" title="Armor Class">AC ${ch.ac}</span>
          <span class="stat-chip" title="Hit Points">HP ${ch.hp}/${ch.hpMax || '—'}</span>
          ${ch.corruption > 0 ? `<span class="stat-chip corruption ${corrClass}" title="Corruption">☠ ${ch.corruption}</span>` : ''}
        </div>
      </div>
      <div class="ability-mini">
        <span>STR ${ch.str} (${modStr(ch.str)})</span>
        <span>DEX ${ch.dex} (${modStr(ch.dex)})</span>
        <span>CON ${ch.con} (${modStr(ch.con)})</span>
        <span>INT ${ch.int} (${modStr(ch.int)})</span>
        <span>WIS ${ch.wis} (${modStr(ch.wis)})</span>
        <span>CHA ${ch.cha} (${modStr(ch.cha)})</span>
      </div>
      ${ch.attacks ? `<div class="notes"><strong>Attacks:</strong> ${escapeHtml(ch.attacks)}</div>` : ''}
      ${ch.notes ? `<div class="notes">${escapeHtml(ch.notes)}</div>` : ''}
      <div class="actions">
        <button class="btn primary edit-char">Open Sheet</button>
        <button class="btn danger delete-char">Remove</button>
      </div>
    `;
  }

  function renderParty() {
    const c = getActive();
    if (!c) return setView('campaigns');
    ensureCampaignShape(c);

    const list = $('#party-list');
    const empty = $('#empty-party');
    const vList = $('#villains-list');
    const vEmpty = $('#empty-villains');
    list.innerHTML = '';
    vList.innerHTML = '';

    if (c.party.length === 0) {
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      c.party.forEach(raw => {
        const ch = normalizeCharacter(raw);
        Object.assign(raw, ch);
        const isAlly = ch.type === 'ally' || ch.player === 'NPC';
        const card = document.createElement('div');
        card.className = 'character-card sheet-card';
        card.innerHTML = characterCardHtml(ch, isAlly ? 'Ally' : 'PC', isAlly ? 'ally' : 'pc');
        card.querySelector('.edit-char').addEventListener('click', () => promptCharacter(raw));
        card.querySelector('.delete-char').addEventListener('click', async () => {
          const ok = await openModal({
            title: 'Remove Character?',
            bodyHtml: `<p>Remove <strong>${escapeHtml(ch.name)}</strong> from the roster?</p>`,
            confirmText: 'Remove',
            onConfirm: () => {
              c.party = c.party.filter(x => x.id !== raw.id);
              c.updatedAt = new Date().toISOString();
              save();
              return true;
            }
          });
          if (ok) { toast('Removed'); renderParty(); }
        });
        list.appendChild(card);
      });
    }

    if (c.villains.length === 0) {
      vEmpty.classList.remove('hidden');
    } else {
      vEmpty.classList.add('hidden');
      c.villains.forEach(raw => {
        const ch = normalizeCharacter(raw);
        Object.assign(raw, ch);
        const card = document.createElement('div');
        card.className = 'character-card sheet-card villain-card';
        card.innerHTML = characterCardHtml(ch, 'Villain', 'villain');
        card.querySelector('.edit-char').addEventListener('click', () => promptVillain(raw));
        card.querySelector('.delete-char').addEventListener('click', async () => {
          const ok = await openModal({
            title: 'Remove Villain?',
            bodyHtml: `<p>Remove <strong>${escapeHtml(ch.name)}</strong> from villains?</p>`,
            confirmText: 'Remove',
            onConfirm: () => {
              c.villains = c.villains.filter(x => x.id !== raw.id);
              c.updatedAt = new Date().toISOString();
              save();
              return true;
            }
          });
          if (ok) { toast('Villain removed'); renderParty(); }
        });
        vList.appendChild(card);
      });
    }
  }

  async function promptVillain(existing = null) {
    // Reuse character sheet modal but save to villains list
    const c = getActive();
    if (!c) return;
    const ch = existing ? normalizeCharacter(existing) : normalizeCharacter({ level: 1, player: 'NPC', type: 'villain', str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, speed: '30 ft.', profBonus: 2 });
    // Temporarily treat as existing character for form, then route save
    const confirmed = await openModal({
      title: existing ? `Villain Sheet — ${ch.name || 'Edit'}` : 'New Villain',
      wide: true,
      bodyHtml: (() => {
        // Build same body as promptCharacter by calling internal structure
        return `
      <div class="sheet-section">
        <div class="form-row">
          <div class="field"><label>Name</label><input type="text" id="m-name" value="${escapeAttr(ch.name)}" placeholder="Villain name" /></div>
          <div class="field"><label>Role / Class</label><input type="text" id="m-class" value="${escapeAttr(ch.class)}" placeholder="e.g. Cult leader, Warlord" /></div>
        </div>
        <div class="form-row triple">
          <div class="field"><label>Level / CR</label><input type="number" id="m-level" min="1" max="20" value="${ch.level}" /></div>
          <div class="field"><label>World</label>
            <select id="m-world">
              <option value="">—</option>
              ${WORLDS.map(w => `<option value="${w}" ${ch.world === w ? 'selected' : ''}>${w}</option>`).join('')}
            </select>
          </div>
          <div class="field"><label>Corruption</label><input type="number" id="m-corruption" min="0" max="10" value="${ch.corruption}" /></div>
        </div>
      </div>
      <div class="sheet-section">
        <span class="section-label">Ability Scores</span>
        <div class="ability-grid">${abilityRowHtml('m', ch)}</div>
      </div>
      <div class="sheet-section">
        <div class="form-row triple">
          <div class="field"><label>HP</label><input type="number" id="m-hp" min="0" value="${ch.hp}" /></div>
          <div class="field"><label>HP Max</label><input type="number" id="m-hpmax" min="0" value="${ch.hpMax}" /></div>
          <div class="field"><label>AC</label><input type="number" id="m-ac" min="1" value="${ch.ac}" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Speed</label><input type="text" id="m-speed" value="${escapeAttr(ch.speed)}" /></div>
          <div class="field"><label>Prof. Bonus</label><input type="number" id="m-prof" min="2" max="9" value="${ch.profBonus}" /></div>
        </div>
      </div>
      <div class="sheet-section">
        <div class="field"><label>Attacks</label><textarea id="m-attacks" rows="2">${escapeHtml(ch.attacks)}</textarea></div>
        <div class="field"><label>Features &amp; Traits</label><textarea id="m-features" rows="2">${escapeHtml(ch.features)}</textarea></div>
        <div class="field"><label>Notes / Secret</label><textarea id="m-notes" rows="2">${escapeHtml(ch.notes)}</textarea></div>
      </div>`;
      })(),
      afterOpen: () => {
        $$('.ability-score').forEach(inp => {
          inp.addEventListener('input', () => {
            const k = inp.dataset.ab;
            const modEl = $(`#m-mod-${k}`);
            if (modEl) modEl.textContent = modStr(parseInt(inp.value, 10) || 10);
          });
        });
      },
      onConfirm: () => {
        const name = $('#m-name').value.trim();
        if (!name) { toast('Name required'); return false; }
        const level = clamp(parseInt($('#m-level').value, 10) || 1, 1, 20);
        const data = {
          name,
          player: 'NPC',
          type: 'villain',
          class: $('#m-class').value.trim(),
          level,
          world: $('#m-world').value,
          corruption: clamp(parseInt($('#m-corruption').value, 10) || 0, 0, 10),
          str: parseInt($('#m-str').value, 10) || 10,
          dex: parseInt($('#m-dex').value, 10) || 10,
          con: parseInt($('#m-con').value, 10) || 10,
          int: parseInt($('#m-int').value, 10) || 10,
          wis: parseInt($('#m-wis').value, 10) || 10,
          cha: parseInt($('#m-cha').value, 10) || 10,
          hp: parseInt($('#m-hp').value, 10) || 0,
          hpMax: parseInt($('#m-hpmax').value, 10) || 0,
          ac: parseInt($('#m-ac').value, 10) || 10,
          speed: $('#m-speed').value.trim() || '30 ft.',
          profBonus: parseInt($('#m-prof').value, 10) || profBonusForLevel(level),
          attacks: $('#m-attacks').value.trim(),
          features: $('#m-features').value.trim(),
          notes: $('#m-notes').value.trim(),
          subclass: '', race: '', background: '', alignment: '', saves: '', skills: '', equipment: ''
        };
        if (existing) Object.assign(existing, data);
        else c.villains.push({ id: uid(), ...data });
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      }
    });
    if (confirmed) {
      toast(existing ? 'Villain updated' : 'Villain added');
      renderParty();
    }
  }

  // ─── Factions (with generator) ───────────────────────────────────────────
  async function promptFaction(existing = null) {
    const c = getActive();
    if (!c) return;

    const prefill = existing || {};
    const body = `
      <div class="field gen-row">
        <label>Faction Name</label>
        <div class="input-with-btn">
          <input type="text" id="m-name" value="${escapeAttr(prefill.name || '')}" placeholder="e.g. The Solar Concord, Umbral Court" />
          <button type="button" class="btn secondary gen-btn" id="gen-faction-btn" title="Generate random faction">🎲</button>
        </div>
      </div>
      <div class="field">
        <label>Type / Affiliation</label>
        <input type="text" id="m-type" value="${escapeAttr(prefill.type || '')}" placeholder="Government, Cult, Merchant House, Temple..." />
      </div>
      <div class="field">
        <label>World (primary)</label>
        <select id="m-world">
          <option value="">— Multi / None —</option>
          ${WORLDS.map(w => `<option value="${w}" ${prefill.world === w ? 'selected' : ''}>${w}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Reputation (−3 to +3)</label>
        <input type="number" id="m-rep" min="-3" max="3" value="${prefill.reputation ?? 0}" />
      </div>
      <div class="field">
        <label>Notes</label>
        <textarea id="m-notes" rows="2" placeholder="Goals, key NPCs, how they view the party...">${escapeHtml(prefill.notes || '')}</textarea>
      </div>
    `;

    const confirmed = await openModal({
      title: existing ? 'Edit Faction' : 'Add Faction',
      bodyHtml: body,
      onConfirm: () => {
        const name = $('#m-name').value.trim();
        if (!name) {
          toast('Name required');
          return false;
        }
        let rep = parseInt($('#m-rep').value, 10);
        if (isNaN(rep)) rep = 0;
        rep = Math.max(-3, Math.min(3, rep));
        const data = {
          name,
          type: $('#m-type').value.trim(),
          world: $('#m-world').value,
          reputation: rep,
          notes: $('#m-notes').value.trim(),
        };
        if (existing) {
          Object.assign(existing, data);
        } else {
          c.factions.push({ id: uid(), ...data });
        }
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      },
      afterOpen: () => {
        const genBtn = $('#gen-faction-btn');
        if (genBtn) {
          genBtn.onclick = () => {
            const g = generateFaction();
            $('#m-name').value = g.name;
            $('#m-type').value = g.type;
            $('#m-world').value = g.world;
            $('#m-rep').value = g.reputation;
            $('#m-notes').value = g.notes;
            toast('Faction generated — edit as needed');
          };
        }
      },
    });

    if (confirmed) {
      toast(existing ? 'Faction updated' : 'Faction added');
      renderFactions();
    }
  }

  function renderFactions() {
    const c = getActive();
    if (!c) return setView('campaigns');

    const list = $('#factions-list');
    const empty = $('#empty-factions');
    list.innerHTML = '';

    if (c.factions.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    const sorted = [...c.factions].sort((a, b) => Math.abs(b.reputation) - Math.abs(a.reputation) || a.name.localeCompare(b.name));

    sorted.forEach(f => {
      const card = document.createElement('div');
      card.className = 'faction-card';
      const repClass = f.reputation < 0 ? 'neg' : f.reputation > 0 ? 'pos' : 'zero';
      const sign = f.reputation > 0 ? '+' : '';
      card.innerHTML = `
        <div>
          <h3>${escapeHtml(f.name)}</h3>
          <div class="faction-meta">${escapeHtml(f.type || 'Faction')}${f.world ? ' · ' + escapeHtml(f.world) : ''}${f.notes ? ' · ' + escapeHtml(f.notes.slice(0, 60)) + (f.notes.length > 60 ? '…' : '') : ''}</div>
        </div>
        <div class="rep-controls">
          <button class="rep-btn dec" title="Decrease">−</button>
          <span class="rep-value ${repClass}">${sign}${f.reputation}</span>
          <button class="rep-btn inc" title="Increase">+</button>
        </div>
        <div class="actions">
          <button class="btn secondary edit-faction">Edit</button>
          <button class="btn danger delete-faction">Remove</button>
        </div>
      `;
      card.querySelector('.dec').addEventListener('click', () => {
        f.reputation = Math.max(-3, f.reputation - 1);
        c.updatedAt = new Date().toISOString();
        save();
        renderFactions();
      });
      card.querySelector('.inc').addEventListener('click', () => {
        f.reputation = Math.min(3, f.reputation + 1);
        c.updatedAt = new Date().toISOString();
        save();
        renderFactions();
      });
      card.querySelector('.edit-faction').addEventListener('click', () => promptFaction(f));
      card.querySelector('.delete-faction').addEventListener('click', async () => {
        const ok = await openModal({
          title: 'Remove Faction?',
          bodyHtml: `<p>Remove <strong>${escapeHtml(f.name)}</strong>?</p>`,
          confirmText: 'Remove',
          onConfirm: () => {
            c.factions = c.factions.filter(x => x.id !== f.id);
            c.updatedAt = new Date().toISOString();
            save();
            return true;
          },
        });
        if (ok) {
          toast('Faction removed');
          renderFactions();
        }
      });
      list.appendChild(card);
    });
  }

  // ─── Dynamic Influence Engine ────────────────────────────────────────────
  function clockHtml(segments) {
    const filled = clamp(segments, 0, 6);
    let dots = '';
    for (let i = 1; i <= 6; i++) {
      dots += `<span class="clock-seg ${i <= filled ? 'filled' : ''}" title="Segment ${i}"></span>`;
    }
    const label = GENERATORS.clockStageLabels[filled] || '';
    return `<div class="agenda-clock" title="Primary Agenda Clock: ${filled}/6 — ${label}">${dots}<span class="clock-label">${filled}/6 · ${escapeHtml(label)}</span></div>`;
  }

  function influenceBarHtml(label, value, cls) {
    const v = clamp(value, 0, 6);
    return `<div class="inf-bar ${cls}" title="${label}: ${v}/6 (${influenceReach(v)})"><span class="inf-name">${label.slice(0, 3)}</span><div class="inf-track"><div class="inf-fill" style="width:${(v / 6) * 100}%"></div></div><span class="inf-val">${v}</span></div>`;
  }

  async function promptForce(existing = null) {
    const c = getActive();
    if (!c) return;

    const p = existing ? normalizeForce(existing) : {
      name: '', type: 'Antagonist', publicFace: '', goal: '',
      political: 2, corruptive: 1, disruptive: 1,
      agendaClock: 0, awareness: 0, pressure: 0,
      assets: '', vulnerabilities: '', resources: '', status: '', lastAction: ''
    };

    const body = `
      <div class="field gen-row">
        <label>Force Name</label>
        <div class="input-with-btn">
          <input type="text" id="m-name" value="${escapeAttr(p.name)}" placeholder="e.g. The Hollow Sovereign" />
          <button type="button" class="btn secondary gen-btn" id="gen-force-btn" title="Generate random force">🎲</button>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Type</label>
          <select id="m-type">${GENERATORS.forceTypes.map(t =>
            `<option value="${t}" ${p.type === t ? 'selected' : ''}>${t}</option>`
          ).join('')}</select>
        </div>
        <div class="field">
          <label>Agenda Clock (0–6)</label>
          <input type="number" id="m-clock" min="0" max="6" value="${p.agendaClock}" />
        </div>
      </div>
      <div class="field">
        <label>Public Face</label>
        <input type="text" id="m-face" value="${escapeAttr(p.publicFace)}" placeholder="What ordinary people believe this force to be" />
      </div>
      <div class="field">
        <label>Primary Goal</label>
        <textarea id="m-goal" rows="2" placeholder="One concrete, observable result it wants">${escapeHtml(p.goal)}</textarea>
      </div>
      <div class="field">
        <label>Three Influences (0–6)</label>
        <div class="form-row triple">
          <div class="field"><label class="small">Political</label><input type="number" id="m-pol" min="0" max="6" value="${p.political}" /></div>
          <div class="field"><label class="small">Corruptive</label><input type="number" id="m-cor" min="0" max="6" value="${p.corruptive}" /></div>
          <div class="field"><label class="small">Disruptive</label><input type="number" id="m-dis" min="0" max="6" value="${p.disruptive}" /></div>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Awareness of Party (0–4)</label>
          <input type="number" id="m-aware" min="0" max="4" value="${p.awareness}" />
        </div>
        <div class="field">
          <label>Pressure (0–4)</label>
          <input type="number" id="m-pressure" min="0" max="4" value="${p.pressure}" />
        </div>
      </div>
      <div class="field">
        <label>Assets</label>
        <textarea id="m-assets" rows="2" placeholder="What it can use to act">${escapeHtml(p.assets)}</textarea>
      </div>
      <div class="field">
        <label>Vulnerabilities</label>
        <textarea id="m-vuln" rows="2" placeholder="What the party could exploit">${escapeHtml(p.vulnerabilities)}</textarea>
      </div>
      <div class="field">
        <label>Status / Last Known Action</label>
        <textarea id="m-status" rows="2" placeholder="What has it done recently?">${escapeHtml(p.status || p.lastAction)}</textarea>
      </div>
    `;

    const confirmed = await openModal({
      title: existing ? 'Edit Force — Dynamic Influence' : 'Add Active Force',
      bodyHtml: body,
      onConfirm: () => {
        const name = $('#m-name').value.trim();
        if (!name) { toast('Name required'); return false; }
        const data = {
          name,
          type: $('#m-type').value,
          publicFace: $('#m-face').value.trim(),
          goal: $('#m-goal').value.trim(),
          political: clamp(parseInt($('#m-pol').value, 10) || 0, 0, 6),
          corruptive: clamp(parseInt($('#m-cor').value, 10) || 0, 0, 6),
          disruptive: clamp(parseInt($('#m-dis').value, 10) || 0, 0, 6),
          agendaClock: clamp(parseInt($('#m-clock').value, 10) || 0, 0, 6),
          awareness: clamp(parseInt($('#m-aware').value, 10) || 0, 0, 4),
          pressure: clamp(parseInt($('#m-pressure').value, 10) || 0, 0, 4),
          assets: $('#m-assets').value.trim(),
          vulnerabilities: $('#m-vuln').value.trim(),
          resources: $('#m-assets').value.trim(),
          status: $('#m-status').value.trim(),
          lastAction: $('#m-status').value.trim(),
        };
        if (existing) {
          Object.assign(existing, data);
        } else {
          c.forces.push({ id: uid(), ...data });
        }
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      },
      afterOpen: () => {
        const genBtn = $('#gen-force-btn');
        if (genBtn) {
          genBtn.onclick = () => {
            const g = generateForce();
            $('#m-name').value = g.name;
            $('#m-type').value = g.type;
            $('#m-face').value = g.publicFace;
            $('#m-goal').value = g.goal;
            $('#m-pol').value = g.political;
            $('#m-cor').value = g.corruptive;
            $('#m-dis').value = g.disruptive;
            $('#m-clock').value = g.agendaClock;
            $('#m-aware').value = g.awareness;
            $('#m-pressure').value = g.pressure;
            $('#m-assets').value = g.assets;
            $('#m-vuln').value = g.vulnerabilities;
            $('#m-status').value = g.status;
            toast('Force generated — edit as needed');
          };
        }
      },
    });

    if (confirmed) {
      toast(existing ? 'Force updated' : 'Force added');
      renderForces();
    }
  }

  /** Run one Force Turn for a single force. Mutates the force in place. Returns report object. */
  function runForceTurn(f) {
    const n = normalizeForce(f);
    Object.assign(f, n);

    const maxInf = Math.max(f.political, f.corruptive, f.disruptive);
    const dom = dominantInfluence(f);
    const actionTable = dom === 'political' ? GENERATORS.politicalActions
      : dom === 'corruptive' ? GENERATORS.corruptiveActions
      : GENERATORS.disruptiveActions;

    // Chance to act scales with influence and pressure (desperate forces act more)
    const actChance = 0.35 + (maxInf * 0.08) + (f.pressure * 0.05);
    const acts = Math.random() < actChance;

    // Chance to advance clock: needs capacity + opportunity
    const clockChance = 0.25 + (maxInf * 0.07) + (f.pressure >= 3 ? 0.1 : 0);
    const advancesClock = f.agendaClock < 6 && Math.random() < clockChance;

    let actionText = '';
    let clockNote = '';
    let awarenessNote = '';
    let pressureNote = '';

    if (acts) {
      actionText = pick(actionTable);
      f.lastAction = actionText;
      f.status = actionText;
    } else {
      actionText = pick(GENERATORS.statusSnippets);
      f.status = actionText;
    }

    if (advancesClock) {
      f.agendaClock = clamp(f.agendaClock + 1, 0, 6);
      clockNote = `Agenda clock advances to ${f.agendaClock}/6 — ${GENERATORS.clockStageLabels[f.agendaClock]}.`;
    }

    // Awareness may tick up if force is active and party is visible
    if (acts && f.awareness < 4 && Math.random() < 0.2 + f.awareness * 0.05) {
      f.awareness = clamp(f.awareness + 1, 0, 4);
      awarenessNote = `Awareness of the party rises to ${f.awareness}/4.`;
    }

    // Pressure responds to clock progress and awareness
    if (f.agendaClock >= 4 && f.pressure < 3 && Math.random() < 0.3) {
      f.pressure = clamp(f.pressure + 1, 0, 4);
      pressureNote = `Pressure rises to ${f.pressure}/4.`;
    } else if (f.pressure >= 3 && Math.random() < 0.15) {
      // Desperate forces sometimes overreach and lose pressure after a move
      f.pressure = clamp(f.pressure - 1, 0, 4);
      pressureNote = `After escalating, pressure eases to ${f.pressure}/4.`;
    }

    return {
      name: f.name,
      acted: acts,
      action: actionText,
      clock: f.agendaClock,
      clockNote,
      awareness: f.awareness,
      awarenessNote,
      pressure: f.pressure,
      pressureNote,
      dominant: dom,
      maxInf,
      goalComplete: f.agendaClock >= 6
    };
  }

  function forceTurn() {
    const c = getActive();
    if (!c || c.forces.length === 0) {
      toast('No active forces — add forces first');
      return;
    }

    // Normalize all forces first
    c.forces = c.forces.map(f => {
      const n = normalizeForce(f);
      Object.assign(f, n);
      return f;
    });

    // Take a turn for every force (living world), but report highlights
    const reports = c.forces.map(f => runForceTurn(f));
    c.updatedAt = new Date().toISOString();
    save();
    renderForces();

    const lines = reports.map(r => {
      let html = `<li class="force-turn-item">
        <strong>${escapeHtml(r.name)}</strong>
        <span class="dom-tag ${r.dominant}">${r.dominant}</span>
        <div class="turn-action">${escapeHtml(r.action)}</div>`;
      if (r.clockNote) html += `<div class="turn-clock">⏱ ${escapeHtml(r.clockNote)}</div>`;
      if (r.awarenessNote) html += `<div class="turn-meta">${escapeHtml(r.awarenessNote)}</div>`;
      if (r.pressureNote) html += `<div class="turn-meta">${escapeHtml(r.pressureNote)}</div>`;
      if (r.goalComplete) html += `<div class="turn-alert">⚠ Primary goal achieved — the campaign transforms.</div>`;
      html += `</li>`;
      return html;
    }).join('');

    openModal({
      title: 'Dynamic Influence — Force Turn',
      bodyHtml: `
        <p class="muted">After a major operation, downtime, or journey the world moves. Each active force has acted according to its Influences, Agenda Clock, Awareness, and Pressure.</p>
        <ul class="force-turn-list">${lines}</ul>
        <p class="muted small">Edit individual forces to adjust clocks, influence ratings, or respond to player interference.</p>
      `,
      confirmText: 'Done',
      onConfirm: () => true,
    });
  }

  function renderForces() {
    const c = getActive();
    if (!c) return setView('campaigns');

    const list = $('#forces-list');
    const empty = $('#empty-forces');
    list.innerHTML = '';

    let bar = $('#forces-action-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'forces-action-bar';
      bar.className = 'action-bar';
      const header = $('#view-forces .view-header');
      if (header) header.insertAdjacentElement('afterend', bar);
    }
    bar.innerHTML = `
      <button id="force-turn-btn" class="btn primary" title="Run a Force Turn for all active forces">
        ⚡ Force Turn
      </button>
      <span class="muted small">Dynamic Influence Engine — advances clocks, actions, awareness &amp; pressure.</span>
    `;
    $('#force-turn-btn')?.addEventListener('click', forceTurn);

    if (c.forces.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');

    c.forces.forEach(raw => {
      const f = normalizeForce(raw);
      // Keep store in sync with normalized shape
      Object.assign(raw, f);

      const card = document.createElement('div');
      card.className = 'force-card' + (f.agendaClock >= 5 ? ' imminent' : '') + (f.agendaClock >= 6 ? ' complete' : '');
      card.innerHTML = `
        <div class="force-header">
          <span class="force-type">${escapeHtml(f.type)}</span>
          <h3>${escapeHtml(f.name)}</h3>
          ${f.publicFace ? `<div class="public-face">Public face: ${escapeHtml(f.publicFace)}</div>` : ''}
        </div>
        ${f.goal ? `<div class="goal"><strong>Goal:</strong> ${escapeHtml(f.goal)}</div>` : ''}
        <div class="influence-row">
          ${influenceBarHtml('Political', f.political, 'pol')}
          ${influenceBarHtml('Corruptive', f.corruptive, 'cor')}
          ${influenceBarHtml('Disruptive', f.disruptive, 'dis')}
        </div>
        ${clockHtml(f.agendaClock)}
        <div class="aware-pressure">
          <span class="ap-pill" title="What the force knows about the party">Awareness ${f.awareness}/4</span>
          <span class="ap-pill pressure-${f.pressure}" title="How threatened the force feels">Pressure ${f.pressure}/4</span>
        </div>
        ${f.assets ? `<div class="resources"><strong>Assets:</strong> ${escapeHtml(f.assets)}</div>` : ''}
        ${f.vulnerabilities ? `<div class="resources"><strong>Vulnerabilities:</strong> ${escapeHtml(f.vulnerabilities)}</div>` : ''}
        ${f.status ? `<div class="resources"><strong>Status:</strong> ${escapeHtml(f.status)}</div>` : ''}
        <div class="actions">
          <button class="btn secondary edit-force">Edit</button>
          <button class="btn danger delete-force">Remove</button>
        </div>
      `;
      card.querySelector('.edit-force').addEventListener('click', () => promptForce(raw));
      card.querySelector('.delete-force').addEventListener('click', async () => {
        const ok = await openModal({
          title: 'Remove Force?',
          bodyHtml: `<p>Remove <strong>${escapeHtml(f.name)}</strong> from active forces?</p>`,
          confirmText: 'Remove',
          onConfirm: () => {
            c.forces = c.forces.filter(x => x.id !== raw.id);
            c.updatedAt = new Date().toISOString();
            save();
            return true;
          },
        });
        if (ok) {
          toast('Force removed');
          renderForces();
        }
      });
      list.appendChild(card);
    });
  }

  // ─── Notes ───────────────────────────────────────────────────────────────
  function renderNotes() {
    const c = getActive();
    if (!c) return setView('campaigns');
    $('#campaign-notes').value = c.notes || '';
  }

  function bindNotes() {
    let notesTimer;
    $('#campaign-notes').addEventListener('input', () => {
      clearTimeout(notesTimer);
      notesTimer = setTimeout(() => {
        const c = getActive();
        if (!c) return;
        c.notes = $('#campaign-notes').value;
        c.updatedAt = new Date().toISOString();
        save();
      }, 500);
    });
    $('#save-notes-btn').addEventListener('click', () => {
      const c = getActive();
      if (!c) return;
      c.notes = $('#campaign-notes').value;
      c.updatedAt = new Date().toISOString();
      save();
      toast('Notes saved');
    });
  }

  // ─── Tools (generators + reference) ──────────────────────────────────────
  function renderTools() {
    // Tools view is mostly static HTML; we just wire the generator buttons if present
    const genFactionBtn = $('#tool-gen-faction');
    const genForceBtn = $('#tool-gen-force');
    const genCompBtn = $('#tool-gen-complication');
    const out = $('#tool-generator-output');

    if (genFactionBtn && !genFactionBtn.dataset.wired) {
      genFactionBtn.dataset.wired = '1';
      genFactionBtn.addEventListener('click', () => {
        const g = generateFaction();
        out.innerHTML = `
          <div class="gen-result">
            <h4>${escapeHtml(g.name)}</h4>
            <p><strong>Type:</strong> ${escapeHtml(g.type)} · <strong>World:</strong> ${escapeHtml(g.world)} · <strong>Rep:</strong> ${g.reputation >= 0 ? '+' : ''}${g.reputation}</p>
            <p>${escapeHtml(g.notes)}</p>
            <button class="btn secondary use-faction">Add to Current Campaign</button>
          </div>
        `;
        out.querySelector('.use-faction')?.addEventListener('click', () => {
          const c = getActive();
          if (!c) {
            toast('Open or create a campaign first');
            return;
          }
          c.factions.push({ id: uid(), ...g });
          c.updatedAt = new Date().toISOString();
          save();
          toast('Faction added to campaign');
          updateNavEnabled();
        });
      });
    }

    if (genForceBtn && !genForceBtn.dataset.wired) {
      genForceBtn.dataset.wired = '1';
      genForceBtn.addEventListener('click', () => {
        const g = generateForce();
        out.innerHTML = `
          <div class="gen-result">
            <h4>${escapeHtml(g.name)}</h4>
            <p><strong>Type:</strong> ${escapeHtml(g.type)} · <strong>Clock:</strong> ${g.agendaClock}/6</p>
            <p><strong>Public Face:</strong> ${escapeHtml(g.publicFace)}</p>
            <p><strong>Goal:</strong> ${escapeHtml(g.goal)}</p>
            <p><strong>Influences:</strong> Pol ${g.political} · Cor ${g.corruptive} · Dis ${g.disruptive}</p>
            <p><strong>Assets:</strong> ${escapeHtml(g.assets)}</p>
            <p><strong>Vulnerabilities:</strong> ${escapeHtml(g.vulnerabilities)}</p>
            <button class="btn secondary use-force">Add to Current Campaign</button>
          </div>
        `;
        out.querySelector('.use-force')?.addEventListener('click', () => {
          const c = getActive();
          if (!c) {
            toast('Open or create a campaign first');
            return;
          }
          c.forces.push({ id: uid(), ...g });
          c.updatedAt = new Date().toISOString();
          save();
          toast('Force added to campaign');
          updateNavEnabled();
        });
      });
    }

    if (genCompBtn && !genCompBtn.dataset.wired) {
      genCompBtn.dataset.wired = '1';
      genCompBtn.addEventListener('click', () => {
        const comp = pick(GENERATORS.complications);
        out.innerHTML = `
          <div class="gen-result">
            <h4>World Complication</h4>
            <p>${escapeHtml(comp)}</p>
          </div>
        `;
      });
    }

    const genNpcBtn = $('#tool-gen-npc');
    if (genNpcBtn && !genNpcBtn.dataset.wired) {
      genNpcBtn.dataset.wired = '1';
      genNpcBtn.addEventListener('click', () => {
        const npc = generateNpc();
        const block = formatNpcBlock(npc);
        out.innerHTML = `
          <div class="gen-result npc-block">
            <h4>${escapeHtml(block.title)}</h4>
            <p class="npc-sub">${escapeHtml(block.subtitle)}</p>
            ${block.lines.map(l => `<p>${escapeHtml(l)}</p>`).join('')}
            <div class="npc-actions">
              <button class="btn secondary use-npc-party">Add as Ally/Contact</button>
              <button class="btn danger use-npc-villain">Add as Villain</button>
              <button class="btn secondary reroll-npc">🎲 Reroll</button>
            </div>
          </div>
        `;
        const makeNpcRecord = (type) => ({
          id: uid(),
          name: npc.name,
          player: 'NPC',
          type,
          class: npc.role,
          level: Math.max(1, Math.round(Number(npc.cr) || 1)),
          race: '',
          background: '',
          world: npc.world,
          alignment: '',
          str: npc.str, dex: npc.dex, con: npc.con, int: npc.int, wis: npc.wis, cha: npc.cha,
          hp: npc.hp, hpMax: npc.hpMax, ac: npc.ac, speed: npc.speed,
          profBonus: 2,
          saves: '',
          skills: `Perception (passive ${npc.perception})`,
          attacks: npc.attacks,
          features: npc.traits,
          equipment: '',
          corruption: 0,
          notes: `CR ${npc.cr}. Secret: ${npc.secret}`
        });
        out.querySelector('.use-npc-party')?.addEventListener('click', () => {
          const c = getActive();
          if (!c) { toast('Open or create a campaign first'); return; }
          ensureCampaignShape(c);
          c.party.push(makeNpcRecord('ally'));
          c.updatedAt = new Date().toISOString();
          save();
          toast('NPC added as Ally/Contact');
          updateNavEnabled();
        });
        out.querySelector('.use-npc-villain')?.addEventListener('click', () => {
          const c = getActive();
          if (!c) { toast('Open or create a campaign first'); return; }
          ensureCampaignShape(c);
          c.villains.push(makeNpcRecord('villain'));
          c.updatedAt = new Date().toISOString();
          save();
          toast('NPC added as Villain');
          updateNavEnabled();
        });
        out.querySelector('.reroll-npc')?.addEventListener('click', () => genNpcBtn.click());
      });
    }
  }

  // ─── Combat Tracker ──────────────────────────────────────────────────────
  function getCombat(c) {
    ensureCampaignShape(c);
    if (!c.combat || !Array.isArray(c.combat.combatants)) {
      c.combat = { round: 1, turnIndex: 0, combatants: [] };
    }
    return c.combat;
  }

  function combatantFromChar(ch, side) {
    const n = normalizeCharacter(ch);
    const dexMod = abilityMod(n.dex);
    return {
      id: uid(),
      sourceId: n.id || null,
      name: n.name,
      init: 10 + dexMod,
      hp: n.hp,
      hpMax: n.hpMax || n.hp,
      ac: n.ac,
      conditions: '',
      side: side || 'party',
      notes: n.attacks || ''
    };
  }

  function lookupBestiary(name) {
    if (!name) return null;
    return BESTIARY.find(b => b.n.toLowerCase() === String(name).toLowerCase()) || null;
  }

  function showCombatDetail(cb) {
    const panel = $('#combat-detail');
    if (!panel) return;
    if (!cb) {
      panel.innerHTML = '<div class="combat-detail-empty muted">Select a combatant to view details, traits, and description.</div>';
      return;
    }
    const best = lookupBestiary(cb.bestiaryName || cb.name);
    const hpPct = cb.hpMax > 0 ? cb.hp / cb.hpMax : 1;
    let status = 'Healthy';
    if (cb.hp <= 0) status = 'Defeated';
    else if (hpPct <= 0.25) status = 'Critical';
    else if (hpPct <= 0.5) status = 'Bloodied';

    let html = `
      <h3>${escapeHtml(cb.name)}</h3>
      <div class="detail-sub">${escapeHtml(cb.side || 'neutral')} · Init ${cb.init} · ${status}</div>
      <div class="detail-block">
        <div class="detail-label">Combat Stats</div>
        <div class="bestiary-stats">
          <span class="stat-chip">AC ${cb.ac}</span>
          <span class="stat-chip">HP ${cb.hp}/${cb.hpMax}</span>
          <span class="stat-chip">Init ${cb.init}</span>
        </div>
      </div>`;
    if (cb.conditions) {
      html += `<div class="detail-block"><div class="detail-label">Conditions</div><div class="detail-text">${escapeHtml(cb.conditions)}</div></div>`;
    }
    if (cb.notes) {
      html += `<div class="detail-block"><div class="detail-label">Notes / Attacks</div><div class="detail-text">${escapeHtml(cb.notes)}</div></div>`;
    }
    if (best) {
      html += `
        <div class="detail-block">
          <div class="detail-label">Bestiary</div>
          <div class="detail-text">
            <span class="origin-tag ${originClass(best.o)}">${escapeHtml(best.o)}</span>
            · ${escapeHtml(best.w)} · CR ${best.cr}
            ${best.classif ? `<br><span class="muted">${escapeHtml(best.classif)}</span>` : ''}
          </div>
        </div>`;
      if (best.desc) {
        html += `<div class="detail-block"><div class="detail-label">Description</div><div class="detail-text">${escapeHtml(best.desc)}</div></div>`;
      }
      if (best.eco) {
        html += `<div class="detail-block"><div class="detail-label">Ecology and Behaviour</div><div class="detail-text">${escapeHtml(best.eco)}</div></div>`;
      }
      if (best.run) {
        html += `<div class="detail-block"><div class="detail-label">Running the Creature</div><div class="detail-text">${escapeHtml(best.run)}</div></div>`;
      }
      if (best.seeds) {
        html += `<div class="detail-block"><div class="detail-label">Adventure Seeds</div><div class="detail-text">${escapeHtml(best.seeds)}</div></div>`;
      }
      // Note: People of [World] intentionally omitted from combat tracker
    }
    panel.innerHTML = html;
  }

  function renderCombat() {
    const c = getActive();
    if (!c) return setView('campaigns');
    const combat = getCombat(c);
    const list = $('#combat-list');
    const empty = $('#empty-combat');
    list.innerHTML = '';

    $('#combat-round').textContent = combat.round;

    if (combat.selectedIndex == null) combat.selectedIndex = combat.turnIndex || 0;

    if (combat.combatants.length === 0) {
      empty.classList.remove('hidden');
      $('#combat-turn-label').textContent = '—';
      showCombatDetail(null);
      return;
    }
    empty.classList.add('hidden');

    // Clamp turn index
    if (combat.turnIndex >= combat.combatants.length) combat.turnIndex = 0;
    if (combat.turnIndex < 0) combat.turnIndex = 0;
    if (combat.selectedIndex >= combat.combatants.length) combat.selectedIndex = combat.turnIndex;

    const active = combat.combatants[combat.turnIndex];
    $('#combat-turn-label').textContent = active ? `Turn: ${active.name}` : '—';

    combat.combatants.forEach((cb, idx) => {
      const row = document.createElement('div');
      const dead = cb.hp <= 0;
      const selected = idx === combat.selectedIndex;
      row.className = `combatant-row side-${cb.side || 'neutral'}${idx === combat.turnIndex ? ' active-turn' : ''}${dead ? ' dead' : ''}${selected ? ' selected' : ''}`;
      row.dataset.idx = String(idx);
      const hpPct = cb.hpMax > 0 ? cb.hp / cb.hpMax : 1;
      let hpClass = '';
      if (dead) hpClass = 'dead-hp';
      else if (hpPct <= 0.25) hpClass = 'critical';
      else if (hpPct <= 0.5) hpClass = 'hurt';

      row.innerHTML = `
        <div class="combat-init" title="Click to edit initiative" data-idx="${idx}">${cb.init}</div>
        <div class="combat-name-block">
          <div class="combat-name">${escapeHtml(cb.name)}</div>
          <div class="combat-sub">AC ${cb.ac}${cb.notes ? ' · ' + escapeHtml(cb.notes.slice(0, 40)) : ''}</div>
        </div>
        <div class="combat-hp-controls">
          <button type="button" class="hp-minus" data-idx="${idx}" title="-1 HP">−</button>
          <button type="button" class="hp-minus5" data-idx="${idx}" title="-5 HP">−5</button>
          <span class="combat-hp-val ${hpClass}" data-idx="${idx}" title="Click to set HP">${cb.hp}/${cb.hpMax}</span>
          <button type="button" class="hp-plus" data-idx="${idx}" title="+1 HP">+</button>
          <button type="button" class="hp-plus5" data-idx="${idx}" title="+5 HP">+5</button>
        </div>
        <div class="combat-actions">
          <button type="button" class="icon-btn combat-remove" data-idx="${idx}" title="Remove">✕</button>
        </div>
        <div class="combat-conditions">
          <input type="text" class="cond-input" data-idx="${idx}" value="${escapeAttr(cb.conditions || '')}" placeholder="Conditions (poisoned, prone…)" />
        </div>
      `;
      row.addEventListener('click', (e) => {
        if (e.target.closest('button, input, .combat-init, .combat-hp-val')) return;
        combat.selectedIndex = idx;
        save();
        renderCombat();
      });
      list.appendChild(row);
    });

    showCombatDetail(combat.combatants[combat.selectedIndex]);

    // Wire HP buttons
    list.querySelectorAll('.hp-minus').forEach(btn => {
      btn.addEventListener('click', () => adjustHp(parseInt(btn.dataset.idx, 10), -1));
    });
    list.querySelectorAll('.hp-minus5').forEach(btn => {
      btn.addEventListener('click', () => adjustHp(parseInt(btn.dataset.idx, 10), -5));
    });
    list.querySelectorAll('.hp-plus').forEach(btn => {
      btn.addEventListener('click', () => adjustHp(parseInt(btn.dataset.idx, 10), 1));
    });
    list.querySelectorAll('.hp-plus5').forEach(btn => {
      btn.addEventListener('click', () => adjustHp(parseInt(btn.dataset.idx, 10), 5));
    });
    list.querySelectorAll('.combat-hp-val').forEach(el => {
      el.addEventListener('click', async () => {
        const idx = parseInt(el.dataset.idx, 10);
        const cb = getCombat(c).combatants[idx];
        if (!cb) return;
        const ok = await openModal({
          title: `Set HP — ${cb.name}`,
          bodyHtml: `
            <div class="form-row">
              <div class="field"><label>Current HP</label><input type="number" id="m-hp" value="${cb.hp}" /></div>
              <div class="field"><label>Max HP</label><input type="number" id="m-hpmax" value="${cb.hpMax}" /></div>
            </div>`,
          onConfirm: () => {
            cb.hp = parseInt($('#m-hp').value, 10) || 0;
            cb.hpMax = parseInt($('#m-hpmax').value, 10) || cb.hpMax;
            save();
            return true;
          }
        });
        if (ok) renderCombat();
      });
    });
    list.querySelectorAll('.combat-init').forEach(el => {
      el.addEventListener('click', async () => {
        const idx = parseInt(el.dataset.idx, 10);
        const cb = getCombat(c).combatants[idx];
        if (!cb) return;
        const ok = await openModal({
          title: `Initiative — ${cb.name}`,
          bodyHtml: `<div class="field"><label>Initiative</label><input type="number" id="m-init" value="${cb.init}" /></div>`,
          onConfirm: () => {
            cb.init = parseInt($('#m-init').value, 10) || 0;
            save();
            return true;
          }
        });
        if (ok) renderCombat();
      });
    });
    list.querySelectorAll('.combat-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const combat = getCombat(c);
        combat.combatants.splice(idx, 1);
        if (combat.turnIndex >= combat.combatants.length) combat.turnIndex = Math.max(0, combat.combatants.length - 1);
        save();
        renderCombat();
      });
    });
    list.querySelectorAll('.cond-input').forEach(inp => {
      inp.addEventListener('change', () => {
        const idx = parseInt(inp.dataset.idx, 10);
        const cb = getCombat(c).combatants[idx];
        if (cb) {
          cb.conditions = inp.value.trim();
          save();
        }
      });
    });
  }

  function adjustHp(idx, delta) {
    const c = getActive();
    if (!c) return;
    const combat = getCombat(c);
    const cb = combat.combatants[idx];
    if (!cb) return;
    cb.hp = Math.max(0, (cb.hp || 0) + delta);
    if (cb.hp > cb.hpMax) cb.hp = cb.hpMax;
    save();
    renderCombat();
  }

  function combatNextTurn() {
    const c = getActive();
    if (!c) return;
    const combat = getCombat(c);
    if (combat.combatants.length === 0) return;
    combat.turnIndex = (combat.turnIndex + 1) % combat.combatants.length;
    if (combat.turnIndex === 0) combat.round += 1;
    save();
    renderCombat();
  }

  function combatClear() {
    const c = getActive();
    if (!c) return;
    c.combat = { round: 1, turnIndex: 0, combatants: [] };
    save();
    renderCombat();
    toast('Combat cleared');
  }

  function combatSortInit() {
    const c = getActive();
    if (!c) return;
    const combat = getCombat(c);
    const activeId = combat.combatants[combat.turnIndex]?.id;
    combat.combatants.sort((a, b) => (b.init || 0) - (a.init || 0));
    if (activeId) {
      const newIdx = combat.combatants.findIndex(x => x.id === activeId);
      combat.turnIndex = newIdx >= 0 ? newIdx : 0;
    } else {
      combat.turnIndex = 0;
    }
    save();
    renderCombat();
    toast('Sorted by initiative');
  }

  function combatRollInit() {
    const c = getActive();
    if (!c) return;
    const combat = getCombat(c);
    combat.combatants.forEach(cb => {
      // d20 + keep relative dex bias if we stored notes; simple d20 for now, preserve existing as base offset
      cb.init = Math.floor(Math.random() * 20) + 1;
    });
    combat.combatants.sort((a, b) => (b.init || 0) - (a.init || 0));
    combat.turnIndex = 0;
    combat.round = 1;
    save();
    renderCombat();
    toast('Initiative rolled');
  }

  async function combatPickFromList(list, side, title) {
    const c = getActive();
    if (!c) return;
    ensureCampaignShape(c);
    const items = list || [];
    if (items.length === 0) {
      toast(side === 'enemy' ? 'No villains in roster' : 'No party members');
      return;
    }
    const options = items.map((ch, i) =>
      `<label class="pick-row" style="display:flex;align-items:center;gap:0.5rem;margin:0.35rem 0;cursor:pointer">
        <input type="checkbox" class="pick-cb" value="${i}" />
        <span>${escapeHtml(ch.name)} <span class="muted small">(AC ${ch.ac || 10}, HP ${ch.hp || 0}/${ch.hpMax || ch.hp || 0})</span></span>
      </label>`
    ).join('');
    const ok = await openModal({
      title,
      bodyHtml: `<p class="muted small" style="margin-bottom:0.75rem">Select one or more to add to combat.</p>${options}`,
      confirmText: 'Add Selected',
      onConfirm: () => {
        const checked = $$('.pick-cb:checked');
        if (checked.length === 0) { toast('Select at least one'); return false; }
        const combat = getCombat(c);
        checked.forEach(cb => {
          const ch = items[parseInt(cb.value, 10)];
          if (ch) combat.combatants.push(combatantFromChar(ch, side));
        });
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      }
    });
    if (ok) {
      toast('Added to combat');
      renderCombat();
    }
  }

  async function combatQuickAdd() {
    const c = getActive();
    if (!c) return;
    const ok = await openModal({
      title: 'Quick Add Combatant',
      bodyHtml: `
        <div class="form-row">
          <div class="field"><label>Name</label><input type="text" id="m-name" placeholder="Goblin 1" /></div>
          <div class="field"><label>Side</label>
            <select id="m-side">
              <option value="enemy">Enemy</option>
              <option value="party">Party</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
        <div class="form-row triple">
          <div class="field"><label>Init</label><input type="number" id="m-init" value="10" /></div>
          <div class="field"><label>HP</label><input type="number" id="m-hp" value="10" /></div>
          <div class="field"><label>AC</label><input type="number" id="m-ac" value="12" /></div>
        </div>
        <div class="field"><label>Notes / Attacks</label><input type="text" id="m-notes" placeholder="Scimitar +4 (1d6+2)" /></div>
      `,
      confirmText: 'Add',
      onConfirm: () => {
        const name = $('#m-name').value.trim();
        if (!name) { toast('Name required'); return false; }
        const combat = getCombat(c);
        const hp = parseInt($('#m-hp').value, 10) || 1;
        combat.combatants.push({
          id: uid(),
          sourceId: null,
          name,
          init: parseInt($('#m-init').value, 10) || 0,
          hp,
          hpMax: hp,
          ac: parseInt($('#m-ac').value, 10) || 10,
          conditions: '',
          side: $('#m-side').value || 'enemy',
          notes: $('#m-notes').value.trim()
        });
        save();
        return true;
      }
    });
    if (ok) {
      toast('Combatant added');
      renderCombat();
    }
  }

  function combatantFromBestiary(b, side) {
    return {
      id: uid(),
      sourceId: null,
      bestiaryName: b.n,
      name: b.n,
      init: 10,
      hp: b.hp,
      hpMax: b.hp,
      ac: b.ac,
      conditions: '',
      side: side || 'enemy',
      notes: `CR ${b.cr} · ${b.o} · ${b.w}`
    };
  }

  function addBestiaryToCombat(b) {
    const c = getActive();
    if (!c) { toast('Open a campaign first'); return; }
    const combat = getCombat(c);
    combat.combatants.push(combatantFromBestiary(b));
    save();
    toast(`${b.n} added to combat`);
  }

  function addBestiaryAsVillain(b) {
    const c = getActive();
    if (!c) { toast('Open a campaign first'); return; }
    ensureCampaignShape(c);
    c.villains.push({
      id: uid(),
      name: b.n,
      player: 'NPC',
      type: 'villain',
      class: b.o,
      level: Math.max(1, Math.round(Number(b.cr) || 1)),
      world: b.w,
      hp: b.hp,
      hpMax: b.hp,
      ac: b.ac,
      speed: '30 ft.',
      str: 10, dex: 12, con: 12, int: 8, wis: 10, cha: 8,
      profBonus: 2,
      attacks: '',
      features: `${b.o} creature of ${b.w}`,
      notes: `CR ${b.cr}. From Bestiary of the Seven Worlds.`,
      corruption: b.o === 'Swordborn' || b.o === 'Sword-Touched' ? 2 : 0,
      subclass: '', race: '', background: '', alignment: '', saves: '', skills: '', equipment: ''
    });
    c.updatedAt = new Date().toISOString();
    save();
    toast(`${b.n} saved as Villain`);
  }

  async function combatPickBestiary() {
    const c = getActive();
    if (!c) return;
    const world = c.currentWorld || '';
    const filtered = world ? BESTIARY.filter(b => b.w === world) : BESTIARY;
    const pool = filtered.length ? filtered : BESTIARY;
    // Show searchable multi-pick of up to ~30 entries from pool sorted by CR
    const sorted = [...pool].sort((a, b) => a.cr - b.cr || a.n.localeCompare(b.n));
    const options = sorted.map((b, i) =>
      `<label class="pick-row" style="display:flex;align-items:center;gap:0.5rem;margin:0.3rem 0;cursor:pointer">
        <input type="checkbox" class="pick-cb" value="${i}" />
        <span><strong>${escapeHtml(b.n)}</strong> <span class="muted small">CR ${b.cr} · ${escapeHtml(b.o)} · AC ${b.ac} HP ${b.hp}</span></span>
      </label>`
    ).join('');
    const ok = await openModal({
      title: world ? `Bestiary — ${world}` : 'Add from Bestiary',
      bodyHtml: `<p class="muted small" style="margin-bottom:0.6rem">${sorted.length} creatures${world ? ' on ' + world : ''}. Select one or more.</p>
        <div style="max-height:50vh;overflow-y:auto">${options}</div>`,
      confirmText: 'Add to Combat',
      wide: true,
      onConfirm: () => {
        const checked = $$('.pick-cb:checked');
        if (!checked.length) { toast('Select at least one'); return false; }
        const combat = getCombat(c);
        checked.forEach(cb => {
          const b = sorted[parseInt(cb.value, 10)];
          if (b) combat.combatants.push(combatantFromBestiary(b));
        });
        save();
        return true;
      }
    });
    if (ok) { toast('Added to combat'); renderCombat(); }
  }

  async function combatRandomEncounter() {
    const c = getActive();
    if (!c) { toast('Open a campaign first'); return; }
    const world = c.currentWorld || '';
    // Estimate party tier from average level
    const levels = (c.party || []).map(p => Number(p.level) || 1);
    const avgLevel = levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 3;
    // Target CR band roughly party level / 2 to party level
    const minCr = Math.max(0, avgLevel * 0.4 - 1);
    const maxCr = avgLevel + 2;
    let pool = BESTIARY.filter(b => b.cr >= minCr && b.cr <= maxCr);
    if (world) {
      const worldPool = pool.filter(b => b.w === world);
      if (worldPool.length) pool = worldPool;
    }
    if (!pool.length) pool = world ? BESTIARY.filter(b => b.w === world) : BESTIARY;
    if (!pool.length) { toast('No creatures match'); return; }

    // Prefer 1–3 creatures totaling ~party CR budget
    const budget = Math.max(1, avgLevel * 1.2);
    const picks = [];
    let spent = 0;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (const b of shuffled) {
      if (picks.length >= 3) break;
      if (spent > 0 && spent + b.cr > budget * 1.5) continue;
      picks.push(b);
      spent += b.cr;
      if (spent >= budget * 0.7 && picks.length >= 1 && Math.random() < 0.5) break;
    }
    if (!picks.length) picks.push(shuffled[0]);

    const lines = picks.map(b => `• <strong>${escapeHtml(b.n)}</strong> — CR ${b.cr}, AC ${b.ac}, HP ${b.hp} (${escapeHtml(b.o)}, ${escapeHtml(b.w)})`).join('<br>');
    const ok = await openModal({
      title: 'Random Encounter',
      bodyHtml: `<p class="muted small">World: <strong>${escapeHtml(world || 'Any')}</strong> · Party avg level ~${avgLevel.toFixed(1)} · Target CR ${minCr.toFixed(1)}–${maxCr.toFixed(1)}</p>
        <p style="margin:0.75rem 0">${lines}</p>
        <p class="muted small">Add these to the combat tracker?</p>`,
      confirmText: 'Add to Combat',
      onConfirm: () => {
        const combat = getCombat(c);
        picks.forEach(b => combat.combatants.push(combatantFromBestiary(b)));
        save();
        return true;
      }
    });
    if (ok) {
      toast(`Encounter: ${picks.map(p => p.n).join(', ')}`);
      renderCombat();
    }
  }

  function bindCombatListeners() {
    $('#combat-next-btn')?.addEventListener('click', combatNextTurn);
    $('#combat-clear-btn')?.addEventListener('click', async () => {
      const ok = await openModal({
        title: 'Clear Combat?',
        bodyHtml: '<p>Remove all combatants and reset the round counter?</p>',
        confirmText: 'Clear',
        onConfirm: () => true
      });
      if (ok) combatClear();
    });
    $('#combat-add-party-btn')?.addEventListener('click', () => {
      const c = getActive();
      if (!c) return;
      combatPickFromList(c.party, 'party', 'Add from Party');
    });
    $('#combat-add-villain-btn')?.addEventListener('click', () => {
      const c = getActive();
      if (!c) return;
      ensureCampaignShape(c);
      combatPickFromList(c.villains, 'enemy', 'Add from Villains');
    });
    $('#combat-add-bestiary-btn')?.addEventListener('click', combatPickBestiary);
    $('#combat-random-enc-btn')?.addEventListener('click', combatRandomEncounter);
    $('#combat-quick-add-btn')?.addEventListener('click', combatQuickAdd);
    $('#combat-roll-init-btn')?.addEventListener('click', combatRollInit);
    $('#combat-sort-btn')?.addEventListener('click', combatSortInit);
  }

  // ─── Bestiary ────────────────────────────────────────────────────────────
  function bestiaryMatches(b, q, world, origin, crBand) {
    if (world && b.w !== world) return false;
    if (origin && b.o !== origin) return false;
    if (q) {
      const hay = [b.n, b.w, b.o, b.classif, b.desc, b.eco, b.people, b.run, b.seeds]
        .filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (crBand) {
      const cr = Number(b.cr);
      if (crBand === '0-2' && !(cr <= 2)) return false;
      if (crBand === '3-5' && !(cr >= 3 && cr <= 5)) return false;
      if (crBand === '6-9' && !(cr >= 6 && cr <= 9)) return false;
      if (crBand === '10-14' && !(cr >= 10 && cr <= 14)) return false;
      if (crBand === '15+' && !(cr >= 15)) return false;
    }
    return true;
  }

  function originClass(o) {
    return String(o || '').toLowerCase().replace(/\s+/g, '-');
  }

  function renderUmbrarians() {
    const root = $('#umbrarians-content');
    if (!root) return;
    const u = (typeof window !== 'undefined' && window.UMBRARIANS) ? window.UMBRARIANS : null;
    const race = getPhbRaces().find(r => r.name === 'Umbralites');
    if (!u) {
      root.innerHTML = '<p class="muted">Umbrarians data not loaded.</p>';
      return;
    }
    let raceHtml = '';
    if (race) {
      raceHtml = `
        <div class="detail-block">
          <div class="detail-label">Related Race — Umbralites (PHB)</div>
          <p class="detail-text"><em>${escapeHtml(race.tagline)}</em>. ${escapeHtml(race.intro)}</p>
          <p class="detail-text"><strong>Traits:</strong> ${race.traits.map(t => escapeHtml(t.name)).join(' · ')}</p>
          <ul class="trait-list">
            ${race.traits.map(t => `<li><strong>${escapeHtml(t.name)}.</strong> ${escapeHtml(t.text)}</li>`).join('')}
          </ul>
        </div>`;
    }
    root.innerHTML = `
      <article class="race-card">
        <header class="race-header">
          <h2>${escapeHtml(u.name)}</h2>
          <p class="race-tagline">${escapeHtml(u.subtitle)}</p>
        </header>
        <div class="detail-block callout">
          <div class="detail-label">Critical Distinction</div>
          <p class="detail-text">${escapeHtml(u.criticalDistinction)}</p>
        </div>
        <div class="detail-block"><div class="detail-label">Definition (DMG)</div><p class="detail-text">${escapeHtml(u.definition)}</p></div>
        <div class="detail-block"><div class="detail-label">Bound at Birth</div><p class="detail-text">${escapeHtml(u.boundAtBirth)}</p></div>
        <div class="detail-block"><div class="detail-label">Campaign Framework</div><p class="detail-text">${escapeHtml(u.framework)}</p></div>
        <div class="detail-block">
          <div class="detail-label">Corruption Stages</div>
          <ul class="trait-list">
            ${u.stages.map(s => `<li><strong>${escapeHtml(s.name)}.</strong> ${escapeHtml(s.text)}</li>`).join('')}
          </ul>
        </div>
        <div class="detail-block"><div class="detail-label">Gifts &amp; Bargains</div><p class="detail-text">${escapeHtml(u.gifts)}</p></div>
        <div class="detail-block"><div class="detail-label">Umbraria Context (World + Culture)</div><p class="detail-text">${escapeHtml(u.umbrariaContext)}</p></div>
        ${raceHtml}
        <div class="detail-block"><div class="detail-label">Player Characters</div><p class="detail-text">${escapeHtml(u.pcGuidance)}</p></div>
        <p class="muted small">${escapeHtml(u.sources)}</p>
      </article>`;
  }

  function renderBestiary() {
    const list = $('#bestiary-list');
    const countEl = $('#bestiary-count');
    if (!list) return;
    const q = ($('#bestiary-search')?.value || '').trim().toLowerCase();
    const world = $('#bestiary-world')?.value || '';
    const origin = $('#bestiary-origin')?.value || '';
    const crBand = $('#bestiary-cr')?.value || '';
    const filtered = BESTIARY.filter(b => bestiaryMatches(b, q, world, origin, crBand))
      .sort((a, b) => a.n.localeCompare(b.n));
    countEl.textContent = `${filtered.length} of ${BESTIARY.length} creatures`;
    list.innerHTML = '';
    filtered.forEach(b => {
      const card = document.createElement('div');
      card.className = 'bestiary-card';
      const preview = b.desc || b.eco || '';
      card.innerHTML = `
        <h3>${escapeHtml(b.n)}</h3>
        <div class="bestiary-meta">
          <span class="origin-tag ${originClass(b.o)}">${escapeHtml(b.o)}</span>
          <span>${escapeHtml(b.w)}</span>
        </div>
        <div class="bestiary-stats">
          <span class="stat-chip">CR ${b.cr}</span>
          <span class="stat-chip">AC ${b.ac}</span>
          <span class="stat-chip">HP ${b.hp}</span>
        </div>
        ${preview ? `<p class="bestiary-desc">${escapeHtml(preview)}</p>` : ''}
        <div class="actions">
          <button class="btn primary btn-combat">+ Combat</button>
          <button class="btn secondary btn-villain">+ Villain</button>
          <button class="btn ghost btn-more">Details</button>
        </div>
      `;
      card.querySelector('.btn-combat').addEventListener('click', () => addBestiaryToCombat(b));
      card.querySelector('.btn-villain').addEventListener('click', () => addBestiaryAsVillain(b));
      card.querySelector('.btn-more').addEventListener('click', () => {
        const peopleLabel = `People of ${b.w}`;
        openModal({
          title: b.n,
          confirmText: 'Close',
          wide: true,
          bodyHtml: `
            <div class="bestiary-meta" style="margin-bottom:0.75rem">
              <span class="origin-tag ${originClass(b.o)}">${escapeHtml(b.o)}</span>
              <span>${escapeHtml(b.w)}</span>
              ${b.classif ? `<span class="muted">· ${escapeHtml(b.classif)}</span>` : ''}
            </div>
            <div class="bestiary-stats" style="margin-bottom:1rem">
              <span class="stat-chip">CR ${b.cr}</span>
              <span class="stat-chip">AC ${b.ac}</span>
              <span class="stat-chip">HP ${b.hp}</span>
            </div>
            ${b.desc ? `<div class="detail-block"><div class="detail-label">Description</div><p class="detail-text">${escapeHtml(b.desc)}</p></div>` : ''}
            ${b.eco ? `<div class="detail-block"><div class="detail-label">Ecology and Behaviour</div><p class="detail-text">${escapeHtml(b.eco)}</p></div>` : ''}
            ${b.people ? `<div class="detail-block"><div class="detail-label">${escapeHtml(peopleLabel)}</div><p class="detail-text">${escapeHtml(b.people)}</p></div>` : ''}
            ${b.run ? `<div class="detail-block"><div class="detail-label">Running the Creature</div><p class="detail-text">${escapeHtml(b.run)}</p></div>` : ''}
            ${b.seeds ? `<div class="detail-block"><div class="detail-label">Adventure Seeds</div><p class="detail-text">${escapeHtml(b.seeds)}</p></div>` : ''}
          `,
          onConfirm: () => true
        });
      });
      list.appendChild(card);
    });
  }

  function bindBestiaryListeners() {
    ['bestiary-search', 'bestiary-world', 'bestiary-origin', 'bestiary-cr'].forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.dataset.wired) return;
      el.dataset.wired = '1';
      el.addEventListener('input', renderBestiary);
      el.addEventListener('change', renderBestiary);
    });
  }

  // ─── Dice Roller ─────────────────────────────────────────────────────────
  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function parseFormula(str) {
    str = str.replace(/\s+/g, '').toLowerCase();
    const match = str.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (match) {
      const count = parseInt(match[1] || '1', 10);
      const sides = parseInt(match[2], 10);
      const mod = match[3] ? parseInt(match[3], 10) : 0;
      return { count, sides, mod };
    }
    return null;
  }

  function performRoll({ count = 1, sides = 20, mod = 0, advantage = false, disadvantage = false, label = null }) {
    let rolls = [];
    let detail = '';

    if (advantage || disadvantage) {
      const r1 = Array.from({ length: count }, () => rollDie(sides));
      const r2 = Array.from({ length: count }, () => rollDie(sides));
      const sum1 = r1.reduce((a, b) => a + b, 0);
      const sum2 = r2.reduce((a, b) => a + b, 0);
      if (advantage && !disadvantage) {
        rolls = sum1 >= sum2 ? r1 : r2;
        detail = `Adv [${r1.join(', ')}] vs [${r2.join(', ')}] → `;
      } else if (disadvantage && !advantage) {
        rolls = sum1 <= sum2 ? r1 : r2;
        detail = `Dis [${r1.join(', ')}] vs [${r2.join(', ')}] → `;
      } else {
        rolls = r1;
        detail = '';
      }
    } else {
      rolls = Array.from({ length: count }, () => rollDie(sides));
    }

    const subtotal = rolls.reduce((a, b) => a + b, 0);
    const total = subtotal + mod;
    const modStr = mod === 0 ? '' : (mod > 0 ? ` + ${mod}` : ` − ${Math.abs(mod)}`);
    detail += `${count}d${sides}: [${rolls.join(', ')}]${modStr}`;

    const entry = {
      total,
      detail,
      label: label || `${count}d${sides}${modStr}`,
      time: new Date().toLocaleTimeString(),
    };

    state.diceHistory.unshift(entry);
    if (state.diceHistory.length > 40) state.diceHistory.pop();
    save();

    $('#dice-result .result-total').textContent = total;
    $('#dice-result .result-detail').textContent = detail;
    renderDiceHistory();

    const totalEl = $('#dice-result .result-total');
    totalEl.style.transform = 'scale(1.15)';
    setTimeout(() => { totalEl.style.transform = ''; }, 150);

    return entry;
  }

  function renderDiceHistory() {
    const ul = $('#roll-history');
    ul.innerHTML = state.diceHistory.slice(0, 20).map(h =>
      `<li><span class="total">${h.total}</span> ← ${escapeHtml(h.detail)} <small>${h.time}</small></li>`
    ).join('');
  }

  function setupDice() {
    $$('.die-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.die-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.selectedDie = parseInt(btn.dataset.sides, 10);
      });
    });
    $('.die-btn[data-sides="20"]')?.classList.add('selected');

    $('#roll-btn').addEventListener('click', () => {
      const count = Math.max(1, Math.min(99, parseInt($('#dice-count').value, 10) || 1));
      const mod = parseInt($('#dice-mod').value, 10) || 0;
      const advantage = $('#adv-check').checked;
      const disadvantage = $('#dis-check').checked;
      performRoll({ count, sides: state.selectedDie, mod, advantage, disadvantage });
    });

    $('#roll-custom').addEventListener('click', () => {
      const formula = $('#custom-formula').value.trim();
      if (!formula) return;
      const parsed = parseFormula(formula);
      if (!parsed) {
        toast('Invalid formula. Try 2d6+3 or 1d20');
        return;
      }
      performRoll({ ...parsed, label: formula });
    });

    $('#custom-formula').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('#roll-custom').click();
    });

    $('#clear-history').addEventListener('click', () => {
      state.diceHistory = [];
      save();
      renderDiceHistory();
      $('#dice-result .result-total').textContent = '—';
      $('#dice-result .result-detail').textContent = '';
    });

    $('#dice-toggle').addEventListener('click', () => {
      $('#dice-panel').classList.toggle('hidden');
    });
    $('#dice-close').addEventListener('click', () => {
      $('#dice-panel').classList.add('hidden');
    });

    $('#adv-check').addEventListener('change', () => {
      if ($('#adv-check').checked) $('#dis-check').checked = false;
    });
    $('#dis-check').addEventListener('change', () => {
      if ($('#dis-check').checked) $('#adv-check').checked = false;
    });

    renderDiceHistory();
  }

  // ─── Export / Import ─────────────────────────────────────────────────────
  function exportData() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      campaigns: state.campaigns,
      diceHistory: state.diceHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dark-sun-chronicles-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.campaigns || !Array.isArray(data.campaigns)) {
          toast('Invalid backup file');
          return;
        }
        openModal({
          title: 'Import Data?',
          bodyHtml: `<p>This will replace your current campaigns with the imported data (${data.campaigns.length} campaign${data.campaigns.length !== 1 ? 's' : ''}). Export first if you want a backup.</p>`,
          confirmText: 'Import & Replace',
          onConfirm: () => {
            state.campaigns = data.campaigns;
            state.activeCampaignId = data.campaigns[0]?.id || null;
            if (data.diceHistory) state.diceHistory = data.diceHistory;
            save();
            updateNavEnabled();
            setView('campaigns');
            toast('Data imported');
            return true;
          },
        });
      } catch {
        toast('Could not parse file');
      }
    };
    reader.readAsText(file);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, '&#39;');
  }

  // ─── Init ────────────────────────────────────────────────────────────────
  function init() {
    load();
    updateNavEnabled();

    $$('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        setView(btn.dataset.view);
      });
    });

    $('#menu-toggle').addEventListener('click', () => {
      $('#sidebar').classList.toggle('open');
    });

    $('#new-campaign-btn').addEventListener('click', () => promptNewCampaign());
    $('#new-session-btn').addEventListener('click', () => promptSession());
    $('#new-character-btn').addEventListener('click', () => promptCharacter());
    $('#new-faction-btn').addEventListener('click', () => promptFaction());
    $('#new-force-btn').addEventListener('click', () => promptForce());

    bindOverviewListeners();
    bindNotes();
    bindCombatListeners();
    bindBestiaryListeners();
    setupDice();

    $('#export-btn').addEventListener('click', exportData);
    $('#import-btn').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) importData(file);
      e.target.value = '';
    });

    setView('campaigns');

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!$('#modal').classList.contains('hidden')) {
          $('#modal-cancel').click();
        } else if (!$('#dice-panel').classList.contains('hidden')) {
          $('#dice-panel').classList.add('hidden');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
