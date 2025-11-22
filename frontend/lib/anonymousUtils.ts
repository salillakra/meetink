// Cool anonymous names
const ADJECTIVES = [
  "Cosmic", "Velvet", "Neon", "Shadow", "Mystic", "Electric", "Luna", "Phoenix",
  "Stellar", "Crimson", "Azure", "Golden", "Silver", "Midnight", "Dawn", "Ember",
  "Frost", "Thunder", "Whisper", "Echo", "Quantum", "Diamond", "Sapphire", "Ruby",
  "Onyx", "Pearl", "Jade", "Crystal", "Storm", "Blaze", "Spirit", "Dream",
  "Twilight", "Starlight", "Moonlight", "Nebula", "Galaxy", "Comet", "Aurora", "Zenith"
];

const NOUNS = [
  "Wanderer", "Dreamer", "Knight", "Sage", "Rebel", "Ninja", "Phantom", "Rogue",
  "Warrior", "Mage", "Hunter", "Seeker", "Guardian", "Voyager", "Nomad", "Explorer",
  "Artist", "Poet", "Dancer", "Singer", "Writer", "Thinker", "Visionary", "Legend",
  "Hero", "Champion", "Enigma", "Oracle", "Mystic", "Prophet", "Sentinel", "Keeper",
  "Rider", "Pilot", "Captain", "Admiral", "Ranger", "Scout", "Spy", "Agent"
];

export function generateAnonymousName(seed: number): string {
  const adjIndex = seed % ADJECTIVES.length;
  const nounIndex = Math.floor(seed / ADJECTIVES.length) % NOUNS.length;
  return `${ADJECTIVES[adjIndex]} ${NOUNS[nounIndex]}`;
}

export function generateAvatarUrl(gender: string, seed: number): string {
  const genderParam = gender === "female" ? "girl" : "boy";
  return `https://avatar.iran.liara.run/public/${genderParam}?username=${seed}`;
}

export function getRandomGender(): string {
  return Math.random() > 0.5 ? "male" : "female";
}

export function getRandomSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

export function generateAnonymousIdentity(gender: string): { name: string; avatarSeed: number } {
  const seed = getRandomSeed();
  const name = generateAnonymousName(seed);
  return { name, avatarSeed: seed };
}
