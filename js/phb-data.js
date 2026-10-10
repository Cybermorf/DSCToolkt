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
    "id": "luminari",
    "name": "Luminari",
    "world": "Luminaris",
    "tagline": "Children of Living Light",
    "short": "Radiant people of Luminaris; luminous markings and long memory of scholarship and corroboration.",
    "intro": "The Luminari are the people most closely associated with Luminaris, the radiant world nearest to Luna. Their bodies carry a visible trace of the magical energies that permeate their ancestral home.",
    "appearance": "Luminari typically have graceful builds and skin that carries a soft inner glow or luminous markings. Hair and eyes often show pale gold, silver, crystal white, or living color reminiscent of bioluminescent meadows.",
    "lifeSpan": "Luminari mature slowly, reaching adulthood at roughly one hundred years and often living for about a millennium.",
    "culture": "Traditional Luminari culture values knowledge, magical study, artistic expression, natural harmony, and stewardship. Academies, libraries, and sanctuaries preserve knowledge across generations. Luminari disagree sharply over how dangerous knowledge should be controlled.",
    "beliefs": "Many Luminari revere Luna. A common teaching states: “Light reveals the path. Wisdom decides whether it should be followed.” Light can heal—or blind and expose.",
    "names": "Aurelia, Selene, Seraphina, Lyra, Elara, Caelion, Erevan, Lucien, Orion, Solenar, Aelion, Vaelis. Epithets: Sunweaver, Starwhisper, Moonshadow, Everglow, Lightweaver, Dawnspire, Crystalborn.",
    "adventurers": "Scholars, guardians, healers, diplomats, pilgrims, explorers, or exiles seeking knowledge beyond Luminaris’s libraries.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium. Luminari are typically 5 to 6 feet tall."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You reach adulthood around 100 years and can live for roughly 1,000 years."
      },
      {
        "name": "Darkvision",
        "text": "You have Darkvision out to 60 feet."
      },
      {
        "name": "Radiant Resistance",
        "text": "You have Resistance to Radiant damage."
      },
      {
        "name": "Luminous Markings",
        "text": "Your markings shed dim light in a 5-foot radius, or you can suppress this light (no action required)."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Luminari."
      }
    ],
    "questions": [
      "What truth are you determined to uncover, even if elders think it should remain unanswered?",
      "What do your luminous markings mean?",
      "Why did you leave Luminaris?",
      "How does your long lifespan affect relationships with shorter-lived companions?",
      "Which tradition shaped you most strongly, and what part of it do you question?"
    ]
  },
  {
    "id": "umbralites",
    "name": "Umbralites",
    "world": "Umbraria",
    "tagline": "People of the Living Shadow",
    "short": "Native people of Umbraria, attuned to dimness, shadow, and subtle energies. Culture prizes discretion and responsible hidden power.",
    "intro": "Umbralites are the native people most closely associated with Umbraria. Outsiders often stereotype them as sinister, but Umbralite culture distinguishes darkness as a natural force from cruelty as a moral choice.",
    "appearance": "Elongated, graceful limbs; skin of charcoal, deep violet, midnight blue, or obsidian with a faint ethereal sheen. Constellation-like markings may glow dimly. Eyes often black, violet, silver, or deep blue.",
    "lifeSpan": "Adulthood around thirty years; roughly one hundred and fifty year lifespan.",
    "culture": "High value on discretion, self-knowledge, philosophy, and responsible use of hidden power. Privacy is dignity. Skilled in espionage, coded communication, and political maneuvering.",
    "beliefs": "Light and shadow define one another. Darkness is associated with rest, concealment, reflection, protection, and the unknown as much as with danger.",
    "names": "Xalith, Seraphina, Malachi, Nyxara, Vesper, Kaelis, Nerezza, Vael, Theren, Isryn, Selvaris. Titles: Nightshade, Shadowcaster, Veilborn, Duskwalker, Eclipsebound, Gloamveil, Nocturne.",
    "adventurers": "Spies, diplomats, scholars, occult investigators, merchants, guardians, fugitives, and seekers of forbidden truths.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium. Umbralites are typically 5 to 6 feet tall."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You reach adulthood around 30 years and can live for roughly 150 years."
      },
      {
        "name": "Darkvision",
        "text": "You have Darkvision out to 60 feet."
      },
      {
        "name": "Umbral Resistance",
        "text": "You have Resistance to Necrotic damage."
      },
      {
        "name": "Shadow Blend",
        "text": "While you are in Dim Light or Darkness, you have Advantage on Dexterity (Stealth) checks."
      },
      {
        "name": "Shadow Step",
        "text": "As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see that is in Dim Light or Darkness. Uses equal to Proficiency Bonus per Long Rest."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Umbral."
      }
    ],
    "questions": [
      "Who taught you that secrecy can be a shield?",
      "What secret are you still protecting?",
      "Do you see shadow as refuge, tool, mystery, or danger?",
      "How do you respond when outsiders assume darkness means evil?",
      "What truth would make you break an oath of silence?"
    ]
  },
  {
    "id": "ravari",
    "name": "Ravari",
    "world": "Eternum",
    "tagline": "People of Scar and Endurance",
    "short": "Hardened folk of Eternum shaped by ruin, recovery, and relentless survival.",
    "intro": "Ravari are the people most closely associated with Eternum, a world scarred by ancient conflict. What many share is respect for resilience and earned loyalty.",
    "appearance": "Often sturdy or scarred builds; practical dress suited to hard travel and war-torn roads. Appearance varies widely across clans and regions.",
    "lifeSpan": "Mature at a rate similar to humans; roughly 200 year lifespan.",
    "culture": "Scars are often respected. Weapons may be inherited because survival is remembered. Loyalty is earned, not assumed.",
    "beliefs": "Endurance and recovery after ruin define worth more than unscarred purity.",
    "names": "Kael, Varek, Nyra, Draven, Sera, Malen, Raska, Toren, Vaela, Kor, Elira, Rhaz. Clan names: Ashwalker, Ironblood, Veilscar, Redhand, Stoneborn, Oathkeeper, Emberfall, Lastwatch.",
    "adventurers": "Mercenaries, scouts, healers, monster hunters, salvagers, diplomats, rebels, scholars, and protectors.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium. Ravari generally range from 5 to 7 feet tall."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You mature at a rate similar to humans and can live for roughly 200 years."
      },
      {
        "name": "Darkvision",
        "text": "You have Darkvision out to 60 feet."
      },
      {
        "name": "Warrior's Resilience",
        "text": "You have Advantage on saving throws against the Frightened condition."
      },
      {
        "name": "Battle-Hardened",
        "text": "Choose one skill: Athletics, Intimidation, or Survival. You gain proficiency in that skill. You also gain proficiency with one Martial weapon of your choice."
      },
      {
        "name": "Relentless Endurance",
        "text": "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once per Long Rest."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Ravari."
      }
    ],
    "questions": [
      "What conflict shaped your childhood?",
      "Who protected you when the world gave them every reason not to?",
      "Do you believe lasting peace is possible?",
      "What part of Eternum remains beautiful enough for you to fight for?",
      "What inherited oath, weapon, or memory do you carry?"
    ]
  },
  {
    "id": "solarians",
    "name": "Solarians",
    "world": "Solara",
    "tagline": "Children of the Sun",
    "short": "Radiant people of Solara shaped by golden plains, living warmth, and solar tradition.",
    "intro": "Solarians are the radiant people of Solara, shaped by a world of golden plains, powerful light, living warmth, and sun-touched traditions.",
    "appearance": "Warm or golden undertones to skin and hair are common; many carry a visible solar vitality.",
    "lifeSpan": "Adulthood around 20 years; roughly 120 year lifespan.",
    "culture": "Leadership, vitality, and communal remembrance of the dead as living obligation.",
    "beliefs": "Light, vitality, and leadership are responsibilities—not merely gifts.",
    "names": "Names often evoke sun, grain, and bright stone. Family titles may reference dawn, harvest, or memorial fire.",
    "adventurers": "Leaders, healers, soldiers, pilgrims, and those who carry Solara’s light beyond its borders.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You reach adulthood around 20 years and can live for roughly 120 years."
      },
      {
        "name": "Darkvision",
        "text": "You have Darkvision out to 60 feet."
      },
      {
        "name": "Solar Resistance",
        "text": "You have Resistance to Radiant damage."
      },
      {
        "name": "Luminous Presence",
        "text": "As a Bonus Action, you can shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet, or suppress this light."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Solarian."
      }
    ],
    "questions": [
      "What does the sun mean to your family—life, judgment, or memory?",
      "What warmth do you refuse to let go cold?",
      "Whom do you lead, and who leads you?",
      "What memorial do you carry for the dead?",
      "What would make you dim your light?"
    ]
  },
  {
    "id": "aetherians",
    "name": "Aetherians",
    "world": "Aetheria",
    "tagline": "People of Wind and Sky",
    "short": "Sky-born folk of floating isles and responsible freedom of motion.",
    "intro": "Aetherians are the people of Aetheria’s floating islands, winds, and celestial routes—freedom tempered by responsibility for maintained connection.",
    "appearance": "Often lean builds suited to high places and long travel; clothing and ornaments echo wind, cloud, and compass.",
    "lifeSpan": "Adulthood around 25 years; roughly 180 year lifespan.",
    "culture": "Exploration, route-keeping, and the ethics of motion: freedom that does not abandon those left behind.",
    "beliefs": "Responsible motion keeps the skies alive. Freedom without connection is only drift.",
    "names": "Zephyra, Aurelia, Seraph, Lyra, Aeron, Caelis, Ilyra, Zephren, Aris, Vaela, Nym, Aeriel. Titles: Windrider, Skywake, Cloudspan.",
    "adventurers": "Explorers, pilots, couriers, scouts, and diplomats of the open routes.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You reach adulthood around 25 years and can live for roughly 180 years."
      },
      {
        "name": "Darkvision",
        "text": "You have Darkvision out to 60 feet."
      },
      {
        "name": "Aether Step",
        "text": "As a Bonus Action, teleport up to 20 feet to an unoccupied space you can see. Uses equal to Proficiency Bonus per Long Rest."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Aetherian."
      }
    ],
    "questions": [
      "What route must you keep open?",
      "Whom did freedom cost?",
      "Do you travel to escape or to connect?",
      "What sky-law do you still obey?",
      "Where is home when the islands drift?"
    ]
  },
  {
    "id": "harmonites",
    "name": "Harmonites",
    "world": "Harmonia",
    "tagline": "Keepers of Balance",
    "short": "People of Harmonia whose cultures developed around interdependence, art, and mediation.",
    "intro": "Harmonites are the people of Harmonia, a world whose cultures developed around interdependence, artistic expression, mediation, and cooperation through meaningful difference.",
    "appearance": "Diverse; dress and ornament often signal role in cooperative networks rather than rank alone.",
    "lifeSpan": "Adulthood around 25 years; roughly 160 year lifespan.",
    "culture": "Interdependence, artistic expression, mediation. Difference is treated as a source of strength when held in balance.",
    "beliefs": "Cooperation requires meaningful difference. Forced sameness is a form of violence.",
    "names": "Names vary by community; titles often reference song, braid, concord, or balance.",
    "adventurers": "Mediators, artists, diplomats, guardians of concord, and those who seek balance beyond Harmonia.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You reach adulthood around 25 years and can live for roughly 160 years."
      },
      {
        "name": "Harmonic Resilience",
        "text": "You have Advantage on saving throws you make to avoid or end the Charmed or Frightened condition."
      },
      {
        "name": "Harmonic Affinity",
        "text": "You gain proficiency in Insight or Persuasion."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Harmonic."
      }
    ],
    "questions": [
      "What difference do you refuse to erase?",
      "Whom do you still owe a hearing?",
      "When is harmony a trap?",
      "What song do you refuse to let go silent?",
      "What balance would you break to prevent a greater one from collapsing?"
    ]
  },
  {
    "id": "celestials",
    "name": "Celestials",
    "world": "Celestia",
    "tagline": "People of Sacred Thresholds",
    "short": "Long-lived people of Celestia concerned with consent, identity, and cosmic order.",
    "intro": "Celestials are the people most closely associated with Celestia, concerned with consent, identity, sacred thresholds, and the weight of cosmic knowledge.",
    "appearance": "Often striking presence; starlit or solemn features. Dress may mark temple, archive, or free-order affiliation.",
    "lifeSpan": "Adulthood around 30 years; roughly 500 year lifespan.",
    "culture": "Orders, temples, archives, and philosophies debate what knowledge obligates and what identity may be freely chosen.",
    "beliefs": "A recurring question asks whether wisdom is measured by what one knows or by what one chooses to do with knowledge.",
    "names": "Names may be formal or chosen; titles often reference covenant, threshold, star, or lantern.",
    "adventurers": "Those who leave because institutions claim too much truth, or because ordinary mortal life fascinates more than eternity.",
    "traits": [
      {
        "name": "Creature Type",
        "text": "Humanoid."
      },
      {
        "name": "Size",
        "text": "Medium."
      },
      {
        "name": "Speed",
        "text": "30 feet."
      },
      {
        "name": "Life Span",
        "text": "You reach adulthood around 30 years and can live for roughly 500 years."
      },
      {
        "name": "Celestial Resistance",
        "text": "Choose Radiant or Necrotic damage when you create your character. You have Resistance to the chosen damage type."
      },
      {
        "name": "Starlit Vision",
        "text": "You have Darkvision out to 60 feet."
      },
      {
        "name": "Celestial Insight",
        "text": "You gain proficiency in Religion or Insight."
      },
      {
        "name": "Celestial Magic",
        "text": "You know the Sacred Flame cantrip. At 3rd level, cast Bless once without a spell slot. At 5th level, cast Lesser Restoration once without a spell slot. Regain uses on a Long Rest. Choose Int, Wis, or Cha as the spellcasting ability."
      },
      {
        "name": "Languages",
        "text": "You can speak, read, and write Common and Celestial."
      }
    ],
    "questions": [
      "Which order, philosophy, temple, archive, or family shaped you?",
      "What question about the cosmos has no one answered to your satisfaction?",
      "Do you regard the other worlds with wonder, duty, affection, pity, or unease?",
      "What ordinary mortal experience fascinates you because it is brief?",
      "What belief would you be willing to abandon if experience proved it wrong?"
    ]
  },
  {
    "id": "other",
    "name": "Other / Custom",
    "world": "",
    "tagline": "",
    "short": "Human, mixed heritage, or a people not listed among the seven dominant ancestries.",
    "intro": "",
    "appearance": "",
    "lifeSpan": "",
    "culture": "",
    "beliefs": "",
    "names": "",
    "adventurers": "",
    "traits": [],
    "questions": []
  }
];

window.UMBRARIANS = {
  "name": "Umbrarians",
  "subtitle": "Hosts of the Dark Shards",
  "criticalDistinction": "An Umbralite is a native people of Umbraria (a race from the Player’s Handbook). An Umbrarian is the mortal host of a Dark Shard (a condition from the Dungeon Master’s Guide). Any ancestry can be an Umbrarian. The two words are historically confused—sometimes with disastrous consequences.",
  "definition": "An Umbrarian is the mortal host of a Dark Shard. Umbrarian is not a race, nation, or ordinary inherited condition. The term arose from incomplete histories linking early Shard activity to Umbraria. Some scholars still incorrectly assume that all Umbrarians are Umbralites or that every Shard originated beneath the twilight world. Both beliefs are false.",
  "boundAtBirth": "Each Shard is normally bound to one host at birth. Bloodline, celestial alignment, proximity to ancient sites, intense future potential, and cult designs may all play a role—or the Sword may simply be testing possibilities. The infant does not ordinarily display overt corruption; a subtle birthmark often represents the bond.",
  "framework": "The DMG gives a complete framework for using Umbrarians as adversaries, allies, mysteries, and—under careful supervision—player characters. The rules deliberately separate power from surrender: an Umbrarian can awaken extraordinary abilities while resisting the Shard, just as a seemingly uncorrupted host can remain dangerously dormant for years.",
  "stages": [
    {
      "name": "Dormant",
      "text": "The Shard is bound but largely silent. The host may live a full life with only subtle marks, dreams, or unexplained instincts."
    },
    {
      "name": "Awakened",
      "text": "The host becomes aware of the Shard’s voice and can accept Dark Bargains. On first becoming Awakened, choose one Awakened Gift from the Shard’s profile. Shard save DC = 8 + proficiency bonus + chosen mental ability modifier."
    },
    {
      "name": "Ascendant",
      "text": "Deep alignment with the Sword’s will. Choose an Ascendant Gift. Reserved for major campaign turning points; a second Ascendant Gift belongs only in mythic endgames."
    }
  ],
  "gifts": "Resonant Sense (action, 30 ft.): the GM reveals whether a target carries a true Shard, Shard echo, Sword influence, or Guardian ward—once per long rest. Dark Bargain: the host can accept bargains as described in the DMG Corruption chapter. Gift visibility: at higher stages the mark may show through mundane disguises.",
  "umbrariaContext": "Umbraria is the twilight world of Ashbringer, associated with privacy, shelter, and chosen revelation. Its dominant people are the Umbralites (PHB). Ashbringer’s pressure produces Swordborn that burn shelters from within and turn preserved things to aggressive ash; Wardenborn answers restore accountable privacy. Ghostblade traditions and living-shadow techniques are among Umbraria’s distinctive contributions to interworld culture—not the same as bearing a Dark Shard.",
  "pcGuidance": "Player-character Umbrarians require Game Master approval and experienced players prepared for shared narrative responsibility. Power is never free: every Gift and Bargain should cost something the table can feel.",
  "sources": "Player’s Handbook Ch. 5 (Umbralites race, Umbraria culture) · Dungeon Master’s Guide Ch. 3 (Shards, Umbrarians, and Corruption) and related campaign framework."
};
