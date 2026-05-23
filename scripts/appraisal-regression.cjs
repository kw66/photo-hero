const { chromium } = require("playwright");

const cases = [
  {
    label: "isolated cartoon plush stays low and grounded",
    input: {
      itemName: "多足寿司玩偶",
      subjectName: "长腿寿司卡通玩偶",
      objectType: "卡通玩偶",
      identityDescription: "黑色纯背景上的卡通寿司造型，米饭和虾肉纹理夸张，伸出多条细长腿，没有桌面、手持、阴影或实拍环境。",
      description: "长出了腿的寿司，似乎随时准备跳出盘子发起突袭。",
      reason: "主体=卡通寿司玩偶；低真实感；黑底孤立展示；没有实拍环境。",
      tags: ["寿司", "玩偶", "卡通", "黑底"],
      photoQuality: { clarity: 2, subjectArea: 3, backgroundClean: 1, realPhoto: 1, focusLight: 1, interesting: 2 },
      statAffinity: [{ stat: "hp", score: 3 }, { stat: "shield", score: 2 }],
      specialAffinity: ["killHpBoost"],
    },
    expect: ({ item, renderedDescription }) => (
      item.value > 0
      && item.value <= 10
      && item.specialEffects.length === 0
      && !/跳出|突袭|发起|奔跑|活过来|随时准备/.test(renderedDescription)
    ),
  },
  {
    label: "sharp tool rejects regen affinity",
    input: {
      itemName: "旧不锈钢剪刀",
      subjectName: "剪刀",
      objectType: "手持尖锐工具",
      description: "旧不锈钢剪刀有补能和修复的味道，被打后能慢慢把生命拉回来。",
      reason: "主体=剪刀；倾向=修复",
      tags: ["剪刀", "修复", "补能"],
      value: 12,
      stats: { regen: 1 },
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "regen", score: 3 }, { stat: "defense", score: 2 }],
    },
    expect: ({ item, renderedDescription }) => (
      item.stats.regen === 0
      && (item.stats.attack > 0 || item.stats.lifesteal > 0)
      && !/补能|修复|被打后/.test(renderedDescription)
    ),
  },
  {
    label: "air purifier keeps regen",
    input: {
      itemName: "白色空气净化器",
      subjectName: "空气净化器",
      objectType: "桌面电器",
      description: "空气净化器带来清洁和过滤感。",
      reason: "主体=净化器；倾向=回复防御",
      tags: ["净化", "过滤"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "regen", score: 3 }, { stat: "defense", score: 2 }],
    },
    expect: ({ item }) => item.stats.regen > 0 && item.stats.attack === 0,
  },
  {
    label: "low value cup raises to regen instead of cheap shield",
    input: {
      itemName: "蓝色水杯",
      subjectName: "水杯",
      objectType: "杯子",
      description: "水杯像补给物，被打后能慢慢把生命拉回来。",
      reason: "主体=水杯；倾向=回复",
      tags: ["水", "杯"],
      value: 10,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 0 },
      statAffinity: [{ stat: "regen", score: 3 }],
    },
    expect: ({ item, renderedDescription }) => item.stats.regen > 0 && /回复|恢复|被打后/.test(renderedDescription),
  },
  {
    label: "legendary can roll special effect",
    input: {
      itemName: "传奇风扇",
      subjectName: "风扇",
      objectType: "桌面电器",
      description: "风扇带来旋转气流。",
      reason: "主体=风扇；倾向=速度",
      tags: ["风扇", "旋转"],
      value: 21,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "speed", score: 3 }],
      specialAffinity: ["doubleStrikeSpeedDown"],
    },
    expect: ({ item }) => item.specialEffects.length === 1,
  },
  {
    label: "epic can stay without special effect",
    input: {
      itemName: "高级水杯",
      subjectName: "水杯",
      objectType: "杯子",
      description: "水杯像补给物。",
      reason: "主体=水杯；倾向=回复",
      tags: ["水", "杯"],
      value: 17,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "regen", score: 3 }],
    },
    expect: ({ item }) => Array.isArray(item.specialEffects),
  },
  {
    label: "hp no longer adds heal text",
    input: {
      itemName: "红苹果",
      subjectName: "苹果",
      objectType: "水果",
      description: "红苹果就是生命上限感。",
      reason: "主体=苹果；倾向=生命上限",
      tags: ["苹果", "水果"],
      value: 9,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "hp", score: 3 }],
    },
    expect: ({ item, renderedDescription }) => item.stats.hp > 0 && !/生命\+/.test(renderedDescription),
  },
  {
    label: "fan keeps speed",
    input: {
      itemName: "白色小风扇",
      subjectName: "风扇",
      objectType: "桌面电器",
      description: "风扇带来旋转气流。",
      reason: "主体=风扇；倾向=速度",
      tags: ["风扇", "旋转"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "speed", score: 3 }],
    },
    expect: ({ item }) => item.stats.speed > 0 && item.stats.regen === 0,
  },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.__photoHeroTestHooks.setRunRewards?.({ photoValueMin: 5, photoValueMax: 22 });
  });
  const results = await page.evaluate((inputs) => inputs.map((input) => {
    const item = window.__photoHeroTestHooks.balanceItem(input, "");
    const renderedDescription = window.__photoHeroTestHooks.renderItemDescriptionForTest(item);
    return { item, renderedDescription };
  }), cases.map((item) => item.input));

  const runtimeChecks = await page.evaluate(() => {
    const hooks = window.__photoHeroTestHooks;
    hooks.resetGameForTest?.();
    hooks.addSpecialItem("killAttack", { value: 15, itemName: "攻势书本", specialAffinity: ["killAttack"] });
    hooks.addSpecialItem("doubleStrikeSpeedDown", { value: 16, itemName: "连击风扇", specialAffinity: ["doubleStrikeSpeedDown"] });
    hooks.addTestItem({ itemName: "红苹果", subjectName: "苹果", objectType: "水果", value: 9, stats: { hp: 1 }, photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 }, statAffinity: [{ stat: "hp", score: 3 }] });
    const activeSpecial = hooks.getActiveSpecialForTest?.();
    const heroStats = hooks.getPlayerStats();
    return {
      activeSpecial: activeSpecial || null,
      hp: hooks.getHeroStateForTest?.()?.hp,
      maxHp: heroStats.maxHp,
      itemCount: hooks.getInventoryForTest?.()?.filter(Boolean).length || 0,
    };
  });
  await browser.close();

  const failures = [];
  results.forEach((result, index) => {
    if (!cases[index].expect(result)) {
      failures.push({
        label: cases[index].label,
        itemName: result.item.itemName,
        value: result.item.value,
        stats: result.item.stats,
        description: result.renderedDescription,
      });
    }
  });
  if (runtimeChecks.activeSpecial?.key && runtimeChecks.activeSpecial.key !== "doubleStrikeSpeedDown") failures.push({ label: "active special should prefer strongest", activeSpecial: runtimeChecks.activeSpecial });
  if (runtimeChecks.hp !== undefined && runtimeChecks.maxHp !== undefined && runtimeChecks.hp > runtimeChecks.maxHp) failures.push({ label: "hp overflow after hp item", runtimeChecks });
  if (errors.length) failures.push({ label: "console errors", errors });

  console.log(JSON.stringify({
    runtimeChecks,
    results: results.map((result, index) => ({
      label: cases[index].label,
      itemName: result.item.itemName,
      value: result.item.value,
      stats: result.item.stats,
      description: result.renderedDescription,
    })),
    failures,
  }, null, 2));

  if (failures.length) process.exit(1);
})();
