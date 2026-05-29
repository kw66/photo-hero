// LITE 鉴定通道回归：字段驱动 + 区间断言（质量曲线微调不影响断言）。
// 运行前需本地服务器在 http://127.0.0.1:3000/ 提供页面。
const { chromium } = require("playwright");

const cases = [
  // —— 照片：可装备实拍 ——
  {
    label: "photo: 实拍清晰小物可装备且信任属性倾向",
    input: { sourceMode: "photo", name: "蓝柄剪刀", subject: "剪刀", equipable: true, authentic: "real", clarity: 3, appeal: 2, craft: 3, stats: ["attack", "lifesteal"], desc: "锋利的剪刀" },
    expect: ({ item, score }) => item.tooLarge === false && score >= 10 && item.stats.attack > 0 && item.stats.lifesteal > 0 && item.liteAuthentic === "real",
  },
  {
    label: "photo: 实拍质量差给低分但仍可装备",
    input: { sourceMode: "photo", name: "小钥匙扣", subject: "钥匙扣", equipable: true, authentic: "real", clarity: 1, appeal: 0, craft: 1, stats: ["speed"] },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && score <= 12,
  },
  {
    label: "photo: 单一属性倾向被信任",
    input: { sourceMode: "photo", name: "跑步鞋", subject: "鞋", equipable: true, authentic: "real", clarity: 2, appeal: 1, craft: 2, stats: ["speed"] },
    expect: ({ item }) => item.stats.speed > 0 && item.stats.attack === 0,
  },
  // —— 照片：反作弊（authentic）——
  {
    label: "photo: 网图清晰武器被压成低分载体",
    input: { sourceMode: "photo", name: "烈焰大剑", subject: "剑", equipable: true, authentic: "web", clarity: 3, appeal: 3, craft: 3, stats: ["attack"] },
    expect: ({ item, score }) => item.liteAuthentic === "web" && item.value <= 12 && score <= 14,
  },
  {
    label: "photo: AI 渲染图被压低",
    input: { sourceMode: "photo", name: "幻想法杖", subject: "法杖", equipable: true, authentic: "ai", clarity: 3, appeal: 3, craft: 3, stats: ["attack"] },
    expect: ({ item }) => item.liteAuthentic === "ai" && item.value <= 12,
  },
  {
    label: "photo: 游戏截图被压低",
    input: { sourceMode: "photo", name: "装备卡", subject: "卡片", equipable: true, authentic: "screenshot", clarity: 3, appeal: 2, craft: 3, stats: ["defense"] },
    expect: ({ item }) => item.liteAuthentic === "screenshot" && item.value <= 12,
  },
  // —— 照片：硬底线（超大 / 场景）——
  {
    label: "photo: 超大物体无效",
    input: { sourceMode: "photo", name: "红色汽车", subject: "汽车", equipable: false, tooLarge: true, authentic: "real", clarity: 3, appeal: 2, craft: 3, stats: ["defense"] },
    expect: ({ item, score }) => item.tooLarge === true && item.value === 0 && score === 0,
  },
  {
    label: "photo: 场景无效",
    input: { sourceMode: "photo", name: "天空", subject: "天空", scene: true, authentic: "real", clarity: 2, appeal: 1, craft: 2 },
    expect: ({ item, score }) => item.isScene === true && item.value === 0 && score === 0,
  },
  {
    label: "photo: equipable=false 无效",
    input: { sourceMode: "photo", name: "整面墙", subject: "墙", equipable: false, authentic: "real", clarity: 2 },
    expect: ({ item }) => item.value === 0 && item.isEquipable === false,
  },
  // —— 画图：识别等级 ——
  {
    label: "drawing: clear 主体可装备且保留属性倾向",
    input: { sourceMode: "drawing", name: "雷纹鼠标", subject: "鼠标", recognizable: "clear", clarity: 3, appeal: 1, craft: 2, stats: ["speed", "attack"] },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && (item.stats.speed > 0 || item.stats.attack > 0) && /鼠标/.test(item.itemName),
  },
  {
    label: "drawing: rough 粗糙画可装备但偏低分",
    input: { sourceMode: "drawing", name: "彩纹旗帜", subject: "旗帜", recognizable: "rough", clarity: 2, appeal: 2, craft: 1, stats: ["defense", "speed"] },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && /旗/.test(item.itemName),
  },
  {
    label: "drawing: scribble 乱画不出装并提示重画",
    input: { sourceMode: "drawing", name: "汤勺", subject: "汤勺", recognizable: "scribble", clarity: 0, appeal: 0, craft: 0, stats: [] },
    expect: ({ item, score, desc }) => item.tooLarge === true && item.value === 0 && score === 0 && item.drawingRecognition === "scribble" && /再画清楚|画出明确的主体/.test(desc),
  },
  {
    label: "drawing: 误判scribble但有具体名+信心 → 救回出装",
    input: { sourceMode: "drawing", name: "小雨伞", subject: "雨伞", recognizable: "scribble", clarity: 2, appeal: 1, craft: 1, confidence: 0.6, stats: ["shield"] },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && item.drawingRecognition === "rough",
  },
  {
    label: "drawing: 不因画风把巨大物判 tooLarge",
    input: { sourceMode: "drawing", name: "巨龙", subject: "龙", recognizable: "clear", clarity: 3, appeal: 3, craft: 2, stats: ["attack"] },
    expect: ({ item, score }) => item.tooLarge === false && score > 0,
  },
  {
    label: "drawing: 媒介词被清洗出名称",
    input: { sourceMode: "drawing", name: "手绘短剑", subject: "短剑", recognizable: "clear", clarity: 2, appeal: 2, craft: 2, stats: ["attack"] },
    expect: ({ item }) => !/手绘|涂鸦|画作/.test(item.itemName),
  },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.__photoHeroTestHooks.setRunRewards?.({ photoValueMin: 5, photoValueMax: 22 }));
  const results = await page.evaluate((inputs) => inputs.map((input) => {
    const hooks = window.__photoHeroTestHooks;
    const item = hooks.balanceItem(input, "");
    return { item, score: hooks.scoreItemForTest(item), quality: hooks.getItemQualityForTest(hooks.scoreItemForTest(item)), desc: hooks.renderItemDescriptionForTest(item) };
  }), cases.map((c) => c.input));

  let pass = 0;
  const failures = [];
  cases.forEach((c, i) => {
    const ctx = results[i];
    let ok = false;
    try { ok = Boolean(c.expect(ctx)); } catch (e) { ok = false; }
    if (ok) { pass += 1; }
    else failures.push({ label: c.label, name: ctx.item.itemName, value: ctx.item.value, score: ctx.score, tooLarge: ctx.item.tooLarge, rec: ctx.item.drawingRecognition, auth: ctx.item.liteAuthentic, stats: ctx.item.stats, desc: ctx.desc });
  });

  console.log(`LITE 回归：${pass}/${cases.length} 通过`);
  if (failures.length) console.log("失败用例:\n" + JSON.stringify(failures, null, 2));
  if (errors.length) console.log("页面错误:", errors);
  await browser.close();
  process.exit(failures.length || errors.length ? 1 : 0);
})();
