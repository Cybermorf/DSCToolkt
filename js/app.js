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

    function getBestiaryList() {
      if (window.BESTIARY_MERGED && window.BESTIARY_MERGED.length) return window.BESTIARY_MERGED;
      return (typeof window !== 'undefined' && window.BESTIARY_DATA) ? window.BESTIARY_DATA : [];
    }
    // legacy alias used in closures — always call getBestiaryList()
    let BESTIARY = getBestiaryList();
    function refreshBestiaryRef() { BESTIARY = getBestiaryList(); }
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
    const panel = $('.modal-content') || $('.modal-panel');
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
          let ok = true;
          try {
            ok = onConfirm();
          } catch (err) {
            console.error('Save failed', err);
            if (typeof toast === 'function') toast('Save failed: ' + (err.message || err));
            return;
          }
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
        const name = $('#m-name')?.value?.trim();
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


  // ─── Feats library (SRD core + imported Open5e) ─────────────────────────
  const SRD_FEATS = [
    { id: 'alert', name: 'Alert', prerequisite: '', text: 'You gain a +5 bonus to initiative, you can\'t be surprised while conscious, and other creatures don\'t gain advantage on attack rolls against you as a result of being unseen by you.' },
    { id: 'athlete', name: 'Athlete', prerequisite: '', text: 'Increase STR or DEX by 1. Standing from prone costs only 5 feet of movement. Climbing doesn\'t cost extra movement. You can make a running long jump or high jump after moving only 5 feet.' },
    { id: 'actor', name: 'Actor', prerequisite: '', text: 'Increase CHA by 1. Advantage on Deception and Performance when passing yourself off as someone else. You can mimic speech or sounds; Insight vs your Deception to detect the mimicry.' },
    { id: 'charger', name: 'Charger', prerequisite: '', text: 'When you use Dash and move at least 10 feet in a straight line toward a target, you can make one melee attack or shove as a bonus action with +5 damage or an extra 10 feet of shove distance.' },
    { id: 'crossbow-expert', name: 'Crossbow Expert', prerequisite: '', text: 'Ignore the loading property of crossbows you are proficient with. Being within 5 feet of a hostile creature doesn\'t impose disadvantage on your ranged attack rolls. When you use the Attack action with a one-handed weapon, you can fire a hand crossbow as a bonus action.' },
    { id: 'defensive-duelist', name: 'Defensive Duelist', prerequisite: 'DEX 13+', text: 'When you are hit by a melee attack while wielding a finesse weapon you are proficient with, you can use your reaction to add your proficiency bonus to your AC for that attack.' },
    { id: 'dual-wielder', name: 'Dual Wielder', prerequisite: '', text: '+1 AC while dual-wielding. You can dual-wield weapons that aren\'t light. You can draw or stow two one-handed weapons when you would normally draw or stow only one.' },
    { id: 'dungeon-delver', name: 'Dungeon Delver', prerequisite: '', text: 'Advantage on Perception and Investigation to detect secret doors. Advantage on saves vs traps; resistance to trap damage. You can search for traps while traveling at a normal pace.' },
    { id: 'durable', name: 'Durable', prerequisite: '', text: 'Increase CON by 1. When you roll a Hit Die to regain HP, the minimum you regain equals twice your CON modifier (minimum 2).' },
    { id: 'elemental-adept', name: 'Elemental Adept', prerequisite: 'Spellcasting', text: 'Choose a damage type: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to that type. Any 1 on a damage die for that type becomes a 2.' },
    { id: 'grappler', name: 'Grappler', prerequisite: 'STR 13+', text: 'Advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you (another grapple check); on a success, you and the creature are both restrained.' },
    { id: 'great-weapon-master', name: 'Great Weapon Master', prerequisite: '', text: 'On a melee critical hit or when you reduce a creature to 0 HP with a melee attack, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon you are proficient with, you can take -5 to hit for +10 damage.' },
    { id: 'healer', name: 'Healer', prerequisite: '', text: 'When you use a healer\'s kit to stabilize, the creature also regains 1 HP. As an action, you can spend one use of a healer\'s kit to restore 1d6 + 4 + character level HP (once per creature per short rest).' },
    { id: 'heavily-armored', name: 'Heavily Armored', prerequisite: 'Medium armor proficiency', text: 'Increase STR by 1. You gain proficiency with heavy armor.' },
    { id: 'heavy-armor-master', name: 'Heavy Armor Master', prerequisite: 'Heavy armor proficiency', text: 'Increase STR by 1. While wearing heavy armor, bludgeoning, piercing, and slashing damage from nonmagical attacks is reduced by 3.' },
    { id: 'inspiring-leader', name: 'Inspiring Leader', prerequisite: 'CHA 13+', text: 'Spend 10 minutes inspiring up to six friendly creatures (including yourself) within 30 feet. Each gains temporary HP equal to your level + CHA modifier. A creature can\'t benefit again until it finishes a short or long rest.' },
    { id: 'keen-mind', name: 'Keen Mind', prerequisite: '', text: 'Increase INT by 1. Always know which way is north and the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.' },
    { id: 'lightly-armored', name: 'Lightly Armored', prerequisite: '', text: 'Increase STR or DEX by 1. You gain proficiency with light armor.' },
    { id: 'linguist', name: 'Linguist', prerequisite: '', text: 'Increase INT by 1. Learn three languages. Create written ciphers; INT (Investigation) DC equals your INT score + proficiency bonus to decipher.' },
    { id: 'lucky', name: 'Lucky', prerequisite: '', text: 'You have 3 luck points. Spend one to roll an additional d20 when you make an attack, ability check, or saving throw, or when an attack is made against you; choose which die to use. Regain expended luck points after a long rest.' },
    { id: 'mage-slayer', name: 'Mage Slayer', prerequisite: '', text: 'When a creature within 5 feet casts a spell, you can use your reaction to make a melee weapon attack against that creature. You have advantage on saving throws against spells cast by creatures within 5 feet of you.' },
    { id: 'magic-initiate', name: 'Magic Initiate', prerequisite: '', text: 'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. Learn two cantrips and one 1st-level spell from that class. You can cast the 1st-level spell once per long rest. Spellcasting ability matches that class.' },
    { id: 'martial-adept', name: 'Martial Adept', prerequisite: '', text: 'Learn two maneuvers from the Battle Master list. Gain one superiority die (d6), recovered on short or long rest.' },
    { id: 'medium-armor-master', name: 'Medium Armor Master', prerequisite: 'Medium armor proficiency', text: 'Wearing medium armor doesn\'t impose disadvantage on Stealth. When you wear medium armor, you can add 3 (instead of 2) to AC if your DEX is 16+.' },
    { id: 'mobile', name: 'Mobile', prerequisite: '', text: 'Your speed increases by 10 feet. When you use Dash, difficult terrain doesn\'t cost extra movement that turn. After you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn.' },
    { id: 'moderately-armored', name: 'Moderately Armored', prerequisite: 'Light armor proficiency', text: 'Increase STR or DEX by 1. You gain proficiency with medium armor and shields.' },
    { id: 'mounted-combatant', name: 'Mounted Combatant', prerequisite: '', text: 'Advantage on melee attacks against unmounted creatures smaller than your mount. Force an attack targeting your mount to target you instead. If your mount is subjected to an effect that allows a DEX save for half damage, it takes no damage on a success and half on a failure.' },
    { id: 'observant', name: 'Observant', prerequisite: '', text: 'Increase INT or WIS by 1. If you can see a creature\'s mouth while it speaks a language you understand, you can read its lips. Your passive Perception and Investigation scores increase by 5.' },
    { id: 'polearm-master', name: 'Polearm Master', prerequisite: '', text: 'When you take the Attack action with a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end (d4 bludgeoning). While wielding those weapons, other creatures provoke an opportunity attack when they enter your reach.' },
    { id: 'resilient', name: 'Resilient', prerequisite: '', text: 'Increase one ability score by 1 and gain proficiency in saving throws using that ability.' },
    { id: 'ritual-caster', name: 'Ritual Caster', prerequisite: 'INT or WIS 13+', text: 'You gain a ritual book with two 1st-level ritual spells from one class (bard, cleric, druid, sorcerer, warlock, or wizard). You can only cast these as rituals. You can add more ritual spells to the book as you find them.' },
    { id: 'savage-attacker', name: 'Savage Attacker', prerequisite: '', text: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.' },
    { id: 'sentinel', name: 'Sentinel', prerequisite: '', text: 'When you hit a creature with an opportunity attack, its speed becomes 0 for the rest of the turn. Creatures provoke opportunity attacks from you even if they take the Disengage action. When a creature within 5 feet attacks a target other than you (and that target doesn\'t have this feat), you can use your reaction to make a melee weapon attack against the attacker.' },
    { id: 'sharpshooter', name: 'Sharpshooter', prerequisite: '', text: 'Attacking at long range doesn\'t impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half and three-quarters cover. Before you make a ranged attack with a weapon you are proficient with, you can take -5 to hit for +10 damage.' },
    { id: 'shield-master', name: 'Shield Master', prerequisite: '', text: 'If you take the Attack action on your turn, you can use a bonus action to shove with your shield. If you aren\'t incapacitated, you can add your shield\'s AC bonus to a DEX save that targets only you. If an effect allows a DEX save for half damage, you can use your reaction to take no damage on a success.' },
    { id: 'skilled', name: 'Skilled', prerequisite: '', text: 'You gain proficiency in any combination of three skills or tools of your choice.' },
    { id: 'skulker', name: 'Skulker', prerequisite: 'DEX 13+', text: 'You can try to hide when you are lightly obscured. When you are hidden and miss with a ranged weapon attack, making the attack doesn\'t reveal your position. Dim light doesn\'t impose disadvantage on your Wisdom (Perception) checks relying on sight.' },
    { id: 'spell-sniper', name: 'Spell Sniper', prerequisite: 'Spellcasting', text: 'When you cast a spell that requires an attack roll, the spell\'s range is doubled. Your ranged spell attacks ignore half and three-quarters cover. You learn one cantrip that requires an attack roll (from bard, cleric, druid, sorcerer, warlock, or wizard).' },
    { id: 'tavern-brawler', name: 'Tavern Brawler', prerequisite: '', text: 'Increase STR or CON by 1. You are proficient with improvised weapons and unarmed strikes. Unarmed strike uses a d4. When you hit with an unarmed strike or improvised weapon, you can use a bonus action to attempt to grapple the target.' },
    { id: 'tough', name: 'Tough', prerequisite: '', text: 'Your hit point maximum increases by 2 × your level when you gain this feat, and by 2 whenever you gain a level thereafter.' },
    { id: 'war-caster', name: 'War Caster', prerequisite: 'Spellcasting', text: 'Advantage on CON saves to maintain concentration. You can perform somatic components even when hands are full with weapons or a shield. When a creature\'s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at it (1 action casting time, targets only that creature) instead of making an opportunity attack.' },
    { id: 'weapon-master', name: 'Weapon Master', prerequisite: '', text: 'Increase STR or DEX by 1. You gain proficiency with four simple or martial weapons of your choice.' }
  ];

  function getFeatLibrary() {
    const byId = new Map();
    SRD_FEATS.forEach(f => byId.set(f.id, { ...f, source: 'SRD' }));
    // Open5e / imported feats stored on equipment with isFeat
    const equip = (typeof window !== 'undefined' && window.EQUIPMENT) ? window.EQUIPMENT : [];
    equip.forEach(e => {
      if (!e || !e.isFeat) return;
      const name = String(e.name || '').replace(/\s*\(Feat\)\s*$/i, '').trim();
      const id = e.id || ('feat-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      if (!byId.has(id) && ! [...byId.values()].some(x => x.name.toLowerCase() === name.toLowerCase())) {
        byId.set(id, {
          id,
          name,
          prerequisite: '',
          text: e.notes || e.description || '',
          source: e.source || 'Imported'
        });
      }
    });
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function findFeat(idOrName) {
    if (!idOrName) return null;
    const k = String(idOrName).toLowerCase();
    return getFeatLibrary().find(f => f.id === k || f.name.toLowerCase() === k) || null;
  }

  function featsEditorHtml(ch) {
    const selected = Array.isArray(ch.feats) ? ch.feats : [];
    const selIds = new Set(selected.map(f => (f.id || f.name || '').toLowerCase()));
    const chips = selected.map((f, i) => {
      const name = f.name || findFeat(f.id)?.name || f.id;
      return `<span class="feat-chip" data-feat-id="${escapeAttr(f.id || name)}">${escapeHtml(name)} <button type="button" class="feat-remove" data-idx="${i}" title="Remove">×</button></span>`;
    }).join('');
    const asiLevels = [4, 8, 12, 16, 19];
    const total = totalCharacterLevel(ch);
    const classLevels = normalizeClassLevels(ch);
    const asiNotes = [];
    classLevels.forEach(c => {
      asiLevels.forEach(L => {
        if (c.level >= L) asiNotes.push(`${c.name} L${L}`);
      });
    });
    return `
      <div class="sheet-section" id="m-feats-section">
        <label class="section-label">Feats</label>
        <p class="muted small">Select feats from the SRD list or Open5e-imported feats (Tools → Sync Feats). ASI levels: 4 / 8 / 12 / 16 / 19 per class.</p>
        ${asiNotes.length ? `<p class="muted small">ASI / feat slots reached: <strong>${asiNotes.join(', ')}</strong></p>` : ''}
        <div id="m-feats-selected" class="feat-chips">${chips || '<span class="muted small">No feats selected</span>'}</div>
        <div class="form-row">
          <div class="field" style="flex:1">
            <label>Add feat</label>
            <input type="search" id="m-feat-search" placeholder="Search feats…" />
            <select id="m-feat-pick" size="6" style="width:100%;margin-top:0.35rem">
              ${getFeatLibrary().map(f => `<option value="${escapeAttr(f.id)}" title="${escapeAttr((f.prerequisite ? 'Prereq: ' + f.prerequisite + ' — ' : '') + f.text)}">${escapeHtml(f.name)}${f.prerequisite ? ' *' : ''}</option>`).join('')}
            </select>
          </div>
        </div>
        <p class="muted small" id="m-feat-detail"></p>
        <button type="button" class="btn secondary btn-tiny" id="m-feat-add">Add selected feat</button>
        <input type="hidden" id="m-feats-json" value="${escapeAttr(JSON.stringify(selected))}" />
      </div>`;
  }

  function wireFeatsEditor() {
    const search = document.getElementById('m-feat-search');
    const pick = document.getElementById('m-feat-pick');
    const detail = document.getElementById('m-feat-detail');
    const hidden = document.getElementById('m-feats-json');
    const selectedBox = document.getElementById('m-feats-selected');
    if (!pick || !hidden) return;

    function getSelected() {
      try { return JSON.parse(hidden.value || '[]'); } catch (e) { return []; }
    }
    function setSelected(list) {
      hidden.value = JSON.stringify(list);
      selectedBox.innerHTML = list.length
        ? list.map((f, i) => {
            const name = f.name || findFeat(f.id)?.name || f.id;
            return `<span class="feat-chip" data-feat-id="${escapeAttr(f.id || name)}">${escapeHtml(name)} <button type="button" class="feat-remove" data-idx="${i}" title="Remove">×</button></span>`;
          }).join('')
        : '<span class="muted small">No feats selected</span>';
      selectedBox.querySelectorAll('.feat-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const arr = getSelected();
          arr.splice(Number(btn.dataset.idx), 1);
          setSelected(arr);
        });
      });
    }
    setSelected(getSelected());

    search?.addEventListener('input', () => {
      const q = (search.value || '').toLowerCase();
      [...pick.options].forEach(opt => {
        opt.hidden = q && !opt.textContent.toLowerCase().includes(q);
      });
    });
    pick.addEventListener('change', () => {
      const f = findFeat(pick.value);
      if (detail && f) {
        detail.innerHTML = `<strong>${escapeHtml(f.name)}</strong>${f.prerequisite ? ' · <em>Prerequisite: ' + escapeHtml(f.prerequisite) + '</em>' : ''}<br>${escapeHtml(f.text)}`;
      }
    });
    document.getElementById('m-feat-add')?.addEventListener('click', () => {
      const f = findFeat(pick.value);
      if (!f) { toast('Select a feat'); return; }
      const arr = getSelected();
      if (arr.some(x => (x.id || x.name || '').toLowerCase() === f.id || (x.name || '').toLowerCase() === f.name.toLowerCase())) {
        toast('Feat already added');
        return;
      }
      arr.push({ id: f.id, name: f.name, text: f.text, prerequisite: f.prerequisite || '' });
      setSelected(arr);
      // Append short line to features if not present
      const featTa = document.getElementById('m-features');
      if (featTa && !featTa.value.includes(f.name)) {
        const line = `Feat — ${f.name}. ${f.text}`;
        featTa.value = (featTa.value ? featTa.value.trim() + '\\n\\n' : '') + line;
      }
      toast('Added ' + f.name);
    });
  }

  function collectFeatsFromForm() {
    const hidden = document.getElementById('m-feats-json');
    if (!hidden) return [];
    try { return JSON.parse(hidden.value || '[]'); } catch (e) { return []; }
  }

  function featsSheetHtml(ch) {
    const list = Array.isArray(ch.feats) ? ch.feats : [];
    if (!list.length) return '';
    return `<div class="cs-panel"><div class="cs-panel-title">Feats</div>
      <ul class="trait-list compact">
        ${list.map(f => {
          const full = findFeat(f.id) || f;
          const prereq = full.prerequisite ? ` <span class="muted small">(${escapeHtml(full.prerequisite)})</span>` : '';
          return `<li><strong>${escapeHtml(full.name || f.name)}</strong>${prereq}. ${escapeHtml(full.text || f.text || '')}</li>`;
        }).join('')}
      </ul>
    </div>`;
  }




  // ─── Class resource pools (Ki, Lunar Charges, Rage, Channel Divinity, etc.) ─
  function lunarChargesMax(mgLevel) {
    const L = clamp(Number(mgLevel) || 0, 0, 40);
    if (L < 2) return 0;
    if (L < 5) return 2;
    if (L < 9) return 3;
    if (L < 13) return 4;
    if (L < 17) return 5;
    let n = 6;
    if (L >= 10) n += 1;
    if (L >= 17) n += 1;
    return n;
  }

  function classResourcesForCharacter(ch) {
    const list = normalizeClassLevels(ch);
    const resources = [];
    const push = (id, label, max, recover, className) => {
      if (max <= 0) return;
      resources.push({
        id,
        label,
        max,
        recover: recover || '',
        className: className || ''
      });
    };

    list.forEach(c => {
      const name = c.name;
      const lvl = clamp(Number(c.level) || 1, 1, 40);
      const sub = (c.subclass || '').toLowerCase();

      // Monk
      if (name === 'Monk' && lvl >= 2) {
        push('ki', 'Ki Points', lvl, 'Short Rest', 'Monk');
      }
      // Moon Guardian
      if (name === 'Moon Guardian' && lvl >= 2) {
        push('lunar', 'Lunar Charges', lunarChargesMax(lvl), 'Long Rest; Lunar Recovery (half on Short Rest, 1/LR)', 'Moon Guardian');
      }
      // Barbarian
      if (name === 'Barbarian') {
        const rage = lvl < 3 ? 2 : lvl < 6 ? 3 : lvl < 12 ? 4 : lvl < 17 ? 5 : lvl < 20 ? 6 : 99;
        push('rage', 'Rages', rage === 99 ? 99 : rage, 'Long Rest (unlimited at 20)', 'Barbarian');
      }
      // Sorcerer
      if (name === 'Sorcerer' && lvl >= 1) {
        push('sorcery', 'Sorcery Points', lvl, 'Long Rest', 'Sorcerer');
      }
      // Warlock — pact slots tracked in spell slots; Arcane Focus uses separate
      if (name === 'Warlock' && lvl >= 11) {
        // Mystic Arcanum not a pool
      }
      // Fighter — Action Surge / Second Wind / Superiority
      if (name === 'Fighter') {
        if (lvl >= 1) push('second-wind', 'Second Wind', 1, 'Short Rest', 'Fighter');
        if (lvl >= 2) push('action-surge', 'Action Surge', lvl >= 17 ? 2 : 1, 'Short Rest', 'Fighter');
        if (lvl >= 9) push('indomitable', 'Indomitable', lvl >= 17 ? 3 : lvl >= 13 ? 2 : 1, 'Long Rest', 'Fighter');
        if (/battle.?master|battlemaster/i.test(sub) && lvl >= 3) {
          const die = lvl < 7 ? 4 : lvl < 15 ? 5 : 6;
          push('superiority', 'Superiority Dice', die, 'Short Rest', 'Fighter');
        }
      }
      // Rogue — no major pool (Sneak Attack is dice)
      // Cleric / Paladin Channel Divinity
      if (name === 'Cleric' && lvl >= 2) {
        const chd = lvl >= 18 ? 3 : lvl >= 6 ? 2 : 1;
        push('channel-divinity', 'Channel Divinity', chd, 'Short Rest', 'Cleric');
      }
      if (name === 'Paladin' && lvl >= 3) {
        push('channel-divinity', 'Channel Divinity', 1, 'Short Rest', 'Paladin');
        // Lay on Hands
        push('lay-on-hands', 'Lay on Hands (HP pool)', lvl * 5, 'Long Rest', 'Paladin');
      }
      // Druid Wild Shape
      if (name === 'Druid' && lvl >= 2) {
        push('wild-shape', 'Wild Shape', 2, 'Short Rest', 'Druid');
      }
      // Bard Bardic Inspiration
      if (name === 'Bard' && lvl >= 1) {
        const cha = Number(ch.cha) || 10;
        const uses = Math.max(1, Math.floor((cha - 10) / 2));
        push('bardic', 'Bardic Inspiration', uses, lvl >= 5 ? 'Short Rest' : 'Long Rest', 'Bard');
      }
      // Ranger — Favored Foe optional; skip
      // Bloodhunter
      if (name === 'Bloodhunter') {
        push('blood-maledict', 'Blood Maledict', Math.max(1, Math.floor((lvl - 1) / 6) + 1), 'Short Rest', 'Bloodhunter');
        if (lvl >= 2) {
          // Rite - often at-will after unlock; track crimson rite as optional
        }
      }
      // Ghostblade
      if (name === 'Ghostblade' && lvl >= 2) {
        push('spirit-step', 'Spirit Step', Math.max(1, Math.ceil(lvl / 4)), 'Short Rest', 'Ghostblade');
      }
      // Shadowblade
      if (name === 'Shadowblade' && lvl >= 2) {
        push('shadow-surge', 'Shadow Surge', Math.max(1, Math.ceil(lvl / 3)), 'Short Rest', 'Shadowblade');
      }
      // Wizard Arcane Recovery (special - slots not points)
      if (name === 'Wizard' && lvl >= 1) {
        push('arcane-recovery', 'Arcane Recovery (used)', 1, 'Long Rest (recover slots ≤ half wizard level on Short Rest once)', 'Wizard');
      }
    });

    // Deduplicate ids (e.g. two Channel Divinity sources) — keep highest max
    const byId = new Map();
    resources.forEach(r => {
      const prev = byId.get(r.id);
      if (!prev || prev.max < r.max) byId.set(r.id, r);
      else if (prev && prev.className !== r.className) {
        byId.set(r.id, { ...prev, label: prev.label, className: prev.className + ' + ' + r.className });
      }
    });
    return [...byId.values()];
  }

  function resourcesSheetHtml(ch, opts = {}) {
    const res = classResourcesForCharacter(ch);
    if (!res.length) return '';
    const used = ch.resourceUsed && typeof ch.resourceUsed === 'object' ? ch.resourceUsed : {};
    const compact = !!opts.compact;
    const pills = res.map(r => {
      const u = used[r.id] != null ? Number(used[r.id]) : 0;
      const remaining = Math.max(0, (r.max >= 99 ? r.max : r.max) - u);
      const showMax = r.max >= 99 ? '∞' : String(r.max);
      const showRem = r.max >= 99 ? (u ? String(Math.max(0, 99 - u)) : '∞') : String(Math.max(0, r.max - u));
      // Display remaining / max (more intuitive than used/max for combat)
      const left = r.max >= 99 ? '∞' : Math.max(0, r.max - u);
      return `<div class="cs-resource-pill" title="${escapeAttr((r.className ? r.className + ' · ' : '') + (r.recover || ''))}">
        <div class="cs-res-name">${escapeHtml(r.label)}</div>
        <div class="cs-res-val"><span class="cs-res-left">${left}</span><span class="cs-res-sep">/</span><span class="cs-res-max">${showMax}</span></div>
        <div class="cs-res-sub muted small">${escapeHtml(r.className || '')}${r.recover ? ' · ' + escapeHtml(r.recover) : ''}</div>
      </div>`;
    }).join('');
    if (compact) {
      return `<div class="cs-resource-bar cs-resource-bar-compact">${pills}</div>`;
    }
    return `<div class="cs-panel cs-resources-panel">
      <div class="cs-panel-title">Class Resources</div>
      <p class="muted small" style="margin:0 0 0.35rem">Remaining / Max (tracked from Edit sheet). Short Rest: Ki, Channel Divinity, Wild Shape, Superiority, Second Wind… · Long Rest: Rage, Sorcery, Lunar, Lay on Hands…</p>
      <div class="cs-resource-bar">${pills}</div>
    </div>`;
  }

  function resourcesEditorHtml(ch) {
    const res = classResourcesForCharacter(ch);
    if (!res.length) return '';
    const used = ch.resourceUsed && typeof ch.resourceUsed === 'object' ? ch.resourceUsed : {};
    return `<div class="sheet-section" id="m-resources-section">
      <label class="section-label">Class Resources / Charges</label>
      <p class="muted small">Track <strong>used</strong> points. View sheet shows remaining. Multiclass lists every pool (Ki, Lunar Charges, Rage, Blood Maledict, etc.).</p>
      <div class="resource-track">
        ${res.map(r => {
          const u = used[r.id] != null ? used[r.id] : 0;
          const maxLabel = r.max >= 99 ? '∞' : r.max;
          return `<div class="res-stepper" data-res="${escapeAttr(r.id)}" data-max="${r.max >= 99 ? 99 : r.max}" title="${escapeAttr((r.className || '') + ' · ' + (r.recover || ''))}">
            <span class="res-label">${escapeHtml(r.label)}${r.className ? ' <span class="muted">(' + escapeHtml(r.className) + ')</span>' : ''}</span>
            <button type="button" class="res-dec">−</button>
            <span class="res-val">${u}</span>
            <span class="res-max">used / ${maxLabel}</span>
            <button type="button" class="res-inc">+</button>
            <input type="hidden" class="m-resource" data-res="${escapeAttr(r.id)}" value="${u}" />
            <span class="muted small">${escapeHtml(r.recover || '')}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function collectResourcesFromForm() {
    const used = {};
    document.querySelectorAll('.m-resource').forEach(inp => {
      used[inp.dataset.res] = clamp(parseInt(inp.value, 10) || 0, 0, 99);
    });
    return used;
  }


  // ─── Feature / ability / feat searchable compendium ──────────────────────
  function buildFeatureCompendiumEntries() {
    const entries = [];
    const abilities = (typeof window !== 'undefined' && window.CLASS_ABILITIES) ? window.CLASS_ABILITIES : {};
    Object.keys(abilities).forEach(cls => {
      (abilities[cls] || []).forEach(a => {
        entries.push({
          type: 'Class Feature',
          source: cls,
          name: a.name || 'Feature',
          level: a.lvl,
          text: (typeof resolveFeaturePlaceholders === 'function' ? resolveFeaturePlaceholders(a.text || '', ch) : (a.text || ''))
        });
      });
    });
    getPhbClasses().forEach(cls => {
      (cls.progression || []).forEach(([lvl, feat]) => {
        entries.push({
          type: 'Progression',
          source: cls.name,
          name: String(feat),
          level: lvl,
          text: `${cls.name} level ${lvl}: ${feat}`
        });
      });
    });
    getMoonPaths().forEach(p => {
      (p.features || []).forEach(f => {
        entries.push({
          type: 'Moon Path',
          source: p.name + ' (' + (p.world || '') + ')',
          name: f.name,
          level: f.lvl,
          text: f.text || ''
        });
      });
    });
    getPhbRaces().forEach(r => {
      (r.traits || []).forEach(tr => {
        entries.push({
          type: 'Racial Trait',
          source: r.name,
          name: tr.name,
          level: null,
          text: tr.text || ''
        });
      });
    });
    if (typeof getFeatLibrary === 'function') {
      getFeatLibrary().forEach(f => {
        entries.push({
          type: 'Feat',
          source: f.source || 'SRD',
          name: f.name,
          level: null,
          text: (f.prerequisite ? 'Prerequisite: ' + f.prerequisite + '. ' : '') + (f.text || '')
        });
      });
    }
    return entries;
  }

  function renderFeatureCompendium(root) {
    if (!root) return;
    root.innerHTML = `
      <div class="compendium-panel">
        <h3>Feature, Ability &amp; Feat Compendium</h3>
        <p class="muted small">Search class features, progression, Moon Paths, racial traits, and feats.</p>
        <div class="form-row">
          <div class="field" style="flex:2"><label>Search</label>
            <input type="search" id="feat-comp-q" placeholder="e.g. Lunar Charges, Extra Attack, Alert…" />
          </div>
          <div class="field"><label>Type</label>
            <select id="feat-comp-type">
              <option value="all">All</option>
              <option value="Class Feature">Class Features</option>
              <option value="Progression">Progression</option>
              <option value="Moon Path">Moon Paths</option>
              <option value="Racial Trait">Racial Traits</option>
              <option value="Feat">Feats</option>
            </select>
          </div>
        </div>
        <div id="feat-comp-results" class="feature-compendium-results muted small">Type to search…</div>
      </div>`;
    const all = buildFeatureCompendiumEntries();
    function run() {
      const q = ($('#feat-comp-q')?.value || '').trim().toLowerCase();
      const ty = $('#feat-comp-type')?.value || 'all';
      let list = all;
      if (ty !== 'all') list = list.filter(e => e.type === ty);
      if (q) list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q) ||
        (e.text || '').toLowerCase().includes(q)
      );
      list = list.slice(0, 80);
      const box = $('#feat-comp-results');
      if (!box) return;
      if (!list.length) { box.innerHTML = '<p class="muted">No matches.</p>'; return; }
      box.innerHTML = list.map(e => `
        <div class="feature-comp-item">
          <strong>${escapeHtml(e.name)}</strong>
          <span class="muted small"> · ${escapeHtml(e.type)} · ${escapeHtml(e.source)}${e.level != null ? ' · L' + e.level : ''}</span>
          <div class="detail-text" style="margin-top:0.2rem">${escapeHtml(e.text)}</div>
        </div>`).join('');
    }
    $('#feat-comp-q')?.addEventListener('input', run);
    $('#feat-comp-type')?.addEventListener('change', run);
    run();
  }


  function normalizeCharacter(ch) {
    // Preserve extension fields
    const _ext = {
      inspiration: ch.inspiration,
      deathSaves: ch.deathSaves,
      conditions: ch.conditions,
      attunement: ch.attunement,
      background: ch.background,
      spellPrepMode: ch.spellPrepMode,
      preparedSpells: ch.preparedSpells
    };

    ch = ch || {};
    const _mc = normalizeClassLevels(ch);
    if (_mc.length && _mc[0].name) {
      ch.classes = _mc;
      ch.level = _mc.reduce((s, c) => s + c.level, 0) || ch.level || 1;
      ch.class = _mc[0].name;
      if (_mc[0].subclass) ch.subclass = _mc[0].subclass;
      ch.profBonus = ch.profBonus || profBonusForTotalLevel(ch.level);
    }

    return {
      id: ch.id,
      name: ch.name || '',
      player: ch.player || '',
      type: ch.type || (ch.player === 'NPC' ? 'ally' : 'pc'),
      class: ch.class || '',
      subclass: ch.subclass || '',
      level: clamp(Number(ch.level) || 1, 1, 40),
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
      classes: normalizeClassLevels(ch),
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
      spells: ch.spells || '',
      spellIds: Array.isArray(ch.spellIds) ? ch.spellIds : [],
      notes: ch.notes || '',
      avatar: ch.avatar || '',
      inspiration: !!ch.inspiration,
      deathSaves: ch.deathSaves && typeof ch.deathSaves === 'object' ? ch.deathSaves : { successes: 0, failures: 0 },
      conditions: Array.isArray(ch.conditions) ? ch.conditions : [],
      attunement: Array.isArray(ch.attunement) ? ch.attunement : [],
      spellPrepMode: ch.spellPrepMode || 'known',
      preparedSpells: ch.preparedSpells || '',
      umbrarianLocked: !!ch.umbrarianLocked,
      feats: Array.isArray(ch.feats) ? ch.feats : [],
      resourceUsed: ch.resourceUsed && typeof ch.resourceUsed === 'object' ? ch.resourceUsed : {}
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


  function multiclassProgressionHtml(ch) {
    const list = normalizeClassLevels(ch);
    if (!list.length) {
      return progressionTableHtml(ch.class || '');
    }
    return list.map(c => {
      const sub = c.subclass ? ` <span class="muted small">(${escapeHtml(c.subclass)})</span>` : '';
      return `<div class="mc-prog-block" style="margin-bottom:1rem">
        <h4 class="section-label" style="margin-bottom:0.35rem">${escapeHtml(c.name)} ${c.level}${sub}</h4>
        ${progressionTableHtml(c.name)}
      </div>`;
    }).join('');
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
  
  
  
  
  

  const COMPENDIUM_IDB_NAME = 'dsc-toolkt';
  const COMPENDIUM_IDB_STORE = 'compendium';
  const COMPENDIUM_IDB_KEY = 'user';
  let _compendiumCache = null;
  let _compendiumSaveTimer = null;

  function emptyCompendium() {
    return { spells: [], equipment: [], creatures: [], meta: {} };
  }

  function openCompendiumDb() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB unavailable'));
        return;
      }
      const req = indexedDB.open(COMPENDIUM_IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(COMPENDIUM_IDB_STORE)) {
          db.createObjectStore(COMPENDIUM_IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IDB open failed'));
    });
  }

  async function idbGetCompendium() {
    const db = await openCompendiumDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(COMPENDIUM_IDB_STORE, 'readonly');
      const store = tx.objectStore(COMPENDIUM_IDB_STORE);
      const req = store.get(COMPENDIUM_IDB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbSetCompendium(data) {
    const db = await openCompendiumDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(COMPENDIUM_IDB_STORE, 'readwrite');
      const store = tx.objectStore(COMPENDIUM_IDB_STORE);
      const req = store.put(data, COMPENDIUM_IDB_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  function getUserCompendium() {
    if (_compendiumCache) return _compendiumCache;
    // Synchronous fallback: try tiny localStorage stub / legacy, else empty
    try {
      const legacy = localStorage.getItem('dsc_compendium_extra');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        _compendiumCache = {
          spells: parsed.spells || [],
          equipment: parsed.equipment || [],
          creatures: parsed.creatures || [],
          meta: parsed.meta || {}
        };
        return _compendiumCache;
      }
    } catch (e) {
      // quota or parse error — ignore
    }
    _compendiumCache = emptyCompendium();
    return _compendiumCache;
  }

  function saveUserCompendium(data) {
    const normalized = {
      spells: data.spells || [],
      equipment: data.equipment || [],
      creatures: data.creatures || [],
      meta: data.meta || {}
    };
    _compendiumCache = normalized;
    // Persist to IndexedDB (large capacity). Debounce rapid writes.
    if (_compendiumSaveTimer) clearTimeout(_compendiumSaveTimer);
    _compendiumSaveTimer = setTimeout(() => {
      idbSetCompendium(normalized).then(() => {
        // Drop legacy localStorage copy so it cannot blow the quota
        try { localStorage.removeItem('dsc_compendium_extra'); } catch (e) {}
        // Keep only a tiny pointer in localStorage
        try {
          localStorage.setItem('dsc_compendium_meta', JSON.stringify({
            backend: 'indexeddb',
            spells: normalized.spells.length,
            equipment: normalized.equipment.length,
            creatures: normalized.creatures.length,
            updatedAt: normalized.meta?.updatedAt || new Date().toISOString()
          }));
        } catch (e) {}
      }).catch(err => {
        console.warn('IndexedDB save failed', err);
        // Last resort: try trimmed localStorage (no creature descriptions)
        try {
          const slim = {
            spells: normalized.spells,
            equipment: normalized.equipment,
            creatures: (normalized.creatures || []).map(c => ({
              n: c.n, w: c.w, o: c.o || 'Imported', classif: c.classif,
              cr: c.cr, ac: c.ac, hp: c.hp, speed: c.speed,
              str: c.str, dex: c.dex, con: c.con, int: c.int, wis: c.wis, cha: c.cha,
              source: c.source, _src: c._src || 'Imported', _key: c._key,
              desc: (c.desc || '').slice(0, 280)
            })),
            meta: { ...(normalized.meta || {}), trimmed: true }
          };
          localStorage.setItem('dsc_compendium_extra', JSON.stringify(slim));
        } catch (e2) {
          console.warn('localStorage fallback also failed', e2);
          if (typeof toast === 'function') toast('Storage full — could not save full compendium');
        }
      });
    }, 50);
  }

  async function loadUserCompendiumAsync() {
    try {
      const fromIdb = await idbGetCompendium();
      if (fromIdb && (fromIdb.spells || fromIdb.equipment || fromIdb.creatures)) {
        _compendiumCache = {
          spells: fromIdb.spells || [],
          equipment: fromIdb.equipment || [],
          creatures: fromIdb.creatures || [],
          meta: fromIdb.meta || {}
        };
        try { localStorage.removeItem('dsc_compendium_extra'); } catch (e) {}
        return _compendiumCache;
      }
    } catch (e) {
      console.warn('IndexedDB load failed', e);
    }
    // Migrate legacy localStorage → IndexedDB
    try {
      const legacy = localStorage.getItem('dsc_compendium_extra');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        _compendiumCache = {
          spells: parsed.spells || [],
          equipment: parsed.equipment || [],
          creatures: parsed.creatures || [],
          meta: parsed.meta || {}
        };
        await idbSetCompendium(_compendiumCache);
        try { localStorage.removeItem('dsc_compendium_extra'); } catch (e) {}
        return _compendiumCache;
      }
    } catch (e) {
      try { localStorage.removeItem('dsc_compendium_extra'); } catch (e2) {}
    }
    if (!_compendiumCache) _compendiumCache = emptyCompendium();
    return _compendiumCache;
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
    if (!window.BESTIARY_BASE) {
      window.BESTIARY_BASE = (typeof window !== 'undefined' && window.BESTIARY_DATA)
        ? window.BESTIARY_DATA.map(b => ({ ...b }))
        : [];
    }
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
    try { ensureMoonGuardianSpellList(); } catch (e) {}
      try { mergeAllCustomContent(); } catch (e) {}
    window.EQUIPMENT = [...eqMap.values()];
    // Bestiary merge: DSC base + imported (imported keyed by n+source)
    const srcFilter = window.BESTIARY_SOURCE || 'all';
    const importedRaw = (extra.creatures || []).map(c => ({ ...c, _src: c._src || c.source || 'Imported' }));
    // Dedupe imported by _key then by lowercase name
    const seenKey = new Set();
    const seenName = new Set();
    const imported = [];
    importedRaw.forEach(c => {
      const key = String(c._key || '').trim();
      const nm = String(c.n || c.name || '').trim().toLowerCase();
      if (key && seenKey.has(key)) return;
      if (nm && seenName.has(nm)) return;
      if (key) seenKey.add(key);
      if (nm) seenName.add(nm);
      imported.push(c);
    });
    let list;
    if (srcFilter === 'dsc') list = window.BESTIARY_BASE.slice();
    else if (srcFilter === 'imported') list = imported.slice();
    else list = window.BESTIARY_BASE.concat(imported);
    window.BESTIARY_MERGED = list;
    if (typeof refreshBestiaryRef === 'function') refreshBestiaryRef();
  }

  function importCompendiumPack(obj) {
    // exposed for extensions / VTT import
    window.importCompendiumPack = importCompendiumPack;
    // Flexible: accepts DSCToolkt-compendium-v1, or raw {spells:[], equipment:[]},
    // or Open5e-ish / homebrew arrays
    let spellsIn = [];
    let equipIn = [];
    let creaturesIn = [];
    let meta = { edition: '', source: '', attribution: '' };
    if (Array.isArray(obj)) {
      obj.forEach(row => {
        if (row.level != null || row.school || row.castingTime || row.casting_time) spellsIn.push(row);
        else if (row.stats || row.n || row.cr != null || row.challenge_rating != null || row.hit_points != null || row.challengeRating != null)
          creaturesIn.push(row);
        else equipIn.push(row);
      });
    } else if (obj && typeof obj === 'object') {
      meta.edition = obj.edition || obj.system || '';
      meta.source = obj.source || obj.name || '';
      meta.attribution = obj.attribution || '';
      spellsIn = obj.spells || obj.spell || obj.Spells || [];
      equipIn = obj.equipment || obj.items || obj.gear || obj.Equipment || [];
      creaturesIn = obj.creatures || obj.monsters || obj.bestiary || [];
      // CritterDB single creature export
      if (!creaturesIn.length && obj.stats && obj.name) creaturesIn = [obj];
      // CritterDB bestiary export { name, creatures: [...] }
      if (!creaturesIn.length && Array.isArray(obj.Creatures)) creaturesIn = obj.Creatures;
      if (!spellsIn.length && obj.compendium?.spells) spellsIn = obj.compendium.spells;
      if (!equipIn.length && obj.compendium?.items) equipIn = obj.compendium.items;
      if (!creaturesIn.length && obj.compendium?.creatures) creaturesIn = obj.compendium.creatures;
    }
    const extra = getUserCompendium();
    const spellMap = new Map((extra.spells || []).map(s => [s.id || s.name, s]));
    let sCount = 0, eCount = 0, cCount = 0;
    spellsIn.forEach(raw => {
      const m = mergeSpellRecord(raw);
      if (m) { spellMap.set(m.id, m); sCount++; }
    });
    const eqMap = new Map((extra.equipment || []).map(e => [e.id || e.name, e]));
    equipIn.forEach(raw => {
      const m = mergeEquipmentRecord(raw);
      if (m) { eqMap.set(m.id, m); eCount++; }
    });
    const creMap = new Map();
    const creByName = new Map(); // lowercase name → map key (dedupe aliases)
    function registerExistingCreature(c) {
      if (!c) return;
      const key = String(c._key || c.n || c.name || '').trim();
      if (!key) return;
      creMap.set(key, c);
      const nm = String(c.n || c.name || '').trim().toLowerCase();
      if (nm) creByName.set(nm, key);
    }
    (extra.creatures || []).forEach(registerExistingCreature);
    let cAdded = 0, cUpdated = 0, cSkipped = 0;
    creaturesIn.forEach(raw => {
      let c = raw;
      if (raw && raw.stats && (raw.stats.abilityScores || raw.stats.armorClass != null))
        c = mapCritterDbCreature(raw, raw._bestiaryName ? `CritterDB: ${raw._bestiaryName}` : undefined);
      else if (raw.challenge_rating != null || raw.hit_points != null || raw.ability_scores)
        c = mapOpen5eCreature(raw);
      else if (raw.name && !raw.n) c = { ...raw, n: raw.name, o: raw.o || 'Imported', _src: 'Imported' };
      if (!c || !(c.n || c.name)) return;
      c = { ...c, _src: c._src || 'Imported' };
      const key = String(c._key || c.n || c.name).trim();
      const nm = String(c.n || c.name || '').trim().toLowerCase();
      // Prefer match by stable key, else by name (avoids same monster from two bestiaries)
      const existingKey = creMap.has(key) ? key : (nm && creByName.has(nm) ? creByName.get(nm) : null);
      if (existingKey) {
        const prev = creMap.get(existingKey);
        // Same content signature → skip; else update in place under existing key
        const sig = (x) => [x.n || x.name, x.ac, x.hp, x.cr, (x.desc || '').length].join('|');
        if (prev && sig(prev) === sig(c)) {
          cSkipped++;
          return;
        }
        creMap.set(existingKey, { ...c, _key: prev?._key || c._key || existingKey });
        if (nm) creByName.set(nm, existingKey);
        cUpdated++;
      } else {
        creMap.set(key, c);
        if (nm) creByName.set(nm, key);
        cAdded++;
      }
      cCount++;
    });
    // expose for status messages
    importCompendiumPack._lastCreatureStats = { added: cAdded, updated: cUpdated, skipped: cSkipped };
    const next = {
      spells: [...spellMap.values()],
      equipment: [...eqMap.values()],
      creatures: [...creMap.values()],
      meta: { ...(extra.meta || {}), ...meta, updatedAt: new Date().toISOString() }
    };
    saveUserCompendium(next);
    applyCompendiumToRuntime();
    const cStats = importCompendiumPack._lastCreatureStats || { added: cCount, updated: 0, skipped: 0 };
    return {
      spells: sCount,
      equipment: eCount,
      creatures: cCount,
      creaturesAdded: cStats.added,
      creaturesUpdated: cStats.updated,
      creaturesSkipped: cStats.skipped,
      totalSpells: window.SPELLS.length,
      totalEquipment: window.EQUIPMENT.length,
      totalCreatures: (window.BESTIARY_MERGED || []).length
    };
  }

  

  const OPEN5E_V2 = 'https://api.open5e.com/v2';

  async function open5eFetchAll(path, params = {}, { maxPages = 80, onPage } = {}) {
    const results = [];
    const qs = new URLSearchParams({ limit: '100', ...params });
    let url = `${OPEN5E_V2}${path}?${qs.toString()}`;
    let page = 0;
    while (url && page < maxPages) {
      page++;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Open5e ${res.status} ${path}`);
      const data = await res.json();
      results.push(...(data.results || []));
      if (typeof onPage === 'function') onPage(page, results.length, data.count);
      url = data.next || null;
    }
    return results;
  }

  function open5eComponents(s) {
    if (s.components) return String(s.components);
    const parts = [];
    if (s.verbal) parts.push('V');
    if (s.somatic) parts.push('S');
    if (s.material || s.material_specified) {
      const mat = s.material_specified || s.material;
      parts.push(mat ? `M (${mat})` : 'M');
    }
    return parts.length ? parts.join(', ') : '—';
  }

  function open5eCastingTime(s) {
    let t = s.casting_time || 'action';
    t = String(t).replace(/_/g, ' ');
    if (/^\d/.test(t)) return t;
    // v2 often uses "action", "bonus_action", "reaction", "1 minute"
    if (t === 'action') return '1 action';
    if (t === 'bonus action' || t === 'bonus_action') return '1 bonus action';
    if (t === 'reaction') {
      return s.reaction_condition ? `1 reaction (${s.reaction_condition})` : '1 reaction';
    }
    return t;
  }


  function mapOpen5eSpell(s) {
    const level = s.level != null ? Number(s.level) : 0;
    const classes = Array.isArray(s.classes)
      ? s.classes.map(c => (typeof c === 'string' ? c : (c.name || c.key || ''))).filter(Boolean)
      : [];
    let school = 'Unknown';
    if (typeof s.school === 'object' && s.school) school = s.school.name || s.school.key || 'Unknown';
    else if (s.school) school = String(s.school);
    school = String(school).replace(/_/g, ' ');
    school = school.charAt(0).toUpperCase() + school.slice(1);

    // v2 may put overrides on casting_options[0]
    const opt = Array.isArray(s.casting_options) && s.casting_options.length ? s.casting_options[0] : {};
    let durationRaw = opt.duration != null ? opt.duration : (s.duration || '—');
    durationRaw = String(durationRaw).replace(/_/g, ' ');
    const concentration = s.concentration === true || opt.concentration === true || /concentration/i.test(durationRaw);
    let duration = durationRaw;
    if (concentration && !/concentration/i.test(durationRaw)) duration = `Concentration, ${durationRaw}`;

    let time = open5eCastingTime(s);
    if (opt.type && opt.type !== 'default' && !s.casting_time) {
      time = open5eCastingTime({ casting_time: opt.type, reaction_condition: s.reaction_condition });
    }

    let range = s.range_text || '';
    if (!range && (opt.range != null || s.range != null)) {
      const r = opt.range != null ? opt.range : s.range;
      range = `${r} ${s.range_unit || 'feet'}`.trim();
    }
    if (!range) range = '—';

    const descParts = [s.desc || ''];
    if (s.higher_level) descParts.push(`\n\nAt Higher Levels. ${s.higher_level}`);
    if (s.damage_roll) descParts.push(`\n\nDamage: ${s.damage_roll}`);
    if (s.saving_throw_ability) descParts.push(`\n\nSave: ${s.saving_throw_ability}`);
    const desc = descParts.join('').trim();
    const doc = s.document || {};
    const key = s.key || s.name || '';
    const id = String(key).toLowerCase().replace(/^[^_]*_/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || String(s.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return mergeSpellRecord({
      id,
      name: s.name,
      level,
      school,
      time,
      range,
      components: open5eComponents(s),
      duration,
      classes,
      description: desc,
      summary: (s.desc || '').slice(0, 220),
      ritual: !!s.ritual,
      concentration,
      source: doc.display_name || doc.name || doc.key || 'Open5e'
    });
  }

  function mapOpen5eWeapon(w) {
    const isSimple = w.is_simple === true;
    const ranged = (w.range != null && Number(w.range) > 0) || (w.long_range != null && Number(w.long_range) > 0);
    let weaponType = isSimple
      ? (ranged ? 'simple ranged' : 'simple melee')
      : (ranged ? 'martial ranged' : 'martial melee');
    const props = Array.isArray(w.properties)
      ? w.properties.map(p => {
          const name = p?.property?.name || p?.name || '';
          const detail = p?.detail;
          return detail ? `${name} (${detail})` : name;
        }).filter(Boolean).join(', ')
      : '';
    const dtype = typeof w.damage_type === 'object' && w.damage_type
      ? (w.damage_type.name || '').toLowerCase()
      : String(w.damage_type || '').toLowerCase();
    const doc = w.document || {};
    const key = w.key || w.name || '';
    return mergeEquipmentRecord({
      id: String(key).toLowerCase().replace(/^[^_]*_/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: w.name,
      category: 'weapon',
      weaponType,
      damage: w.damage_dice || '',
      damageType: dtype,
      props,
      cost: w.cost != null ? String(w.cost) : '',
      weight: w.weight != null ? Number(w.weight) || 0 : 0,
      notes: [props, ranged && w.range ? `Range ${w.range}${w.long_range ? '/' + w.long_range : ''}` : ''].filter(Boolean).join(' · '),
      source: doc.display_name || doc.name || 'Open5e'
    });
  }

  function mapOpen5eArmor(a) {
    const doc = a.document || {};
    const catRaw = (a.category || '').toLowerCase();
    const isShield = catRaw.includes('shield') || /shield/i.test(a.name || '');
    const key = a.key || a.name || '';
    const id = String(key).toLowerCase().replace(/^[^_]*_/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (isShield) {
      return mergeEquipmentRecord({
        id,
        name: a.name,
        category: 'shield',
        acBonus: 2,
        cost: a.cost != null ? String(a.cost) : '',
        weight: a.weight != null ? Number(a.weight) || 0 : 0,
        notes: a.ac_display || '',
        source: doc.display_name || doc.name || 'Open5e'
      });
    }
    let armorType = 'light';
    if (catRaw.includes('medium')) armorType = 'medium';
    else if (catRaw.includes('heavy')) armorType = 'heavy';
    else if (catRaw.includes('light')) armorType = 'light';
    return mergeEquipmentRecord({
      id,
      name: a.name,
      category: 'armor',
      armorType,
      acBase: a.ac_base != null ? Number(a.ac_base) : 11,
      acDexMax: a.ac_cap_dexmod != null ? a.ac_cap_dexmod : (a.ac_add_dexmod === false ? 0 : null),
      cost: a.cost != null ? String(a.cost) : '',
      weight: a.weight != null ? Number(a.weight) || 0 : 0,
      notes: [a.ac_display || '', a.grants_stealth_disadvantage ? 'Stealth disadvantage' : '', a.strength_score_required ? `Str ${a.strength_score_required}` : ''].filter(Boolean).join(' · '),
      source: doc.display_name || doc.name || 'Open5e'
    });
  }

  function mapOpen5eItem(it) {
    const doc = it.document || {};
    const catObj = it.category;
    const catName = (typeof catObj === 'object' ? (catObj.name || catObj.key) : catObj) || 'gear';
    const catL = String(catName).toLowerCase();
    let category = 'gear';
    if (catL.includes('weapon')) category = 'weapon';
    else if (catL.includes('armor')) category = 'armor';
    else if (catL.includes('shield')) category = 'shield';
    else if (catL.includes('tool')) category = 'tool';
    const key = it.key || it.name || '';
    const id = String(key).toLowerCase().replace(/^[^_]*_/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return mergeEquipmentRecord({
      id,
      name: it.name,
      category,
      cost: it.cost != null ? String(it.cost) : '',
      weight: it.weight != null ? Number(it.weight) || 0 : 0,
      notes: (it.desc || '').slice(0, 500),
      source: doc.display_name || doc.name || 'Open5e'
    });
  }

  function mapOpen5eMagicItem(it) {
    const doc = it.document || {};
    const rarity = typeof it.rarity === 'object' ? (it.rarity.name || '') : (it.rarity || '');
    const key = it.key || it.name || '';
    const id = 'magic-' + String(key).toLowerCase().replace(/^[^_]*_/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let category = 'magic';
    if (it.armor) category = /shield/i.test(String(it.armor.name || it.armor.category || '')) ? 'shield' : 'armor';
    else if (it.weapon) category = 'weapon';
    const bonusMatch = String(it.name || '').match(/\(\+(\d+)\)/);
    const magicBonus = bonusMatch ? parseInt(bonusMatch[1], 10) : 0;
    const notes = [
      rarity ? `Rarity: ${rarity}` : '',
      magicBonus ? `Magic bonus: +${magicBonus}` : '',
      it.requires_attunement ? `Attunement${it.attunement_detail ? ': ' + it.attunement_detail : ''}` : '',
      (it.desc || '').slice(0, 700)
    ].filter(Boolean).join('\n');
    const rec = {
      id,
      name: it.name,
      category,
      cost: it.cost != null ? String(it.cost) : '',
      weight: it.weight != null ? Number(it.weight) || 0 : 0,
      notes,
      source: doc.display_name || doc.name || 'Open5e',
      magic: true,
      rarity: typeof rarity === 'string' ? rarity : (rarity && rarity.name) || '',
      attunement: !!it.requires_attunement,
      magicBonus
    };
    if ((category === 'armor' || category === 'shield') && it.armor) {
      rec.armorType = (it.armor.category || it.armor.name || 'medium').toString().toLowerCase();
      rec.acBase = it.armor.ac_base != null ? Number(it.armor.ac_base) : (it.armor.base_ac != null ? Number(it.armor.base_ac) : 11);
      rec.acDexMax = it.armor.ac_cap_dexmod != null ? it.armor.ac_cap_dexmod : null;
    }
    if (category === 'weapon' && it.weapon) {
      const w = it.weapon;
      rec.damage = w.damage_dice || w.damage || '';
      const dtype = w.damage_type;
      rec.damageType = typeof dtype === 'object' ? (dtype.name || '') : (dtype || '');
      rec.weaponType = w.is_simple ? 'simple' : (w.is_martial ? 'martial' : 'weapon');
      if (magicBonus) rec.atkBonus = magicBonus;
    }
    return mergeEquipmentRecord(rec);
  }

  function mapOpen5eFeat(f) {
    const doc = f.document || {};
    const key = f.key || f.name || '';
    const id = 'feat-' + String(key).toLowerCase().replace(/^[^_]*_/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const benefits = Array.isArray(f.benefits) ? f.benefits.map(b => (typeof b === 'string' ? b : (b.desc || b.name || ''))).filter(Boolean).join('\n') : '';
    const notes = [
      f.prerequisite ? `Prerequisite: ${f.prerequisite}` : '',
      f.desc || '',
      benefits
    ].filter(Boolean).join('\n\n');
    return mergeEquipmentRecord({
      id,
      name: f.name + ' (Feat)',
      category: 'gear',
      cost: '',
      weight: 0,
      notes: notes.slice(0, 900),
      source: doc.display_name || doc.name || 'Open5e',
      isFeat: true
    });
  }

  function mapOpen5eCreature(c) {
    const doc = c.document || {};
    const scores = c.ability_scores || c.abilities || {};
    const size = typeof c.size === 'object' ? (c.size.name || '') : (c.size || '');
    const type = typeof c.type === 'object' ? (c.type.name || '') : (c.type || c.creature_type || '');
    const speedObj = c.speed || {};
    let speedParts = [];
    if (typeof speedObj === 'object' && speedObj) {
      Object.entries(speedObj).forEach(([k, v]) => {
        if (v != null && k !== 'unit') speedParts.push(`${k} ${v}${speedObj.unit ? ' ' + speedObj.unit : ' ft.'}`);
      });
    } else if (typeof c.speed === 'string') speedParts = [c.speed];
    const traits = (c.traits || []).map(t => `**${t.name}.** ${(t.desc || '').slice(0, 600)}`).join('\\n');
    const actions = (c.actions || []).map(a => `**${a.name}.** ${(a.desc || '').slice(0, 800)}`).join('\\n');
    const cr = c.challenge_rating_text != null ? c.challenge_rating_text : (c.challenge_rating != null ? Number(c.challenge_rating) : 0);
    const name = c.name || 'Unknown';
    const ac = c.armor_class != null ? c.armor_class : (c.ac != null ? c.ac : 10);
    return {
      n: name,
      w: doc.display_name || doc.name || 'Open5e',
      o: 'Imported',
      classif: [size, type].filter(Boolean).join(' ') || type || '',
      cr: typeof cr === 'number' && !isNaN(cr) ? cr : parseFloat(cr) || 0,
      ac: typeof ac === 'object' ? (ac.value || ac.armor_class || 10) : ac,
      hp: c.hit_points != null ? c.hit_points : (c.hp != null ? c.hp : 1),
      speed: speedParts.join(', ') || '30 ft.',
      str: scores.strength || scores.str || 10,
      dex: scores.dexterity || scores.dex || 10,
      con: scores.constitution || scores.con || 10,
      int: scores.intelligence || scores.int || 10,
      wis: scores.wisdom || scores.wis || 10,
      cha: scores.charisma || scores.cha || 10,
      desc: [
        c.alignment ? `Alignment: ${c.alignment}.` : '',
        c.languages?.as_string ? `Languages: ${c.languages.as_string}.` : '',
        traits ? `Traits:\\n${traits}` : '',
        actions ? `Actions:\\n${actions}` : ''
      ].filter(Boolean).join('\\n\\n'),
      eco: '',
      people: '',
      run: actions ? String(actions).slice(0, 800) : '',
      seeds: '',
      source: doc.display_name || doc.name || 'Open5e',
      _src: 'Imported',
      _key: c.key || name
    };
  }


  function stripHtmlTags(s) {
    return String(s || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?i>/gi, '')
      .replace(/<\/?b>/gi, '')
      .replace(/<\/?em>/gi, '')
      .replace(/<\/?strong>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  function abilityModFromScore(score) {
    const n = Number(score);
    if (isNaN(n)) return 0;
    return Math.floor((n - 10) / 2);
  }

  function mapCritterDbCreature(c, sourceLabel) {
    if (!c || !c.name) return null;
    const st = c.stats || {};
    const ab = st.abilityScores || {};
    const flavor = c.flavor || {};
    const con = ab.constitution != null ? ab.constitution : 10;
    const hitDie = st.hitDieSize != null ? Number(st.hitDieSize) : 8;
    const numHD = st.numHitDie != null ? Number(st.numHitDie) : 1;
    // Average HP: numHD × ((die+1)/2) + numHD × Con mod
    const avgHp = Math.max(1, Math.floor(numHD * ((hitDie + 1) / 2) + numHD * abilityModFromScore(con)));
    const hp = st.hitPoints != null ? Number(st.hitPoints) : avgHp;

    const fmtList = (arr, title) => {
      if (!Array.isArray(arr) || !arr.length) return '';
      return arr.map(x => {
        if (typeof x === 'string') return `**${x}**`;
        const name = x.name || x.title || '';
        const desc = stripHtmlTags(x.description || x.desc || '');
        return name ? `**${name}.** ${desc}` : desc;
      }).filter(Boolean).join('\n');
    };

    const traits = fmtList(st.additionalAbilities || st.traits, 'Traits');
    const actions = fmtList(st.actions, 'Actions');
    const reactions = fmtList(st.reactions, 'Reactions');
    const legendary = fmtList(st.legendaryActions, 'Legendary');
    const legIntro = st.legendaryActionsDescription
      ? stripHtmlTags(st.legendaryActionsDescription)
      : (st.legendaryActionsPerRound
          ? `The creature can take ${st.legendaryActionsPerRound} legendary actions, choosing from the options below.`
          : '');

    const resist = (st.damageResistances || []).join(', ');
    const immune = (st.damageImmunities || []).join(', ');
    const vuln = (st.damageVulnerabilities || []).join(', ');
    const cimm = (st.conditionImmunities || []).join(', ');
    const senses = Array.isArray(st.senses) ? st.senses.join(', ') : (st.senses || '');
    const langs = Array.isArray(st.languages) ? st.languages.join(', ') : (st.languages || '');
    const skills = Array.isArray(st.skills)
      ? st.skills.map(s => (typeof s === 'string' ? s : `${s.name || ''} ${s.modifier != null ? s.modifier : ''}`).trim()).filter(Boolean).join(', ')
      : '';
    const saves = Array.isArray(st.savingThrows)
      ? st.savingThrows.map(s => (typeof s === 'string' ? s : `${s.ability || s.name || ''} ${s.modifier != null ? s.modifier : ''}`).trim()).filter(Boolean).join(', ')
      : '';

    const descParts = [
      st.alignment ? `Alignment: ${st.alignment}.` : '',
      langs ? `Languages: ${langs}.` : '',
      senses ? `Senses: ${senses}.` : '',
      skills ? `Skills: ${skills}.` : '',
      saves ? `Saving Throws: ${saves}.` : '',
      resist ? `Damage Resistances: ${resist}.` : '',
      immune ? `Damage Immunities: ${immune}.` : '',
      vuln ? `Damage Vulnerabilities: ${vuln}.` : '',
      cimm ? `Condition Immunities: ${cimm}.` : '',
      flavor.description ? stripHtmlTags(flavor.description) : '',
      traits ? `Traits:\n${traits}` : '',
      actions ? `Actions:\n${actions}` : '',
      reactions ? `Reactions:\n${reactions}` : '',
      (legIntro || legendary) ? `Legendary Actions:\n${[legIntro, legendary].filter(Boolean).join('\n')}` : ''
    ].filter(Boolean);

    const runParts = [actions, reactions, legendary].filter(Boolean).join('\n\n');
    const src = sourceLabel || 'CritterDB';
    const key = c._id || c.id || c.name;

    return {
      n: c.name,
      w: src,
      o: 'Imported',
      classif: [st.size, st.race].filter(Boolean).join(' ') || (st.race || ''),
      cr: st.challengeRating != null ? Number(st.challengeRating) : 0,
      ac: st.armorClass != null ? Number(st.armorClass) : 10,
      hp,
      speed: st.speed || '30 ft.',
      str: ab.strength != null ? ab.strength : 10,
      dex: ab.dexterity != null ? ab.dexterity : 10,
      con: ab.constitution != null ? ab.constitution : 10,
      int: ab.intelligence != null ? ab.intelligence : 10,
      wis: ab.wisdom != null ? ab.wisdom : 10,
      cha: ab.charisma != null ? ab.charisma : 10,
      desc: descParts.join('\n\n'),
      eco: flavor.environment || '',
      people: flavor.faction || '',
      run: runParts.slice(0, 2000),
      seeds: '',
      source: src,
      _src: 'Imported',
      _key: 'critterdb-' + String(key)
    };
  }

  function parseCritterDbBestiaryId(input) {
    const s = String(input || '').trim();
    if (!s) return '';
    // Full URL: .../publishedbestiary/view/HEX or .../bestiary/view/HEX
    const m = s.match(/(?:publishedbestiary|bestiary)\/(?:view\/)?([a-f0-9]{24})/i)
      || s.match(/publishedbestiaries\/([a-f0-9]{24})/i)
      || s.match(/\b([a-f0-9]{24})\b/i);
    return m ? m[1] : (s.length === 24 && /^[a-f0-9]+$/i.test(s) ? s : '');
  }

  /**
   * Fetch CritterDB JSON (direct only — no third-party proxies).
   * Browsers usually block this via CORS; use tools/critterdb-bulk-crawl.mjs or JSON export.
   */
  async function critterDbFetchJson(targetUrl) {
    let res;
    try {
      res = await fetch(targetUrl, {
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });
    } catch (err) {
      throw new Error(
        'CritterDB blocked by browser CORS (no proxies used). ' +
        'Run: node tools/critterdb-bulk-crawl.mjs — then import the JSON file here.'
      );
    }
    if (!res.ok) throw new Error(`CritterDB HTTP ${res.status}`);
    const text = await res.text();
    const trimmed = (text || '').trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      throw new Error('CritterDB returned non-JSON');
    }
    return JSON.parse(trimmed);
  }

  async function fetchCritterDbPublishedBestiary(bestiaryId, { onPage, maxPages = 40 } = {}) {
    const id = parseCritterDbBestiaryId(bestiaryId);
    if (!id) throw new Error('Invalid CritterDB bestiary id or URL');
    const all = [];
    let page = 1;
    while (page <= maxPages) {
      const url = `https://critterdb.com/api/publishedbestiaries/${id}/creatures/${page}`;
      let batch;
      try {
        batch = await critterDbFetchJson(url);
      } catch (err) {
        if (page === 1) throw err;
        break;
      }
      if (!Array.isArray(batch) || !batch.length) break;
      all.push(...batch);
      if (typeof onPage === 'function') onPage(page, all.length);
      // CritterDB pages typically return up to 25; stop when short page
      if (batch.length < 20) break;
      page += 1;
    }
    return all;
  }

  async function syncCritterDb({ bestiaryIdOrUrl, statusEl } = {}) {
    const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };
    setStatus('Fetching CritterDB bestiary…');
    const rows = await fetchCritterDbPublishedBestiary(bestiaryIdOrUrl, {
      onPage: (p, n) => setStatus(`CritterDB page ${p} — ${n} creatures…`)
    });
    if (!rows.length) {
      setStatus('No creatures returned.');
      return { creatures: 0 };
    }
    const mapped = rows.map(r => mapCritterDbCreature(r, 'CritterDB')).filter(Boolean);
    const pack = {
      creatures: mapped,
      meta: {
        edition: '5e-critterdb',
        source: 'CritterDB',
        attribution: 'Imported from CritterDB (https://critterdb.com). Respect original authors’ licenses.',
        bestiaryId: parseCritterDbBestiaryId(bestiaryIdOrUrl),
        syncedAt: new Date().toISOString()
      }
    };
    setStatus(`Merging ${mapped.length} creatures…`);
    const res = importCompendiumPack(pack);
    setStatus(`Done — +${res.creaturesAdded ?? res.creatures} new, ${res.creaturesUpdated || 0} updated, ${res.creaturesSkipped || 0} duplicates skipped (bestiary total ${res.totalCreatures}).`);
    return res;
  }

  function importCritterDbText(text) {
    const data = JSON.parse(text);
    // Normalize to pack
    let creatures = [];
    if (Array.isArray(data)) creatures = data;
    else if (data.creatures) creatures = data.creatures;
    else if (data.stats && data.name) creatures = [data];
    else throw new Error('Unrecognized CritterDB JSON (need creature or bestiary with creatures[])');
    const mapped = creatures.map(r => mapCritterDbCreature(r, data.name ? `CritterDB: ${data.name}` : 'CritterDB')).filter(Boolean);
    return importCompendiumPack({
      creatures: mapped,
      meta: {
        edition: '5e-critterdb',
        source: data.name || 'CritterDB JSON',
        attribution: 'Imported from CritterDB JSON export.'
      }
    });
  }

  function sleepMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /** List published bestiary summaries from recent/popular feeds (paginated). */
  async function fetchCritterDbBestiaryIndex({ lists = ['recent', 'popular'], maxPagesPerList = 80, onProgress } = {}) {
    const byId = new Map();
    for (const list of lists) {
      for (let page = 1; page <= maxPagesPerList; page++) {
        const url = `https://critterdb.com/api/publishedbestiaries/${list}/${page}`;
        let batch;
        try {
          batch = await critterDbFetchJson(url);
        } catch (err) {
          if (page === 1) throw new Error(`Network error listing ${list} p${page}: ${err.message || err}`);
          break;
        }
        if (!Array.isArray(batch) || !batch.length) break;
        batch.forEach(b => {
          const id = b._id || b.id;
          if (id) byId.set(id, { id, name: b.name || id, description: b.description || '' });
        });
        if (typeof onProgress === 'function') {
          onProgress({ phase: 'index', list, page, bestiaries: byId.size });
        }
        if (batch.length < 5) break; // likely last page
        await sleepMs(120);
      }
    }
    // most popular (single payload if available)
    try {
      const data = await critterDbFetchJson('https://critterdb.com/api/publishedbestiaries/mostpopular');
      const arr = Array.isArray(data) ? data : (data.bestiaries || data.results || []);
      arr.forEach(b => {
        const id = b._id || b.id;
        if (id) byId.set(id, { id, name: b.name || id, description: b.description || '' });
      });
    } catch (e) { /* optional */ }
    return [...byId.values()];
  }

  /**
   * Bulk crawl all discoverable public bestiaries (recent + popular feeds)
   * and merge creatures into the user compendium.
   */
  async function syncCritterDbCatalog({
    statusEl,
    maxBestiaries = 500,
    maxPagesPerList = 100,
    delayMs = 150,
    abortSignal
  } = {}) {
    const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };
    setStatus('Indexing published bestiaries (recent + popular)…');
    const index = await fetchCritterDbBestiaryIndex({
      lists: ['recent', 'popular'],
      maxPagesPerList,
      onProgress: ({ list, page, bestiaries }) => {
        setStatus(`Indexing ${list} p${page} — ${bestiaries} unique bestiaries…`);
      }
    });
    if (!index.length) {
      setStatus('No published bestiaries found (API empty or blocked).');
      return { bestiaries: 0, creatures: 0 };
    }
    const slice = index.slice(0, maxBestiaries);
    setStatus(`Found ${index.length} bestiaries — importing up to ${slice.length}…`);

    let totalMapped = 0;
    let bestiariesOk = 0;
    let bestiariesFail = 0;
    const allMapped = [];

    for (let i = 0; i < slice.length; i++) {
      if (abortSignal?.aborted) {
        setStatus(`Aborted after ${bestiariesOk} bestiaries / ${totalMapped} creatures.`);
        break;
      }
      const b = slice[i];
      setStatus(`Bestiary ${i + 1}/${slice.length}: ${b.name}…`);
      try {
        const rows = await fetchCritterDbPublishedBestiary(b.id, {
          maxPages: 60,
          onPage: (p, n) => setStatus(`Bestiary ${i + 1}/${slice.length}: ${b.name} — creature page ${p} (${n})`)
        });
        const mapped = rows
          .map(r => mapCritterDbCreature(r, `CritterDB: ${b.name}`))
          .filter(Boolean);
        allMapped.push(...mapped);
        totalMapped += mapped.length;
        bestiariesOk++;
      } catch (err) {
        console.warn('CritterDB bestiary failed', b.id, err);
        bestiariesFail++;
      }
      // Merge in chunks so progress is saved if the tab dies mid-crawl
      if (allMapped.length >= 80 || i === slice.length - 1) {
        if (allMapped.length) {
          importCompendiumPack({
            creatures: allMapped.splice(0, allMapped.length),
            meta: {
              edition: '5e-critterdb-bulk',
              source: 'CritterDB public catalog',
              attribution: 'Bulk import from CritterDB published bestiaries (https://critterdb.com). Respect authors’ licenses.',
              syncedAt: new Date().toISOString()
            }
          });
        }
      }
      await sleepMs(delayMs);
    }

    applyCompendiumToRuntime();
    const totalCreatures = (window.BESTIARY_MERGED || []).length;
    setStatus(`Done — ${bestiariesOk} bestiaries OK, ${bestiariesFail} failed, ~${totalMapped} creatures merged (runtime bestiary ${totalCreatures}).`);
    return { bestiaries: bestiariesOk, failed: bestiariesFail, creatures: totalMapped, totalCreatures };
  }


  async function syncOpen5e({
    srdOnly = true,
    spells = true,
    equipment = true,
    items = true,
    magicItems = true,
    feats = false,
    creatures = false,
    statusEl
  } = {}) {
    const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };
    const params = srdOnly ? { document__key: 'srd-2024' } : {};
    const pack = {
      spells: [],
      equipment: [],
      creatures: [],
      meta: {
        edition: srdOnly ? '5e-srd-2024-open5e' : '5e-open5e-v2-all',
        source: 'Open5e API v2',
        attribution: 'Data from Open5e API v2 (https://api.open5e.com). Documents retain their original licenses.',
        syncedAt: new Date().toISOString()
      }
    };

    try {
      if (spells) {
        setStatus('Fetching spells…');
        const rows = await open5eFetchAll('/spells/', params, {
          maxPages: 120,
          onPage: (p, n, total) => setStatus(`Spells page ${p} — ${n}/${total || '?'}`)
        });
        pack.spells = rows.map(mapOpen5eSpell).filter(Boolean);
        setStatus(`Mapped ${pack.spells.length} spells`);
      }

      if (equipment) {
        setStatus('Fetching weapons…');
        const weapons = await open5eFetchAll('/weapons/', params, {
          maxPages: 40,
          onPage: (p, n, total) => setStatus(`Weapons page ${p} — ${n}/${total || '?'}`)
        });
        setStatus('Fetching armor…');
        const armor = await open5eFetchAll('/armor/', params, {
          maxPages: 20,
          onPage: (p, n, total) => setStatus(`Armor page ${p} — ${n}/${total || '?'}`)
        });
        pack.equipment.push(...weapons.map(mapOpen5eWeapon).filter(Boolean));
        pack.equipment.push(...armor.map(mapOpen5eArmor).filter(Boolean));
      }

      if (items) {
        setStatus('Fetching adventuring gear (items)…');
        const rows = await open5eFetchAll('/items/', params, {
          maxPages: 80,
          onPage: (p, n, total) => setStatus(`Items page ${p} — ${n}/${total || '?'}`)
        });
        pack.equipment.push(...rows.map(mapOpen5eItem).filter(Boolean));
      }

      if (magicItems) {
        setStatus('Fetching magic items…');
        // Full catalog (SRD filter alone misses many +1 weapons / wondrous items)
        let magicRows = await open5eFetchAll('/magicitems/', {}, {
          maxPages: 50,
          onPage: (p, n, total) => setStatus(`Magic items page ${p} — ${n}/${total || '?'}`)
        });
        pack.equipment.push(...magicRows.map(mapOpen5eMagicItem).filter(Boolean));
        setStatus(`Mapped ${magicRows.length} magic items`);
      }

      if (feats) {
        setStatus('Fetching feats…');
        const rows = await open5eFetchAll('/feats/', params, {
          maxPages: 40,
          onPage: (p, n, total) => setStatus(`Feats page ${p} — ${n}/${total || '?'}`)
        });
        pack.equipment.push(...rows.map(mapOpen5eFeat).filter(Boolean));
      }


      if (creatures) {
        setStatus('Fetching creatures (bestiary)…');
        try {
          const rows = await open5eFetchAll('/creatures/', params, {
            maxPages: 150,
            onPage: (p, n, total) => setStatus(`Creatures page ${p} — ${n}/${total || '?'}`)
          });
          pack.creatures = rows.map(mapOpen5eCreature).filter(Boolean);
        } catch (err) {
          console.warn('Creature sync failed', err);
          setStatus('Creature sync failed (API may rate-limit). Spells/equipment still saved.');
        }
      }

      setStatus(`Merging ${pack.spells.length} spells, ${pack.equipment.length} equipment…`);
      const res = importCompendiumPack(pack);
      setStatus(`Done — +${res.spells} spells, +${res.equipment} equipment${res.creatures ? ', +' + res.creatures + ' creatures' : ''}. Runtime: ${res.totalSpells} spells / ${res.totalEquipment} equipment.`);
      return res;
    } catch (err) {
      console.warn(err);
      setStatus('Error: ' + (err.message || err));
      throw err;
    }
  }

  function renderCompendiumTools() {
    const root = $('#compendium-tools');
    if (!root) return;
    const extra = getUserCompendium();
    const sN = (extra.spells || []).length;
    const eN = (extra.equipment || []).length;
    const cN = (extra.creatures || []).length;
    root.innerHTML = `
      <div class="compendium-panel">
        <h3>Compendium Import</h3>
        <p class="muted small">Import JSON packs of spells and equipment. Built-in data includes <strong>SRD 5.2.1</strong>. Entries merge by id/name.</p>
        <div class="form-row">
          <button type="button" class="btn primary" id="comp-import-btn">Import JSON Pack</button>
          <button type="button" class="btn secondary" id="comp-export-btn">Export User Pack</button>
          <button type="button" class="btn danger" id="comp-clear-btn">Clear User Imports</button>
          <input type="file" id="comp-import-file" accept=".json,application/json" hidden />
        </div>
        <p class="muted small">User imports: <strong>${sN}</strong> spells · <strong>${eN}</strong> equipment · <strong>${cN}</strong> creatures · Runtime: <strong>${(window.SPELLS||[]).length}</strong> spells · <strong>${(window.EQUIPMENT||[]).length}</strong> equipment · <strong>${(window.BESTIARY_MERGED||window.BESTIARY_DATA||[]).length}</strong> creatures</p>
      </div>
      <div class="compendium-panel">
        <h3>Open5e API Sync</h3>
        <p class="muted small">Import <strong>spells</strong>, weapons, armor, adventuring gear, magic items, and feats from the <a href="https://github.com/open5e/open5e-api" target="_blank" rel="noopener">Open5e API v2</a> (<code>api.open5e.com/v2</code>). Merges into your user compendium.</p>
        <label class="checkbox-row" style="margin:0.4rem 0">
          <input type="checkbox" id="open5e-srd-only" checked />
          <span>SRD 5.2 only (<code>document__key=srd-2024</code>)</span>
        </label>
        <div class="form-row">
          <button type="button" class="btn primary" id="open5e-sync-all">Sync All (Spells, Gear, Magic, Bestiary)</button>
          <button type="button" class="btn secondary" id="open5e-sync-spells">Spells only</button>
          <button type="button" class="btn secondary" id="open5e-sync-equip">Weapons &amp; Armor</button>
          <button type="button" class="btn secondary" id="open5e-sync-items">Adventuring gear</button>
          <button type="button" class="btn secondary" id="open5e-sync-magic">Magic items</button>
          <button type="button" class="btn secondary" id="open5e-sync-feats">Feats</button>
          <button type="button" class="btn secondary" id="open5e-sync-creatures">Bestiary only</button>
        </div>
        <p class="muted small" id="open5e-status">Ready.</p>
      </div>
      <div class="compendium-panel">
        <h3>CritterDB Import</h3>
        <p class="muted small">Import published bestiaries from <a href="https://critterdb.com/#/index" target="_blank" rel="noopener">CritterDB</a> into your Bestiary (source: Imported). Paste a published bestiary URL or id, or upload/paste a CritterDB JSON export.</p>
        <div class="form-row">
          <div class="field" style="flex:1">
            <label>Published bestiary URL or ID</label>
            <input type="text" id="critterdb-id" placeholder="https://critterdb.com/#/publishedbestiary/view/…" />
          </div>
        </div>
        <div class="form-row">
          <button type="button" class="btn primary" id="critterdb-fetch">Fetch from CritterDB</button>
          <button type="button" class="btn secondary" id="critterdb-bulk">Bulk crawl public catalog</button>
          <button type="button" class="btn secondary" id="critterdb-json-btn">Import CritterDB JSON file</button>
          <input type="file" id="critterdb-json-file" accept=".json,application/json" hidden />
        </div>
        <p class="muted small">In-browser bulk uses a <strong>direct</strong> request only (no third-party proxies). CritterDB usually blocks it via CORS.</p>
        <details class="compendium-sample" style="margin:0.5rem 0 0.75rem">
          <summary><strong>How to bulk-import CritterDB (recommended)</strong></summary>
          <div class="muted small" style="margin-top:0.5rem;line-height:1.45;color:inherit">
            <p style="margin:0 0 0.5rem"><strong>Why a local script?</strong> The site does not allow browser apps to read its API (CORS). A small Node script on your PC can call CritterDB directly and save a JSON pack for this toolkit.</p>
            <ol style="margin:0 0 0.5rem 1.2rem;padding:0">
              <li>Install <strong>Node.js 18+</strong> if needed (<a href="https://nodejs.org/" target="_blank" rel="noopener">nodejs.org</a>).</li>
              <li>Open a terminal in the app folder (the folder that contains <code>tools/</code>).</li>
              <li>Run:
                <pre class="sample-pre" style="margin:0.35rem 0">node tools/critterdb-bulk-crawl.mjs</pre>
              </li>
              <li>Optional flags:
                <pre class="sample-pre" style="margin:0.35rem 0">node tools/critterdb-bulk-crawl.mjs --max-bestiaries 200 --out critterdb-bulk.json --delay 150</pre>
              </li>
              <li>When it finishes, use <strong>Import CritterDB JSON file</strong> above and choose <code>critterdb-bulk.json</code> (or your <code>--out</code> name).</li>
              <li>Open <strong>Bestiary</strong> and set the source filter to <strong>Imported</strong> (or All).</li>
            </ol>
            <p style="margin:0 0 0.35rem"><strong>What the script does:</strong> pages the public <em>recent</em> and <em>popular</em> bestiary lists, downloads every creature in those bestiaries, and writes one JSON file. Private “My Critters” are not included.</p>
            <p style="margin:0"><strong>Single bestiary:</strong> paste a published URL/id and use <em>Fetch from CritterDB</em>, or export JSON from CritterDB and import/paste it here.</p>
          </div>
        </details>
        <div class="field">
          <label>Or paste CritterDB JSON</label>
          <textarea id="critterdb-paste" rows="4" placeholder='{ "name": "…", "creatures": [ … ] } or a single creature object'></textarea>
        </div>
        <div class="form-row">
          <button type="button" class="btn secondary" id="critterdb-paste-btn">Import pasted JSON</button>
        </div>
        <p class="muted small" id="critterdb-status">Ready. Prefer the local Node crawl script if in-browser fetch fails (CORS).</p>
      </div>
      <details class="compendium-sample">
        <summary>Sample JSON pack format</summary>
        <pre class="sample-pre">{
  "format": "DSCToolkt-compendium-v1",
  "edition": "5e",
  "source": "My Homebrew",
  "spells": [{ "name": "Example Bolt", "level": 0, "school": "Evocation", "time": "Action", "range": "60 feet", "components": "V, S", "duration": "Instantaneous", "classes": ["Wizard"], "description": "…" }],
  "equipment": [{ "name": "Moonsteel Blade", "category": "weapon", "damage": "1d8", "damageType": "slashing" }]
}</pre>
      </details>`;

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
        equipment: extra.equipment || [],
        creatures: extra.creatures || []
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
      saveUserCompendium({ spells: [], equipment: [], creatures: [] });
      applyCompendiumToRuntime();
      toast('User compendium cleared');
      renderCompendiumTools();
    });

    const statusEl = $('#open5e-status');
    const runSync = async (opts) => {
      const ids = ['open5e-sync-all','open5e-sync-spells','open5e-sync-equip','open5e-sync-items','open5e-sync-magic','open5e-sync-feats','open5e-sync-creatures'];
      const btns = ids.map(id => document.getElementById(id));
      btns.forEach(b => { if (b) b.disabled = true; });
      try {
        const srdOnly = !!document.getElementById('open5e-srd-only')?.checked;
        await syncOpen5e({ spells: false, equipment: false, items: false, magicItems: false, feats: false, creatures: false, ...opts, srdOnly, statusEl });
        toast('Open5e sync complete');
        renderCompendiumTools();
        if (typeof renderBestiary === 'function') renderBestiary();
      } catch (err) {
        console.warn(err);
        if (statusEl) statusEl.textContent = 'Error: ' + (err.message || err);
        toast('Open5e sync failed — check network / try SRD only');
      } finally {
        btns.forEach(b => { if (b) b.disabled = false; });
      }
    };
    document.getElementById('open5e-sync-all')?.addEventListener('click', () => runSync({ spells: true, equipment: true, items: true, magicItems: true, feats: true, creatures: true }));
    document.getElementById('open5e-sync-spells')?.addEventListener('click', () => runSync({ spells: true }));
    document.getElementById('open5e-sync-equip')?.addEventListener('click', () => runSync({ equipment: true }));
    document.getElementById('open5e-sync-items')?.addEventListener('click', () => runSync({ items: true }));
    document.getElementById('open5e-sync-magic')?.addEventListener('click', () => runSync({ magicItems: true }));
    document.getElementById('open5e-sync-feats')?.addEventListener('click', () => runSync({ feats: true }));
    document.getElementById('open5e-sync-creatures')?.addEventListener('click', () => runSync({ creatures: true }));

    // CritterDB
    const cdStatus = document.getElementById('critterdb-status');
    document.getElementById('critterdb-fetch')?.addEventListener('click', async () => {
      const id = document.getElementById('critterdb-id')?.value || '';
      const btn = document.getElementById('critterdb-fetch');
      if (btn) btn.disabled = true;
      try {
        await syncCritterDb({ bestiaryIdOrUrl: id, statusEl: cdStatus });
        toast('CritterDB import complete');
        renderCompendiumTools();
        if (typeof renderBestiary === 'function') renderBestiary();
      } catch (err) {
        console.warn(err);
        if (cdStatus) cdStatus.textContent = 'Error: ' + (err.message || err) + ' — use node tools/critterdb-bulk-crawl.mjs or CritterDB JSON export.';
        toast('CritterDB fetch failed');
      } finally {
        if (btn) btn.disabled = false;
      }
    });
    document.getElementById('critterdb-bulk')?.addEventListener('click', async () => {
      const btn = document.getElementById('critterdb-bulk');
      const fetchBtn = document.getElementById('critterdb-fetch');
      if (btn) btn.disabled = true;
      if (fetchBtn) fetchBtn.disabled = true;
      try {
        if (cdStatus) cdStatus.textContent = 'Starting bulk crawl…';
        const res = await syncCritterDbCatalog({ statusEl: cdStatus, maxBestiaries: 500, maxPagesPerList: 100, delayMs: 150 });
        toast(`CritterDB bulk: ${res.bestiaries} bestiaries, ${res.creatures} creatures`);
        renderCompendiumTools();
        if (typeof renderBestiary === 'function') renderBestiary();
      } catch (err) {
        console.warn(err);
        if (cdStatus) cdStatus.textContent = 'Bulk error: ' + (err.message || err) + ' — browser CORS blocks CritterDB; use the local crawl script.';
        toast('CritterDB bulk crawl failed');
      } finally {
        if (btn) btn.disabled = false;
        if (fetchBtn) fetchBtn.disabled = false;
      }
    });
    document.getElementById('critterdb-json-btn')?.addEventListener('click', () => {
      document.getElementById('critterdb-json-file')?.click();
    });
    document.getElementById('critterdb-json-file')?.addEventListener('change', async (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const res = importCritterDbText(text);
        if (cdStatus) cdStatus.textContent = `Imported +${res.creaturesAdded ?? res.creatures} new, ${res.creaturesUpdated || 0} updated, ${res.creaturesSkipped || 0} duplicates skipped.`;
        toast('CritterDB JSON imported');
        renderCompendiumTools();
        if (typeof renderBestiary === 'function') renderBestiary();
      } catch (err) {
        console.warn(err);
        if (cdStatus) cdStatus.textContent = 'Error: ' + (err.message || err);
        toast('CritterDB JSON import failed');
      }
      ev.target.value = '';
    });
    document.getElementById('critterdb-paste-btn')?.addEventListener('click', () => {
      const text = document.getElementById('critterdb-paste')?.value || '';
      try {
        const res = importCritterDbText(text);
        if (cdStatus) cdStatus.textContent = `Imported +${res.creaturesAdded ?? res.creatures} new, ${res.creaturesUpdated || 0} updated, ${res.creaturesSkipped || 0} duplicates skipped.`;
        toast('CritterDB JSON imported');
        renderCompendiumTools();
        if (typeof renderBestiary === 'function') renderBestiary();
      } catch (err) {
        console.warn(err);
        if (cdStatus) cdStatus.textContent = 'Error: ' + (err.message || err);
        toast('CritterDB paste import failed');
      }
    });
  }


  
  function mergeCharacterFormExtras(base) {
    if (!window.DSCExtensions || typeof window.DSCExtensions.collectCharacterExtras !== 'function') return base;
    try {
      const ex = window.DSCExtensions.collectCharacterExtras();
      let next = { ...base, ...ex };
      if (ex && arguments[1] === 'long' || (typeof event === 'undefined' && false)) {}
      // Apply rest if buttons set dataset
      const rest = document.getElementById('m-char-extras')?.dataset?.rest;
      if (rest === 'short') next = window.DSCExtensions.applyShortRest(next);
      if (rest === 'long') next = window.DSCExtensions.applyLongRest(next);
      return next;
    } catch (e) { return base; }
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
    return spellsForClasses(className ? [className] : []);
  }



  // Moon Guardian spell list (DSC half-caster — not in SRD class tags)
  const MOON_GUARDIAN_SPELL_NAMES = [
    'Guidance', 'Light', 'Resistance', 'Sacred Flame', 'Spare the Dying', 'Thaumaturgy', 'Word of Radiance',
    'Bless', 'Ceremony', 'Command', 'Compelled Duel', 'Cure Wounds', 'Detect Evil and Good', 'Detect Magic',
    'Detect Poison and Disease', 'Divine Favor', 'Guiding Bolt', 'Healing Word', 'Heroism',
    'Protection from Evil and Good', 'Purify Food and Drink', 'Searing Smite', 'Shield of Faith',
    'Thunderous Smite', 'Wrathful Smite', 'Bane', 'Faerie Fire',
    'Aid', 'Branding Smite', 'Find Steed', 'Lesser Restoration', 'Locate Object', 'Magic Weapon',
    'Prayer of Healing', 'Protection from Poison', 'Zone of Truth', 'Moonbeam', 'Gentle Repose',
    'See Invisibility', 'Silence',
    'Aura of Vitality', 'Blinding Smite', "Crusader's Mantle", 'Daylight', 'Dispel Magic', 'Magic Circle',
    'Remove Curse', 'Revivify', 'Spirit Guardians', 'Beacon of Hope', 'Mass Healing Word', 'Clairvoyance',
    'Aura of Life', 'Aura of Purity', 'Banishing Smite', 'Death Ward', 'Locate Creature', 'Staggering Smite',
    'Divination', 'Guardian of Faith',
    'Destructive Wave', 'Dispel Evil and Good', 'Flame Strike', 'Raise Dead', 'Greater Restoration',
    'Holy Weapon', 'Dawn'
  ];

  function ensureMoonGuardianSpellList() {
    const lib = (typeof window !== 'undefined' && Array.isArray(window.SPELLS)) ? window.SPELLS : [];
    if (!lib.length) return 0;
    const norm = (s) => String(s || '').toLowerCase().replace(/[''`´]/g, '').replace(/\s+/g, ' ').trim();
    const want = new Set(MOON_GUARDIAN_SPELL_NAMES.map(norm));
    let n = 0;
    // Index by normalized name for fast match
    const byName = new Map();
    lib.forEach(sp => {
      if (sp && sp.name) byName.set(norm(sp.name), sp);
    });
    want.forEach(key => {
      const sp = byName.get(key);
      if (!sp) return;
      if (!Array.isArray(sp.classes)) sp.classes = [];
      // Normalize class tags to title case for matching
      if (!sp.classes.some(c => String(c).toLowerCase() === 'moon guardian')) {
        sp.classes.push('Moon Guardian');
        n++;
      }
    });
    return n;
  }

  function spellsForClasses(classNames) {
    // Always re-tag MG list (Open5e merge can replace SPELLS)
    try { ensureMoonGuardianSpellList(); } catch (e) {}
    const lib = getSpellLibrary();
    const names = (Array.isArray(classNames) ? classNames : [classNames])
      .map(n => String(n || '').trim())
      .filter(Boolean);
    if (!names.length) return lib.slice();
    const setLower = new Set(names.map(n => n.toLowerCase()));
    const isMG = setLower.has('moon guardian');

    let list = lib.filter(s => {
      const sc = s.classes || [];
      if (!sc.length) return false;
      return sc.some(c => setLower.has(String(c).toLowerCase()));
    });

    // Fallback: if MG selected and still empty, match by spell name list
    if (isMG && !list.length) {
      const norm = (s) => String(s || '').toLowerCase().replace(/[''`´]/g, '').replace(/\s+/g, ' ').trim();
      const want = new Set(MOON_GUARDIAN_SPELL_NAMES.map(norm));
      list = lib.filter(s => want.has(norm(s.name)));
      // Tag them for next time
      list.forEach(sp => {
        if (!Array.isArray(sp.classes)) sp.classes = [];
        if (!sp.classes.some(c => String(c).toLowerCase() === 'moon guardian')) {
          sp.classes.push('Moon Guardian');
        }
      });
    }
    return list;
  }


  function castingClassNamesFromForm() {
    const list = (typeof readMulticlassFromForm === 'function') ? readMulticlassFromForm() : [];
    if (list.length) return list.map(c => c.name).filter(Boolean);
    const one = $('#m-class')?.value?.trim();
    return one ? [one] : [];
  }

  function characterFromSpellForm() {
    const list = (typeof readMulticlassFromForm === 'function') ? readMulticlassFromForm() : [];
    const primary = list[0]?.name || $('#m-class')?.value || '';
    const total = list.length
      ? list.reduce((s, c) => s + (c.level || 0), 0)
      : clamp(parseInt($('#m-level')?.value, 10) || 1, 1, 40);
    return {
      class: primary,
      subclass: list[0]?.subclass || $('#m-subclass')?.value || '',
      level: total || 1,
      classes: list.length ? list : (primary ? [{ name: primary, level: total || 1, subclass: $('#m-subclass')?.value || '' }] : []),
      spellcastingAbility: $('#m-spell-ab')?.value || defaultSpellAbility(primary),
      spellSlotsUsed: collectSpellSlotsUsed(),
      cantrips: $('#m-cantrips')?.value || '',
      spells: $('#m-spells')?.value || '',
      spellIds: ($('#m-spell-ids')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
    };
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


  function abilityCardHtml(a) {
    if (!a) return '';
    const lvl = a.lvl != null ? `Level ${a.lvl}` : (a.level != null ? `Level ${a.level}` : '');
    const src = a.source || a.className || '';
    const subtitle = [lvl, src].filter(Boolean).join(' · ');
    const uses = a.uses != null ? String(a.uses) : (a.max != null ? `${a.remaining != null ? a.remaining : a.max} / ${a.max}` : '');
    const recover = a.recover || a.recovery || '';
    return `<article class="ability-card spell-card">
      <div class="spell-card-banner">
        <div class="spell-card-name">${escapeHtml(a.name || 'Ability')}</div>
        <div class="spell-card-level">${escapeHtml(subtitle || 'Class Feature')}</div>
      </div>
      <div class="spell-card-stats">
        ${uses ? `<div class="spell-stat"><div class="spell-stat-label">Uses</div><div class="spell-stat-value">${escapeHtml(uses)}</div></div>` : ''}
        ${recover ? `<div class="spell-stat"><div class="spell-stat-label">Recovery</div><div class="spell-stat-value">${escapeHtml(recover)}</div></div>` : ''}
        ${a.action ? `<div class="spell-stat"><div class="spell-stat-label">Action</div><div class="spell-stat-value">${escapeHtml(a.action)}</div></div>` : ''}
        ${a.range ? `<div class="spell-stat"><div class="spell-stat-label">Range</div><div class="spell-stat-value">${escapeHtml(a.range)}</div></div>` : ''}
      </div>
      <div class="spell-card-desc">${escapeHtml(a.text || a.description || '').split(String.fromCharCode(10)).join('<br>')}</div>
    </article>`;
  }

  function combatAbilityCardsHtml(ch) {
    const list = normalizeClassLevels(ch);
    const abilities = (typeof window !== 'undefined' && window.CLASS_ABILITIES) ? window.CLASS_ABILITIES : {};
    const used = ch.resourceUsed && typeof ch.resourceUsed === 'object' ? ch.resourceUsed : {};
    const cards = [];

    // Resource pools as ability cards first (Ki, etc.)
    (typeof classResourcesForCharacter === 'function' ? classResourcesForCharacter(ch) : []).forEach(r => {
      const u = used[r.id] != null ? Number(used[r.id]) : 0;
      const left = r.max >= 99 ? '∞' : Math.max(0, r.max - u);
      const maxL = r.max >= 99 ? '∞' : String(r.max);
      cards.push({
        name: r.label,
        source: r.className || 'Resource',
        uses: `${left} / ${maxL}`,
        remaining: left,
        max: r.max,
        recover: r.recover,
        text: `${r.label} pool for ${r.className || 'class'}. Remaining shown as current / max.`
      });
    });

    // Class features up to each class level (combat-relevant + all detailed)
    list.forEach(c => {
      (abilities[c.name] || []).filter(a => (a.lvl || 0) <= (c.level || 1)).forEach(a => {
        cards.push({
          name: a.name,
          lvl: a.lvl,
          source: `${c.name} ${c.level}`,
          text: (typeof resolveFeaturePlaceholders === 'function' ? resolveFeaturePlaceholders(a.text || '', ch) : (a.text || ''))
        });
      });
      // Subclass / path features (custom pack + Moon Paths)
      const sub = findSubclass(c.name, c.subclass || (c.name === primaryClassName(ch) ? ch.subclass : ''));
      if (sub && Array.isArray(sub.features)) {
        sub.features.filter(f => (f.lvl || 0) <= (c.level || 1)).forEach(f => {
          cards.push({
            name: f.name,
            lvl: f.lvl,
            source: sub.name,
            text: f.text || ''
          });
        });
      } else if (c.name === 'Moon Guardian') {
        const path = findMoonPath(c.subclass || ch.subclass);
        if (path) {
          (path.features || []).filter(f => f.lvl <= c.level).forEach(f => {
            cards.push({
              name: f.name,
              lvl: f.lvl,
              source: path.name,
              text: f.text || ''
            });
          });
        }
      }
    });

    // Feats as cards
    (Array.isArray(ch.feats) ? ch.feats : []).forEach(f => {
      const full = (typeof findFeat === 'function' ? findFeat(f.id) : null) || f;
      cards.push({
        name: full.name || f.name,
        source: 'Feat',
        text: full.text || f.text || ''
      });
    });

    if (!cards.length) return '';
    return `<div class="cs-panel"><div class="cs-panel-title">Ability Cards</div>
      <p class="muted small">Class resources, features, path abilities, and feats — same card style as spells.</p>
      <div class="spell-card-grid ability-card-grid">${cards.map(a => { a.text = expandTemplatePlaceholders(a.text || '', ch); return abilityCardHtml(a); }).join('')}</div>
    </div>`;
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




  /** Expand Aurora/{{template}} placeholders using character stats when available */
  function expandTemplatePlaceholders(text, ch) {
    if (!text) return '';
    let s = String(text);
    const pb = Number(ch && ch.profBonus) || 2;
    const mod = (ab) => {
      if (!ch) return 0;
      const v = Number(ch[ab]) || 10;
      return Math.floor((v - 10) / 2);
    };
    const dc = (ab) => 8 + pb + mod(ab);
    const map = {
      'wild surge:dc': () => String(dc('con')),
      'ki:dc': () => String(dc('wis')),
      'spellcasting:dc': () => {
        const ab = (ch && ch.spellcastingAbility || 'int').toLowerCase().slice(0, 3);
        const key = ab === 'cha' ? 'cha' : ab === 'wis' ? 'wis' : 'int';
        return String(dc(key));
      },
      'spellcasting:dc:int': () => String(dc('int')),
      'spellcasting:dc:wis': () => String(dc('wis')),
      'spellcasting:dc:cha': () => String(dc('cha')),
      'proficiency': () => String(pb),
      'proficiency:half': () => String(Math.floor(pb / 2)),
      'strength:modifier': () => String(mod('str')),
      'dexterity:modifier': () => String(mod('dex')),
      'constitution:modifier': () => String(mod('con')),
      'intelligence:modifier': () => String(mod('int')),
      'wisdom:modifier': () => String(mod('wis')),
      'charisma:modifier': () => String(mod('cha')),
      'level': () => String((ch && (totalCharacterLevel(ch) || ch.level)) || 1),
      'martial arts:dice': () => {
        const lvl = (normalizeClassLevels(ch).find(c => c.name === 'Monk') || {}).level || 1;
        return lvl >= 17 ? '1d10' : lvl >= 11 ? '1d8' : lvl >= 5 ? '1d6' : '1d4';
      },
      'sneak-attack:die': () => {
        const lvl = (normalizeClassLevels(ch).find(c => c.name === 'Rogue') || {}).level || 1;
        return Math.ceil(lvl / 2) + 'd6';
      },
      'bardic-inspiration:dice': () => {
        const lvl = (normalizeClassLevels(ch).find(c => c.name === 'Bard') || {}).level || 1;
        return lvl >= 15 ? '1d12' : lvl >= 10 ? '1d10' : lvl >= 5 ? '1d8' : '1d6';
      }
    };
    s = s.replace(/\{\{([^}]+)\}\}/g, (full, key) => {
      const k = String(key).trim().toLowerCase();
      if (map[k]) return map[k]();
      // level:classname
      const lm = k.match(/^level:([a-z]+)/);
      if (lm && ch) {
        const cls = normalizeClassLevels(ch).find(c => c.name.toLowerCase() === lm[1]);
        return String(cls ? cls.level : 0);
      }
      // generic :dc with ability word
      if (k.endsWith(':dc') || k.endsWith(' dc')) {
        return String(dc('con'));
      }
      return full; // leave unknown
    });
    return s;
  }


  function resolveFeaturePlaceholders(text, ch) {
    if (!text) return '';
    let s = String(text);
    if (!ch) return s.replace(/\{\{[^}]+\}\}/g, '—');
    const pb = Number(ch.profBonus) || profBonusForTotalLevel(totalCharacterLevel(ch));
    const mod = (ab) => abilityModNum(ch[ab] != null ? ch[ab] : 10);
    const dcCon = 8 + pb + mod('con');
    const dcCha = 8 + pb + mod('cha');
    const dcWis = 8 + pb + mod('wis');
    const dcInt = 8 + pb + mod('int');
    s = s.replace(/\{\{\s*wild\s*surge\s*:\s*dc\s*\}\}/gi, String(dcCon));
    s = s.replace(/\{\{\s*save\s*dc\s*:\s*con\s*\}\}/gi, String(dcCon));
    s = s.replace(/\{\{\s*save\s*dc\s*:\s*cha\s*\}\}/gi, String(dcCha));
    s = s.replace(/\{\{\s*save\s*dc\s*:\s*wis\s*\}\}/gi, String(dcWis));
    s = s.replace(/\{\{\s*save\s*dc\s*:\s*int\s*\}\}/gi, String(dcInt));
    s = s.replace(/\{\{\s*pb\s*\}\}/gi, String(pb));
    // Plain language fallbacks often found in imported XML
    s = s.replace(/the save DC is \{\{[^}]+\}\}/gi, `the save DC is ${dcCon}`);
    return s;
  }

  function tableDcForCharacter(table, ch) {
    if (!ch || !table) return null;
    const pb = Number(ch.profBonus) || profBonusForTotalLevel(totalCharacterLevel(ch));
    const ab = (table.dcAbility || 'con').toLowerCase();
    const score = ch[ab] != null ? ch[ab] : 10;
    return 8 + pb + abilityModNum(score);
  }


  function getClassTables() {
    return (typeof window !== 'undefined' && Array.isArray(window.CLASS_TABLES)) ? window.CLASS_TABLES : [];
  }

  function rollClassTable(tableId, ch) {
    const table = getClassTables().find(t => t.id === tableId);
    if (!table) return null;
    const n = table.rows.length;
    if (!n) return null;
    let idx;
    let displayRoll;
    const dice = String(table.dice || '').toLowerCase();
    if (dice === 'd8' && n === 8) {
      const r = 1 + Math.floor(Math.random() * 8);
      idx = r - 1;
      displayRoll = String(r);
    } else if (dice === 'd100') {
      const r = 1 + Math.floor(Math.random() * 100);
      // Map 100 -> row labeled 99–00 if present
      idx = Math.min(n - 1, Math.floor((r === 100 ? 99 : r - 1) / (100 / n)));
      // Better: find row whose range contains r
      idx = Math.floor((Math.min(r, 100) - 1) / 2); // PHB pairs 01-02, 03-04...
      if (idx >= n) idx = n - 1;
      displayRoll = r === 100 ? '00' : String(r).padStart(2, '0');
    } else {
      idx = Math.floor(Math.random() * n);
      displayRoll = table.rows[idx].roll;
    }
    const row = table.rows[idx];
    let effect = row.effect;
    if (ch) effect = resolveFeaturePlaceholders(effect, ch);
    const dc = tableDcForCharacter(table, ch);
    return { table, roll: displayRoll || row.roll, effect, index: idx + 1, dc };
  }

  function renderClassTablesTools() {
    const host = document.getElementById('class-tables-tools');
    if (!host) return;
    const tables = getClassTables();
    if (!tables.length) {
      host.innerHTML = '<div class="tools-block"><h3>Class Tables</h3><p class="muted small">No tables loaded.</p></div>';
      return;
    }
    // Characters from active campaign for DC context
    let party = [];
    try {
      const c = typeof getActive === 'function' ? getActive() : null;
      if (c) {
        ensureCampaignShape(c);
        party = [...(c.party || []), ...(c.villains || [])];
      }
    } catch (e) {}
    host.innerHTML = `
      <div class="tools-block card tool-card span-2">
        <h3>Class Tables</h3>
        <p class="muted small">Subclass tables (Path of Wild Magic, Wild Magic Surge, Divine Intervention). Roll during play. Feature text uses save DC when a character is selected.</p>
        <div class="form-row">
          <div class="field" style="flex:2">
            <label>Table</label>
            <select id="ct-table">
              ${tables.map(t => `<option value="${escapeAttr(t.id)}">${escapeHtml(t.name)}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="flex:1.5">
            <label>Character (for save DC)</label>
            <select id="ct-char">
              <option value="">— None —</option>
              ${party.map(p => `<option value="${escapeAttr(p.id)}">${escapeHtml(p.name || 'Unnamed')}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="align-self:flex-end">
            <button type="button" class="btn primary" id="ct-roll">Roll</button>
          </div>
        </div>
        <div id="ct-detail" class="detail-text" style="margin-top:0.5rem"></div>
        <div id="ct-result" class="cs-panel" style="margin-top:0.5rem;display:none"></div>
      </div>`;
    const sel = host.querySelector('#ct-table');
    const charSel = host.querySelector('#ct-char');
    const detail = host.querySelector('#ct-detail');
    const result = host.querySelector('#ct-result');
    function selectedChar() {
      const id = charSel?.value;
      return party.find(p => p.id === id) || null;
    }
    function showDetail() {
      const t = tables.find(x => x.id === sel.value);
      if (!t || !detail) return;
      const ch = selectedChar();
      const dc = tableDcForCharacter(t, ch);
      detail.innerHTML = `<strong>${escapeHtml(t.name)}</strong> · ${escapeHtml(t.dice || '')} · ${escapeHtml(t.source || '')}
        ${dc != null ? `<span class="stat-chip" style="margin-left:0.35rem">Save DC ${dc}</span>` : ''}
        <p class="muted small">${escapeHtml(t.note || '')}</p>
        <details><summary class="muted small">Show full table (${t.rows.length} rows)</summary>
          <ol class="trait-list compact">${t.rows.map(r => `<li><strong>${escapeHtml(r.roll)}.</strong> ${escapeHtml(r.effect)}</li>`).join('')}</ol>
        </details>`;
    }
    sel?.addEventListener('change', showDetail);
    charSel?.addEventListener('change', showDetail);
    showDetail();
    host.querySelector('#ct-roll')?.addEventListener('click', () => {
      const ch = selectedChar();
      const r = rollClassTable(sel.value, ch);
      if (!r || !result) return;
      result.style.display = 'block';
      result.innerHTML = `<div class="cs-panel-title">Result — ${escapeHtml(r.table.dice || '')}${r.dc != null ? ' · Save DC ' + r.dc : ''}</div>
        <p><strong>Roll:</strong> ${escapeHtml(String(r.roll))} <span class="muted small">(entry ${r.index}/${r.table.rows.length})</span>
        ${ch ? ` · <span class="muted small">for ${escapeHtml(ch.name || 'character')}</span>` : ''}</p>
        <p class="cs-body">${escapeHtml(r.effect)}</p>`;
    });
  }


  function getAllSubclasses() {
    const list = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_SUBCLASSES))
      ? window.CUSTOM_SUBCLASSES.slice() : [];
    // Moon Paths as subclasses of Moon Guardian
    if (typeof getMoonPaths === 'function') {
      getMoonPaths().forEach(p => {
        if (!list.some(s => s.name === p.name && s.parentClass === 'Moon Guardian')) {
          list.push({
            id: 'moon-' + (p.id || p.name),
            name: p.name,
            parentClass: 'Moon Guardian',
            source: 'DSC',
            summary: p.summary || '',
            features: (p.features || []).map(f => ({ name: f.name, lvl: f.lvl, text: f.text || '' }))
          });
        }
      });
    }
    return list;
  }

  function subclassesForClass(className) {
    const n = String(className || '').trim().toLowerCase();
    if (!n) return [];
    return getAllSubclasses().filter(s => String(s.parentClass || '').toLowerCase() === n)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function findSubclass(className, subclassName) {
    if (!subclassName) return null;
    const list = subclassesForClass(className);
    const q = String(subclassName).toLowerCase();
    return list.find(s => s.name.toLowerCase() === q) ||
      getAllSubclasses().find(s => s.name.toLowerCase() === q) || null;
  }

  function subclassOptionsHtml(className, selected) {
    const opts = subclassesForClass(className);
    const sel = String(selected || '');
    let html = `<option value="">— Subclass —</option>`;
    opts.forEach(s => {
      html += `<option value="${escapeAttr(s.name)}" ${s.name === sel ? 'selected' : ''}>${escapeHtml(s.name)}</option>`;
    });
    if (sel && !opts.some(s => s.name === sel)) {
      html += `<option value="${escapeAttr(sel)}" selected>${escapeHtml(sel)} (custom)</option>`;
    }
    return html;
  }



  function getBackgroundList() {
    const a = (window.DSCExtensions && window.DSCExtensions.BACKGROUNDS) || [];
    const b = window.DSC_BACKGROUNDS || [];
    const map = new Map();
    [...a, ...b].forEach(bg => { if (bg && bg.name) map.set(bg.name.toLowerCase(), bg); });
    return [...map.values()].sort((x,y) => x.name.localeCompare(y.name));
  }

  function mergeAllCustomContent() {
    try { mergeCustomFeatsIntoLibrary(); } catch (e) {}
    try { mergeCustomClassesIntoPhb(); } catch (e) {}
    // Races
    const races = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_RACES)) ? window.CUSTOM_RACES : [];
    if (races.length) {
      if (!Array.isArray(window.PHB_RACES)) window.PHB_RACES = [];
      const have = new Set(window.PHB_RACES.map(r => (r.name || '').toLowerCase()));
      races.forEach(r => {
        const n = (r.name || '').toLowerCase();
        if (!n || have.has(n)) return;
        window.PHB_RACES.push({
          name: r.name,
          world: r.source || '',
          tagline: r.summary || '',
          short: r.summary || '',
          size: r.size || 'Medium',
          speed: r.speed || '30 ft.',
          traits: (r.traits || []).map(t => ({ name: t.name, text: t.text || '' })),
          source: r.source || 'Custom'
        });
        have.add(n);
      });
    }
    // Backgrounds
    const bgs = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_BACKGROUNDS)) ? window.CUSTOM_BACKGROUNDS : [];
    if (bgs.length) {
      if (!Array.isArray(window.BACKGROUNDS)) window.BACKGROUNDS = window.BACKGROUNDS || [];
      // extensions.js uses BACKGROUNDS const - also try window
      const target = (typeof BACKGROUNDS !== 'undefined' && Array.isArray(BACKGROUNDS)) ? BACKGROUNDS : null;
      const list = target || window.DSC_BACKGROUNDS || [];
      if (!window.DSC_BACKGROUNDS) window.DSC_BACKGROUNDS = list.slice ? list.slice() : [];
      const haveB = new Set((window.DSC_BACKGROUNDS || []).map(b => (b.name || '').toLowerCase()));
      bgs.forEach(b => {
        const n = (b.name || '').toLowerCase();
        if (!n || haveB.has(n)) return;
        window.DSC_BACKGROUNDS.push({
          name: b.name,
          skills: b.skills || [],
          feature: b.feature || b.name,
          featureText: b.featureText || b.summary || '',
          source: b.source || 'Custom'
        });
        haveB.add(n);
      });
    }
    // Spells
    const spells = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_SPELLS)) ? window.CUSTOM_SPELLS : [];
    if (spells.length && Array.isArray(window.SPELLS)) {
      const haveS = new Set(window.SPELLS.map(s => (s.name || '').toLowerCase()));
      spells.forEach(sp => {
        const n = (sp.name || '').toLowerCase();
        if (!n || haveS.has(n)) return;
        window.SPELLS.push({
          id: sp.id || n.replace(/\s+/g, '-'),
          name: sp.name,
          level: sp.level || 0,
          school: sp.school || '—',
          time: sp.time || '1 action',
          range: sp.range || '—',
          duration: sp.duration || '—',
          components: sp.components || '—',
          description: sp.description || '',
          summary: (sp.description || '').slice(0, 160),
          classes: Array.isArray(sp.classes) ? sp.classes : [],
          source: sp.source || 'Custom'
        });
        haveS.add(n);
      });
    }
    // Items / equipment
    const items = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_ITEMS)) ? window.CUSTOM_ITEMS : [];
    if (items.length && Array.isArray(window.EQUIPMENT)) {
      const haveE = new Set(window.EQUIPMENT.map(e => (e.name || '').toLowerCase()));
      items.forEach(it => {
        const n = (it.name || '').toLowerCase();
        if (!n || haveE.has(n)) return;
        window.EQUIPMENT.push({
          id: it.id || n.replace(/\s+/g, '-'),
          name: it.name,
          category: it.category || (it.magic ? 'magic' : 'gear'),
          cost: it.cost || '',
          weight: it.weight || 0,
          notes: it.notes || '',
          magic: !!it.magic,
          source: it.source || 'Custom'
        });
        haveE.add(n);
      });
    }
    // Extra class names for dropdowns
    const xcls = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_CLASSES)) ? window.CUSTOM_CLASSES : [];
    if (xcls.length && typeof getPhbClasses === 'function') {
      // ensure PHB_CLASSES list includes them as minimal entries
      if (!Array.isArray(window.PHB_CLASSES)) window.PHB_CLASSES = [];
      const haveC = new Set(window.PHB_CLASSES.map(c => (c.name || '').toLowerCase()));
      xcls.forEach(c => {
        const n = (c.name || '').toLowerCase();
        if (!n || haveC.has(n)) return;
        window.PHB_CLASSES.push({
          name: c.name,
          hitDie: c.hitDie || 'd8',
          primary: c.primary || '—',
          saves: c.saves || '—',
          summary: c.summary || '',
          progression: [],
          source: c.source || 'Custom'
        });
        haveC.add(n);
      });
    }
  }


  function mergeCustomFeatsIntoLibrary() {
    const custom = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_FEATS)) ? window.CUSTOM_FEATS : [];
    if (!custom.length) return;
    if (!Array.isArray(window.FEATS)) window.FEATS = [];
    const have = new Set(window.FEATS.map(f => (f.name || '').toLowerCase()));
    custom.forEach(f => {
      const n = (f.name || '').toLowerCase();
      if (!n || have.has(n)) return;
      window.FEATS.push({
        id: f.id || n.replace(/\s+/g, '-'),
        name: f.name,
        text: f.text || '',
        prerequisite: f.prerequisite || '',
        source: f.source || 'Custom'
      });
      have.add(n);
    });
  }

  function mergeCustomClassesIntoPhb() {
    const extra = (typeof window !== 'undefined' && Array.isArray(window.CUSTOM_CLASSES)) ? window.CUSTOM_CLASSES : [];
    if (!extra.length || typeof getPhbClasses !== 'function') return;
    // Soft: only ensure names appear in class dropdown via window.CUSTOM_CLASS_NAMES
    window.CUSTOM_CLASS_NAMES = extra.map(c => c.name).filter(Boolean);
  }


  // ─── Multiclass (PHB rules) ──────────────────────────────────────────────
  const MULTICLASS_PREREQS = {
    Barbarian: { any: ['str'], min: 13 },
    Bard: { all: ['cha'], min: 13 },
    Cleric: { all: ['wis'], min: 13 },
    Druid: { all: ['wis'], min: 13 },
    Fighter: { any: ['str', 'dex'], min: 13 },
    Monk: { all: ['dex', 'wis'], min: 13 },
    Paladin: { all: ['str', 'cha'], min: 13 },
    Ranger: { all: ['dex', 'wis'], min: 13 },
    Rogue: { all: ['dex'], min: 13 },
    Sorcerer: { all: ['cha'], min: 13 },
    Warlock: { all: ['cha'], min: 13 },
    Wizard: { all: ['int'], min: 13 },
    'Moon Guardian': { any: ['wis', 'cha'], min: 13 },
    Bloodhunter: { any: ['str', 'dex'], min: 13 },
    Ghostblade: { any: ['dex', 'int'], min: 13 },
    Shadowblade: { any: ['dex', 'cha'], min: 13 }
  };

  const THIRD_CASTERS = ['Fighter', 'Rogue']; // Eldritch Knight / Arcane Trickster — treated when subclass hints

  function normalizeClassLevels(ch) {
    let list = Array.isArray(ch.classes) ? ch.classes.map(c => ({
      name: String(c.name || c.class || '').trim(),
      level: clamp(parseInt(c.level, 10) || 1, 1, 40),
      subclass: String(c.subclass || '').trim()
    })).filter(c => c.name) : [];
    if (!list.length && ch.class) {
      list = [{ name: ch.class, level: clamp(parseInt(ch.level, 10) || 1, 1, 40), subclass: ch.subclass || '' }];
    }
    if (!list.length) list = [{ name: '', level: 1, subclass: '' }];
    return list;
  }

  function totalCharacterLevel(ch) {
    return normalizeClassLevels(ch).reduce((s, c) => s + (c.level || 0), 0) || clamp(parseInt(ch.level, 10) || 1, 1, 40);
  }

  function primaryClassName(ch) {
    const list = normalizeClassLevels(ch);
    return (list[0] && list[0].name) || ch.class || '';
  }

  function classLevelsSummary(ch) {
    return normalizeClassLevels(ch)
      .filter(c => c.name)
      .map(c => `${c.name} ${c.level}${c.subclass ? ' (' + c.subclass + ')' : ''}`)
      .join(' / ') || (ch.class ? `${ch.class} ${ch.level || 1}` : '—');
  }

  function profBonusForTotalLevel(level) {
    const lvl = clamp(Number(level) || 1, 1, 40);
    if (window.PHB_PROF_BY_LEVEL && window.PHB_PROF_BY_LEVEL[Math.min(lvl, 20)]) {
      if (lvl <= 20) return window.PHB_PROF_BY_LEVEL[lvl] || 2;
    }
    // PHB progression, extended for epic (DM optional)
    if (lvl <= 4) return 2;
    if (lvl <= 8) return 3;
    if (lvl <= 12) return 4;
    if (lvl <= 16) return 5;
    if (lvl <= 20) return 6;
    if (lvl <= 24) return 7;
    if (lvl <= 28) return 8;
    if (lvl <= 32) return 9;
    return 10;
  }

  function checkMulticlassPrereq(className, scores) {
    const rule = MULTICLASS_PREREQS[className];
    if (!rule) return { ok: true, note: '' };
    const min = rule.min || 13;
    const val = (k) => Number(scores[k]) || 10;
    if (rule.any) {
      const ok = rule.any.some(a => val(a) >= min);
      return { ok, note: ok ? '' : `Requires ${rule.any.map(a => a.toUpperCase()).join(' or ')} ${min}+` };
    }
    if (rule.all) {
      const ok = rule.all.every(a => val(a) >= min);
      return { ok, note: ok ? '' : `Requires ${rule.all.map(a => a.toUpperCase() + ' ' + min).join(' and ')}` };
    }
    return { ok: true, note: '' };
  }

  /** Multiclass caster level for the combined spell slot table (PHB). */
  function multiclassCasterLevel(ch) {
    let total = 0;
    const list = normalizeClassLevels(ch);
    list.forEach(c => {
      if (!c.name || !c.level) return;
      const type = getCasterType(c.name);
      if (type === 'full') total += c.level;
      else if (type === 'half') total += Math.floor(c.level / 2);
      else if (type === 'pact') { /* pact magic separate */ }
      else if (THIRD_CASTERS.includes(c.name)) {
        // Only if subclass suggests caster archetype
        const sub = (c.subclass || '').toLowerCase();
        if (sub.includes('eldritch') || sub.includes('arcane trickster') || sub.includes('trickster')) {
          total += Math.floor(c.level / 3);
        }
      }
    });
    return total;
  }

  function warlockLevels(ch) {
    return normalizeClassLevels(ch).filter(c => c.name === 'Warlock').reduce((s, c) => s + c.level, 0);
  }

  function getMulticlassSpellSlotMaxes(ch) {
    const casterLvl = clamp(multiclassCasterLevel(ch), 0, 20);
    const out = {};
    if (casterLvl > 0) {
      const row = (window.SPELL_SLOTS_FULL || [])[casterLvl] || [];
      row.forEach((n, i) => { out[i + 1] = n; });
    }
    const wl = warlockLevels(ch);
    if (wl > 0) {
      const row = (window.SPELL_SLOTS_WARLOCK || [])[clamp(wl, 1, 20)];
      if (row) {
        out.pactLevel = row[0];
        out.pactCount = row[1];
      }
    }
    return out;
  }

  function multiclassEditorHtml(ch, opts = {}) {
    const allowEpic = opts.allowEpic !== false;
    const maxLvl = allowEpic ? 40 : 20;
    const list = normalizeClassLevels(ch);
    const rows = list.map((c, idx) => `
      <div class="mc-row" data-mc-idx="${idx}">
        <select class="mc-class" data-idx="${idx}">
          <option value="">— Class —</option>
          ${classOptionsHtml(c.name)}
        </select>
        <input type="number" class="mc-level" data-idx="${idx}" min="1" max="${maxLvl}" value="${c.level}" title="Levels in this class" />
        <select class="mc-subclass" data-idx="${idx}">${subclassOptionsHtml(c.name, c.subclass)}</select>
        <button type="button" class="btn ghost btn-tiny mc-remove" data-idx="${idx}" title="Remove">✕</button>
      </div>`).join('');
    const total = list.reduce((s, c) => s + (c.level || 0), 0);
    return `
      <div class="multiclass-editor" id="m-multiclass">
        <div class="mc-head">
          <span>Class</span><span>Lvl</span><span>Subclass</span><span></span>
        </div>
        <div id="m-mc-rows">${rows}</div>
        <div class="mc-footer">
          <button type="button" class="btn secondary btn-tiny" id="m-mc-add">+ Add class</button>
          <span class="muted small" id="m-mc-total">Character level: <strong>${total}</strong>${total > 20 ? ' <em>(epic)</em>' : ''}</span>
        </div>
        <p class="muted small">Multiclass follows PHB rules: total level sums class levels; proficiency from total level; spell slots use the multiclass caster table. ${allowEpic ? 'Levels above 20 are allowed (DM option).' : 'Max total level 20.'}</p>
        <p class="muted small" id="m-mc-prereq"></p>
      </div>`;
  }

  function readMulticlassFromForm() {
    const rows = document.querySelectorAll('#m-mc-rows .mc-row');
    const list = [];
    rows.forEach(row => {
      const name = row.querySelector('.mc-class')?.value?.trim() || '';
      const level = clamp(parseInt(row.querySelector('.mc-level')?.value, 10) || 1, 1, 40);
      const subclass = row.querySelector('.mc-subclass')?.value?.trim() || '';
      if (name) list.push({ name, level, subclass });
    });
    if (!list.length) {
      const fallback = $('#m-class')?.value?.trim();
      if (fallback) list.push({ name: fallback, level: clamp(parseInt($('#m-level')?.value, 10) || 1, 1, 40), subclass: $('#m-subclass')?.value?.trim() || '' });
    }
    return list;
  }

  function wireMulticlassEditor(existing) {
    function refreshMcProg() {
      const box = document.getElementById('m-class-prog');
      if (!box) return;
      const list = readMulticlassFromForm();
      const fake = { class: list[0]?.name || '', classes: list, level: list.reduce((s,c)=>s+(c.level||0),0) };
      box.innerHTML = multiclassProgressionHtml(fake);
    }

    const root = $('#m-multiclass');
    if (!root) return;
    const allowEpic = true;
    const maxLvl = 40;

    function scoresFromForm() {
      return {
        str: parseInt($('#m-total-str')?.textContent, 10) || parseInt($('#m-str')?.value, 10) || 10,
        dex: parseInt($('#m-total-dex')?.textContent, 10) || parseInt($('#m-dex')?.value, 10) || 10,
        con: parseInt($('#m-total-con')?.textContent, 10) || parseInt($('#m-con')?.value, 10) || 10,
        int: parseInt($('#m-total-int')?.textContent, 10) || parseInt($('#m-int')?.value, 10) || 10,
        wis: parseInt($('#m-total-wis')?.textContent, 10) || parseInt($('#m-wis')?.value, 10) || 10,
        cha: parseInt($('#m-total-cha')?.textContent, 10) || parseInt($('#m-cha')?.value, 10) || 10
      };
    }

    function updateTotal() {
      const list = readMulticlassFromForm();
      const total = list.reduce((s, c) => s + c.level, 0) || 1;
      const el = $('#m-mc-total');
      if (el) el.innerHTML = `Character level: <strong>${total}</strong>${total > 20 ? ' <em>(epic)</em>' : ''}`;
      const levelInp = $('#m-level');
      if (levelInp) levelInp.value = total;
      const profInp = $('#m-prof');
      if (profInp) profInp.value = profBonusForTotalLevel(total);
      // prereqs for secondary+ classes
      const scores = scoresFromForm();
      const notes = [];
      list.forEach((c, i) => {
        if (i === 0) return;
        const r = checkMulticlassPrereq(c.name, scores);
        if (!r.ok) notes.push(`${c.name}: ${r.note}`);
      });
      const pre = $('#m-mc-prereq');
      if (pre) pre.textContent = notes.length ? '⚠ ' + notes.join(' · ') : (list.length > 1 ? 'Multiclass ability prerequisites look OK.' : '');
      // sync primary class fields for legacy UI pieces
      const primary = list[0];
      if (primary) {
        const cs = $('#m-class');
        const sc = $('#m-subclass');
        if (cs) cs.value = primary.name;
        if (sc) sc.value = primary.subclass || '';
      }
      if (typeof refreshSpellSection === 'function') refreshSpellSection();
      if (typeof refreshSpellDc === 'function') refreshSpellDc();
      if (typeof refreshAttacks === 'function') refreshAttacks(true);
      if (typeof refreshMcProg === 'function') refreshMcProg();
    }

    root.addEventListener('input', (e) => {
      if (e.target.classList.contains('mc-class')) {
        const row = e.target.closest('.mc-row');
        const sc = row?.querySelector('.mc-subclass');
        if (sc) {
          const prev = sc.value;
          sc.innerHTML = subclassOptionsHtml(e.target.value, prev);
        }
      }
      if (e.target.classList.contains('mc-level') || e.target.classList.contains('mc-subclass') || e.target.classList.contains('mc-class')) updateTotal();
    });
    root.addEventListener('change', (e) => {
      if (e.target.classList.contains('mc-class') || e.target.classList.contains('mc-level')) updateTotal();
    });
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.mc-remove');
      if (btn) {
        const row = btn.closest('.mc-row');
        const box = $('#m-mc-rows');
        if (row && box && box.querySelectorAll('.mc-row').length > 1) {
          row.remove();
          updateTotal();
        } else {
          toast('Keep at least one class');
        }
      }
    });
    $('#m-mc-add')?.addEventListener('click', () => {
      const box = $('#m-mc-rows');
      if (!box) return;
      const idx = box.querySelectorAll('.mc-row').length;
      const div = document.createElement('div');
      div.className = 'mc-row';
      div.dataset.mcIdx = String(idx);
      div.innerHTML = `
        <select class="mc-class" data-idx="${idx}">
          <option value="">— Class —</option>
          ${classOptionsHtml('')}
        </select>
        <input type="number" class="mc-level" data-idx="${idx}" min="1" max="${maxLvl}" value="1" />
        <select class="mc-subclass" data-idx="${idx}">${subclassOptionsHtml('', '')}</select>
        <button type="button" class="btn ghost btn-tiny mc-remove" data-idx="${idx}" title="Remove">✕</button>`;
      box.appendChild(div);
      updateTotal();
    });
    updateTotal();
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


  function slotStepperHtml(level, used, max) {
    return `<div class="slot-stepper" data-sl="${level}">
      <span class="slot-label">L${level}</span>
      <button type="button" class="slot-dec" aria-label="Decrease">−</button>
      <span class="slot-val" data-sl="${level}">${used}</span>
      <span class="slot-max">/ ${max}</span>
      <button type="button" class="slot-inc" aria-label="Increase">+</button>
      <input type="hidden" class="m-slot" data-sl="${level}" value="${used}" />
    </div>`;
  }

  function wireSlotSteppers(root) {
    const scope = root || document;
    scope.querySelectorAll('.slot-stepper').forEach(el => {
      if (el.dataset.wired) return;
      el.dataset.wired = '1';
      const maxFromData = parseInt(el.dataset.max || '0', 10);
      const max = maxFromData || parseInt(el.querySelector('.slot-max')?.textContent.replace(/\D/g, '') || '0', 10) || 0;
      const valEl = el.querySelector('.slot-val');
      const hidden = el.querySelector('.m-slot') || el.querySelector('#m-slot-pact');
      const set = (n) => {
        n = Math.max(0, Math.min(max, n));
        if (valEl) valEl.textContent = String(n);
        if (hidden) hidden.value = String(n);
      };
      el.querySelector('.slot-dec')?.addEventListener('click', () => set((parseInt(valEl?.textContent, 10) || 0) - 1));
      el.querySelector('.slot-inc')?.addEventListener('click', () => set((parseInt(valEl?.textContent, 10) || 0) + 1));
    });
    scope.querySelectorAll('.res-stepper').forEach(el => {
      if (el.dataset.wired) return;
      el.dataset.wired = '1';
      const max = parseInt(el.dataset.max || '0', 10) || 0;
      const valEl = el.querySelector('.res-val');
      const hidden = el.querySelector('.m-resource');
      const set = (n) => {
        n = Math.max(0, Math.min(max, n));
        if (valEl) valEl.textContent = String(n);
        if (hidden) hidden.value = String(n);
      };
      el.querySelector('.res-dec')?.addEventListener('click', () => set((parseInt(valEl?.textContent, 10) || 0) - 1));
      el.querySelector('.res-inc')?.addEventListener('click', () => set((parseInt(valEl?.textContent, 10) || 0) + 1));
    });
  }


  function spellSlotsEditorHtml(ch) {
    const list = normalizeClassLevels(ch);
    const primary = primaryClassName(ch);
    const casterLvl = multiclassCasterLevel(ch);
    const wl = warlockLevels(ch);
    const castingClasses = list.filter(c => {
      const t = getCasterType(c.name);
      return t === 'full' || t === 'half' || t === 'pact' ||
        (['Fighter', 'Rogue'].includes(c.name) && /eldritch|arcane trickster|trickster/i.test(c.subclass || ''));
    });
    const multiCaster = castingClasses.length > 1 || (list.length > 1 && casterLvl > 0);
    if (casterLvl <= 0 && wl <= 0 && getCasterType(primary) === 'none') {
      return `<p class="muted small" id="m-spell-none">No spell slots for the current class mix. (Subclass casting can be tracked in Features.)</p>
        <div id="m-spell-body" class="hidden"></div>`;
    }
    // Multiclass: PHB combined slot table from all caster levels. Single class: that class table.
    const maxes = (multiCaster || (list.length > 1 && (casterLvl > 0 || wl > 0)))
      ? getMulticlassSpellSlotMaxes(ch)
      : getSpellSlotMaxes(primary, (list.find(c => c.name === primary) || {}).level || totalCharacterLevel(ch));
    const used = ch.spellSlotsUsed || {};
    let slotsHtml = '';
    {
      const levels = Object.keys(maxes).map(Number).filter(n => !isNaN(n)).sort((a,b)=>a-b);
      if (levels.length) {
        slotsHtml += `<div class="spell-slots-row">${levels.map(sl => {
          const max = maxes[sl];
          const u = used[sl] != null ? used[sl] : 0;
          return slotStepperHtml(sl, u, max);
        }).join('')}</div>`;
      }
      if (maxes.pactLevel) {
        const pl = maxes.pactLevel || 1;
        const pc = maxes.pactCount || 1;
        const u = used.pact != null ? used.pact : 0;
        slotsHtml += `<div class="spell-slots-row">
          <div class="slot-stepper" data-sl="pact" data-max="${pc}">
            <span class="slot-label">Pact L${pl}</span>
            <button type="button" class="slot-dec">−</button>
            <span class="slot-val">${u}</span>
            <span class="slot-max">/ ${pc}</span>
            <button type="button" class="slot-inc">+</button>
            <input type="hidden" id="m-slot-pact" value="${u}" />
          </div>
        </div>
        <p class="muted small">Warlock pact slots recover on a Short Rest. Multiclass spell slots (above) use Long Rest.</p>`;
      }
      if (!slotsHtml) slotsHtml = `<p class="muted small">No spell slots at this level.</p>`;
      if (list.length > 1 && (casterLvl > 0 || wl > 0)) {
        const bits = castingClasses.map(c => `${c.name} ${c.level}`).join(' + ');
        slotsHtml = `<p class="muted small">Multiclass slots from: <strong>${escapeHtml(bits || 'casters')}</strong> (caster level ${casterLvl}${wl ? ', Warlock ' + wl : ''})</p>` + slotsHtml;
      }
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
    const list = normalizeClassLevels(ch);
    const casterLvl = multiclassCasterLevel(ch);
    const wl = warlockLevels(ch);
    const type = getCasterType(primaryClassName(ch));
    if (type === 'none' && casterLvl <= 0 && wl <= 0 && !(ch.spells || ch.cantrips || (ch.spellIds || []).length)) return '';
    const ab = ch.spellcastingAbility || defaultSpellAbility(primaryClassName(ch)) || 'WIS';
    const pb = ch.profBonus || profBonusForTotalLevel(totalCharacterLevel(ch));
    const info = computeSpellDcAtk(ab, ch, pb);
    const multiCaster = list.length > 1 && (casterLvl > 0 || wl > 0);
    const maxes = multiCaster || (casterLvl > 0 && list.length > 1)
      ? getMulticlassSpellSlotMaxes(ch)
      : (type !== 'none'
          ? getSpellSlotMaxes(primaryClassName(ch), (list.find(c => c.name === primaryClassName(ch)) || {}).level || ch.level || 1)
          : getMulticlassSpellSlotMaxes(ch));
    const used = ch.spellSlotsUsed || {};
    let slotsLine = '';
    const levelKeys = Object.keys(maxes).map(Number).filter(n => !isNaN(n)).sort((a,b)=>a-b);
    if (levelKeys.length) {
      slotsLine = levelKeys.map(sl => {
        const u = used[sl] != null ? used[sl] : 0;
        return `L${sl} ${u}/${maxes[sl]}`;
      }).join(' · ');
    }
    if (maxes.pactLevel) {
      const u = used.pact != null ? used.pact : 0;
      slotsLine = (slotsLine ? slotsLine + ' · ' : '') + `Pact L${maxes.pactLevel}: ${u}/${maxes.pactCount}`;
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
      weight: it.weight != null ? Number(it.weight) : 0,
      magic: !!it.magic,
      magicBonus: it.magicBonus != null ? Number(it.magicBonus) : 0,
      rarity: it.rarity || '',
      attunement: !!it.attunement
    };
  }

  function catalogItemToInventory(cat) {
    return normalizeInventoryItem({
      id: cat.id,
      name: cat.name,
      category: cat.category,
      magic: cat.magic,
      magicBonus: cat.magicBonus,
      rarity: cat.rarity,
      attunement: cat.attunement,
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
    if (category && category !== 'all') {
      if (category === 'magic') {
        list = list.filter(e => e.magic || e.category === 'magic' || e.magicBonus || /rarity\s*:|attunement|\(\+\d+\)/i.test((e.notes || '') + (e.name || '')));
      } else if (category === 'weapon') {
        list = list.filter(e => e.category === 'weapon');
      } else {
        list = list.filter(e => e.category === category);
      }
    }
    if (q) {
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.category || '').includes(q) ||
        (e.weaponType || '').toLowerCase().includes(q) ||
        (e.armorType || '').toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q) ||
        (e.props || '').toLowerCase().includes(q) ||
        (e.rarity || '').toLowerCase().includes(q)
      );
    }
    // Prefer showing magic weapons when searching for +1/+2 or "magic"
    list = list.slice(0, category === 'magic' || /\+\d|magic/i.test(q) ? 80 : 40);
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
        <div class="equip-result-main"><strong>${escapeHtml(e.name)}</strong>${e.magic || e.category === 'magic' || e.magicBonus ? '<span class="equip-badge-magic">Magic</span>' : ''} <span class="muted small">${escapeHtml(e.category)}${e.rarity ? ' · ' + escapeHtml(e.rarity) : ''}${e.cost ? ' · ' + escapeHtml(e.cost) : ''}${e.damage ? ' · ' + escapeHtml(e.damage) : ''}</span></div>
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


  
  

  function refreshPreparedSpellCheckboxes() {
    const wrap = document.getElementById('m-prep-spells-wrap');
    if (!wrap) return;
    const mode = document.getElementById('m-spell-prep-mode')?.value || 'known';
    const preparedSet = new Set(
      String(document.getElementById('m-prepared-spells')?.value || '')
        .split(/[\n,;]+/).map(s => s.trim().toLowerCase()).filter(Boolean)
    );
    const ids = (document.getElementById('m-spell-ids')?.value || '').split(',').map(s => s.trim()).filter(Boolean);
    const names = [];
    ids.forEach(id => {
      const sp = typeof findSpell === 'function' ? findSpell(id) : null;
      if (sp && sp.level > 0) names.push(sp);
    });
    // also from text
    String(document.getElementById('m-spells')?.value || '').split(/[\n,;]+/).forEach(n => {
      n = n.trim();
      if (!n) return;
      const sp = typeof findSpell === 'function' ? findSpell(n) : null;
      if (sp && sp.level > 0 && !names.some(x => x.id === sp.id)) names.push(sp);
      else if (!sp) names.push({ id: n, name: n, level: 1 });
    });
    const listEl = wrap.querySelector('.form-row') || wrap;
    if (!names.length) {
      const target = wrap.querySelector('[class*="form-row"]') || wrap;
      // rebuild checkbox area
    }
    let box = document.getElementById('m-prep-checkbox-list');
    if (!box) {
      box = document.createElement('div');
      box.id = 'm-prep-checkbox-list';
      box.className = 'form-row';
      box.style.cssText = 'flex-wrap:wrap;gap:0.35rem;max-height:12rem;overflow:auto;border:1px solid rgba(255,255,255,0.08);padding:0.4rem;border-radius:6px';
      wrap.insertBefore(box, wrap.querySelector('#m-prepared-spells') || null);
    }
    box.innerHTML = names.length
      ? names.map(s => {
          const checked = preparedSet.has(s.name.toLowerCase()) || preparedSet.has(String(s.id).toLowerCase());
          return `<label class="checkbox-row"><input type="checkbox" class="m-prep-spell" value="${escapeAttr(s.name)}" ${checked ? 'checked' : ''} ${mode === 'known' ? 'disabled' : ''}/> <span>${escapeHtml(s.name)} <span class="muted small">(L${s.level})</span></span></label>`;
        }).join('')
      : '<p class="muted small">Add known spells first (Spellcasting section), then select which are prepared.</p>';
    wrap.style.opacity = mode === 'prepared' ? '1' : '0.55';
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
      if (typeof refreshPreparedSpellCheckboxes === 'function') refreshPreparedSpellCheckboxes();
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
      const classNames = castingClassNamesFromForm();
      const q = (search?.value || '').trim().toLowerCase();
      const lf = levelF?.value || 'all';
      try { ensureMoonGuardianSpellList(); } catch (e) {}
      let list = spellsForClasses(classNames);
      if (!list.length && classNames.some(c => /moon guardian/i.test(c))) {
        // last resort: any spell matching MG name list
        list = spellsForClasses(['Moon Guardian']);
      }
      if (lf !== 'all') list = list.filter(s => String(s.level) === lf);
      if (q) list = list.filter(s => s.name.toLowerCase().includes(q) || (s.school || '').toLowerCase().includes(q) || (s.summary || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
      list = list.slice(0, 40);
      const have = new Set(getIds());
      if (!list.length) {
        const hint = classNames.length
          ? `No spells for ${classNames.join(', ')}. ${/moon guardian/i.test(classNames.join(' ')) ? 'Moon Guardian list may still be loading — try clearing search or re-open the sheet.' : 'Try another class or sync spells from Tools.'}`
          : 'No spells match.';
        results.innerHTML = `<p class="muted small">${hint}</p>`;
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
      // Rebuild from full multiclass state so slots + combined lists stay correct
      const fakeCh = characterFromSpellForm();
      sec.innerHTML = `<label class="section-label">Spellcasting</label>${spellSlotsEditorHtml(fakeCh)}`;
      if (typeof wireSlotSteppers === 'function') wireSlotSteppers(sec);
      refreshSpellDc();
      wireSpellPicker();
        if (typeof wireFeatsEditor === 'function') wireFeatsEditor();
        
      // moon-path-subclass-sync: Path select <-> Subclass field
      function syncMoonPathFromSubclass() {
        const sc = ($('#m-subclass')?.value || '').trim();
        const pathSel = $('#m-moon-path');
        const pathWrap = $('#m-moon-path-wrap');
        const isMG = (typeof readMulticlassFromForm === 'function' ? readMulticlassFromForm() : [])
          .some(c => c.name === 'Moon Guardian') || $('#m-class')?.value === 'Moon Guardian';
        if (pathWrap) pathWrap.classList.toggle('hidden', !isMG);
        if (!pathSel) return;
        if (sc && [...pathSel.options].some(o => o.value === sc)) {
          pathSel.value = sc;
        }
      }
      function syncSubclassFromMoonPath() {
        const pathSel = $('#m-moon-path');
        const path = pathSel?.value || '';
        const sc = $('#m-subclass');
        if (path && sc) {
          if (![...sc.options].some(o => o.value === path)) {
            sc.insertAdjacentHTML('beforeend', `<option value="${escapeAttr(path)}">${escapeHtml(path)}</option>`);
          }
          sc.value = path;
          // Primary multiclass row + any Moon Guardian row
          document.querySelectorAll('.mc-row').forEach(row => {
            const cls = row.querySelector('.mc-class')?.value;
            if (cls && cls !== 'Moon Guardian') return;
            const mcSc = row.querySelector('.mc-subclass');
            if (!mcSc) return;
            if (![...mcSc.options].some(o => o.value === path)) {
              mcSc.insertAdjacentHTML('beforeend', `<option value="${escapeAttr(path)}">${escapeHtml(path)}</option>`);
            }
            mcSc.value = path;
          });
        }
        if (typeof applyMoonPathToFeatures === 'function') applyMoonPathToFeatures();
      }
      $('#m-moon-path')?.addEventListener('change', syncSubclassFromMoonPath);
      $('#m-subclass')?.addEventListener('change', () => {
        syncMoonPathFromSubclass();
        const sc = $('#m-subclass')?.value || '';
        if (/path of/i.test(sc) && typeof applyMoonPathToFeatures === 'function') applyMoonPathToFeatures();
      });
      document.getElementById('m-mc-rows')?.addEventListener('change', (e) => {
        if (e.target.classList.contains('mc-class') || e.target.classList.contains('mc-subclass')) {
          syncMoonPathFromSubclass();
        }
      });
      syncMoonPathFromSubclass();

        if (typeof wireSlotSteppers === 'function') wireSlotSteppers(document.getElementById('modal-body'));
        if (typeof refreshPreparedSpellCheckboxes === 'function') {
          setTimeout(refreshPreparedSpellCheckboxes, 50);
          document.getElementById('m-spell-prep-mode')?.addEventListener('change', refreshPreparedSpellCheckboxes);
        }
      // Extensions: combat status, attunement, rests
      const extraHost = document.getElementById('m-char-extras');
      if (extraHost && window.DSCExtensions) {
        /* already in body */
      } else if (window.DSCExtensions) {
        const sec = document.getElementById('m-spell-section');
        if (sec && !document.getElementById('m-char-extras')) {
          const wrap = document.createElement('div');
          wrap.id = 'm-char-extras';
          wrap.innerHTML = window.DSCExtensions.characterExtrasHtml(typeof ch !== 'undefined' ? ch : {});
          sec.parentNode.insertBefore(wrap, sec.nextSibling);
          window.DSCExtensions.wireCharacterExtras((patch) => {
            const host = document.getElementById('m-char-extras');
            if (host && patch?.rest) host.dataset.rest = patch.rest;
            if (patch?.rest === 'long' && window.DSCExtensions) {
              const fake = window.DSCExtensions.applyLongRest({
                hpMax: parseInt(document.getElementById('m-hpmax')?.value, 10) || 1,
                hp: parseInt(document.getElementById('m-hp')?.value, 10) || 1,
                spellSlotsUsed: {}
              });
              const hp = document.getElementById('m-hp');
              if (hp) hp.value = fake.hpMax || hp.value;
            }
          });
        }
      }
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
        const mc = (typeof readMulticlassFromForm === 'function') ? readMulticlassFromForm() : [];
        let html = mc.length > 1
          ? multiclassProgressionHtml({ classes: mc, class: cname })
          : progressionTableHtml(cname);
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
      const lvl = clamp(parseInt(levelInp?.value, 10) || 1, 1, 40);
      if (profInp) {
        profInp.value = profBonusForTotalLevel(lvl);
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
        <div class="form-row triple hidden" id="m-class-legacy-row" style="display:none!important" hidden>
          <div class="field"><label>Class</label>
            <select id="m-class">${classOptionsHtml(primaryClassName(ch))}</select>
          </div>
          <div class="field"><label>Subclass</label><select id="m-subclass">${subclassOptionsHtml((normalizeClassLevels(ch)[0]||{}).name || ch.class, (normalizeClassLevels(ch)[0]||{}).subclass || ch.subclass || '')}</select></div>
          <div class="field"><label>Level</label><input type="number" id="m-level" min="1" max="40" value="${totalCharacterLevel(ch)}" /></div>
        </div>
        <div class="sheet-section">
          <label class="section-label">Classes &amp; Multiclass</label>
          ${multiclassEditorHtml(ch, { allowEpic: true })}
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
          <div class="field"><label>Background</label>
            <select id="m-background">
              <option value="">—</option>
              ${getBackgroundList().map(b => `<option value="${escapeAttr(b.name)}" ${ch.background === b.name ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('')}
              ${ch.background && !getBackgroundList().some(b => b.name === ch.background) ? `<option value="${escapeAttr(ch.background)}" selected>${escapeHtml(ch.background)}</option>` : ''}
            </select>
          </div>
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
        <div id="m-class-prog">${multiclassProgressionHtml(ch)}</div>
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
          <div class="field"><label>Proficiency Bonus</label><input type="number" id="m-prof" min="2" max="10" value="${ch.profBonus}" /></div>
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
        ${featsEditorHtml(ch)}
        ${resourcesEditorHtml(ch)}
        <div class="field full-width">
          <label>Inventory &amp; Equipment</label>
          <div id="m-inventory-panel" class="inventory-panel">
            <div id="m-inv-display">${inventoryListHtml(ch.inventory || [])}</div>
            <div class="equip-browser">
              <div class="form-row">
                <div class="field"><label>Quick Search</label>
                  <input type="search" id="m-equip-search" placeholder="Search armor, weapons, +1 sword, magic…" autocomplete="off" />
                </div>
                <div class="field"><label>Category</label>
                  <select id="m-equip-cat">
                    <option value="all">All</option>
                    <option value="armor">Armor</option>
                    <option value="shield">Shields</option>
                    <option value="weapon">Weapons</option>
                    <option value="gear">Adventuring Gear</option>
                    <option value="tool">Tools</option>
                    <option value="magic">Magic Items (incl. +1 weapons)</option>
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
        const name = $('#m-name')?.value?.trim();
        if (!name) { toast('Name required'); return false; }
        const mcList = (typeof readMulticlassFromForm === 'function') ? readMulticlassFromForm() : [];
        const level = clamp(
          mcList.length
            ? mcList.reduce((s, c) => s + (Number(c.level) || 0), 0)
            : (parseInt($('#m-level')?.value, 10) || 1),
          1, 40
        ) || 1;
        const playerVal = ($('#m-player')?.value || '').trim();
        const checked = [...document.querySelectorAll('.m-skill-cb:checked, .skill-check:checked')].map(cb => cb.value);
        let skillsText = ($('#m-skills')?.value || '').trim();
        if (checked.length) {
          skillsText = checked.join(', ');
        }
        const primary = mcList[0] || {};
        const data = {
          name,
          player: playerVal,
          avatar: ($('#m-avatar-data')?.value || window.__draftAvatar || ''),
          type: existing?.type || (playerVal === 'NPC' ? 'ally' : 'pc'),
          classes: mcList.length ? mcList : [{ name: ($('#m-class')?.value || '').trim() || 'Adventurer', level, subclass: ($('#m-subclass')?.value || '').trim() }],
          class: primary.name || ($('#m-class')?.value || '').trim() || '',
          subclass: primary.subclass || ($('#m-subclass')?.value || '').trim() || '',
          level,
          race: ($('#m-race')?.value || '').trim(),
          background: ($('#m-background')?.value || '').trim(),
          alignment: ($('#m-alignment')?.value || '').trim(),
          world: ($('#m-world')?.value || ''),
          corruption: clamp(parseInt($('#m-corruption')?.value, 10) || 0, 0, 6),
          isUmbrarian: !!$('#m-umbrarian')?.checked,
          umbrarianStage: $('#m-umb-stage')?.value || '',
          shard: $('#m-umb-shard')?.value || '',
          shardAbility: ($('#m-umb-ability')?.value) || bestShardAbility({
            int: parseInt($('#m-total-int')?.textContent, 10) || 10,
            wis: parseInt($('#m-total-wis')?.textContent, 10) || 10,
            cha: parseInt($('#m-total-cha')?.textContent, 10) || 10
          }),
          str: parseInt($('#m-total-str')?.textContent, 10) || parseInt($('#m-str')?.value, 10) || 10,
          dex: parseInt($('#m-total-dex')?.textContent, 10) || parseInt($('#m-dex')?.value, 10) || 10,
          con: parseInt($('#m-total-con')?.textContent, 10) || parseInt($('#m-con')?.value, 10) || 10,
          int: parseInt($('#m-total-int')?.textContent, 10) || parseInt($('#m-int')?.value, 10) || 10,
          wis: parseInt($('#m-total-wis')?.textContent, 10) || parseInt($('#m-wis')?.value, 10) || 10,
          cha: parseInt($('#m-total-cha')?.textContent, 10) || parseInt($('#m-cha')?.value, 10) || 10,
          hp: parseInt($('#m-hp')?.value, 10) || 0,
          hpMax: parseInt($('#m-hpmax')?.value, 10) || 0,
          ac: parseInt($('#m-ac')?.value, 10) || 10,
          speed: ($('#m-speed')?.value || '').trim() || '30 ft.',
          profBonus: parseInt($('#m-prof')?.value, 10) || profBonusForLevel(level),
          saves: ($('#m-saves')?.value || '').trim(),
          skills: skillsText,
          attacks: ($('#m-attacks')?.value || '').trim(),
          features: ($('#m-features')?.value || '').trim(),
          spellcastingAbility: $('#m-spell-ab')?.value || '',
          cantrips: ($('#m-cantrips')?.value || '').trim() || '',
          spells: ($('#m-spells')?.value || '').trim() || '',
          spellSlotsUsed: collectSpellSlotsUsed(),
          equipment: ($('#m-equipment')?.value || '').trim() || (window.__draftInventory || []).map(i => i.name + (i.qty > 1 ? ' ×' + i.qty : '') + (i.equipped ? ' (equipped)' : '')).join(', '),
          inventory: (window.__draftInventory || []).map(normalizeInventoryItem),
          notes: ($('#m-notes')?.value || '').trim(),
          spellIds: ($('#m-spell-ids')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
        };
        try {
          if (typeof mergeCharacterFormExtras === 'function') data = mergeCharacterFormExtras(data);
          else if (window.DSCExtensions?.collectCharacterExtras) {
            Object.assign(data, window.DSCExtensions.collectCharacterExtras());
          }
        } catch (e) { console.warn('extras', e); }
        if (document.getElementById('m-spell-prep-mode')) {
          data.spellPrepMode = document.getElementById('m-spell-prep-mode').value || 'known';
        }
        if (document.getElementById('m-prepared-spells')) {
          data.preparedSpells = document.getElementById('m-prepared-spells').value || '';
        }
        if (document.getElementById('m-inspiration')) {
          data.inspiration = !!document.getElementById('m-inspiration').checked;
        }
        if (document.getElementById('m-ds-ok')) {
          data.deathSaves = {
            successes: parseInt(document.getElementById('m-ds-ok').value, 10) || 0,
            failures: parseInt(document.getElementById('m-ds-fail')?.value, 10) || 0
          };
        }
        if (document.querySelector('.m-cond')) {
          data.conditions = [...document.querySelectorAll('.m-cond:checked')].map(c => c.value);
        }
        const attVals = [document.getElementById('m-attune-1')?.value, document.getElementById('m-attune-2')?.value, document.getElementById('m-attune-3')?.value]
          .map(s => (s || '').trim()).filter(Boolean).slice(0, 3);
        if (document.getElementById('m-attune-1')) data.attunement = attVals;
        if (typeof collectFeatsFromForm === 'function') data.feats = collectFeatsFromForm();
        if (typeof collectResourcesFromForm === 'function') data.resourceUsed = collectResourcesFromForm();
        // Rest application
        const restKind = document.getElementById('m-char-extras')?.dataset?.rest;
        if (restKind === 'short' && window.DSCExtensions?.applyShortRest) data = window.DSCExtensions.applyShortRest(data);
        if (restKind === 'long' && window.DSCExtensions?.applyLongRest) data = window.DSCExtensions.applyLongRest(data);
        if (existing) Object.assign(existing, data);
        else c.party.push({ id: uid(), ...data });
        c.updatedAt = new Date().toISOString();
        try { save(); } catch (err) {
          console.error(err);
          toast('Storage save failed: ' + (err.message || err));
          return false;
        }
        toast('Character saved');
        return true;
      },
      afterOpen: () => {
        window.__draftInventory = (ch.inventory || []).map(normalizeInventoryItem);
        window.__draftAvatar = ch.avatar || '';
        const avData = $('#m-avatar-data');
        if (avData) avData.value = window.__draftAvatar;
        wireCharacterFormHelpers();
        wireMulticlassEditor(existing);
        const legacyRow = document.getElementById('m-class-legacy-row');
        if (legacyRow) { legacyRow.hidden = true; legacyRow.style.display = 'none'; }
        wireInventoryUI();
        wireAvatarPicker();
        wireSpellPicker();
        if (typeof wireFeatsEditor === 'function') wireFeatsEditor();
        
      // moon-path-subclass-sync: Path select <-> Subclass field
      function syncMoonPathFromSubclass() {
        const sc = ($('#m-subclass')?.value || '').trim();
        const pathSel = $('#m-moon-path');
        const pathWrap = $('#m-moon-path-wrap');
        const isMG = (typeof readMulticlassFromForm === 'function' ? readMulticlassFromForm() : [])
          .some(c => c.name === 'Moon Guardian') || $('#m-class')?.value === 'Moon Guardian';
        if (pathWrap) pathWrap.classList.toggle('hidden', !isMG);
        if (!pathSel) return;
        if (sc && [...pathSel.options].some(o => o.value === sc)) {
          pathSel.value = sc;
        }
      }
      function syncSubclassFromMoonPath() {
        const pathSel = $('#m-moon-path');
        const path = pathSel?.value || '';
        const sc = $('#m-subclass');
        if (path && sc) {
          sc.value = path;
          // also multiclass primary row
          const row = document.querySelector('.mc-row');
          const mcSc = row?.querySelector('.mc-subclass');
          if (mcSc) {
            if (![...mcSc.options].some(o => o.value === path)) {
              mcSc.insertAdjacentHTML('beforeend', `<option value="${escapeAttr(path)}">${escapeHtml(path)}</option>`);
            }
            mcSc.value = path;
          }
        }
        if (typeof applyMoonPathToFeatures === 'function') applyMoonPathToFeatures();
      }
      $('#m-moon-path')?.addEventListener('change', syncSubclassFromMoonPath);
      $('#m-subclass')?.addEventListener('change', () => {
        syncMoonPathFromSubclass();
        const sc = $('#m-subclass')?.value || '';
        if (/path of/i.test(sc) && typeof applyMoonPathToFeatures === 'function') applyMoonPathToFeatures();
      });
      document.getElementById('m-mc-rows')?.addEventListener('change', (e) => {
        if (e.target.classList.contains('mc-class') || e.target.classList.contains('mc-subclass')) {
          syncMoonPathFromSubclass();
        }
      });
      syncMoonPathFromSubclass();

        if (typeof wireSlotSteppers === 'function') wireSlotSteppers(document.getElementById('modal-body'));
        if (typeof refreshPreparedSpellCheckboxes === 'function') {
          setTimeout(refreshPreparedSpellCheckboxes, 50);
          document.getElementById('m-spell-prep-mode')?.addEventListener('change', refreshPreparedSpellCheckboxes);
        }
        // Background auto-fill from main select
        (function wireMainBackgroundSelect() {
          const sel = document.querySelector('#modal-body select#m-background');
          if (!sel || sel.dataset.bgWired) return;
          sel.dataset.bgWired = '1';
          sel.addEventListener('change', () => {
            const name = sel.value;
            const list = (window.DSCExtensions && window.DSCExtensions.BACKGROUNDS) || [];
            const bg = list.find(b => b.name === name);
            if (!bg) return;
            const skillList = Array.isArray(bg.skills) ? bg.skills : String(bg.skills || '').split(/,\s*/);
            skillList.forEach(sk => {
              document.querySelectorAll('.m-skill-cb, .skill-check').forEach(cb => {
                if (cb.value && cb.value.toLowerCase() === sk.toLowerCase()) cb.checked = true;
              });
            });
            const skillsTa = document.getElementById('m-skills');
            if (skillsTa) {
              const existing = (skillsTa.value || '').split(/,\s*/).map(s => s.trim()).filter(Boolean);
              skillList.forEach(sk => { if (!existing.some(e => e.toLowerCase() === sk.toLowerCase())) existing.push(sk); });
              skillsTa.value = existing.join(', ');
            }
            const feat = document.getElementById('m-features');
            if (feat && bg.feature && !feat.value.includes(bg.feature)) {
              const line = 'Background — ' + bg.feature + '. ' + (bg.featureText || '');
              feat.value = (feat.value ? feat.value.trim() + '\n\n' : '') + line.trim();
            }
          });
        })();

      // Ensure spell preparation controls exist
      if (!document.getElementById('m-spell-prep-mode')) {
        const sec = document.getElementById('m-spell-section');
        if (sec) {
          const wrap = document.createElement('div');
          wrap.id = 'm-char-extras';
          const prepMode = (typeof ch !== 'undefined' && ch.spellPrepMode) ? ch.spellPrepMode : 'known';
          const prepList = (typeof ch !== 'undefined' && ch.preparedSpells) ? ch.preparedSpells : '';
          wrap.innerHTML = (window.DSCExtensions && window.DSCExtensions.characterExtrasHtml)
            ? window.DSCExtensions.characterExtrasHtml(typeof ch !== 'undefined' ? ch : {})
            : `<div class="sheet-section"><label class="section-label">Spell preparation</label>
                <select id="m-spell-prep-mode"><option value="known" ${prepMode==='known'?'selected':''}>Known</option>
                <option value="prepared" ${prepMode==='prepared'?'selected':''}>Prepared</option></select>
                <textarea id="m-prepared-spells" rows="2" placeholder="Prepared spells…">${prepList.replace(/</g,'&lt;')}</textarea></div>`;
          sec.parentNode.insertBefore(wrap, sec.nextSibling);
          if (window.DSCExtensions?.wireCharacterExtras) {
            window.DSCExtensions.wireCharacterExtras((patch) => {
              const host = document.getElementById('m-char-extras');
              if (host && patch?.rest) host.dataset.rest = patch.rest;
            });
          }
        }
      }

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
          <p class="muted small">${escapeHtml(roleLabel)} · ${escapeHtml(ch.race || '—')} · ${escapeHtml(classLevelsSummary(ch))} · L${totalCharacterLevel(ch)}</p>
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
    const stageId = (ch.umbrarianStage || 'dormant').toLowerCase();
    const stageInfo = (u.stages || []).find(s => s.id === stageId || (s.name || '').toLowerCase() === stageId);
    const stageLabel = stageInfo?.name || stageId;
    const corr = clamp(Number(ch.corruption) || 0, 0, 6);
    const corrInfo = (u.corruptionTrack || []).find(r => Number(r.score) === corr)
      || (u.corruptionTrack || [])[corr]
      || null;
    const gifts = [];
    if (stageId === 'awakened' || stageId === 'ascendant') {
      (u.awakenedGiftsGeneric || []).forEach(g => gifts.push(g));
    }
    if (stageId === 'ascendant') {
      (u.ascendantGiftsGeneric || []).forEach(g => gifts.push(g));
    }
    const traits = (u.commonTraits || []).map(tr =>
      `<li><strong>${escapeHtml(tr.name)}.</strong> ${escapeHtml(tr.text)}</li>`
    ).join('');
    const giftHtml = gifts.length
      ? `<ul class="trait-list compact">${gifts.map(g => `<li><strong>${escapeHtml(g.name)}.</strong> ${escapeHtml(g.text)}</li>`).join('')}</ul>`
      : '<p class="muted small">Dormant — the Shard observes; no combat gifts required.</p>';
    return `
      <div class="cs-panel cs-umb">
        <div class="cs-panel-title">Umbrarian · ${escapeHtml(stageLabel)} · ${escapeHtml(ch.shard || 'Shard')}</div>
        <div class="cs-umb-stats">
          <div class="cs-stat-box"><div class="cs-stat-val">${dc.dc}</div><div class="cs-stat-label">Shard DC</div><div class="cs-stat-sub muted small">${dc.ability} (${dc.mod >= 0 ? '+' : ''}${dc.mod}) · PB +${dc.pb}</div></div>
          <div class="cs-stat-box"><div class="cs-stat-val">${dc.attack >= 0 ? '+' + dc.attack : dc.attack}</div><div class="cs-stat-label">Shard Attack</div></div>
          <div class="cs-stat-box"><div class="cs-stat-val">${corr}/6</div><div class="cs-stat-label">Corruption</div>
            <div class="cs-stat-sub muted small">${corrInfo ? escapeHtml(corrInfo.state) : ''}</div></div>
        </div>
        ${corrInfo ? `<p class="cs-body muted small"><strong>${escapeHtml(corrInfo.state)}.</strong> ${escapeHtml(corrInfo.effect)}</p>` : ''}
        ${stageInfo ? `<p class="cs-body"><strong>Stage — ${escapeHtml(stageInfo.name)}.</strong> ${escapeHtml(stageInfo.text)}</p>` : ''}
        ${shardInfo ? `<p class="cs-body"><strong>${escapeHtml(shardInfo.name)}</strong> (${escapeHtml(shardInfo.world)}) — ${escapeHtml(shardInfo.theme)}. <em>Awakens:</em> ${escapeHtml(shardInfo.awakens)}</p>` : ''}
        <div class="cs-panel-title" style="margin-top:0.5rem">Common Traits</div>
        <ul class="trait-list compact">${traits}</ul>
        <div class="cs-panel-title" style="margin-top:0.5rem">Gifts (${escapeHtml(stageLabel)})</div>
        ${giftHtml}
        ${u.gainingGifts ? `<p class="muted small" style="margin-top:0.35rem">${escapeHtml(u.gainingGifts)}</p>` : ''}
        ${u.darkBargains ? `<p class="muted small" style="margin-top:0.35rem"><strong>Dark Bargains.</strong> ${escapeHtml(u.darkBargains)}</p>` : ''}
        ${corr >= 4 && u.shardDemands ? `<p class="muted small" style="margin-top:0.35rem"><strong>Shard Demands.</strong> ${escapeHtml(u.shardDemands)}</p>` : ''}
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


  /** Structured Features & Traits HTML for View / Print */
  function featuresStructuredHtml(ch) {
    const raw = String(ch.features || '').trim();
    const sections = [];
    // Split on known markers or blank-line blocks starting with "— "
    const markerRe = /(?:^|\n)(—\s*[^\n]+—)\s*\n/g;
    const parts = [];
    let last = 0;
    let m;
    const text = raw;
    const markers = [];
    while ((m = markerRe.exec(text)) !== null) {
      markers.push({ title: m[1].trim(), index: m.index + (m[0].startsWith('\n') ? 1 : 0), end: m.index + m[0].length });
    }
    if (markers.length) {
      for (let i = 0; i < markers.length; i++) {
        const start = markers[i].end;
        const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
        sections.push({ title: markers[i].title.replace(/^—\s*|\s*—$/g, '').trim(), body: (typeof resolveFeaturePlaceholders === "function" ? resolveFeaturePlaceholders(text.slice(start, end).trim(), ch) : text.slice(start, end).trim()) });
      }
      // preamble before first marker
      const pre = text.slice(0, markers[0].index).trim();
      if (pre) sections.unshift({ title: 'Notes', body: pre });
    } else if (raw) {
      sections.push({ title: 'Features & Traits', body: raw });
    }

    // Append class features for EVERY multiclass entry (data-driven, not only free text)
    const classBlocks = multiclassClassFeaturesHtml(ch);
    const featsBlock = Array.isArray(ch.feats) && ch.feats.length
      ? `<div class="cs-feat-block"><div class="cs-panel-subtitle">Feats</div><ul class="trait-list compact">${ch.feats.map(f => {
          const full = (typeof findFeat === 'function' ? findFeat(f.id) : null) || f;
          return `<li><strong>${escapeHtml(full.name || f.name)}</strong>. ${escapeHtml(full.text || f.text || '')}</li>`;
        }).join('')}</ul></div>`
      : '';

    const bodyHtml = sections.length
      ? sections.map(s => `
          <div class="cs-feat-block">
            <div class="cs-panel-subtitle">${escapeHtml(s.title)}</div>
            <div class="cs-feat-body">${formatFeatureBody(s.body, ch)}</div>
          </div>`).join('')
      : '<p class="muted small">No features recorded.</p>';

    return `<div class="cs-features-structured">${bodyHtml}${classBlocks}${featsBlock}</div>`;
  }

  function formatFeatureBody(body, ch) {
    if (!body) return '';
    body = expandTemplatePlaceholders(body, ch);
    // Bullet-like lines
    const lines = String(body).split(/\n+/).map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1) return `<p class="cs-body">${escapeHtml(body)}</p>`;
    return `<ul class="trait-list compact">${lines.map(l => {
      const bold = l.match(/^([^.:—-]{2,40})[.:—-]\s*(.*)$/);
      if (bold && bold[2]) return `<li><strong>${escapeHtml(bold[1])}.</strong> ${escapeHtml(bold[2])}</li>`;
      return `<li>${escapeHtml(l)}</li>`;
    }).join('')}</ul>`;
  }

  function multiclassClassFeaturesHtml(ch) {
    const list = normalizeClassLevels(ch);
    if (!list.length) return '';
    const abilities = (typeof window !== 'undefined' && window.CLASS_ABILITIES) ? window.CLASS_ABILITIES : {};
    return list.map(c => {
      const feats = (abilities[c.name] || []).filter(a => (a.lvl || 0) <= (c.level || 1));
      const cls = findPhbClass(c.name);
      const prog = (cls && cls.progression) ? cls.progression.filter(([lvl]) => lvl <= c.level) : [];
      const sub = c.subclass ? ` · ${escapeHtml(c.subclass)}` : '';
      let inner = '';
      if (prog.length) {
        inner += `<p class="muted small"><strong>Progression:</strong> ${prog.map(([lvl, f]) => `L${lvl} ${escapeHtml(f)}`).join(' · ')}</p>`;
      }
      if (feats.length) {
        inner += `<ul class="trait-list compact">${feats.map(a =>
          `<li><strong>L${a.lvl} — ${escapeHtml(a.name)}.</strong> ${escapeHtml(expandTemplatePlaceholders(a.text || '', ch))}</li>`
        ).join('')}</ul>`;
      }
      // Subclass features (custom AGP pack + official stubs + Moon Paths)
      const subData = findSubclass(c.name, c.subclass);
      if (subData && Array.isArray(subData.features) && subData.features.length) {
        const pf = subData.features.filter(f => (f.lvl || 0) <= (c.level || 1));
        if (pf.length) {
          inner += `<p class="muted small"><strong>${escapeHtml(subData.name)}</strong>${subData.source ? ' · ' + escapeHtml(subData.source) : ''}</p>`;
          inner += `<ul class="trait-list compact">${pf.map(f =>
            `<li><strong>L${f.lvl || '—'} ${escapeHtml(f.name)}.</strong> ${escapeHtml(expandTemplatePlaceholders(f.text || '', ch))}</li>`
          ).join('')}</ul>`;
        }
      } else if (c.name === 'Moon Guardian') {
        const path = findMoonPath(c.subclass || ch.subclass);
        if (path) {
          const pf = (path.features || []).filter(f => f.lvl <= c.level);
          if (pf.length) {
            inner += `<p class="muted small"><strong>${escapeHtml(path.name)}</strong></p>`;
            inner += `<ul class="trait-list compact">${pf.map(f =>
              `<li><strong>L${f.lvl} ${escapeHtml(f.name)}.</strong> ${escapeHtml(f.text || '')}</li>`
            ).join('')}</ul>`;
          }
        }
      }
      if (!inner) inner = '<p class="muted small">No detailed features in data for this class level.</p>';
      return `<div class="cs-feat-block">
        <div class="cs-panel-subtitle">${escapeHtml(c.name)} ${c.level}${sub}</div>
        ${inner}
      </div>`;
    }).join('');
  }

  function multiclassSavesHtml(ch) {
    const list = normalizeClassLevels(ch);
    const saves = new Set();
    list.forEach(c => {
      const cls = findPhbClass(c.name);
      if (cls && cls.saves) {
        String(cls.saves).split(/[,&]/).map(s => s.trim()).filter(Boolean).forEach(s => saves.add(s.toUpperCase().slice(0, 3)));
      }
    });
    // Map INT -> Intelligence style for display
    const map = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };
    if (saves.size) {
      return [...saves].map(s => map[s] || s).join(', ');
    }
    return ch.saves || '—';
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
          <button type="button" class="cs-tab" data-cs-page="2">Page 2 · Attacks &amp; Spells</button>
          <button type="button" class="cs-tab" data-cs-page="3">Page 3 · Story</button>
          <button type="button" class="cs-tab" data-cs-page="4">Page 4 · Class Progression</button>
        </div>

        <!-- PAGE 1 -->
        <div class="cs-page active" data-cs-page="1">
          <div class="cs-top">
            <div class="cs-portrait-block">
              ${portraitHtml(ch)}
              <div class="cs-name-block">
                <div class="cs-char-name">${escapeHtml(ch.name || 'Unnamed')}</div>
                <div class="cs-char-meta">${escapeHtml(classLevelsSummary(ch))} · Level ${totalCharacterLevel(ch)}</div>
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
            ${resourcesSheetHtml(ch)}
          </div>
          <div class="cs-main cs-main-classic">
            <div class="cs-col-left">
              <div class="cs-panel"><div class="cs-panel-title">Ability Scores</div><div class="cs-abilities">${abBlock}</div></div>
              <div class="cs-panel"><div class="cs-panel-title">Saving Throws</div><div class="cs-body">${escapeHtml(multiclassSavesHtml(ch))}${normalizeClassLevels(ch).length > 1 ? ' <span class="muted small">(all classes)</span>' : ''}</div></div>
              <div class="cs-panel cs-skills-panel"><div class="cs-panel-title">Skills</div><div class="cs-skills">${skillRows}</div></div>
            </div>
            <div class="cs-col-right">
              <div class="cs-panel">
                <div class="cs-panel-title">Attacks (summary)</div>
                <div class="cs-atk-mini">${attacks.slice(0,4).map(a => `<div class="cs-atk-mini-row"><strong>${escapeHtml(a.name)}</strong> ${escapeHtml(a.bonus)} · ${escapeHtml(a.damage)}</div>`).join('') || '<span class="muted">See Page 2</span>'}</div>
                <p class="muted small">Full attack cards on Page 2</p>
              </div>
              <div class="cs-panel">
                <div class="cs-panel-title">Features &amp; Traits</div>
                ${featuresStructuredHtml(ch)}
              </div>
              <div class="cs-panel">
                <div class="cs-panel-title">Equipment</div>
                <table class="cs-inv-table">
                  <thead><tr><th></th><th>Item</th><th>Type</th><th>Wt</th></tr></thead>
                  <tbody>${invRows}</tbody>
                </table>
                <div class="muted small">Weight ${inventoryWeight(inv).toFixed(1)} lb</div>
              </div>
              ${ch.isUmbrarian ? `<div class="cs-umb-inline">${umbrarianSheetBlock(ch)}</div>` : ''}
            </div>
          </div>
          ${ch.isUmbrarian ? '' : ''}
        </div>

        <!-- PAGE 2 ATTACKS / SPELLS / EQUIPMENT -->
        <div class="cs-page" data-cs-page="2">
          <div class="cs-page-title">Attacks</div>
          <div class="cs-atk-grid">${attackCards}</div>
          <div class="cs-panel" style="margin-top:0.75rem">
            <div class="cs-panel-title">Attack Notes</div>
            <pre class="cs-pre">${escapeHtml(ch.attacks || '—')}</pre>
          </div>

          <div class="cs-page-title" style="margin-top:1.1rem">Abilities</div>
          ${combatAbilityCardsHtml(ch) || '<p class="muted small">No class abilities loaded.</p>'}

          <div class="cs-page-title" style="margin-top:1.1rem">Spellcasting</div>
          ${spellSheetBlock(ch) || '<p class="muted small">No spellcasting on this character.</p>'}
          ${spellSheetCardsHtml(ch) || ''}

          <div class="cs-page-title" style="margin-top:1.1rem">Equipment</div>
          <div class="cs-panel">
            <table class="cs-inv-table">
              <thead><tr><th></th><th>Item</th><th>Type</th><th>Wt</th></tr></thead>
              <tbody>${invRows}</tbody>
            </table>
            <div class="muted small">Weight ${inventoryWeight(inv).toFixed(1)} lb · Equipped marked with ●</div>
          </div>
          <div class="cs-panel">
            <div class="cs-panel-title">Equipped Summary</div>
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
            ${normalizeClassLevels(ch).map(c => {
              const cl = findPhbClass(c.name);
              if (!cl) return `<div class="cs-panel"><div class="cs-panel-title">${escapeHtml(c.name)} ${c.level}</div><p class="muted small">No PHB entry.</p></div>`;
              return `<div class="cs-panel"><div class="cs-panel-title">${escapeHtml(cl.name)} ${c.level}${c.subclass ? ' · ' + escapeHtml(c.subclass) : ''}</div>
              <p class="muted small">Hit Die ${cl.hitDie} · Primary ${escapeHtml(cl.primary)} · Saves ${escapeHtml(cl.saves)}</p>
              <p>${escapeHtml(cl.summary || '')}</p>
            </div>`;
            }).join('') || (cls ? `<div class="cs-panel"><div class="cs-panel-title">Class — ${escapeHtml(cls.name)}</div>
              <p class="muted small">Hit Die ${cls.hitDie} · Primary ${escapeHtml(cls.primary)} · Saves ${escapeHtml(cls.saves)}</p>
              <p>${escapeHtml(cls.summary || '')}</p>
            </div>` : '')}
            ${(() => {
              const mg = normalizeClassLevels(ch).find(c => c.name === 'Moon Guardian');
              const p = mg ? findMoonPath(mg.subclass || ch.subclass) : null;
              if (!p) return '';
              const lvl = mg.level || 1;
              return `<div class="cs-panel"><div class="cs-panel-title">${escapeHtml(p.name)} (Moon Guardian ${lvl})</div>
              <p class="muted small">${escapeHtml(p.summary || '')}</p>
              <ul class="trait-list compact">${(p.features||[]).filter(f => f.lvl <= lvl).map(f => `<li><strong>L${f.lvl} ${escapeHtml(f.name)}.</strong> ${escapeHtml(f.text)}</li>`).join('')}</ul>
            </div>`;
            })()}
            ${ch.isUmbrarian ? umbrarianSheetBlock(ch) : ''}
            ${resourcesSheetHtml(ch)}
            ${featsSheetHtml(ch)}
            ${ch.inspiration || (ch.deathSaves && (ch.deathSaves.successes || ch.deathSaves.failures)) || (ch.conditions && ch.conditions.length) || (ch.attunement && ch.attunement.length) ? `<div class="cs-panel"><div class="cs-panel-title">Status</div>
              <div class="cs-body">
                ${ch.inspiration ? '<div><strong>Inspiration:</strong> Yes</div>' : ''}
                ${ch.deathSaves ? `<div><strong>Death saves:</strong> ${(ch.deathSaves.successes||0)} success / ${(ch.deathSaves.failures||0)} fail</div>` : ''}
                ${ch.conditions && ch.conditions.length ? `<div><strong>Conditions:</strong> ${ch.conditions.map(c => escapeHtml(c)).join(', ')}</div>` : ''}
                ${ch.attunement && ch.attunement.length ? `<div><strong>Attunement:</strong> ${ch.attunement.map(a => escapeHtml(a)).join(', ')}</div>` : ''}
              </div></div>` : ''}
            ${ch.notes ? `<div class="cs-panel"><div class="cs-panel-title">Notes &amp; Backstory</div><pre class="cs-pre">${escapeHtml(ch.notes)}</pre></div>` : ''}
          </div>
        </div>


        <!-- PAGE 4 · Class Progression -->
        <div class="cs-page" data-cs-page="4">
          <div class="cs-page-title">Class Progression</div>
          <p class="muted small">Features and progression for each of your classes (multiclass lists every class).</p>
          <div class="cs-panel">${multiclassProgressionHtml(ch)}</div>
          <div class="cs-panel" style="margin-top:0.75rem"><div class="cs-panel-title">Class Features (all levels)</div>${multiclassClassFeaturesHtml(ch)}</div>
          ${featsSheetHtml(ch)}
          ${ch.spellPrepMode === 'prepared' && ch.preparedSpells ? `<div class="cs-panel" style="margin-top:1rem"><div class="cs-panel-title">Prepared Spells</div><div class="cs-body">${escapeHtml(ch.preparedSpells)}</div></div>` : ''}
          ${Array.isArray(ch.attunement) && ch.attunement.length ? `<div class="cs-panel" style="margin-top:1rem"><div class="cs-panel-title">Attunement</div><div class="cs-body">${ch.attunement.map(a => escapeHtml(a)).join(', ')}</div></div>` : ''}
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
    try {
      const bodyHtml = characterSheetViewHtml(ch);
      const title = String(ch.name || 'Character').replace(/[<>&"]/g, '');
      // Print-light CSS: same gold/parchment language as the app, minimal assets
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
@page{size:A4;margin:9mm}
*{box-sizing:border-box}
body{margin:0;padding:6px 8px;font:11pt/1.35 Georgia,"Times New Roman",serif;background:#1c1510;color:#f0ebe3}
.cs-tabs,.cs-toolbar,.btn{display:none!important}
.cs-page{display:block!important;margin:0 0 10px;page-break-inside:avoid}
.cs-char-name{font:700 1.35rem Georgia,serif;color:#d4af37;margin:0}
.cs-char-meta{color:#c9b89a;font-size:.85rem;margin:1px 0}
.cs-portrait-block{display:flex;gap:10px;align-items:flex-start;margin-bottom:6px;flex-wrap:wrap}
.cs-portrait-ring{width:52px;height:52px;border-radius:50%;border:2px solid #c4a35a;display:flex;align-items:center;justify-content:center;font-weight:700;color:#c4a35a;flex-shrink:0;overflow:hidden}
.cs-portrait-ring img,.cs-avatar-img{width:100%;height:100%;object-fit:cover}
.cs-header-right{display:flex;gap:6px;margin-left:auto}
.cs-mini-stat{border:1px solid rgba(196,163,90,.4);border-radius:6px;padding:3px 7px;text-align:center}
.cs-mini-lbl{display:block;font-size:.6rem;text-transform:uppercase;color:#a89880}
.cs-mini-val{color:#d4af37;font-weight:700}
.cs-combat-row,.cs-resource-bar{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0}
.cs-stat-box,.cs-resource-pill{min-width:4.5rem;flex:1;text-align:center;padding:5px 4px;border-radius:7px;border:1px solid rgba(196,163,90,.4);background:#2a2118}
.cs-stat-val,.cs-res-val{font-size:1.2rem;font-weight:800;color:#f5efd8;line-height:1.1}
.cs-stat-label,.cs-res-name{font-size:.62rem;text-transform:uppercase;letter-spacing:.04em;color:#d4af37;margin-top:2px}
.cs-stat-sub,.cs-res-sub,.muted{color:#a89880;font-size:.7rem}
.cs-main{display:grid;grid-template-columns:32% 1fr;gap:8px}
.cs-panel{border:1px solid rgba(196,163,90,.28);border-radius:8px;padding:6px 8px;margin-bottom:6px;background:#241c14}
.cs-panel-title,.cs-page-title{font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:#d4af37;font-weight:700;margin:0 0 4px;border-bottom:1px solid rgba(196,163,90,.2);padding-bottom:2px}
.cs-abilities{display:flex;flex-wrap:wrap;gap:4px}
.cs-ability{min-width:2.8rem;text-align:center;border:1px solid rgba(196,163,90,.25);border-radius:5px;padding:3px}
.cs-ab-label{font-size:.55rem;color:#a89880}
.cs-ab-mod{font-weight:700;color:#f0e6d0}
.cs-ab-score{font-size:.75rem;color:#c9b89a}
.cs-skills{display:grid;grid-template-columns:1fr 1fr;gap:1px 6px;font-size:.72rem}
.cs-skill{display:flex;gap:3px;align-items:center}
.cs-skill.prof .cs-skill-name{color:#e8c56a}
.cs-atk-grid,.spell-card-grid,.ability-card-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.cs-atk-card,.spell-card,.ability-card{border:1px solid rgba(196,163,90,.35);border-radius:7px;padding:5px 7px;background:#2a2118;page-break-inside:avoid}
.cs-atk-name,.spell-card-name{font-weight:700;color:#f0e6d0;font-size:.9rem}
.spell-card-level{font-size:.7rem;color:#a89880}
.spell-card-stats{display:grid;grid-template-columns:1fr 1fr;gap:2px 6px;font-size:.72rem;margin:3px 0;border-top:1px solid rgba(196,163,90,.15);border-bottom:1px solid rgba(196,163,90,.15);padding:3px 0}
.spell-stat-label{font-size:.58rem;text-transform:uppercase;color:#a89880}
.spell-card-desc,.cs-body,.cs-pre,.cs-feat-body{font-size:.78rem;line-height:1.32;white-space:pre-wrap;margin:0}
.cs-features-structured{display:flex;flex-direction:column;gap:5px}
.cs-feat-block{border:1px solid rgba(196,163,90,.2);border-radius:6px;padding:4px 6px;background:#1f1812}
.cs-panel-subtitle{font-size:.7rem;text-transform:uppercase;color:#e8c56a;font-weight:600;margin-bottom:2px}
.trait-list{margin:2px 0 0;padding-left:1.1rem;font-size:.78rem}
table{width:100%;border-collapse:collapse;font-size:.78rem}
th,td{border-bottom:1px solid rgba(255,255,255,.06);padding:2px 4px;text-align:left}
th{color:#d4af37;font-size:.65rem;text-transform:uppercase}
@media print{
  body{background:#fff;color:#222}
  .cs-panel,.cs-stat-box,.cs-resource-pill,.cs-atk-card,.spell-card,.ability-card,.cs-feat-block,.cs-ability{
    background:#faf7f0!important;border-color:#ccc!important;color:#222!important
  }
  .cs-char-name,.cs-panel-title,.cs-page-title,.cs-stat-label,.cs-res-name,.cs-panel-subtitle,.spell-card-name{color:#6a5420!important}
  .cs-stat-val,.cs-res-val,.cs-ab-mod{color:#111!important}
  .cs-char-meta,.muted,.cs-stat-sub,.spell-card-level,.spell-stat-label{color:#555!important}
  a{color:inherit}
}
</style></head><body>
<div class="cs-print-root">${bodyHtml}</div>
<script>
document.querySelectorAll('.cs-page').forEach(function(p){p.classList.add('active');p.style.display='block';});
document.querySelectorAll('.cs-tabs,.cs-toolbar').forEach(function(t){t.style.display='none';});
setTimeout(function(){window.focus();window.print();},280);
<\/script>
</body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, '_blank');
      if (!w) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'position:fixed;right:0;bottom:0;width:0;height:0;border:0');
        document.body.appendChild(iframe);
        iframe.onload = function() {
          try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch (e) {}
          setTimeout(function() { URL.revokeObjectURL(url); iframe.remove(); }, 60000);
        };
        iframe.src = url;
        if (typeof toast === 'function') toast('Print opened in background frame');
      } else {
        setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
      }
    } catch (err) {
      console.error(err);
      if (typeof toast === 'function') toast('Print failed: ' + (err && err.message ? err.message : err));
    }
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
        const name = $('#m-name')?.value?.trim();
        if (!name) { toast('Name required'); return false; }
        const level = clamp(parseInt($('#m-level')?.value, 10) || 1, 1, 40);
        const data = {
          name,
          player: 'NPC',
          type: 'villain',
          class: $('#m-class')?.value?.trim() || '',
          level,
          world: $('#m-world').value,
          corruption: clamp(parseInt($('#m-corruption').value, 10) || 0, 0, 10),
          str: parseInt($('#m-total-str')?.textContent, 10) || parseInt($('#m-str')?.value, 10) || 10,
          dex: parseInt($('#m-total-dex')?.textContent, 10) || parseInt($('#m-dex')?.value, 10) || 10,
          con: parseInt($('#m-total-con')?.textContent, 10) || parseInt($('#m-con')?.value, 10) || 10,
          int: parseInt($('#m-total-int')?.textContent, 10) || parseInt($('#m-int')?.value, 10) || 10,
          wis: parseInt($('#m-total-wis')?.textContent, 10) || parseInt($('#m-wis')?.value, 10) || 10,
          cha: parseInt($('#m-total-cha')?.textContent, 10) || parseInt($('#m-cha')?.value, 10) || 10,
          hp: parseInt($('#m-hp')?.value, 10) || 0,
          hpMax: parseInt($('#m-hpmax')?.value, 10) || 0,
          ac: parseInt($('#m-ac')?.value, 10) || 10,
          speed: ($('#m-speed')?.value || '').trim() || '30 ft.',
          profBonus: parseInt($('#m-prof')?.value, 10) || profBonusForLevel(level),
          attacks: ($('#m-attacks')?.value || '').trim(),
          features: ($('#m-features')?.value || '').trim(),
          notes: ($('#m-notes')?.value || '').trim(),
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
        const name = $('#m-name')?.value?.trim();
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
          notes: ($('#m-notes')?.value || '').trim(),
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
        const name = $('#m-name')?.value?.trim();
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

  /** Apply player disruption before / during a Force Turn. Mutates force. */
  function applyPlayerDisruption(f, level) {
    const notes = [];
    const clockBefore = f.agendaClock;
    if (level === 'minor') {
      f.agendaClock = clamp(f.agendaClock - 1, 0, 6);
      f.pressure = clamp(f.pressure + 1, 0, 4);
      if (f.awareness < 4 && Math.random() < 0.5) f.awareness = clamp(f.awareness + 1, 0, 4);
      notes.push(`Players disrupted operations: agenda clock retracts ${clockBefore} → ${f.agendaClock}/6.`);
      notes.push(`Pressure rises to ${f.pressure}/4 as the force reacts.`);
    } else if (level === 'major') {
      f.agendaClock = clamp(f.agendaClock - 2, 0, 6);
      f.pressure = clamp(f.pressure + 1, 0, 4);
      f.awareness = clamp(f.awareness + 1, 0, 4);
      const dom = dominantInfluence(f);
      if (dom === 'political') f.political = clamp(f.political - 1, 0, 6);
      else if (dom === 'corruptive') f.corruptive = clamp(f.corruptive - 1, 0, 6);
      else f.disruptive = clamp(f.disruptive - 1, 0, 6);
      notes.push(`Major player interference: agenda clock retracts ${clockBefore} → ${f.agendaClock}/6.`);
      notes.push(`Dominant ${dom} influence slips by 1. Awareness ${f.awareness}/4 · Pressure ${f.pressure}/4.`);
    } else if (level === 'thwarted') {
      const target = Math.min(f.agendaClock - 3, 2);
      f.agendaClock = clamp(target, 0, 6);
      f.pressure = clamp(f.pressure + 2, 0, 4);
      f.awareness = clamp(f.awareness + 1, 0, 4);
      const dom = dominantInfluence(f);
      if (dom === 'political') f.political = clamp(f.political - 1, 0, 6);
      else if (dom === 'corruptive') f.corruptive = clamp(f.corruptive - 1, 0, 6);
      else f.disruptive = clamp(f.disruptive - 1, 0, 6);
      notes.push(`Goal actively thwarted: agenda clock collapses ${clockBefore} → ${f.agendaClock}/6.`);
      notes.push(`The force is wounded but alert — Awareness ${f.awareness}/4 · Pressure ${f.pressure}/4.`);
    }
    if (level !== 'none') {
      f.status = `Player disruption (${level}): clock ${f.agendaClock}/6`;
    }
    return { level, notes, clockBefore, clockAfter: f.agendaClock };
  }

  function applyFactionGoalRetraction(c, force, disruption) {
    if (!c.factions || !disruption || disruption.level === 'none') return null;
    const fname = String(force.name || '').toLowerCase().trim();
    if (!fname) return null;
    const fac = c.factions.find(x => {
      const n = String(x.name || '').toLowerCase().trim();
      return n && (n === fname || n.includes(fname) || fname.includes(n));
    });
    if (!fac) return null;
    const before = Number(fac.reputation) || 0;
    let delta = 0;
    if (disruption.level === 'major') delta = before >= 0 ? -1 : 1;
    else if (disruption.level === 'thwarted') delta = before > 0 ? -1 : (before < 0 ? 1 : 0);
    fac.reputation = clamp(before + delta, -3, 3);
    const goalNote = disruption.level === 'thwarted'
      ? 'Primary agenda stalled by the party.'
      : disruption.level === 'major'
        ? 'Agenda set back by party action.'
        : 'Operations hindered.';
    const line = `[Force Turn] ${goalNote} Linked force «${force.name}» clock ${disruption.clockBefore}→${disruption.clockAfter}.`;
    fac.notes = [fac.notes || '', line].filter(Boolean).join('\n');
    return {
      faction: fac.name,
      reputationBefore: before,
      reputationAfter: fac.reputation,
      note: goalNote
    };
  }

  /** Run one Force Turn for a single force. Mutates the force in place. Returns report object. */
  function runForceTurn(f, disruptionLevel = 'none') {
    const n = normalizeForce(f);
    Object.assign(f, n);

    const disruption = applyPlayerDisruption(f, disruptionLevel || 'none');

    const maxInf = Math.max(f.political, f.corruptive, f.disruptive);
    const dom = dominantInfluence(f);
    const actionTable = dom === 'political' ? GENERATORS.politicalActions
      : dom === 'corruptive' ? GENERATORS.corruptiveActions
      : GENERATORS.disruptiveActions;

    const disruptPenalty = disruptionLevel === 'none' ? 0 : disruptionLevel === 'minor' ? 0.12 : disruptionLevel === 'major' ? 0.22 : 0.35;
    const actChance = 0.35 + (maxInf * 0.08) + (f.pressure * 0.05) + (disruptionLevel !== 'none' ? 0.1 : 0);
    const acts = Math.random() < actChance;

    const clockChance = Math.max(0.05, 0.25 + (maxInf * 0.07) + (f.pressure >= 3 ? 0.1 : 0) - disruptPenalty);
    const advancesClock = disruptionLevel !== 'thwarted' && f.agendaClock < 6 && Math.random() < clockChance;

    let actionText = '';
    let clockNote = '';
    let awarenessNote = '';
    let pressureNote = '';

    if (acts) {
      actionText = pick(actionTable);
      if (disruptionLevel !== 'none') actionText = `In reaction to the party: ${actionText}`;
      f.lastAction = actionText;
      f.status = actionText;
    } else {
      actionText = disruptionLevel !== 'none'
        ? 'Reeling from setbacks — consolidates assets and watches the party.'
        : pick(GENERATORS.statusSnippets);
      f.status = actionText;
    }

    if (disruption.notes.length) clockNote = disruption.notes.join(' ');
    if (advancesClock) {
      f.agendaClock = clamp(f.agendaClock + 1, 0, 6);
      const adv = `Agenda clock advances to ${f.agendaClock}/6 — ${GENERATORS.clockStageLabels[f.agendaClock]}.`;
      clockNote = clockNote ? `${clockNote} ${adv}` : adv;
    }

    if (acts && f.awareness < 4 && Math.random() < 0.2 + f.awareness * 0.05 + (disruptionLevel !== 'none' ? 0.2 : 0)) {
      f.awareness = clamp(f.awareness + 1, 0, 4);
      awarenessNote = `Awareness of the party rises to ${f.awareness}/4.`;
    }

    if (f.agendaClock >= 4 && f.pressure < 3 && Math.random() < 0.3) {
      f.pressure = clamp(f.pressure + 1, 0, 4);
      pressureNote = `Pressure rises to ${f.pressure}/4.`;
    } else if (f.pressure >= 3 && disruptionLevel === 'none' && Math.random() < 0.15) {
      f.pressure = clamp(f.pressure - 1, 0, 4);
      pressureNote = `After escalating, pressure eases to ${f.pressure}/4.`;
    }

    return {
      name: f.name,
      forceId: f.id,
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
      goalComplete: f.agendaClock >= 6,
      disruption: disruptionLevel,
      disruptionNotes: disruption.notes,
      disruptionDetail: disruption
    };
  }

  async function forceTurn() {
    const c = getActive();
    if (!c || c.forces.length === 0) {
      toast('No active forces — add forces first');
      return;
    }

    c.forces = c.forces.map(f => {
      const n = normalizeForce(f);
      Object.assign(f, n);
      return f;
    });

    const rows = c.forces.map(f => `
      <div class="force-disrupt-row" data-force-id="${escapeAttr(f.id)}">
        <div class="force-disrupt-name">
          <strong>${escapeHtml(f.name)}</strong>
          <span class="muted small">Clock ${f.agendaClock}/6 · ${escapeHtml(f.goal || 'No goal set')}</span>
        </div>
        <label class="field compact">
          <span class="muted small">Party disruption</span>
          <select class="force-disrupt-select" data-force-id="${escapeAttr(f.id)}">
            <option value="none" selected>None — goals proceed</option>
            <option value="minor">Minor — hindered (−1 clock, +pressure)</option>
            <option value="major">Major — set back (−2 clock, −influence)</option>
            <option value="thwarted">Thwarted — agenda collapses (−3 clock)</option>
          </select>
        </label>
      </div>`).join('');

    let captured = null;
    const confirmed = await openModal({
      title: 'Force Turn — Player Disruption',
      wide: true,
      bodyHtml: `
        <p class="muted">Mark how the party affected each force’s goals this interval. Disruptions <strong>retract agenda clocks</strong> and can update linked factions. Forces then act — disrupted ones retaliate more and advance goals less.</p>
        <div class="force-disrupt-list">${rows}</div>
        <div class="field" style="margin-top:0.75rem">
          <label>DM notes for this turn (optional)</label>
          <textarea id="force-turn-notes" rows="2" placeholder="What the party did this interval…"></textarea>
        </div>
      `,
      confirmText: 'Run Force Turn',
      onConfirm: () => {
        const map = {};
        document.querySelectorAll('.force-disrupt-select').forEach(sel => {
          map[sel.getAttribute('data-force-id')] = sel.value || 'none';
        });
        captured = {
          map,
          notes: (document.getElementById('force-turn-notes')?.value || '').trim()
        };
        return true;
      }
    });
    if (!confirmed || !captured) return;

    const factionHits = [];
    const reports = c.forces.map(f => {
      const level = captured.map[f.id] || 'none';
      const report = runForceTurn(f, level);
      const facHit = applyFactionGoalRetraction(c, f, report.disruptionDetail);
      if (facHit) {
        report.factionNote = facHit;
        factionHits.push(facHit);
      }
      return report;
    });

    if (captured.notes) {
      c.notes = [c.notes || '', `[Force Turn] ${captured.notes}`].filter(Boolean).join('\n\n');
    }
    // Store last force-turn log on campaign
    c.lastForceTurn = {
      at: new Date().toISOString(),
      notes: captured.notes,
      reports: reports.map(r => ({
        name: r.name,
        disruption: r.disruption,
        clock: r.clock,
        action: r.action,
        clockNote: r.clockNote
      }))
    };
    c.updatedAt = new Date().toISOString();
    save();
    renderForces();
    if (typeof renderFactions === 'function') {
      try { renderFactions(); } catch (e) {}
    }

    const lines = reports.map(r => {
      let html = `<li class="force-turn-item">
        <strong>${escapeHtml(r.name)}</strong>
        <span class="dom-tag ${r.dominant}">${r.dominant}</span>`;
      if (r.disruption && r.disruption !== 'none') {
        html += `<span class="dom-tag disrupt">${escapeHtml(r.disruption)}</span>`;
      }
      html += `<div class="turn-action">${escapeHtml(r.action)}</div>`;
      if (r.clockNote) html += `<div class="turn-clock">⏱ ${escapeHtml(r.clockNote)}</div>`;
      if (r.awarenessNote) html += `<div class="turn-meta">${escapeHtml(r.awarenessNote)}</div>`;
      if (r.pressureNote) html += `<div class="turn-meta">${escapeHtml(r.pressureNote)}</div>`;
      if (r.factionNote) {
        html += `<div class="turn-meta">🏛 Faction <strong>${escapeHtml(r.factionNote.faction)}</strong>: ${escapeHtml(r.factionNote.note)} (rep ${r.factionNote.reputationBefore} → ${r.factionNote.reputationAfter})</div>`;
      }
      if (r.goalComplete) html += `<div class="turn-alert">⚠ Primary goal achieved — the campaign transforms.</div>`;
      html += `</li>`;
      return html;
    }).join('');

    openModal({
      title: 'Dynamic Influence — Force Turn Results',
      wide: true,
      bodyHtml: `
        <p class="muted">The world moved. Agenda clocks retracted where the party interfered; forces then acted according to influence, awareness, and pressure.</p>
        ${captured.notes ? `<p class="muted small"><strong>DM notes:</strong> ${escapeHtml(captured.notes)}</p>` : ''}
        <ul class="force-turn-list">${lines}</ul>
        ${factionHits.length ? `<p class="muted small">${factionHits.length} linked faction(s) updated.</p>` : '<p class="muted small">Tip: name a Force like its Faction to auto-link reputation when goals are disrupted.</p>'}
      `,
      confirmText: 'Done',
      onConfirm: () => true
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
    try { renderClassTablesTools(); } catch (e) {}

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
            cb.hp = parseInt($('#m-hp')?.value, 10) || 0;
            cb.hpMax = parseInt($('#m-hpmax')?.value, 10) || cb.hpMax;
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
        const name = $('#m-name')?.value?.trim();
        if (!name) { toast('Name required'); return false; }
        const combat = getCombat(c);
        const hp = parseInt($('#m-hp')?.value, 10) || 1;
        combat.combatants.push({
          id: uid(),
          sourceId: null,
          name,
          init: parseInt($('#m-init').value, 10) || 0,
          hp,
          hpMax: hp,
          ac: parseInt($('#m-ac')?.value, 10) || 10,
          conditions: '',
          side: $('#m-side').value || 'enemy',
          notes: ($('#m-notes')?.value || '').trim()
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
    refreshBestiaryRef();
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
    ['bestiary-search', 'bestiary-world', 'bestiary-origin', 'bestiary-cr', 'bestiary-source'].forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.dataset.wired) return;
      el.dataset.wired = '1';
      el.addEventListener('input', renderBestiary);
      el.addEventListener('change', () => {
        if (id === 'bestiary-source') {
          window.BESTIARY_SOURCE = el.value || 'all';
          applyCompendiumToRuntime();
        }
        renderBestiary();
      });
    });
    const refBtn = document.getElementById('bestiary-refresh-btn');
    if (refBtn && !refBtn.dataset.wired) {
      refBtn.dataset.wired = '1';
      refBtn.addEventListener('click', async () => {
        refBtn.disabled = true;
        try {
          if (typeof loadUserCompendiumAsync === 'function') await loadUserCompendiumAsync();
          if (typeof applyCompendiumToRuntime === 'function') applyCompendiumToRuntime();
          if (typeof refreshBestiaryRef === 'function') refreshBestiaryRef();
          renderBestiary();
          toast('Bestiary refreshed');
        } catch (e) {
          console.warn(e);
          toast('Refresh failed');
        } finally {
          refBtn.disabled = false;
        }
      });
    }
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
    loadUserCompendiumAsync().then(() => {
      try { applyCompendiumToRuntime(); } catch (e) { console.warn(e); }
      if (typeof renderCompendiumTools === 'function' && $('#compendium-tools')) renderCompendiumTools();
      if ($('#feature-compendium-tools') && typeof renderFeatureCompendium === 'function') renderFeatureCompendium($('#feature-compendium-tools'));
      if (window.DSCExtensions && $('#extensions-tools')) {
        window.DSCExtensions.renderExtensionsTools($('#extensions-tools'), { player: false });
      }
      if (typeof renderBestiary === 'function' && $('#view-bestiary')?.classList.contains('active')) renderBestiary();
    }).catch(e => console.warn(e));
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

  try { window.importCompendiumPack = importCompendiumPack; } catch (e) {}
