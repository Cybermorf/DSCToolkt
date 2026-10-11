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
    const chaMod = abilityMod(scores.cha);

    let hpMax, ac, attackBonus, damage;
    const crn = Number(cr) || 0;
    if (crn <= 0.5) { hpMax = 8 + Math.floor(Math.random() * 12) + conMod; ac = 11 + Math.max(0, dexMod); attackBonus = 3 + Math.max(strMod, dexMod); damage = '1d6+' + Math.max(0, strMod); }
    else if (crn <= 2) { hpMax = 22 + Math.floor(Math.random() * 18) + conMod * 2; ac = 13 + Math.max(0, Math.min(2, dexMod)); attackBonus = 4 + Math.max(strMod, dexMod); damage = '1d8+' + Math.max(0, strMod); }
    else if (crn <= 5) { hpMax = 45 + Math.floor(Math.random() * 30) + conMod * 3; ac = 14 + Math.max(0, Math.min(2, dexMod)); attackBonus = 5 + Math.max(strMod, dexMod); damage = '2d6+' + Math.max(0, strMod); }
    else { hpMax = 80 + Math.floor(Math.random() * 40) + conMod * 4; ac = 15 + Math.max(0, Math.min(3, dexMod)); attackBonus = 7 + Math.max(strMod, dexMod); damage = '2d8+' + Math.max(0, strMod); }

    const weapons = ['shortsword', 'spear', 'scimitar', 'light crossbow', 'dagger', 'mace', 'quarterstaff', 'handaxe'];
    const weapon = pick(weapons);
    const attackModStr = attackBonus >= 0 ? `+${attackBonus}` : `${attackBonus}`;

    const asUmbrarian = !!opts.umbrarian;
    const stages = ['dormant', 'awakened', 'ascendant'];
    const umbStage = opts.umbrarianStage || (asUmbrarian ? pick(stages) : '');
    const shards = (window.UMBRARIANS && window.UMBRARIANS.shards) ? window.UMBRARIANS.shards : [];
    const shard = opts.shard || (asUmbrarian && shards.length ? pick(shards) : null);
    const shardAbility = opts.shardAbility || pick(['INT', 'WIS', 'CHA']);
    const levelApprox = Math.max(1, Math.round(Number(cr) || 1));
    const pb = (window.PHB_PROF_BY_LEVEL && window.PHB_PROF_BY_LEVEL[levelApprox]) || 2;
    const shardMod = shardAbility === 'INT' ? abilityMod(scores.int) : shardAbility === 'CHA' ? chaMod : wisMod;
    const shardDC = 8 + pb + shardMod;

    let traits = pick(GENERATORS.npcTraits);
    let secret = pick(GENERATORS.npcSecrets);
    let attacks = `${weapon} ${attackModStr} to hit, ${damage} damage`;
    let corruption = 0;

    if (asUmbrarian) {
      corruption = umbStage === 'ascendant' ? pick([4, 5, 6]) : umbStage === 'awakened' ? pick([1, 2, 3]) : pick([0, 1]);
      const shardName = shard ? shard.name : 'Unknown Shard';
      const umbLines = [
        `Umbrarian (${umbStage}) — Shard: ${shardName}`,
        `Shard Mark; Resonant Sense 1/LR (30 ft.)`,
        `Shard DC ${shardDC} (${shardAbility})`,
        umbStage === 'dormant' ? 'Dormant: dreams/impulses only' :
          umbStage === 'awakened' ? 'Awakened: 1–2 Gifts; Dark Bargains' :
          'Ascendant: Ascendant Gift + regional effect'
      ];
      if (shard) umbLines.push(`Theme: ${shard.theme}`);
      traits = umbLines.join(' · ');
      if (umbStage !== 'dormant') attacks += `; Whisper Lash (action, DC ${shardDC} WIS, 2d8 psychic)`;
      secret = `Bears ${shardName}. ${secret}`;
    }

    return {
      name: generateNpcName(),
      role,
      world: shard && asUmbrarian ? (opts.world || shard.world || world) : world,
      cr: String(cr),
      ...scores,
      ac,
      hp: hpMax,
      hpMax,
      speed: '30 ft.',
      perception: 10 + wisMod + (Math.random() < 0.4 ? 2 : 0),
      attacks,
      traits,
      secret,
      notes: '',
      isUmbrarian: asUmbrarian,
      umbrarianStage: umbStage,
      shard: shard ? shard.name : '',
      shardAbility: asUmbrarian ? shardAbility : '',
      corruption,
      features: traits
    };
  }

  function formatNpcBlock(npc) {
    const abs = `STR ${npc.str} (${modStr(npc.str)})  DEX ${npc.dex} (${modStr(npc.dex)})  CON ${npc.con} (${modStr(npc.con)})  INT ${npc.int} (${modStr(npc.int)})  WIS ${npc.wis} (${modStr(npc.wis)})  CHA ${npc.cha} (${modStr(npc.cha)})`;
    const lines = [
      `AC ${npc.ac} · HP ${npc.hp}/${npc.hpMax} · Speed ${npc.speed}`,
      abs,
      `Passive Perception ${npc.perception}`,
      `Attacks: ${npc.attacks}`,
      `Trait: ${npc.traits}`,
      `Secret: ${npc.secret}`
    ];
    if (npc.isUmbrarian) {
      lines.splice(3, 0, `Umbrarian · ${npc.umbrarianStage || '?'} · ${npc.shard || 'Shard'} · Corruption ${npc.corruption}/6`);
    }
    return {
      title: npc.name,
      subtitle: `${npc.role} · ${npc.world} · CR ${npc.cr}${npc.isUmbrarian ? ' · Umbrarian' : ''}`,
      lines
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

  function openModal({ title, bodyHtml, confirmText = 'Save', onConfirm, afterOpen, wide = false, xwide = false }) {
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = bodyHtml;
    $('#modal-confirm').textContent = confirmText;
    const panel = $('.modal-panel');
    if (panel) {
      panel.classList.toggle('wide', !!wide || !!xwide);
      panel.classList.toggle('xwide', !!xwide);
    }
    $('#modal').classList.remove('hidden');

    // Run afterOpen immediately so generators / extra UI can bind while modal is visible
    if (typeof afterOpen === 'function') {
      try { afterOpen(); } catch (e) { console.warn('afterOpen error', e); }
    }

    return new Promise(resolve => {
      modalResolve = (result) => {
        $('#modal').classList.add('hidden');
        if (panel) { panel.classList.remove('wide'); panel.classList.remove('xwide'); }
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
    else if (viewName === 'dsc-classes') renderDscClasses();
    else if (viewName === 'factions') renderFactions();
    else if (viewName === 'forces') renderForces();
    else if (viewName === 'notes') renderNotes();
    else if (viewName === 'tools') { renderCompendiumTools(); renderTools(); }
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
      inventory: Array.isArray(ch.inventory) ? ch.inventory.map(normalizeInventoryItem) : [],
      corruption: clamp(Number(ch.corruption) || 0, 0, 6),
      isUmbrarian: !!ch.isUmbrarian,
      umbrarianStage: ch.umbrarianStage || '',
      shard: ch.shard || '',
      shardAbility: ch.shardAbility || '',
      notes: ch.notes || '',
      avatar: ch.avatar || '',
      spellcastingAbility: ch.spellcastingAbility || '',
      spells: ch.spells || '',
      spellSlots: ch.spellSlots && typeof ch.spellSlots === 'object' ? ch.spellSlots : {},
      spellSlotsUsed: ch.spellSlotsUsed && typeof ch.spellSlotsUsed === 'object' ? ch.spellSlotsUsed : {},
      cantrips: ch.cantrips || '',
      spellIds: Array.isArray(ch.spellIds) ? ch.spellIds : []
    };
  }

  function abilityRowHtml(prefix, ch) {
    const raceBon = getRaceBonuses(ch.race || '');
    // Interpret stored scores as totals; derive display base = total - racial (min 8)
    return ABS.map(k => {
      const label = k.toUpperCase();
      const total = Number(ch[k]) || 10;
      const bon = raceBon[k] || 0;
      const base = Math.max(3, total - bon);
      return `<div class="ability-box" data-ab="${k}">
        <label class="small">${label}</label>
        <input type="number" id="${prefix}-${k}" min="3" max="20" value="${base}" class="ability-score" data-ab="${k}" data-base="1" title="Base score (before racial bonus)" />
        <div class="ability-bonus-line"><span class="racial-bon" id="${prefix}-rbon-${k}">${bon ? '+' + bon : '—'}</span></div>
        <span class="ability-total" id="${prefix}-total-${k}">${total}</span>
        <span class="ability-mod" id="${prefix}-mod-${k}">${modStr(total)}</span>
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
    const dsc = races.filter(r => r.source === 'DSC' || (r.world && r.source !== 'PHB'));
    const official = races.filter(r => r.source === 'PHB');
    const other = races.filter(r => !dsc.includes(r) && !official.includes(r));
    const opt = (r) => {
      const sel = r.name === selected ? 'selected' : '';
      const bon = r.bonuses ? ' (' + ABS.filter(a => r.bonuses[a]).map(a => `${a.toUpperCase()}+${r.bonuses[a]}`).join(', ') + ')' : '';
      return `<option value="${escapeAttr(r.name)}" ${sel}>${escapeHtml(r.name)}${bon}</option>`;
    };
    let html = `<option value="">— Select race —</option>`;
    if (dsc.length) {
      html += `<optgroup label="Eldoria Peoples">` + dsc.map(opt).join('') + `</optgroup>`;
    }
    if (official.length) {
      html += `<optgroup label="Official D&D Races">` + official.map(opt).join('') + `</optgroup>`;
    }
    if (other.length) {
      html += `<optgroup label="Other">` + other.map(opt).join('') + `</optgroup>`;
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

  function getClassAbilities(className) {
    const all = (typeof window !== 'undefined' && window.CLASS_ABILITIES) ? window.CLASS_ABILITIES : {};
    return all[className] || [];
  }

  function progressionTableHtml(className) {
    const cls = findPhbClass(className);
    if (!cls) return '<p class="muted small">Select a class to view its progression and abilities.</p>';
    const rows = (cls.progression || []).map(([lvl, feat]) =>
      `<tr><td>${lvl}</td><td>${escapeHtml(feat)}</td></tr>`).join('');
    const abilities = getClassAbilities(className);
    const abilityHtml = abilities.length ? `
      <div class="class-abilities">
        <div class="detail-label">Class Abilities</div>
        <ul class="trait-list">
          ${abilities.map(a => `<li><strong>L${a.lvl} — ${escapeHtml(a.name)}.</strong> ${escapeHtml(a.text)}</li>`).join('')}
        </ul>
      </div>` : '';
    return `
      <div class="class-summary">
        <p><strong>${escapeHtml(cls.name)}</strong> — ${escapeHtml(cls.summary || '')}</p>
        <p class="muted small">Hit Die ${cls.hitDie} · Primary ${escapeHtml(cls.primary)} · Saves ${escapeHtml(cls.saves)} · Armor: ${escapeHtml(cls.armor || '')}${cls.weapons ? ' · Weapons: ' + escapeHtml(cls.weapons) : ''}</p>
        ${cls.skills ? `<p class="muted small">Skills: choose ${cls.skillsChoose || '?'} from ${cls.skills === 'Any' ? 'any' : (Array.isArray(cls.skills) ? cls.skills.join(', ') : cls.skills)}</p>` : ''}
      </div>
      <table class="prog-table">
        <thead><tr><th>Level</th><th>Features</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${abilityHtml}`;
  }


  function getMoonPaths() {
    return (typeof window !== 'undefined' && window.MOON_PATHS) ? window.MOON_PATHS : [];
  }

  function findMoonPath(nameOrId) {
    if (!nameOrId) return null;
    const n = String(nameOrId).toLowerCase();
    return getMoonPaths().find(p => p.id === n || p.name.toLowerCase() === n || p.world.toLowerCase() === n) || null;
  }

  function moonPathOptionsHtml(selected) {
    let html = `<option value="">— Choose Moon Path —</option>`;
    getMoonPaths().forEach(p => {
      const sel = (selected === p.name || selected === p.id || selected === p.world) ? 'selected' : '';
      html += `<option value="${escapeAttr(p.name)}" ${sel}>${escapeHtml(p.name)}</option>`;
    });
    return html;
  }

  function abilityModNum(score) {
    return Math.floor(((Number(score) || 10) - 10) / 2);
  }

  function formatAttackBonus(mod, prof) {
    const t = mod + prof;
    return t >= 0 ? `+${t}` : `${t}`;
  }

  function cantripDiceForLevel(level) {
    if (level >= 17) return '4d';
    if (level >= 11) return '3d';
    if (level >= 5) return '2d';
    return '1d';
  }

  function buildAttacksForClass(className, level, scores, profBonus) {
    const table = (window.CLASS_ATTACKS || {})[className];
    if (!table) return '';
    const lvl = clamp(Number(level) || 1, 1, 20);
    const pb = Number(profBonus) || (window.PHB_PROF_BY_LEVEL ? window.PHB_PROF_BY_LEVEL[lvl] : 2);
    const str = abilityModNum(scores.str);
    const dex = abilityModNum(scores.dex);
    const int = abilityModNum(scores.int);
    const wis = abilityModNum(scores.wis);
    const cha = abilityModNum(scores.cha);
    let atkMod = str;
    let style = table.style || 'str_melee';
    if (style.includes('dex')) atkMod = dex;
    if (style.includes('wis')) atkMod = Math.max(str, wis);
    if (style === 'wis_spell') atkMod = wis;
    if (style === 'cha_spell') atkMod = cha;
    if (style === 'int_spell') atkMod = int;
    if (style === 'wis_hybrid') atkMod = Math.max(str, dex);
    if (style === 'dex_ranged') atkMod = dex;

    const lines = [];
    (table.weapons || []).forEach(([name, dice, dtype], idx) => {
      const dmgMod = atkMod;
      const dmgStr = dmgMod >= 0 ? `${dice}+${dmgMod}` : `${dice}${dmgMod}`;
      lines.push(`${name}: ${formatAttackBonus(atkMod, pb)} to hit, ${dmgStr} ${dtype}`);
    });
    if (table.cantrip) {
      const c = table.cantrip;
      // scale dice if pattern like 1d10
      let scaled = c;
      const m = c.match(/(\d+)d(\d+)/);
      if (m && (style.includes('spell') || className === 'Warlock' || className === 'Sorcerer' || className === 'Wizard' || className === 'Cleric' || className === 'Druid' || className === 'Bard')) {
        const n = cantripDiceForLevel(lvl).replace('d','');
        scaled = c.replace(/(\d+)d(\d+)/, `${cantripDiceForLevel(lvl)}${m[2]}`);
      }
      const spellMod = style.includes('cha') ? cha : style.includes('int') ? int : style.includes('wis') ? wis : atkMod;
      if (/to hit|attack/i.test(scaled) || /Bolt|Blast|Flame/.test(scaled)) {
        lines.push(`${scaled.split('(')[0].trim()}: ${formatAttackBonus(spellMod, pb)} to hit (${scaled.includes('(') ? scaled.slice(scaled.indexOf('(')+1).replace(')','') : 'see PHB'})`);
      } else {
        lines.push(scaled + ` [DC ${8 + pb + spellMod}]`);
      }
    }
    if (table.note) lines.push(`Note: ${table.note}`);
    // Extra Attack note
    if (lvl >= 5 && ['Barbarian','Fighter','Paladin','Ranger','Monk','Moon Guardian','Bloodhunter','Ghostblade'].includes(className)) {
      lines.push(lvl >= 20 && className === 'Fighter' ? 'Extra Attack (3)' : lvl >= 11 && className === 'Fighter' ? 'Extra Attack (2)' : 'Extra Attack (2 attacks)');
    }
    if (className === 'Rogue' || className === 'Shadowblade') {
      const sa = Math.ceil(lvl / 2);
      lines.push(`Sneak Attack: ${sa}d6 when eligible`);
    }
    if (className === 'Moon Guardian' && lvl >= 2) {
      lines.push(`Spell save DC ${8 + pb + wis}; Spell attack ${formatAttackBonus(wis, pb)}`);
      lines.push('Moonlight Infusion: spend Lunar Charges (see class features)');
    }
    return lines.join('\n');
  }


  /** Feature sections that can be updated independently without wiping others. */
  
  
  
  
  
  function getUserCompendium() {
    try {
      return JSON.parse(localStorage.getItem('dsc_compendium_extra') || '{"spells":[],"equipment":[]}');
    } catch (e) {
      return { spells: [], equipment: [] };
    }
  }

  function saveUserCompendium(data) {
    localStorage.setItem('dsc_compendium_extra', JSON.stringify(data));
  }

  function mergeSpellRecord(raw) {
    if (!raw || !raw.name) return null;
    const name = String(raw.name).trim();
    const id = (raw.id || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const level = raw.level != null ? Number(raw.level) : (String(raw.levelText || '').toLowerCase().includes('cantrip') ? 0 : parseInt(raw.levelText, 10) || 0);
    return {
      id,
      name,
      level: isNaN(level) ? 0 : level,
      school: raw.school || 'Unknown',
      time: raw.time || raw.castingTime || raw.casting_time || '—',
      range: raw.range || '—',
      components: raw.components || '—',
      duration: raw.duration || '—',
      classes: Array.isArray(raw.classes) ? raw.classes : String(raw.classes || '').split(/[,;]/).map(s => s.trim()).filter(Boolean),
      summary: raw.summary || (raw.description || '').slice(0, 200),
      description: raw.description || raw.text || raw.summary || '',
      ritual: !!(raw.ritual),
      concentration: !!(raw.concentration) || /concentration/i.test(String(raw.duration || '')),
      source: raw.source || raw.edition || 'Imported'
    };
  }

  function mergeEquipmentRecord(raw) {
    if (!raw || !raw.name) return null;
    const name = String(raw.name).trim();
    const id = (raw.id || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const cat = (raw.category || raw.type || 'gear').toLowerCase();
    const item = {
      id,
      name,
      category: ['armor','weapon','shield','gear','tool'].includes(cat) ? cat : 'gear',
      cost: raw.cost || '',
      weight: raw.weight != null ? Number(raw.weight) || 0 : 0,
      notes: raw.notes || raw.description || '',
      source: raw.source || raw.edition || 'Imported'
    };
    if (item.category === 'armor') {
      item.armorType = raw.armorType || raw.armor_type || 'light';
      item.acBase = raw.acBase != null ? Number(raw.acBase) : (raw.ac != null ? Number(raw.ac) : 11);
      item.acDexMax = raw.acDexMax != null ? raw.acDexMax : null;
    }
    if (item.category === 'shield') {
      item.armorType = 'shield';
      item.acBonus = raw.acBonus != null ? Number(raw.acBonus) : 2;
    }
    if (item.category === 'weapon') {
      item.weaponType = raw.weaponType || raw.weapon_type || '';
      item.damage = raw.damage || '';
      item.damageType = raw.damageType || raw.damage_type || '';
      item.props = raw.props || raw.properties || '';
    }
    return item;
  }

  function applyCompendiumToRuntime() {
    const baseSpells = (window.SPELLS_BASE || window.SPELLS || []).slice();
    const baseEquip = (window.EQUIPMENT_BASE || window.EQUIPMENT || []).slice();
    if (!window.SPELLS_BASE) window.SPELLS_BASE = baseSpells.map(s => ({ ...s }));
    if (!window.EQUIPMENT_BASE) window.EQUIPMENT_BASE = baseEquip.map(e => ({ ...e }));
    const extra = getUserCompendium();
    const spellMap = new Map(window.SPELLS_BASE.map(s => [s.id, s]));
    (extra.spells || []).forEach(s => {
      const m = mergeSpellRecord(s);
      if (m) spellMap.set(m.id, m);
    });
    const eqMap = new Map(window.EQUIPMENT_BASE.map(e => [e.id, e]));
    (extra.equipment || []).forEach(e => {
      const m = mergeEquipmentRecord(e);
      if (m) eqMap.set(m.id, m);
    });
    window.SPELLS = [...spellMap.values()].sort((a,b) => (a.level-b.level) || a.name.localeCompare(b.name));
    window.EQUIPMENT = [...eqMap.values()];
  }

  function importCompendiumPack(obj) {
    // Flexible: accepts DSCToolkt-compendium-v1, or raw {spells:[], equipment:[]},
    // or Open5e-ish / homebrew arrays
    let spellsIn = [];
    let equipIn = [];
    let meta = { edition: '', source: '', attribution: '' };
    if (Array.isArray(obj)) {
      // Heuristic: spells have level/school, equipment have category/cost
      obj.forEach(row => {
        if (row.level != null || row.school || row.castingTime || row.casting_time) spellsIn.push(row);
        else equipIn.push(row);
      });
    } else if (obj && typeof obj === 'object') {
      meta.edition = obj.edition || obj.system || '';
      meta.source = obj.source || obj.name || '';
      meta.attribution = obj.attribution || '';
      spellsIn = obj.spells || obj.spell || obj.Spells || [];
      equipIn = obj.equipment || obj.items || obj.gear || obj.Equipment || [];
      // 5e.tools / other
      if (!spellsIn.length && obj.compendium?.spells) spellsIn = obj.compendium.spells;
      if (!equipIn.length && obj.compendium?.items) equipIn = obj.compendium.items;
    }
    const extra = getUserCompendium();
    const spellMap = new Map((extra.spells || []).map(s => [s.id || s.name, s]));
    let sCount = 0, eCount = 0;
    spellsIn.forEach(raw => {
      const m = mergeSpellRecord(raw);
      if (m) { spellMap.set(m.id, m); sCount++; }
    });
    const eqMap = new Map((extra.equipment || []).map(e => [e.id || e.name, e]));
    equipIn.forEach(raw => {
      const m = mergeEquipmentRecord(raw);
      if (m) { eqMap.set(m.id, m); eCount++; }
    });
    const next = {
      spells: [...spellMap.values()],
      equipment: [...eqMap.values()],
      meta: { ...(extra.meta || {}), ...meta, updatedAt: new Date().toISOString() }
    };
    saveUserCompendium(next);
    applyCompendiumToRuntime();
    return { spells: sCount, equipment: eCount, totalSpells: window.SPELLS.length, totalEquipment: window.EQUIPMENT.length };
  }

  function renderCompendiumTools() {
    const root = $('#compendium-tools');
    if (!root) return;
    const extra = getUserCompendium();
    const sN = (extra.spells || []).length;
    const eN = (extra.equipment || []).length;
    root.innerHTML = `
      <div class="compendium-panel">
        <h3>Compendium Import</h3>
        <p class="muted small">Import JSON packs of spells and equipment from any edition-style source. Built-in data includes <strong>SRD 5.2.1</strong> (CC-BY-4.0). Imported entries merge by id/name and override duplicates.</p>
        <p class="muted small">Supported shapes: <code>DSCToolkt-compendium-v1</code> (<code>{ spells:[], equipment:[] }</code>), raw arrays, or objects with <code>items</code>/<code>spell</code> keys.</p>
        <div class="form-row">
          <button type="button" class="btn primary" id="comp-import-btn">Import JSON Pack</button>
          <button type="button" class="btn secondary" id="comp-export-btn">Export User Pack</button>
          <button type="button" class="btn danger" id="comp-clear-btn">Clear User Imports</button>
          <input type="file" id="comp-import-file" accept=".json,application/json" hidden />
        </div>
        <p class="muted small">User imports: <strong>${sN}</strong> spells · <strong>${eN}</strong> equipment · Runtime totals: <strong>${(window.SPELLS||[]).length}</strong> spells · <strong>${(window.EQUIPMENT||[]).length}</strong> equipment</p>
        <details class="compendium-sample">
          <summary>Sample pack format</summary>
          <pre class="sample-pre">{
  "format": "DSCToolkt-compendium-v1",
  "edition": "5e-srd-5.2.1",
  "source": "My Homebrew",
  "spells": [{ "name": "Example Bolt", "level": 0, "school": "Evocation", "time": "Action", "range": "60 feet", "components": "V, S", "duration": "Instantaneous", "classes": ["Wizard"], "description": "Ranged spell attack, 1d10 force." }],
  "equipment": [{ "name": "Moonsteel Blade", "category": "weapon", "damage": "1d8", "damageType": "slashing", "props": "Finesse", "cost": "50 GP" }]
}</pre>
        </details>
      </div>`;
    $('#comp-import-btn')?.addEventListener('click', () => $('#comp-import-file')?.click());
    $('#comp-import-file')?.addEventListener('change', () => {
      const f = $('#comp-import-file').files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          const res = importCompendiumPack(obj);
          toast(`Imported ${res.spells} spells, ${res.equipment} equipment`);
          renderCompendiumTools();
        } catch (err) {
          console.warn(err);
          toast('Import failed — invalid JSON');
        }
        $('#comp-import-file').value = '';
      };
      reader.readAsText(f);
    });
    $('#comp-export-btn')?.addEventListener('click', () => {
      const extra = getUserCompendium();
      const pack = {
        format: 'DSCToolkt-compendium-v1',
        edition: extra.meta?.edition || 'user',
        source: extra.meta?.source || 'User Import',
        attribution: extra.meta?.attribution || '',
        spells: extra.spells || [],
        equipment: extra.equipment || []
      };
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'dsc-compendium-user.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
    $('#comp-clear-btn')?.addEventListener('click', () => {
      if (!confirm('Remove all user-imported spells and equipment?')) return;
      saveUserCompendium({ spells: [], equipment: [] });
      applyCompendiumToRuntime();
      toast('User compendium cleared');
      renderCompendiumTools();
    });
  }

function getSpellLibrary() {
    return (typeof window !== 'undefined' && window.SPELLS) ? window.SPELLS : [];
  }

  function findSpell(idOrName) {
    const lib = getSpellLibrary();
    const q = String(idOrName || '').toLowerCase();
    return lib.find(s => s.id === q || s.name.toLowerCase() === q) || null;
  }

  function spellsForClass(className) {
    const lib = getSpellLibrary();
    if (!className) return lib;
    return lib.filter(s => (s.classes || []).includes(className));
  }

  function parseKnownSpellIds(ch) {
    if (Array.isArray(ch.spellIds) && ch.spellIds.length) return ch.spellIds.slice();
    // recover from text lists
    const names = []
      .concat(String(ch.cantrips || '').split(/[\n,;]+/))
      .concat(String(ch.spells || '').split(/[\n,;]+/))
      .map(s => s.trim().replace(/\s*\(.*?\)\s*$/, ''))
      .filter(Boolean);
    const ids = [];
    names.forEach(n => {
      const sp = findSpell(n);
      if (sp) ids.push(sp.id);
    });
    return ids;
  }

  function spellCardHtml(sp, opts = {}) {
    if (!sp) return '';
    const lvl = sp.level === 0
      ? `${escapeHtml(sp.school)} Cantrip`
      : `${sp.level}${sp.level===1?'st':sp.level===2?'nd':sp.level===3?'rd':'th'}-level ${escapeHtml(sp.school)}`;
    const tags = [
      sp.ritual ? 'Ritual' : '',
      sp.concentration ? 'Concentration' : ''
    ].filter(Boolean);
    const desc = sp.description || sp.summary || '';
    return `<article class="spell-card" data-spell-id="${escapeAttr(sp.id)}">
      <div class="spell-card-banner">
        <div class="spell-card-name">${escapeHtml(sp.name)}</div>
        <div class="spell-card-level">${lvl}${tags.length ? ' · ' + tags.map(t => escapeHtml(t)).join(' · ') : ''}</div>
      </div>
      <div class="spell-card-stats">
        <div class="spell-stat">
          <div class="spell-stat-label">Casting Time</div>
          <div class="spell-stat-value">${escapeHtml(sp.time || '—')}</div>
        </div>
        <div class="spell-stat">
          <div class="spell-stat-label">Range</div>
          <div class="spell-stat-value">${escapeHtml(sp.range || '—')}</div>
        </div>
        <div class="spell-stat">
          <div class="spell-stat-label">Duration</div>
          <div class="spell-stat-value">${escapeHtml(sp.duration || '—')}</div>
        </div>
        <div class="spell-stat">
          <div class="spell-stat-label">Components</div>
          <div class="spell-stat-value">${escapeHtml(sp.components || '—')}</div>
        </div>
      </div>
      <div class="spell-card-desc">${escapeHtml(desc).split(String.fromCharCode(10)).join('<br>')}</div>
      ${opts.removable ? `<div class="spell-card-actions"><button type="button" class="btn danger btn-tiny spell-remove" data-spell-id="${escapeAttr(sp.id)}">Remove</button></div>` : ''}
    </article>`;
  }

  function spellSheetCardsHtml(ch) {
    const ids = parseKnownSpellIds(ch);
    if (!ids.length) return '';
    const cards = ids.map(id => findSpell(id)).filter(Boolean)
      .sort((a,b) => a.level - b.level || a.name.localeCompare(b.name))
      .map(sp => spellCardHtml(sp));
    if (!cards.length) return '';
    return `<div class="cs-panel"><div class="cs-panel-title">Spell Cards</div>
      <div class="spell-card-grid">${cards.join('')}</div></div>`;
  }

function getCasterType(className) {
    if ((window.FULL_CASTERS || []).includes(className)) return 'full';
    if ((window.HALF_CASTERS || []).includes(className)) return 'half';
    if ((window.PACT_CASTERS || []).includes(className)) return 'pact';
    return 'none';
  }

  function defaultSpellAbility(className) {
    const map = {
      Bard: 'CHA', Cleric: 'WIS', Druid: 'WIS', Sorcerer: 'CHA', Wizard: 'INT',
      Paladin: 'CHA', Ranger: 'WIS', Warlock: 'CHA', 'Moon Guardian': 'WIS'
    };
    return map[className] || '';
  }

  function getSpellSlotMaxes(className, level) {
    const lvl = clamp(Number(level) || 1, 1, 20);
    const type = getCasterType(className);
    if (type === 'full') {
      const row = (window.SPELL_SLOTS_FULL || [])[lvl] || [];
      const out = {};
      row.forEach((n, i) => { out[i + 1] = n; });
      return out;
    }
    if (type === 'half') {
      const row = (window.SPELL_SLOTS_HALF || [])[lvl] || [];
      const out = {};
      row.forEach((n, i) => { out[i + 1] = n; });
      return out;
    }
    if (type === 'pact') {
      const row = (window.SPELL_SLOTS_WARLOCK || [])[lvl];
      if (!row) return {};
      return { pactLevel: row[0], pactCount: row[1] };
    }
    return {};
  }

  function collectSpellSlotsUsed() {
    const used = {};
    try {
      const pact = $('#m-slot-pact');
      if (pact) used.pact = clamp(parseInt(pact.value, 10) || 0, 0, 99);
      document.querySelectorAll('.m-slot').forEach(inp => {
        used[inp.dataset.sl] = clamp(parseInt(inp.value, 10) || 0, 0, 99);
      });
    } catch (e) {}
    return used;
  }

  function spellSlotsEditorHtml(ch) {
    const type = getCasterType(ch.class);
    if (type === 'none') {
      return `<p class="muted small" id="m-spell-none">This class has no spell slots. (Subclass casting can be tracked in Features.)</p>
        <div id="m-spell-body" class="hidden"></div>`;
    }
    const maxes = getSpellSlotMaxes(ch.class, ch.level);
    const used = ch.spellSlotsUsed || {};
    let slotsHtml = '';
    if (type === 'pact') {
      const pl = maxes.pactLevel || 1;
      const pc = maxes.pactCount || 1;
      const u = used.pact != null ? used.pact : 0;
      slotsHtml = `<div class="spell-slots-row">
        <label>Pact slots (L${pl}) <input type="number" id="m-slot-pact" min="0" max="${pc}" value="${u}" /> / ${pc}</label>
      </div>
      <p class="muted small">Warlock slots all recover on a Short Rest.</p>`;
    } else {
      const levels = Object.keys(maxes).map(Number).sort((a,b)=>a-b);
      slotsHtml = `<div class="spell-slots-row">${levels.map(sl => {
        const max = maxes[sl];
        const u = used[sl] != null ? used[sl] : 0;
        return `<label class="spell-slot-chip">L${sl} <input type="number" class="m-slot" data-sl="${sl}" min="0" max="${max}" value="${u}" /> / ${max}</label>`;
      }).join('')}</div>`;
    }
    const ab = ch.spellcastingAbility || defaultSpellAbility(ch.class);
    return `
      <div id="m-spell-body">
        <div class="form-row triple">
          <div class="field"><label>Spellcasting Ability</label>
            <select id="m-spell-ab">
              <option value="INT" ${ab==='INT'?'selected':''}>Intelligence</option>
              <option value="WIS" ${ab==='WIS'?'selected':''}>Wisdom</option>
              <option value="CHA" ${ab==='CHA'?'selected':''}>Charisma</option>
            </select>
          </div>
          <div class="field"><label>Spell Save DC</label>
            <input type="text" id="m-spell-dc" readonly value="" />
          </div>
          <div class="field"><label>Spell Attack</label>
            <input type="text" id="m-spell-atk" readonly value="" />
          </div>
        </div>
        <div class="field"><label>Spell Slots (used / max)</label>${slotsHtml}</div>
        <div class="field">
          <label>Spell Library — search &amp; add</label>
          <div class="spell-picker">
            <div class="form-row">
              <div class="field"><input type="search" id="m-spell-search" placeholder="Search spells…" autocomplete="off" /></div>
              <div class="field"><select id="m-spell-level-filter">
                <option value="all">All levels</option>
                <option value="0">Cantrips</option>
                <option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option>
                <option value="4">4th</option><option value="5">5th</option><option value="6">6th</option>
                <option value="7">7th</option><option value="8">8th</option><option value="9">9th</option>
              </select></div>
            </div>
            <div id="m-spell-results" class="spell-results"></div>
          </div>
        </div>
        <div class="field">
          <label>Known / Prepared Spells</label>
          <div id="m-spell-known" class="spell-known-list"></div>
          <textarea id="m-cantrips" class="hidden">${escapeHtml(ch.cantrips || '')}</textarea>
          <textarea id="m-spells" class="hidden">${escapeHtml(ch.spells || '')}</textarea>
          <input type="hidden" id="m-spell-ids" value="${escapeAttr((ch.spellIds || []).join(','))}" />
        </div>
      </div>`;
  }

  function computeSpellDcAtk(ability, scores, pb) {
    const key = (ability || 'WIS').toLowerCase();
    const mod = abilityModNum(scores[key] != null ? scores[key] : 10);
    const p = Number(pb) || 2;
    return { dc: 8 + p + mod, atk: p + mod, mod, ability: (ability || 'WIS').toUpperCase() };
  }

  function spellSheetBlock(ch) {
    const type = getCasterType(ch.class);
    if (type === 'none' && !(ch.spells || ch.cantrips)) return '';
    const ab = ch.spellcastingAbility || defaultSpellAbility(ch.class) || 'WIS';
    const pb = ch.profBonus || 2;
    const info = computeSpellDcAtk(ab, ch, pb);
    const maxes = getSpellSlotMaxes(ch.class, ch.level);
    const used = ch.spellSlotsUsed || {};
    let slotsLine = '';
    if (type === 'pact') {
      const u = used.pact != null ? used.pact : 0;
      slotsLine = `Pact L${maxes.pactLevel}: ${u}/${maxes.pactCount}`;
    } else if (type !== 'none') {
      slotsLine = Object.keys(maxes).map(Number).sort((a,b)=>a-b).map(sl => {
        const u = used[sl] != null ? used[sl] : 0;
        return `L${sl} ${u}/${maxes[sl]}`;
      }).join(' · ');
    }
    const cantrips = (ch.cantrips || '').trim();
    const spells = (ch.spells || '').trim();
    return `
      <div class="cs-panel">
        <div class="cs-panel-title">Spellcasting</div>
        <div class="cs-umb-stats">
          <div class="cs-stat-box"><div class="cs-stat-val">${info.dc}</div><div class="cs-stat-label">Spell Save DC</div><div class="cs-stat-sub muted small">${info.ability}</div></div>
          <div class="cs-stat-box"><div class="cs-stat-val">${info.atk >= 0 ? '+' + info.atk : info.atk}</div><div class="cs-stat-label">Spell Attack</div></div>
        </div>
        ${slotsLine ? `<p class="cs-body"><strong>Slots:</strong> ${escapeHtml(slotsLine)}</p>` : ''}
        ${cantrips ? `<p class="cs-body"><strong>Cantrips:</strong> ${escapeHtml(cantrips)}</p>` : ''}
        ${spells ? `<pre class="cs-pre">${escapeHtml(spells)}</pre>` : ''}
      </div>`;
  }

function getEquipmentList() {
    return (typeof window !== 'undefined' && window.EQUIPMENT) ? window.EQUIPMENT : [];
  }

  function normalizeInventoryItem(it) {
    if (!it) return null;
    return {
      uid: it.uid || uid(),
      id: it.id || '',
      name: it.name || 'Item',
      category: it.category || 'gear',
      qty: Math.max(1, Number(it.qty) || 1),
      equipped: !!it.equipped,
      armorType: it.armorType || '',
      acBase: it.acBase != null ? Number(it.acBase) : null,
      acDexMax: it.acDexMax != null ? it.acDexMax : null,
      acBonus: it.acBonus != null ? Number(it.acBonus) : 0,
      damage: it.damage || '',
      damageType: it.damageType || '',
      props: it.props || '',
      weaponType: it.weaponType || '',
      notes: it.notes || '',
      cost: it.cost || '',
      weight: it.weight != null ? Number(it.weight) : 0
    };
  }

  function catalogItemToInventory(cat) {
    return normalizeInventoryItem({
      id: cat.id,
      name: cat.name,
      category: cat.category,
      qty: 1,
      equipped: cat.category === 'armor' || cat.category === 'shield' || cat.category === 'weapon',
      armorType: cat.armorType || '',
      acBase: cat.acBase,
      acDexMax: cat.acDexMax,
      acBonus: cat.acBonus || 0,
      damage: cat.damage || '',
      damageType: cat.damageType || '',
      props: cat.props || '',
      weaponType: cat.weaponType || '',
      notes: cat.notes || '',
      cost: cat.cost || '',
      weight: cat.weight
    });
  }

  function calcAcFromInventory(inventory, scores, className) {
    const dex = abilityModNum(scores.dex != null ? scores.dex : 10);
    const con = abilityModNum(scores.con != null ? scores.con : 10);
    const wis = abilityModNum(scores.wis != null ? scores.wis : 10);
    const inv = inventory || [];
    const armor = inv.find(i => i.equipped && i.category === 'armor');
    const shield = inv.find(i => i.equipped && i.category === 'shield');
    let ac;
    if (armor && armor.acBase != null) {
      let dexBonus = dex;
      if (armor.acDexMax === 0) dexBonus = 0;
      else if (armor.acDexMax != null) dexBonus = Math.min(dex, Number(armor.acDexMax));
      ac = armor.acBase + dexBonus;
    } else if (className === 'Barbarian') {
      ac = 10 + dex + con;
    } else if (className === 'Monk') {
      ac = 10 + dex + wis;
    } else {
      ac = 10 + dex;
    }
    if (shield) ac += (shield.acBonus || 2);
    return ac;
  }

  function inventoryWeight(inventory) {
    return (inventory || []).reduce((s, i) => s + (Number(i.weight) || 0) * (Number(i.qty) || 1), 0);
  }

  function equipmentSearchHtml(query, category) {
    const q = (query || '').trim().toLowerCase();
    let list = getEquipmentList();
    if (category && category !== 'all') list = list.filter(e => e.category === category);
    if (q) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.category || '').includes(q) ||
        (e.weaponType || '').toLowerCase().includes(q) ||
        (e.armorType || '').toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q) ||
        (e.props || '').toLowerCase().includes(q)
      );
    }
    list = list.slice(0, 40);
    if (!list.length) return '<p class="muted small">No equipment matches.</p>';
    return `<ul class="equip-search-results">${list.map(e => {
      const detail = e.category === 'armor'
        ? `AC ${e.acBase}${e.acDexMax === 0 ? '' : e.acDexMax != null ? ' + Dex (max ' + e.acDexMax + ')' : ' + Dex'} · ${e.armorType}`
        : e.category === 'shield'
          ? `+${e.acBonus || 2} AC`
          : e.category === 'weapon'
            ? `${e.damage || ''} ${e.damageType || ''} · ${e.props || ''}`
            : (e.notes || e.cost || '');
      return `<li class="equip-result" data-equip-id="${escapeAttr(e.id)}">
        <div class="equip-result-main"><strong>${escapeHtml(e.name)}</strong> <span class="muted small">${escapeHtml(e.category)}${e.cost ? ' · ' + escapeHtml(e.cost) : ''}</span></div>
        <div class="muted small">${escapeHtml(detail)}</div>
        <button type="button" class="btn secondary btn-tiny add-equip" data-equip-id="${escapeAttr(e.id)}">Add</button>
      </li>`;
    }).join('')}</ul>`;
  }

  function inventoryListHtml(inventory) {
    const inv = inventory || [];
    if (!inv.length) return '<p class="muted small" id="m-inv-empty">Inventory is empty. Search and add items below.</p>';
    return `<ul class="inv-list" id="m-inv-list">${inv.map((it, idx) => {
      const canEquip = it.category === 'armor' || it.category === 'shield' || it.category === 'weapon';
      return `<li class="inv-item" data-uid="${escapeAttr(it.uid)}">
        <label class="inv-equip">${canEquip ? `<input type="checkbox" class="inv-equipped" data-uid="${escapeAttr(it.uid)}" ${it.equipped ? 'checked' : ''} title="Equipped"/>` : '<span class="inv-equip-spacer"></span>'}
        <span class="inv-name">${escapeHtml(it.name)}</span></label>
        <span class="muted small inv-meta">${escapeHtml(it.category)}${it.damage ? ' · ' + escapeHtml(it.damage) + ' ' + escapeHtml(it.damageType || '') : ''}${it.acBase != null ? ' · AC ' + it.acBase : ''}${it.acBonus ? ' · +' + it.acBonus + ' AC' : ''}</span>
        <input type="number" class="inv-qty" data-uid="${escapeAttr(it.uid)}" min="1" value="${it.qty}" title="Qty" />
        <button type="button" class="btn danger btn-tiny inv-remove" data-uid="${escapeAttr(it.uid)}">✕</button>
      </li>`;
    }).join('')}</ul>
    <p class="muted small">Weight: ${inventoryWeight(inv).toFixed(1)} lb · Check box to equip armor/shield/weapon (affects AC &amp; attacks).</p>`;
  }

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
  const POINT_BUY_COST = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9};
  const POINT_BUY_BUDGET = 27;
  const ABS = ['str','dex','con','int','wis','cha'];

  function getRaceBonuses(raceName) {
    const race = getPhbRaces().find(r => r.name === raceName);
    const b = { str:0, dex:0, con:0, int:0, wis:0, cha:0 };
    if (race && race.bonuses) {
      ABS.forEach(a => { b[a] = Number(race.bonuses[a]) || 0; });
    }
    return b;
  }

  function pointBuyCost(score) {
    const s = clamp(Number(score) || 8, 8, 15);
    return POINT_BUY_COST[s] != null ? POINT_BUY_COST[s] : 99;
  }

  function pointBuyTotal(bases) {
    return ABS.reduce((sum, a) => sum + pointBuyCost(bases[a]), 0);
  }

  function hitDieSides(className) {
    const cls = findPhbClass(className);
    if (!cls || !cls.hitDie) return 8;
    const m = String(cls.hitDie).match(/d(\d+)/i);
    return m ? parseInt(m[1], 10) : 8;
  }

  function suggestedHpMax(className, level, conScore) {
    const sides = hitDieSides(className);
    const lvl = clamp(Number(level) || 1, 1, 20);
    const conMod = abilityModNum(conScore);
    // Max at 1st, average rounded up each level after
    let hp = sides + conMod;
    const avg = Math.floor(sides / 2) + 1;
    for (let i = 2; i <= lvl; i++) hp += avg + conMod;
    return Math.max(1, hp);
  }

  function suggestedAc(className, scores) {
    const dex = abilityModNum(scores.dex);
    const con = abilityModNum(scores.con);
    const wis = abilityModNum(scores.wis);
    if (className === 'Barbarian') return 10 + dex + con;
    if (className === 'Monk') return 10 + dex + wis;
    // Default unarmored / light
    return 10 + dex;
  }

  function suggestedSpeed(raceName, className) {
    const race = getPhbRaces().find(r => r.name === raceName);
    let spd = (race && race.speed) ? race.speed : 30;
    if (className === 'Monk') {/* unarmored movement not auto */}
    return `${spd} ft.`;
  }

  function abilityTotalsFromBases(bases, raceName) {
    const bon = getRaceBonuses(raceName);
    const totals = {};
    ABS.forEach(a => { totals[a] = (Number(bases[a]) || 10) + (bon[a] || 0); });
    return totals;
  }

  function abilityMethodBarHtml(method) {
    const m = method || 'manual';
    return `
      <div class="ability-method-bar">
        <label class="method-opt"><input type="radio" name="m-ab-method" value="manual" ${m==='manual'?'checked':''}/> Manual</label>
        <label class="method-opt"><input type="radio" name="m-ab-method" value="standard" ${m==='standard'?'checked':''}/> Standard Array</label>
        <label class="method-opt"><input type="radio" name="m-ab-method" value="pointbuy" ${m==='pointbuy'?'checked':''}/> Point Buy (27)</label>
        <span class="pointbuy-status muted small" id="m-pb-status"></span>
      </div>
      <div class="standard-array-row hidden" id="m-std-row">
        <div class="std-pool-label muted small">Click an ability score to assign the next value (highest → lowest). Dimmed values are already used.</div>
        <div class="std-pool" id="m-std-pool">
          ${STANDARD_ARRAY.map(v => `<button type="button" class="std-chip" data-val="${v}" disabled>${v}</button>`).join('')}
        </div>
        <button type="button" class="btn secondary btn-tiny" id="m-std-reset">Reset Array</button>
      </div>`;
  }

const FEATURE_SECTION = {
    race: '— Race Traits —',
    path: '— Moon Path —',
    umbrarian: '— Umbrarian Template —'
  };

  function getFeatureSection(text, marker) {
    if (!text || !marker) return '';
    const idx = text.indexOf(marker);
    if (idx < 0) return '';
    const rest = text.slice(idx);
    // end at next known section marker
    let end = rest.length;
    for (const m of Object.values(FEATURE_SECTION)) {
      if (m === marker) continue;
      const j = rest.indexOf(m, marker.length);
      if (j > 0 && j < end) end = j;
    }
    return rest.slice(0, end).trim();
  }

  function setFeatureSection(text, marker, bodyLines) {
    const base = String(text || '');
    // Remove existing section for this marker
    let without = base;
    const idx = without.indexOf(marker);
    if (idx >= 0) {
      let end = without.length;
      const rest = without.slice(idx);
      for (const m of Object.values(FEATURE_SECTION)) {
        if (m === marker) continue;
        const j = rest.indexOf(m, marker.length);
        if (j > 0 && j < end - idx) end = idx + j;
      }
      without = (without.slice(0, idx) + without.slice(end)).trim();
    }
    if (!bodyLines || (Array.isArray(bodyLines) && !bodyLines.length)) {
      return without;
    }
    const block = Array.isArray(bodyLines) ? [marker, ...bodyLines].join('\n') : `${marker}\n${bodyLines}`;
    return (without ? without + '\n\n' : '') + block;
  }

  function rebuildRaceFeatureBlock(raceName) {
    const race = getPhbRaces().find(r => r.name === raceName);
    if (!race || !race.traits || !race.traits.length) return null;
    const lines = [`${race.name}${race.world ? ' (' + race.world + ')' : ''}`];
    race.traits.forEach(t => lines.push(`${t.name}: ${t.text}`));
    return lines;
  }


  
  
  function wireSpellPicker() {
    const results = $('#m-spell-results');
    const known = $('#m-spell-known');
    const search = $('#m-spell-search');
    const levelF = $('#m-spell-level-filter');
    const idsEl = $('#m-spell-ids');
    if (!known) return;

    function getIds() {
      const raw = (idsEl?.value || '').split(',').map(s => s.trim()).filter(Boolean);
      return raw;
    }
    function setIds(ids) {
      if (idsEl) idsEl.value = ids.join(',');
      // sync text fields for export compatibility
      const spells = ids.map(id => findSpell(id)).filter(Boolean);
      const cantrips = spells.filter(s => s.level === 0).map(s => s.name);
      const leveled = spells.filter(s => s.level > 0).map(s => `${s.name} (${s.level === 1 ? '1st' : s.level === 2 ? '2nd' : s.level === 3 ? '3rd' : s.level + 'th'})`);
      if ($('#m-cantrips')) $('#m-cantrips').value = cantrips.join(', ');
      if ($('#m-spells')) $('#m-spells').value = leveled.join('\n');
      renderKnown();
    }
    function renderKnown() {
      const ids = getIds();
      if (!ids.length) {
        known.innerHTML = '<p class="muted small">No spells selected. Search the library and click Add.</p>';
        return;
      }
      known.innerHTML = `<div class="spell-card-grid">${ids.map(id => {
        const sp = findSpell(id);
        return sp ? spellCardHtml(sp, { removable: true }) : '';
      }).join('')}</div>`;
      known.querySelectorAll('.spell-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          setIds(getIds().filter(id => id !== btn.dataset.spellId));
        });
      });
    }
    function refreshResults() {
      if (!results) return;
      const cname = $('#m-class')?.value || '';
      const q = (search?.value || '').trim().toLowerCase();
      const lf = levelF?.value || 'all';
      let list = spellsForClass(cname);
      if (lf !== 'all') list = list.filter(s => String(s.level) === lf);
      if (q) list = list.filter(s => s.name.toLowerCase().includes(q) || (s.school || '').toLowerCase().includes(q) || (s.summary || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
      list = list.slice(0, 30);
      const have = new Set(getIds());
      if (!list.length) {
        results.innerHTML = '<p class="muted small">No spells match.</p>';
        return;
      }
      results.innerHTML = `<ul class="spell-search-list">${list.map(s => {
        const lvl = s.level === 0 ? 'Cantrip' : `L${s.level}`;
        const added = have.has(s.id);
        return `<li class="spell-search-item">
          <div><strong>${escapeHtml(s.name)}</strong> <span class="muted small">${lvl} · ${escapeHtml(s.school)}</span>
          <div class="muted small">${escapeHtml((s.description || s.summary || '').slice(0, 140))}${(s.description || s.summary || '').length > 140 ? '…' : ''}</div></div>
          <button type="button" class="btn secondary btn-tiny spell-add" data-spell-id="${escapeAttr(s.id)}" ${added ? 'disabled' : ''}>${added ? 'Added' : 'Add'}</button>
        </li>`;
      }).join('')}</ul>`;
      results.querySelectorAll('.spell-add').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.spellId;
          const ids = getIds();
          if (!ids.includes(id)) setIds(ids.concat(id));
          refreshResults();
        });
      });
    }
    search?.addEventListener('input', refreshResults);
    levelF?.addEventListener('change', refreshResults);
    // init from character
    if (idsEl && !idsEl.value) {
      // try recover
      const recovered = parseKnownSpellIds({
        spellIds: [],
        cantrips: $('#m-cantrips')?.value,
        spells: $('#m-spells')?.value
      });
      if (recovered.length) idsEl.value = recovered.join(',');
    }
    renderKnown();
    refreshResults();
    window.__refreshSpellPicker = refreshResults;
  }

function wireAvatarPicker() {
    const file = $('#m-avatar-file');
    const uploadBtn = $('#m-avatar-upload');
    const clearBtn = $('#m-avatar-clear');
    const preview = $('#m-avatar-preview');
    const nameInp = $('#m-name');
    uploadBtn?.addEventListener('click', () => file?.click());
    file?.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      if (f.size > 1.5 * 1024 * 1024) {
        toast('Image too large (max ~1.5 MB)');
        file.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        // Downscale via canvas for storage
        const img = new Image();
        img.onload = () => {
          const max = 256;
          let w = img.width, h = img.height;
          if (w > max || h > max) {
            const r = Math.min(max / w, max / h);
            w = Math.round(w * r);
            h = Math.round(h * r);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const data = canvas.toDataURL('image/jpeg', 0.85);
          window.__draftAvatar = data;
          const avData = $('#m-avatar-data');
          if (avData) avData.value = data;
          if (preview) {
            preview.classList.add('has-avatar');
            preview.innerHTML = `<img src="${data}" alt="" class="cs-avatar-img" />`;
          }
          clearBtn?.classList.remove('hidden');
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    });
    clearBtn?.addEventListener('click', () => {
      window.__draftAvatar = '';
      const avData = $('#m-avatar-data');
      if (avData) avData.value = '';
      if (file) file.value = '';
      const letter = (nameInp?.value || '?').charAt(0).toUpperCase() || '?';
      if (preview) {
        preview.classList.remove('has-avatar');
        preview.innerHTML = `<span id="m-avatar-letter">${escapeHtml(letter)}</span>`;
      }
      clearBtn.classList.add('hidden');
    });
    nameInp?.addEventListener('input', () => {
      if (window.__draftAvatar) return;
      const letter = (nameInp.value || '?').charAt(0).toUpperCase() || '?';
      const span = $('#m-avatar-letter');
      if (span) span.textContent = letter;
      else if (preview && !preview.classList.contains('has-avatar')) {
        preview.innerHTML = `<span id="m-avatar-letter">${escapeHtml(letter)}</span>`;
      }
    });
  }

function wireInventoryUI() {
    const display = $('#m-inv-display');
    const results = $('#m-equip-results');
    const search = $('#m-equip-search');
    const cat = $('#m-equip-cat');
    if (!display) return;

    function sync() {
      if (!window.__draftInventory) window.__draftInventory = [];
      display.innerHTML = inventoryListHtml(window.__draftInventory);
      // refresh AC from equipment
      const acEl = $('#m-ac');
      if (acEl) {
        delete acEl.dataset.manual;
        const totals = {};
        ['str','dex','con','int','wis','cha'].forEach(a => {
          totals[a] = parseInt($('#m-total-' + a)?.textContent, 10) || parseInt($('#m-' + a)?.value, 10) || 10;
        });
        acEl.value = calcAcFromInventory(window.__draftInventory, totals, $('#m-class')?.value || '');
      }
      // Rebuild attacks from equipped weapons if not manual
      const attacksInp = $('#m-attacks');
      if (attacksInp && attacksInp.dataset.manual !== '1') {
        const equippedWeapons = (window.__draftInventory || []).filter(i => i.equipped && i.category === 'weapon');
        if (equippedWeapons.length) {
          const lvl = clamp(parseInt($('#m-level')?.value, 10) || 1, 1, 20);
          const pb = parseInt($('#m-prof')?.value, 10) || 2;
          const str = abilityModNum(parseInt($('#m-total-str')?.textContent, 10) || 10);
          const dex = abilityModNum(parseInt($('#m-total-dex')?.textContent, 10) || 10);
          const lines = equippedWeapons.map(w => {
            const finesse = (w.props || '').toLowerCase().includes('finesse');
            const ranged = (w.weaponType || '').includes('ranged') || (w.props || '').toLowerCase().includes('ammunition');
            const mod = (finesse || ranged) ? Math.max(str, dex) : str;
            const modDmg = mod >= 0 ? `+${mod}` : `${mod}`;
            const atk = mod + pb;
            const atkStr = atk >= 0 ? `+${atk}` : `${atk}`;
            return `${w.name}: ${atkStr} to hit, ${w.damage || '?'}${modDmg} ${w.damageType || ''}`.trim();
          });
          attacksInp.value = lines.join('\n');
        }
      }
      bindInvItemHandlers();
    }

    function bindInvItemHandlers() {
      display.querySelectorAll('.inv-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const uid_ = btn.dataset.uid;
          window.__draftInventory = window.__draftInventory.filter(i => i.uid !== uid_);
          sync();
        });
      });
      display.querySelectorAll('.inv-equipped').forEach(cb => {
        cb.addEventListener('change', () => {
          const uid_ = cb.dataset.uid;
          const item = window.__draftInventory.find(i => i.uid === uid_);
          if (!item) return;
          item.equipped = cb.checked;
          // only one armor / one shield
          if (item.equipped && item.category === 'armor') {
            window.__draftInventory.forEach(i => { if (i.category === 'armor' && i.uid !== uid_) i.equipped = false; });
          }
          if (item.equipped && item.category === 'shield') {
            window.__draftInventory.forEach(i => { if (i.category === 'shield' && i.uid !== uid_) i.equipped = false; });
          }
          sync();
        });
      });
      display.querySelectorAll('.inv-qty').forEach(inp => {
        inp.addEventListener('change', () => {
          const item = window.__draftInventory.find(i => i.uid === inp.dataset.uid);
          if (item) item.qty = Math.max(1, parseInt(inp.value, 10) || 1);
          sync();
        });
      });
    }

    function refreshSearch() {
      if (results) results.innerHTML = equipmentSearchHtml(search?.value || '', cat?.value || 'all');
      results?.querySelectorAll('.add-equip').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.equipId;
          const catItem = getEquipmentList().find(e => e.id === id);
          if (!catItem) return;
          const invItem = catalogItemToInventory(catItem);
          // stacking gear by id
          if (catItem.category === 'gear' || catItem.category === 'tool') {
            const existing = window.__draftInventory.find(i => i.id === id && !i.equipped);
            if (existing) { existing.qty += 1; sync(); return; }
          }
          window.__draftInventory.push(invItem);
          sync();
        });
      });
    }

    search?.addEventListener('input', refreshSearch);
    cat?.addEventListener('change', refreshSearch);
    refreshSearch();
    sync();
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
    const subclassInp = $('#m-subclass');
    const attacksInp = $('#m-attacks');
    const pathWrap = $('#m-moon-path-wrap');
    const pathSel = $('#m-moon-path');

    function basesFromForm() {
      const b = {};
      ABS.forEach(a => { b[a] = parseInt($('#m-' + a)?.value, 10) || 10; });
      return b;
    }
    function scoresFromForm() {
      return abilityTotalsFromBases(basesFromForm(), raceSel?.value || '');
    }
    function refreshAbilityDisplay() {
      const raceName = raceSel?.value || '';
      const bon = getRaceBonuses(raceName);
      const bases = basesFromForm();
      const totals = abilityTotalsFromBases(bases, raceName);
      ABS.forEach(a => {
        const rEl = $('#m-rbon-' + a);
        const tEl = $('#m-total-' + a);
        const mEl = $('#m-mod-' + a);
        if (rEl) rEl.textContent = bon[a] ? '+' + bon[a] : '—';
        if (tEl) tEl.textContent = String(totals[a]);
        if (mEl) mEl.textContent = modStr(totals[a]);
      });
      // Point buy status
      const method = document.querySelector('input[name="m-ab-method"]:checked')?.value || 'manual';
      const pbStatus = $('#m-pb-status');
      if (pbStatus) {
        if (method === 'pointbuy') {
          const spent = pointBuyTotal(bases);
          const left = POINT_BUY_BUDGET - spent;
          pbStatus.textContent = `Points: ${spent}/${POINT_BUY_BUDGET} (${left} left)` + (left < 0 ? ' — over budget!' : '');
          pbStatus.classList.toggle('error-text', left < 0);
        } else if (method === 'standard') {
          const used = ABS.map(a => bases[a]).sort((x,y)=>y-x);
          const ok = STANDARD_ARRAY.every((v,i) => used[i] === v);
          pbStatus.textContent = ok ? 'Standard array assigned' : 'Assign each of 15,14,13,12,10,8 once';
        } else {
          pbStatus.textContent = '';
        }
      }
      // Suggest HP / AC
      const cname = classSel?.value || '';
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 20);
      const hpEl = $('#m-hpmax');
      const acEl = $('#m-ac');
      const spdEl = $('#m-speed');
      if (hpEl && !hpEl.dataset.manual) {
        hpEl.value = suggestedHpMax(cname, lvl, totals.con);
        const hpCur = $('#m-hp');
        if (hpCur && !hpCur.dataset.manual) hpCur.value = hpEl.value;
      }
      if (acEl && !acEl.dataset.manual) {
        const inv = window.__draftInventory || [];
        acEl.value = calcAcFromInventory(inv, totals, cname);
      }
      if (spdEl && !spdEl.dataset.manual && raceName) {
        spdEl.value = suggestedSpeed(raceName, cname);
      }
      // Auto-select Shard ability from highest mental score when Umbrarian is active
      if ($('#m-umbrarian')?.checked) {
        const mental = [
          { a: 'INT', v: totals.int },
          { a: 'WIS', v: totals.wis },
          { a: 'CHA', v: totals.cha }
        ].sort((x, y) => y.v - x.v);
        const sel = $('#m-umb-ability');
        if (sel && !sel.dataset.manual) {
          sel.value = mental[0].a;
        }
        const hint = $('#m-umb-hint');
        if (hint) {
          const pb = parseInt($('#m-prof')?.value, 10) || 2;
          const mod = abilityModNum(mental[0].v);
          hint.textContent = `Shard DC ${8 + pb + mod} (${mental[0].a}) · auto from highest mental score. Traits & gifts apply to Features.`;
        }
      }
      if (typeof refreshSpellDc === 'function') refreshSpellDc();
    }
    function applyScoreMethod(method) {
      const stdRow = $('#m-std-row');
      if (stdRow) stdRow.classList.toggle('hidden', method !== 'standard');
      const grid = $('#ability-grid');
      if (grid) grid.classList.toggle('std-assign-mode', method === 'standard');
      ABS.forEach(a => {
        const el = $('#m-' + a);
        if (el) el.readOnly = method === 'standard';
      });
      if (method === 'standard') {
        // Do not auto-assign — clear bases so user clicks to place 15→8
        window.__stdNextIndex = 0;
        window.__stdAssigned = {};
        ABS.forEach(a => {
          const el = $('#m-' + a);
          if (el) el.value = 8;
        });
        updateStdPoolUI();
      } else if (method === 'pointbuy') {
        ABS.forEach(a => {
          const el = $('#m-' + a);
          if (el) {
            let v = parseInt(el.value, 10) || 10;
            el.value = clamp(v, 8, 15);
          }
        });
      }
      refreshAbilityDisplay();
      refreshAttacks(true);
    }

    function updateStdPoolUI() {
      const assigned = window.__stdAssigned || {};
      const usedVals = Object.values(assigned);
      const nextIdx = window.__stdNextIndex || 0;
      const pool = $('#m-std-pool');
      if (pool) {
        pool.querySelectorAll('.std-chip').forEach(chip => {
          const v = parseInt(chip.dataset.val, 10);
          const used = usedVals.includes(v);
          const isNext = !used && STANDARD_ARRAY[nextIdx] === v;
          chip.classList.toggle('used', used);
          chip.classList.toggle('next', isNext);
          chip.disabled = true;
        });
      }
      // Make ability boxes clickable targets
      ABS.forEach(a => {
        const box = document.querySelector(`.ability-box[data-ab="${a}"]`);
        if (!box) return;
        box.classList.toggle('std-target', !(assigned[a]));
        box.classList.toggle('std-filled', !!assigned[a]);
      });
      const pbStatus = $('#m-pb-status');
      if (pbStatus) {
        if (nextIdx >= STANDARD_ARRAY.length) pbStatus.textContent = 'Standard array complete';
        else pbStatus.textContent = `Next: assign ${STANDARD_ARRAY[nextIdx]} — click an ability`;
      }
    }

    function assignStdToAbility(ab) {
      if ((document.querySelector('input[name="m-ab-method"]:checked')?.value) !== 'standard') return;
      if (!window.__stdAssigned) window.__stdAssigned = {};
      if (window.__stdAssigned[ab] != null) return; // already assigned
      const idx = window.__stdNextIndex || 0;
      if (idx >= STANDARD_ARRAY.length) return;
      const val = STANDARD_ARRAY[idx];
      window.__stdAssigned[ab] = val;
      window.__stdNextIndex = idx + 1;
      const el = $('#m-' + ab);
      if (el) el.value = val;
      updateStdPoolUI();
      refreshAbilityDisplay();
      refreshAttacks(true);
    }

    function resetStdArray() {
      window.__stdNextIndex = 0;
      window.__stdAssigned = {};
      ABS.forEach(a => {
        const el = $('#m-' + a);
        if (el) el.value = 8;
      });
      updateStdPoolUI();
      refreshAbilityDisplay();
      refreshAttacks(true);
    }

    function refreshAttacks(force) {
      if (!attacksInp) return;
      if (!force && attacksInp.dataset.manual === '1' && attacksInp.value.trim()) return;
      const cname = classSel?.value || '';
      if (!cname) return;
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 20);
      const pb = parseInt(profInp?.value, 10) || (window.PHB_PROF_BY_LEVEL?.[lvl] || 2);
      const built = buildAttacksForClass(cname, lvl, scoresFromForm(), pb);
      if (built) {
        attacksInp.value = built;
        attacksInp.dataset.manual = '0';
      }
    }

    function applyMoonPathToFeatures() {
      if (!features || !pathSel) return;
      const path = findMoonPath(pathSel.value);
      if (subclassInp) {
        subclassInp.value = path ? path.name : (subclassInp.value.startsWith('Path of') ? '' : subclassInp.value);
      }
      if (path && worldSel && (path.world === 'Luna' || !worldSel.value)) {
        // Luna path does not force a world; leave world as-is unless empty is fine
      } else if (path && worldSel && path.world && path.world !== 'Luna') {
        worldSel.value = path.world;
      }
      if (!path) {
        features.value = setFeatureSection(features.value, FEATURE_SECTION.path, null);
        return;
      }
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 20);
      const lines = [`${path.name} (${path.world}): ${path.summary}`];
      (path.features || []).filter(f => f.lvl <= lvl).forEach(f => {
        lines.push(`L${f.lvl} ${f.name}: ${f.text}`);
      });
      (path.features || []).filter(f => f.lvl > lvl).forEach(f => {
        lines.push(`(L${f.lvl}) ${f.name}: locked until level ${f.lvl}`);
      });
      features.value = setFeatureSection(features.value, FEATURE_SECTION.path, lines);
    }

    function refreshRaceTraits() {
      if (!features) return;
      const rname = raceSel ? raceSel.value : '';
      const race = getPhbRaces().find(r => r.name === rname);
      if (race && race.world && worldSel && !worldSel.value) worldSel.value = race.world;
      const lines = rebuildRaceFeatureBlock(rname);
      features.value = setFeatureSection(features.value, FEATURE_SECTION.race, lines);
    }


    function refreshSpellSection() {
      const sec = $('#m-spell-section');
      if (!sec) return;
      const cname = classSel?.value || '';
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 20);
      const type = getCasterType(cname);
      // Rebuild editor when class/level changes
      const fakeCh = {
        class: cname,
        level: lvl,
        spellcastingAbility: $('#m-spell-ab')?.value || defaultSpellAbility(cname),
        spellSlotsUsed: collectSpellSlotsUsed(),
        cantrips: $('#m-cantrips')?.value || '',
        spells: $('#m-spells')?.value || ''
      };
      sec.innerHTML = `<label class="section-label">Spellcasting</label>${spellSlotsEditorHtml(fakeCh)}`;
      refreshSpellDc();
      wireSpellPicker();
    }
    function refreshSpellDc() {
      const ab = $('#m-spell-ab')?.value || defaultSpellAbility(classSel?.value || '');
      const totals = scoresFromForm();
      const pb = parseInt(profInp?.value, 10) || 2;
      const info = computeSpellDcAtk(ab, totals, pb);
      const dcEl = $('#m-spell-dc');
      const atkEl = $('#m-spell-atk');
      if (dcEl) dcEl.value = String(info.dc);
      if (atkEl) atkEl.value = (info.atk >= 0 ? '+' : '') + info.atk;
    }

    function refreshClassUI() {
      const cname = classSel ? classSel.value : '';
      if (skillBox) skillBox.innerHTML = skillPickerHtml(cname, []);
      if (progBox) {
        let html = progressionTableHtml(cname);
        if (cname === 'Moon Guardian') {
          const path = findMoonPath(pathSel?.value);
          if (path) {
            html += `<div class="class-abilities"><div class="detail-label">${escapeHtml(path.name)} Features</div><ul class="trait-list">`;
            (path.features || []).forEach(f => {
              html += `<li><strong>L${f.lvl} — ${escapeHtml(f.name)}.</strong> ${escapeHtml(f.text)}</li>`;
            });
            html += `</ul><p class="muted small">${escapeHtml(path.summary || '')}</p></div>`;
          }
        }
        progBox.innerHTML = html;
      }
      if (pathWrap) pathWrap.classList.toggle('hidden', cname !== 'Moon Guardian');
      const cls = findPhbClass(cname);
      if (cls && $('#m-saves') && !$('#m-saves').value) $('#m-saves').value = cls.saves;
      // Reset auto HP/AC when class changes unless user locked them
      const hpEl = $('#m-hpmax');
      const acEl = $('#m-ac');
      if (hpEl) delete hpEl.dataset.manual;
      if (acEl) delete acEl.dataset.manual;
      refreshAbilityDisplay();
      refreshAttacks(true);
      refreshSpellSection();
    }

    function refreshProf() {
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 20);
      if (profInp && window.PHB_PROF_BY_LEVEL) {
        profInp.value = window.PHB_PROF_BY_LEVEL[lvl] || 2;
      }
      refreshAttacks(true);
      if (classSel?.value === 'Moon Guardian') applyMoonPathToFeatures();
      if (typeof refreshSpellSection === 'function') refreshSpellSection();
      if (typeof refreshSpellDc === 'function') refreshSpellDc();
    }

    classSel?.addEventListener('change', refreshClassUI);
    levelInp?.addEventListener('change', refreshProf);
    levelInp?.addEventListener('input', refreshProf);
    raceSel?.addEventListener('change', refreshRaceTraits);
    pathSel?.addEventListener('change', () => {
      applyMoonPathToFeatures();
      refreshClassUI();
    });
    attacksInp?.addEventListener('input', () => { attacksInp.dataset.manual = '1'; });
    ['m-str','m-dex','m-con','m-int','m-wis','m-cha'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        const method = document.querySelector('input[name="m-ab-method"]:checked')?.value || 'manual';
        if (method === 'pointbuy') {
          el.value = clamp(parseInt(el.value, 10) || 8, 8, 15);
        }
        refreshAbilityDisplay();
        refreshAttacks(true);
      });
      el.addEventListener('change', () => {
        refreshAbilityDisplay();
        refreshAttacks(true);
      });
    });
    document.querySelectorAll('input[name="m-ab-method"]').forEach(r => {
      r.addEventListener('change', () => applyScoreMethod(r.value));
    });
    // Standard array: click ability box / label to assign next score
    ABS.forEach(a => {
      const box = document.querySelector(`.ability-box[data-ab="${a}"]`);
      if (!box) return;
      box.addEventListener('click', (e) => {
        if ((document.querySelector('input[name="m-ab-method"]:checked')?.value) !== 'standard') return;
        // ignore pure input typing when not readonly path
        assignStdToAbility(a);
      });
    });
    $('#m-std-reset')?.addEventListener('click', (e) => {
      e.preventDefault();
      resetStdArray();
    });
    // If already on standard when opening edit, init pool UI without wiping saved scores
    if ((document.querySelector('input[name="m-ab-method"]:checked')?.value) === 'standard') {
      const bases = basesFromForm();
      const vals = ABS.map(a => bases[a]);
      const sorted = [...vals].sort((x,y)=>y-x);
      const matches = STANDARD_ARRAY.every((v,i) => sorted[i] === v);
      if (matches && new Set(vals).size === 6) {
        window.__stdAssigned = {};
        ABS.forEach(a => { window.__stdAssigned[a] = bases[a]; });
        window.__stdNextIndex = 6;
        ABS.forEach(a => { const el = $('#m-' + a); if (el) el.readOnly = true; });
        $('#m-std-row')?.classList.remove('hidden');
        $('#ability-grid')?.classList.add('std-assign-mode');
        updateStdPoolUI();
      }
    }
    // Mark HP/AC/speed manual if user edits
    ['m-hp','m-hpmax','m-ac','m-speed'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function() { this.dataset.manual = '1'; });
    });
    // Race change also refreshes ability totals + HP/AC
    raceSel?.addEventListener('change', () => {
      refreshAbilityDisplay();
      refreshAttacks(true);
    });
    refreshAbilityDisplay();
    refreshClassUI();
  }

  async function promptCharacter(existing = null) {
    const c = getActive();
    if (!c) return;

    const ch = existing ? normalizeCharacter(existing) : normalizeCharacter({ level: 1, str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, ac: 10, speed: '30 ft.', profBonus: 2 });
    const selectedSkills = (ch.skills || '').split(/[,;]+/).map(s => s.trim().split(/\s+\+/)[0].trim()).filter(Boolean);

    const body = `
      <div class="sheet-section">
        <div class="form-row avatar-row">
          <div class="field avatar-field">
            <label>Avatar</label>
            <div class="avatar-picker">
              <div id="m-avatar-preview" class="cs-portrait-ring avatar-preview ${ch.avatar ? 'has-avatar' : ''}">
                ${ch.avatar ? `<img src="${ch.avatar}" alt="" class="cs-avatar-img" />` : `<span id="m-avatar-letter">${escapeHtml((ch.name || '?').charAt(0).toUpperCase())}</span>`}
              </div>
              <div class="avatar-controls">
                <input type="file" id="m-avatar-file" accept="image/*" hidden />
                <button type="button" class="btn secondary btn-tiny" id="m-avatar-upload">Upload image</button>
                <button type="button" class="btn danger btn-tiny ${ch.avatar ? '' : 'hidden'}" id="m-avatar-clear">Remove</button>
                <p class="muted small">Optional. Falls back to the initial monogram if empty.</p>
              </div>
              <input type="hidden" id="m-avatar-data" value="" />
            </div>
          </div>
          <div class="field"><label>Character Name</label><input type="text" id="m-name" value="${escapeAttr(ch.name)}" placeholder="Character name" /></div>
          <div class="field"><label>Player</label><input type="text" id="m-player" value="${escapeAttr(ch.player)}" placeholder="Player name" /></div>
        </div>
        <div class="form-row triple">
          <div class="field"><label>Class</label>
            <select id="m-class">${classOptionsHtml(ch.class)}</select>
          </div>
          <div class="field"><label>Subclass</label><input type="text" id="m-subclass" value="${escapeAttr(ch.subclass)}" placeholder="Optional / Moon Path" /></div>
          <div class="field"><label>Level</label><input type="number" id="m-level" min="1" max="20" value="${ch.level}" /></div>
        </div>
        <div class="form-row ${ch.class === 'Moon Guardian' || (ch.subclass||'').includes('Path of') ? '' : 'hidden'}" id="m-moon-path-wrap">
          <div class="field"><label>Moon Guardian Path</label>
            <select id="m-moon-path">${moonPathOptionsHtml(ch.subclass)}</select>
          </div>
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
          <div class="field"><label>Corruption (0–6)</label><input type="number" id="m-corruption" min="0" max="6" value="${ch.corruption}" title="Umbrarian Corruption Track (DMG)" /></div>
        </div>
        <div class="umbrarian-box">
          <label class="checkbox-row">
            <input type="checkbox" id="m-umbrarian" ${ch.isUmbrarian ? 'checked' : ''} />
            <span><strong>Apply Umbrarian template</strong> — host of a Dark Shard (DMG). Not a race; stacks with any ancestry.</span>
          </label>
          <div id="m-umbrarian-fields" class="umbrarian-fields ${ch.isUmbrarian ? '' : 'hidden'}">
            <div class="form-row triple">
              <div class="field"><label>Stage</label>
                <select id="m-umb-stage">
                  <option value="dormant" ${ch.umbrarianStage==='dormant'?'selected':''}>Dormant</option>
                  <option value="awakened" ${(!ch.umbrarianStage||ch.umbrarianStage==='awakened')?'selected':''}>Awakened</option>
                  <option value="ascendant" ${ch.umbrarianStage==='ascendant'?'selected':''}>Ascendant</option>
                </select>
              </div>
              <div class="field"><label>Dark Shard / Sword</label>
                <select id="m-umb-shard">
                  <option value="">— Select —</option>
                  ${(window.UMBRARIANS?.shards||[]).map(s => `<option value="${s.name}" ${ch.shard===s.name?'selected':''}>${s.name} (${s.world})</option>`).join('')}
                </select>
              </div>
              <div class="field"><label>Shard Ability (DC)</label>
                <select id="m-umb-ability">
                  <option value="INT" ${ch.shardAbility==='INT'?'selected':''}>Intelligence</option>
                  <option value="WIS" ${(!ch.shardAbility||ch.shardAbility==='WIS')?'selected':''}>Wisdom</option>
                  <option value="CHA" ${ch.shardAbility==='CHA'?'selected':''}>Charisma</option>
                </select>
              </div>
            </div>
            <p class="muted small" id="m-umb-hint">Shard DC uses your highest among INT/WIS/CHA (auto). Adds traits & gifts to Features.</p>
          </div>
        </div>
      </div>
      <div class="sheet-section">
        <label class="section-label">Class Progression</label>
        <div id="m-class-prog">${progressionTableHtml(ch.class)}</div>
      </div>
            <div class="sheet-section">
        <label class="section-label">Ability Scores</label>
        ${abilityMethodBarHtml(ch.scoreMethod || 'manual')}
        <div class="ability-grid" id="ability-grid">${abilityRowHtml('m', ch)}</div>
        <p class="muted small">Totals include racial bonuses. Mods use the total score.</p>
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
        <div class="sheet-section" id="m-spell-section">
          <label class="section-label">Spellcasting</label>
          ${spellSlotsEditorHtml(ch)}
        </div>
        <div class="field"><label>Features &amp; Traits</label><textarea id="m-features" rows="3" placeholder="Class features, racial traits, feats…">${escapeHtml(ch.features)}</textarea></div>
        <div class="field full-width">
          <label>Inventory &amp; Equipment</label>
          <div id="m-inventory-panel" class="inventory-panel">
            <div id="m-inv-display">${inventoryListHtml(ch.inventory || [])}</div>
            <div class="equip-browser">
              <div class="form-row">
                <div class="field"><label>Quick Search</label>
                  <input type="search" id="m-equip-search" placeholder="Search armor, weapons, gear…" autocomplete="off" />
                </div>
                <div class="field"><label>Category</label>
                  <select id="m-equip-cat">
                    <option value="all">All</option>
                    <option value="armor">Armor</option>
                    <option value="shield">Shields</option>
                    <option value="weapon">Weapons</option>
                    <option value="gear">Adventuring Gear</option>
                    <option value="tool">Tools</option>
                  </select>
                </div>
              </div>
              <div id="m-equip-results" class="equip-results">${equipmentSearchHtml('', 'all')}</div>
            </div>
            <textarea id="m-equipment" rows="2" class="hidden" placeholder="Legacy notes">${escapeHtml(ch.equipment)}</textarea>
          </div>
        </div>
        <div class="field"><label>Notes (bonds, ideals, flaws, status)</label><textarea id="m-notes" rows="2">${escapeHtml(ch.notes)}</textarea></div>
      </div>
    `;

    const confirmed = await openModal({
      title: existing ? `Character Sheet — ${ch.name || 'Edit'}` : 'New Character Sheet',
      bodyHtml: body,
      wide: true,
      xwide: true,
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
          avatar: ($('#m-avatar-data')?.value || window.__draftAvatar || ''),
          type: existing?.type || (playerVal === 'NPC' ? 'ally' : 'pc'),
          class: $('#m-class').value.trim(),
          subclass: $('#m-subclass').value.trim(),
          level,
          race: $('#m-race').value.trim(),
          background: $('#m-background').value.trim(),
          alignment: $('#m-alignment').value.trim(),
          world: $('#m-world').value,
          corruption: clamp(parseInt($('#m-corruption').value, 10) || 0, 0, 6),
          isUmbrarian: !!$('#m-umbrarian')?.checked,
          umbrarianStage: $('#m-umb-stage')?.value || '',
          shard: $('#m-umb-shard')?.value || '',
          shardAbility: ($('#m-umb-ability')?.value) || bestShardAbility({
            int: parseInt($('#m-total-int')?.textContent, 10) || 10,
            wis: parseInt($('#m-total-wis')?.textContent, 10) || 10,
            cha: parseInt($('#m-total-cha')?.textContent, 10) || 10
          }),
          str: parseInt($('#m-total-str')?.textContent, 10) || parseInt($('#m-str').value, 10) || 10,
          dex: parseInt($('#m-total-dex')?.textContent, 10) || parseInt($('#m-dex').value, 10) || 10,
          con: parseInt($('#m-total-con')?.textContent, 10) || parseInt($('#m-con').value, 10) || 10,
          int: parseInt($('#m-total-int')?.textContent, 10) || parseInt($('#m-int').value, 10) || 10,
          wis: parseInt($('#m-total-wis')?.textContent, 10) || parseInt($('#m-wis').value, 10) || 10,
          cha: parseInt($('#m-total-cha')?.textContent, 10) || parseInt($('#m-cha').value, 10) || 10,
          hp: parseInt($('#m-hp').value, 10) || 0,
          hpMax: parseInt($('#m-hpmax').value, 10) || 0,
          ac: parseInt($('#m-ac').value, 10) || 10,
          speed: $('#m-speed').value.trim() || '30 ft.',
          profBonus: parseInt($('#m-prof').value, 10) || profBonusForLevel(level),
          saves: $('#m-saves').value.trim(),
          skills: skillsText,
          attacks: $('#m-attacks').value.trim(),
          features: $('#m-features').value.trim(),
          spellcastingAbility: $('#m-spell-ab')?.value || '',
          cantrips: $('#m-cantrips')?.value.trim() || '',
          spells: $('#m-spells')?.value.trim() || '',
          spellSlotsUsed: collectSpellSlotsUsed(),
          equipment: ($('#m-equipment')?.value || '').trim() || (window.__draftInventory || []).map(i => i.name + (i.qty > 1 ? ' ×' + i.qty : '') + (i.equipped ? ' (equipped)' : '')).join(', '),
          inventory: (window.__draftInventory || []).map(normalizeInventoryItem),
          notes: $('#m-notes').value.trim()
        };
        if (existing) Object.assign(existing, data);
        else c.party.push({ id: uid(), ...data });
        c.updatedAt = new Date().toISOString();
        save();
        return true;
      },
      afterOpen: () => {
        window.__draftInventory = (ch.inventory || []).map(normalizeInventoryItem);
        window.__draftAvatar = ch.avatar || '';
        const avData = $('#m-avatar-data');
        if (avData) avData.value = window.__draftAvatar;
        wireCharacterFormHelpers();
        wireInventoryUI();
        wireAvatarPicker();
        wireSpellPicker();
        const grid = $('#ability-grid');
        if (grid) {
          grid.querySelectorAll('.ability-score').forEach(inp => {
            inp.addEventListener('input', () => {
              const ab = inp.dataset.ab;
              const modEl = $(`#m-mod-${ab}`);
              if (modEl) modEl.textContent = modStr(inp.value);
            });
          });
        }
        const umbCb = $('#m-umbrarian');
        const umbFields = $('#m-umbrarian-fields');
        const features = $('#m-features');
        function applyUmbrarianTemplate() {
          if (!umbCb?.checked || !features) return;
          const stage = $('#m-umb-stage')?.value || 'awakened';
          const shard = $('#m-umb-shard')?.value || 'Unknown Shard';
          let ab = $('#m-umb-ability')?.value || '';
          // Auto-select Shard ability from highest of INT / WIS / CHA
          const mental = [
            { a: 'INT', v: parseInt($('#m-total-int')?.textContent, 10) || parseInt($('#m-int')?.value, 10) || 10 },
            { a: 'WIS', v: parseInt($('#m-total-wis')?.textContent, 10) || parseInt($('#m-wis')?.value, 10) || 10 },
            { a: 'CHA', v: parseInt($('#m-total-cha')?.textContent, 10) || parseInt($('#m-cha')?.value, 10) || 10 }
          ].sort((x, y) => y.v - x.v);
          if (!ab || ab === 'WIS') {
            // prefer auto when default or empty
            ab = mental[0].a;
            const sel = $('#m-umb-ability');
            if (sel) sel.value = ab;
          }
          const shardDcPreview = 8 + (parseInt($('#m-prof')?.value, 10) || 2) + abilityModNum(mental.find(m => m.a === ab)?.v || 10);
          const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);
          const u = window.UMBRARIANS || {};
          const lines = [
            `Stage: ${stageLabel}`,
            `Shard: ${shard}`,
            `Shard Ability: ${ab} (DC = 8 + PB + ${ab} mod; attack = PB + ${ab} mod)`,
            'Shard Mark: Identifying mark; visible through mundane disguises while using Awakened/Ascendant Gifts.',
            'Resonant Sense (1/Long Rest): Action, 30 ft. — GM reveals true Shard / echo / Sword influence / Guardian ward (not which). Blocked by Guardian/Ascendant wards.',
            'Dark Bargain (1/Long Rest): After failing a d20 test, reroll (must use); Corruption +1. At Corruption 3+ reroll has advantage. At 5, GM may offer auto-success with severe complication.',
            'Dominion (Corruption 4+): Shard may attach a Demand. Refuse: psychic damage = 2× level; no bargains until Long Rest. Never forces PC actions.',
          ];
          if (stage === 'awakened' || stage === 'ascendant') {
            lines.push('Awakened Gifts: pick from Shard profile or generic list (1 on awakening; optional 2nd at major milestone). 1/Long Rest unless noted; overchannel via Dark Bargain.');
            (u.awakenedGiftsGeneric || []).forEach(g => lines.push(`• ${g.name}: ${g.text}`));
          }
          if (stage === 'ascendant') {
            lines.push('Ascendant Gifts: choose one (2nd only in mythic games). Expect regional consequences.');
            (u.ascendantGiftsGeneric || []).forEach(g => lines.push(`• ${g.name}: ${g.text}`));
          }
          const shardInfo = (u.shards || []).find(s => s.name === shard);
          if (shardInfo) {
            lines.push(`Shard theme (${shardInfo.name}): ${shardInfo.theme}. Common awakening: ${shardInfo.awakens}`);
          }
          features.value = setFeatureSection(features.value, FEATURE_SECTION.umbrarian, lines);
        }
        function syncUmbUI() {
          if (umbFields) umbFields.classList.toggle('hidden', !umbCb?.checked);
          if (umbCb?.checked) applyUmbrarianTemplate();
          else if (features) features.value = setFeatureSection(features.value, FEATURE_SECTION.umbrarian, null);
        }
        umbCb?.addEventListener('change', syncUmbUI);
        $('#m-umb-stage')?.addEventListener('change', () => { if (umbCb?.checked) applyUmbrarianTemplate(); });
        $('#m-umb-shard')?.addEventListener('change', () => { if (umbCb?.checked) applyUmbrarianTemplate(); });
        $('#m-umb-ability')?.addEventListener('change', () => {
          const sel = $('#m-umb-ability');
          if (sel) sel.dataset.manual = '1';
          if (umbCb?.checked) applyUmbrarianTemplate();
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
      <div class="sheet-card-header">
        ${portraitHtml(ch, 'sm')}
        <div>
          <h3>${escapeHtml(ch.name || 'Unnamed')}</h3>
          <p class="muted small">${escapeHtml(roleLabel)} · ${escapeHtml(ch.race || '—')} ${ch.class ? '· ' + escapeHtml(ch.class) : ''}${ch.subclass ? ' (' + escapeHtml(ch.subclass) + ')' : ''} · L${ch.level}</p>
        </div>
        <div class="sheet-card-stats">
          <span class="stat-chip" title="AC">AC ${ch.ac}</span>
          <span class="stat-chip" title="HP">HP ${ch.hp}/${ch.hpMax}</span>
          ${ch.isUmbrarian ? `<span class="stat-chip umbrarian" title="${escapeAttr((ch.umbrarianStage||'') + ' · ' + (ch.shard||'Shard'))}">Umbrarian${ch.umbrarianStage ? ' · ' + ch.umbrarianStage : ''}</span>` : ''}
          ${ch.corruption > 0 ? `<span class="stat-chip corruption ${corrClass}" title="Corruption">☠ ${ch.corruption}/6</span>` : ''}
        </div>
      </div>
      <div class="sheet-card-abilities">
        ${ABS.map(a => `<span><strong>${a.toUpperCase()}</strong> ${ch[a]} (${modStr(ch[a])})</span>`).join('')}
      </div>
      <div class="sheet-card-actions">
        <button class="btn primary view-sheet">View Sheet</button>
        <button class="btn secondary edit-char">Edit</button>
        <button class="btn danger delete-char">Remove</button>
      </div>`;
  }

  
  function bestShardAbility(ch) {
    const scores = {
      INT: Number(ch.int) || 10,
      WIS: Number(ch.wis) || 10,
      CHA: Number(ch.cha) || 10
    };
    // Prefer explicit choice if set; else highest mental score
    if (ch.shardAbility && scores[ch.shardAbility] != null) {
      // still allow auto if user wants - auto picks highest
    }
    let best = 'WIS';
    let bestScore = -99;
    ['INT', 'WIS', 'CHA'].forEach(a => {
      if (scores[a] > bestScore) { bestScore = scores[a]; best = a; }
    });
    return best;
  }

  function computeShardDc(ch) {
    const ab = ch.shardAbility || bestShardAbility(ch);
    const key = ab.toLowerCase();
    const mod = abilityModNum(ch[key] != null ? ch[key] : 10);
    const pb = Number(ch.profBonus) || 2;
    return {
      ability: ab,
      mod,
      pb,
      dc: 8 + pb + mod,
      attack: pb + mod
    };
  }

  function umbrarianSheetBlock(ch) {
    if (!ch.isUmbrarian) return '';
    const u = window.UMBRARIANS || {};
    const shardInfo = (u.shards || []).find(s => s.name === ch.shard);
    const dc = computeShardDc(ch);
    const stage = ch.umbrarianStage || 'dormant';
    const gifts = [];
    if (stage === 'awakened' || stage === 'ascendant') {
      (u.awakenedGiftsGeneric || []).forEach(g => gifts.push(g));
    }
    if (stage === 'ascendant') {
      (u.ascendantGiftsGeneric || []).forEach(g => gifts.push(g));
    }
    const traits = (u.commonTraits || []).map(t =>
      `<li><strong>${escapeHtml(t.name)}.</strong> ${escapeHtml(t.text)}</li>`
    ).join('');
    const giftHtml = gifts.length
      ? `<ul class="trait-list compact">${gifts.map(g => `<li><strong>${escapeHtml(g.name)}.</strong> ${escapeHtml(g.text)}</li>`).join('')}</ul>`
      : '<p class="muted small">No gift list for this stage (Dormant observes only).</p>';
    return `
      <div class="cs-panel cs-umb">
        <div class="cs-panel-title">Umbrarian · ${escapeHtml(stage)} · ${escapeHtml(ch.shard || 'Shard')}</div>
        <div class="cs-umb-stats">
          <div class="cs-stat-box"><div class="cs-stat-val">${dc.dc}</div><div class="cs-stat-label">Shard DC</div><div class="cs-stat-sub muted small">${dc.ability} (${dc.mod >= 0 ? '+' : ''}${dc.mod}) · PB +${dc.pb}</div></div>
          <div class="cs-stat-box"><div class="cs-stat-val">${dc.attack >= 0 ? '+' + dc.attack : dc.attack}</div><div class="cs-stat-label">Shard Attack</div></div>
          <div class="cs-stat-box"><div class="cs-stat-val">${ch.corruption}/6</div><div class="cs-stat-label">Corruption</div></div>
        </div>
        ${shardInfo ? `<p class="cs-body"><strong>${escapeHtml(shardInfo.name)}</strong> (${escapeHtml(shardInfo.world)}) — ${escapeHtml(shardInfo.theme)}. Common awakening: ${escapeHtml(shardInfo.awakens)}</p>` : ''}
        <div class="cs-panel-title" style="margin-top:0.5rem">Common Traits</div>
        <ul class="trait-list compact">${traits}</ul>
        <div class="cs-panel-title" style="margin-top:0.5rem">Gifts (${escapeHtml(stage)})</div>
        ${giftHtml}
        <p class="muted small" style="margin-top:0.4rem">${escapeHtml(u.darkBargains || '')}</p>
      </div>`;
  }


  function portraitHtml(ch, sizeClass = '') {
    const letter = escapeHtml((ch.name || '?').charAt(0).toUpperCase());
    if (ch.avatar) {
      return `<div class="cs-portrait-ring has-avatar ${sizeClass}"><img src="${ch.avatar}" alt="" class="cs-avatar-img" /></div>`;
    }
    return `<div class="cs-portrait-ring ${sizeClass}"><span>${letter}</span></div>`;
  }

function parseAttackLines(ch) {
    const lines = [];
    const inv = ch.inventory || [];
    const weapons = inv.filter(i => i.equipped && i.category === 'weapon');
    const pb = ch.profBonus || 2;
    const str = abilityModNum(ch.str);
    const dex = abilityModNum(ch.dex);
    weapons.forEach(w => {
      const finesse = (w.props || '').toLowerCase().includes('finesse');
      const ranged = (w.weaponType || '').includes('ranged') || (w.props || '').toLowerCase().includes('ammunition');
      const mod = (finesse || ranged) ? Math.max(str, dex) : str;
      const atk = mod + pb;
      lines.push({
        name: w.name,
        bonus: atk >= 0 ? `+${atk}` : `${atk}`,
        damage: `${w.damage || '?'}${mod >= 0 ? '+' + mod : mod} ${w.damageType || ''}`.trim(),
        range: ranged ? ((w.props || '').match(/\((\d+\/\d+)\)/) || [])[1] || 'ranged' : '5 ft.',
        props: w.props || w.weaponType || ''
      });
    });
    // Also parse free-text attacks
    String(ch.attacks || '').split('\n').forEach(line => {
      line = line.trim();
      if (!line || /extra attack|sneak attack|note:/i.test(line)) return;
      const name = line.split(':')[0].trim();
      if (weapons.some(w => w.name === name)) return;
      if (name.length < 2) return;
      const bonusM = line.match(/([+-]\d+)\s*to hit/i);
      const dmgM = line.match(/,\s*([^,]+)$/) || line.match(/hit,\s*(.+)/i);
      lines.push({
        name,
        bonus: bonusM ? bonusM[1] : '—',
        damage: dmgM ? dmgM[1].trim() : line,
        range: '—',
        props: ''
      });
    });
    return lines;
  }

  function characterSheetViewHtml(ch) {
    const race = getPhbRaces().find(r => r.name === ch.race);
    const cls = findPhbClass(ch.class);
    const path = findMoonPath(ch.subclass);
    const inv = ch.inventory || [];
    const equipped = inv.filter(i => i.equipped);
    const armor = equipped.find(i => i.category === 'armor');
    const shield = equipped.find(i => i.category === 'shield');
    const acCalc = calcAcFromInventory(inv, ch, ch.class);
    const attacks = parseAttackLines(ch);
    const initMod = abilityModNum(ch.dex);
    const initStr = (initMod >= 0 ? '+' : '') + initMod;
    const passivePer = 10 + abilityModNum(ch.wis) + ((ch.skills || '').toLowerCase().includes('perception') ? (ch.profBonus || 2) : 0);

    const skillsAll = (window.PHB_SKILLS || []).map(s => s.name || s).filter(Boolean);
    const skillProfs = new Set((ch.skills || '').split(/[,;]+/).map(s => s.trim().split(/\s+\+/)[0].trim().toLowerCase()).filter(Boolean));
    const skillRows = (skillsAll.length ? skillsAll : ['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival']).map(name => {
      const ab = ({Acrobatics:'dex','Animal Handling':'wis',Arcana:'int',Athletics:'str',Deception:'cha',History:'int',Insight:'wis',Intimidation:'cha',Investigation:'int',Medicine:'wis',Nature:'int',Perception:'wis',Performance:'cha',Persuasion:'cha',Religion:'int','Sleight of Hand':'dex',Stealth:'dex',Survival:'wis'})[name] || 'int';
      const mod = abilityModNum(ch[ab]);
      const prof = skillProfs.has(name.toLowerCase());
      const total = mod + (prof ? (ch.profBonus || 2) : 0);
      const t = total >= 0 ? '+' + total : '' + total;
      return `<div class="cs-skill ${prof ? 'prof' : ''}"><span class="cs-skill-check">${prof ? '●' : '○'}</span><span class="cs-skill-mod">${t}</span><span class="cs-skill-name">${escapeHtml(name)}</span><span class="cs-skill-ab">${ab.slice(0,3).toUpperCase()}</span></div>`;
    }).join('');

    const abBlock = ABS.map(a => {
      const total = ch[a] || 10;
      return `<div class="cs-ability">
        <div class="cs-ab-label">${a.toUpperCase()}</div>
        <div class="cs-ab-mod">${modStr(total)}</div>
        <div class="cs-ab-score">${total}</div>
      </div>`;
    }).join('');

    const attackCards = attacks.length ? attacks.map(a => `
      <div class="cs-atk-card">
        <div class="cs-atk-name">${escapeHtml(a.name)}</div>
        <div class="cs-atk-stats">
          <div><span class="cs-atk-lbl">Atk Bonus</span><span class="cs-atk-val">${escapeHtml(a.bonus)}</span></div>
          <div><span class="cs-atk-lbl">Damage/Type</span><span class="cs-atk-val">${escapeHtml(a.damage)}</span></div>
          <div><span class="cs-atk-lbl">Range</span><span class="cs-atk-val">${escapeHtml(a.range)}</span></div>
        </div>
        ${a.props ? `<div class="cs-atk-props">${escapeHtml(a.props)}</div>` : ''}
      </div>`).join('') : '<p class="muted">No attacks listed. Equip weapons or add attacks on the character sheet.</p>';

    const invRows = inv.length ? inv.map(i =>
      `<tr class="${i.equipped ? 'equipped-row' : ''}">
        <td>${i.equipped ? '●' : ''}</td>
        <td>${escapeHtml(i.name)}${i.qty > 1 ? ' ×' + i.qty : ''}</td>
        <td>${escapeHtml(i.category)}</td>
        <td>${i.weight ? (i.weight * i.qty) + ' lb' : '—'}</td>
      </tr>`
    ).join('') : '<tr><td colspan="4" class="muted">No items</td></tr>';

    return `
      <div class="cs-sheet">
        <div class="cs-tabs">
          <button type="button" class="cs-tab active" data-cs-page="1">Page 1 · Combat</button>
          <button type="button" class="cs-tab" data-cs-page="2">Page 2 · Attacks</button>
          <button type="button" class="cs-tab" data-cs-page="3">Page 3 · Story</button>
        </div>

        <!-- PAGE 1 -->
        <div class="cs-page active" data-cs-page="1">
          <div class="cs-top">
            <div class="cs-portrait-block">
              ${portraitHtml(ch)}
              <div class="cs-name-block">
                <div class="cs-char-name">${escapeHtml(ch.name || 'Unnamed')}</div>
                <div class="cs-char-meta">${escapeHtml(ch.class || '—')}${ch.subclass ? ' · ' + escapeHtml(ch.subclass) : ''} · Level ${ch.level}</div>
                <div class="cs-char-meta">${escapeHtml(ch.race || '—')}${ch.background ? ' · ' + escapeHtml(ch.background) : ''}${ch.alignment ? ' · ' + escapeHtml(ch.alignment) : ''}</div>
                <div class="cs-char-meta muted">${escapeHtml(ch.player || '')}${ch.world ? ' · ' + escapeHtml(ch.world) : ''}</div>
              </div>
              <div class="cs-header-right">
                <div class="cs-mini-stat"><span class="cs-mini-lbl">Initiative</span><span class="cs-mini-val">${initStr}</span></div>
                <div class="cs-mini-stat"><span class="cs-mini-lbl">Proficiency</span><span class="cs-mini-val">+${ch.profBonus || 2}</span></div>
              </div>
            </div>
            <div class="cs-combat-row">
              <div class="cs-stat-box"><div class="cs-stat-val">${ch.ac}</div><div class="cs-stat-label">Armor Class</div><div class="cs-stat-sub muted small">${armor ? escapeHtml(armor.name) : 'Unarmored'}${shield ? ' + Shield' : ''}</div></div>
              <div class="cs-stat-box"><div class="cs-stat-val">${ch.hp}<span class="cs-hp-max">/${ch.hpMax}</span></div><div class="cs-stat-label">Hit Points</div></div>
              <div class="cs-stat-box"><div class="cs-stat-val">${escapeHtml((ch.speed || '30 ft.').replace(' ft.',''))}</div><div class="cs-stat-label">Speed</div></div>
              <div class="cs-stat-box"><div class="cs-stat-val">${passivePer}</div><div class="cs-stat-label">Passive Perception</div></div>
              ${ch.corruption > 0 || ch.isUmbrarian ? `<div class="cs-stat-box cs-corrupt"><div class="cs-stat-val">${ch.corruption}/6</div><div class="cs-stat-label">Corruption</div></div>` : ''}
            </div>
          </div>
          <div class="cs-main cs-main-classic">
            <div class="cs-col-left">
              <div class="cs-panel"><div class="cs-panel-title">Ability Scores</div><div class="cs-abilities">${abBlock}</div></div>
              <div class="cs-panel"><div class="cs-panel-title">Saving Throws</div><div class="cs-body">${escapeHtml(ch.saves || '—')}</div></div>
              <div class="cs-panel cs-skills-panel"><div class="cs-panel-title">Skills</div><div class="cs-skills">${skillRows}</div></div>
              ${ch.isUmbrarian ? umbrarianSheetBlock(ch) : ''}
            </div>
            <div class="cs-col-right">
              <div class="cs-panel">
                <div class="cs-panel-title">Attacks (summary)</div>
                <div class="cs-atk-mini">${attacks.slice(0,4).map(a => `<div class="cs-atk-mini-row"><strong>${escapeHtml(a.name)}</strong> ${escapeHtml(a.bonus)} · ${escapeHtml(a.damage)}</div>`).join('') || '<span class="muted">See Page 2</span>'}</div>
                <p class="muted small">Full attack cards on Page 2</p>
              </div>
              <div class="cs-panel">
                <div class="cs-panel-title">Features &amp; Traits</div>
                <pre class="cs-pre cs-pre-scroll">${escapeHtml(ch.features || '—')}</pre>
              </div>
              <div class="cs-panel">
                <div class="cs-panel-title">Equipment</div>
                <table class="cs-inv-table">
                  <thead><tr><th></th><th>Item</th><th>Type</th><th>Wt</th></tr></thead>
                  <tbody>${invRows}</tbody>
                </table>
                <div class="muted small">Weight ${inventoryWeight(inv).toFixed(1)} lb</div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGE 2 ATTACKS -->
        <div class="cs-page" data-cs-page="2">
          <div class="cs-page-title">Attacks &amp; Weapons</div>
          <div class="cs-atk-grid">${attackCards}</div>
          <div class="cs-panel" style="margin-top:0.75rem">
            <div class="cs-panel-title">Attack Notes / Spell Attacks</div>
            <pre class="cs-pre">${escapeHtml(ch.attacks || '—')}</pre>
          </div>
          <div class="cs-panel">
            <div class="cs-panel-title">Equipped Gear</div>
            <ul class="trait-list compact">
              ${equipped.length ? equipped.map(i => `<li><strong>${escapeHtml(i.name)}</strong> (${escapeHtml(i.category)}${i.damage ? ' · ' + escapeHtml(i.damage) + ' ' + escapeHtml(i.damageType||'') : ''}${i.acBase != null ? ' · AC ' + i.acBase : ''})</li>`).join('') : '<li class="muted">Nothing equipped</li>'}
            </ul>
          </div>
        </div>

        <!-- PAGE 3 STORY -->
        <div class="cs-page" data-cs-page="3">
          <div class="cs-page-title">Character Details</div>
          <div class="cs-footer-panels">
            ${race ? `<div class="cs-panel"><div class="cs-panel-title">Race — ${escapeHtml(race.name)}</div>
              <p class="muted small">${escapeHtml(race.tagline || race.short || '')}</p>
              <ul class="trait-list compact">${(race.traits||[]).map(t => `<li><strong>${escapeHtml(t.name)}.</strong> ${escapeHtml(t.text)}</li>`).join('')}</ul>
            </div>` : ''}
            ${cls ? `<div class="cs-panel"><div class="cs-panel-title">Class — ${escapeHtml(cls.name)}</div>
              <p class="muted small">Hit Die ${cls.hitDie} · Primary ${escapeHtml(cls.primary)} · Saves ${escapeHtml(cls.saves)}</p>
              <p>${escapeHtml(cls.summary || '')}</p>
            </div>` : ''}
            ${path ? `<div class="cs-panel"><div class="cs-panel-title">${escapeHtml(path.name)}</div>
              <p class="muted small">${escapeHtml(path.summary || '')}</p>
              <ul class="trait-list compact">${(path.features||[]).filter(f => f.lvl <= ch.level).map(f => `<li><strong>L${f.lvl} ${escapeHtml(f.name)}.</strong> ${escapeHtml(f.text)}</li>`).join('')}</ul>
            </div>` : ''}
            ${ch.isUmbrarian ? umbrarianSheetBlock(ch) : ''}
            ${ch.notes ? `<div class="cs-panel"><div class="cs-panel-title">Notes &amp; Backstory</div><pre class="cs-pre">${escapeHtml(ch.notes)}</pre></div>` : ''}
          </div>
        </div>

        <p class="cs-footer-brand muted small">The Dark Sun Chronicles · Character Sheet</p>
      </div>`;
  }

  async function viewCharacterSheet(ch) {
    const toolbar = `
      <div class="cs-toolbar">
        <button type="button" class="btn secondary btn-tiny" id="cs-export">Export JSON</button>
        <button type="button" class="btn secondary btn-tiny" id="cs-print">Print</button>
      </div>`;
    await openModal({
      title: ch.name || 'Character Sheet',
      bodyHtml: toolbar + characterSheetViewHtml(ch),
      confirmText: 'Close',
      cancelText: '',
      wide: true,
      xwide: true,
      onConfirm: () => true,
      afterOpen: () => {
        const root = $('#modal-body');
        if (!root) return;
        root.querySelectorAll('.cs-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            const page = tab.dataset.csPage;
            root.querySelectorAll('.cs-tab').forEach(t => t.classList.toggle('active', t === tab));
            root.querySelectorAll('.cs-page').forEach(p => p.classList.toggle('active', p.dataset.csPage === page));
          });
        });
        root.querySelector('#cs-export')?.addEventListener('click', () => exportCharacterJson(ch));
        root.querySelector('#cs-print')?.addEventListener('click', () => printCharacterSheet(ch));
      }
    });
  }

  function exportCharacterJson(ch) {
    const data = {
      format: 'DSCToolkt-character-v1',
      exportedAt: new Date().toISOString(),
      character: ch
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(ch.name || 'character').replace(/[^a-z0-9_-]+/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Character exported');
  }

  function importCharacterJson(file, asVillain) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        let ch = data.character || data;
        if (!ch || typeof ch !== 'object') throw new Error('Invalid file');
        ch = normalizeCharacter({ ...ch, id: uid() });
        const c = getActive();
        if (!c) { toast('Open a campaign first'); return; }
        ensureCampaignShape(c);
        if (asVillain || ch.type === 'villain') {
          ch.type = 'villain';
          c.villains.push(ch);
        } else {
          ch.type = ch.type === 'ally' ? 'ally' : 'pc';
          c.party.push(ch);
        }
        c.updatedAt = new Date().toISOString();
        save();
        renderParty();
        toast(`Imported ${ch.name || 'character'}`);
      } catch (e) {
        console.warn(e);
        toast('Import failed — invalid JSON');
      }
    };
    reader.readAsText(file);
  }

  function printCharacterSheet(ch) {
    // Build a denser print-only layout (same visual language, no empty page breaks)
    const race = getPhbRaces().find(r => r.name === ch.race);
    const cls = findPhbClass(ch.class);
    const path = findMoonPath(ch.subclass);
    const inv = ch.inventory || [];
    const equipped = inv.filter(i => i.equipped);
    const armor = equipped.find(i => i.category === 'armor');
    const shield = equipped.find(i => i.category === 'shield');
    const attacks = parseAttackLines(ch);
    const initMod = abilityModNum(ch.dex);
    const initStr = (initMod >= 0 ? '+' : '') + initMod;
    const passivePer = 10 + abilityModNum(ch.wis) + ((ch.skills || '').toLowerCase().includes('perception') ? (ch.profBonus || 2) : 0);

    const abBlock = ABS.map(a => {
      const total = ch[a] || 10;
      return `<div class="p-ab"><div class="p-ab-lbl">${a.toUpperCase()}</div><div class="p-ab-mod">${modStr(total)}</div><div class="p-ab-sc">${total}</div></div>`;
    }).join('');

    const attackCards = attacks.length ? attacks.map(a => `
      <div class="p-atk">
        <div class="p-atk-name">${escapeHtml(a.name)}</div>
        <div class="p-atk-row"><span>Atk</span><strong>${escapeHtml(a.bonus)}</strong></div>
        <div class="p-atk-row"><span>Dmg</span><strong>${escapeHtml(a.damage)}</strong></div>
        <div class="p-atk-row"><span>Range</span><strong>${escapeHtml(a.range)}</strong></div>
        ${a.props ? `<div class="p-atk-props">${escapeHtml(a.props)}</div>` : ''}
      </div>`).join('') : '<span class="muted">No attacks</span>';

    const invRows = inv.length ? inv.map(i =>
      `<tr class="${i.equipped ? 'eq' : ''}"><td>${i.equipped ? '●' : ''}</td><td>${escapeHtml(i.name)}${i.qty > 1 ? ' ×' + i.qty : ''}</td><td>${escapeHtml(i.category)}</td><td>${i.weight ? (i.weight * i.qty) + ' lb' : '—'}</td></tr>`
    ).join('') : '<tr><td colspan="4">—</td></tr>';

    // Compact skills: only proficient + a short list feel
    const skillLines = (ch.skills || '—');

    const umb = ch.isUmbrarian ? umbrarianSheetBlock(ch) : '';

    // Features once (avoid duplicating race/path blocks that are already in features)
    const features = ch.features || '—';

    const html = `
      <div class="p-sheet">
        <header class="p-head">
          ${portraitHtml(ch)}
          <div class="p-id">
            <div class="p-name">${escapeHtml(ch.name || 'Unnamed')}</div>
            <div class="p-meta">${escapeHtml(ch.class || '—')}${ch.subclass ? ' · ' + escapeHtml(ch.subclass) : ''} · Level ${ch.level}</div>
            <div class="p-meta">${escapeHtml(ch.race || '—')}${ch.background ? ' · ' + escapeHtml(ch.background) : ''}${ch.alignment ? ' · ' + escapeHtml(ch.alignment) : ''}${ch.world ? ' · ' + escapeHtml(ch.world) : ''}</div>
          </div>
          <div class="p-head-stats">
            <div class="p-pill"><span>Init</span><strong>${initStr}</strong></div>
            <div class="p-pill"><span>PB</span><strong>+${ch.profBonus || 2}</strong></div>
          </div>
        </header>

        <div class="p-combat">
          <div class="p-box"><div class="p-val">${ch.ac}</div><div class="p-lbl">Armor Class</div><div class="p-sub">${armor ? escapeHtml(armor.name) : 'Unarmored'}${shield ? ' + Shield' : ''}</div></div>
          <div class="p-box"><div class="p-val">${ch.hp}<span class="p-dim">/${ch.hpMax}</span></div><div class="p-lbl">Hit Points</div></div>
          <div class="p-box"><div class="p-val">${escapeHtml((ch.speed || '30 ft.').replace(' ft.',''))}</div><div class="p-lbl">Speed</div></div>
          <div class="p-box"><div class="p-val">${passivePer}</div><div class="p-lbl">Passive Perc.</div></div>
          ${ch.corruption > 0 || ch.isUmbrarian ? `<div class="p-box p-corrupt"><div class="p-val">${ch.corruption}/6</div><div class="p-lbl">Corruption</div></div>` : ''}
        </div>

        <div class="p-grid">
          <div class="p-col">
            <section class="p-panel">
              <h3>Ability Scores</h3>
              <div class="p-abs">${abBlock}</div>
            </section>
            <section class="p-panel">
              <h3>Saving Throws</h3>
              <div>${escapeHtml(ch.saves || '—')}</div>
            </section>
            <section class="p-panel">
              <h3>Skills</h3>
              <div class="p-skills">${escapeHtml(skillLines)}</div>
            </section>
          </div>
          <div class="p-col p-col-wide">
            <section class="p-panel">
              <h3>Attacks &amp; Weapons</h3>
              <div class="p-atk-grid">${attackCards}</div>
              ${ch.attacks ? `<pre class="p-pre">${escapeHtml(ch.attacks)}</pre>` : ''}
            </section>
            <section class="p-panel">
              <h3>Features &amp; Traits</h3>
              <pre class="p-pre">${escapeHtml(features)}</pre>
            </section>
            <section class="p-panel">
              <h3>Equipment <span class="p-dim">(${inventoryWeight(inv).toFixed(1)} lb)</span></h3>
              <table class="p-table"><thead><tr><th></th><th>Item</th><th>Type</th><th>Wt</th></tr></thead><tbody>${invRows}</tbody></table>
            </section>
          </div>
        </div>

        ${(() => {
          const sp = spellSheetBlock(ch);
          const cards = spellSheetCardsHtml(ch);
          return (sp || cards) ? `<div class="p-spell-wrap">${sp || ''}${cards || ''}</div>` : '';
        })()}
        ${umb ? `<div class="p-umb-wrap">${umb}</div>` : ''}

        ${(race || path || ch.notes) ? `
        <div class="p-grid p-grid-3">
          ${race ? `<section class="p-panel"><h3>Race — ${escapeHtml(race.name)}</h3>
            <ul class="p-list">${(race.traits||[]).slice(0,10).map(t => `<li><strong>${escapeHtml(t.name)}.</strong> ${escapeHtml(t.text)}</li>`).join('')}</ul>
          </section>` : ''}
          ${path ? `<section class="p-panel"><h3>${escapeHtml(path.name)}</h3>
            <ul class="p-list">${(path.features||[]).filter(f => f.lvl <= ch.level).map(f => `<li><strong>L${f.lvl} ${escapeHtml(f.name)}.</strong> ${escapeHtml(f.text)}</li>`).join('')}</ul>
          </section>` : ''}
          ${ch.notes ? `<section class="p-panel"><h3>Notes</h3><pre class="p-pre">${escapeHtml(ch.notes)}</pre></section>` : ''}
        </div>` : ''}

        <footer class="p-foot">The Dark Sun Chronicles · Character Sheet</footer>
      </div>`;

    const w = window.open('', '_blank');
    if (!w) { toast('Allow pop-ups to print'); return; }
    const css = `
      * { box-sizing: border-box; }
      @page { size: A4 portrait; margin: 10mm; }
      html, body { width: 210mm; }
      body {
        margin: 0 auto; padding: 0;
        font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
        background: #14110e; color: #e8dcc8;
        font-size: 10pt; line-height: 1.25;
      }
      .p-sheet { width: 100%; max-width: 190mm; margin: 0 auto; }
      .p-head { display: flex; gap: 12px; align-items: center; border-bottom: 2px solid rgba(196,163,90,0.35); padding-bottom: 8px; margin-bottom: 8px; }
      .cs-portrait-ring {
        width: 56px; height: 56px; border-radius: 50%; border: 2px solid #c4a35a;
        background: radial-gradient(circle at 30% 30%, #3a3028, #1a1510);
        display: flex; align-items: center; justify-content: center;
        font-size: 1.4rem; font-weight: 700; color: #c4a35a; overflow: hidden; flex-shrink: 0;
      }
      .cs-portrait-ring.has-avatar { padding: 0; }
      .cs-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .p-name { font-size: 1.35rem; font-weight: 700; color: #f0e6d0; line-height: 1.15; }
      .p-meta { color: #a89880; font-size: 0.85rem; }
      .p-id { flex: 1; min-width: 0; }
      .p-head-stats { display: flex; gap: 6px; }
      .p-pill {
        border: 1px solid rgba(196,163,90,0.35); border-radius: 6px; padding: 4px 8px; text-align: center;
      }
      .p-pill span { display: block; font-size: 0.65rem; color: #a89880; text-transform: uppercase; }
      .p-pill strong { color: #c4a35a; font-size: 1rem; }
      .p-combat {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
        gap: 6px; margin-bottom: 8px;
      }
      .p-box {
        background: rgba(28,22,18,0.95); border: 1px solid rgba(196,163,90,0.35);
        border-radius: 6px; text-align: center; padding: 6px 4px;
      }
      .p-val { font-size: 1.35rem; font-weight: 700; color: #c4a35a; line-height: 1.1; }
      .p-dim { color: #a89880; font-weight: 500; font-size: 0.9em; }
      .p-lbl { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.05em; color: #a89880; margin-top: 2px; }
      .p-sub { font-size: 0.65rem; color: #a89880; }
      .p-corrupt .p-val { color: #d08080; }
      .p-grid { display: grid; grid-template-columns: 28% 1fr; gap: 6px; margin-bottom: 6px; }
      .p-grid-3 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
      .p-panel {
        background: rgba(28,22,18,0.95); border: 1px solid rgba(196,163,90,0.3);
        border-radius: 6px; padding: 6px 8px; margin-bottom: 6px;
      }
      .p-panel h3 {
        margin: 0 0 4px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em;
        color: #c4a35a; border-bottom: 1px solid rgba(196,163,90,0.25); padding-bottom: 2px;
      }
      .p-abs { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
      .p-ab {
        text-align: center; border: 1px solid rgba(196,163,90,0.2); border-radius: 4px;
        padding: 3px; background: rgba(0,0,0,0.2);
      }
      .p-ab-lbl { font-size: 0.62rem; color: #a89880; }
      .p-ab-mod { font-size: 1.05rem; font-weight: 700; color: #f0e6d0; }
      .p-ab-sc {
        display: inline-block; font-size: 0.72rem; color: #c4a35a;
        border: 1px solid rgba(196,163,90,0.3); border-radius: 999px; padding: 0 5px;
      }
      .p-skills { font-size: 0.8rem; }
      .p-atk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
      .p-atk {
        border: 1px solid rgba(196,163,90,0.35); border-radius: 6px; padding: 5px 7px;
        background: rgba(0,0,0,0.15);
      }
      .p-atk-name { font-weight: 700; color: #f0e6d0; border-bottom: 1px solid rgba(196,163,90,0.2); margin-bottom: 3px; padding-bottom: 2px; font-size: 0.85rem; }
      .p-atk-row { display: flex; justify-content: space-between; gap: 6px; font-size: 0.78rem; }
      .p-atk-row span { color: #a89880; }
      .p-atk-row strong { color: #c4a35a; }
      .p-atk-props { font-size: 0.68rem; color: #a89880; margin-top: 2px; }
      .p-pre {
        white-space: pre-wrap; font-family: inherit; font-size: 0.78rem;
        margin: 4px 0 0; color: #e8dcc8; max-height: none;
      }
      .p-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
      .p-table th { text-align: left; color: #a89880; font-size: 0.65rem; text-transform: uppercase; border-bottom: 1px solid rgba(196,163,90,0.3); padding: 2px 3px; }
      .p-table td { padding: 2px 3px; border-bottom: 1px solid rgba(255,255,255,0.04); }
      .p-table tr.eq td { color: #c4a35a; }
      .p-list { margin: 0; padding-left: 1rem; font-size: 0.75rem; }
      .p-list li { margin-bottom: 2px; }
      .p-umb-wrap { margin-bottom: 8px; }
      .p-umb-wrap .cs-panel { margin-bottom: 0; }
      .p-umb-wrap .cs-panel-title {
        font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em;
        color: #c4a35a; border-bottom: 1px solid rgba(196,163,90,0.25); padding-bottom: 2px; margin-bottom: 4px; font-weight: 700;
      }
      .p-umb-wrap .cs-umb { border: 1px solid rgba(196,92,74,0.45); border-radius: 6px; padding: 6px 8px; background: rgba(28,22,18,0.95); }
      .p-umb-wrap .cs-umb-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin: 4px 0; }
      .p-umb-wrap .cs-stat-box { text-align: center; border: 1px solid rgba(196,163,90,0.3); border-radius: 4px; padding: 4px; }
      .p-umb-wrap .cs-stat-val { font-size: 1.1rem; font-weight: 700; color: #c4a35a; }
      .p-umb-wrap .cs-stat-label { font-size: 0.6rem; color: #a89880; text-transform: uppercase; }
      .p-umb-wrap .cs-stat-sub { font-size: 0.62rem; color: #a89880; }
      .p-umb-wrap .trait-list { margin: 0; padding-left: 1rem; font-size: 0.75rem; }
      .p-foot {
        text-align: center; margin-top: 8px; font-size: 0.65rem; letter-spacing: 0.12em;
        text-transform: uppercase; color: #a89880;
      }
      .muted { color: #a89880; }
      .p-spell-wrap { margin-bottom: 6px; }
      .p-spell-wrap .cs-panel { background: rgba(28,22,18,0.95); border: 1px solid rgba(196,163,90,0.3); border-radius: 6px; padding: 6px 8px; }
      .p-spell-wrap .cs-panel-title { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.07em; color: #c4a35a; border-bottom: 1px solid rgba(196,163,90,0.25); padding-bottom: 2px; margin-bottom: 4px; font-weight: 700; }
      .p-spell-wrap .cs-umb-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin: 4px 0; }
      .p-spell-wrap .cs-stat-box { text-align: center; border: 1px solid rgba(196,163,90,0.3); border-radius: 4px; padding: 4px; }
      .p-spell-wrap .cs-stat-val { font-size: 1.1rem; font-weight: 700; color: #c4a35a; }
      .p-spell-wrap .cs-stat-label { font-size: 0.6rem; color: #a89880; text-transform: uppercase; }
      .p-spell-wrap .cs-pre { white-space: pre-wrap; font-family: inherit; font-size: 0.78rem; margin: 2px 0 0; }
      .spell-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .spell-card {
        border: 1px solid rgba(196,163,90,0.45); border-radius: 4px; overflow: hidden;
        background: rgba(28,22,18,0.95); break-inside: avoid; page-break-inside: avoid;
        font-size: 9pt;
      }
      .spell-card-banner { background: rgba(196,163,90,0.12); border-bottom: 1px solid rgba(196,163,90,0.3); padding: 6px 8px; }
      .spell-card-name { font-weight: 700; font-size: 11pt; color: #f0e6d0; }
      .spell-card-level { font-size: 8pt; color: #a89880; font-style: italic; }
      .spell-card-stats {
        display: grid; grid-template-columns: 1fr 1fr; gap: 0;
        border-bottom: 1px solid rgba(196,163,90,0.25);
      }
      .spell-stat { padding: 4px 6px; border-right: 1px solid rgba(196,163,90,0.2); border-bottom: 1px solid rgba(196,163,90,0.15); }
      .spell-stat:nth-child(2n) { border-right: none; }
      .spell-stat-label {
        font-size: 7pt; text-transform: uppercase; letter-spacing: 0.06em; color: #a89880; font-weight: 700;
      }
      .spell-stat-value { font-size: 9pt; color: #e8dcc8; font-weight: 600; }
      .spell-card-desc { padding: 6px 8px; font-size: 8.5pt; line-height: 1.3; color: #e8dcc8; }
      .spell-card-actions { display: none; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #14110e; }
        .p-panel, .p-box, .p-atk, .p-ab { break-inside: avoid; page-break-inside: avoid; }
        .p-grid { break-inside: auto; }
      }
    `;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(ch.name || 'Sheet').replace(/[<>]/g,'')}</title><style>${css}</style></head><body>${html}<script>window.onload=function(){setTimeout(function(){window.print();},150);}</script></body></html>`);
    w.document.close();
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
        card.querySelector('.view-sheet')?.addEventListener('click', () => viewCharacterSheet(ch));
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
        card.querySelector('.view-sheet')?.addEventListener('click', () => viewCharacterSheet(ch));
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
          str: parseInt($('#m-total-str')?.textContent, 10) || parseInt($('#m-str').value, 10) || 10,
          dex: parseInt($('#m-total-dex')?.textContent, 10) || parseInt($('#m-dex').value, 10) || 10,
          con: parseInt($('#m-total-con')?.textContent, 10) || parseInt($('#m-con').value, 10) || 10,
          int: parseInt($('#m-total-int')?.textContent, 10) || parseInt($('#m-int').value, 10) || 10,
          wis: parseInt($('#m-total-wis')?.textContent, 10) || parseInt($('#m-wis').value, 10) || 10,
          cha: parseInt($('#m-total-cha')?.textContent, 10) || parseInt($('#m-cha').value, 10) || 10,
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
        const umb = $('#npc-gen-umbrarian')?.checked;
        const stage = $('#npc-gen-umb-stage')?.value || '';
        const npc = generateNpc({ umbrarian: !!umb, umbrarianStage: stage || undefined });
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
          features: npc.features || npc.traits,
          equipment: '',
          corruption: npc.corruption || 0,
          isUmbrarian: !!npc.isUmbrarian,
          umbrarianStage: npc.umbrarianStage || '',
          shard: npc.shard || '',
          shardAbility: npc.shardAbility || '',
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

  
  function renderDscClasses() {
    const root = $('#dsc-classes-content');
    if (!root) return;
    const classes = getPhbClasses().filter(c => c.setting);
    const abilities = window.CLASS_ABILITIES || {};
    if (!classes.length) {
      root.innerHTML = '<p class="muted">No DSC signature classes loaded.</p>';
      return;
    }
    root.innerHTML = classes.map(cls => {
      const abs = abilities[cls.name] || [];
      const prog = (cls.progression || []).map(([lvl, feat]) =>
        `<tr><td>${lvl}</td><td>${escapeHtml(feat)}</td></tr>`).join('');
      const abHtml = abs.length ? `<ul class="trait-list">${abs.map(a =>
        `<li><strong>L${a.lvl} — ${escapeHtml(a.name)}.</strong> ${escapeHtml(a.text)}</li>`).join('')}</ul>` : '';
      let pathHtml = '';
      if (cls.name === 'Moon Guardian') {
        const paths = getMoonPaths();
        pathHtml = `<div class="detail-block"><div class="detail-label">Moon Paths</div>
          ${paths.map(p => `
            <div class="path-block">
              <h4>${escapeHtml(p.name)} <span class="muted small">(${escapeHtml(p.world)})</span></h4>
              <p class="muted small">${escapeHtml(p.summary || '')}</p>
              <ul class="trait-list compact">${(p.features||[]).map(f =>
                `<li><strong>L${f.lvl} ${escapeHtml(f.name)}.</strong> ${escapeHtml(f.text)}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>`;
      }
      return `<article class="race-card dsc-class-card">
        <header class="race-header">
          <h2>${escapeHtml(cls.name)}</h2>
          <p class="race-tagline">${escapeHtml(cls.summary || '')}</p>
        </header>
        <div class="detail-block">
          <div class="detail-label">At a Glance</div>
          <p class="detail-text">Hit Die <strong>${escapeHtml(cls.hitDie)}</strong> · Primary <strong>${escapeHtml(cls.primary)}</strong> · Saves <strong>${escapeHtml(cls.saves)}</strong></p>
          <p class="detail-text muted small">Armor: ${escapeHtml(cls.armor || '—')} · Weapons: ${escapeHtml(cls.weapons || '—')}${cls.tools ? ' · Tools: ' + escapeHtml(cls.tools) : ''}</p>
          ${cls.skills ? `<p class="detail-text muted small">Skills: choose ${cls.skillsChoose || '?'} from ${Array.isArray(cls.skills) ? cls.skills.join(', ') : cls.skills}</p>` : ''}
        </div>
        <div class="detail-block">
          <div class="detail-label">Progression</div>
          <table class="prog-table"><thead><tr><th>Level</th><th>Features</th></tr></thead><tbody>${prog}</tbody></table>
        </div>
        <div class="detail-block">
          <div class="detail-label">Class Abilities</div>
          ${abHtml || '<p class="muted">See Player’s Handbook for full text.</p>'}
        </div>
        ${pathHtml}
      </article>`;
    }).join('');
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
    const stages = (u.stages || []).map(s => `<li><strong>${escapeHtml(s.name)}.</strong> ${escapeHtml(s.text)}</li>`).join('');
    const traits = (u.commonTraits || []).map(t => `<li><strong>${escapeHtml(t.name)}.</strong> ${escapeHtml(t.text)}</li>`).join('');
    const track = (u.corruptionTrack || []).map(r =>
      `<tr><td>${r.score}</td><td>${escapeHtml(r.state)}</td><td>${escapeHtml(r.effect)}</td></tr>`).join('');
    const shards = (u.shards || []).map(s =>
      `<tr><td><strong>${escapeHtml(s.name)}</strong></td><td>${escapeHtml(s.world)}</td><td>${escapeHtml(s.awakens)}</td><td>${escapeHtml(s.theme)}</td></tr>`).join('');
    let raceHtml = '';
    if (race) {
      raceHtml = `
        <div class="detail-block">
          <div class="detail-label">Related Race — Umbralites (PHB)</div>
          <p class="detail-text"><em>${escapeHtml(race.tagline || '')}</em>. ${escapeHtml(race.intro || '')}</p>
          <ul class="trait-list">
            ${(race.traits || []).map(t => `<li><strong>${escapeHtml(t.name)}.</strong> ${escapeHtml(t.text)}</li>`).join('')}
          </ul>
        </div>`;
    }
    root.innerHTML = `
      <article class="race-card">
        <header class="race-header">
          <h2>${escapeHtml(u.name)}</h2>
          <p class="race-tagline">${escapeHtml(u.subtitle || '')}</p>
        </header>
        <div class="detail-block callout">
          <div class="detail-label">Critical Distinction</div>
          <p class="detail-text">${escapeHtml(u.criticalDistinction)}</p>
        </div>
        <div class="detail-block"><div class="detail-label">Definition</div><p class="detail-text">${escapeHtml(u.definition)}</p></div>
        <div class="detail-block"><div class="detail-label">Bound at Birth</div><p class="detail-text">${escapeHtml(u.boundAtBirth)}</p></div>
        <div class="detail-block"><div class="detail-label">The Sleeping Shard</div><p class="detail-text">${escapeHtml(u.sleepingShard || '')}</p></div>
        <div class="detail-block">
          <div class="detail-label">Common Traits (every true Umbrarian)</div>
          <ul class="trait-list">${traits}</ul>
        </div>
        <div class="detail-block">
          <div class="detail-label">Stages</div>
          <ul class="trait-list">${stages}</ul>
          <p class="detail-text muted">${escapeHtml(u.gainingGifts || '')}</p>
        </div>
        <div class="detail-block">
          <div class="detail-label">Corruption Track (0–6)</div>
          <table class="prog-table">
            <thead><tr><th>Score</th><th>State</th><th>Effect</th></tr></thead>
            <tbody>${track}</tbody>
          </table>
          <p class="muted small">Corruption rises through bargains, rituals, surrender, catastrophic exposure, and certain gifts. It falls only through costly resistance, restoration, or story milestones—not routine rests.</p>
        </div>
        <div class="detail-block">
          <div class="detail-label">Example Awakened Gifts (generic)</div>
          <ul class="trait-list">
            ${(u.awakenedGiftsGeneric||[]).map(g => `<li><strong>${escapeHtml(g.name)}.</strong> ${escapeHtml(g.text)}</li>`).join('') || '<li class="muted">See Shard profiles in the DMG for full lists.</li>'}
          </ul>
        </div>
        <div class="detail-block">
          <div class="detail-label">Example Ascendant Gifts (generic)</div>
          <ul class="trait-list">
            ${(u.ascendantGiftsGeneric||[]).map(g => `<li><strong>${escapeHtml(g.name)}.</strong> ${escapeHtml(g.text)}</li>`).join('') || ''}
          </ul>
        </div>
        <div class="detail-block"><div class="detail-label">Dark Bargains</div><p class="detail-text">${escapeHtml(u.darkBargains)}</p></div>
        <div class="detail-block"><div class="detail-label">Shard Demands (Dominion+)</div><p class="detail-text">${escapeHtml(u.shardDemands)}</p></div>
        <div class="detail-block">
          <div class="detail-label">The Seven Shards</div>
          <table class="prog-table">
            <thead><tr><th>Shard</th><th>World</th><th>Common Awakening</th><th>Theme</th></tr></thead>
            <tbody>${shards}</tbody>
          </table>
        </div>
        <div class="detail-block"><div class="detail-label">Umbraria Context</div><p class="detail-text">${escapeHtml(u.umbrariaContext || '')}</p></div>
        ${raceHtml}
        <div class="detail-block"><div class="detail-label">Running NPC Umbrarians</div><p class="detail-text">${escapeHtml(u.npcGuidance || '')}</p></div>
        <div class="detail-block"><div class="detail-label">Player Characters</div><p class="detail-text">${escapeHtml(u.pcGuidance || '')}</p></div>
        <p class="muted small">${escapeHtml(u.sources || '')}</p>
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
    try { applyCompendiumToRuntime(); } catch (e) { console.warn(e); }
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
    
    const impCharBtn = $('#import-character-btn');
    const impCharFile = $('#import-character-file');
    if (impCharBtn && impCharFile && !impCharBtn.dataset.wired) {
      impCharBtn.dataset.wired = '1';
      impCharBtn.addEventListener('click', () => impCharFile.click());
      impCharFile.addEventListener('change', () => {
        const f = impCharFile.files && impCharFile.files[0];
        if (f) importCharacterJson(f, false);
        impCharFile.value = '';
      });
    }

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
