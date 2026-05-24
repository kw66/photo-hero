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
      formEconomy: window.__reviewFormEconomy || null,
      mobileSaveFallback: window.__reviewMobileSaveFallback || null,
      monsterDistribution: window.__reviewMonsterDistribution || null,
      bossFilmDrops: window.__reviewBossFilmDrops || null,
      cropAppraisal: window.__reviewCropAppraisal || null,
      groupSpecials: window.__reviewGroupSpecials || null,
      linkedTraits: window.__reviewLinkedTraits || null,
      panelToggle: window.__reviewPanelToggle || null,
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
    if (!metrics.equipmentGrid || metrics.equipmentGrid.height <= 0) failures.push(`${name}: equipment grid should stay usable after clear`);
    if (!metrics.visibleButtons.includes("保存")) failures.push(`${name}: cleared run should allow saving selected equipment image`);
    if (!/通关纪念杯/.test(metrics.detailText)) failures.push(`${name}: selected equipment detail should be visible after clear`);
    if (!metrics.state.player.selectedHasOriginalImage) failures.push(`${name}: selected cleared equipment should retain fullImage for saving`);
  }
  if (name === "mobile-save-fallback") {
    const result = metrics.mobileSaveFallback || {};
    if (result.saveResult !== "viewer") failures.push(`${name}: mobile save should fall back to image viewer, got ${result.saveResult}`);
    if (!result.viewerOpen) failures.push(`${name}: save fallback should open image viewer`);
    if (!result.captionHasHint) failures.push(`${name}: save fallback should show long-press hint`);
    if (!result.viewerKeepsImageOnTap) failures.push(`${name}: tapping the image should not close the save fallback viewer`);
  }
  if (name === "monster-distribution") {
    const distribution = metrics.monsterDistribution || {};
    if (distribution.floor1AllSlime !== true) failures.push(`${name}: floor 1 should stay all slime`);
    if (distribution.earlyTier3Count !== 0) failures.push(`${name}: tier 3 monsters appeared before floor 11`);
    if ((distribution.floor11Tier3Rate || 0) > 0.42) failures.push(`${name}: floor 11 tier 3 rate too high: ${distribution.floor11Tier3Rate}`);
    if ((distribution.floor13Tier3Rate || 0) > 0.58) failures.push(`${name}: floor 13 tier 3 rate too high: ${distribution.floor13Tier3Rate}`);
    if ((distribution.floor17Tier4Rate || 0) > 0.28) failures.push(`${name}: floor 17 tier 4 rate too high: ${distribution.floor17Tier4Rate}`);
    if ((distribution.floor23Tier4Rate || 0) < 0.18) failures.push(`${name}: floor 23 should still allow some tier 4 pressure: ${distribution.floor23Tier4Rate}`);
  }
  if (name === "boss-film-drops") {
    const drops = metrics.bossFilmDrops || {};
    for (const floor of ["10", "20", "25", "35", "38", "40"]) {
      if (drops[floor]?.length !== 1 || drops[floor][0].drop !== "胶卷 0.3") {
        failures.push(`${name}: floor ${floor} boss should show 胶卷 0.3, got ${JSON.stringify(drops[floor])}`);
      }
    }
    const floor30 = drops["30"] || [];
    const floor30Drops = floor30.map((enemy) => `${enemy.typeKey}:${enemy.drop}`).join(",");
    if (floor30.length !== 3 || floor30.some((enemy) => enemy.drop !== "胶卷 0.1")) {
      failures.push(`${name}: floor 30 guards and knight captain should each show 胶卷 0.1, got ${floor30Drops}`);
    }
  }
  if (name === "crop-appraisal") {
    const crop = metrics.cropAppraisal || {};
    if (!crop.croppedSmaller) failures.push(`${name}: cropped image should be smaller than source`);
    if (!crop.sameCropDuplicate) failures.push(`${name}: same source and same crop should be treated as duplicate`);
    if (crop.differentCropDuplicate) failures.push(`${name}: same source with different crop should not be blocked by photo duplicate`);
    if (!crop.viewerOpened) failures.push(`${name}: crop action should open the full-screen viewer`);
    if (!crop.viewerClosedAfterConfirm) failures.push(`${name}: crop confirm should close the full-screen viewer`);
    if (!crop.viewerCropSaved) failures.push(`${name}: full-screen crop should save a crop rectangle`);
  }
  if (name === "group-specials") {
    const specials = metrics.groupSpecials || {};
    if (specials.sweepLeftHp !== 2 || specials.sweepCenterHp !== 0 || specials.sweepRightHp !== 2) {
      failures.push(`${name}: sweep should still hit neighbors when center is killed, got ${JSON.stringify(specials)}`);
    }
    const visualSweepState = specials.visualSweepState || {};
    if (visualSweepState["visual-left"] !== 2 || visualSweepState["visual-center"] !== 0 || visualSweepState["visual-right"] !== 2 || visualSweepState["visual-far"] !== 4) {
      failures.push(`${name}: sweep should use visual card position, not selected attack order, got ${JSON.stringify(visualSweepState)}`);
    }
    if (specials.peerlessAtk !== 7 || specials.peerlessDef !== 4) {
      failures.push(`${name}: peerless should add attack/defense +3 after kill, got ${JSON.stringify(specials)}`);
    }
    if (specials.peerlessAfterResetAtk !== 4 || specials.peerlessAfterResetDef !== 1) {
      failures.push(`${name}: peerless bonus should reset outside battle, got ${JSON.stringify(specials)}`);
    }
    const activeKeys = specials.activeSpecialKeys || [];
    for (const key of ["dealDamageAttack", "takeDamageDefense", "doubleStrikeSpeedDown", "shieldCrashAttackDown"]) {
      if (!activeKeys.includes(key)) failures.push(`${name}: different unique passives should each be active, missing ${key}, got ${JSON.stringify(activeKeys)}`);
    }
    if ((activeKeys.filter((key) => key === "dealDamageAttack").length) !== 1) {
      failures.push(`${name}: same passive key should only activate once, got ${JSON.stringify(activeKeys)}`);
    }
    if (specials.comboStrikeCount !== 2 || specials.comboShieldDamage !== 10 || specials.comboAttackAfterHit !== 2 || specials.comboDefenseAfterHit !== 1) {
      failures.push(`${name}: combo passives should interact in one battle, got ${JSON.stringify(specials)}`);
    }
    if (specials.zeroHeroDamage !== 0 || specials.zeroAttackAfterHit !== 1 || specials.zeroHpAfterHeroStrike !== 62 || specials.zeroDefenseAfterMonster !== 1 || specials.zeroHpAfterMonster !== 64) {
      failures.push(`${name}: attack/defense/regen/lifesteal should trigger from actions even at zero damage, got ${JSON.stringify(specials)}`);
    }
    if (specials.sweepActionAttack !== 1 || specials.sweepActionHp !== 52) {
      failures.push(`${name}: sweep should not count as extra attack action for attack gain/lifesteal, got ${JSON.stringify(specials)}`);
    }
    const megaDefense = specials.megaDefenseState || {};
    if (megaDefense.immuneUsed !== 1 || megaDefense.defenseSpecial !== 1 || megaDefense.hp !== 42) {
      failures.push(`${name}: mega defense immunity should still count as a defended action, got ${JSON.stringify(megaDefense)}`);
    }
  }
  if (name === "linked-traits") {
    const traits = metrics.linkedTraits || {};
    if (!traits.guardShieldApplied || !traits.guardShieldDisplayed) {
      failures.push(`${name}: guard team shield should apply and display as over-cap HP, got ${JSON.stringify(traits.guardState)}`);
    }
    if (!traits.startAutoBattleGuardShieldApplied) {
      failures.push(`${name}: guard team shield should survive the real startAutoBattle render path, got ${JSON.stringify(traits.startAutoBattleGuardState)}`);
    }
    if (!traits.warcryApplied) failures.push(`${name}: warrior warcry should buff all active enemies, got ${JSON.stringify(traits.warriorState)}`);
    if (traits.wizardDef !== 0) failures.push(`${name}: two wizards should reduce hero defense to 0, got ${traits.wizardDef}`);
    if (traits.patrolShield !== 0 || traits.patrolHp !== 75) failures.push(`${name}: patrol breakShield should clear shield and apply full HP loss, got ${JSON.stringify(traits.patrolState)}`);
    if (traits.golemHp !== 7) failures.push(`${name}: golem sturdy should limit normal hero damage to 1, got hp ${traits.golemHp}`);
    if (traits.octopusDamage !== 41) failures.push(`${name}: octopus giant should add max-HP gap damage, got ${traits.octopusDamage}`);
    if (traits.demonAttackDown !== 1 || traits.dragonSpeedDown !== 1) failures.push(`${name}: demon/dragon debuffs should stack on attack, got ${JSON.stringify(traits.debuffState)}`);
    if (traits.archmageAtk !== 17 || traits.archmageDef !== 6) failures.push(`${name}: archmage promotion should gain attack when hit and defense after attack, got ${JSON.stringify(traits.archmageState)}`);
    if (traits.knightDamageWithGuards !== 0 || traits.knightDamageAfterGuardDeath !== 17) {
      failures.push(`${name}: knight captain guard reduction should depend on living guards, got ${JSON.stringify(traits.knightState)}`);
    }
    if (traits.shieldCrashGolemHp !== 5) failures.push(`${name}: shield crash should add current shield damage against sturdy enemies, got hp ${traits.shieldCrashGolemHp}`);
  }
  if (name === "panel-toggle") {
    const panel = metrics.panelToggle || {};
    if (!panel.infoOpened || !panel.infoClosed) failures.push(`${name}: info button should open then close the info panel`);
    if (!panel.configOpened || !panel.configClosed) failures.push(`${name}: API button should open then close the config panel`);
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
  if (name === "mobile-form-economy") {
    const formChecks = metrics.formEconomy || {};
    if (formChecks.shield !== 15) failures.push(`${name}: mega shield should add 15 shield`);
    if (formChecks.lifesteal?.lifesteal !== 4 || formChecks.lifesteal?.def !== -1) {
      failures.push(`${name}: mega lifesteal should be lifesteal +4 and defense -2 from base, got ${JSON.stringify(formChecks.lifesteal)}`);
    }
    if (formChecks.regenShield?.shieldAfterHit !== formChecks.regenShield?.maxShield) {
      failures.push(`${name}: mega regen should restore shield after a hit, got ${JSON.stringify(formChecks.regenShield)}`);
    }
    if (formChecks.hpKill?.maxHp !== 93 || formChecks.hpKill?.hp !== 56) {
      failures.push(`${name}: mega HP kill should add max HP +3 and heal 6 in battle, got ${JSON.stringify(formChecks.hpKill)}`);
    }
    if (formChecks.hpShared?.defenseMaxHp !== 90 || formChecks.hpShared?.afterKillDefenseMaxHp !== 93 || formChecks.hpShared?.afterKillDefenseHp !== 56) {
      failures.push(`${name}: mega HP max should be shared across forms and persist after kill, got ${JSON.stringify(formChecks.hpShared)}`);
    }
    if (formChecks.hpSwitch?.attackHp !== 30 || formChecks.hpSwitch?.backHp !== 60 || formChecks.hpSwitch?.lowForm !== "hp" || formChecks.hpSwitch?.lowHp !== 20) {
      failures.push(`${name}: switching away from HP form should preserve missing HP and block lethal max-HP loss, got ${JSON.stringify(formChecks.hpSwitch)}`);
    }
    if (formChecks.speedPreStrike?.hp !== 3 || formChecks.speedPreStrike?.attackBonus !== 2 || formChecks.speedPreStrike?.hpAfter !== 52 || formChecks.speedPreStrike?.heroClock === Infinity) {
      failures.push(`${name}: mega speed pre-strike should trigger double strike/action effects before clock setup, got ${JSON.stringify(formChecks.speedPreStrike)}`);
    }
    if (formChecks.greedyDropBonus !== 0.1) failures.push(`${name}: mega greedy should keep film drop +0.1`);
    const expected = {
      "0.9": { atk: 4, def: 1, speed: 2 },
      "1.0": { atk: 5, def: 1, speed: 2 },
      "2.0": { atk: 5, def: 2, speed: 2 },
      "3.0": { atk: 5, def: 2, speed: 3 },
      "4.0": { atk: 6, def: 2, speed: 3 },
    };
    for (const [film, stats] of Object.entries(expected)) {
      const actual = formChecks.greedyStatsByFilm?.[film];
      if (!actual || actual.atk !== stats.atk || actual.def !== stats.def || actual.speed !== stats.speed) {
        failures.push(`${name}: greedy stats at ${film} film expected ${JSON.stringify(stats)}, got ${JSON.stringify(actual)}`);
      }
    }
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
        atk: 2,
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
      hooks.addTestItem({
        itemName: "通关纪念杯",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Ccircle cx='60' cy='60' r='34' fill='%23245f9a'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23f5ebd7'/%3E%3Ccircle cx='320' cy='320' r='210' fill='%23245f9a'/%3E%3C/svg%3E",
        stats: { hp: 2 },
        value: 8,
        description: "塔顶带回来的蓝色纪念杯。",
        skipSpecialRoll: true,
      });
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
    await page.click(".equipment-slot.has-item");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      return state.player.selectedEquipment === "通关纪念杯" && state.player.selectedHasOriginalImage;
    }, null, { timeout: 3000 });
  });

  scenarios.mobileBossSelection = await collectScenario(mobile, "mobile-boss-selection", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.setFloor(30));
  });

  scenarios.mobileFormEconomy = await collectScenario(mobile, "mobile-form-economy", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const setMegaForm = (formId) => {
        hooks.setHeroForm(formId);
        hooks.setFormProgress({
          [formId]: { kills: 10, level: 2 },
        });
      };
      setMegaForm("shield");
      const shield = hooks.getPlayerStats().shield - 3;
      setMegaForm("lifesteal");
      const lifestealStats = hooks.getPlayerStats();
      const lifesteal = { lifesteal: lifestealStats.lifesteal, def: lifestealStats.def };
      setMegaForm("regen");
      hooks.setHeroStats({ hp: 40, shield: 0 });
      hooks.setEnemies([{
        id: "review-regen-hit",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 30,
        hp: 30,
        atk: 2,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-regen-hit"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(["review-regen-hit"]), 1);
      const regenShield = { shieldAfterHit: hooks.state.player.shield, maxShield: hooks.getPlayerStats().shield };
      hooks.resetGameForTest();
      hooks.setFormProgress({ hp: { kills: 10, level: 2 }, defense: { kills: 10, level: 2 } });
      hooks.setHeroForm("hp");
      hooks.setHeroStats({ hp: 50 });
      hooks.setHeroForm("defense");
      const defenseMaxHp = hooks.getPlayerStats().maxHp;
      hooks.setHeroForm("hp");
      hooks.setEnemies([{
        id: "review-hp-kill",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 1,
        hp: 1,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-hp-kill"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveBattleAction();
      const hpKill = { hp: hooks.state.player.hp, maxHp: hooks.getPlayerStats().maxHp };
      hooks.state.pendingFloorAdvance = false;
      hooks.setHeroForm("defense");
      const hpShared = {
        defenseMaxHp,
        afterKillDefenseMaxHp: hooks.getPlayerStats().maxHp,
        afterKillDefenseHp: hooks.state.player.hp,
      };
      hooks.resetGameForTest();
      hooks.setHeroStats({ hp: 60 });
      hooks.setHeroForm("attack");
      const attackHp = hooks.state.player.hp;
      hooks.setHeroForm("hp");
      const backHp = hooks.state.player.hp;
      hooks.setHeroStats({ hp: 20 });
      hooks.setHeroForm("attack");
      const hpSwitch = {
        attackHp,
        backHp,
        lowForm: hooks.state.player.formId,
        lowHp: hooks.state.player.hp,
      };
      hooks.resetGameForTest();
      setMegaForm("speed");
      hooks.addSpecialComboItem(["doubleStrikeSpeedDown", "dealDamageAttack"], {
        itemName: "连击进攻测试工具靴",
        value: 18,
        stats: { lifesteal: 1 },
        description: "shoe speed tool sharp attack",
      });
      hooks.setEnemies([{
        id: "review-speed-pre",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 10,
        hp: 10,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-speed-pre"]);
      hooks.setHeroStats({ hp: 50, baseHp: 80, baseAtk: 5, baseLifesteal: 1 });
      hooks.beginBattle(hooks.state.enemies);
      const speedPreStrike = {
        hp: hooks.state.enemies[0]?.hp,
        attackBonus: hooks.state.battleSpecial.attack,
        hpAfter: hooks.state.player.hp,
        heroClock: hooks.state.battleClock?.hero,
      };
      hooks.resetGameForTest();
      setMegaForm("greedy");
      const greedyDropBonus = JSON.parse(window.render_game_to_text()).player.form.filmDropBonus;
      const greedyStatsByFilm = {};
      for (const film of [0.9, 1.0, 2.0, 3.0, 4.0]) {
        const rolls = Math.floor(film);
        const shards = Math.round((film - rolls) * 10);
        hooks.setRunRewards({ filmRolls: rolls, filmShards: shards });
        const stats = hooks.getPlayerStats();
        greedyStatsByFilm[film.toFixed(1)] = { atk: stats.atk, def: stats.def, speed: stats.speed };
      }
      window.__reviewFormEconomy = { shield, lifesteal, regenShield, hpKill, hpShared, hpSwitch, speedPreStrike, greedyDropBonus, greedyStatsByFilm };
    });
  });

  scenarios.cropAppraisal = await collectScenario(desktop, "crop-appraisal", async (page) => {
    const source = await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f5ebd7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#bd3d36";
      ctx.fillRect(60, 70, 230, 260);
      ctx.fillStyle = "#245f9a";
      ctx.fillRect(510, 70, 230, 260);
      const source = canvas.toDataURL("image/jpeg", 0.82);
      const cropA = { x: 0.05, y: 0.1, width: 0.35, height: 0.8 };
      const cropB = { x: 0.6, y: 0.1, width: 0.35, height: 0.8 };
      const cropped = await hooks.cropImageToDataUrl(source, cropA, 420, 0.72);
      const sourceKey = hooks.makePhotoDuplicateKey(source);
      const cropAKey = hooks.makePhotoDuplicateKey(cropped);
      hooks.addRawItem({
        itemName: "红色方块",
        subjectName: "红色方块",
        objectType: "测试块",
        value: 8,
        stats: { hp: 2 },
        photoKey: cropAKey,
        sourcePhotoKey: sourceKey,
        cropRect: cropA,
        skipSpecialRoll: true,
      });
      window.__reviewCropAppraisal = {
        croppedSmaller: cropped.length < source.length,
        sameCropDuplicate: Boolean(hooks.findCurrentPhotoDuplicateForTest(cropAKey, sourceKey, cropA)),
        differentCropDuplicate: Boolean(hooks.findCurrentPhotoDuplicateForTest(hooks.makePhotoDuplicateKey(source), sourceKey, cropB)),
      };
      hooks.setPendingPhotoForTest(source);
      return source;
    });
    void source;
    await page.click("#photoActionBtn");
    await page.waitForFunction(() => !document.querySelector("#imageViewer").hidden && document.querySelector("#imageViewer").classList.contains("is-crop-editor"), null, { timeout: 3000 });
    const viewerOpened = await page.evaluate(() => !document.querySelector("#imageViewer").hidden);
    const imageBox = await page.locator("#imageViewerImage").boundingBox();
    await page.mouse.move(imageBox.x + imageBox.width * 0.18, imageBox.y + imageBox.height * 0.22);
    await page.mouse.down();
    await page.mouse.move(imageBox.x + imageBox.width * 0.55, imageBox.y + imageBox.height * 0.72, { steps: 8 });
    await page.mouse.up();
    await page.click("#viewerCropConfirm");
    await page.waitForFunction(() => document.querySelector("#imageViewer").hidden, null, { timeout: 3000 });
    await page.evaluate((viewerOpened) => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewCropAppraisal = {
        ...window.__reviewCropAppraisal,
        viewerOpened,
        viewerClosedAfterConfirm: Boolean(document.querySelector("#imageViewer").hidden),
        viewerCropSaved: Boolean(state.pendingCropRect && !state.cropMode),
      };
    }, viewerOpened);
  });

  scenarios.groupSpecials = await collectScenario(desktop, "group-specials", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const makeEnemy = (id, hp = 4) => ({
        id,
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: id,
        maxHp: hp,
        hp,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      });
      hooks.addSpecialItem("sweep", { itemName: "横扫测试刷", value: 15, stats: {}, specialAffinity: ["sweep"] });
      hooks.setEnemies([makeEnemy("left"), makeEnemy("center"), makeEnemy("right")]);
      hooks.selectEnemies(["left", "center", "right"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const sweepLeftHp = hooks.state.enemies.find((enemy) => enemy.id === "left")?.hp;
      const sweepCenterHp = hooks.state.enemies.find((enemy) => enemy.id === "center")?.hp;
      const sweepRightHp = hooks.state.enemies.find((enemy) => enemy.id === "right")?.hp;

      hooks.resetGameForTest();
      hooks.addSpecialItem("sweep", { itemName: "横扫测试刷", value: 15, stats: {}, specialAffinity: ["sweep"] });
      hooks.setEnemies([makeEnemy("visual-left"), makeEnemy("visual-center"), makeEnemy("visual-right"), makeEnemy("visual-far")]);
      hooks.selectEnemies(["visual-center", "visual-far", "visual-left", "visual-right"]);
      hooks.beginBattle(hooks.state.selectedEnemyIds.map((id) => hooks.state.enemies.find((enemy) => enemy.id === id)).filter(Boolean));
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const visualSweepState = Object.fromEntries(hooks.state.enemies.map((enemy) => [enemy.id, enemy.hp]));

      hooks.resetGameForTest();
      hooks.addSpecialItem("peerless", { itemName: "无双测试章", value: 15, stats: {}, specialAffinity: ["peerless"] });
      hooks.setEnemies([makeEnemy("peerless-kill", 1), makeEnemy("peerless-next", 10)]);
      hooks.selectEnemies(["peerless-kill", "peerless-next"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const peerlessStats = hooks.getPlayerStats();
      hooks.resetGameForTest();
      const resetStats = hooks.getPlayerStats();

      hooks.resetGameForTest();
      hooks.addSpecialComboItem(["dealDamageAttack", "takeDamageDefense", "doubleStrikeSpeedDown", "shieldCrashAttackDown"], {
        itemName: "fan knife shield combo",
        subjectName: "fan knife shield combo",
        objectType: "fan knife shield shell",
        description: "fan speed knife sharp shield shell protect",
        value: 16,
        stats: { shield: 7 },
      });
      hooks.addSpecialItem("dealDamageAttack", { itemName: "knife low tester", description: "knife sharp", value: 15, stats: {}, specialAffinity: ["dealDamageAttack"] });
      hooks.setEnemies([{ ...makeEnemy("combo-target", 30), atk: 4 }]);
      hooks.selectEnemies(["combo-target"]);
      hooks.setHeroStats({ baseShield: 10, hp: 80 });
      hooks.beginBattle(hooks.state.enemies);
      const comboResults = hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      const activeSpecialKeys = hooks.getActiveSpecialsForTest().map((item) => item.key);
      const comboStrikeCount = comboResults.length;
      const comboShieldDamage = comboResults[0]?.shieldCrashDamage || 0;
      const comboAttackAfterHit = hooks.state.battleSpecial.attack;
      const comboDefenseAfterHit = hooks.state.battleSpecial.defense;

      hooks.resetGameForTest();
      hooks.addSpecialComboItem(["dealDamageAttack", "takeDamageDefense"], {
        itemName: "sharp shield action tester",
        subjectName: "sharp shield action tester",
        objectType: "knife shield shell",
        description: "knife sharp shield shell protect",
        value: 16,
        stats: {},
      });
      hooks.setHeroStats({ hp: 70, baseHp: 80, baseAtk: 1, baseDef: 10, baseShield: 0, baseLifesteal: 2, baseRegen: 2, shield: 0 });
      hooks.setEnemies([{ ...makeEnemy("zero-action-target", 20), atk: 1, def: 99 }]);
      hooks.selectEnemies(["zero-action-target"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.state.player.hp = 60;
      const zeroHeroResults = hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const zeroAttackAfterHit = hooks.state.battleSpecial.attack;
      const zeroHpAfterHeroStrike = hooks.state.player.hp;
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      const zeroDefenseAfterMonster = hooks.state.battleSpecial.defense;
      const zeroHpAfterMonster = hooks.state.player.hp;

      hooks.resetGameForTest();
      hooks.addSpecialItem("sweep", { itemName: "wide sweep brush", description: "wide sweep brush", value: 15, stats: {}, specialAffinity: ["sweep"] });
      hooks.addSpecialItem("dealDamageAttack", { itemName: "sharp knife tester", description: "knife sharp", value: 15, stats: {}, specialAffinity: ["dealDamageAttack"] });
      hooks.setEnemies([makeEnemy("sweep-left", 20), makeEnemy("sweep-center", 4), makeEnemy("sweep-right", 20)]);
      hooks.selectEnemies(["sweep-left", "sweep-center", "sweep-right"]);
      hooks.setHeroStats({ hp: 70, baseHp: 80, baseAtk: 4, baseShield: 0, baseLifesteal: 2, shield: 0 });
      hooks.beginBattle(hooks.state.enemies);
      hooks.state.player.hp = 50;
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const sweepActionAttack = hooks.state.battleSpecial.attack;
      const sweepActionHp = hooks.state.player.hp;

      hooks.resetGameForTest();
      hooks.addSpecialItem("takeDamageDefense", { itemName: "shield shell tester", description: "shield shell protect", value: 15, stats: {}, specialAffinity: ["takeDamageDefense"] });
      hooks.setFormProgress({ defense: { kills: 10, level: 2 } });
      hooks.setHeroForm("defense");
      hooks.setHeroStats({ hp: 80, baseRegen: 2, baseShield: 0, shield: 0 });
      hooks.setEnemies([{ ...makeEnemy("immune-hit", 20), atk: 10 }]);
      hooks.selectEnemies(["immune-hit"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.state.player.hp = 40;
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      const megaDefenseState = {
        hp: hooks.state.player.hp,
        defenseSpecial: hooks.state.battleSpecial.defense,
        immuneUsed: hooks.state.battleSpecial.damageImmuneUsed,
      };
      window.__reviewGroupSpecials = {
        sweepLeftHp,
        sweepCenterHp,
        sweepRightHp,
        visualSweepState,
        peerlessAtk: peerlessStats.atk,
        peerlessDef: peerlessStats.def,
        peerlessAfterResetAtk: resetStats.atk,
        peerlessAfterResetDef: resetStats.def,
        activeSpecialKeys,
        comboStrikeCount,
        comboShieldDamage,
        comboAttackAfterHit,
        comboDefenseAfterHit,
        zeroHeroDamage: zeroHeroResults[0]?.totalDamage || 0,
        zeroAttackAfterHit,
        zeroHpAfterHeroStrike,
        zeroDefenseAfterMonster,
        zeroHpAfterMonster,
        sweepActionAttack,
        sweepActionHp,
        megaDefenseState,
      };
    });
  });

  scenarios.linkedTraits = await collectScenario(desktop, "linked-traits", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const baseEnemy = (id, typeKey, overrides = {}) => {
        const type = hooks.monsterTypes[typeKey] || hooks.monsterTypes.slime;
        return {
          id,
          testEnemy: true,
          typeKey,
          typeName: type.name,
          name: type.name,
          maxHp: overrides.maxHp ?? type.hp,
          hp: overrides.hp ?? overrides.maxHp ?? type.hp,
          atk: overrides.atk ?? type.atk,
          def: overrides.def ?? type.def,
          speed: overrides.speed ?? type.speed,
          maxShield: overrides.maxShield ?? 0,
          shield: overrides.shield ?? 0,
          traits: (overrides.traits || type.traits || []).map((trait) => ({ ...trait })),
        };
      };
      const begin = (enemies) => {
        hooks.setEnemies(enemies);
        hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
        hooks.beginBattle(hooks.state.enemies);
        return hooks.state.enemies;
      };

      let enemies = begin([baseEnemy("g1", "guard"), baseEnemy("g2", "guard"), baseEnemy("kc", "knightCaptain")]);
      const guardState = enemies.map((enemy) => ({
        id: enemy.id,
        shield: enemy.shield,
        maxShield: enemy.maxShield,
        display: `${Math.ceil(enemy.hp + enemy.shield)}/${enemy.maxHp}`,
      }));
      const guardShieldApplied = guardState.every((enemy) => enemy.shield === 40 && enemy.maxShield === 40);
      const guardShieldDisplayed = guardState.filter((enemy) => enemy.id.startsWith("g")).every((enemy) => enemy.display === "90/50")
        && guardState.find((enemy) => enemy.id === "kc")?.display === "80/40";
      const knightDamageWithGuards = hooks.applyHeroDamageToEnemy(enemies[2], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 }).totalDamage;
      enemies[0].hp = 0;
      enemies[1].hp = 0;
      const knightDamageAfterGuardDeath = hooks.applyHeroDamageToEnemy(enemies[2], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 }).totalDamage;

      hooks.setEnemies([baseEnemy("sg1", "guard"), baseEnemy("sg2", "guard"), baseEnemy("skc", "knightCaptain")]);
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
      hooks.startAutoBattle();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const startAutoBattleGuardState = hooks.state.enemies.map((enemy) => ({
        id: enemy.id,
        shield: enemy.shield,
        maxShield: enemy.maxShield,
      }));
      const startAutoBattleGuardShieldApplied = startAutoBattleGuardState.every((enemy) => enemy.shield === 40 && enemy.maxShield === 40);

      enemies = begin([baseEnemy("w1", "warrior"), baseEnemy("s1", "slime"), baseEnemy("s2", "slime")]);
      const warriorState = enemies.map((enemy) => ({ atk: enemy.atk, def: enemy.def, speed: enemy.speed }));
      const warcryApplied = warriorState[0].atk === 15 && warriorState[0].def === 8 && warriorState[0].speed === 3
        && warriorState[1].atk === 9 && warriorState[1].def === 3 && warriorState[1].speed === 3;

      enemies = begin([baseEnemy("z1", "wizard"), baseEnemy("z2", "wizard")]);
      const wizardDef = hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)).def;

      hooks.setHeroStats({ hp: 80, shield: 3, baseDef: 1 });
      enemies = begin([baseEnemy("p1", "patrol", { atk: 6 })]);
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["p1"]), 1);
      const patrolState = { hp: hooks.state.player.hp, shield: hooks.state.player.shield };

      enemies = begin([baseEnemy("go1", "golem")]);
      hooks.applyHeroDamageToEnemy(enemies[0], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 });
      const golemHp = enemies[0].hp;

      enemies = begin([baseEnemy("oc1", "octopus")]);
      const octopusDamage = hooks.getMonsterAttackForStrike(enemies[0], { maxHp: 80 });

      enemies = begin([baseEnemy("dm1", "demon", { atk: 1 })]);
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["dm1"]), 1);
      const demonAttackDown = hooks.state.battleSpecial.attackDown;
      enemies = begin([baseEnemy("dr1", "dragon", { atk: 1 })]);
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["dr1"]), 1);
      const dragonSpeedDown = hooks.state.battleSpecial.speedDown;

      enemies = begin([baseEnemy("am1", "archmage")]);
      hooks.applyHeroDamageToEnemy(enemies[0], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 });
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["am1"]), 1);
      const archmageState = { atk: enemies[0].atk, def: enemies[0].def };

      hooks.resetGameForTest();
      hooks.addSpecialItem("shieldCrashAttackDown", { itemName: "护盾撞击测试", value: 16, stats: {} });
      hooks.setHeroStats({ shield: hooks.getPlayerStats().shield });
      enemies = begin([baseEnemy("go2", "golem")]);
      hooks.applyHeroDamageToEnemy(enemies[0], hooks.getBattleStatsForTest(["go2"]));
      const shieldCrashGolemHp = enemies[0].hp;

      window.__reviewLinkedTraits = {
        guardState,
        guardShieldApplied,
        guardShieldDisplayed,
        startAutoBattleGuardState,
        startAutoBattleGuardShieldApplied,
        warriorState,
        warcryApplied,
        wizardDef,
        patrolState,
        patrolHp: patrolState.hp,
        patrolShield: patrolState.shield,
        golemHp,
        octopusDamage,
        debuffState: { demonAttackDown, dragonSpeedDown },
        demonAttackDown,
        dragonSpeedDown,
        archmageState,
        archmageAtk: archmageState.atk,
        archmageDef: archmageState.def,
        knightState: { knightDamageWithGuards, knightDamageAfterGuardDeath },
        knightDamageWithGuards,
        knightDamageAfterGuardDeath,
        shieldCrashGolemHp,
      };
    });
  });

  scenarios.panelToggle = await collectScenario(desktop, "panel-toggle", async (page) => {
    const panelState = async () => page.evaluate(() => {
      const area = document.querySelector("#secondaryArea");
      return {
        infoVisible: Boolean(document.querySelector('[data-secondary-panel="info"]:not([hidden])')) && !area?.classList.contains("is-collapsed"),
        configVisible: Boolean(document.querySelector('[data-secondary-panel="config"]:not([hidden])')) && !area?.classList.contains("is-collapsed"),
      };
    });
    await page.click("#infoToggleBtn");
    const infoOpenState = await panelState();
    await page.click("#infoToggleBtn");
    const infoClosedState = await panelState();
    await page.click("#configToggleBtn");
    const configOpenState = await panelState();
    await page.click("#configToggleBtn");
    const configClosedState = await panelState();
    await page.evaluate((result) => {
      window.__reviewPanelToggle = result;
    }, {
      infoOpened: infoOpenState.infoVisible,
      infoClosed: !infoClosedState.infoVisible && !infoClosedState.configVisible,
      configOpened: configOpenState.configVisible,
      configClosed: !configClosedState.infoVisible && !configClosedState.configVisible,
    });
  });

  scenarios.mobileSaveFallback = await collectScenario(mobile, "mobile-save-fallback", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addTestItem({
        itemName: "移动保存杯",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Ccircle cx='60' cy='60' r='34' fill='%23245f9a'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23f5ebd7'/%3E%3Ccircle cx='320' cy='320' r='210' fill='%23245f9a'/%3E%3C/svg%3E",
        stats: { shield: 2 },
        value: 8,
        description: "用于验证移动端保存兜底。",
        skipSpecialRoll: true,
      });
    });
    await page.click("#savePhotoBtn");
    await page.waitForFunction(() => !document.querySelector("#imageViewer").hidden, null, { timeout: 3000 });
    await page.click("#imageViewerImage");
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      const viewer = document.querySelector("#imageViewer");
      const caption = document.querySelector("#imageViewerCaption")?.textContent || "";
      window.__reviewMobileSaveFallback = {
        saveResult: "viewer",
        viewerOpen: Boolean(viewer && !viewer.hidden),
        captionHasHint: /长按图片保存/.test(caption),
        viewerKeepsImageOnTap: Boolean(viewer && !viewer.hidden),
      };
    });
  });

  scenarios.monsterDistribution = await collectScenario(desktop, "monster-distribution", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const tierByType = {
        slime: 1,
        bat: 1,
        skeleton: 1,
        mage: 2,
        orc: 2,
        golem: 2,
        wizard: 3,
        guard: 3,
        knight: 3,
        patrol: 4,
        warrior: 4,
        swordsman: 4,
      };
      const originalSeed = hooks.state.runSeed;
      const sampleFloor = (floor, count = 96) => {
        const typeCounts = {};
        let tier3 = 0;
        let tier4 = 0;
        let total = 0;
        for (let index = 0; index < count; index += 1) {
          hooks.state.runSeed = `review-distribution-${floor}-${index}`;
          const types = hooks.buildFloorEncounter(floor).map((enemy) => enemy.typeKey);
          for (const type of types) {
            typeCounts[type] = (typeCounts[type] || 0) + 1;
            const tier = tierByType[type] || 1;
            if (tier >= 3) tier3 += 1;
            if (tier >= 4) tier4 += 1;
            total += 1;
          }
        }
        return {
          typeCounts,
          tier3Rate: total ? Number((tier3 / total).toFixed(3)) : 0,
          tier4Rate: total ? Number((tier4 / total).toFixed(3)) : 0,
        };
      };
      const floor1 = sampleFloor(1, 12);
      const early = [2, 3, 5, 8].map((floor) => sampleFloor(floor, 24));
      const floor11 = sampleFloor(11);
      const floor13 = sampleFloor(13);
      const floor17 = sampleFloor(17);
      const floor23 = sampleFloor(23);
      hooks.state.runSeed = originalSeed;
      window.__reviewMonsterDistribution = {
        floor1AllSlime: Object.keys(floor1.typeCounts).length === 1 && floor1.typeCounts.slime === 36,
        earlyTier3Count: early.reduce((sum, item) => sum + Math.round(item.tier3Rate * 72), 0),
        floor11Tier3Rate: floor11.tier3Rate,
        floor13Tier3Rate: floor13.tier3Rate,
        floor17Tier4Rate: floor17.tier4Rate,
        floor23Tier4Rate: floor23.tier4Rate,
        floor11Counts: floor11.typeCounts,
        floor17Counts: floor17.typeCounts,
        floor23Counts: floor23.typeCounts,
      };
    });
  });

  scenarios.bossFilmDrops = await collectScenario(desktop, "boss-film-drops", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const readFloor = (floor) => {
        hooks.setFloor(floor);
        return JSON.parse(window.render_game_to_text()).enemies.map((enemy) => ({
          typeKey: enemy.typeKey,
          name: enemy.name,
          drop: enemy.drop,
        }));
      };
      window.__reviewBossFilmDrops = Object.fromEntries([10, 20, 25, 30, 35, 38, 40].map((floor) => [String(floor), readFloor(floor)]));
    });
  });

  await browser.close();

  const failures = Object.entries(scenarios).flatMap(([key, metrics]) => {
    const name = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    return assertScenario(name, metrics);
  });
  console.log(JSON.stringify({ scenarios, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})();
