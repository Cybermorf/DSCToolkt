/** Curated 5e spell catalog — concise mechanical summaries for table use.
 *  Official full text lives in the published rulebooks (PHB and later).
 */
window.SPELLS = [
  {
    "id": "acid-splash",
    "name": "Acid Splash",
    "level": 0,
    "school": "Conjuration",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Dex save or 1d6 acid (scales). One or two targets within 5 ft of each other.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "blade-ward",
    "name": "Blade Ward",
    "level": 0,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Self",
    "components": "V, S",
    "duration": "1 round",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Resistance to bludgeoning, piercing, and slashing from weapon attacks until end of next turn.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "booming-blade",
    "name": "Booming Blade",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "Self (5-foot radius)",
    "components": "S, M",
    "duration": "1 round",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Melee weapon attack; if target moves willingly before your next turn, it takes thunder damage.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "chill-touch",
    "name": "Chill Touch",
    "level": 0,
    "school": "Necromancy",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "1 round",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Ranged spell attack, necrotic damage; target can't regain HP until your next turn.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "dancing-lights",
    "name": "Dancing Lights",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Up to four lights you can move as a bonus action.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "druidcraft",
    "name": "Druidcraft",
    "level": 0,
    "school": "Transmutation",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Druid"
    ],
    "summary": "Minor nature effects: weather sense, bloom, sensory effect, or light/snuff a flame.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "eldritch-blast",
    "name": "Eldritch Blast",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Warlock"
    ],
    "summary": "Ranged spell attack, 1d10 force; extra beams at 5th, 11th, 17th.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "fire-bolt",
    "name": "Fire Bolt",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Ranged spell attack, 1d10 fire; ignites flammables. Scales with level.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "friends",
    "name": "Friends",
    "level": 0,
    "school": "Enchantment",
    "time": "1 action",
    "range": "Self",
    "components": "S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Advantage on Charisma checks vs one non-hostile creature; becomes hostile when spell ends.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "guidance",
    "name": "Guidance",
    "level": 0,
    "school": "Divination",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Cleric",
      "Druid"
    ],
    "summary": "Target adds 1d4 to one ability check before the spell ends.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "light",
    "name": "Light",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, M",
    "duration": "1 hour",
    "classes": [
      "Bard",
      "Cleric",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Object sheds bright light 20 ft / dim 20 ft.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "mage-hand",
    "name": "Mage Hand",
    "level": 0,
    "school": "Conjuration",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S",
    "duration": "1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Spectral hand manipulates objects (up to 10 lb); can't attack.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "mending",
    "name": "Mending",
    "level": 0,
    "school": "Transmutation",
    "time": "1 minute",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Repair a single break or tear no larger than 1 foot.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "message",
    "name": "Message",
    "level": 0,
    "school": "Transmutation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S, M",
    "duration": "1 round",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Whisper a message only the target hears; it can reply.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "minor-illusion",
    "name": "Minor Illusion",
    "level": 0,
    "school": "Illusion",
    "time": "1 action",
    "range": "30 feet",
    "components": "S, M",
    "duration": "1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Create a sound or still image of an object (5-ft cube).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "poison-spray",
    "name": "Poison Spray",
    "level": 0,
    "school": "Conjuration",
    "time": "1 action",
    "range": "10 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Druid",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Con save or 1d12 poison damage (scales).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "prestidigitation",
    "name": "Prestidigitation",
    "level": 0,
    "school": "Transmutation",
    "time": "1 action",
    "range": "10 feet",
    "components": "V, S",
    "duration": "Up to 1 hour",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Minor tricks: sensory effects, clean/soil, warm/chill, flavor, small marks.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "produce-flame",
    "name": "Produce Flame",
    "level": 0,
    "school": "Conjuration",
    "time": "1 action",
    "range": "Self",
    "components": "V, S",
    "duration": "10 minutes",
    "classes": [
      "Druid"
    ],
    "summary": "Flame sheds light; can hurl as ranged spell attack for fire damage.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "ray-of-frost",
    "name": "Ray of Frost",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Ranged spell attack, cold damage; target's speed −10 ft until your next turn.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "resistance",
    "name": "Resistance",
    "level": 0,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Cleric",
      "Druid"
    ],
    "summary": "Target may add 1d4 to one save before the spell ends.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "sacred-flame",
    "name": "Sacred Flame",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Cleric",
      "Moon Guardian"
    ],
    "summary": "Dex save or radiant damage; cover doesn't help. Scales.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "shillelagh",
    "name": "Shillelagh",
    "level": 0,
    "school": "Transmutation",
    "time": "1 bonus action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "1 minute",
    "classes": [
      "Druid"
    ],
    "summary": "Club/quarterstaff deals 1d8 and uses your spellcasting ability.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "shocking-grasp",
    "name": "Shocking Grasp",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Melee spell attack (adv. vs metal armor); lightning damage; no reactions until next turn.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "spare-the-dying",
    "name": "Spare the Dying",
    "level": 0,
    "school": "Necromancy",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Cleric"
    ],
    "summary": "Stabilize a creature at 0 HP.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "thaumaturgy",
    "name": "Thaumaturgy",
    "level": 0,
    "school": "Transmutation",
    "time": "1 action",
    "range": "30 feet",
    "components": "V",
    "duration": "Up to 1 minute",
    "classes": [
      "Cleric"
    ],
    "summary": "Minor divine effects: booming voice, tremors, flames flare, eyes change.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "thorn-whip",
    "name": "Thorn Whip",
    "level": 0,
    "school": "Transmutation",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Druid"
    ],
    "summary": "Melee spell attack, piercing damage; pull Large or smaller target up to 10 ft.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "thunderclap",
    "name": "Thunderclap",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "Self (5-foot radius)",
    "components": "S",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Druid",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Con save or thunder damage for creatures within 5 ft.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "true-strike",
    "name": "True Strike",
    "level": 0,
    "school": "Divination",
    "time": "1 action",
    "range": "30 feet",
    "components": "S",
    "duration": "Concentration, up to 1 round",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Advantage on your first attack against the target on your next turn.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "vicious-mockery",
    "name": "Vicious Mockery",
    "level": 0,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard"
    ],
    "summary": "Wis save or psychic damage and disadvantage on next attack.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "word-of-radiance",
    "name": "Word of Radiance",
    "level": 0,
    "school": "Evocation",
    "time": "1 action",
    "range": "5 feet",
    "components": "V, M",
    "duration": "Instantaneous",
    "classes": [
      "Cleric"
    ],
    "summary": "Chosen creatures within 5 ft make Con saves or take radiant damage.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "alarm",
    "name": "Alarm",
    "level": 1,
    "school": "Abjuration",
    "time": "1 minute",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "8 hours",
    "classes": [
      "Ranger",
      "Wizard"
    ],
    "summary": "Ward a 20-ft cube; alert when entered.",
    "ritual": true,
    "concentration": false
  },
  {
    "id": "bane",
    "name": "Bane",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Cleric"
    ],
    "summary": "Up to 3 creatures subtract 1d4 from attacks and saves.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "bless",
    "name": "Bless",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Cleric",
      "Paladin",
      "Moon Guardian"
    ],
    "summary": "Up to 3 creatures add 1d4 to attacks and saves.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "burning-hands",
    "name": "Burning Hands",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "Self (15-foot cone)",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Dex save or 3d6 fire in a 15-ft cone.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "charm-person",
    "name": "Charm Person",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S",
    "duration": "1 hour",
    "classes": [
      "Bard",
      "Druid",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Humanoid Wis save or charmed for 1 hour.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "chromatic-orb",
    "name": "Chromatic Orb",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "90 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Ranged spell attack, 3d8 damage of a chosen energy type.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "command",
    "name": "Command",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V",
    "duration": "1 round",
    "classes": [
      "Cleric",
      "Paladin"
    ],
    "summary": "One-word command; Wis save or obey on next turn.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "comprehend-languages",
    "name": "Comprehend Languages",
    "level": 1,
    "school": "Divination",
    "time": "1 action",
    "range": "Self",
    "components": "V, S, M",
    "duration": "1 hour",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Understand spoken and written language.",
    "ritual": true,
    "concentration": false
  },
  {
    "id": "cure-wounds",
    "name": "Cure Wounds",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Paladin",
      "Ranger",
      "Moon Guardian"
    ],
    "summary": "Heal 1d8 + modifier HP.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "detect-magic",
    "name": "Detect Magic",
    "level": 1,
    "school": "Divination",
    "time": "1 action",
    "range": "Self",
    "components": "V, S",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Paladin",
      "Ranger",
      "Sorcerer",
      "Wizard",
      "Moon Guardian"
    ],
    "summary": "Sense magic within 30 ft.",
    "ritual": true,
    "concentration": true
  },
  {
    "id": "disguise-self",
    "name": "Disguise Self",
    "level": 1,
    "school": "Illusion",
    "time": "1 action",
    "range": "Self",
    "components": "V, S",
    "duration": "1 hour",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Change appearance; Investigation may see through it.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "dissonant-whispers",
    "name": "Dissonant Whispers",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard"
    ],
    "summary": "Wis save or psychic damage and move away.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "divine-favor",
    "name": "Divine Favor",
    "level": 1,
    "school": "Evocation",
    "time": "1 bonus action",
    "range": "Self",
    "components": "V, S",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Paladin"
    ],
    "summary": "Weapon attacks deal +1d4 radiant.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "entangle",
    "name": "Entangle",
    "level": 1,
    "school": "Conjuration",
    "time": "1 action",
    "range": "90 feet",
    "components": "V, S",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Druid"
    ],
    "summary": "20-ft square; Str save or restrained.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "expeditious-retreat",
    "name": "Expeditious Retreat",
    "level": 1,
    "school": "Transmutation",
    "time": "1 bonus action",
    "range": "Self",
    "components": "V, S",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Dash as a bonus action.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "faerie-fire",
    "name": "Faerie Fire",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Druid",
      "Moon Guardian"
    ],
    "summary": "Outline targets; attacks have advantage; reveals invisible.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "false-life",
    "name": "False Life",
    "level": 1,
    "school": "Necromancy",
    "time": "1 action",
    "range": "Self",
    "components": "V, S, M",
    "duration": "1 hour",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Gain 1d4+4 temporary HP.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "feather-fall",
    "name": "Feather Fall",
    "level": 1,
    "school": "Transmutation",
    "time": "1 reaction",
    "range": "60 feet",
    "components": "V, M",
    "duration": "1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Slow fall for up to 5 creatures; no fall damage if landing in time.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "find-familiar",
    "name": "Find Familiar",
    "level": 1,
    "school": "Conjuration",
    "time": "1 hour",
    "range": "10 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Wizard"
    ],
    "summary": "Summon a familiar spirit in animal form (ritual).",
    "ritual": true,
    "concentration": false
  },
  {
    "id": "fog-cloud",
    "name": "Fog Cloud",
    "level": 1,
    "school": "Conjuration",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Druid",
      "Ranger",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "20-ft radius heavily obscured fog.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "goodberry",
    "name": "Goodberry",
    "level": 1,
    "school": "Transmutation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Druid",
      "Ranger"
    ],
    "summary": "10 berries; each heals 1 HP and feeds for a day.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "guiding-bolt",
    "name": "Guiding Bolt",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "1 round",
    "classes": [
      "Cleric",
      "Moon Guardian"
    ],
    "summary": "Ranged spell attack 4d6 radiant; next attack has advantage.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "healing-word",
    "name": "Healing Word",
    "level": 1,
    "school": "Evocation",
    "time": "1 bonus action",
    "range": "60 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Moon Guardian"
    ],
    "summary": "Heal 1d4 + modifier at range.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "hellish-rebuke",
    "name": "Hellish Rebuke",
    "level": 1,
    "school": "Evocation",
    "time": "1 reaction",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Warlock"
    ],
    "summary": "When damaged: Dex save or 2d10 fire (half on success).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "heroism",
    "name": "Heroism",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Paladin"
    ],
    "summary": "Immune to frightened; temp HP each turn equal to modifier.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "hex",
    "name": "Hex",
    "level": 1,
    "school": "Enchantment",
    "time": "1 bonus action",
    "range": "90 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Warlock"
    ],
    "summary": "Extra necrotic on your hits; disadvantage on one ability's checks.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "hunters-mark",
    "name": "Hunter's Mark",
    "level": 1,
    "school": "Divination",
    "time": "1 bonus action",
    "range": "90 feet",
    "components": "V",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Ranger"
    ],
    "summary": "Extra weapon damage to marked target; advantage to track it.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "ice-knife",
    "name": "Ice Knife",
    "level": 1,
    "school": "Conjuration",
    "time": "1 action",
    "range": "60 feet",
    "components": "S, M",
    "duration": "Instantaneous",
    "classes": [
      "Druid",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Ranged attack then cold burst around target.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "identify",
    "name": "Identify",
    "level": 1,
    "school": "Divination",
    "time": "1 minute",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Wizard"
    ],
    "summary": "Learn magic item properties or a spell affecting a target.",
    "ritual": true,
    "concentration": false
  },
  {
    "id": "inflict-wounds",
    "name": "Inflict Wounds",
    "level": 1,
    "school": "Necromancy",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Cleric"
    ],
    "summary": "Melee spell attack, 3d10 necrotic.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "jump",
    "name": "Jump",
    "level": 1,
    "school": "Transmutation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "1 minute",
    "classes": [
      "Druid",
      "Ranger",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Jump distance tripled.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "longstrider",
    "name": "Longstrider",
    "level": 1,
    "school": "Transmutation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "1 hour",
    "classes": [
      "Bard",
      "Druid",
      "Ranger",
      "Wizard"
    ],
    "summary": "Speed +10 ft.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "mage-armor",
    "name": "Mage Armor",
    "level": 1,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "8 hours",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Base AC 13 + Dex while unarmored.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "magic-missile",
    "name": "Magic Missile",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Three auto-hit darts, 1d4+1 force each.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "protection-from-evil-and-good",
    "name": "Protection from Evil and Good",
    "level": 1,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Cleric",
      "Paladin",
      "Warlock",
      "Wizard"
    ],
    "summary": "Protection vs aberrations, celestials, elementals, fey, fiends, undead.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "sanctuary",
    "name": "Sanctuary",
    "level": 1,
    "school": "Abjuration",
    "time": "1 bonus action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "1 minute",
    "classes": [
      "Cleric"
    ],
    "summary": "Attackers must Wis save to target the warded creature.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "shield",
    "name": "Shield",
    "level": 1,
    "school": "Abjuration",
    "time": "1 reaction",
    "range": "Self",
    "components": "V, S",
    "duration": "1 round",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "+5 AC until start of next turn; blocks Magic Missile.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "shield-of-faith",
    "name": "Shield of Faith",
    "level": 1,
    "school": "Abjuration",
    "time": "1 bonus action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Cleric",
      "Paladin",
      "Moon Guardian"
    ],
    "summary": "+2 AC.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "silent-image",
    "name": "Silent Image",
    "level": 1,
    "school": "Illusion",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Image in a 15-ft cube.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "sleep",
    "name": "Sleep",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "90 feet",
    "components": "V, S, M",
    "duration": "1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Unconscious in ascending HP order (5d8 pool).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "speak-with-animals",
    "name": "Speak with Animals",
    "level": 1,
    "school": "Divination",
    "time": "1 action",
    "range": "Self",
    "components": "V, S",
    "duration": "10 minutes",
    "classes": [
      "Bard",
      "Druid",
      "Ranger"
    ],
    "summary": "Talk with beasts.",
    "ritual": true,
    "concentration": false
  },
  {
    "id": "tashas-hideous-laughter",
    "name": "Tasha's Hideous Laughter",
    "level": 1,
    "school": "Enchantment",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Wizard"
    ],
    "summary": "Wis save or prone and incapacitated with laughter.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "thunderwave",
    "name": "Thunderwave",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "Self (15-foot cube)",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Druid",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Con save or thunder damage and push 10 ft.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "witch-bolt",
    "name": "Witch Bolt",
    "level": 1,
    "school": "Evocation",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Ranged attack then sustained lightning damage.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "aid",
    "name": "Aid",
    "level": 2,
    "school": "Abjuration",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "8 hours",
    "classes": [
      "Bard",
      "Cleric",
      "Paladin"
    ],
    "summary": "Up to 3 creatures gain +5 current/max HP.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "blur",
    "name": "Blur",
    "level": 2,
    "school": "Illusion",
    "time": "1 action",
    "range": "Self",
    "components": "V",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Attacks against you have disadvantage.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "darkness",
    "name": "Darkness",
    "level": 2,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "15-ft radius magical darkness.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "hold-person",
    "name": "Hold Person",
    "level": 2,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Humanoid Wis save or paralyzed.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "invisibility",
    "name": "Invisibility",
    "level": 2,
    "school": "Illusion",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Invisible until you attack or cast.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "lesser-restoration",
    "name": "Lesser Restoration",
    "level": 2,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Paladin",
      "Ranger",
      "Moon Guardian"
    ],
    "summary": "End one disease or condition (blinded, deafened, paralyzed, poisoned).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "misty-step",
    "name": "Misty Step",
    "level": 2,
    "school": "Conjuration",
    "time": "1 bonus action",
    "range": "Self",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Teleport 30 ft to a seen space.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "moonbeam",
    "name": "Moonbeam",
    "level": 2,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Druid",
      "Moon Guardian"
    ],
    "summary": "Cylinder of light; Con save or radiant damage.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "pass-without-trace",
    "name": "Pass without Trace",
    "level": 2,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Self",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Druid",
      "Ranger"
    ],
    "summary": "+10 Stealth to you and allies within 30 ft.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "scorching-ray",
    "name": "Scorching Ray",
    "level": 2,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Three rays, 2d6 fire each.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "shatter",
    "name": "Shatter",
    "level": 2,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "10-ft radius thunder damage; Con save.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "silence",
    "name": "Silence",
    "level": 2,
    "school": "Illusion",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Bard",
      "Cleric",
      "Ranger"
    ],
    "summary": "20-ft radius: no sound, no verbal components.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "spiritual-weapon",
    "name": "Spiritual Weapon",
    "level": 2,
    "school": "Evocation",
    "time": "1 bonus action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "1 minute",
    "classes": [
      "Cleric"
    ],
    "summary": "Bonus-action force attacks, 1d8 + modifier.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "suggestion",
    "name": "Suggestion",
    "level": 2,
    "school": "Enchantment",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, M",
    "duration": "Concentration, up to 8 hours",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Wis save or pursue a reasonable suggestion.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "web",
    "name": "Web",
    "level": 2,
    "school": "Conjuration",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "20-ft cube of webs; Str save or restrained.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "counterspell",
    "name": "Counterspell",
    "level": 3,
    "school": "Abjuration",
    "time": "1 reaction",
    "range": "60 feet",
    "components": "S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Interrupt a spell of 3rd level or lower (check for higher).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "dispel-magic",
    "name": "Dispel Magic",
    "level": 3,
    "school": "Abjuration",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Paladin",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "End spells on a target; check for 4th+.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "fireball",
    "name": "Fireball",
    "level": 3,
    "school": "Evocation",
    "time": "1 action",
    "range": "150 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "20-ft radius, 8d6 fire, Dex save for half.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "fly",
    "name": "Fly",
    "level": 3,
    "school": "Transmutation",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Fly speed 60 ft.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "haste",
    "name": "Haste",
    "level": 3,
    "school": "Transmutation",
    "time": "1 action",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Extra action, +2 AC, double speed, adv. on Dex saves.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "hypnotic-pattern",
    "name": "Hypnotic Pattern",
    "level": 3,
    "school": "Illusion",
    "time": "1 action",
    "range": "120 feet",
    "components": "S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "30-ft cube; Wis save or charmed and incapacitated.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "lightning-bolt",
    "name": "Lightning Bolt",
    "level": 3,
    "school": "Evocation",
    "time": "1 action",
    "range": "Self (100-foot line)",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "100-ft line, 8d6 lightning, Dex save.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "mass-healing-word",
    "name": "Mass Healing Word",
    "level": 3,
    "school": "Evocation",
    "time": "1 bonus action",
    "range": "60 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric"
    ],
    "summary": "Up to six creatures heal 1d4 + modifier.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "revivify",
    "name": "Revivify",
    "level": 3,
    "school": "Necromancy",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Cleric",
      "Paladin",
      "Druid",
      "Ranger"
    ],
    "summary": "Return a creature dead ≤1 minute to 1 HP (300 gp diamonds).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "spirit-guardians",
    "name": "Spirit Guardians",
    "level": 3,
    "school": "Conjuration",
    "time": "1 action",
    "range": "Self (15-foot radius)",
    "components": "V, S, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Cleric",
      "Moon Guardian"
    ],
    "summary": "Enemies in 15 ft: reduced speed and radiant/necrotic damage.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "banishment",
    "name": "Banishment",
    "level": 4,
    "school": "Abjuration",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Cleric",
      "Paladin",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Cha save or banish; may be permanent for extraplanar.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "dimension-door",
    "name": "Dimension Door",
    "level": 4,
    "school": "Conjuration",
    "time": "1 action",
    "range": "500 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Teleport yourself and one ally up to 500 ft.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "greater-invisibility",
    "name": "Greater Invisibility",
    "level": 4,
    "school": "Illusion",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Stay invisible even when attacking.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "polymorph",
    "name": "Polymorph",
    "level": 4,
    "school": "Transmutation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Bard",
      "Druid",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Wis save or turn into a beast (see full rules).",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "wall-of-fire",
    "name": "Wall of Fire",
    "level": 4,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Druid",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Wall deals fire damage to those nearby or passing through.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "cone-of-cold",
    "name": "Cone of Cold",
    "level": 5,
    "school": "Evocation",
    "time": "1 action",
    "range": "Self (60-foot cone)",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "60-ft cone, 8d8 cold, Con save.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "greater-restoration",
    "name": "Greater Restoration",
    "level": 5,
    "school": "Abjuration",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid",
      "Moon Guardian"
    ],
    "summary": "End a major debilitating effect (charm, petrify, curse, etc.).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "hold-monster",
    "name": "Hold Monster",
    "level": 5,
    "school": "Enchantment",
    "time": "1 action",
    "range": "90 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 1 minute",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Any creature Wis save or paralyzed.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "mass-cure-wounds",
    "name": "Mass Cure Wounds",
    "level": 5,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Druid"
    ],
    "summary": "Up to six creatures heal 3d8 + modifier.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "raise-dead",
    "name": "Raise Dead",
    "level": 5,
    "school": "Necromancy",
    "time": "1 hour",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric",
      "Paladin"
    ],
    "summary": "Return a creature dead ≤10 days (500 gp diamond).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "wall-of-force",
    "name": "Wall of Force",
    "level": 5,
    "school": "Evocation",
    "time": "1 action",
    "range": "120 feet",
    "components": "V, S, M",
    "duration": "Concentration, up to 10 minutes",
    "classes": [
      "Wizard"
    ],
    "summary": "Invisible force wall blocks passage.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "chain-lightning",
    "name": "Chain Lightning",
    "level": 6,
    "school": "Evocation",
    "time": "1 action",
    "range": "150 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Lightning jumps to multiple targets.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "disintegrate",
    "name": "Disintegrate",
    "level": 6,
    "school": "Transmutation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Dex save or massive force damage; dust at 0 HP.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "heal",
    "name": "Heal",
    "level": 6,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Cleric",
      "Druid"
    ],
    "summary": "Restore 70 HP; end blindness, deafness, diseases.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "heroes-feast",
    "name": "Heroes' Feast",
    "level": 6,
    "school": "Conjuration",
    "time": "10 minutes",
    "range": "30 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Cleric",
      "Druid"
    ],
    "summary": "Feast grants long-lasting immunities and HP benefits.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "true-seeing",
    "name": "True Seeing",
    "level": 6,
    "school": "Divination",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "1 hour",
    "classes": [
      "Bard",
      "Cleric",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "See through illusions and into the Ethereal Plane (120 ft).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "finger-of-death",
    "name": "Finger of Death",
    "level": 7,
    "school": "Necromancy",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Con save or massive necrotic; humanoid may rise as zombie.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "plane-shift",
    "name": "Plane Shift",
    "level": 7,
    "school": "Conjuration",
    "time": "1 action",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Cleric",
      "Druid",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Travel to another plane or attempt to banish one creature.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "resurrection",
    "name": "Resurrection",
    "level": 7,
    "school": "Necromancy",
    "time": "1 hour",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Cleric"
    ],
    "summary": "Return a creature dead ≤100 years (not of old age).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "teleport",
    "name": "Teleport",
    "level": 7,
    "school": "Conjuration",
    "time": "1 action",
    "range": "10 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Teleport group to a described destination (accuracy varies).",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "dominate-monster",
    "name": "Dominate Monster",
    "level": 8,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Concentration, up to 1 hour",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "Wis save or controlled; damage grants a new save.",
    "ritual": false,
    "concentration": true
  },
  {
    "id": "power-word-stun",
    "name": "Power Word Stun",
    "level": 8,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "If ≤150 HP, stunned until Con save succeeds.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "sunburst",
    "name": "Sunburst",
    "level": 8,
    "school": "Evocation",
    "time": "1 action",
    "range": "150 feet",
    "components": "V, S, M",
    "duration": "Instantaneous",
    "classes": [
      "Druid",
      "Sorcerer",
      "Wizard"
    ],
    "summary": "60-ft radius radiant burst; Con save or damage and blinded.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "foresight",
    "name": "Foresight",
    "level": 9,
    "school": "Divination",
    "time": "1 minute",
    "range": "Touch",
    "components": "V, S, M",
    "duration": "8 hours",
    "classes": [
      "Bard",
      "Druid",
      "Warlock",
      "Wizard"
    ],
    "summary": "Can't be surprised; adv. on attacks/checks/saves; attacks vs you at disadv.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "mass-heal",
    "name": "Mass Heal",
    "level": 9,
    "school": "Evocation",
    "time": "1 action",
    "range": "60 feet",
    "components": "V, S",
    "duration": "Instantaneous",
    "classes": [
      "Cleric"
    ],
    "summary": "Distribute up to 700 HP of healing.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "power-word-kill",
    "name": "Power Word Kill",
    "level": 9,
    "school": "Enchantment",
    "time": "1 action",
    "range": "60 feet",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Bard",
      "Sorcerer",
      "Warlock",
      "Wizard"
    ],
    "summary": "If ≤100 HP, the target dies.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "time-stop",
    "name": "Time Stop",
    "level": 9,
    "school": "Transmutation",
    "time": "1 action",
    "range": "Self",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "1d4+1 turns while time stops for others.",
    "ritual": false,
    "concentration": false
  },
  {
    "id": "wish",
    "name": "Wish",
    "level": 9,
    "school": "Conjuration",
    "time": "1 action",
    "range": "Self",
    "components": "V",
    "duration": "Instantaneous",
    "classes": [
      "Sorcerer",
      "Wizard"
    ],
    "summary": "Duplicate any ≤8th-level spell or attempt a greater effect with risk.",
    "ritual": false,
    "concentration": false
  }
];
