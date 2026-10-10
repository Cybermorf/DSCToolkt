// Dark Sun Chronicles — PHB reference data for character creation
// Standard 5e skills/classes + DSC signature classes + Umbralites race (Player's Handbook)

window.PHB_SKILLS = [
  { name: 'Acrobatics', ability: 'DEX', desc: 'Stay on your feet in tricky situations, perform stunts, tumble, and keep balance.' },
  { name: 'Animal Handling', ability: 'WIS', desc: 'Calm, train, or control animals, and read an animal’s intentions.' },
  { name: 'Arcana', ability: 'INT', desc: 'Recall lore about spells, magic items, planar lore, symbols, and magical traditions.' },
  { name: 'Athletics', ability: 'STR', desc: 'Climb, jump, swim, grapple, and other feats of raw physical power.' },
  { name: 'Deception', ability: 'CHA', desc: 'Convincingly hide the truth through lies, misdirection, or false appearances.' },
  { name: 'History', ability: 'INT', desc: 'Recall historical events, legends, wars, peoples, and lost civilizations of Eldoria.' },
  { name: 'Insight', ability: 'WIS', desc: 'Determine true intentions, read body language, and sense motives.' },
  { name: 'Intimidation', ability: 'CHA', desc: 'Influence others through threats, hostile actions, and physical presence.' },
  { name: 'Investigation', ability: 'INT', desc: 'Search for clues, deduce from evidence, and piece together hidden information.' },
  { name: 'Medicine', ability: 'WIS', desc: 'Stabilize the dying, diagnose illness, and treat injuries in the field.' },
  { name: 'Nature', ability: 'INT', desc: 'Recall lore about terrain, plants, animals, weather, and natural cycles.' },
  { name: 'Perception', ability: 'WIS', desc: 'Spot, hear, or otherwise detect the presence of something; general awareness.' },
  { name: 'Performance', ability: 'CHA', desc: 'Entertain through music, dance, acting, storytelling, or similar.' },
  { name: 'Persuasion', ability: 'CHA', desc: 'Influence with tact, social grace, good nature, or negotiation.' },
  { name: 'Religion', ability: 'INT', desc: 'Recall lore about deities, rites, prayers, religious hierarchies, and cults.' },
  { name: 'Sleight of Hand', ability: 'DEX', desc: 'Pick pockets, plant objects, conceal items, and perform manual tricks.' },
  { name: 'Stealth', ability: 'DEX', desc: 'Conceal yourself from enemies, slip past guards, and move unseen or unheard.' },
  { name: 'Survival', ability: 'WIS', desc: 'Follow tracks, hunt game, guide a group through wilderness, and avoid natural hazards.' }
];

// Proficiency bonus by level (5e)
window.PHB_PROF_BY_LEVEL = [null,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];

window.PHB_CLASSES = [
  {
    name: 'Barbarian', hitDie: 'd12', primary: 'STR', saves: 'STR, CON',
    armor: 'Light, medium, shields', weapons: 'Simple, martial',
    skillsChoose: 2, skills: ['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'],
    summary: 'Primal warrior who channels rage into unmatched combat ferocity.',
    progression: [
      [1,'Rage, Unarmored Defense'],[2,'Reckless Attack, Danger Sense'],[3,'Primal Path'],[4,'ASI'],
      [5,'Extra Attack, Fast Movement'],[7,'Feral Instinct'],[9,'Brutal Critical (1 die)'],[11,'Relentless Rage'],
      [15,'Persistent Rage'],[18,'Indomitable Might'],[20,'Primal Champion']
    ]
  },
  {
    name: 'Bard', hitDie: 'd8', primary: 'CHA', saves: 'DEX, CHA',
    armor: 'Light', weapons: 'Simple, hand crossbows, longswords, rapiers, shortswords',
    skillsChoose: 3, skills: 'Any',
    summary: 'Master of song, speech, and magic who inspires allies and confounds foes.',
    progression: [
      [1,'Spellcasting, Bardic Inspiration (d6)'],[2,'Jack of All Trades, Song of Rest'],[3,'Bard College, Expertise'],
      [4,'ASI'],[5,'Font of Inspiration, Bardic Inspiration (d8)'],[6,'Countercharm, College feature'],
      [10,'Magical Secrets, Expertise, Bardic Inspiration (d10)'],[14,'Magical Secrets'],[20,'Superior Inspiration']
    ]
  },
  {
    name: 'Cleric', hitDie: 'd8', primary: 'WIS', saves: 'WIS, CHA',
    armor: 'Light, medium, shields', weapons: 'Simple',
    skillsChoose: 2, skills: ['History','Insight','Medicine','Persuasion','Religion'],
    summary: 'Divine agent channeling the power of a god, philosophy, or cosmic force.',
    progression: [
      [1,'Spellcasting, Divine Domain'],[2,'Channel Divinity, Domain feature'],[4,'ASI'],
      [5,'Destroy Undead (CR 1/2)'],[6,'Domain feature'],[8,'ASI, Destroy Undead (CR 1), Domain feature'],
      [10,'Divine Intervention'],[17,'Domain feature'],[20,'Divine Intervention improvement']
    ]
  },
  {
    name: 'Druid', hitDie: 'd8', primary: 'WIS', saves: 'INT, WIS',
    armor: 'Light, medium, shields (nonmetal)', weapons: 'Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears',
    skillsChoose: 2, skills: ['Arcana','Animal Handling','Insight','Medicine','Nature','Perception','Religion','Survival'],
    summary: 'Keeper of the old ways who draws power from nature and wild shapes.',
    progression: [
      [1,'Druidic, Spellcasting'],[2,'Wild Shape, Druid Circle'],[4,'ASI, Wild Shape improvement'],
      [6,'Circle feature'],[8,'ASI, Wild Shape improvement'],[10,'Circle feature'],
      [14,'Circle feature'],[18,'Timeless Body, Beast Spells'],[20,'Archdruid']
    ]
  },
  {
    name: 'Fighter', hitDie: 'd10', primary: 'STR or DEX', saves: 'STR, CON',
    armor: 'All armor, shields', weapons: 'Simple, martial',
    skillsChoose: 2, skills: ['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'],
    summary: 'Versatile martial expert defined by training, tactics, and weapon mastery.',
    progression: [
      [1,'Fighting Style, Second Wind'],[2,'Action Surge'],[3,'Martial Archetype'],[4,'ASI'],
      [5,'Extra Attack'],[6,'ASI'],[9,'Indomitable'],[11,'Extra Attack (2)'],[13,'Indomitable (2)'],
      [15,'Archetype feature'],[17,'Action Surge (2), Indomitable (3)'],[20,'Extra Attack (3)']
    ]
  },
  {
    name: 'Monk', hitDie: 'd8', primary: 'DEX & WIS', saves: 'STR, DEX',
    armor: 'None', weapons: 'Simple, shortswords',
    skillsChoose: 2, skills: ['Acrobatics','Athletics','History','Insight','Religion','Stealth'],
    summary: 'Martial artist who turns body and ki into weapons and defenses.',
    progression: [
      [1,'Unarmored Defense, Martial Arts'],[2,'Ki, Unarmored Movement'],[3,'Monastic Tradition, Deflect Missiles'],
      [4,'ASI, Slow Fall'],[5,'Extra Attack, Stunning Strike'],[6,'Ki-Empowered Strikes, Tradition feature'],
      [7,'Evasion, Stillness of Mind'],[10,'Purity of Body'],[14,'Diamond Soul'],[18,'Empty Body'],[20,'Perfect Self']
    ]
  },
  {
    name: 'Paladin', hitDie: 'd10', primary: 'STR & CHA', saves: 'WIS, CHA',
    armor: 'All armor, shields', weapons: 'Simple, martial',
    skillsChoose: 2, skills: ['Athletics','Insight','Intimidation','Medicine','Persuasion','Religion'],
    summary: 'Oath-bound warrior channeling divine power through martial skill.',
    progression: [
      [1,'Divine Sense, Lay on Hands'],[2,'Fighting Style, Spellcasting, Divine Smite'],[3,'Sacred Oath, Divine Health'],
      [4,'ASI'],[5,'Extra Attack'],[6,'Aura of Protection'],[10,'Aura of Courage'],[11,'Improved Divine Smite'],
      [14,'Cleansing Touch'],[20,'Oath feature']
    ]
  },
  {
    name: 'Ranger', hitDie: 'd10', primary: 'DEX & WIS', saves: 'STR, DEX',
    armor: 'Light, medium, shields', weapons: 'Simple, martial',
    skillsChoose: 3, skills: ['Animal Handling','Athletics','Insight','Investigation','Nature','Perception','Stealth','Survival'],
    summary: 'Hunter and wanderer at home in the wilds between the Seven Worlds.',
    progression: [
      [1,'Favored Enemy, Natural Explorer'],[2,'Fighting Style, Spellcasting'],[3,'Ranger Archetype, Primeval Awareness'],
      [4,'ASI'],[5,'Extra Attack'],[8,'ASI, Land’s Stride'],[10,'Hide in Plain Sight'],[14,'Vanish'],
      [18,'Feral Senses'],[20,'Foe Slayer']
    ]
  },
  {
    name: 'Rogue', hitDie: 'd8', primary: 'DEX', saves: 'DEX, INT',
    armor: 'Light', weapons: 'Simple, hand crossbows, longswords, rapiers, shortswords',
    skillsChoose: 4, skills: ['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Performance','Persuasion','Sleight of Hand','Stealth'],
    tools: 'Thieves’ tools',
    summary: 'Expert in stealth, precision strikes, and skilled problem-solving.',
    progression: [
      [1,'Expertise, Sneak Attack, Thieves’ Cant'],[2,'Cunning Action'],[3,'Roguish Archetype'],[4,'ASI'],
      [5,'Uncanny Dodge'],[6,'Expertise'],[7,'Evasion'],[11,'Reliable Talent'],[14,'Blind Sense'],
      [15,'Slippery Mind'],[18,'Elusive'],[20,'Stroke of Luck']
    ]
  },
  {
    name: 'Sorcerer', hitDie: 'd6', primary: 'CHA', saves: 'CON, CHA',
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows',
    skillsChoose: 2, skills: ['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'],
    summary: 'Innate spellcaster whose power flows from bloodline, fate, or cosmic accident.',
    progression: [
      [1,'Spellcasting, Sorcerous Origin'],[2,'Font of Magic'],[3,'Metamagic'],[4,'ASI'],
      [5,'—'],[6,'Origin feature'],[10,'Metamagic'],[14,'Origin feature'],[17,'Metamagic'],
      [18,'Origin feature'],[20,'Sorcerous Restoration']
    ]
  },
  {
    name: 'Warlock', hitDie: 'd8', primary: 'CHA', saves: 'WIS, CHA',
    armor: 'Light', weapons: 'Simple',
    skillsChoose: 2, skills: ['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'],
    summary: 'Pact-bound caster drawing power from a patron beyond mortal ken.',
    progression: [
      [1,'Otherworldly Patron, Pact Magic'],[2,'Eldritch Invocations'],[3,'Pact Boon'],[4,'ASI'],
      [5,'—'],[6,'Patron feature'],[11,'Mystic Arcanum (6th)'],[12,'ASI'],
      [13,'Mystic Arcanum (7th)'],[15,'Mystic Arcanum (8th)'],[17,'Mystic Arcanum (9th)'],[20,'Eldritch Master']
    ]
  },
  {
    name: 'Wizard', hitDie: 'd6', primary: 'INT', saves: 'INT, WIS',
    armor: 'None', weapons: 'Daggers, darts, slings, quarterstaffs, light crossbows',
    skillsChoose: 2, skills: ['Arcana','History','Insight','Investigation','Medicine','Religion'],
    summary: 'Scholar of arcane traditions who prepares spells from a growing grimoire.',
    progression: [
      [1,'Spellcasting, Arcane Recovery'],[2,'Arcane Tradition'],[4,'ASI'],[6,'Tradition feature'],
      [10,'Tradition feature'],[14,'Tradition feature'],[18,'Spell Mastery'],[20,'Signature Spells']
    ]
  },
  // ── DSC signature classes (Player's Handbook Ch. 6) ──────────────────────
  {
    name: 'Moon Guardian', hitDie: 'd10', primary: 'WIS', saves: 'WIS, CHA',
    armor: 'Light, medium, shields', weapons: 'Simple, martial',
    skillsChoose: 2, skills: ['Athletics','Insight','Medicine','Perception','Religion','Survival'],
    summary: 'Celestial half-caster chosen by Luna. Uses Lunar Charges and Moon Paths tied to the Seven Worlds. See PHB Table B-11 for full progression.',
    setting: true,
    progression: [
      [1,'Lunar Bond, Moonlight Infusion, Martial Training'],[2,'Spellcasting (WIS half-caster), Lunar Charges'],
      [3,'Moon Path (Path of Luminaris / Umbraria / …)'],[4,'ASI'],[5,'Extra Attack'],
      [6,'Path feature'],[10,'Improved Lunar Charges'],[11,'Path feature (e.g. Luminous Form)'],
      [15,'Path feature'],[18,'Lunar Mastery'],[20,'Avatar of Luna']
    ]
  },
  {
    name: 'Bloodhunter', hitDie: 'd10', primary: 'STR or DEX & CON', saves: 'DEX, CON',
    armor: 'Light, medium, shields', weapons: 'Simple, martial',
    skillsChoose: 3, skills: ['Athletics','Insight','Intimidation','Medicine','Perception','Survival'],
    summary: 'Hemomantic hunter who sacrifices own vitality for Blood Rites, Crimson rites, and path features (Order / Vitality / Ruin).',
    setting: true,
    progression: [
      [1,'Hunter’s Bane, Blood Maledict'],[2,'Fighting Style'],[3,'Bloodhunter Path, Blood Rite'],
      [4,'ASI'],[5,'Extra Attack'],[6,'Brand of Castigation'],[10,'Dark Augmentation'],
      [11,'Path feature'],[14,'Hardened Soul'],[18,'Path feature'],[20,'Path capstone (e.g. Crimson Apotheosis)']
    ]
  },
  {
    name: 'Ghostblade', hitDie: 'd8', primary: 'DEX & WIS', saves: 'DEX, WIS',
    armor: 'None (spectral defense)', weapons: 'Simple, shortswords; spectral weapons via class features',
    skillsChoose: 2, skills: ['Acrobatics','Athletics','Insight','Perception','Religion','Stealth'],
    summary: 'Umbrarian spectral martial tradition. Channels ethereal weapons and spirit techniques rather than living shadow.',
    setting: true,
    progression: [
      [1,'Spectral Armament, Ethereal Sense'],[2,'Spirit Step'],[3,'Ghostblade Discipline'],
      [4,'ASI'],[5,'Extra Attack'],[6,'Phase Strike'],[9,'Spirit Ward'],
      [11,'Discipline feature'],[14,'Ghostwalk'],[17,'Discipline feature'],[20,'Spectral Mastery']
    ]
  },
  {
    name: 'Shadowblade', hitDie: 'd8', primary: 'DEX', saves: 'DEX, CHA',
    armor: 'Light', weapons: 'Simple, hand crossbows, longswords, rapiers, shortswords',
    skillsChoose: 4, skills: ['Acrobatics','Deception','Insight','Intimidation','Investigation','Perception','Sleight of Hand','Stealth'],
    tools: 'Thieves’ tools',
    summary: 'Covert striker of living shadow—concealment, misdirection, and umbral bursts. Associated with Umbraria (Nightstalkers, Syndicate) but not exclusive.',
    setting: true,
    progression: [
      [1,'Expertise, Shadow Strike, Umbral Veil'],[2,'Cunning Action'],[3,'Shadow Tradition'],
      [4,'ASI'],[5,'Uncanny Dodge'],[6,'Expertise'],[7,'Evasion'],[9,'Shadow Step (class)'],
      [11,'Reliable Talent'],[14,'Shadow Form'],[17,'Tradition feature'],[20,'Living Night']
    ]
  }
];

window.PHB_RACES = [
  {
    id: 'umbralites',
    name: 'Umbralites',
    world: 'Umbraria',
    tagline: 'People of the Living Shadow',
    short: 'Native people of Umbraria, attuned to dimness, shadow, and subtle energies. Culture prizes discretion, self-knowledge, and responsible use of hidden power.',
    full: true
  },
  { id: 'luminari', name: 'Luminari', world: 'Luminaris', tagline: 'Children of Living Light', short: 'Radiant people of Luminaris; luminous markings and long memory of scholarship and corroboration.' },
  { id: 'ravari', name: 'Ravari', world: 'Eternum', tagline: 'People of Scar and Endurance', short: 'Hardened folk of Eternum shaped by ruin, recovery, and relentless survival.' },
  { id: 'solarians', name: 'Solarians', world: 'Solara', tagline: 'People of the Golden Sun', short: 'Vital people of Solara bound to light, remembrance, and living renewal.' },
  { id: 'aetherians', name: 'Aetherians', world: 'Aetheria', tagline: 'People of Wind and Sky', short: 'Sky-born folk of floating isles and responsible freedom of motion.' },
  { id: 'harmonites', name: 'Harmonites', world: 'Harmonia', tagline: 'People of Living Concord', short: 'Cooperative peoples of Harmonia who treat difference as a source of strength.' },
  { id: 'celestials', name: 'Celestials', world: 'Celestia', tagline: 'People of Sacred Thresholds', short: 'Long-lived people of Celestia concerned with consent, identity, and cosmic order.' },
  { id: 'other', name: 'Other / Custom', world: '', tagline: '', short: 'Human, mixed heritage, or a people not listed among the seven dominant ancestries.' }
];

// Full Umbralites section from Player's Handbook Ch. 5
window.UMBRALITES = {
  name: 'Umbralites',
  tagline: 'People of the Living Shadow',
  intro: 'Umbralites are the native people most closely associated with Umbraria. Their bodies are naturally attuned to dimness, shadow, and the subtle energies that saturate their world. Outsiders often stereotype them as sinister because of their appearance and magical affinity, but Umbralite culture has long distinguished between darkness as a natural force and cruelty as a moral choice.',
  appearance: 'Umbralites usually possess humanoid proportions with elongated, graceful limbs. Their skin ranges through charcoal, deep violet, midnight blue, obsidian, and other shadowed tones, often with a faint ethereal sheen. Constellation-like markings may glow dimly across their bodies. Their eyes are frequently black, violet, silver, or deep blue, sometimes seeming to contain small sparks of dark energy. Traditional garments use layered fabrics, veils, reflective thread, and patterns inspired by stars, eclipses, or hidden constellations.',
  lifeSpan: 'Umbralites generally reach adulthood around thirty years of age and can live for roughly one hundred and fifty years.',
  culture: 'Umbralite society places high value on discretion, self-knowledge, philosophy, and the responsible use of hidden power. Their scholars and mystics study duality, secrecy, shadow magic, and cosmic balance. Artisans are renowned for shadow-woven textiles, enchanted arms, and objects designed to manipulate light. Privacy is often treated as a form of dignity rather than suspicion. To reveal another person’s secret without cause can be considered a profound violation. This has also created a culture skilled at espionage, coded communication, and political maneuvering.',
  beliefs: 'Many Umbralite traditions teach that light and shadow define one another. Darkness is associated with rest, concealment, reflection, protection, and the unknown as much as with danger.',
  names: 'Common names favor soft consonants, sibilants, and darker celestial imagery: Xalith, Seraphina, Malachi, Nyxara, Vesper, Kaelis, Nerezza, Vael, Theren, Isryn, Selvaris. Family names or titles may include Nightshade, Shadowcaster, Veilborn, Duskwalker, Eclipsebound, Gloamveil, and Nocturne.',
  adventurers: 'Umbralites leave home as spies, diplomats, scholars, occult investigators, merchants, guardians, fugitives, and seekers of forbidden truths. Some adventure because secrecy failed them; others because they believe the wider worlds misunderstand Umbraria and intend to prove it.',
  traits: [
    { name: 'Creature Type', text: 'Humanoid.' },
    { name: 'Size', text: 'Medium. Umbralites are typically 5 to 6 feet tall.' },
    { name: 'Speed', text: '30 feet.' },
    { name: 'Life Span', text: 'You reach adulthood around 30 years and can live for roughly 150 years.' },
    { name: 'Darkvision', text: 'You have Darkvision out to 60 feet.' },
    { name: 'Umbral Resistance', text: 'You have Resistance to Necrotic damage.' },
    { name: 'Shadow Blend', text: 'While you are in Dim Light or Darkness, you have Advantage on Dexterity (Stealth) checks.' },
    { name: 'Shadow Step', text: 'As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see that is in Dim Light or Darkness. You can use this trait a number of times equal to your Proficiency Bonus, and regain all expended uses when you finish a Long Rest.' },
    { name: 'Languages', text: 'You can speak, read, and write Common and Umbral.' }
  ],
  questions: [
    'Who taught you that secrecy can be a shield?',
    'What secret are you still protecting?',
    'Do you see shadow as refuge, tool, mystery, or danger?',
    'How do you respond when outsiders assume darkness means evil?',
    'What truth would make you break an oath of silence?'
  ]
};
