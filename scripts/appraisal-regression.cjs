const { chromium } = require("playwright");

const cases = [
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
  const results = await page.evaluate((inputs) => inputs.map((input) => {
    const item = window.__photoHeroTestHooks.balanceItem(input, "");
    const renderedDescription = window.__photoHeroTestHooks.renderItemDescriptionForTest(item);
    return { item, renderedDescription };
  }), cases.map((item) => item.input));
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
  if (errors.length) failures.push({ label: "console errors", errors });

  console.log(JSON.stringify({
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
