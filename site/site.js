// Hero: keeps opening tabs until the meter maxes out. Mirrors SHAME_LEVELS in
// src/lib/constants.ts. Without JS the page already shows the final state.
(function () {
  const LEVELS = [
    { max: 10, label: "Sigma Mode 🗿", color: "--l1", roast: "Sigma grindset. Your RAM is mewing." },
    { max: 25, label: "Mid Behavior 😐", color: "--l2", roast: "The brainrot is loading... ▓▓░░░" },
    { max: 50, label: "Lowkey Cooked 🍳", color: "--l3", roast: "Chrome is charging you the Fanum tax on RAM." },
    { max: 100, label: "Skibidi Brainrot 🚽", color: "--l4", roast: "Bombardiro Crocodilo just dropped on your RAM." },
    { max: Infinity, label: "Tung Tung Tung Sahur 🪵", color: "--l5", roast: "Even the brainrot has brainrot." },
  ];
  const TITLES = [
    "how to center a div",
    "Inbox (2,481)",
    "cheap flights to goa",
    "Untitled document",
    "lofi beats to study to",
    "why is my laptop hot",
    "cart (14 items)",
    "React docs: useEffect",
    "Some article I'll totally read",
    "skibidi toilet ep 67",
    "Q3 planning (final) (v2)",
    "recipe: 5 minute pasta",
    "is it normal to have 80 tabs",
    "stack overflow: undefined is not a function",
  ];
  const START = 3;
  const END = 101;
  const DURATION_MS = 4200;

  const root = document.documentElement;
  const tabsEl = document.getElementById("tabs");
  const countEl = document.getElementById("count");
  const levelEl = document.getElementById("level");
  const meterEl = document.getElementById("meter");
  const roastEl = document.getElementById("roast");
  if (!tabsEl || !countEl || !levelEl || !meterEl || !roastEl) return;

  function levelFor(count) {
    return LEVELS.find((l) => count <= l.max);
  }

  function addTab(i) {
    const tab = document.createElement("span");
    tab.className = "tab";
    const fav = document.createElement("span");
    fav.className = "fav f" + (i % 6);
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = TITLES[i % TITLES.length];
    tab.append(fav, title);
    const active = tabsEl.querySelector(".is-active");
    if (active) active.classList.remove("is-active");
    tab.classList.add("is-active");
    tabsEl.append(tab);
  }

  function render(count) {
    while (tabsEl.children.length < count) addTab(tabsEl.children.length);
    const level = levelFor(count);
    countEl.textContent = String(count);
    levelEl.textContent = level.label;
    roastEl.textContent = "“" + level.roast + "”";
    root.style.setProperty("--level", "var(" + level.color + ")");
    meterEl.style.setProperty("--fill", Math.min(count, 100) + "%");
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    render(END);
    return;
  }

  render(START);
  let startedAt = null;
  function frame(now) {
    if (startedAt === null) startedAt = now;
    const t = Math.min((now - startedAt) / DURATION_MS, 1);
    // Starts slow and speeds up, like a real tab problem.
    render(Math.round(START + (END - START) * t * t));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
