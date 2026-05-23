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
      infoText: document.querySelector(".info-panel")?.innerText || "",
      activeInfoTab: document.querySelector("[data-info-tab][aria-selected='true']")?.dataset.infoTab || "",
      statCardCount: document.querySelectorAll(".global-stat").length,
      todayStatCount: Array.from(document.querySelectorAll(".global-stat em")).filter((node) => /^今日 /.test(node.textContent.trim())).length,
      statLabels: Array.from(document.querySelectorAll(".global-stat span")).map((node) => node.textContent.trim()),
      groupQr: (() => {
        const card = document.querySelector(".author-qr-card");
        const group = document.querySelector(".group-qr");
        const links = document.querySelector(".author-links");
        const img = document.querySelector(".group-qr img");
        const rect = img?.getBoundingClientRect();
        const cardRect = card?.getBoundingClientRect();
        const groupRect = group?.getBoundingClientRect();
        const linksRect = links?.getBoundingClientRect();
        return {
          text: group?.innerText.trim() || "",
          loaded: Boolean(img?.complete && img.naturalWidth > 0),
          src: img?.getAttribute("src") || "",
          square: rect ? Math.abs(rect.width - rect.height) < 1 : false,
          rightSide: Boolean(
            cardRect
            && groupRect
            && linksRect
            && groupRect.left >= linksRect.right - 1
            && groupRect.right <= cardRect.right + 1
          ),
        };
      })(),
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
    if (!metrics.visibleButtons.includes("绕过")) failures.push(`${name}: missing non-boss bypass button`);
    if (!/API配置/.test(metrics.detailText)) failures.push(`${name}: empty appraisal panel should prompt API configuration`);
    if (/价值范围/.test(metrics.detailText)) failures.push(`${name}: exposes raw value range in empty state`);
  }
  if (name === "mobile-flee") {
    if (metrics.state.floor !== 2) failures.push(`${name}: bypass should advance to floor 2`);
    if (!metrics.visibleButtons.includes("绕过")) failures.push(`${name}: non-boss floor after bypass should still show bypass`);
  }
  if (name === "mobile-battle-retreat") {
    if (metrics.state.floor !== 1) failures.push(`${name}: retreat should stay on floor 1`);
    if (metrics.state.player.hp !== metrics.state.player.stats.maxHp) failures.push(`${name}: retreat should restore HP to the pre-battle maximum`);
    if (metrics.state.player.shield !== metrics.state.player.stats.shield) failures.push(`${name}: retreat should restore shield to the pre-battle maximum`);
    if (metrics.state.player.filmCount !== 3) failures.push(`${name}: retreat should not keep film rewards`);
    if (metrics.state.currentBattle) failures.push(`${name}: retreat should clear current battle`);
    if (!metrics.visibleButtons.includes("绕过")) failures.push(`${name}: retreat should return to pre-battle bypass state`);
    const damaged = metrics.state.enemies.some((enemy) => enemy.hp !== enemy.maxHp);
    if (damaged) failures.push(`${name}: retreat should restore enemy HP`);
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
  if (name === "mobile-info") {
    if (metrics.activeInfoTab !== "about") failures.push(`${name}: info panel should open on about/stat tab`);
    if (!metrics.visibleButtons.includes("作者/统计")) failures.push(`${name}: missing author/stat tab`);
    if (!metrics.visibleButtons.includes("拍照")) failures.push(`${name}: missing photo tab`);
    if (!metrics.visibleButtons.includes("战斗")) failures.push(`${name}: missing battle tab`);
    if (!/全站统计/.test(metrics.infoText)) failures.push(`${name}: missing global stats title`);
    if (!/作者其他游戏/.test(metrics.infoText)) failures.push(`${name}: missing other games block`);
    for (const label of ["访问", "访客", "游玩", "通关", "击杀", "鉴定", "爬塔层数"]) {
      if (!metrics.statLabels.includes(label)) failures.push(`${name}: missing stat label ${label}`);
    }
    if (!metrics.groupQr.loaded || !metrics.groupQr.src.includes("xiaohongshu-group-qr.jpg")) failures.push(`${name}: Xiaohongshu QR image did not load`);
    if (!metrics.groupQr.square) failures.push(`${name}: Xiaohongshu QR image should be square`);
    if (metrics.groupQr.text !== "加入小红书游戏群") failures.push(`${name}: Xiaohongshu QR copy should be 加入小红书游戏群`);
    if (!metrics.groupQr.rightSide) failures.push(`${name}: Xiaohongshu QR should sit on the right side of author block`);
    if (metrics.statCardCount !== 7) failures.push(`${name}: expected 7 global stat cards, got ${metrics.statCardCount}`);
    if (metrics.todayStatCount !== 7) failures.push(`${name}: expected 7 today stat labels, got ${metrics.todayStatCount}`);
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

  scenarios.mobileFlee = await collectScenario(mobile, "mobile-flee", async (page) => {
    await page.click("#fleeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).floor === 2, null, { timeout: 3000 });
  });

  scenarios.mobileBattleRetreat = await collectScenario(mobile, "mobile-battle-retreat", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setEnemies([{
        id: "review-retreat",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 20,
        hp: 20,
        atk: 6,
        def: 0,
        speed: 2,
        traits: [],
      }]);
      hooks.selectEnemies(["review-retreat"]);
      window.__reviewBattleRetreatBefore = JSON.parse(window.render_game_to_text());
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      const enemy = state.enemies.find((item) => item.id === "review-retreat");
      return Boolean(state.currentBattle) || Boolean(enemy && enemy.hp < enemy.maxHp);
    }, null, { timeout: 3000 });
    await page.click("#fleeBtn");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      const before = window.__reviewBattleRetreatBefore;
      return before
        && !state.currentBattle
        && state.floor === before.floor
        && state.player.hp === before.player.hp
        && state.player.shield === before.player.shield;
    }, null, { timeout: 3000 });
  });

  scenarios.mobileInfo = await collectScenario(mobile, "mobile-info", async (page) => {
    await page.click("#infoToggleBtn");
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
