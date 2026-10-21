// Brainrot levels: the more tabs, the more cooked your brain is.
export const SHAME_LEVELS = {
  HEALTHY: {
    min: 0,
    max: 10,
    label: "Sigma Mode",
    emoji: "🗿",
    color: "shame-healthy",
    glowClass: "text-glow-healthy",
    bgGlowClass: "bg-glow-healthy",
  },
  RISKY: {
    min: 11,
    max: 25,
    label: "Mid Behavior",
    emoji: "😐",
    color: "shame-risky",
    glowClass: "text-glow-risky",
    bgGlowClass: "bg-glow-risky",
  },
  DECLINING: {
    min: 26,
    max: 50,
    label: "Lowkey Cooked",
    emoji: "🍳",
    color: "shame-declining",
    glowClass: "text-glow-declining",
    bgGlowClass: "bg-glow-declining",
  },
  CRYING: {
    min: 51,
    max: 100,
    label: "Skibidi Brainrot",
    emoji: "🚽",
    color: "shame-crying",
    glowClass: "text-glow-crying",
    bgGlowClass: "bg-glow-crying",
  },
  HELP: {
    min: 101,
    max: Infinity,
    label: "Tung Tung Tung Sahur",
    emoji: "🪵",
    color: "shame-help",
    glowClass: "text-glow-help",
    bgGlowClass: "bg-glow-help",
  },
} as const;

export type ShameLevel = keyof typeof SHAME_LEVELS;

// Roasts for each brainrot level
export const SHAME_MESSAGES: Record<ShameLevel, string[]> = {
  HEALTHY: [
    "Sigma grindset. Your RAM is mewing.",
    "+1000 aura. Locked in fr fr.",
    "Main character energy. The browser respects you.",
    "Certified clean. Not a single brain cell rotted.",
    "Lowkey suspicious. Nobody is this locked in.",
    "Your tabs are giving 'has a 5am routine'.",
    "Marie Kondo just followed you.",
    "Did you just... close tabs? Voluntarily? W.",
  ],
  RISKY: [
    "It's giving 'I'll read it later'. You won't.",
    "Mid. Painfully mid.",
    "Your aura is leaking, bestie.",
    "The brainrot is loading... ▓▓░░░",
    "One more tab and you're officially an NPC.",
    "Delulu if you think you'll get back to these.",
    "This is how Ohio starts.",
    "Your browser just let out a tiny sigh. I heard it.",
    "Not cooked yet, but the oven is preheating.",
  ],
  DECLINING: [
    "You're cooked. Well done. Extra crispy.",
    "Chrome is charging you the Fanum tax on RAM.",
    "Each tab is a little Labubu of regret.",
    "Bro thinks the tab bar is a bookmark manager.",
    "No cap, half of these are duplicates.",
    "Your attention span left on read.",
    "Productivity said 'it's not you, it's your tabs'.",
    "Rizz: 0. Tabs: too many.",
    "This is lowkey an Ohio-level browser.",
    "Your laptop fan is doing a TikTok dance rn.",
  ],
  CRYING: [
    "Skibidi tabs. Your brain is fully rotted.",
    "Bombardiro Crocodilo just dropped on your RAM.",
    "Tralalero Tralala, your CPU is gone.",
    "-9999 aura. Unrecoverable.",
    "Bro is speedrunning a thermal shutdown.",
    "Only in Ohio do people have this many tabs.",
    "Your browser is giving 'Windows XP in 2026'.",
    "Your tabs need their own zip code.",
    "This isn't multitasking, it's brainrot farming.",
    "Plot twist: none of those tabs are important.",
  ],
  HELP: [
    "Tung Tung Tung Sahur is coming for your tabs.",
    "Brr Brr Patapim. Your laptop has left the chat.",
    "Chimpanzini Bananini levels of unwell.",
    "Ballerina Cappuccina couldn't dance through this many tabs.",
    "You don't have tabs. You have a lore.",
    "Your RAM filed for emotional damages.",
    "Even the brainrot has brainrot.",
    "Negative aura so big it has its own gravity.",
    "This is a cry for help in 100+ tabs.",
    "Ok so 6... 7... 100+ tabs?? 💀",
    "Your search history is a horror movie now.",
  ],
};

// Performance impact estimations (intentionally dramatic)
export const PERFORMANCE_IMPACTS: Record<
  ShameLevel,
  { memory: string; brainCells: string; cpuStress: string }
> = {
  HEALTHY: {
    memory: "~200-500 MB",
    brainCells: "All of them. Built different.",
    cpuStress: "Chillin'",
  },
  RISKY: {
    memory: "~500 MB - 1 GB",
    brainCells: "A few started doom-scrolling",
    cpuStress: "Mildly sus",
  },
  DECLINING: {
    memory: "~1-2 GB",
    brainCells: "Half are watching Skibidi Toilet",
    cpuStress: "Fan is giving jet engine",
  },
  CRYING: {
    memory: "~2-4 GB",
    brainCells: "Rotted. Gone. Reduced to atoms.",
    cpuStress: "Thermal throttling, no cap",
  },
  HELP: {
    memory: "4+ GB (honestly, who knows)",
    brainCells: "Tralalero Tralala",
    cpuStress: "CPU is writing its memoir",
  },
};

// Get brainrot level based on tab count
export function getShameLevel(tabCount: number): ShameLevel {
  if (tabCount <= SHAME_LEVELS.HEALTHY.max) return "HEALTHY";
  if (tabCount <= SHAME_LEVELS.RISKY.max) return "RISKY";
  if (tabCount <= SHAME_LEVELS.DECLINING.max) return "DECLINING";
  if (tabCount <= SHAME_LEVELS.CRYING.max) return "CRYING";
  return "HELP";
}

// Get a random message for the current brainrot level
export function getRandomMessage(level: ShameLevel): string {
  const messages = SHAME_MESSAGES[level];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Calculate brainrot percentage (0-100, capped)
export function getShamePercentage(tabCount: number): number {
  return Math.min(tabCount, 100);
}

// Aura points: positive under 10 tabs, deeply negative after that.
export function getAura(tabCount: number): number {
  return (10 - tabCount) * 100;
}

export function formatAura(aura: number): string {
  return `${aura > 0 ? "+" : ""}${aura.toLocaleString()} aura`;
}
