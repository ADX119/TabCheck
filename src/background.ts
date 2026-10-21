const THRESHOLDS = [10, 15, 20, 25, 35, 50, 67, 75, 100];
const LAST_NOTIFIED_KEY = "lastNotifiedThreshold";

const THRESHOLD_MESSAGES: Record<number, { title: string; message: string }> = {
  10: { title: "Aura Check", message: "10 tabs. The brainrot has entered the chat." },
  15: { title: "Mid Behavior Detected", message: "15 tabs. It's giving 'I'll read it later'." },
  20: { title: "NPC Arc Loading", message: "20 tabs. Your browser is starting to sweat." },
  25: { title: "Lowkey Cooked", message: "25 tabs?! Do you even remember what's in those?" },
  35: { title: "Fanum Tax Incoming", message: "35 tabs. Chrome is taxing your RAM." },
  50: { title: "Skibidi Alert", message: "50 TABS. Your brain is officially Skibidi." },
  67: { title: "6... 7...", message: "67 tabs. You know exactly what you did." },
  75: { title: "Bombardiro Crocodilo", message: "75 tabs. Your laptop filed a restraining order." },
  100: { title: "Tung Tung Tung Sahur", message: "100+ tabs. He's coming for your RAM." },
};

function highestCrossed(tabCount: number): number {
  return THRESHOLDS.filter((t) => tabCount >= t).pop() ?? 0;
}

// Service workers get killed when idle, so the last notified threshold lives in
// session storage instead of a variable.
async function getLastNotified(): Promise<number | undefined> {
  const data = await chrome.storage.session.get(LAST_NOTIFIED_KEY);
  return data[LAST_NOTIFIED_KEY] as number | undefined;
}

async function checkThresholds() {
  const tabCount = (await chrome.tabs.query({})).length;
  const crossed = highestCrossed(tabCount);
  const lastNotified = await getLastNotified();

  // First run of this browser session: remember the current level without nagging.
  if (lastNotified === undefined || crossed < lastNotified) {
    await chrome.storage.session.set({ [LAST_NOTIFIED_KEY]: crossed });
    return;
  }
  if (crossed > lastNotified) {
    await chrome.storage.session.set({ [LAST_NOTIFIED_KEY]: crossed });
    const { title, message } = THRESHOLD_MESSAGES[crossed];
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: `🧠 ${title}`,
      message: `${message}\n\nCurrent tabs: ${tabCount}`,
      priority: 2,
    });
  }
}

chrome.tabs.onCreated.addListener(() => {
  checkThresholds();
});
chrome.tabs.onRemoved.addListener(() => {
  checkThresholds();
});
chrome.runtime.onStartup.addListener(() => {
  checkThresholds();
});
chrome.runtime.onInstalled.addListener(() => {
  checkThresholds();
});
