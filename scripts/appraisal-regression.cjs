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
    label: "legendary can roll special effect when final score stays epic",
    input: {
      itemName: "传奇战锤",
      subjectName: "战锤",
      objectType: "重型工具",
      description: "战锤带来沉重的爆发力。",
      reason: "主体=战锤；倾向=攻击重击",
      tags: ["战锤", "沉重"],
      value: 21,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: ["heavyStrike"],
    },
    expect: ({ item, score, quality }) => item.specialEffects.length === 1 && score >= 17 && (quality.key === "epic" || quality.key === "legendary"),
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
    label: "pure hp plus twenty is not common quality",
    input: {
      itemName: "生命护符",
      subjectName: "护符",
      objectType: "治愈护符",
      description: "生命护符被塔写成一枚耐久符。",
      reason: "主体=护符；倾向=生命上限",
      tags: ["护符", "生命"],
      value: 20,
      stats: { hp: 20 },
      skipSpecialRoll: true,
    },
    expect: ({ item, score, quality }) => item.stats.hp === 20 && score === 20 && quality.key === "epic",
  },
  {
    label: "tableware should not become pure max hp",
    input: {
      itemName: "不锈钢汤勺",
      subjectName: "汤勺",
      objectType: "餐具",
      description: "不锈钢汤勺是桌面餐具，金属材质，可敲击也可挡住小冲击。",
      reason: "主体=汤勺；餐具；金属物品",
      tags: ["汤勺", "餐具", "金属"],
      value: 20,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "hp", score: 3 }],
      skipSpecialRoll: true,
    },
    expect: ({ item }) => item.stats.hp === 0 && (item.stats.attack > 0 || item.stats.defense > 0 || item.stats.shield > 0),
  },
  {
    label: "drawing mouse stays mouse instead of amulet or shield",
    input: {
      sourceMode: "drawing",
      itemName: "符石护符",
      subjectName: "护符",
      objectType: "幻想道具",
      objectiveAssessment: "客观评价：一个上圆下窄的封闭轮廓，中间横线分出左右按键，顶部中央有滚轮，主体完整。",
      subjectCandidates: [
        { name: "鼠标", category: "电脑外设", evidence: ["圆角外轮廓", "左右按键分割线", "中间滚轮"], missing: ["没有线缆"], confidence: 0.9 },
        { name: "护符", category: "幻想道具", evidence: ["轮廓较圆"], missing: ["没有吊环或符号结构"], confidence: 0.2 },
      ],
      recognizedSubject: "鼠标",
      recognition: "recognizable_object",
      visualEvidence: ["圆角外轮廓", "左右按键分割线", "中间滚轮"],
      identityDescription: "白色底上有一个黑线鼠标轮廓，顶部圆、底部略窄，中间有滚轮和按键分割线。",
      description: "符石护符在塔里压住敌人的视线。",
      reason: "主体=鼠标；证据=按键分割线和滚轮；模型误命名为护符。",
      tags: ["鼠标", "外设"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "speed", score: 2 }],
      specialAffinity: ["shieldCrashAttackDown"],
    },
    expect: ({ item, renderedDescription }) => (
      item.drawingRecognition === "recognizable_object"
      && /鼠标/.test(item.itemName)
      && !/护符|盾|魔杖|法杖|神器/.test(item.itemName)
      && !/护符|盾牌|魔杖|法杖|神器/.test(renderedDescription)
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
      && !item.specialEffects.includes("heavyStrike")
    ),
  },
  {
    label: "drawing backpack and microphone preserve open-vocabulary subject",
    input: {
      sourceMode: "drawing",
      itemName: "圣音法杖",
      subjectName: "话筒",
      objectType: "麦克风",
      objectiveAssessment: "客观评价：上方是椭圆网格头，下方接一条短柄，像手持话筒；旁边没有杖头宝石。",
      subjectCandidates: [
        { name: "话筒", category: "音频设备", evidence: ["椭圆网格头", "短柄"], missing: [], confidence: 0.88 },
        { name: "法杖", category: "魔法装备", evidence: ["有柄"], missing: ["没有杖头宝石或长杆"], confidence: 0.18 },
      ],
      recognizedSubject: "话筒",
      recognition: "recognizable_object",
      visualEvidence: ["椭圆网格头", "短柄"],
      identityDescription: "黑线画出一支话筒，上方椭圆网格头，下方短柄。",
      description: "圣音法杖把声音压成一道塔光。",
      reason: "主体=话筒；不是法杖。",
      tags: ["话筒", "声音"],
      value: 13,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 2 }, { stat: "regen", score: 1 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /话筒/.test(item.itemName)
      && !/法杖|魔杖|神器/.test(item.itemName)
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing umbrella stays an umbrella instead of a shield",
    input: {
      sourceMode: "drawing",
      itemName: "铁盾",
      subjectName: "雨伞盾",
      objectType: "防具",
      recognition: "recognizable_object",
      visualEvidence: ["弧形伞面", "伞骨", "短伞柄"],
      identityDescription: "黑色弧形伞面，下方有伞骨和短伞柄，主体完整。",
      description: "黑伞把塔里的冷雨挡在外面。",
      reason: "主体=雨伞；伞面可以遮挡。",
      tags: ["雨伞", "遮挡", "日常物品"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 2 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /伞/.test(item.itemName)
      && !/盾|魔杖|法杖|剑|神器/.test(item.itemName)
      && item.stats.attack === 0
      && item.stats.lifesteal === 0
      && item.stats.shield > 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing pen stays a pen without shield or lifesteal",
    input: {
      sourceMode: "drawing",
      itemName: "黑色中性笔",
      subjectName: "中性笔",
      objectType: "笔",
      recognition: "recognizable_object",
      visualEvidence: ["细长笔杆", "笔尖", "笔帽"],
      identityDescription: "细长直线笔杆，一端有笔尖，另一端有笔帽，主体完整。",
      description: "黑色中性笔像一根细长的开路符。",
      reason: "主体=中性笔；有笔尖和长杆。",
      tags: ["笔", "笔尖", "日常物品"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 1 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /笔/.test(item.itemName)
      && !/魔杖|法杖|剑|神器|盾/.test(item.itemName)
      && item.stats.attack > 0
      && item.stats.shield === 0
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing empty spoon does not trigger food or regen",
    input: {
      sourceMode: "drawing",
      itemName: "不锈钢汤勺",
      subjectName: "汤勺",
      objectType: "餐具",
      recognition: "recognizable_object",
      visualEvidence: ["椭圆勺头", "细长勺柄", "金属餐具"],
      missingEvidence: ["没有食物或汤水"],
      identityDescription: "椭圆形勺头连接细长勺柄，没有画出食物或汤水。",
      description: "不锈钢汤勺带着一点金属硬度。",
      reason: "主体=汤勺；餐具；没有可食用内容。",
      tags: ["汤勺", "餐具", "金属"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 2 }, { stat: "defense", score: 1 }, { stat: "regen", score: 3 }],
      specialAffinity: ["regenMultiplier"],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /勺/.test(item.itemName)
      && item.stats.hp === 0
      && item.stats.regen === 0
      && item.specialEffects.length === 0
      && (item.stats.attack > 0 || item.stats.defense > 0 || item.stats.shield > 0)
    ),
  },
  {
    label: "drawing apple is an honest fruit item",
    input: {
      sourceMode: "drawing",
      itemName: "红苹果",
      subjectName: "苹果",
      objectType: "水果",
      recognition: "recognizable_object",
      visualEvidence: ["红色圆形果实", "短梗", "叶子"],
      identityDescription: "红色圆形果实，上方有短梗和叶子，主体完整。",
      description: "红苹果带着清甜的补给感。",
      reason: "主体=苹果；水果；线条清楚。",
      tags: ["苹果", "水果"],
      value: 12,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "hp", score: 3 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /苹果/.test(item.itemName)
      && !/剑|盾|魔杖|法杖|神器/.test(item.itemName)
      && item.stats.hp > 0
      && item.stats.attack === 0
      && item.stats.shield === 0
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing banana is an honest fruit item",
    input: {
      sourceMode: "drawing",
      itemName: "香蕉",
      subjectName: "香蕉",
      objectType: "水果",
      recognition: "recognizable_object",
      visualEvidence: ["黄色弯月形水果", "两端尖细"],
      identityDescription: "黄色弯月形水果，两端尖细，主体完整。",
      description: "香蕉像一份轻便补给。",
      reason: "主体=香蕉；水果；线条清楚。",
      tags: ["香蕉", "水果"],
      value: 12,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "hp", score: 3 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /香蕉/.test(item.itemName)
      && !/剑|盾|魔杖|法杖|神器/.test(item.itemName)
      && item.stats.hp > 0
      && item.stats.attack === 0
      && item.stats.shield === 0
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing lollipop is not an unformed spiral",
    input: {
      sourceMode: "drawing",
      itemName: "彩虹棒棒糖",
      subjectName: "棒棒糖",
      objectType: "糖果",
      objectiveAssessment: "客观评价：上方是圆形糖头，里面有红黄蓝绿多色螺旋，下方连接一根黑色细棒，主体完整。",
      diagnosticFeatures: {
        shapes: ["圆形糖头", "彩色螺旋", "下方细棒"],
        colors: ["红色", "黄色", "蓝色", "绿色", "黑色"],
        parts: ["糖面", "糖棒"],
        relations: ["糖头下方连接细棒"],
        distinctiveCombos: ["圆形糖头+彩色螺旋+细棒"],
        counterEvidence: ["不是孤立螺旋线"],
      },
      subjectCandidates: [
        { name: "棒棒糖", category: "糖果", evidence: ["圆形糖头", "彩色螺旋", "下方细棒"], missing: [], confidence: 0.92 },
        { name: "螺旋线", category: "符号", evidence: ["有螺旋"], missing: ["不是孤立线团，还有糖棒"], confidence: 0.18 },
      ],
      recognizedSubject: "棒棒糖",
      recognition: "recognizable_object",
      visualEvidence: ["圆形糖头", "彩色螺旋", "下方细棒"],
      identityDescription: "上方圆形糖面里有多色螺旋，下方连着黑色细棒，像一支棒棒糖。",
      description: "彩虹棒棒糖甜甜醒目，像能在魔塔口袋里补上一点轻快元气。",
      reason: "主体=棒棒糖；证据=圆形糖头+多色螺旋+下方细棒；倾向=生命。",
      tags: ["棒棒糖", "糖果"],
      value: 11,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "hp", score: 3 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /糖/.test(item.itemName)
      && !/未成形|线团|螺旋线|徽记|魔杖|盾/.test(item.itemName)
      && item.value > 0
      && item.stats.hp > 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing watermelon uses diagnostic color-part combo",
    input: {
      sourceMode: "drawing",
      itemName: "翠绿生菜叶",
      subjectName: "生菜叶",
      objectType: "蔬菜叶片",
      objectiveAssessment: "客观评价：半圆切面，外圈是绿色外皮，内部红色果肉，红色区域里有多个黑色小点。",
      diagnosticFeatures: {
        shapes: ["半圆切面", "外圈", "内部果肉", "小黑点"],
        colors: ["绿色外皮", "红色果肉", "黑色籽"],
        parts: ["瓜皮", "果肉", "籽"],
        relations: ["绿色外皮包住红色果肉", "黑籽分布在果肉中"],
        distinctiveCombos: ["绿色外皮+红色果肉+黑籽"],
        counterEvidence: ["不是叶脉或生菜褶皱"],
      },
      subjectCandidates: [
        { name: "西瓜切片", category: "水果", evidence: ["绿色外皮", "红色果肉", "黑籽"], missing: [], confidence: 0.9 },
        { name: "生菜叶", category: "蔬菜", evidence: ["绿色边缘"], missing: ["没有叶脉，内部是红色果肉和黑籽"], confidence: 0.15 },
      ],
      recognizedSubject: "西瓜切片",
      recognition: "recognizable_object",
      visualEvidence: ["绿色外皮", "红色果肉", "黑色籽点", "半圆切面"],
      identityDescription: "半圆形水果切面，绿色外皮围住红色果肉，里面有黑色籽点。",
      description: "翠绿生菜叶带着清爽的补给味道。",
      reason: "主体=西瓜；证据=绿色外皮+红色果肉+黑籽。",
      tags: ["西瓜", "水果"],
      value: 12,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "hp", score: 3 }, { stat: "regen", score: 1 }],
      specialAffinity: [],
    },
    expect: ({ item, renderedDescription }) => (
      item.drawingRecognition === "recognizable_object"
      && /西瓜|瓜/.test(item.itemName)
      && !/生菜|叶/.test(item.itemName)
      && !/生菜叶/.test(renderedDescription)
      && item.stats.hp > 0
      && item.stats.attack === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing polearm beats kite or fork misread",
    input: {
      sourceMode: "drawing",
      itemName: "风筝徽记",
      subjectName: "风筝",
      objectType: "符号",
      objectiveAssessment: "客观评价：一根长杆从下方延伸到上方，顶端有宽大的弯刃和尖端，杆身旁有短横挡，不是风筝线。",
      diagnosticFeatures: {
        shapes: ["长杆", "顶端弯刃", "宽刃", "护手"],
        colors: ["黑色杆身", "红色刃部"],
        parts: ["杆", "刃", "护手"],
        relations: ["弯刃装在长杆顶端"],
        distinctiveCombos: ["长杆+顶端弯刃"],
        counterEvidence: ["没有风筝面", "不是叉齿"],
      },
      subjectCandidates: [
        { name: "长柄大刀", category: "长柄武器", evidence: ["长杆", "顶端弯刃", "宽刃"], missing: [], confidence: 0.88 },
        { name: "风筝", category: "玩具", evidence: ["上方有形状"], missing: ["没有风筝面和线"], confidence: 0.1 },
      ],
      recognizedSubject: "长柄大刀",
      recognition: "clear_equipment",
      visualEvidence: ["长杆", "顶端弯刃", "宽刃", "护手"],
      identityDescription: "长杆顶端接着宽大弯刃，像偃月刀或长柄大刀，不是风筝也不是叉子。",
      description: "按模型，并生成《画图勇者》装备素材JSON。让我仔细观察，图片显示的是一枚风筝徽记。",
      reason: "主体=长柄大刀；证据=长杆+弯刃；倾向=攻击。",
      tags: ["长柄", "弯刃", "武器"],
      value: 16,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: [],
    },
    expect: ({ item, renderedDescription }) => (
      /clear_equipment|recognizable_object/.test(item.drawingRecognition)
      && /偃月刀|长柄|大刀|战戟|蛇矛/.test(item.itemName)
      && !/风筝|叉子|生菜|叶|徽记/.test(item.itemName)
      && item.stats.attack > 0
      && !/JSON|模型|图片显示|让我观察|装备素材|prompt/.test(renderedDescription)
    ),
  },
  {
    label: "drawing one-line spoon remains unformed",
    input: {
      sourceMode: "drawing",
      itemName: "汤勺",
      subjectName: "汤勺",
      objectType: "餐具",
      recognition: "unrecognizable",
      visualEvidence: ["一条直线"],
      missingEvidence: ["没有勺头", "没有餐具结构"],
      identityDescription: "只有一条黑线，无法确认主体。",
      description: "线条还没凝成能上阵的装备。",
      reason: "看不出明确主体。",
      tags: ["线条"],
      value: 5,
      photoQuality: { clarity: 0, subjectArea: 0, backgroundClean: 2, realPhoto: 0, focusLight: 0, interesting: 0 },
      statAffinity: [],
      specialAffinity: [],
    },
    expect: ({ item, score }) => /未成形/.test(item.itemName) && score === 0 && item.tooLarge,
  },
  {
    label: "one-stroke loop is not a wing item",
    input: {
      sourceMode: "drawing",
      itemName: "风纹折翼",
      subjectName: "折翼",
      objectType: "速度道具",
      objectiveAssessment: "客观评价：只有一条黑色长弧线和一条斜线，线条松散，没有闭合主体，也没有羽片、翼膜或成对翅膀结构。",
      recognition: "recognizable_object",
      visualEvidence: ["一条黑色弧线", "一条斜线", "没有成对翅膀", "没有羽片"],
      missingEvidence: ["没有羽片", "没有翼膜", "没有左右两翼", "没有明确主体"],
      identityDescription: "白色底上只有一条黑色弧线和一条斜线交错，像随手画的松散曲线，看不出具体物品。",
      description: "风纹折翼带着轻快的气息。",
      reason: "模型猜测为翅膀，但实际只有少数线条，缺少翅膀结构。",
      tags: ["翅膀", "风", "线条"],
      value: 12,
      photoQuality: { clarity: 1, subjectArea: 1, backgroundClean: 2, realPhoto: 1, focusLight: 1, interesting: 0 },
      statAffinity: [{ stat: "speed", score: 3 }, { stat: "attack", score: 1 }],
      specialAffinity: ["doubleStrikeSpeedDown"],
      confidence: 0.58,
    },
    expect: ({ item, renderedDescription, score }) => (
      item.drawingRecognition === "unformed"
      && /未成形|线团/.test(item.itemName)
      && !/折翼|翅|羽|风纹/.test(item.itemName)
      && !/折翼|翅|羽|轻快|速度/.test(renderedDescription)
      && item.value === 0
      && score === 0
      && Object.values(item.stats).every((value) => value === 0)
      && item.specialEffects.length === 0
      && item.tooLarge === true
    ),
  },
  {
    label: "spiral line is not an umbrella item",
    input: {
      sourceMode: "drawing",
      itemName: "风纹雨伞",
      subjectName: "雨伞",
      objectType: "日常物品",
      objectiveAssessment: "客观评价：只有一条黑色G形螺旋线和短弧线，没有伞面、伞柄或伞骨，主体不完整。",
      recognition: "recognizable_object",
      visualEvidence: ["一条G形螺旋线", "一小段弧线", "没有伞面", "没有伞柄", "没有伞骨"],
      missingEvidence: ["没有伞面", "没有伞柄", "没有伞骨", "没有明确主体"],
      identityDescription: "白色底上只有一条黑色G形螺旋线，线条没有形成半圆伞面或下方伞柄。",
      description: "风纹雨伞遮住塔里的雨。",
      reason: "模型猜测为雨伞，但实际只有螺旋线，缺少雨伞结构。",
      tags: ["雨伞", "螺旋", "线条"],
      value: 12,
      photoQuality: { clarity: 1, subjectArea: 1, backgroundClean: 2, realPhoto: 1, focusLight: 1, interesting: 0 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 2 }],
      specialAffinity: ["shieldCrashAttackDown"],
      confidence: 0.6,
    },
    expect: ({ item, renderedDescription, score }) => (
      item.drawingRecognition === "unformed"
      && /未成形|线团/.test(item.itemName)
      && !/雨伞|黑伞|风纹|伞/.test(item.itemName)
      && !/雨伞|黑伞|遮住|挡/.test(renderedDescription)
      && item.value === 0
      && score === 0
      && Object.values(item.stats).every((value) => value === 0)
      && item.specialEffects.length === 0
      && item.tooLarge === true
    ),
  },
  {
    label: "unformed line ball never keeps stats",
    input: {
      sourceMode: "drawing",
      itemName: "未成形线团",
      subjectName: "无法识别主体",
      objectType: "线条",
      objectiveAssessment: "客观评价：只有几条松散交叉线，没有闭合轮廓和关键部件。",
      recognition: "unrecognizable",
      visualEvidence: ["几条松散交叉线"],
      missingEvidence: ["没有明确主体"],
      identityDescription: "几条黑色交叉线，无法识别主体。",
      description: "未成形线团暂时不能上阵。",
      reason: "无法识别主体。",
      tags: ["线团"],
      value: 10,
      stats: { attack: 2, defense: 1, shield: 1, hp: 6 },
      photoQuality: { clarity: 0, subjectArea: 0, backgroundClean: 2, realPhoto: 0, focusLight: 0, interesting: 0 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "shield", score: 3 }],
      specialAffinity: ["heavyStrike"],
      skipSpecialRoll: true,
    },
    expect: ({ item, renderedDescription, score }) => (
      item.drawingRecognition === "unformed"
      && item.value === 0
      && score === 0
      && Object.values(item.stats).every((value) => value === 0)
      && item.specialEffects.length === 0
      && !/上阵/.test(renderedDescription)
    ),
  },
  {
    label: "drawing phone can be styled but must stay phone",
    input: {
      sourceMode: "drawing",
      itemName: "雷纹法杖",
      subjectName: "魔法终端",
      objectType: "幻想装备",
      recognition: "recognizable_object",
      visualEvidence: ["圆角矩形机身", "屏幕", "摄像头"],
      identityDescription: "圆角矩形手机，有屏幕边框和背面摄像头，边缘画了几道闪电纹。",
      description: "雷纹手机像一块贴身的黑色终端。",
      reason: "主体=手机；屏幕和机身清楚。",
      tags: ["手机", "电子设备", "闪电纹"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "defense", score: 2 }, { stat: "attack", score: 1 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /手机/.test(item.itemName)
      && !/法杖|魔杖|剑|盾|护符|神器/.test(item.itemName)
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing laptop stays computer not magic book",
    input: {
      sourceMode: "drawing",
      itemName: "星界魔法书",
      subjectName: "笔记本电脑",
      objectType: "电子设备",
      recognition: "recognizable_object",
      visualEvidence: ["矩形屏幕", "键盘格子", "转轴"],
      identityDescription: "打开的笔记本电脑，上半部分是矩形屏幕，下半部分有键盘格子和转轴。",
      description: "笔记本电脑像一块结实的塔内终端。",
      reason: "主体=笔记本电脑；屏幕和键盘清楚。",
      tags: ["笔记本电脑", "电子设备"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "defense", score: 2 }, { stat: "attack", score: 1 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /电脑/.test(item.itemName)
      && !/魔法书|法杖|魔杖|剑|盾|神器/.test(item.itemName)
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing fan stays fan and favors speed",
    input: {
      sourceMode: "drawing",
      itemName: "风暴法器",
      subjectName: "风扇",
      objectType: "电器",
      recognition: "recognizable_object",
      visualEvidence: ["圆形外框", "三片扇叶", "底座"],
      identityDescription: "圆形风扇外框，里面有三片扇叶，下方有小底座。",
      description: "小风扇把气流卷进装备格。",
      reason: "主体=风扇；扇叶和外框清楚。",
      tags: ["风扇", "气流"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "speed", score: 3 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /风扇/.test(item.itemName)
      && !/法器|法杖|魔杖|剑|盾|神器/.test(item.itemName)
      && item.stats.speed > 0
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing mineral water stays water supply",
    input: {
      sourceMode: "drawing",
      itemName: "圣杯",
      subjectName: "矿泉水瓶",
      objectType: "饮料瓶",
      recognition: "recognizable_object",
      visualEvidence: ["透明瓶身", "瓶盖", "水位线"],
      identityDescription: "透明矿泉水瓶，有瓶盖、瓶身轮廓和水位线。",
      description: "矿泉水瓶像一份清凉补给。",
      reason: "主体=矿泉水瓶；瓶身和水位清楚。",
      tags: ["矿泉水", "瓶子", "水"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "regen", score: 3 }, { stat: "hp", score: 2 }],
      specialAffinity: [],
    },
    expect: ({ item }) => (
      item.drawingRecognition === "recognizable_object"
      && /水/.test(item.itemName)
      && !/圣杯|法杖|魔杖|剑|盾|神器/.test(item.itemName)
      && (item.stats.regen > 0 || item.stats.hp > 0)
      && item.stats.attack === 0
      && item.stats.lifesteal === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing unclear cool name still becomes unformed",
    input: {
      sourceMode: "drawing",
      itemName: "星界神兵",
      subjectName: "神器",
      objectType: "幻想武器",
      recognition: "unrecognizable",
      visualEvidence: ["几条乱线", "红色折线"],
      missingEvidence: ["没有明确主体", "没有武器结构"],
      identityDescription: "几条互不连接的红色折线和黑色乱线，看不出具体物品。",
      description: "线条还没凝成能上阵的装备。",
      reason: "看不出明确主体。",
      tags: ["乱线", "红色"],
      value: 12,
      photoQuality: { clarity: 0, subjectArea: 0, backgroundClean: 1, realPhoto: 0, focusLight: 0, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: ["heavyStrike"],
    },
    expect: ({ item, score }) => (
      item.drawingRecognition === "unformed"
      && /未成形/.test(item.itemName)
      && score === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "drawing sword removes medium words and keeps attack",
    input: {
      sourceMode: "drawing",
      itemName: "涂鸦火焰剑",
      subjectName: "手绘火焰短剑",
      objectType: "手绘幻想武器",
      identityDescription: "白色画布中央有一把黑线短剑，剑尖带红橙色火焰，左侧有蓝色星点。",
      description: "这把涂鸦短剑还带着纸面上的星火。",
      reason: "主体=火焰短剑；画面清楚；倾向=攻击。",
      tags: ["手绘", "火焰", "短剑"],
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 1 }],
    },
    expect: ({ item, renderedDescription }) => (
      !/涂鸦|手绘|画作|画布|纸面|简笔画|线稿|草图/.test(item.itemName)
      && !/涂鸦|手绘|画作|画布|纸面|简笔画|线稿|草图/.test(renderedDescription)
      && item.stats.attack > 0
      && item.value >= 17
    ),
  },
  {
    label: "sword rejects defensive stat and kill-defense special",
    input: {
      sourceMode: "drawing",
      itemName: "水晶长剑",
      subjectName: "长剑",
      objectType: "幻想武器",
      identityDescription: "白色底上有一把黑线长剑，剑身细长，剑尖和握柄清楚，中央有蓝色水晶纹路。",
      description: "水晶长剑像一件能稳住防线的装备。",
      reason: "主体=长剑；模型误给防御成长。",
      tags: ["长剑", "水晶", "防御"],
      value: 22,
      stats: { defense: 1, shield: 1 },
      specialEffects: ["killDefense"],
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "defense", score: 3 }, { stat: "shield", score: 2 }],
      specialAffinity: ["killDefense"],
      skipSpecialRoll: true,
    },
    expect: ({ item, renderedDescription }) => (
      item.stats.defense === 0
      && item.stats.shield === 0
      && !item.specialEffects.includes("killDefense")
      && !item.specialEffects.includes("killShield")
      && !item.specialEffects.includes("takeDamageDefense")
      && !item.specialEffects.includes("shieldCrashAttackDown")
      && (item.stats.attack > 0 || item.stats.speed > 0 || item.stats.lifesteal > 0 || item.specialEffects.includes("dealDamageAttack"))
      && !/防线|防御|护盾|护板|小盾/.test(renderedDescription)
    ),
  },
  {
    label: "drawing ignores handwritten label text",
    input: {
      sourceMode: "drawing",
      itemName: "神盾",
      subjectName: "手写神盾",
      objectType: "防护道具",
      identityDescription: "白色画布中央是一把黑线短剑，剑身和握柄清楚，旁边写着“神盾”。",
      description: "这幅画里的神盾可以挡住冲击。",
      reason: "文字写着神盾，但图形主体是短剑。",
      tags: ["神盾", "文字", "短剑"],
      value: 20,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 2 }],
      specialAffinity: ["killShield"],
      skipSpecialRoll: true,
    },
    expect: ({ item }) => (
      /剑|刀/.test(item.itemName)
      && !/神盾|护盾|盾牌/.test(item.itemName)
      && item.stats.attack > 0
      && item.stats.defense === 0
      && item.stats.shield === 0
      && !item.specialEffects.includes("killShield")
    ),
  },
  {
    label: "photo ignores printed text when subject is another object",
    input: {
      itemName: "神剑水杯",
      subjectName: "水杯",
      objectType: "杯子",
      identityDescription: "玩家实拍的白色水杯主体清楚，放在桌面上，有真实阴影，杯身印着“神剑”两个字。",
      description: "杯身文字像一把神剑。",
      reason: "主体=水杯；文字写着神剑。",
      tags: ["水杯", "神剑", "文字"],
      value: 16,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 1, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: ["dealDamageAttack"],
      skipSpecialRoll: true,
    },
    expect: ({ item }) => (
      !/剑/.test(item.itemName)
      && item.stats.attack === 0
      && !item.specialEffects.includes("dealDamageAttack")
      && (item.stats.regen > 0 || item.stats.shield > 0 || item.stats.hp > 0)
    ),
  },
  {
    label: "drawing shield removes hand drawn wording and keeps shield defense",
    input: {
      sourceMode: "drawing",
      itemName: "手绘蓝色护盾",
      subjectName: "画布上的蓝色圆盾",
      objectType: "手绘防护道具",
      identityDescription: "蓝色圆盾居中，外圈有深蓝线条，盾面有白色十字。",
      description: "这幅画里的护盾看起来可以挡住塔里的冲击。",
      reason: "主体=蓝色圆盾；画面清楚；倾向=护盾防御。",
      tags: ["手绘", "盾", "防护"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 2 }],
    },
    expect: ({ item, renderedDescription }) => (
      !/涂鸦|手绘|画作|画布|纸面|简笔画|线稿|草图/.test(item.itemName)
      && !/涂鸦|手绘|画作|画布|纸面|简笔画|线稿|草图/.test(renderedDescription)
      && (item.stats.shield > 0 || item.stats.defense > 0)
      && item.value >= 15
    ),
  },
  {
    label: "blank drawing stays no-effect",
    input: {
      sourceMode: "drawing",
      itemName: "随机涂鸦",
      subjectName: "无主体",
      objectType: "抽象线条",
      identityDescription: "画布上只有几条零散线条，没有可识别主体。",
      description: "随机涂鸦，没有明确装备主体。",
      reason: "无主体；无法辨认。",
      isScene: true,
      isEquipable: false,
      photoQuality: { clarity: 0, subjectArea: 0, backgroundClean: 1, realPhoto: 0, focusLight: 0, interesting: 0 },
      statAffinity: [{ stat: "attack", score: 1 }],
    },
    expect: ({ item, renderedDescription }) => (
      item.value === 0
      && item.tooLarge === true
      && Object.values(item.stats).every((value) => value === 0)
      && !/涂鸦|手绘|画作|画布|纸面|简笔画|线稿|草图/.test(renderedDescription)
    ),
  },
  {
    label: "rough drawing quality stays modest",
    input: {
      sourceMode: "drawing",
      itemName: "红色火焰徽记",
      subjectName: "火焰符号",
      objectType: "攻击符号",
      identityDescription: "红色火焰形状在中央偏小，轮廓有些断裂，旁边有几条杂线。",
      description: "火焰徽记带着一点灼热感。",
      reason: "主体=火焰符号；证据=红色火焰轮廓；质量=线条粗糙；倾向=攻击。",
      tags: ["火焰", "徽记"],
      photoQuality: { clarity: 1, subjectArea: 1, backgroundClean: 1, realPhoto: 1, focusLight: 0, interesting: 0 },
      statAffinity: [{ stat: "attack", score: 2 }],
    },
    expect: ({ item }) => item.value > 0 && item.value < 18 && item.stats.attack >= 0,
  },
  {
    label: "polished drawing quality earns higher value",
    input: {
      sourceMode: "drawing",
      itemName: "红色火焰徽记",
      subjectName: "火焰符号",
      objectType: "攻击符号",
      identityDescription: "中央有完整红橙火焰轮廓，外圈有深色描边，主体突出，背景干净。",
      description: "火焰徽记带着清晰的灼热轮廓。",
      reason: "主体=火焰符号；证据=完整红橙火焰+深色描边；质量=线条配色清楚；倾向=攻击。",
      tags: ["火焰", "徽记"],
      photoQuality: { "主体可识别性": 3, "主体完整度": 3, "杂线干扰": 2, "完成度": 3, "线条质量": 2, "美观程度": 2 },
      statAffinity: [{ stat: "attack", score: 3 }],
    },
    expect: ({ item }) => item.value >= 22 && item.stats.attack > 0,
  },
  {
    label: "unsupported drawing wand name falls back to visible subject",
    input: {
      sourceMode: "drawing",
      itemName: "星光魔杖",
      subjectName: "手绘魔杖",
      objectType: "幻想武器",
      identityDescription: "中央是一个蓝色圆圈，圆圈里有红色爱心，旁边只有两条短线装饰。",
      description: "这根手绘魔杖像纸面上的星光武器。",
      reason: "主体=魔杖；证据=蓝色圆圈和红色爱心；倾向=攻击。",
      tags: ["魔杖", "爱心", "圆圈"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 2, focusLight: 1, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 1 }],
    },
    expect: ({ item, renderedDescription }) => (
      !/魔杖|法杖|剑|武器|涂鸦|手绘|画布|纸面/.test(item.itemName)
      && !/魔杖|法杖|武器|涂鸦|手绘|画作|画布|纸面|简笔画|线稿|草图/.test(renderedDescription)
      && item.stats.attack === 0
      && (item.stats.hp > 0 || item.stats.regen > 0 || item.stats.shield > 0)
    ),
  },
  {
    label: "actual drawing wand keeps attack when visual evidence exists",
    input: {
      sourceMode: "drawing",
      itemName: "星纹魔杖",
      subjectName: "星形法杖",
      objectType: "法杖",
      identityDescription: "一根细长杆状杖身从下方延伸到顶部，顶端有黄色星形宝石和蓝色圆球。",
      description: "星纹魔杖的杖头凝着一点微光。",
      reason: "主体=星形法杖；证据=长杆杖身+星形顶端；质量=主体清楚；倾向=攻击。",
      tags: ["魔杖", "星形", "长杆"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 1 }],
    },
    expect: ({ item }) => /魔杖|法杖/.test(item.itemName) && item.stats.attack > 0,
  },
  {
    label: "simple drawing boot stays boot and common",
    input: {
      sourceMode: "drawing",
      itemName: "翡翠坠饰",
      subjectName: "绿色短靴轮廓",
      objectType: "饰品",
      identityDescription: "白色底上有绿色短靴轮廓，鞋底和鞋口可见，主体能看出像靴子，但线条很少、轮廓简单。",
      description: "翡翠坠饰带着轻快的绿色光泽。",
      reason: "主体=绿色短靴；证据=鞋底和鞋口；质量=简单少线；倾向=速度。",
      tags: ["短靴", "绿色"],
      photoQuality: { clarity: 2, subjectArea: 2, backgroundClean: 2, realPhoto: 1, focusLight: 1, interesting: 0 },
      statAffinity: [{ stat: "speed", score: 3 }, { stat: "attack", score: 1 }],
      specialAffinity: ["doubleStrikeSpeedDown"],
    },
    expect: ({ item, renderedDescription, score, quality }) => (
      /靴|鞋/.test(item.itemName)
      && !/翡翠|宝石|坠饰|吊坠/.test(item.itemName)
      && !/翡翠|宝石|坠饰|吊坠/.test(renderedDescription)
      && item.specialEffects.length === 0
      && item.stats.attack === 0
      && item.stats.speed > 0
      && score < 13
      && quality.key === "common"
    ),
  },
  {
    label: "drawing flag rejects kite and carry-into-tower fallback",
    input: {
      sourceMode: "drawing",
      itemName: "彩绘风鸢",
      subjectName: "风鸢",
      objectType: "装备轮廓",
      objectiveAssessment: "客观评价：一条黑色长杆连接右上角的封闭三角旗面，旗面内部有绿色曲线和橙黄色短线装饰，主体完整。",
      diagnosticFeatures: {
        shapes: ["长杆", "封闭三角旗面"],
        colors: ["黑色", "绿色", "橙色", "黄色"],
        parts: ["杆", "旗面", "彩色纹路"],
        relations: ["长杆连接旗面一侧"],
        counterEvidence: ["没有风筝线轴或菱形风筝骨架", "没有刀刃或枪尖"],
      },
      subjectCandidates: [
        { name: "旗帜", category: "带杆小物", evidence: ["长杆", "连接旗面", "彩色纹路"], missing: [], confidence: 0.86 },
        { name: "风筝", category: "飞行玩具", evidence: ["三角形轮廓"], missing: ["没有风筝线", "没有十字骨架"], confidence: 0.32 },
      ],
      recognizedSubject: "风筝",
      recognition: "recognizable_object",
      visualEvidence: ["长杆连接旗面", "彩色纹路"],
      identityDescription: "白色底上有一根黑色长杆，右上角连着封闭旗面，旗面里有绿色曲线和橙黄色短线。",
      description: "彩绘风鸢带着清晰的装备轮廓，可以被带进魔塔。",
      reason: "主体=风鸢；证据=三角轮廓；质量=清楚。",
      tags: ["风鸢", "旗面", "彩色纹路"],
      value: 16,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 2 }],
    },
    expect: ({ item, renderedDescription }) => (
      /旗/.test(item.itemName)
      && !/风鸢|风筝|装备轮廓|轮廓/.test(item.itemName)
      && !/可以被带进魔塔|带进魔塔|带进塔中|带进塔里|装备轮廓|主体轮廓/.test(renderedDescription)
      && item.value > 0
    ),
  },
  {
    label: "drawing flag keeps flag from direct model output",
    input: {
      sourceMode: "drawing",
      itemName: "藤纹旗帜",
      subjectName: "旗帜",
      objectType: "带杆旗帜",
      objectiveAssessment: "客观评价：黑色长杆和右上方的四边形旗面清楚，旗面里有绿色藤纹和橙色装饰。",
      diagnosticFeatures: {
        shapes: ["长杆", "四边形旗面"],
        colors: ["绿色藤纹", "橙色短线"],
        parts: ["旗杆", "旗面"],
        relations: ["旗面连在旗杆顶端"],
      },
      recognizedSubject: "旗帜",
      recognition: "recognizable_object",
      identityDescription: "黑色长杆连接一块四边形旗面，内部有绿色和橙色彩纹。",
      description: "藤纹旗帜带着清晰的装备轮廓，可以被带进魔塔。",
      reason: "主体=旗帜；证据=旗杆+旗面；质量=清楚。",
      tags: ["旗帜", "旗杆", "藤纹"],
      value: 17,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "defense", score: 1 }, { stat: "speed", score: 1 }],
    },
    expect: ({ item, renderedDescription }) => (
      /旗/.test(item.itemName)
      && !/装备轮廓|主体轮廓|可以被带进魔塔|带进魔塔|带进塔中|带进塔里/.test(renderedDescription)
      && item.value > 0
    ),
  },
  {
    label: "drawing irregular outline becomes flag when pole and cloth are visible",
    input: {
      sourceMode: "drawing",
      itemName: "菱形或不规则四边形的轮廓",
      subjectName: "不规则四边形轮廓",
      objectType: "装备轮廓",
      objectiveAssessment: "客观评价：画面中有一条黑色长杆，末端连接一个不规则四边形布面，布面内有绿色和橙色纹路。",
      diagnosticFeatures: {
        shapes: ["长杆", "不规则四边形布面"],
        colors: ["绿色", "橙色"],
        parts: ["杆", "布面"],
        relations: ["布面接在长杆末端"],
      },
      recognizedSubject: "不规则四边形轮廓",
      recognition: "recognizable_object",
      identityDescription: "黑色长杆连接一个不规则四边形布面，内部有绿色和橙色短线装饰。",
      description: "菱形或不规则四边形的轮廓带着清晰的装备轮廓，可以被带进魔塔。",
      reason: "主体=轮廓；证据=封闭形状和长杆。",
      tags: ["轮廓", "长杆", "布面"],
      value: 14,
      photoQuality: { clarity: 2, subjectArea: 2, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 1 }],
    },
    expect: ({ item, renderedDescription }) => (
      /旗/.test(item.itemName)
      && !/轮廓/.test(item.itemName)
      && !/可以被带进魔塔|带进魔塔|带进塔中|带进塔里|装备轮廓|主体轮廓/.test(renderedDescription)
    ),
  },
  {
    label: "red angular scribble is not flying blade",
    input: {
      sourceMode: "drawing",
      itemName: "赤翼飞刃",
      subjectName: "红色飞刃",
      objectType: "幻想武器",
      identityDescription: "白色底上只有一条红色折线和一小段短斜线，线段彼此断开，未形成刀刃、握柄、箭头或完整翅膀轮廓。",
      description: "赤翼飞刃像一道准备切开的红光。",
      reason: "主体=红色折线；证据=线条很少且断裂；质量=难以辨认；倾向=攻击。",
      tags: ["红色", "飞刃", "折线"],
      photoQuality: { clarity: 1, subjectArea: 1, backgroundClean: 2, realPhoto: 1, focusLight: 0, interesting: 0 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "lifesteal", score: 2 }, { stat: "speed", score: 1 }],
      specialAffinity: ["doubleStrikeSpeedDown", "bloodrage"],
    },
    expect: ({ item, renderedDescription, score, quality }) => (
      !/飞刃|利刃|翼刃|剑|刀|武器|神器/.test(item.itemName)
      && !/飞刃|利刃|翼刃|剑|刀|武器|神器/.test(renderedDescription)
      && item.specialEffects.length === 0
      && item.stats.attack === 0
      && item.stats.lifesteal === 0
      && score <= 6
      && quality.key === "common"
    ),
  },
  {
    label: "model-hyped random lines become unformed",
    input: {
      sourceMode: "drawing",
      itemName: "玄铁守护盾",
      subjectName: "玄铁盾牌",
      objectType: "防护装备",
      recognition: "clear_equipment",
      visualEvidence: ["蓝黑色乱线", "几条短线彼此断开"],
      missingEvidence: ["没有盾面", "没有边框", "没有把手"],
      identityDescription: "白色底上只有几条蓝黑色乱线和短折线，线段分散，无法看出盾面、边框、把手或完整主体。",
      description: "玄铁守护盾厚重可靠。",
      reason: "模型猜测为盾，但实际只有随机线条，缺少盾牌结构。",
      tags: ["盾牌", "玄铁", "乱线"],
      photoQuality: { clarity: 1, subjectArea: 1, backgroundClean: 1, realPhoto: 1, focusLight: 0, interesting: 2 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 3 }],
      specialAffinity: ["killShield"],
      confidence: 0.18,
    },
    expect: ({ item, renderedDescription, score }) => (
      /未成形|线团/.test(item.itemName)
      && !/盾|玄铁|守护/.test(item.itemName)
      && !/盾|玄铁|守护/.test(renderedDescription)
      && item.value === 0
      && score === 0
      && item.stats.shield === 0
      && item.stats.defense === 0
      && item.specialEffects.length === 0
      && item.tooLarge === true
    ),
  },
  {
    label: "plain circle is not an iron shield",
    input: {
      sourceMode: "drawing",
      itemName: "精钢圆盾",
      subjectName: "圆盾",
      objectType: "盾牌",
      recognition: "simple_symbol",
      visualEvidence: ["一个蓝色圆圈"],
      missingEvidence: ["没有盾面边框", "没有十字", "没有把手"],
      identityDescription: "中央只有一个蓝色圆圈，没有外圈边框、十字纹章、把手或厚盾面结构。",
      description: "精钢圆盾能挡住冲击。",
      reason: "主体=蓝色圆圈；模型想当盾，但缺少盾牌结构。",
      tags: ["圆圈", "盾牌"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 1, focusLight: 1, interesting: 0 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 2 }],
      specialAffinity: ["shieldCrashAttackDown"],
      confidence: 0.62,
    },
    expect: ({ item, renderedDescription, score, quality }) => (
      !/盾|精钢|铁/.test(item.itemName)
      && !/盾|精钢|铁|挡住/.test(renderedDescription)
      && item.value <= 9
      && score <= 9
      && quality.key === "common"
      && item.stats.shield === 0
      && item.stats.defense === 0
      && item.specialEffects.length === 0
    ),
  },
  {
    label: "structured round shield keeps shield",
    input: {
      sourceMode: "drawing",
      itemName: "蓝纹圆盾",
      subjectName: "圆盾",
      objectType: "盾牌",
      recognition: "clear_equipment",
      visualEvidence: ["圆形盾面", "深蓝外圈边框", "白色十字纹章"],
      identityDescription: "中央是圆形蓝色盾面，外圈有深蓝边框，盾面中央有白色十字纹章。",
      description: "蓝纹圆盾把冷光压在盾面上。",
      reason: "主体=圆盾；证据=盾面+外圈边框+十字；质量=结构清楚。",
      tags: ["圆盾", "边框", "十字"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "defense", score: 2 }],
      confidence: 0.86,
    },
    expect: ({ item }) => /盾/.test(item.itemName) && (item.stats.shield > 0 || item.stats.defense > 0) && item.value >= 17,
  },
  {
    label: "circle star is not a wand",
    input: {
      sourceMode: "drawing",
      itemName: "星界魔杖",
      subjectName: "魔杖",
      objectType: "幻想武器",
      recognition: "simple_symbol",
      visualEvidence: ["黄色星形", "蓝色圆圈"],
      missingEvidence: ["没有长柄", "没有杖身", "没有杖头连接"],
      identityDescription: "画面里只有一个黄色星形和一个蓝色圆圈，没有长柄、杖身或连接到顶端的杖头结构。",
      description: "星界魔杖释放星光。",
      reason: "主体=星形和圆圈；缺少魔杖结构。",
      tags: ["魔杖", "星形", "圆圈"],
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 1, focusLight: 1, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 2 }],
      specialAffinity: ["dealDamageAttack"],
      confidence: 0.66,
    },
    expect: ({ item, renderedDescription, score }) => (
      !/魔杖|法杖|武器/.test(item.itemName)
      && !/魔杖|法杖|释放|武器/.test(renderedDescription)
      && item.stats.attack === 0
      && item.stats.speed === 0
      && item.specialEffects.length === 0
      && score <= 9
    ),
  },
  {
    label: "formed abstract symbol stays usable",
    input: {
      sourceMode: "drawing",
      itemName: "彩环记号",
      subjectName: "彩色圆环",
      objectType: "符号",
      recognition: "simple_symbol",
      visualEvidence: ["闭合圆环", "红蓝色块", "清楚分区"],
      missingEvidence: ["没有随机线团", "没有孤立折线"],
      identityDescription: "白底上有一个闭合圆环，边缘和内部有红蓝色块，轮廓清楚。",
      description: "彩环记号在塔光下微微发亮。",
      reason: "主体=圆环记号；证据=闭合轮廓和颜色分区；质量=结构清楚。",
      tags: ["圆环", "记号", "彩色"],
      value: 9,
      photoQuality: { clarity: 2, subjectArea: 2, backgroundClean: 2, realPhoto: 1, focusLight: 1, interesting: 1 },
      statAffinity: [{ stat: "defense", score: 2 }, { stat: "regen", score: 1 }],
      specialAffinity: [],
      confidence: 0.71,
    },
    expect: ({ item, score, quality }) => (
      item.drawingRecognition !== "unformed"
      && item.value > 0
      && score > 0
      && quality.key === "common"
      && (item.stats.defense > 0 || item.stats.hp > 0 || item.stats.regen > 0)
    ),
  },
  {
    label: "rare drawing cannot keep special effect",
    input: {
      sourceMode: "drawing",
      itemName: "红色短剑",
      subjectName: "红色短剑",
      objectType: "幻想武器",
      identityDescription: "中央有红色短剑轮廓，剑身和握柄可见，但整体比较简单。",
      description: "红色短剑带着一点进攻感。",
      reason: "主体=红色短剑；证据=剑身+握柄；质量=普通；倾向=攻击。",
      tags: ["短剑", "红色"],
      value: 16,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 2, focusLight: 1, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }],
      specialAffinity: ["heavyStrike"],
    },
    expect: ({ item, score, quality }) => (
      item.specialEffects.length === 0
      && score < 17
      && quality.key !== "epic"
      && quality.key !== "legendary"
    ),
  },
  {
    label: "epic drawing special must finish as epic",
    input: {
      sourceMode: "drawing",
      itemName: "爆裂战锤",
      subjectName: "爆裂战锤",
      objectType: "重型武器",
      identityDescription: "中央有一把战锤，锤头很大，短柄清楚，周围有爆裂火花。",
      description: "爆裂战锤的锤头压着火花。",
      reason: "主体=战锤；证据=大锤头+短柄+爆裂火花；质量=完整；倾向=攻击重击。",
      tags: ["战锤", "爆裂"],
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "defense", score: 1 }],
      specialAffinity: ["heavyStrike"],
    },
    expect: ({ item, score, quality }) => (
      item.specialEffects.length === 0
      || (score >= 17 && (quality.key === "epic" || quality.key === "legendary"))
    ),
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
    label: "photo bow is identified before any oversize rejection",
    input: {
      itemName: "长弓",
      subjectName: "弓箭",
      objectType: "手持器具",
      identityDescription: "照片主体是一把弓箭，弓身、弓弦和箭头清楚可见，属于可搬动器具，不是车辆或建筑。",
      description: "长弓的弧线适合在塔里拉开距离。",
      reason: "主体=弓箭；尺寸=手持；质量=清晰；倾向=攻击。",
      tags: ["弓箭", "弓弦", "箭头"],
      value: 14,
      tooLarge: true,
      isEquipable: false,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 1 }],
    },
    expect: ({ item }) => (
      /弓|箭/.test(item.itemName)
      && !item.tooLarge
      && item.isEquipable
      && item.value > 0
      && (item.stats.attack > 0 || item.stats.speed > 0)
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
    const hooks = window.__photoHeroTestHooks;
    const item = window.__photoHeroTestHooks.balanceItem(input, "");
    const renderedDescription = hooks.renderItemDescriptionForTest(item);
    const score = hooks.scoreItemForTest(item);
    const quality = hooks.getItemQualityForTest(score);
    return { item, renderedDescription, score, quality };
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
      shieldFiveScore: score({ stats: { shield: 5 }, skipSpecialRoll: true }),
      shieldFiveQuality: quality({ stats: { shield: 5 }, skipSpecialRoll: true }),
      rawValueShieldScore: score(rawValueShield),
      rawValueShieldQuality: quality(rawValueShield),
      shieldWithSpecialScore: score(shieldWithSpecial),
      shieldWithSpecialQuality: quality(shieldWithSpecial),
    };
    const specialValues = {
      heavyStrike: hooks.getSpecialEffectValueForTest?.("heavyStrike"),
      bloodrage: hooks.getSpecialEffectValueForTest?.("bloodrage"),
    };
    const parsedRecognizedMouse = hooks.parseModelTextForTest?.(JSON.stringify({
      itemName: "符石护符",
      subjectName: "护符",
      objectType: "幻想道具",
      objectiveAssessment: "客观评价：一个上圆下窄的封闭轮廓，中间横线分出左右按键，顶部中央有滚轮，主体完整。",
      subjectCandidates: [
        { name: "鼠标", category: "电脑外设", evidence: ["圆角外轮廓", "左右按键分割线", "中间滚轮"], missing: ["没有线缆"], confidence: 0.9 },
        { name: "护符", category: "幻想道具", evidence: ["轮廓较圆"], missing: ["没有吊环"], confidence: 0.2 },
      ],
      recognizedSubject: "鼠标",
      recognition: "recognizable_object",
      visualEvidence: ["圆角外轮廓", "左右按键分割线", "中间滚轮"],
      identityDescription: "白色底上有一个黑线鼠标轮廓，顶部圆、底部略窄，中间有滚轮和按键分割线。",
      description: "符石护符在塔里压住敌人的视线。",
      reason: "主体=鼠标；证据=按键分割线和滚轮；模型误命名为护符。",
      tags: ["鼠标", "外设"],
      value: 14,
      photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 2, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "shield", score: 3 }, { stat: "speed", score: 2 }],
      specialAffinity: ["shieldCrashAttackDown"],
    }), { sourceMode: "drawing" });
    const parsedPhotoBow = hooks.parseModelTextForTest?.(JSON.stringify({
      itemName: "长弓",
      subjectName: "弓箭",
      objectType: "手持器具",
      identityDescription: "照片主体是一把弓箭，弓身、弓弦和箭头清楚可见，属于可搬动器具，不是车辆或建筑。",
      description: "长弓的弧线适合在塔里拉开距离。",
      reason: "主体=弓箭；尺寸=手持；质量=清晰；倾向=攻击。",
      tags: ["弓箭", "弓弦", "箭头"],
      value: 14,
      tooLarge: true,
      isEquipable: false,
      photoQuality: { clarity: 3, subjectArea: 2, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      statAffinity: [{ stat: "attack", score: 3 }, { stat: "speed", score: 1 }],
    }), { sourceMode: "photo" });
    return {
      activeSpecial: activeSpecial || null,
      hp: hooks.getHeroStateForTest?.()?.hp,
      maxHp: heroStats.maxHp,
      itemCount: hooks.getInventoryForTest?.()?.filter(Boolean).length || 0,
      valueMapping,
      shieldEconomy,
      specialValues,
      parsedRecognizedMouse: parsedRecognizedMouse ? {
        itemName: parsedRecognizedMouse.itemName,
        value: parsedRecognizedMouse.value,
        specialEffects: parsedRecognizedMouse.specialEffects,
        drawingRecognition: parsedRecognizedMouse.drawingRecognition,
      } : null,
      parsedPhotoBow: parsedPhotoBow ? {
        itemName: parsedPhotoBow.itemName,
        tooLarge: parsedPhotoBow.tooLarge,
        isEquipable: parsedPhotoBow.isEquipable,
        value: parsedPhotoBow.value,
        stats: parsedPhotoBow.stats,
      } : null,
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
          score: result.score,
          quality: result.quality,
          description: result.renderedDescription,
        });
      }
  });
  if (runtimeChecks.activeSpecial?.key && runtimeChecks.activeSpecial.key !== "doubleStrikeSpeedDown") failures.push({ label: "active special should prefer strongest", activeSpecial: runtimeChecks.activeSpecial });
  if (runtimeChecks.hp !== undefined && runtimeChecks.maxHp !== undefined && runtimeChecks.hp > runtimeChecks.maxHp) failures.push({ label: "hp overflow after hp item", runtimeChecks });
  if (runtimeChecks.valueMapping?.low?.mappedValue !== 8 || runtimeChecks.valueMapping?.mid?.mappedValue !== 17 || runtimeChecks.valueMapping?.high?.mappedValue !== 26) {
    failures.push({ label: "photo score should linearly map to current value range", valueMapping: runtimeChecks.valueMapping });
  }
  if (runtimeChecks.shieldEconomy?.shieldFourScore !== 12 || runtimeChecks.shieldEconomy?.shieldFourQuality !== "common") {
    failures.push({ label: "shield +4 should score with weight 3", shieldEconomy: runtimeChecks.shieldEconomy });
  }
  if (runtimeChecks.shieldEconomy?.shieldFiveScore !== 15 || runtimeChecks.shieldEconomy?.shieldFiveQuality !== "rare") {
    failures.push({ label: "shield +5 should be rare after shield weight change", shieldEconomy: runtimeChecks.shieldEconomy });
  }
  if (runtimeChecks.shieldEconomy?.rawValueShieldScore !== 6 || runtimeChecks.shieldEconomy?.rawValueShieldQuality !== "common") {
    failures.push({ label: "raw value should not turn shield +2 into legendary", shieldEconomy: runtimeChecks.shieldEconomy });
  }
  if (runtimeChecks.shieldEconomy?.shieldWithSpecialScore !== 20 || runtimeChecks.shieldEconomy?.shieldWithSpecialQuality !== "epic") {
    failures.push({ label: "special effect value should still count toward shield item quality", shieldEconomy: runtimeChecks.shieldEconomy });
  }
  if (runtimeChecks.specialValues?.heavyStrike !== 14 || runtimeChecks.specialValues?.bloodrage !== 12) {
    failures.push({ label: "heavyStrike/bloodrage special values should match tuning", specialValues: runtimeChecks.specialValues });
  }
  if (!/鼠标/.test(runtimeChecks.parsedRecognizedMouse?.itemName || "") || /护符|盾|魔杖/.test(runtimeChecks.parsedRecognizedMouse?.itemName || "") || runtimeChecks.parsedRecognizedMouse?.specialEffects?.length) {
    failures.push({ label: "normalized model output should preserve drawing recognizedSubject", parsedRecognizedMouse: runtimeChecks.parsedRecognizedMouse });
  }
  if (!/弓|箭/.test(runtimeChecks.parsedPhotoBow?.itemName || "") || runtimeChecks.parsedPhotoBow?.tooLarge || !runtimeChecks.parsedPhotoBow?.isEquipable || runtimeChecks.parsedPhotoBow?.value <= 0) {
    failures.push({ label: "normalized model output should correct portable bow oversize rejection", parsedPhotoBow: runtimeChecks.parsedPhotoBow });
  }
  if (errors.length) failures.push({ label: "console errors", errors });

  console.log(JSON.stringify({
    runtimeChecks,
    results: results.map((result, index) => ({
      label: cases[index].label,
      itemName: result.item.itemName,
      value: result.item.value,
      stats: result.item.stats,
      score: result.score,
      quality: result.quality,
      description: result.renderedDescription,
    })),
    failures,
  }, null, 2));

  if (failures.length) process.exit(1);
})();
