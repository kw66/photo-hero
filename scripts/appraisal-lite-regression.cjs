// Lite appraisal regression: field compatibility, drawing evidence gates, and score spread.
// Requires the local preview server at http://127.0.0.1:3000/.
const { chromium } = require("playwright");

const cases = [
  {
    label: "photo: real small object keeps model stat affinities",
    input: { sourceMode: "photo", name: "蓝柄剪刀", subject: "剪刀", equipable: true, authentic: "real", clarity: 3, appeal: 2, craft: 3, stats: ["attack", "lifesteal"], desc: "锋利的剪刀" },
    expect: ({ item, score }) => item.tooLarge === false && score >= 10 && item.stats.attack > 0 && item.stats.lifesteal > 0 && item.liteAuthentic === "real",
  },
  {
    label: "photo: poor real photo stays low but usable",
    input: { sourceMode: "photo", name: "小钥匙扣", subject: "钥匙扣", equipable: true, authentic: "real", clarity: 1, appeal: 0, craft: 1, stats: ["speed"] },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && score <= 12,
  },
  {
    label: "photo: single stat affinity is trusted",
    input: { sourceMode: "photo", name: "跑步鞋", subject: "鞋", equipable: true, authentic: "real", clarity: 2, appeal: 1, craft: 2, stats: ["speed"] },
    expect: ({ item }) => item.stats.speed > 0 && item.stats.attack === 0,
  },
  {
    label: "photo: web image is capped",
    input: { sourceMode: "photo", name: "烈焰大剑", subject: "剑", equipable: true, authentic: "web", clarity: 3, appeal: 3, craft: 3, stats: ["attack"] },
    expect: ({ item, score }) => item.liteAuthentic === "web" && item.value <= 12 && score <= 14,
  },
  {
    label: "photo: AI/rendered image is capped",
    input: { sourceMode: "photo", name: "幻想法杖", subject: "法杖", equipable: true, authentic: "ai", clarity: 3, appeal: 3, craft: 3, stats: ["attack"] },
    expect: ({ item }) => item.liteAuthentic === "ai" && item.value <= 12,
  },
  {
    label: "photo: screenshot image is capped",
    input: { sourceMode: "photo", name: "装备卡", subject: "卡片", equipable: true, authentic: "screenshot", clarity: 3, appeal: 2, craft: 3, stats: ["defense"] },
    expect: ({ item }) => item.liteAuthentic === "screenshot" && item.value <= 12,
  },
  {
    label: "photo: oversized object has no stats",
    input: { sourceMode: "photo", name: "红色汽车", subject: "汽车", equipable: false, tooLarge: true, authentic: "real", clarity: 3, appeal: 2, craft: 3, stats: ["defense"] },
    expect: ({ item, score }) => item.tooLarge === true && item.value === 0 && score === 0,
  },
  {
    label: "photo: scene has no stats",
    input: { sourceMode: "photo", name: "天空", subject: "天空", scene: true, authentic: "real", clarity: 2, appeal: 1, craft: 2 },
    expect: ({ item, score }) => item.isScene === true && item.value === 0 && score === 0,
  },
  {
    label: "photo: equipable false has no stats",
    input: { sourceMode: "photo", name: "整面墙", subject: "墙", equipable: false, authentic: "real", clarity: 2 },
    expect: ({ item }) => item.value === 0 && item.isEquipable === false,
  },
  {
    label: "drawing: old lite name-only output no longer makes equipment",
    input: { sourceMode: "drawing", name: "赤焰飞镖", subject: "飞镖", recognizable: "clear", clarity: 3, appeal: 3, craft: 3, confidence: 0.9, stats: ["attack"] },
    expect: ({ item, score }) => item.tooLarge === true && item.value === 0 && score === 0 && item.drawingRecognition === "unformed",
  },
  {
    label: "drawing: clear mouse with evidence is usable",
    input: {
      sourceMode: "drawing",
      name: "雷纹鼠标",
      subject: "鼠标",
      recognizedSubject: "鼠标",
      recognition: "recognizable_object",
      clarity: 3,
      appeal: 1,
      craft: 2,
      confidence: 0.82,
      stats: ["speed", "attack"],
      visualEvidence: ["圆角外轮廓", "左右按键分割线", "中间滚轮"],
      objectiveAssessment: "主体完整，有圆角轮廓、左右按键和滚轮。",
      diagnosticFeatures: "鼠标结构清楚，没有翅膀或盾面。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && (item.stats.speed > 0 || item.stats.attack > 0) && /鼠标/.test(item.itemName) && item.drawingRecognition === "recognizable_object",
  },
  {
    label: "drawing: rough flag stays lower than polished drawing",
    input: {
      sourceMode: "drawing",
      name: "彩纹旗帜",
      subject: "旗帜",
      recognizedSubject: "旗帜",
      recognition: "recognizable_object",
      clarity: 2,
      appeal: 1,
      craft: 1,
      confidence: 0.62,
      stats: ["defense", "speed"],
      visualEvidence: ["长杆", "三角旗面", "旗面和杆连接"],
      missingEvidence: ["线条粗糙", "配色简单"],
      objectiveAssessment: "能看出旗杆和旗面，但线条粗糙。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && score <= 10 && /旗/.test(item.itemName),
  },
  {
    label: "drawing: blade evidence prevents flag overclassification",
    input: {
      sourceMode: "drawing",
      name: "赤纹战旗",
      subject: "旗帜",
      recognizedSubject: "旗帜",
      recognition: "clear_equipment",
      clarity: 2,
      appeal: 1,
      craft: 1,
      confidence: 0.7,
      stats: ["attack"],
      visualEvidence: ["红色三角刃", "黄色内刃", "黑色握柄", "没有旗面和杆的一侧连接"],
      objectiveAssessment: "能看见刃部和握柄，更像武器，不是挂在旗杆一侧的布面。",
      diagnosticFeatures: "三角形是刃尖，黄色是内刃，黑色部分是握柄；缺少旗杆侧边连接关系。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && !/旗/.test(item.itemName),
  },
  {
    label: "drawing: bow evidence does not stay generic",
    input: {
      sourceMode: "drawing",
      name: "神秘小物",
      subject: "神秘小物",
      recognizedSubject: "弓箭",
      recognition: "clear_equipment",
      clarity: 2,
      appeal: 2,
      craft: 2,
      confidence: 0.78,
      stats: ["attack", "speed"],
      visualEvidence: ["黑色粗线条弓身", "蓝色弓弦", "紫色和绿色握把", "黑色箭头"],
      objectiveAssessment: "主体有弓身、弓弦、握把和箭头，结构可以辨认为弓箭。",
      diagnosticFeatures: "弓弦连接弓身，箭头在前方；星星月亮只是装饰背景。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && /弓|箭/.test(item.itemName) && !/神秘小物|奇怪小物/.test(item.itemName),
  },
  {
    label: "drawing: blade hilt evidence prevents popsicle misread",
    input: {
      sourceMode: "drawing",
      name: "蓝白条纹冰棍",
      subject: "冰棍",
      recognizedSubject: "冰棍",
      recognition: "clear_equipment",
      clarity: 3,
      appeal: 1,
      craft: 2,
      confidence: 0.78,
      stats: ["speed", "hp"],
      visualEvidence: ["尖端双刃轮廓", "蓝色斜纹刃身", "白色圆点装饰", "横向护手", "底部握柄"],
      objectiveAssessment: "主体有尖端、刃身、护手和握柄，结构更像短剑，不是食品。",
      diagnosticFeatures: "蓝白条纹只是刃身装饰；底部是握柄，横向部分是护手，缺少圆形糖头或可食用外形。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && /剑|刀|刃/.test(item.itemName) && !/冰棍|雪糕|糖|棒棒糖/.test(item.itemName) && item.stats.attack > 0 && item.stats.hp === 0,
  },
  {
    label: "drawing: polished shield can score high but stays below photo ceiling",
    input: {
      sourceMode: "drawing",
      name: "闪电护盾",
      subject: "护盾",
      recognizedSubject: "护盾",
      objectType: "防具",
      recognition: "clear_equipment",
      clarity: 3,
      appeal: 3,
      craft: 3,
      confidence: 0.9,
      stats: ["shield", "defense"],
      visualEvidence: ["圆形盾面", "深蓝边框", "白色十字纹章", "黄色闪电装饰"],
      objectiveAssessment: "盾面闭合，边框、十字和装饰都完整。",
      diagnosticFeatures: "具备盾面和边框，不是长鞭或飞镖。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score >= 11 && item.photoQualityScore >= 12 && item.photoQualityScore <= 13 && item.value <= 20 && /盾/.test(item.itemName),
  },
  {
    label: "drawing: excellent sketch still has a drawing ceiling",
    input: {
      sourceMode: "drawing",
      name: "鎏金圆盾",
      subject: "圆盾",
      recognizedSubject: "圆盾",
      objectType: "盾牌",
      recognition: "clear_equipment",
      clarity: 3,
      appeal: 3,
      craft: 3,
      confidence: 0.96,
      stats: ["shield", "defense"],
      visualEvidence: ["闭合圆形盾面", "双层金色边框", "中心蓝色宝石", "上下左右四个铆钉", "背后握把"],
      objectiveAssessment: "主体一眼可认，轮廓闭合，装饰和握把完整，配色清楚。",
      diagnosticFeatures: "盾面、边框、铆钉、握把齐全。",
    },
    expect: ({ item, score }) => item.tooLarge === false && item.photoQualityScore === 13 && item.value <= 20 && score >= 17 && score < 21 && /盾/.test(item.itemName),
  },
  {
    label: "drawing: rough trident/polearm keeps polearm category and mid score",
    input: {
      sourceMode: "drawing",
      name: "赤焰飞镖",
      subject: "飞镖",
      recognizedSubject: "三叉戟",
      objectType: "长柄武器",
      recognition: "clear_equipment",
      clarity: 2,
      appeal: 1,
      craft: 1,
      confidence: 0.72,
      stats: ["attack"],
      visualEvidence: ["长杆", "顶端三叉尖", "中间长尖", "左右分叉矛尖"],
      missingEvidence: ["线条略歪", "配色少"],
      objectiveAssessment: "能看见长杆和三叉尖头，但完成度一般。",
      diagnosticFeatures: "长柄连接多尖头，更像长柄武器，不是飞镖。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && score <= 12 && /矛|戟|枪|长柄/.test(item.itemName) && !/飞镖/.test(item.itemName),
  },
  {
    label: "drawing: armor evidence prevents whip fantasy",
    input: {
      sourceMode: "drawing",
      name: "翠绿藤蔓长鞭",
      subject: "长鞭",
      recognizedSubject: "护甲",
      objectType: "防具",
      recognition: "clear_equipment",
      clarity: 2,
      appeal: 2,
      craft: 1,
      confidence: 0.7,
      stats: ["defense", "shield"],
      visualEvidence: ["胸甲轮廓", "肩甲", "左右甲片", "蓝色绑带"],
      missingEvidence: ["没有长条鞭身", "没有握柄"],
      objectiveAssessment: "主体像上身护甲，有胸甲和肩甲结构。",
      diagnosticFeatures: "多块甲片组合，不是长鞭。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && score <= 12 && /甲|护/.test(item.itemName) && !/鞭/.test(item.itemName),
  },
  {
    label: "drawing: unrecognizable scribble has no stats",
    input: {
      sourceMode: "drawing",
      name: "汤勺",
      subject: "汤勺",
      recognition: "unrecognizable",
      clarity: 0,
      appeal: 0,
      craft: 0,
      confidence: 0.1,
      stats: [],
      visualEvidence: ["几条随机线条"],
      objectiveAssessment: "线条松散，没有明确主体。",
    },
    expect: ({ item, score, desc }) => item.tooLarge === true && item.value === 0 && score === 0 && item.drawingRecognition === "unformed" && /再画清楚|画出明确的主体/.test(desc),
  },
  {
    label: "drawing: medium object and polished object have visible score gap",
    input: {
      sourceMode: "drawing",
      name: "普通雨伞",
      subject: "雨伞",
      recognizedSubject: "雨伞",
      recognition: "recognizable_object",
      clarity: 2,
      appeal: 1,
      craft: 1,
      confidence: 0.6,
      stats: ["shield"],
      visualEvidence: ["半圆伞面", "下方短伞柄"],
      objectiveAssessment: "能看出雨伞，但线条简单。",
    },
    expect: ({ item, score }) => item.tooLarge === false && score > 0 && score <= 10 && item.photoQualityScore <= 10,
  },
  {
    label: "drawing: rough complete equipment stays several points below polished",
    input: {
      sourceMode: "drawing",
      name: "旧木圆盾",
      subject: "圆盾",
      recognizedSubject: "圆盾",
      objectType: "盾牌",
      recognition: "clear_equipment",
      clarity: 2,
      appeal: 1,
      craft: 1,
      confidence: 0.66,
      stats: ["shield", "defense"],
      visualEvidence: ["圆形盾面", "外圈边框"],
      missingEvidence: ["线条断开", "没有纹章", "没有握把"],
      objectiveAssessment: "能看出盾面和边框，但线条断开，装饰和握把缺失。",
      diagnosticFeatures: "有盾面结构，但完成度普通。",
    },
    expect: ({ item, score }) => item.tooLarge === false && item.photoQualityScore <= 9 && score <= 12 && /盾/.test(item.itemName),
  },
];

async function waitForGameReady(page) {
  await page.waitForFunction(() => (
    Boolean(window.__photoHeroTestHooks)
    && !document.body.classList.contains("is-booting")
    && document.getElementById("bootLoader")?.hidden !== false
  ), null, { timeout: 30000 });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "domcontentloaded" });
  await waitForGameReady(page);
  await page.evaluate(() => window.__photoHeroTestHooks.setRunRewards?.({ photoValueMin: 5, photoValueMax: 22 }));
  const results = await page.evaluate((inputs) => inputs.map((input) => {
    const hooks = window.__photoHeroTestHooks;
    const item = hooks.balanceItem(input, "");
    return {
      item,
      score: hooks.scoreItemForTest(item),
      quality: hooks.getItemQualityForTest(hooks.scoreItemForTest(item)),
      desc: hooks.renderItemDescriptionForTest(item),
    };
  }), cases.map((c) => c.input));

  let pass = 0;
  const failures = [];
  cases.forEach((c, i) => {
    const ctx = results[i];
    let ok = false;
    try { ok = Boolean(c.expect(ctx)); } catch { ok = false; }
    if (ok) {
      pass += 1;
    } else {
      failures.push({
        label: c.label,
        name: ctx.item.itemName,
        value: ctx.item.value,
        score: ctx.score,
        qualityScore: ctx.item.photoQualityScore,
        tooLarge: ctx.item.tooLarge,
        rec: ctx.item.drawingRecognition,
        auth: ctx.item.liteAuthentic,
        stats: ctx.item.stats,
        desc: ctx.desc,
      });
    }
  });

  console.log(`Lite regression: ${pass}/${cases.length} passed`);
  if (failures.length) console.log(`Failures:\n${JSON.stringify(failures, null, 2)}`);
  if (errors.length) console.log("Page errors:", errors);
  await browser.close();
  process.exit(failures.length || errors.length ? 1 : 0);
})();
