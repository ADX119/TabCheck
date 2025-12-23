// Shame level thresholds and their configurations
export const SHAME_LEVELS = {
  HEALTHY: {
    min: 0,
    max: 10,
    label: "Disciplined",
    color: "shame-healthy",
    glowClass: "text-glow-healthy",
    bgGlowClass: "bg-glow-healthy",
  },
  RISKY: {
    min: 11,
    max: 25,
    label: "Getting Risky",
    color: "shame-risky",
    glowClass: "text-glow-risky",
    bgGlowClass: "bg-glow-risky",
  },
  DECLINING: {
    min: 26,
    max: 50,
    label: "Productivity Dying",
    color: "shame-declining",
    glowClass: "text-glow-declining",
    bgGlowClass: "bg-glow-declining",
  },
  CRYING: {
    min: 51,
    max: 100,
    label: "System Crying",
    color: "shame-crying",
    glowClass: "text-glow-crying",
    bgGlowClass: "bg-glow-crying",
  },
  HELP: {
    min: 101,
    max: Infinity,
    label: "You Need Help",
    color: "shame-help",
    glowClass: "text-glow-help",
    bgGlowClass: "bg-glow-help",
  },
} as const;

// Sarcastic messages for each shame level
export const SHAME_MESSAGES: Record<keyof typeof SHAME_LEVELS, string[]> = {
  HEALTHY: [
    "This is acceptable behavior.",
    "Look at you, being a functional adult.",
    "Your RAM is actually breathing.",
    "Minimalism looks good on you.",
    "Marie Kondo would be proud.",
  ],
  RISKY: [
    "One more tab and we need to talk.",
    "You're on thin ice, friend.",
    "I see where this is going...",
    "The hoarding has begun.",
    "Close something. Anything. Please.",
  ],
  DECLINING: [
    "Your browser is sweating.",
    "Each tab is a cry for help.",
    "Productivity has left the chat.",
    "Do you even remember what's in those tabs?",
    "This is not a bookmark manager.",
  ],
  CRYING: [
    "RAM has left the chat.",
    "Your CPU is writing its will.",
    "Close tabs. Please. I'm begging.",
    "This is a personal attack on your computer.",
    "Your browser is contemplating retirement.",
  ],
  HELP: [
    "This is a cry for help wrapped in tabs.",
    "Seek professional assistance.",
    "Your laptop filed a restraining order.",
    "Congratulations, you broke the meter.",
    "At this point, it's performance art.",
  ],
};

// Performance impact estimations (intentionally dramatic)
export const PERFORMANCE_IMPACTS = {
  HEALTHY: {
    memory: "~200-500 MB",
    focusImpact: "Focus remains intact",
    cpuStress: "Minimal",
  },
  RISKY: {
    memory: "~500 MB - 1 GB",
    focusImpact: "Slight cognitive load",
    cpuStress: "Noticeable",
  },
  DECLINING: {
    memory: "~1-2 GB",
    focusImpact: "High cognitive load detected",
    cpuStress: "Your fan is working overtime",
  },
  CRYING: {
    memory: "~2-4 GB",
    focusImpact: "Focus has left the building",
    cpuStress: "Thermal throttling imminent",
  },
  HELP: {
    memory: "4+ GB (honestly, who knows)",
    focusImpact: "What even is focus anymore?",
    cpuStress: "CPU is writing its memoir",
  },
} as const;

// Get shame level based on tab count
export function getShameLevel(tabCount: number): keyof typeof SHAME_LEVELS {
  if (tabCount <= SHAME_LEVELS.HEALTHY.max) return "HEALTHY";
  if (tabCount <= SHAME_LEVELS.RISKY.max) return "RISKY";
  if (tabCount <= SHAME_LEVELS.DECLINING.max) return "DECLINING";
  if (tabCount <= SHAME_LEVELS.CRYING.max) return "CRYING";
  return "HELP";
}

// Get a random message for the current shame level
export function getRandomMessage(level: keyof typeof SHAME_LEVELS): string {
  const messages = SHAME_MESSAGES[level];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Calculate shame percentage (0-100, capped)
export function getShamePercentage(tabCount: number): number {
  // Max out at 100 tabs for the meter, but go beyond for "HELP" level
  const percentage = Math.min((tabCount / 100) * 100, 100);
  return percentage;
}