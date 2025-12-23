// Tab threshold warnings
const THRESHOLDS = [10, 15, 20, 25, 35, 50, 75, 100];
let lastNotifiedThreshold = 0;

// Shame messages for notifications
const THRESHOLD_MESSAGES = {
  10: { title: "Getting Risky", message: "10 tabs? The hoarding has begun..." },
  15: { title: "Warning", message: "15 tabs open. Close something. Anything. Please." },
  20: { title: "Productivity Alert", message: "20 tabs! Your browser is starting to sweat." },
  25: { title: "Intervention Needed", message: "25 tabs?! Do you even remember what's in those?" },
  35: { title: "System Stress", message: "35 tabs! Your RAM is writing its will." },
  50: { title: "Critical Mass", message: "50 TABS! This is a personal attack on your computer." },
  75: { title: "Seeking Help?", message: "75 tabs. Your laptop filed a restraining order." },
  100: { title: "Beyond Help", message: "100+ tabs. Congratulations, you broke the meter." }
};

function checkThresholds(tabCount) {
  // Find the highest threshold crossed
  let crossedThreshold = 0;
  for (const threshold of THRESHOLDS) {
    if (tabCount >= threshold) {
      crossedThreshold = threshold;
    }
  }

  // Only notify if we crossed a NEW threshold
  if (crossedThreshold > lastNotifiedThreshold) {
    lastNotifiedThreshold = crossedThreshold;
    showNotification(crossedThreshold, tabCount);
  }
  
  // Reset if tabs go back down below all thresholds
  if (tabCount < THRESHOLDS[0]) {
    lastNotifiedThreshold = 0;
  }
}

function showNotification(threshold, tabCount) {
  const messageData = THRESHOLD_MESSAGES[threshold];
  if (!messageData) return;

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: `🔥 ${messageData.title}`,
    message: `${messageData.message}\n\nCurrent tabs: ${tabCount}`,
    priority: 2
  });
}

// Listen for tab changes
chrome.tabs.onCreated.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    checkThresholds(tabs.length);
  });
});

chrome.tabs.onRemoved.addListener(() => {
  setTimeout(() => {
    chrome.tabs.query({}, (tabs) => {
      checkThresholds(tabs.length);
    });
  }, 100);
});

// Initial check on extension load
chrome.tabs.query({}, (tabs) => {
  // Set initial threshold without notifying
  for (const threshold of THRESHOLDS) {
    if (tabs.length >= threshold) {
      lastNotifiedThreshold = threshold;
    }
  }
});
