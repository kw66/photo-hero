const { chromium } = require("playwright");
const fs = require("fs");

const targetUrl = process.env.PHOTO_HERO_URL || "http://127.0.0.1:3000/";
const screenshotDir = process.env.PHOTO_HERO_QA_OUTPUT || "output";
fs.mkdirSync(screenshotDir, { recursive: true });

async function collectScenario(page, name, action = async () => {}) {
  const errors = [];
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  const url = new URL(targetUrl);
  url.searchParams.set("review", String(Date.now()));
  url.searchParams.set("scenario", name);
  await page.goto(url.toString(), { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await action(page);
  await page.waitForTimeout(250);

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    const state = JSON.parse(window.render_game_to_text());
    const body = document.body;
    const html = document.documentElement;
    const visibleButtons = Array.from(document.querySelectorAll("button"))
      .filter((node) => !node.hidden && node.offsetParent !== null)
      .map((node) => node.textContent.trim().replace(/\s+/g, " "))
      .filter(Boolean);
    return {
      state,
      title: document.title,
      horizontalOverflow: Math.max(body.scrollWidth, html.scrollWidth) - window.innerWidth,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      fullHeight: Math.max(body.scrollHeight, html.scrollHeight),
      hero: rect(".hero-summary"),
      equipmentGrid: rect(".equipment-grid"),
      detail: rect("#equipmentDetail"),
      actions: rect(".floor-action-row"),
      enemyField: rect("#enemyField"),
      visibleButtons,
      detailText: document.querySelector("#equipmentDetail")?.innerText || "",
      enemyText: document.querySelector("#enemyField")?.innerText || "",
    };
  });
  metrics.errors = errors;
  await page.screenshot({ path: `${screenshotDir}/review-${name}.png`, fullPage: true });
  return metrics;
}

function assertScenario(name, metrics) {
  const failures = [];
  if (metrics.errors.length) failures.push(`${name}: console/page errors: ${metrics.errors.join(" | ")}`);
  if (metrics.horizontalOverflow > 0) failures.push(`${name}: horizontal overflow ${metrics.horizontalOverflow}`);
  if (name === "mobile-fresh") {
    if (!metrics.visibleButtons.includes("选择怪物")) failures.push(`${name}: missing disabled 选择怪物 state`);
    if (metrics.visibleButtons.includes("逃跑")) failures.push(`${name}: still shows 逃跑 button`);
    if (/价值范围/.test(metrics.detailText)) failures.push(`${name}: exposes raw value range in empty state`);
  }
  if (name === "mobile-reward") {
    if (!metrics.visibleButtons.includes("选择")) failures.push(`${name}: missing reward confirm button`);
    if (/可切换|点选|点选择确认/.test(metrics.enemyText)) failures.push(`${name}: reward cards still show old footer copy`);
  }
  if (name === "mobile-career") {
    if (!metrics.visibleButtons.includes("生涯总结")) failures.push(`${name}: missing career summary button`);
    if (metrics.equipmentGrid && metrics.equipmentGrid.height > 0) failures.push(`${name}: equipment grid should collapse after clear`);
  }
  if (name === "mobile-boss-selection") {
    if (metrics.visibleButtons.includes("逃跑")) failures.push(`${name}: boss floor still shows 逃跑`);
    if (!metrics.visibleButtons.includes("选择怪物")) failures.push(`${name}: boss floor should require selecting all monsters`);
  }
  return failures;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const desktop = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });

  const scenarios = {};
  scenarios.mobileFresh = await collectScenario(mobile, "mobile-fresh");
  scenarios.desktopFresh = await collectScenario(desktop, "desktop-fresh");

  scenarios.mobileReward = await collectScenario(mobile, "mobile-reward", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.startBossRewardChoice(10));
  });

  scenarios.mobileCareer = await collectScenario(mobile, "mobile-career", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setFloor(40);
      hooks.setEnemies([{
        id: "review-demon",
        testEnemy: true,
        typeKey: "demon",
        typeName: "魔王",
        name: "魔王",
        maxHp: 1,
        hp: 1,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-demon"]);
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).gameClear, null, { timeout: 5000 });
  });

  scenarios.mobileBossSelection = await collectScenario(mobile, "mobile-boss-selection", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.setFloor(30));
  });

  await browser.close();

  const failures = Object.entries(scenarios).flatMap(([key, metrics]) => {
    const name = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    return assertScenario(name, metrics);
  });
  console.log(JSON.stringify({ scenarios, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})();
