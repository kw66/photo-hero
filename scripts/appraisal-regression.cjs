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
    expect: ({ item }) => item.value >= 20 && item.stats.regen === 0 && (item.stats.speed > 0 || item.specialEffects.length > 0),
  },
  {
    label: "fan rejects model shield stat and rerolls speed",
    input: {
      itemName: "白色台式转页扇",
      subjectName: "转页扇",
      objectType: "桌面电器",
      identityDescription: "玩家实拍的白色台式转页扇，有圆形网罩、扇叶、底座和真实桌面背景。",
      description: "带来清凉微风的桌面小风扇，能加速战场的节奏。",
      reason: "主体=风扇；倾向=速度；模型误把网罩当护盾。",
      tags: ["风扇", "转页扇", "旋转", "气流", "网罩"],
      value: 17,
      stats: { shield: 1 },
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "speed", score: 3 }],
    },
    expect: ({ item, renderedDescription }) => (
      item.stats.shield === 0
      && item.stats.speed > 0
      && /风|速度|抢在|行动|节奏/.test(renderedDescription)
    ),
  },
  {
    label: "real gaming mouse remains valid equipment",
    input: {
      itemName: "雷蛇游戏鼠标",
      subjectName: "游戏鼠标",
      objectType: "电脑外设",
      identityDescription: "正常拍摄的黑色雷蛇鼠标实物，放在桌面上，有真实反光和阴影，不是游戏装备图。",
      description: "雷蛇游戏鼠标像一枚贴手的黑色战符。",
      reason: "主体=游戏鼠标；现实外设；桌面实拍；倾向=速度攻击。",
      tags: ["鼠标", "外设", "桌面"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "speed", score: 3 }, { stat: "attack", score: 2 }],
    },
    expect: ({ item }) => (
      item.value > 0
      && !item.tooLarge
      && !item.virtualImage
      && item.value >= 17
      && (item.stats.speed > 0 || item.stats.attack > 0 || item.specialEffects.length > 0)
    ),
  },
  {
    label: "wide real room photo with small speaker stays valid",
    input: {
      itemName: "黑色小音响",
      subjectName: "音响",
      objectType: "桌面电子设备",
      identityDescription: "室内大范围实拍照片，桌面上有一个黑色小音响，周围能看到墙面、桌面和其他杂物，但音响实体清楚可见，有接触阴影、真实桌面反光和一致的室内光线。",
      description: "黑色小音响像一枚沉稳的桌面号角。",
      reason: "主体=音响；尺寸=桌面小物；背景较多但为现实实拍。",
      tags: ["音响", "桌面", "实拍", "背景多"],
      photoQuality: { clarity: 2, subjectArea: 1, backgroundClean: 0, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "defense", score: 2 }, { stat: "regen", score: 1 }],
    },
    expect: ({ item }) => (
      item.value > 0
      && !item.tooLarge
      && !item.virtualImage
      && item.value <= 15
      && item.stats.speed === 0
      && (item.stats.attack > 0 || item.stats.defense > 0 || item.stats.regen > 0)
    ),
  },
  {
    label: "real desk clutter does not over-penalize clear subject",
    input: {
      itemName: "黑色中性笔",
      subjectName: "中性笔",
      objectType: "文具",
      identityDescription: "玩家随手拍的桌面照片，黑色中性笔放在笔记本上，旁边有键盘和杯子，但笔主体清楚，有接触阴影、桌面反光和自然高光。",
      description: "黑色中性笔像一根细长的开路符。",
      reason: "主体=中性笔；桌面实拍；背景有杂物但主体清楚。",
      tags: ["文具", "桌面", "实拍", "背景多"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 0, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 2 }, { stat: "speed", score: 1 }],
    },
    expect: ({ item }) => (
      item.value >= 17
      && item.value <= 18
      && !item.tooLarge
      && !item.virtualImage
      && (item.stats.attack > 0 || item.specialEffects.length > 0)
    ),
  },
  {
    label: "clean product image stays ordinary despite clean background",
    input: {
      itemName: "白底商品剪刀",
      subjectName: "剪刀",
      objectType: "电商商品图",
      identityDescription: "白底电商商品展示图，一把剪刀居中摆放，背景非常干净，只有棚拍商品阴影，没有桌面接触阴影、手持痕迹或生活环境。",
      description: "白底商品剪刀看起来很锋利。",
      reason: "主体=剪刀；白底商品图；缺少玩家实拍证据。",
      tags: ["白底商品图", "剪刀", "电商"],
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 1, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: ["dealDamageAttack"],
    },
    expect: ({ item }) => (
      item.value > 0
      && item.value <= 11
      && item.virtualImage
      && item.specialEffects.length === 0
      && item.stats.regen === 0
      && (item.stats.attack > 0 || item.stats.lifesteal > 0)
    ),
  },
  {
    label: "normal real object screenshot is capped but not rejected",
    input: {
      itemName: "白色小风扇",
      subjectName: "风扇",
      objectType: "桌面电器",
      identityDescription: "网页截图里是一张正常拍摄的白色小风扇实物照片，风扇放在桌面上，有扇叶、底座、阴影和真实塑料反光，不是游戏装备图。",
      description: "白色小风扇把微弱的气流收进装备格。",
      reason: "主体=风扇；现实外设/电器；截图来源但主体是普通实拍实物。",
      tags: ["截图", "风扇", "桌面", "实物"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "speed", score: 3 }],
    },
    expect: ({ item }) => (
      item.value > 0
      && item.value <= 17
      && !item.tooLarge
      && !item.virtualImage
      && (item.stats.speed > 0 || item.specialEffects.length > 0)
    ),
  },
  {
    label: "game weapon screenshot is still suppressed",
    input: {
      itemName: "雷霆巨刃",
      subjectName: "游戏装备卡图",
      objectType: "游戏截图",
      identityDescription: "游戏背包截图里的幻想武器装备卡，带发光边框和数值，不是现实物体。",
      description: "发光的雷霆巨刃看起来很强。",
      reason: "主体=游戏装备截图；不是现实物体。",
      tags: ["截图", "游戏装备", "武器"],
      value: 21,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 0, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: ["dealDamageAttack"],
    },
    expect: ({ item }) => item.value === 0 && item.virtualImage && item.specialEffects.length === 0,
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
    hooks.setRunRewards?.({ photoValueMin: 8, photoValueMax: 26 });
    const valueMapping = {
      low: hooks.getPhotoValueMappingForTest?.(0),
      mid: hooks.getPhotoValueMappingForTest?.(7.5),
      high: hooks.getPhotoValueMappingForTest?.(15),
    };
    hooks.setRunRewards?.({ photoValueMin: 5, photoValueMax: 22 });
    hooks.addSpecialItem("killAttack", { value: 15, itemName: "攻势书本", specialAffinity: ["killAttack"] });
    hooks.addSpecialItem("doubleStrikeSpeedDown", { value: 16, itemName: "连击风扇", specialAffinity: ["doubleStrikeSpeedDown"] });
    hooks.addTestItem({ itemName: "红苹果", subjectName: "苹果", objectType: "水果", value: 9, stats: { hp: 1 }, photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 }, statAffinity: [{ stat: "hp", score: 3 }] });
    const activeSpecial = hooks.getActiveSpecialForTest?.();
    const heroStats = hooks.getPlayerStats();
    const score = (item) => hooks.scoreItemForTest?.(item) || 0;
    const quality = (item) => hooks.getItemQualityForTest?.(score(item))?.key || "";
    const rawValueShield = { itemName: "value only shield", value: 21, stats: { shield: 2 }, skipSpecialRoll: true };
    const shieldWithSpecial = { itemName: "special shield", value: 21, stats: { shield: 2 }, specialEffects: ["killShield"], skipSpecialRoll: true };
    const shieldEconomy = {
      shieldFourScore: score({ stats: { shield: 4 }, skipSpecialRoll: true }),
      shieldFourQuality: quality({ stats: { shield: 4 }, skipSpecialRoll: true }),
      rawValueShieldScore: score(rawValueShield),
      rawValueShieldQuality: quality(rawValueShield),
      shieldWithSpecialScore: score(shieldWithSpecial),
      shieldWithSpecialQuality: quality(shieldWithSpecial),
    };
    return {
      activeSpecial: activeSpecial || null,
      hp: hooks.getHeroStateForTest?.()?.hp,
      maxHp: heroStats.maxHp,
      itemCount: hooks.getInventoryForTest?.()?.filter(Boolean).length || 0,
      valueMapping,
      shieldEconomy,
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
  if (runtimeChecks.valueMapping?.low?.mappedValue !== 8 || runtimeChecks.valueMapping?.mid?.mappedValue !== 17 || runtimeChecks.valueMapping?.high?.mappedValue !== 26) {
    failures.push({ label: "photo score should linearly map to current value range", valueMapping: runtimeChecks.valueMapping });
  }
  if (runtimeChecks.shieldEconomy?.shieldFourScore !== 16 || runtimeChecks.shieldEconomy?.shieldFourQuality !== "rare") {
    failures.push({ label: "shield +4 should not be epic without extra power", shieldEconomy: runtimeChecks.shieldEconomy });
  }
  if (runtimeChecks.shieldEconomy?.rawValueShieldScore !== 8 || runtimeChecks.shieldEconomy?.rawValueShieldQuality !== "common") {
    failures.push({ label: "raw value should not turn shield +2 into legendary", shieldEconomy: runtimeChecks.shieldEconomy });
  }
  if (runtimeChecks.shieldEconomy?.shieldWithSpecialScore !== 22 || runtimeChecks.shieldEconomy?.shieldWithSpecialQuality !== "legendary") {
    failures.push({ label: "special effect value should still count toward shield item quality", shieldEconomy: runtimeChecks.shieldEconomy });
  }
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
