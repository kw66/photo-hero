const STORAGE_KEYS = {
  config: "photoHero.config",
  save: "photoHero.save",
};

const SILICONFLOW_MODELS = [
  { value: "Qwen/Qwen3.6-35B-A3B" },
  { value: "Pro/moonshotai/Kimi-K2.6" },
  { value: "Pro/moonshotai/Kimi-K2.5" },
  { value: "Qwen/Qwen3.6-27B" },
  { value: "Qwen/Qwen3.5-397B-A17B" },
  { value: "Qwen/Qwen3.5-122B-A10B" },
];

const ZHIPU_MODELS = [
  { value: "glm-5v-turbo" },
];

const MICU_MODELS = [
  { value: "gpt-5.5" },
  { value: "gpt-5.4" },
  { value: "kimi-k2.5" },
  { value: "kimi-k2.6" },
  { value: "qwen3.5-plus" },
  { value: "qwen3.6-plus" },
];

const API_PRESETS = {
  siliconflow: {
    label: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen3.6-35B-A3B",
    models: SILICONFLOW_MODELS,
    note: "",
    links: [
      { label: "硅基流动邀请链接", url: "https://cloud.siliconflow.cn/i/GOrKhgP7" },
      { label: "API 文档", url: "https://docs.siliconflow.cn/" },
    ],
    supportsVision: true,
  },
  zhipu: {
    label: "智谱",
    baseUrl: "https://api.z.ai/api/paas/v4",
    model: "glm-5v-turbo",
    models: ZHIPU_MODELS,
    note: "",
    links: [
      { label: "智谱邀请链接", url: "https://www.bigmodel.cn/invite?icode=fXJBq%2BPW8gOvcw6tMwvM0nHEaazDlIZGj9HxftzTbt4%3D" },
      { label: "Z.AI API 文档", url: "https://docs.z.ai/" },
    ],
    supportsVision: true,
  },
  micu: {
    label: "米醋中转",
    baseUrl: "https://www.micuapi.ai/v1",
    model: "gpt-5.5",
    models: MICU_MODELS,
    note: "",
    links: [
      { label: "米醋邀请链接", url: "https://www.micuapi.ai/register?aff=5j18" },
      { label: "米醋文档", url: "https://docs.micuapi.ai/#/" },
    ],
    supportsVision: true,
  },
  custom: {
    label: "自定义",
    baseUrl: "",
    model: "",
    models: [],
    note: "",
    links: [],
    supportsVision: true,
  },
};

const customDraft = {
  baseUrl: "",
  model: "",
};

const providerApiKeys = {};

const equipmentVisibleSlots = 10;
const equipmentSlotLimit = 10;
const battleReportLimit = 18;
const modelMaxTokens = 512;
const modelImageDetail = "low";
const defaultPhotoValueMin = 5;
const defaultPhotoValueMax = 20;
const analysisImageMaxEdge = 1024;
const analysisImageQuality = 0.78;
const inventoryImageMaxEdge = 420;
const inventoryImageQuality = 0.72;
const maxFloor = 40;
const gameSaveVersion = 11;
const initialFilmRolls = 3;
const bossFloors = new Set([10, 20, 30, 40]);
const rewardBossFloors = new Set([25, 35, 38]);
const bossMonsterKeys = new Set(["skeletonCaptain", "vampire", "knightCaptain", "demon", "octopus", "dragon", "archmage"]);
const bossDropTypesByFloor = new Map([
  [10, new Set(["skeletonCaptain"])],
  [20, new Set(["vampire"])],
  [25, new Set(["octopus"])],
  [30, new Set(["knightCaptain"])],
  [35, new Set(["dragon"])],
  [38, new Set(["archmage"])],
  [40, new Set(["demon"])],
]);

const statLabels = {
  hp: "生命上限",
  attack: "攻",
  defense: "防",
  speed: "速",
  regen: "回",
  shield: "盾",
  lifesteal: "吸",
};

const statValueWeights = {
  hp: 1,
  attack: 5,
  defense: 6,
  speed: 15,
  shield: 3,
  lifesteal: 8,
  regen: 10,
};

const photoSpecialEffects = [
  { key: "killAttack", label: "每击杀8怪攻击+1", value: 12, kind: "killThreshold", threshold: 8, stat: "attack", amount: 1 },
  { key: "killDefense", label: "每击杀8怪防御+1", value: 15, kind: "killThreshold", threshold: 8, stat: "defense", amount: 1 },
  { key: "killShield", label: "每击杀4怪护盾+1", value: 10, kind: "killThreshold", threshold: 4, stat: "shield", amount: 1 },
  { key: "killSpeed", label: "每击杀12怪速度+1", value: 16, kind: "killThreshold", threshold: 12, stat: "speed", amount: 1 },
  { key: "dealDamageAttack", label: "造成伤害临时攻击+1", value: 15, kind: "dealDamageTemp", stat: "attack", amount: 1, cap: 10 },
  { key: "takeDamageDefense", label: "受到伤害临时防御+1", value: 15, kind: "takeDamageTemp", stat: "defense", amount: 1, cap: 8 },
  { key: "killMaxHp", label: "每次击杀生命上限+2", value: 15, kind: "killPermanent", stat: "hp", amount: 2 },
  { key: "killHpBoost", label: "每次击杀生命上限+8", value: 15, kind: "killPermanent", stat: "hp", amount: 8 },
  { key: "doubleStrikeSpeedDown", label: "速度-3，二连击", value: 16, kind: "passive", stat: "speed", amount: -3, doubleStrike: true },
  { key: "shieldCrashAttackDown", label: "攻击-3，附带当前护盾*0.5伤害", value: 16, kind: "passive", stat: "attack", amount: -3, shieldDamageRatio: 0.5 },
];

const photoSpecialEffectMap = new Map(photoSpecialEffects.map((effect) => [effect.key, effect]));

const portableEquipmentPattern = /锤|锤子|榔头|工具|扳手|螺丝刀|钳|剪刀|刀|指甲刀|键盘|鼠标|笔|尺子|直尺|卷尺|书|本|杯|瓶|伞|雨伞|镜|锅盖|盒|包|鞋|拖鞋|滑板|风扇|橡皮|橡皮擦|胶带|刷|梳|钥匙|锁|球|砖|石|玩具|摆件|模型|饰品|衣服|帽|手机|耳机|充电器|遥控器|椅|凳|小桌|台灯|相机|眼镜|贴纸|卡片|纸|包装|图案|屏幕|车模|小车|乐高|公仔|手办|盆栽|小物件|桌面物/i;
const oversizedScenePattern = /汽车|车辆|公交|火车|飞机|船|房|楼|建筑|天空|风景|街道|道路|山|海|河|湖|树|大型家具|床|沙发|衣柜|冰箱|洗衣机|大面积背景/i;
const explicitOversizePattern = /比人.{0,8}(大|高)|比一个人.{0,8}(大|高)|尺寸.{0,8}(超过|大于|高于).{0,4}人|人.{0,4}(还要)?大|巨大|无法搬动|不能搬动|主要是.{0,6}(场景|背景)|大面积背景/i;

const photoIdentificationSystemPrompt = [
  "你是《照片勇者》的照片装备鉴定器，也是低数值 RPG 装备设计师。",
  "你必须只输出一个 JSON 对象，不要 Markdown，不要代码块，不要额外解释。",
  "第一字符必须是 {，最后一个字符必须是 }。",
  "你的目标不是保守拒绝，而是把现实照片里的主要物品转成有趣、低数值、可解释的装备。",
].join("\n");

const photoIdentificationUserPrompt = [
  "请鉴定图片里的一个主要物品，生成《照片勇者》装备 JSON。",
  "",
  "识别规则：",
  "1. 先找画面中最主要、最像单个实体的物品；忽略背景、桌面、墙面和无关杂物。",
  "2. 只要主体不明显比成年人更大，就视为可装备道具。可装备不等于能穿戴，杯子、书、工具、玩具、贴纸、纸面图案、键盘、椅子、小桌、小电器、小摆件都可以。",
  "3. 只有主体明显大于成年人，或图片主要是场景/背景/交通工具/建筑/天空/道路/山海河湖时，才允许 tooLarge=true。",
  "4. 如果画面是卡通图案、贴纸、屏幕里的图案、包装上的图案，只要承载它的物品不是巨大场景，就按小物件鉴定，不要直接拒绝。",
  "",
  "必须输出这个 JSON 结构，字段名使用英文：",
  "{\"itemName\":\"短装备名\",\"objectType\":\"主体物品类型\",\"value\":0,\"tooLarge\":false,\"stats\":{\"hp\":0,\"attack\":0,\"defense\":0,\"speed\":0,\"shield\":0,\"lifesteal\":0,\"regen\":0},\"specialEffects\":[],\"description\":\"面向玩家的一句短描述\",\"reason\":\"一句短判断依据\",\"tags\":[\"标签\"],\"confidence\":0.0}",
  "",
  "价值规则：",
  "1. tooLarge=true 时 value=0、所有 stats=0、specialEffects=[]。",
  `2. 可装备时 value 默认是 ${defaultPhotoValueMin} 到 ${defaultPhotoValueMax} 的整数；游戏奖励可能提高这个范围，最终以本地规则为准。基础 ${defaultPhotoValueMin} 分；主体清楚 +3；主体占图面积大 +3；背景干净 +2；现实拍摄感强 +3；光线/对焦好 +2；物品有趣、让人想装备 +2；默认封顶 ${defaultPhotoValueMax}。`,
  "3. 价值不是价格，不是越精美越高，也不是越破旧越高；优先奖励清晰、有主体、有生活感、有趣。",
  "",
  "属性预算：",
  "生命上限 hp 每点价值 1；攻击 attack 每点价值 5；防御 defense 每点价值 6；速度 speed 每点价值 15；护盾 shield 每点价值 3；吸血 lifesteal 每点价值 8；回复 regen 每点价值 10。",
  "stats 的总价值 + specialEffects 的价值不得超过 value。低价值装备宁可只给 1 到 2 种属性，不要平均撒点。",
  "",
  "属性语义：",
  "食物、饮料、药品、植物、柔软温暖物品：优先 hp/regen。",
  "工具、硬物、敲击物、键盘鼠标、笔、砖石、运动器材：优先 attack，次选 defense/hp。",
  "容器、盒、包、锅盖、伞、镜子、壳、套、头盔、防护用品：优先 shield/defense。",
  "鞋、轮子、滑板、风扇、空气流动、轻便快速、遥控器：优先 speed；没有运动/气流/轮/鞋含义时不要给高 speed。",
  "刀、剪刀、针、钩、指甲刀、尖锐小工具、吸附/抽取/红色血感物品：可给 lifesteal；没有尖锐/吸附/夺取含义时不要给 lifesteal。",
  "电池、充电器、线缆、灯、喷雾、清洁用品：按用途给 shield/regen/speed/attack，不要机械固定。",
  "",
  `特殊效果只能从这些 key 里选，且只能在语义合适并且预算足够时给 0 或 1 个：${photoSpecialEffects.map((effect) => `${effect.key}=${effect.label}(价值${effect.value})`).join("；")}。`,
  "工具、武器、越打越顺手的物品可选 dealDamageAttack；盾牌、外壳、硬保护物可选 takeDamageDefense 或 shieldCrashAttackDown；奖杯、种子、书、训练器、成长感物品可选 killAttack/killDefense/killShield/killSpeed/killMaxHp/killHpBoost；鞋、风扇、滑板、双件物品可选 doubleStrikeSpeedDown。",
  "",
  "命名和描述：",
  "itemName 要具体、短、有画面感，例如 蓝柄剪刀、旧陶瓷杯、青蛙贴纸、黑色键盘；不要叫 照片装备、神秘物品。",
  "description 用一句中文说明为什么这些属性合理，不要列 rarity/价值/是否装备。",
  "reason 只写一句内部依据，越短越好。",
].join("\n");

const statOrder = ["hp", "attack", "defense", "speed", "shield", "lifesteal", "regen"];

const heroForms = [
  { id: "hp", label: "生命", image: "form-hp.png", stats: { hp: 30 }, desc: "生命上限 +30" },
  { id: "attack", label: "攻击", image: "form-attack.png", stats: { attack: 2 }, desc: "攻击 +2" },
  { id: "lifesteal", label: "吸血", image: "form-lifesteal.png", stats: { lifesteal: 1 }, desc: "吸血 +1" },
  { id: "regen", label: "回复", image: "form-regen.png", stats: { regen: 1 }, desc: "回复 +1" },
  { id: "speed", label: "速度", image: "form-speed.png", stats: { speed: 1 }, desc: "速度 +1" },
  { id: "defense", label: "防御", image: "form-defense.png", stats: { defense: 2 }, desc: "防御 +2" },
  { id: "shield", label: "护盾", image: "form-shield.png", stats: { shield: 10 }, desc: "护盾 +10" },
  { id: "greedy", label: "财迷", image: "form-greedy.png", stats: {}, filmDropBonus: 1, desc: "胶卷掉落 +0.1" },
  { id: "angry", label: "愤怒", image: "form-angry.png", stats: { attack: 5, defense: 5 }, noFilmDrop: true, desc: "攻防 +5，不获得胶卷" },
];

const heroFormMap = new Map(heroForms.map((form) => [form.id, form]));
const defaultHeroFormId = heroForms[0].id;
const heroFormImageBase = "./assets/heroes/";
const monsterImageBase = "./assets/monsters/";

const monsterImages = {
  slime: "slime.png",
  skeleton: "skeleton.png",
  bat: "bat.png",
  mage: "mage.png",
  wizard: "wizard.png",
  guard: "guard.png",
  knight: "knight.png",
  golem: "golem.png",
  patrol: "patrol.png",
  octopus: "octopus.png",
  dragon: "dragon.png",
  vampire: "vampire.png",
  demon: "demon.png",
  orc: "orc.png",
  swordsman: "swordsman.png",
  warrior: "warrior.png",
  archmage: "archmage.png",
  skeletonCaptain: "skeleton-captain.png",
  knightCaptain: "knight-captain.png",
};

const monsterTypes = {
  slime: { name: "史莱姆", atk: 6, def: 0, hp: 20, speed: 2, traits: [{ type: "regen", value: 1, text: "回复1" }] },
  skeleton: { name: "骷髅", atk: 8, def: 5, hp: 36, speed: 3, traits: [{ type: "noLifesteal", text: "制裁：无法吸血" }] },
  bat: { name: "蝙蝠", atk: 9, def: 0, hp: 24, speed: 8, traits: [{ type: "lifesteal", value: 1, text: "吸血1" }] },
  mage: { name: "法师", atk: 10, def: 2, hp: 30, speed: 3, traits: [{ type: "magic", text: "魔攻：无视防御" }] },
  wizard: { name: "巫师", atk: 12, def: 6, hp: 42, speed: 4, traits: [{ type: "magic", text: "魔攻：无视防御" }] },
  guard: { name: "卫兵", atk: 8, def: 8, hp: 60, speed: 2, traits: [{ type: "shield", value: 20, text: "护盾20" }] },
  knight: { name: "骑士", atk: 15, def: 6, hp: 45, speed: 4, traits: [{ type: "noRegen", text: "红莲：无法回复" }] },
  golem: { name: "石头人", atk: 9, def: 16, hp: 8, speed: 1, traits: [{ type: "sturdy", text: "坚固：每回合最多受到1伤害" }] },
  patrol: { name: "警卫", atk: 16, def: 6, hp: 50, speed: 4, traits: [{ type: "ignoreShield", text: "无视护盾" }] },
  octopus: { name: "章鱼", atk: 18, def: 0, hp: 120, speed: 3, traits: [{ type: "regen", value: 20, text: "回复20" }] },
  dragon: { name: "魔龙", atk: 24, def: 10, hp: 80, speed: 4, traits: [{ type: "heroSpeedDown", value: 3, text: "龙威：勇士速度-3" }] },
  vampire: { name: "吸血鬼", atk: 15, def: 6, hp: 66, speed: 7, traits: [{ type: "lifesteal", value: 6, text: "吸血6" }] },
  demon: { name: "魔王", atk: 25, def: 15, hp: 75, speed: 5, traits: [{ type: "heroAttackDown", value: 5, text: "压制：勇士攻击-5" }] },
  orc: { name: "兽人", atk: 10, def: 8, hp: 60, speed: 3, traits: [{ type: "regen", value: 4, text: "回复4" }] },
  swordsman: { name: "剑士", atk: 30, def: 0, hp: 20, speed: 6, traits: [{ type: "multiHit", value: 2, text: "连击2" }] },
  warrior: { name: "战士", atk: 15, def: 12, hp: 40, speed: 3, traits: [{ type: "noRegen", text: "红莲：无法回复" }] },
  archmage: { name: "大法师", atk: 20, def: 8, hp: 72, speed: 5, traits: [{ type: "magic", text: "魔攻：无视防御" }] },
  skeletonCaptain: { name: "骷髅队长", atk: 12, def: 6, hp: 44, speed: 3, traits: [{ type: "noLifesteal", text: "制裁：无法吸血" }] },
  knightCaptain: { name: "骑士队长", atk: 14, def: 5, hp: 40, speed: 4, traits: [{ type: "shield", value: 40, text: "护盾40" }] },
};

const normalMonsterUnlocks = [
  { floor: 1, key: "slime", weight: 20, tier: 1 },
  { floor: 2, key: "bat", weight: 9, tier: 1 },
  { floor: 3, key: "skeleton", weight: 9, tier: 1 },
  { floor: 4, key: "mage", weight: 7, tier: 2 },
  { floor: 6, key: "orc", weight: 7, tier: 2 },
  { floor: 8, key: "golem", weight: 5, tier: 2 },
  { floor: 11, key: "wizard", weight: 6, tier: 3 },
  { floor: 13, key: "guard", weight: 5, tier: 3 },
  { floor: 15, key: "knight", weight: 6, tier: 3 },
  { floor: 17, key: "patrol", weight: 5, tier: 4 },
  { floor: 21, key: "warrior", weight: 5, tier: 4 },
  { floor: 23, key: "swordsman", weight: 4, tier: 4 },
];

const els = {
  playerHpText: byId("playerHpText"),
  playerHpBar: byId("playerHpBar"),
  playerAtk: byId("playerAtk"),
  playerDef: byId("playerDef"),
  playerSpeed: byId("playerSpeed"),
  playerRegen: byId("playerRegen"),
  playerShield: byId("playerShield"),
  playerLifesteal: byId("playerLifesteal"),
  heroAvatarImage: byId("heroAvatarImage"),
  formGrid: byId("formGrid"),
  floorText: byId("floorText"),
  enemyField: byId("enemyField"),
  attackBtn: byId("attackBtn"),
  fleeBtn: byId("fleeBtn"),
  resetGameBtn: byId("resetGameBtn"),
  fileInput: byId("fileInput"),
  filmCountBadge: byId("filmCountBadge"),
  configToggleBtn: byId("configToggleBtn"),
  secondaryArea: byId("secondaryArea"),
  presetNote: byId("presetNote"),
  providerLinks: byId("providerLinks"),
  baseUrlInput: byId("baseUrlInput"),
  apiKeyInput: byId("apiKeyInput"),
  toggleKeyBtn: byId("toggleKeyBtn"),
  presetModelField: byId("presetModelField"),
  modelInput: byId("modelInput"),
  customModelField: byId("customModelField"),
  customModelInput: byId("customModelInput"),
  saveConfigBtn: byId("saveConfigBtn"),
  testChatBtn: byId("testChatBtn"),
  chatResult: byId("chatResult"),
  equipmentGrid: byId("equipmentGrid"),
  equipmentDetail: byId("equipmentDetail"),
  equipmentDetailName: byId("equipmentDetailName"),
  equipmentDetailStats: byId("equipmentDetailStats"),
  equipmentDetailDesc: byId("equipmentDetailDesc"),
  equipmentActions: byId("equipmentActions"),
  photoActionBtn: byId("photoActionBtn"),
  analyzePhotoBtn: byId("analyzePhotoBtn"),
  pendingPhotoPreview: byId("pendingPhotoPreview"),
  pendingPhotoImage: byId("pendingPhotoImage"),
  discardItemBtn: byId("discardItemBtn"),
  loadingState: byId("loadingState"),
  battleLog: byId("battleLog"),
  imageViewer: byId("imageViewer"),
  imageViewerImage: byId("imageViewerImage"),
  imageViewerCaption: byId("imageViewerCaption"),
};

const state = {
  player: createDefaultPlayer(),
  runSeed: makeRunSeed(),
  floor: 1,
  encounterId: "",
  enemies: [],
  selectedEnemyIds: [],
  activeEnemyIds: [],
  battleClock: null,
  battleReports: [],
  battleReportSeq: 0,
  currentBattle: null,
  infoMode: "item",
  gameClear: false,
  bossReward: null,
  photoValueMin: defaultPhotoValueMin,
  photoValueMax: defaultPhotoValueMax,
  globalFilmDropBonus: 0,
  inventory: createEmptyInventorySlots(),
  selectedSlotIndex: 0,
  pendingPhotoSlotIndex: 0,
  selectedItemId: "",
  lastPhoto: "",
  latestItem: null,
  filmShards: 0,
  filmRolls: initialFilmRolls,
  lootError: "",
  log: ["选择空装备格，在详情栏拍照鉴定。"],
  autoBattleTimer: 0,
  battleSpecial: createDefaultBattleSpecial(),
  testEnemyOverride: null,
  enemyFlipEncounterId: "",
  enemyFaceDownIds: new Set(),
  enemyFlipDownIds: new Set(),
  enemyFlipUpIds: new Set(),
  battleStartTimer: 0,
  battleRevealTimer: 0,
  floorAdvanceTimer: 0,
  pendingFloorAdvance: false,
};

loadConfig();
loadSave();
ensureEncounter();
bindEvents();
render();

function bindEvents() {
  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => setSecondaryPanel(button.dataset.panelTarget || "none"));
  });

  document.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset || "custom", true));
  });

  [els.baseUrlInput, els.modelInput, els.customModelInput, els.apiKeyInput].forEach((input) => {
    input.addEventListener("input", () => {
      if (getActivePresetId() === "custom") {
        rememberCustomDraft();
      }

      renderApiStatus();

      if (els.chatResult.dataset.state === "missing") {
        setChatResult("配置已更新，可以重新测试。");
      }
    });
  });

  [els.modelInput].forEach((input) => {
    input.addEventListener("change", () => {
      if (getActivePresetId() === "custom") {
        rememberCustomDraft();
      }
      renderApiStatus();
    });
  });

  els.fileInput.addEventListener("change", async () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;
    await preparePhotoFromFile(file, "", "照片读取失败");
  });

  document.addEventListener("paste", handlePasteEvent);

  els.equipmentDetail.addEventListener("click", handleEquipmentDetailClick);
  els.equipmentDetail.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleEquipmentDetailClick(event);
  });
  document.addEventListener("click", handleDocumentClickForInfoMode);
  els.saveConfigBtn.addEventListener("click", saveConfig);
  els.testChatBtn.addEventListener("click", testVisionApi);
  els.toggleKeyBtn.addEventListener("click", toggleApiKeyVisibility);
  els.attackBtn.addEventListener("click", toggleAutoBattle);
  els.fleeBtn.addEventListener("click", fleeBattle);
  els.resetGameBtn.addEventListener("click", resetGame);
  els.photoActionBtn.addEventListener("click", openPhotoPickerForSelectedSlot);
  els.analyzePhotoBtn.addEventListener("click", analyzePhoto);
  els.pendingPhotoPreview.addEventListener("click", () => openImageViewer(state.lastPhoto, "待鉴定照片"));
  els.discardItemBtn.addEventListener("click", dismantleSelectedItem);
  els.imageViewer.addEventListener("click", closeImageViewer);
  renderHeroForms();
}

function openPhotoPicker() {
  els.fileInput.value = "";
  els.fileInput.click();
}

function openPhotoPickerForSelectedSlot() {
  if (isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || state.bossReward) return;
  const index = getSelectedSlotIndex();
  if (getInventoryItemAt(index)) return;
  state.pendingPhotoSlotIndex = index;
  state.infoMode = "item";
  openPhotoPicker();
}

function handleEquipmentDetailClick(event) {
  if (event.target.closest("button")) return;
}

function handleDocumentClickForInfoMode(event) {
  if (event.target.closest("#fileInput")) return;
  if (event.target.closest(".equipment-slot, .equipment-detail, .image-viewer, .secondary-area, [data-panel-target], .preset-button")) {
    return;
  }
  if (hasPendingPhoto()) return;
  if (state.infoMode === "item") {
    state.infoMode = "log";
    renderEquipmentDetail();
  }
}

function openImageViewer(src, caption = "") {
  if (!src) return;
  els.imageViewerImage.src = src;
  els.imageViewerCaption.textContent = caption;
  els.imageViewer.hidden = false;
}

function closeImageViewer() {
  els.imageViewer.hidden = true;
  els.imageViewerImage.removeAttribute("src");
  els.imageViewerCaption.textContent = "";
}

function toggleApiKeyVisibility() {
  const showing = els.apiKeyInput.type === "text";
  const label = showing ? "显示 API Key" : "隐藏 API Key";
  els.apiKeyInput.type = showing ? "password" : "text";
  els.toggleKeyBtn.classList.toggle("is-visible", !showing);
  els.toggleKeyBtn.setAttribute("aria-label", label);
  els.toggleKeyBtn.querySelector(".visually-hidden").textContent = label;
}

function setSecondaryPanel(panelId) {
  const target = ["config", "forms"].includes(panelId) ? panelId : "";
  els.secondaryArea.classList.toggle("is-collapsed", !target);

  document.querySelectorAll(".secondary-content").forEach((panel) => {
    panel.hidden = panel.dataset.secondaryPanel !== target;
  });

  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.panelTarget === target));
  });
}

function applyPreset(presetId, persist = false) {
  rememberCurrentApiKey();
  if (persist && getActivePresetId() === "custom" && presetId !== "custom") {
    rememberCustomDraft();
  }

  const preset = API_PRESETS[presetId] || API_PRESETS.custom;
  const isCustom = presetId === "custom";
  const selectedModel = isCustom ? customDraft.model : preset.model;

  if (isCustom) {
    els.baseUrlInput.value = customDraft.baseUrl;
    els.customModelInput.value = customDraft.model;
  } else {
    els.baseUrlInput.value = preset.baseUrl;
    els.customModelInput.value = preset.editableModel ? customDraft.model : "";
  }
  els.apiKeyInput.value = providerApiKeys[presetId] || "";
  renderModelOptions(preset, selectedModel);

  els.baseUrlInput.readOnly = !isCustom;
  els.baseUrlInput.classList.toggle("is-locked", !isCustom);
  els.presetModelField.hidden = isCustom || Boolean(preset.editableModel);
  els.customModelField.hidden = !isCustom && !preset.editableModel;
  if (preset.editableModel) {
    els.customModelInput.value = selectedModel || customDraft.model;
  }
  els.presetNote.textContent = preset.note;
  els.presetNote.hidden = !preset.note;
  renderProviderLinks(preset);

  document.querySelectorAll(".preset-button").forEach((button) => {
    const isActive = button.dataset.preset === presetId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    saveConfig(false);
    setChatResult(`${preset.label} 已选中。`);
  } else {
    renderApiStatus();
  }
}

function renderModelOptions(preset, selectedModel) {
  els.modelInput.innerHTML = "";
  const options = preset.models?.length
    ? preset.models
    : selectedModel
      ? [{ value: selectedModel }]
      : [{ value: "", label: "手动填写下方模型名" }];

  for (const model of options) {
    const option = document.createElement("option");
    option.value = model.value;
    option.textContent = model.label || model.value;
    els.modelInput.append(option);
  }

  const values = new Set(options.map((model) => model.value));
  els.modelInput.value = values.has(selectedModel) ? selectedModel : options[0]?.value || "";
}

function renderProviderLinks(preset) {
  els.providerLinks.innerHTML = "";

  if (!preset.links?.length) {
    const hint = document.createElement("span");
    hint.textContent = "自定义接口请优先使用服务商官网提供的 API Key 和文档。";
    els.providerLinks.append(hint);
    return;
  }

  for (const link of preset.links) {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;
    els.providerLinks.append(anchor);
  }
}

function getActivePresetId() {
  return document.querySelector(".preset-button.is-active")?.dataset.preset || "siliconflow";
}

function rememberCurrentApiKey() {
  const activePreset = document.querySelector(".preset-button.is-active")?.dataset.preset;
  if (!API_PRESETS[activePreset]) return;
  providerApiKeys[activePreset] = els.apiKeyInput.value.trim();
}

function rememberCustomDraft() {
  customDraft.baseUrl = els.baseUrlInput.value;
  customDraft.model = els.customModelInput.value || els.modelInput.value;
}

async function preparePhotoFromFile(file, successMessage, errorPrefix) {
  if (isPlayerDefeated() || state.bossReward) return;
  setBusy("处理图片...");
  try {
    state.lastPhoto = await compressImage(file);
    state.pendingPhotoSlotIndex = getSelectedSlotIndex();
    state.lootError = "";
    state.infoMode = "item";
    renderCameraStatus();
    if (successMessage) {
      addLog(successMessage);
      showInputNotice(successMessage);
    } else {
      setBusy("");
    }
    render();
  } catch (error) {
    showInputNotice(`${errorPrefix}：${error.message || "无法处理该图片"}`);
  } finally {
    if (els.loadingState.dataset.notice !== "true") setBusy("");
    renderGameTextOnly();
  }
}

async function handlePasteEvent(event) {
  const file = getImageFileFromDataTransfer(event.clipboardData);
  if (!file) return;
  event.preventDefault();
  await preparePhotoFromFile(file, "", "粘贴图片失败");
}

function getImageFileFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return null;

  const file = Array.from(dataTransfer.files || []).find((item) => item.type?.startsWith("image/"));
  if (file) return file;

  const item = Array.from(dataTransfer.items || []).find((entry) => entry.kind === "file" && entry.type?.startsWith("image/"));
  const blob = item?.getAsFile?.();
  return blob || null;
}

function showInputNotice(message) {
  if (!message) return;
  addLog(message);
  els.loadingState.textContent = message;
  els.loadingState.dataset.notice = "true";
}

async function testVisionApi() {
  const config = getConfigFromInputs();
  const missing = getMissingConfigFields(config);

  if (missing.length) {
    setChatResult(`缺少配置：${missing.join("、")}。`, true, "missing");
    addLog("图文模型测试缺少配置。");
    render();
    return;
  }

  saveConfig(false);
  els.testChatBtn.disabled = true;
  setChatResult("正在测试图文模型...");

  try {
    const content = await callVisionText(config, makeVisionTestImage());
    setChatResult(formatVisionTestResult(content), false);
    addLog("图文模型测试成功。");
  } catch (error) {
    setChatResult(normalizeAnalyzeError(error), true);
    addLog("图文模型测试失败。");
  } finally {
    els.testChatBtn.disabled = false;
    render();
  }
}

async function callVisionText(config, image) {
  let response;
  const body = withProviderRequestOptions(config, {
    model: config.model,
    temperature: 0.2,
    max_tokens: 96,
    messages: [
      {
        role: "system",
        content: "只输出最终回答，不要输出分析过程、步骤、编号或 Markdown。",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "请识别图片文字，只回复一句中文，格式为“图文模型测试成功：图片里写着……”。不要解释。",
          },
          {
            type: "image_url",
            image_url: { url: image, detail: modelImageDetail },
          },
        ],
      },
    ],
  });

  try {
    response = await fetch(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `浏览器直连失败：${error.message || "请求被浏览器拦截"}。如果这是 CORS 错误，说明该 API 不允许网页直接调用。`,
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(readUpstreamError(payload) || `模型接口返回 ${response.status}`);
  }

  const content = readModelText(payload);
  if (content) return content;
  const reasoning = readModelText(payload, { reasoningOnly: true });
  if (reasoning) return reasoning;
  throw new Error(`模型没有返回最终文本内容。响应结构：${summarizePayloadShape(payload)}`);
}

function formatVisionTestResult(content) {
  const text = normalizeModelContent(content);
  if (!text) return "模型返回为空。";

  const lines = text
    .split(/\r?\n+/)
    .map(cleanModelDisplayLine)
    .filter(Boolean);
  let successIndex = -1;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index].includes("图文模型测试成功")) {
      successIndex = index;
      break;
    }
  }

  if (successIndex >= 0) {
    const successLine = lines[successIndex];
    if (/图片|写着|VISION OK|照片勇者/i.test(successLine)) {
      return shortenText(successLine.replace(/\s+/g, " "), 120);
    }

    const imageLine = lines
      .slice(Math.max(0, successIndex - 4), successIndex)
      .reverse()
      .find((line) => /图片|写着|VISION OK|照片勇者/i.test(line) && !/分析|要求|步骤|构建|检查/.test(line));
    if (imageLine) {
      return shortenText(`图文模型测试成功：${imageLine}`.replace(/\s+/g, " "), 120);
    }

    return shortenText(successLine.replace(/\s+/g, " "), 120);
  }

  return shortenText(lines.join(" ").replace(/\s+/g, " "), 120);
}

function cleanModelDisplayLine(line) {
  return String(line || "")
    .trim()
    .replace(/^\s*(?:[-*•]\s*)+/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function setChatResult(message, isError = false, stateName = "") {
  els.chatResult.textContent = message;
  els.chatResult.style.color = isError ? "var(--red)" : "var(--ink)";
  els.chatResult.dataset.state = stateName || (isError ? "error" : "ok");
}

function getMissingConfigFields(config) {
  const missing = [];
  if (!config.baseUrl) missing.push("API Base URL");
  if (!config.model) missing.push("Model");
  if (!config.apiKey) missing.push("API Key");
  return missing;
}

async function analyzePhoto() {
  if (isPlayerDefeated() || state.bossReward) return;
  if (!state.lastPhoto) {
    addLog("还没有照片。");
    render();
    return;
  }

  const targetSlot = clampSlotIndex(state.pendingPhotoSlotIndex);
  if (getInventoryItemAt(targetSlot)) {
    const message = "当前装备格已有装备，请先选择空装备格。";
    showLootError(message);
    addLog(message);
    render();
    return;
  }

  if (state.filmRolls < 1) {
    const message = "需要先获得胶卷：每击败 1 个怪物获得胶卷 +0.1。";
    showLootError(message);
    addLog(message);
    render();
    return;
  }

  const config = getConfigFromInputs();
  if (!config.baseUrl || !config.apiKey || !config.model) {
    addLog("先填写并保存 API 地址、Key 和模型名。");
    render();
    return;
  }

  if (!isLikelyVisionModel(config)) {
    const message =
      "当前模型看起来不支持图片输入；照片鉴定请换成支持 vision/image_url 的模型。";
    showLootError(message);
    addLog("图片鉴定需要视觉模型。");
    render();
    return;
  }

  saveConfig(false);
  setBusy("鉴定中...");
  render();
  try {
    const item = await analyzeDirectly(config, state.lastPhoto);
    const inventoryImage = await makeInventoryImage(state.lastPhoto);
    consumeFilm();
    receiveItem(balanceItem(item, inventoryImage), "鉴定完成。");
  } catch (error) {
    const message = normalizeAnalyzeError(error);
    showLootError(`鉴定失败：${message}（胶卷未消耗）`);
    addLog(`鉴定失败：${message}（胶卷未消耗）`);
  } finally {
    setBusy("");
    render();
  }
}

function isLikelyVisionModel(config) {
  const baseUrl = config.baseUrl.toLowerCase();

  return true;
}

function normalizeAnalyzeError(error) {
  const message = error?.message || "未知错误";
  if (
    message.includes("unknown variant `image_url`") ||
    message.includes("expected `text`") ||
    message.toLowerCase().includes("image_url")
  ) {
    return "当前接口不接受图片输入，请换成支持 vision/image_url 的模型。";
  }
  return message;
}

function showLootError(message) {
  state.latestItem = null;
  state.lootError = message;
}

async function analyzeDirectly(config, image) {
  let response;
  const body = withProviderRequestOptions(config, {
    model: config.model,
    temperature: 0.35,
    max_tokens: modelMaxTokens,
    messages: [
      {
        role: "system",
        content: photoIdentificationSystemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: getPhotoIdentificationPrompt(),
          },
          {
            type: "image_url",
            image_url: { url: image, detail: modelImageDetail },
          },
        ],
      },
    ],
  });

  try {
    response = await fetch(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `浏览器直连失败：${error.message || "请求被浏览器拦截"}。常见原因是模型服务没有允许 CORS。`,
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(readUpstreamError(payload) || `模型接口返回 ${response.status}`);
  }

  const finalText = readModelText(payload);
  if (finalText) return extractJson(finalText, payload);

  const reasoningText = readModelText(payload, { reasoningOnly: true });
  if (reasoningText) {
    return extractJson(reasoningText, payload);
  }

  return extractJson("", payload);
}

function withProviderRequestOptions(config, body) {
  const next = { ...body };
  if (shouldDisableThinking(config)) {
    next.enable_thinking = false;
    next.thinking = { type: "disabled" };
  }
  return next;
}

function shouldDisableThinking(config) {
  const preset = String(config?.presetId || "").toLowerCase();
  const baseUrl = String(config?.baseUrl || "").toLowerCase();
  const model = String(config?.model || "").toLowerCase();
  return preset === "siliconflow" || baseUrl.includes("siliconflow") || model.includes("qwen");
}

function buildChatEndpoint(input) {
  const raw = String(input).trim();
  const url = new URL(raw);
  const cleanPath = url.pathname.replace(/\/+$/, "");

  if (cleanPath.endsWith("/chat/completions")) {
    return url.toString();
  }

  url.pathname = `${cleanPath}/chat/completions`;
  return url.toString();
}

function getPhotoIdentificationPrompt() {
  return `${photoIdentificationUserPrompt}\n\n当前本局奖励后的有效价值范围：${getPhotoValueMin()} 到 ${getPhotoValueMax()}。可装备时 value 必须落在这个范围内，超过范围会被本地规则裁剪。`;
}

function readModelText(payload, options = {}) {
  const includeReasoning = Boolean(options.includeReasoning);
  const reasoningOnly = Boolean(options.reasoningOnly);
  const parts = [];
  const visit = (value, path = "", depth = 0) => {
    if (value == null || depth > 6) return;
    if (typeof value === "string") {
      if (isModelTextPath(path, { includeReasoning, reasoningOnly }) && value.trim()) parts.push(value.trim());
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}[${index}]`, depth + 1));
      return;
    }
    if (typeof value === "object") {
      const type = String(value.type || "").toLowerCase();
      if (!includeReasoning && !reasoningOnly && (type.includes("reasoning") || type.includes("thinking"))) return;
      if (reasoningOnly && type && !(type.includes("reasoning") || type.includes("thinking"))) return;
      for (const [key, next] of Object.entries(value)) {
        visit(next, path ? `${path}.${key}` : key, depth + 1);
      }
    }
  };

  visit(payload);
  return [...new Set(parts)].join("\n").trim();
}

function isModelTextPath(path, options = {}) {
  const includeReasoning = Boolean(options.includeReasoning);
  const reasoningOnly = Boolean(options.reasoningOnly);
  const normalized = String(path || "").toLowerCase();
  if (!normalized) return false;
  if (normalized.includes("prompt") || normalized.includes("system_fingerprint")) return false;
  if (normalized.includes("messages[") || normalized.includes(".request.")) return false;
  const isReasoningPath = /reasoning|thinking|chain_of_thought/.test(normalized);
  if (reasoningOnly) {
    return isReasoningPath && (normalized.endsWith(".message.reasoning_content") || normalized.endsWith(".delta.reasoning_content") || normalized.endsWith(".reasoning_content") || normalized.endsWith(".thinking"));
  }
  if (!includeReasoning && isReasoningPath) return false;
  const tokens = [
    ".message.content",
    ".delta.content",
    ".text",
    "output_text",
    ".output.content",
    ".content.text",
    ".result",
    ".reply",
    ".answer",
    ".response",
  ];
  if (includeReasoning) {
    tokens.push(".message.reasoning_content", ".delta.reasoning_content");
  }
  return tokens.some((token) => {
    const plain = token.replace(/^\./, "");
    return normalized === plain || normalized.endsWith(token) || normalized.includes(token);
  });
}

function extractJson(content, payload = null) {
  const text = normalizeModelContent(content);
  if (!text) {
    throw new Error(`模型没有返回文本内容。响应结构：${summarizePayloadShape(payload)}`);
  }

  const candidates = collectJsonCandidates(text);
  for (const candidate of candidates) {
    const parsed = parseJsonCandidate(candidate);
    if (parsed) return normalizeModelItem(parsed);
  }

  const fallback = makeFallbackItemFromModelText(text);
  if (fallback) return fallback;

  throw new Error(`模型返回了文本，但没有按 JSON 格式输出：${shortenText(text, 72)}`);
}

function normalizeModelContent(content) {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (typeof part?.text === "string") return part.text;
        if (typeof part?.content === "string") return part.content;
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  if (content && typeof content === "object") {
    if (typeof content.text === "string") return content.text.trim();
    if (typeof content.content === "string") return content.content.trim();
  }
  return "";
}

function summarizePayloadShape(payload) {
  if (!payload || typeof payload !== "object") return "空响应";
  const seen = new Set();
  const walk = (value, path = "$", depth = 0, output = []) => {
    if (output.length >= 18 || value == null || typeof value !== "object" || depth > 3 || seen.has(value)) return output;
    seen.add(value);
    const entries = Array.isArray(value)
      ? value.slice(0, 3).map((item, index) => [index, item])
      : Object.entries(value).slice(0, 12);
    for (const [key, next] of entries) {
      const nextPath = Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`;
      const type = Array.isArray(next) ? "array" : next === null ? "null" : typeof next;
      if (type === "string") {
        output.push(`${nextPath}: string(${shortenText(next, 32)})`);
      } else {
        output.push(`${nextPath}: ${type}`);
      }
      if (next && typeof next === "object") walk(next, nextPath, depth + 1, output);
      if (output.length >= 18) break;
    }
    return output;
  };
  return walk(payload).join("；") || "无法读取响应结构";
}

function collectJsonCandidates(text) {
  const normalized = String(text || "").trim();
  const candidates = [normalized];
  const fencedMatches = normalized.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi);
  for (const match of fencedMatches) {
    if (match[1]) candidates.push(match[1].trim());
  }

  let start = -1;
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        candidates.push(normalized.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return [...new Set(candidates.filter(Boolean))];
}

function parseJsonCandidate(candidate) {
  for (const text of makeJsonVariants(candidate)) {
    try {
      const parsed = JSON.parse(text);
      const object = pickJsonObject(parsed);
      if (object) return object;
    } catch {
      // Try the next relaxed variant.
    }
  }
  return null;
}

function makeJsonVariants(candidate) {
  const base = String(candidate || "")
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
  const relaxed = base
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    .replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, ': "$1"');
  return [...new Set([base, relaxed])];
}

function pickJsonObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (Array.isArray(value)) {
    return value.find((item) => item && typeof item === "object" && !Array.isArray(item)) || null;
  }
  return null;
}

function normalizeModelItem(raw) {
  const source = [raw?.equipment, raw?.result, raw?.data, raw?.item]
    .find((value) => value && typeof value === "object" && !Array.isArray(value)) || raw;
  const safe = source && typeof source === "object" ? source : {};
  const stats = normalizeModelStats(safe.stats || safe.attributes || safe["属性"] || {});
  const itemName = safe.itemName || safe.name || safe.item || safe["物品名称"] || safe["装备名"] || safe["名称"];
  const value = safe.value ?? safe.score ?? safe.quality ?? safe["价值"] ?? safe["品质"];
  const tooLarge = safe.tooLarge ?? safe.too_large ?? safe.oversized ?? safe["过大"] ?? safe["无法装备"];
  const objectType = safe.objectType || safe.object_type || safe.category || safe.type || safe["主体"] || safe["类型"];
  const tags = normalizeStringList(safe.tags || safe.keywords || safe["标签"] || safe["关键词"]);
  const reason = safe.reason || safe.analysis || safe.rationale || safe["理由"] || safe["判断依据"] || safe["分析"];
  const description = safe.description || safe.desc || safe["描述"] || reason;
  const specialEffects = safe.specialEffects || safe.special_effects || safe.effects || safe.special || safe.specialEffect || safe["特殊效果"] || safe["特效"];
  const cleanName = cleanText(itemName, "照片装备", 18);
  const rejected = parseBooleanLike(tooLarge);
  const contextText = [cleanName, objectType, description, reason, tags.join(" ")].filter(Boolean).join(" ");
  const correctedTooLarge = shouldTreatAsTooLarge(cleanName, contextText, rejected);
  return {
    itemName: cleanName,
    objectType: cleanText(objectType, "", 18),
    value: correctedTooLarge ? 0 : clampInt(value, getPhotoValueMin(), getPhotoValueMax()),
    tooLarge: correctedTooLarge,
    stats,
    specialEffects: normalizeSpecialEffects(specialEffects),
    description: cleanText(description, "由照片鉴定出的装备。", 72),
    reason: cleanText(reason, "", 72),
    tags,
    confidence: clampNumber(safe.confidence ?? safe["置信度"], 0, 1),
  };
}

function normalizeStringList(input) {
  const values = Array.isArray(input)
    ? input
    : typeof input === "string"
      ? input.split(/[，,、;；\s]+/)
      : [];
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))].slice(0, 8);
}

function shouldTreatAsTooLarge(itemName, description = "", modelRejected = false) {
  const text = `${itemName || ""} ${description || ""}`;
  if (isPortableEquipmentText(text)) return false;
  if (oversizedScenePattern.test(text) || explicitOversizePattern.test(text)) return true;
  return Boolean(modelRejected && explicitOversizePattern.test(text));
}

function isPortableEquipmentText(text) {
  return portableEquipmentPattern.test(String(text || ""));
}

function normalizeModelStats(stats) {
  const safe = stats && typeof stats === "object" ? stats : {};
  return normalizeStats({
    hp: safe.hp ?? safe.health ?? safe.maxHp ?? safe["生命"] ?? safe["生命上限"] ?? safe["血量"],
    attack: safe.attack ?? safe.atk ?? safe["攻击"] ?? safe["攻"],
    defense: safe.defense ?? safe.def ?? safe["防御"] ?? safe["防"],
    speed: safe.speed ?? safe.spd ?? safe["速度"] ?? safe["速"],
    shield: safe.shield ?? safe["护盾"] ?? safe["盾"],
    lifesteal: safe.lifesteal ?? safe.lifeSteal ?? safe["吸血"] ?? safe["吸"],
    regen: safe.regen ?? safe.recovery ?? safe.restore ?? safe["回复"] ?? safe["回"],
  }, 99);
}

function parseBooleanLike(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const text = String(value || "").trim().toLowerCase();
  return ["true", "yes", "1", "是", "对", "过大", "无法装备"].includes(text);
}

function makeFallbackItemFromModelText(text) {
  const source = String(text || "").trim();
  if (!source) return null;
  if (looksLikeVisionFailure(source)) {
    throw new Error(`模型返回了文本，但没有识别图片内容；请确认当前模型支持图片输入。原始回复：${shortenText(source, 72)}`);
  }

  const tooLarge = looksTooLargeFromText(source);
  const itemName = inferItemNameFromModelText(source) || (tooLarge ? inferRejectedItemNameFromText(source) : "");
  if (!itemName) return null;
  const correctedTooLarge = shouldTreatAsTooLarge(itemName, source, tooLarge);
  return {
    itemName,
    value: correctedTooLarge ? 0 : inferFallbackValue(source),
    tooLarge: correctedTooLarge,
    stats: {},
    description: cleanText(`按模型文字保守鉴定：${source}`, "由照片鉴定出的装备。", 72),
    reason: cleanText(source, "", 72),
    tags: normalizeStringList(source),
    confidence: 0.45,
  };
}

function looksLikeVisionFailure(text) {
  return /(?:无法|不能|看不到|未能|没有能力).{0,12}(?:图片|图像|照片)|(?:不支持|无法处理).{0,12}(?:图片|图像|image)|(?:作为|身为).{0,8}AI.{0,12}(?:无法|不能)/i.test(text);
}

function looksTooLargeFromText(text) {
  const source = String(text || "");
  if (isPortableEquipmentText(source)) return false;
  return /(?:tooLarge\s*=\s*true|too_large\s*=\s*true|风景|天空|建筑|真实汽车|大型汽车|车辆主体|房子|街道|道路|大型家具|大面积背景|比人.{0,8}(?:大|高)|尺寸.{0,8}(?:超过|大于|高于).{0,4}人|主要是.{0,6}(?:场景|背景))/i.test(source);
}

function inferItemNameFromModelText(text) {
  const patterns = [
    /(?:物品|主体|装备名|名称|itemName)\s*(?:是|为|[:：])\s*["“]?([^"，。；;\n]{1,18})/i,
    /(?:图中|图片里|照片里|画面中|这张图里)(?:主要)?(?:是|有|显示|看到)\s*(?:一个|一件|一把|一只|一台|一瓶|一双|一些|个)?\s*([^，。；;\n]{1,18})/,
    /这是\s*(?:一个|一件|一把|一只|一台|一瓶|一双|个)?\s*([^，。；;\n]{1,18})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const name = cleanupItemName(match?.[1] || "");
    if (name) return name;
  }
  return "";
}

function inferRejectedItemNameFromText(text) {
  const patterns = [
    /(?:这个|这张)?图片(?:是|为)\s*(?:一个|一件|一只|一张|个)?\s*([^，。；;\n]{1,18})/,
    /(?:图中|图片里|照片里|画面中)(?:主要)?(?:是|有|显示|看到)\s*(?:一个|一件|一只|一张|个)?\s*([^，。；;\n]{1,18})/,
    /不是(?:一个|一件|一只|一张|个)?\s*([^，。；;\n]{1,18})/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const name = cleanupItemName(match?.[1] || "");
    if (name) return name;
  }
  return "不可装备物";
}

function cleanupItemName(value) {
  return String(value || "")
    .replace(/[{}[\]"“”'‘’]/g, "")
    .replace(/^(现实生活中(?:的)?|可随身装备(?:的)?|清晰(?:的)?|普通(?:的)?|一张|一个|一件|一把|一只|一台|一瓶|一双|一幅|个)+/, "")
    .replace(/(?:等物品|这个物品|这件物品|也不是|不是现实|不是可|可以作为装备|根据规则).*$/, "")
    .trim()
    .slice(0, 18);
}

function inferFallbackValue(text) {
  if (/(?:清晰|主体突出|背景干净|占比大|有趣|动心)/.test(text)) return 12;
  if (/(?:模糊|杂乱|不清楚|遮挡|占比小)/.test(text)) return 6;
  return 8;
}

function shortenText(text, maxLength) {
  const source = String(text || "").replace(/\s+/g, " ").trim();
  return source.length > maxLength ? `${source.slice(0, maxLength)}...` : source;
}

function readUpstreamError(payload) {
  if (!payload) return "";
  const message =
    typeof payload.error === "string"
      ? payload.error
      : typeof payload.error?.message === "string"
        ? payload.error.message
        : typeof payload.message === "string"
          ? payload.message
          : "";

  if (/model disabled/i.test(message) || message.includes("模型已禁用")) {
    return "当前模型在服务商侧不可用或你的账号未开通；请换成服务商后台显示可用且支持图片输入的模型，或切到自定义复制后台模型名。";
  }

  return message;
}

function receiveItem(item, message) {
  const fullItem = {
    ...item,
    id: makeId("item"),
  };
  const targetSlot = Number.isInteger(state.pendingPhotoSlotIndex) ? state.pendingPhotoSlotIndex : getSelectedSlotIndex();
  state.lastPhoto = "";
  state.pendingPhotoSlotIndex = targetSlot;
  const rewardText = fullItem.tooLarge
    ? `${message} 记录 ${fullItem.itemName}，无法提供属性。`
    : `${message} 获得 ${fullItem.itemName}。`;
  addInventoryItem(fullItem, rewardText, targetSlot);
}

function getSelectedInventoryItem() {
  return getInventoryItemAt(getSelectedSlotIndex());
}

function addInventoryItem(item, message, preferredSlotIndex = getSelectedSlotIndex()) {
  state.latestItem = item;
  state.lootError = "";
  const oldStats = getPlayerStats();
  const slotIndex = addInventoryItemDirect(item, preferredSlotIndex);
  if (slotIndex < 0) {
    showLootError("装备格已满，先丢弃一个装备再鉴定。");
    addLog("装备格已满。");
    render();
    return;
  }
  state.selectedSlotIndex = slotIndex;
  state.selectedItemId = item.id;
  state.infoMode = "item";
  const newStats = getPlayerStats();
  if (!item.tooLarge && newStats.maxHp > oldStats.maxHp) {
    state.player.hp += newStats.maxHp - oldStats.maxHp;
  } else {
    state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  }
  addLog(message);
  addBattleEvent(message, "item");
  saveGame();
  render();
}

function addInventoryItemDirect(item, preferredSlotIndex = getSelectedSlotIndex()) {
  ensureInventorySlots();
  const preferred = clampSlotIndex(preferredSlotIndex);
  const slotIndex = !state.inventory[preferred] ? preferred : findFirstEmptyInventorySlot();
  if (slotIndex < 0) {
    return -1;
  }
  state.inventory[slotIndex] = item;
  return slotIndex;
}

function formatItemDisplayName(item) {
  return item?.itemName || "装备";
}

function createEmptyInventorySlots() {
  return Array.from({ length: equipmentVisibleSlots }, () => null);
}

function ensureInventorySlots() {
  if (!Array.isArray(state.inventory)) {
    state.inventory = createEmptyInventorySlots();
  }
  state.inventory = state.inventory.slice(0, equipmentVisibleSlots);
  while (state.inventory.length < equipmentVisibleSlots) state.inventory.push(null);
  state.inventory = state.inventory.map((item) => item || null);
  state.selectedSlotIndex = clampSlotIndex(state.selectedSlotIndex);
  state.pendingPhotoSlotIndex = clampSlotIndex(state.pendingPhotoSlotIndex);
  state.selectedItemId = state.inventory[state.selectedSlotIndex]?.id || "";
}

function clampSlotIndex(index) {
  const numeric = Number(index);
  if (!Number.isInteger(numeric)) return 0;
  return Math.max(0, Math.min(equipmentVisibleSlots - 1, numeric));
}

function getSelectedSlotIndex() {
  if (!Array.isArray(state.inventory)) {
    state.inventory = createEmptyInventorySlots();
  }
  state.selectedSlotIndex = clampSlotIndex(state.selectedSlotIndex);
  return state.selectedSlotIndex;
}

function getInventoryItemAt(index) {
  ensureInventorySlots();
  return state.inventory[clampSlotIndex(index)] || null;
}

function findFirstEmptyInventorySlot() {
  ensureInventorySlots();
  return state.inventory.findIndex((item) => !item);
}

function toggleAutoBattle() {
  if (isBattleActionLocked()) return;
  if (state.autoBattleTimer || state.gameClear || isPlayerDefeated()) return;
  state.infoMode = "log";
  startAutoBattle();
}

function startAutoBattle() {
  if (isPlayerDefeated()) return;
  if (state.battleStartTimer || state.pendingFloorAdvance) return;

  ensureEncounter();
  if (isBossFloor(state.floor)) {
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
  }
  const selectedEnemies = getSelectedEnemies();
  if (!selectedEnemies.length) return;

  const selectedIds = new Set(selectedEnemies.map((enemy) => enemy.id));
  const unselectedIds = state.enemies
    .filter((enemy) => enemy.hp > 0 && !selectedIds.has(enemy.id))
    .map((enemy) => enemy.id);
  state.enemyFlipDownIds = new Set(unselectedIds);
  render();

  state.battleStartTimer = window.setTimeout(() => {
    state.battleStartTimer = 0;
    for (const id of unselectedIds) state.enemyFaceDownIds.add(id);
    state.enemyFlipDownIds = new Set();
    beginBattle(selectedEnemies);
    resolveBattleAction();
    if (!state.currentBattle || state.player.hp <= 0) {
      saveGame();
      render();
      return;
    }

    state.autoBattleTimer = window.setInterval(() => {
      resolveBattleAction();
      saveGame();
      render();
    }, 1000);
    saveGame();
    render();
  }, unselectedIds.length ? 320 : 0);
  saveGame();
}

function stopAutoBattle() {
  if (!state.autoBattleTimer) return;
  window.clearInterval(state.autoBattleTimer);
  state.autoBattleTimer = 0;
}

function stopBattleTimers() {
  if (state.battleStartTimer) {
    window.clearTimeout(state.battleStartTimer);
    state.battleStartTimer = 0;
  }
  if (state.battleRevealTimer) {
    window.clearTimeout(state.battleRevealTimer);
    state.battleRevealTimer = 0;
  }
  if (state.floorAdvanceTimer) {
    window.clearTimeout(state.floorAdvanceTimer);
    state.floorAdvanceTimer = 0;
  }
  state.pendingFloorAdvance = false;
}

function createDefaultBattleSpecial() {
  return {
    attack: 0,
    defense: 0,
  };
}

function normalizeBattleSpecial(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    attack: clampInt(source.attack, 0, 10),
    defense: clampInt(source.defense, 0, 8),
  };
}

function resetBattleSpecial() {
  state.battleSpecial = createDefaultBattleSpecial();
}

function beginBattle(enemies) {
  const activeIds = enemies.map((enemy) => enemy.id);
  state.activeEnemyIds = activeIds;
  resetBattleSpecial();
  const stats = getBattleStats(activeIds);
  state.player.shield = stats.shield;
  state.player.shieldMonsterId = state.encounterId;
  state.battleClock = makeBattleClock(stats, enemies);
  ensureCurrentBattle(activeIds, stats);
}

function resolveBattleAction() {
  if (!state.currentBattle) return true;
  if (!state.battleClock) {
    state.battleClock = makeBattleClock(getBattleStats(state.activeEnemyIds), getActiveBattleEnemies());
  }
  const activeEnemies = getActiveBattleEnemies();
  if (!activeEnemies.length) {
    finishCurrentBattle("victory");
    return true;
  }

  const stats = getBattleStats(state.activeEnemyIds);
  const round = state.battleClock?.round || 1;

  if (round >= 50) {
    addBattleDetail(`第50回合敌方逃跑。`);
    for (const id of state.activeEnemyIds) state.enemyFlipDownIds.add(id);
    removeEnemiesByIds(state.activeEnemyIds, false);
    finishCurrentBattle("enemy-fled");
    stopAutoBattle();
    handleBattleEndAdvance("delay");
    return true;
  }

  const enemyClock = getNextEnemyClock();
  const heroTime = state.battleClock.hero;
  if (heroTime === Infinity && (!enemyClock || enemyClock.time === Infinity)) {
    addBattleDetail("双方速度不足，战斗陷入僵持。");
    finishCurrentBattle("enemy-fled");
    stopAutoBattle();
    handleBattleEndAdvance("delay");
    return true;
  }
  if (!enemyClock || heroTime <= enemyClock.time + Number.EPSILON) {
    const defeated = resolveHeroStrike(stats, round);
    state.battleClock.hero += getActionInterval(stats.speed);
    if (defeated) {
      state.battleClock.round = 1;
    } else {
      state.battleClock.round += 1;
    }
  } else {
    const enemy = state.enemies.find((item) => item.id === enemyClock.id);
    if (enemy) resolveMonsterStrike(enemy, stats, round);
    enemyClock.time += getActionInterval(enemy?.speed || 0);
    state.battleClock.round += 1;
  }

  if (state.player.hp <= 0) {
    addBattleDetail("照片勇者倒下了。");
    finishCurrentBattle("defeat");
    stopAutoBattle();
    return true;
  }

  if (!getActiveBattleEnemies().length) {
    const completedFloor = state.floor;
    finishCurrentBattle("victory");
    stopAutoBattle();
    if (isBossRewardFloor(completedFloor)) {
      startBossRewardChoice(completedFloor);
    } else {
      handleBattleEndAdvance("delay");
    }
    return true;
  }

  return false;
}

function resolveHeroStrike(stats, round) {
  void stats;
  const strikeCount = hasEquippedPhotoEffect("doubleStrikeSpeedDown") ? 2 : 1;
  let defeatedAny = false;

  for (let strikeIndex = 0; strikeIndex < strikeCount; strikeIndex += 1) {
    const enemy = getHeroTargetEnemy();
    if (!enemy) break;

    const currentStats = getBattleStats(state.activeEnemyIds);
    const rawDamage = Math.max(0, currentStats.atk - enemy.def);
    const shieldCrashDamage = getShieldCrashDamage();
    let damage = rawDamage + shieldCrashDamage;
    if (hasTrait(enemy, "sturdy")) damage = Math.min(damage, 1);

    const shieldLoss = Math.min(enemy.shield || 0, damage);
    enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
    const hpDamage = Math.max(0, damage - shieldLoss);
    enemy.hp = Math.max(0, enemy.hp - hpDamage);
    const totalDamage = shieldLoss + hpDamage;

    let healed = 0;
    if (!hasAnyActiveTrait("noLifesteal") && currentStats.lifesteal > 0) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStats.maxHp, state.player.hp + currentStats.lifesteal);
      healed = state.player.hp - beforeHp;
    }

    if (totalDamage > 0) {
      triggerDealDamageSpecial();
    }

    const parts = [];
    if (damage <= 0) {
      parts.push("未破防");
    } else {
      parts.push(`造成 ${hpDamage}伤害`);
    }
    if (shieldLoss > 0) parts.push(`破盾 ${shieldLoss}`);
    if (shieldCrashDamage > 0) parts.push(`护盾追加 ${shieldCrashDamage}`);
    if (healed > 0 || currentStats.lifesteal > 0) parts.push(`吸取${healed}血量`);
    if (strikeCount > 1) parts.push(`连击${strikeIndex + 1}/${strikeCount}`);
    addBattleDetail(`第${round}回合勇者进攻${enemy.name}，${parts.join("，")}。`);

    if (enemy.hp <= 0) {
      defeatEnemy(enemy);
      defeatedAny = true;
    }
  }

  return defeatedAny;
}

function resolveMonsterStrike(enemy, stats, round) {
  const hitCount = getTraitValue(enemy, "multiHit", 1);
  let totalHpLoss = 0;
  let totalShieldLoss = 0;
  let totalRegen = 0;
  let monsterStealTotal = 0;

  for (let i = 0; i < hitCount; i += 1) {
    const currentStatsBeforeHit = getBattleStats(state.activeEnemyIds);
    const damage = hasTrait(enemy, "magic") ? Math.max(0, enemy.atk) : Math.max(0, enemy.atk - currentStatsBeforeHit.def);
    const ignoresShield = hasTrait(enemy, "ignoreShield");
    const shieldLoss = ignoresShield ? 0 : Math.min(state.player.shield, damage);
    const hpLoss = damage - shieldLoss;
    state.player.shield -= shieldLoss;
    state.player.hp = Math.max(0, state.player.hp - hpLoss);
    totalHpLoss += hpLoss;
    totalShieldLoss += shieldLoss;
    if (shieldLoss + hpLoss > 0) {
      triggerTakeDamageSpecial();
    }

    const currentStats = getBattleStats(state.activeEnemyIds);
    if (state.player.hp > 0 && !hasAnyActiveTrait("noRegen") && currentStats.regen > 0) {
      const beforeHp = state.player.hp;
      state.player.hp = Math.min(currentStats.maxHp, state.player.hp + currentStats.regen);
      totalRegen += state.player.hp - beforeHp;
    }

    const monsterSteal = getTraitValue(enemy, "lifesteal", 0);
    if (monsterSteal > 0) {
      const beforeHp = enemy.hp;
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterSteal);
      monsterStealTotal += enemy.hp - beforeHp;
    }

    if (state.player.hp <= 0) break;
  }

  const monsterRegen = getTraitValue(enemy, "regen", 0);
  let monsterHealed = 0;
  if (monsterRegen > 0 && enemy.hp > 0) {
    const beforeHp = enemy.hp;
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterRegen);
    monsterHealed = enemy.hp - beforeHp;
  }

  const parts = [];
  if (hitCount > 1) parts.push(`连击${hitCount}`);
  parts.push(totalHpLoss > 0 ? `生命损失 ${Math.max(0, totalHpLoss - totalRegen)}` : "生命无损失");
  if (totalShieldLoss > 0) parts.push(`护盾承受 ${totalShieldLoss}`);
  if (totalRegen > 0) parts.push(`回复 ${totalRegen}`);
  if (monsterHealed > 0) parts.push(`${enemy.name}回复 ${monsterHealed}`);
  if (monsterStealTotal > 0) parts.push(`${enemy.name}吸取 ${monsterStealTotal}`);
  if (hasTrait(enemy, "magic")) parts.push("无视防御");
  if (hasTrait(enemy, "ignoreShield")) parts.push("无视护盾");
  addBattleDetail(`第${round}回合${enemy.name}进攻，${parts.join("，")}。`);
}

function defeatEnemy(enemy) {
  const drops = getEnemyDrops(enemy);
  const defeatedIds = state.currentBattle?.defeatedIds;
  addLootNamesToCurrentBattle(drops);
  if (Array.isArray(defeatedIds)) defeatedIds.push(enemy.id);
  addBattleDetail(`${enemy.name} 被击败。`);
  state.enemyFlipDownIds.add(enemy.id);
  triggerKillSpecial(enemy);
  for (const drop of drops) {
    if (drop.kind === "shard") {
      addFilmShards(drop.amount);
    } else if (drop.kind === "film") {
      addFilmShards(Math.round((drop.amount || 1) * 10));
    }
  }
  removeActiveEnemyIds([enemy.id]);
}

function removeEnemiesByIds(ids, reward = true) {
  const idSet = new Set(ids);
  if (reward) {
    for (const enemy of state.enemies.filter((item) => idSet.has(item.id) && item.hp > 0)) {
      defeatEnemy(enemy);
    }
  }
  state.enemies = state.enemies.filter((enemy) => !idSet.has(enemy.id));
  removeActiveEnemyIds(ids);
}

function removeActiveEnemyIds(ids) {
  const idSet = new Set(ids);
  state.activeEnemyIds = state.activeEnemyIds.filter((id) => !idSet.has(id));
  if (state.battleClock?.enemies) {
    state.battleClock.enemies = state.battleClock.enemies.filter((clock) => !idSet.has(clock.id));
  }
}

function ensureCurrentBattle(activeIds, stats = getBattleStats(activeIds)) {
  const battleId = `${state.floor}:${activeIds.join("|")}`;
  if (state.currentBattle?.battleId === battleId) return state.currentBattle;
  const enemies = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
  state.currentBattle = {
    id: makeId("battle"),
    type: "battle",
    battleId,
    floor: state.floor,
    monsterName: enemies.map((enemy) => enemy.name).join("、"),
    startHp: state.player.hp,
    startShield: state.player.shield,
    damageEstimates: Object.fromEntries(simulateDamageEstimateForIds(activeIds, { ignoreFrozen: true })),
    details: [],
    lootNames: [],
    defeatedIds: [],
    createdAt: Date.now(),
  };
  return state.currentBattle;
}

function addBattleDetail(text) {
  if (!state.currentBattle) return;
  state.currentBattle.details.push(text);
  if (state.currentBattle.details.length > 90) {
    state.currentBattle.details = state.currentBattle.details.slice(-90);
  }
}

function addLootNamesToCurrentBattle(drops) {
  if (!state.currentBattle) return;
  for (const drop of drops) {
    const amount = drop.amount || 1;
    const name = drop.kind === "shard"
      ? "胶卷碎片"
      : drop.itemName || (drop.kind === "film" ? "胶卷 +1.0" : "胶卷 +0.1");
    for (let i = 0; i < amount; i += 1) {
      state.currentBattle.lootNames.push(name);
    }
  }
}

function finishCurrentBattle(result) {
  if (!state.currentBattle) return;
  const battle = state.currentBattle;
  const hpDelta = state.player.hp - battle.startHp;
  const stats = getPlayerStats();
  const endHp = Math.min(state.player.hp, stats.maxHp);
  const report = {
    ...battle,
    result,
    hpDelta,
    endHp,
    endMaxHp: stats.maxHp,
    endShield: state.player.shield,
    summary: makeBattleSummary(result, battle, hpDelta),
    expanded: false,
    finishedAt: Date.now(),
  };
  state.battleReports.unshift(report);
  state.battleReports = state.battleReports.slice(0, battleReportLimit);
  state.currentBattle = null;
  state.selectedEnemyIds = [];
  state.activeEnemyIds = [];
  state.battleClock = null;
  resetBattleSpecial();
}

function revealEnemyCardsThen(callback) {
  const faceDownIds = new Set([
    ...state.enemyFaceDownIds,
    ...state.enemyFlipDownIds,
  ]);
  if (!faceDownIds.size) {
    callback();
    return;
  }

  state.enemyFlipUpIds = faceDownIds;
  state.enemyFaceDownIds = new Set();
  state.enemyFlipDownIds = new Set();
  state.pendingFloorAdvance = true;
  render();

  state.battleRevealTimer = window.setTimeout(() => {
    state.battleRevealTimer = 0;
    state.enemyFlipUpIds = new Set();
    callback();
  }, 360);
}

function startBossRewardChoice(floor) {
  state.bossReward = {
    floor,
    options: buildBossRewardOptions(floor),
  };
  state.pendingFloorAdvance = true;
  state.infoMode = "log";
  addBattleEvent(`第${floor}层胜利，选择一张奖励牌。`, "item");
  saveGame();
  render();
}

function buildBossRewardOptions(floor) {
  const pool = [
    { type: "filmDrop", title: "胶卷掉落 +0.1", desc: "之后击败怪物时，胶卷掉落永久 +0.1。" },
    { type: "filmPercent", title: "当前胶卷 +20%", desc: "按当前胶卷数量增加 20%，向上取整到 0.1。" },
    { type: "valueMin", title: "最低价值 +2", desc: "之后照片鉴定的最低价值永久 +2。" },
    { type: "valueMax", title: "最高价值 +2", desc: "之后照片鉴定的最高价值永久 +2。" },
  ];
  const start = hashIndex(`${state.runSeed}:${floor}:boss-reward:start`, pool.length);
  return [0, 1, 2].map((slot) => {
    const reward = pool[(start + slot) % pool.length];
    return { ...reward, id: `${floor}-${slot}-${reward.type}` };
  });
}

function chooseBossReward(index) {
  if (!state.bossReward) return;
  const option = state.bossReward.options?.[index];
  if (!option) return;
  const text = applyBossReward(option);
  const floor = state.bossReward.floor;
  state.bossReward = null;
  state.pendingFloorAdvance = false;
  addBattleEvent(`${text} 进入下一层。`, "item");
  clearEnemyCardMotion();
  if (state.floor === floor) {
    advanceFloor();
  }
  saveGame();
  render();
}

function applyBossReward(option) {
  if (option.type === "filmDrop") {
    state.globalFilmDropBonus = getGlobalFilmDropBonus() + 1;
    return "奖励：胶卷掉落 +0.1。";
  }
  if (option.type === "filmPercent") {
    const before = getFilmCount();
    const gain = Math.ceil(before * 2) / 10;
    addFilmShards(Math.round(gain * 10));
    return `奖励：当前胶卷 +${gain.toFixed(1)}。`;
  }
  if (option.type === "valueMin") {
    state.photoValueMin = getPhotoValueMin() + 2;
    if (getPhotoValueMax() < state.photoValueMin) state.photoValueMax = state.photoValueMin;
    return `奖励：鉴定最低价值提升到 ${getPhotoValueMin()}。`;
  }
  if (option.type === "valueMax") {
    state.photoValueMax = getPhotoValueMax() + 2;
    return `奖励：鉴定最高价值提升到 ${getPhotoValueMax()}。`;
  }
  return "奖励已领取。";
}

function addBattleEvent(text, type = "item") {
  state.battleReportSeq += 1;
  state.battleReports.unshift({
    id: makeId(`event-${state.battleReportSeq}`),
    type: "event",
    eventType: type,
    summary: text,
    details: [],
    expanded: false,
    createdAt: Date.now(),
  });
  state.battleReports = state.battleReports.slice(0, battleReportLimit);
}

function makeBattleSummary(result, battle, hpDelta) {
  const floor = Number.isFinite(battle?.floor) ? battle.floor : state.floor;
  const monsterName = typeof battle?.monsterName === "string" && battle.monsterName
    ? battle.monsterName
    : typeof battle === "string" && battle
      ? battle
      : "敌人";
  const lifeText = `生命变化 ${formatHpDelta(hpDelta)}`;
  const lootText = formatLootNames(battle?.lootNames || []);
  if (result === "victory") {
    const endHp = Number.isFinite(battle?.endHp) ? battle.endHp : state.player.hp;
    const endMaxHp = Number.isFinite(battle?.endMaxHp) ? battle.endMaxHp : getPlayerStats().maxHp;
    const hpPercent = endMaxHp ? endHp / endMaxHp : 1;
    const label = hpPercent <= 0.2
      ? "险胜"
      : hpDelta >= 0
        ? "完胜"
        : Math.abs(hpDelta) <= Math.max(3, Math.ceil(endMaxHp * 0.15))
          ? "小胜"
          : "胜";
    const remainText = label === "险胜" ? `，剩余生命 ${endHp}/${endMaxHp}` : "";
    return `${label} · 第${floor}层${monsterName}，${lifeText}${remainText}，获得：${lootText}。`;
  }
  if (result === "defeat") {
    return `败 · 第${floor}层${monsterName}击倒照片勇者，${lifeText}，获得：${lootText}。`;
  }
  if (result === "enemy-fled") {
    return `敌逃 · 第${floor}层缠斗50回合，敌方逃跑，${lifeText}，获得：${lootText}。`;
  }
  if (result === "hero-fled") {
    return `跳过 · 照片勇者进入下一层，${lifeText}，获得：${lootText}。`;
  }
  return `战斗结束，${lifeText}，获得：${lootText}。`;
}

function formatLootNames(names) {
  const counts = new Map();
  for (const name of names) {
    if (!name) continue;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  if (!counts.size) return "无";
  const parts = [];
  let filmTotal = 0;
  for (const [name, count] of counts.entries()) {
    if (name === "胶卷碎片" || name === "胶卷 +0.1") {
      filmTotal += count / 10;
      continue;
    }
    if (name.startsWith("胶卷碎片 +")) {
      const shards = Number.parseInt(name.slice("胶卷碎片 +".length), 10) || 0;
      filmTotal += (shards * count) / 10;
      continue;
    }
    if (name.startsWith("胶卷 +")) {
      const rolls = Number.parseFloat(name.slice("胶卷 +".length));
      if (Number.isFinite(rolls)) {
        filmTotal += rolls * count;
        continue;
      }
    }
    parts.push(count > 1 ? `${name}*${count}` : name);
  }
  if (filmTotal > 0) parts.unshift(`胶卷 +${filmTotal.toFixed(1)}`);
  return parts.join("、") || "无";
}

function formatHpDelta(delta) {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function hasPendingPhoto() {
  return Boolean(state.lastPhoto);
}

function isEquipmentSelectionLocked() {
  return isEquipmentLocked() || hasPendingPhoto() || isPlayerDefeated() || Boolean(state.bossReward);
}

function isBattleActionLocked() {
  return hasPendingPhoto() || Boolean(state.bossReward);
}

function fleeBattle() {
  if (isPlayerDefeated()) return;
  if (isBattleActionLocked()) return;
  if (state.pendingFloorAdvance || state.battleStartTimer) return;
  state.infoMode = "log";
  if (state.autoBattleTimer) stopAutoBattle();
  if (isBossFloor(state.floor)) {
    addBattleEvent(`第${state.floor}层无法逃跑。`, "info");
    render();
    return;
  }
  if (!state.currentBattle) {
    state.currentBattle = {
      id: makeId("battle"),
      type: "battle",
      battleId: `${state.floor}:skip`,
      floor: state.floor,
      monsterName: "敌人",
      startHp: state.player.hp,
      startShield: state.player.shield,
      details: [`勇者跳过第${state.floor}层，进入下一层。`],
      lootNames: [],
      defeatedIds: [],
      createdAt: Date.now(),
    };
  } else {
    addBattleDetail(`勇者跳过第${state.floor}层，进入下一层。`);
  }
  finishCurrentBattle("hero-fled");
  clearEnemyCardMotion();
  advanceFloor();
  saveGame();
  render();
}

function makeBattleClock(stats, enemies) {
  return {
    hero: getActionInterval(stats.speed),
    enemies: enemies.map((enemy) => ({
      id: enemy.id,
      time: getActionInterval(enemy.speed),
    })),
    round: 1,
    encounterId: state.encounterId,
  };
}

function getActionInterval(speed) {
  return speed > 0 ? 1 / speed : Infinity;
}

function getNextEnemyClock() {
  if (!state.battleClock?.enemies?.length) return null;
  return state.battleClock.enemies
    .filter((clock) => state.activeEnemyIds.includes(clock.id))
    .sort((a, b) => a.time - b.time || state.activeEnemyIds.indexOf(a.id) - state.activeEnemyIds.indexOf(b.id))[0] || null;
}

function getHeroTargetEnemy() {
  return state.activeEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .find(Boolean) || null;
}

function getActiveBattleEnemies() {
  return state.activeEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
}

function handleBattleEndAdvance(mode = "instant") {
  if (mode === "delay") {
    state.pendingFloorAdvance = true;
    render();
    state.floorAdvanceTimer = window.setTimeout(() => {
      state.floorAdvanceTimer = 0;
      revealEnemyCardsThen(() => {
        state.floorAdvanceTimer = window.setTimeout(() => {
          state.floorAdvanceTimer = 0;
          state.pendingFloorAdvance = false;
          advanceFloor();
          saveGame();
          render();
        }, 420);
      });
    }, 360);
    return;
  }
  advanceFloor();
}

function advanceFloor() {
  stopAutoBattle();
  if (isPlayerDefeated()) return;
  clearEnemyCardMotion();
  if (state.floor >= maxFloor) {
    state.gameClear = true;
    state.enemies = [];
    state.encounterId = "clear";
    resetBattleSpecial();
    addBattleEvent("照片勇者通关了40层魔塔。", "hero");
    return;
  }
  state.floor += 1;
  state.selectedEnemyIds = [];
  state.currentBattle = null;
  state.activeEnemyIds = [];
  state.battleClock = null;
  resetBattleSpecial();
  state.enemies = buildFloorEncounter(state.floor);
  state.encounterId = makeEncounterId();
  state.enemyFlipEncounterId = state.encounterId;
  applyFloorShield();
}

function clearEnemyCardMotion() {
  state.enemyFaceDownIds = new Set();
  state.enemyFlipDownIds = new Set();
  state.enemyFlipUpIds = new Set();
  state.pendingFloorAdvance = false;
}

function finishEnemyFlipDown(enemyId) {
  if (!state.enemyFlipDownIds.has(enemyId)) return;
  state.enemyFlipDownIds.delete(enemyId);
  state.enemyFaceDownIds.add(enemyId);
  render();
}

function ensureEncounter() {
  if (state.gameClear) return;
  if (!Number.isFinite(state.floor) || state.floor < 1) state.floor = 1;
  if (!Array.isArray(state.enemies) || !state.enemies.length) {
    state.enemies = buildFloorEncounter(state.floor);
  }
  state.enemies = state.enemies.map(normalizeEnemy).filter(Boolean);
  state.encounterId = state.encounterId || makeEncounterId();
  const validIds = new Set(state.enemies.map((enemy) => enemy.id));
  state.selectedEnemyIds = Array.isArray(state.selectedEnemyIds)
    ? state.selectedEnemyIds.filter((id, index, ids) => validIds.has(id) && ids.indexOf(id) === index)
    : [];
  if (isBossFloor(state.floor)) {
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
  }
  applyFloorShield();
}

function buildFloorEncounter(floor) {
  if (Array.isArray(state.testEnemyOverride)) {
    const override = state.testEnemyOverride;
    state.testEnemyOverride = null;
    return override.map((enemy, index) => normalizeEnemy({
      id: enemy.id || `${floor}-test-${index}`,
      testEnemy: true,
      floor,
      slot: index,
      typeKey: enemy.typeKey || "slime",
      typeName: enemy.typeName || "史莱姆",
      name: enemy.name || enemy.typeName || "史莱姆",
      maxHp: Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1,
      hp: Number.isFinite(enemy.hp) ? enemy.hp : Number.isFinite(enemy.maxHp) ? enemy.maxHp : 1,
      atk: Number.isFinite(enemy.atk) ? enemy.atk : 1,
      def: Number.isFinite(enemy.def) ? enemy.def : 0,
      speed: Number.isFinite(enemy.speed) ? enemy.speed : 1,
      maxShield: Number.isFinite(enemy.maxShield) ? enemy.maxShield : Number.isFinite(enemy.shield) ? enemy.shield : 0,
      shield: Number.isFinite(enemy.shield) ? enemy.shield : 0,
      traits: Array.isArray(enemy.traits) ? enemy.traits : [],
    })).filter(Boolean);
  }
  const types = getFloorMonsterTypes(floor);
  return types.map((typeKey, index) => makeEnemy(typeKey, floor, index));
}

function getFloorMonsterTypes(floor) {
  if (floor === 10) return ["skeleton", "skeleton", "skeletonCaptain"];
  if (floor === 20) return ["vampire"];
  if (floor === 25) return ["octopus"];
  if (floor === 30) return ["warrior", "warrior", "knightCaptain"];
  if (floor === 35) return ["dragon"];
  if (floor === 38) return ["archmage"];
  if (floor === 40) return ["demon"];
  const pool = buildWeightedMonsterPool(floor);
  const normalPool = pool.filter((key) => !isBossMonsterType(key));
  const safePool = normalPool.length ? normalPool : ["slime"];
  const seed = state.runSeed || "default";
  const types = [0, 1, 2].map((slot) => safePool[hashIndex(`${seed}:${floor}:monster:${slot}`, safePool.length)]);
  if (floor <= 5) types[0] = "slime";
  return types;
}

function buildWeightedMonsterPool(floor) {
  const entries = normalMonsterUnlocks.filter((entry) => floor >= entry.floor && !isBossMonsterType(entry.key));
  const weighted = [];
  for (const entry of entries) {
    const age = Math.max(0, floor - entry.floor);
    const growth = Math.floor(Math.max(0, floor - 1) / 8);
    const tierBoost = Math.max(0, (entry.tier || 1) - 1) * (growth + 1);
    const weakRetention = entry.floor <= 3 ? Math.max(5, entry.weight - Math.floor(age / 5)) : 0;
    const baseWeight = Math.max(1, entry.weight + tierBoost - Math.floor(age / 12));
    const finalWeight = Math.max(baseWeight, weakRetention);
    for (let i = 0; i < finalWeight; i += 1) weighted.push(entry.key);
  }
  return weighted.length ? weighted : ["slime"];
}

function makeEnemy(typeKey, floor, slot) {
  const type = monsterTypes[typeKey] || monsterTypes.slime;
  const shield = getTraitValueFromList(type.traits, "shield", 0) || 0;
  const traits = cloneTraits(type.traits);
  const maxHp = Math.max(1, type.hp);
  const maxShield = Math.max(0, shield);
  return {
    id: `${floor}-${slot}-${typeKey}`,
    floor,
    slot,
    typeKey,
    typeName: type.name,
    name: type.name,
    maxHp,
    hp: maxHp,
    atk: Math.max(0, type.atk),
    def: Math.max(0, type.def),
    speed: Math.max(1, type.speed),
    maxShield,
    shield: maxShield,
    traits,
  };
}

function isBossMonsterType(typeKey) {
  return bossMonsterKeys.has(typeKey);
}

function isBossDropEnemy(enemy) {
  const typeKey = enemy?.typeKey;
  const floor = Number.isFinite(enemy?.floor) ? enemy.floor : state.floor;
  if (!isBossMonsterType(typeKey)) return false;
  return Boolean(bossDropTypesByFloor.get(floor)?.has(typeKey));
}

function normalizeEnemy(enemy) {
  if (!enemy || typeof enemy !== "object") return null;
  if (enemy.testEnemy) {
    const maxHp = Number.isFinite(enemy.maxHp) ? Math.max(1, enemy.maxHp) : Number.isFinite(enemy.hp) ? Math.max(1, enemy.hp) : 1;
    const maxShield = Number.isFinite(enemy.maxShield) ? Math.max(0, enemy.maxShield) : Number.isFinite(enemy.shield) ? Math.max(0, enemy.shield) : 0;
    return {
      ...enemy,
      id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
      name: typeof enemy.name === "string" && enemy.name ? enemy.name : enemy.typeName || "史莱姆",
      typeKey: enemy.typeKey || "slime",
      typeName: enemy.typeName || "史莱姆",
      maxHp,
      hp: Number.isFinite(enemy.hp) ? Math.max(0, Math.min(enemy.hp, maxHp)) : maxHp,
      atk: Number.isFinite(enemy.atk) ? Math.max(0, enemy.atk) : 1,
      def: Number.isFinite(enemy.def) ? Math.max(0, enemy.def) : 0,
      speed: Number.isFinite(enemy.speed) ? Math.max(1, enemy.speed) : 1,
      maxShield,
      shield: Number.isFinite(enemy.shield) ? Math.max(0, Math.min(enemy.shield, maxShield)) : maxShield,
      traits: Array.isArray(enemy.traits) ? cloneTraits(enemy.traits) : [],
    };
  }
  return normalizeEnemyFromBase(enemy);
}

function normalizeEnemyFromBase(enemy) {
  const floor = Number.isFinite(enemy.floor) ? enemy.floor : state.floor;
  const previousMaxHp = Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1;
  const previousMaxShield = Number.isFinite(enemy.maxShield) ? enemy.maxShield : Number.isFinite(enemy.shield) ? enemy.shield : 0;
  const base = makeEnemy(enemy.typeKey || "slime", floor, Number.isFinite(enemy.slot) ? enemy.slot : 0);
  return {
    ...base,
    ...enemy,
    id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
    name: base.name,
    typeName: base.typeName,
    maxHp: base.maxHp,
    hp: Number.isFinite(enemy.hp)
      ? Math.max(0, Math.min(enemy.hp >= previousMaxHp ? base.maxHp : enemy.hp, base.maxHp))
      : base.maxHp,
    atk: base.atk,
    def: base.def,
    speed: base.speed,
    maxShield: base.maxShield,
    shield: Number.isFinite(enemy.shield)
      ? Math.max(0, Math.min(enemy.shield >= previousMaxShield ? base.maxShield : enemy.shield, base.maxShield))
      : base.maxShield,
    traits: base.traits,
  };
}

function getEnemyDrops(enemy) {
  const shardAmount = getEnemyFilmShardDrop(enemy);
  if (shardAmount <= 0) return [];
  if (shardAmount % 10 === 0) {
    return [{
      kind: "film",
      itemName: `胶卷 +${(shardAmount / 10).toFixed(1)}`,
      amount: shardAmount / 10,
    }];
  }
  return [{
    kind: "shard",
    itemName: `胶卷碎片 +${shardAmount}`,
    amount: shardAmount,
  }];
}

function addFilmShards(amount) {
  state.filmShards = normalizeFilmAmount(Math.max(0, state.filmShards + amount));
  const made = Math.floor(state.filmShards / 10);
  if (made > 0) {
    state.filmRolls += made;
    state.filmShards = normalizeFilmAmount(state.filmShards % 10);
  }
}

function addFilmAmount(amount) {
  addFilmShards(normalizeFilmAmount(amount) * 10);
}

function getHeroFormFilmShardBonus() {
  if (getHeroForm()?.noFilmDrop) return 0;
  return clampInt(getHeroForm()?.filmDropBonus || 0, -9, 9);
}

function getEnemyFilmShardDrop(enemy) {
  if (getHeroForm()?.noFilmDrop) return 0;
  const baseShards = isBossDropEnemy(enemy) ? 10 : 1;
  return Math.max(0, baseShards + getGlobalFilmDropBonus() + getHeroFormFilmShardBonus());
}

function getGlobalFilmDropBonus() {
  return clampInt(state.globalFilmDropBonus, 0, 999);
}

function getPhotoValueMin() {
  return clampInt(state.photoValueMin, defaultPhotoValueMin, 999);
}

function getPhotoValueMax() {
  return Math.max(getPhotoValueMin(), clampInt(state.photoValueMax, defaultPhotoValueMax, 999));
}

function formatEnemyFilmDrop(enemy) {
  return `胶卷 ${(getEnemyFilmShardDrop(enemy) / 10).toFixed(1)}`;
}

function getFilmCount() {
  return normalizeFilmAmount(state.filmRolls + state.filmShards / 10);
}

function consumeFilm() {
  if (getFilmCount() < 1) return false;
  if (state.filmRolls < 1) {
    addFilmShards(0);
  }
  if (state.filmRolls < 1) return false;
  state.filmRolls -= 1;
  return true;
}

function formatFilmCount() {
  return formatFilmAmount(getFilmCount());
}

function formatFilmAmount(value) {
  return normalizeFilmAmount(value).toFixed(1);
}

function normalizeFilmAmount(value) {
  return Math.round(Math.max(0, Number(value) || 0) * 10) / 10;
}

function formatPhotoValueRange() {
  return `${getPhotoValueMin()}-${getPhotoValueMax()}`;
}

function toggleEnemySelection(enemyId) {
  const index = state.selectedEnemyIds.indexOf(enemyId);
  if (index >= 0) {
    state.selectedEnemyIds.splice(index, 1);
    return;
  }
  state.selectedEnemyIds.push(enemyId);
}

function getEnemySelectionOrder(enemyId) {
  const index = state.selectedEnemyIds.indexOf(enemyId);
  return index >= 0 ? index + 1 : 0;
}

function getSelectedEnemies() {
  return state.selectedEnemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
}

function getBattleStats(activeIds = state.activeEnemyIds) {
  const stats = getPlayerStats();
  const activeEnemies = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean);
  if (activeEnemies.some((enemy) => hasTrait(enemy, "heroSpeedDown"))) {
    const value = Math.max(...activeEnemies.map((enemy) => getTraitValue(enemy, "heroSpeedDown", 0)));
    stats.speed -= value;
  }
  if (activeEnemies.some((enemy) => hasTrait(enemy, "heroAttackDown"))) {
    const value = Math.max(...activeEnemies.map((enemy) => getTraitValue(enemy, "heroAttackDown", 0)));
    stats.atk -= value;
  }
  applyBattleSpecialPassives(stats);
  return stats;
}

function getBattleStatsForEnemies(enemies) {
  const stats = getPlayerStats();
  return applyEnemyBattleModifiers(stats, enemies);
}

function getBattleStatsForEnemiesWithSpecial(enemies, battleSpecial) {
  const stats = getPlayerStatsWithBattleSpecial(battleSpecial);
  return applyEnemyBattleModifiers(stats, enemies);
}

function applyEnemyBattleModifiers(stats, enemies) {
  if (enemies.some((enemy) => hasTrait(enemy, "heroSpeedDown"))) {
    const value = Math.max(...enemies.map((enemy) => getTraitValue(enemy, "heroSpeedDown", 0)));
    stats.speed -= value;
  }
  if (enemies.some((enemy) => hasTrait(enemy, "heroAttackDown"))) {
    const value = Math.max(...enemies.map((enemy) => getTraitValue(enemy, "heroAttackDown", 0)));
    stats.atk -= value;
  }
  applyBattleSpecialPassives(stats);
  return stats;
}

function applyBattleSpecialPassives(stats) {
  return stats;
}

function createBattleSimulation(enemies) {
  const stats = getBattleStatsForEnemiesWithSpecial(enemies, createDefaultBattleSpecial());
  return {
    hp: state.player.hp,
    shield: stats.shield,
    battleSpecial: createDefaultBattleSpecial(),
    maxHpBonus: 0,
    activeIds: enemies.map((enemy) => enemy.id),
    heroTime: getActionInterval(stats.speed),
    enemyTimes: new Map(enemies.map((enemy) => [enemy.id, getActionInterval(enemy.speed)])),
    round: 1,
    rounds: 0,
    defeatedCount: 0,
  };
}

function cloneEnemyForSimulation(enemy) {
  return {
    ...enemy,
    traits: cloneTraits(enemy.traits || []),
  };
}

function getNextSimEnemyId(sim) {
  return sim.activeIds
    .map((id) => ({ id, time: sim.enemyTimes.get(id) ?? Infinity }))
    .sort((a, b) => a.time - b.time || sim.activeIds.indexOf(a.id) - sim.activeIds.indexOf(b.id))[0]?.id || "";
}

function getSimActiveEnemies(sim, enemies) {
  return enemies.filter((enemy) => sim.activeIds.includes(enemy.id));
}

function simulateHeroStrike(sim, enemies, stats) {
  void stats;
  const strikeCount = hasEquippedPhotoEffect("doubleStrikeSpeedDown") ? 2 : 1;
  const defeatedIds = [];

  for (let strikeIndex = 0; strikeIndex < strikeCount; strikeIndex += 1) {
    const enemy = sim.activeIds.map((id) => enemies.find((item) => item.id === id)).find(Boolean);
    if (!enemy) break;

    const currentStats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
    currentStats.maxHp += sim.maxHpBonus || 0;
    const rawDamage = Math.max(0, currentStats.atk - enemy.def);
    const shieldCrashDamage = hasEquippedPhotoEffect("shieldCrashAttackDown")
      ? Math.floor(Math.max(0, sim.shield || 0) * 0.5)
      : 0;
    let damage = rawDamage + shieldCrashDamage;
    if (hasTrait(enemy, "sturdy")) damage = Math.min(damage, 1);
    const shieldLoss = Math.min(enemy.shield || 0, damage);
    enemy.shield = Math.max(0, (enemy.shield || 0) - shieldLoss);
    const hpDamage = Math.max(0, damage - shieldLoss);
    enemy.hp = Math.max(0, enemy.hp - hpDamage);

    if (shieldLoss + hpDamage > 0 && hasEquippedPhotoEffect("dealDamageAttack")) {
      sim.battleSpecial.attack = Math.min(10, (sim.battleSpecial.attack || 0) + 1);
    }

    if (!enemies.some((item) => sim.activeIds.includes(item.id) && hasTrait(item, "noLifesteal")) && currentStats.lifesteal > 0) {
      sim.hp = Math.min(currentStats.maxHp, sim.hp + currentStats.lifesteal);
    }

    if (enemy.hp <= 0) {
      simulateKillSpecial(sim, currentStats);
      sim.activeIds = sim.activeIds.filter((id) => id !== enemy.id);
      sim.enemyTimes.delete(enemy.id);
      sim.defeatedCount += 1;
      defeatedIds.push(enemy.id);
    }
  }

  return defeatedIds;
}

function simulateMonsterStrike(sim, enemy, enemies, stats) {
  const hitCount = getTraitValue(enemy, "multiHit", 1);
  for (let i = 0; i < hitCount; i += 1) {
    const damage = hasTrait(enemy, "magic") ? Math.max(0, enemy.atk) : Math.max(0, enemy.atk - stats.def);
    const shieldLoss = hasTrait(enemy, "ignoreShield") ? 0 : Math.min(sim.shield, damage);
    const hpLoss = damage - shieldLoss;
    sim.shield -= shieldLoss;
    sim.hp = Math.max(0, sim.hp - hpLoss);
    if (shieldLoss + hpLoss > 0 && hasEquippedPhotoEffect("takeDamageDefense")) {
      sim.battleSpecial.defense = Math.min(8, (sim.battleSpecial.defense || 0) + 1);
    }

    if (sim.hp > 0 && !enemies.some((item) => sim.activeIds.includes(item.id) && hasTrait(item, "noRegen")) && stats.regen > 0) {
      sim.hp = Math.min(stats.maxHp, sim.hp + stats.regen);
    }

    const monsterSteal = getTraitValue(enemy, "lifesteal", 0);
    if (monsterSteal > 0) enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterSteal);
    if (sim.hp <= 0) break;
  }

  const monsterRegen = getTraitValue(enemy, "regen", 0);
  if (monsterRegen > 0 && enemy.hp > 0) {
    enemy.hp = Math.min(enemy.maxHp, enemy.hp + monsterRegen);
  }
}

function simulateKillSpecial(sim, stats) {
  let maxHpGain = 0;
  for (const item of getEquippedItems()) {
    for (const { effect } of getItemSpecialInstances(item)) {
      if (effect.stat === "hp" && effect.kind === "killPermanent") maxHpGain += effect.amount;
    }
  }
  if (maxHpGain > 0) stats.maxHp += maxHpGain;
  sim.maxHpBonus = (sim.maxHpBonus || 0) + maxHpGain;
  if (maxHpGain > 0) sim.hp = Math.min(stats.maxHp, sim.hp + maxHpGain);
}

function hasAnyActiveTrait(type) {
  return getActiveBattleEnemies().some((enemy) => hasTrait(enemy, type));
}

function hasTrait(enemy, type) {
  return Array.isArray(enemy.traits) && enemy.traits.some((trait) => trait.type === type);
}

function getTraitValue(enemy, type, fallback = 0) {
  return getTraitValueFromList(enemy.traits, type, fallback);
}

function getTraitValueFromList(traits = [], type, fallback = 0) {
  const trait = traits.find((item) => item.type === type);
  return Number.isFinite(trait?.value) ? trait.value : fallback;
}

function cloneTraits(traits = []) {
  return traits.map((trait) => ({ ...trait }));
}

function isBossFloor(floor) {
  return bossFloors.has(floor);
}

function isRewardBossFloor(floor) {
  return rewardBossFloors.has(floor);
}

function isBossRewardFloor(floor) {
  return isBossFloor(floor) || isRewardBossFloor(floor);
}

function isPlayerDefeated() {
  return state.player.hp <= 0;
}

function makeEncounterId() {
  return `${state.floor}:${state.enemies.map((enemy) => enemy.id).join("|")}`;
}

function makeRunSeed() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function applyFloorShield() {
  const stats = getPlayerStats();
  if (state.player.shieldMonsterId === state.encounterId) return;
  state.player.shield = stats.shield;
  state.player.shieldMonsterId = state.encounterId;
}

function createDefaultPlayer() {
  const player = {
    formId: defaultHeroFormId,
    baseHp: 50,
    hp: 50,
    baseAtk: 3,
    baseDef: 1,
    baseSpeed: 2,
    baseRegen: 0,
    baseShield: 0,
    baseLifesteal: 0,
    shield: 0,
    shieldMonsterId: "",
  };
  player.hp = getPlayerMaxHpFromRaw(player);
  player.shield = getPlayerShieldFromRaw(player);
  return player;
}

function getPlayerMaxHpFromRaw(player) {
  const form = heroFormMap.get(player?.formId) || heroFormMap.get(defaultHeroFormId);
  return (Number.isFinite(player?.baseHp) ? player.baseHp : 50) + (form?.stats?.hp || 0);
}

function getPlayerShieldFromRaw(player) {
  const form = heroFormMap.get(player?.formId) || heroFormMap.get(defaultHeroFormId);
  return (Number.isFinite(player?.baseShield) ? player.baseShield : 0) + (form?.stats?.shield || 0);
}

function resetGame() {
  stopAutoBattle();
  stopBattleTimers();
  localStorage.removeItem(STORAGE_KEYS.save);
  state.player = createDefaultPlayer();
  state.runSeed = makeRunSeed();
  state.floor = 1;
  state.gameClear = false;
  state.enemies = buildFloorEncounter(1);
  state.encounterId = makeEncounterId();
  state.selectedEnemyIds = [];
  state.activeEnemyIds = [];
  state.battleClock = null;
  state.battleReports = [];
  state.battleReportSeq = 0;
  state.currentBattle = null;
  state.infoMode = "item";
  state.bossReward = null;
  state.photoValueMin = defaultPhotoValueMin;
  state.photoValueMax = defaultPhotoValueMax;
  state.globalFilmDropBonus = 0;
  state.inventory = createEmptyInventorySlots();
  state.selectedSlotIndex = 0;
  state.pendingPhotoSlotIndex = 0;
  state.selectedItemId = "";
  state.lastPhoto = "";
  state.latestItem = null;
  state.filmShards = 0;
  state.filmRolls = initialFilmRolls;
  state.lootError = "";
  state.log = ["已重开。"];
  resetBattleSpecial();
  clearEnemyCardMotion();
  applyFloorShield();
  saveGame();
  render();
}

function hashIndex(seed, length) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function getPlayerStats() {
  return getPlayerStatsWithBattleSpecial(state.battleSpecial);
}

function getPlayerStatsWithBattleSpecial(battleSpecial = createDefaultBattleSpecial()) {
  const equippedItems = getEquippedItems();
  const bonus = { ...getHeroFormStats() };
  equippedItems.reduce((sum, item) => {
    for (const key of statOrder) {
      sum[key] = (sum[key] || 0) + (item.stats?.[key] || 0);
    }
    const effectStats = getItemSpecialStats(item);
    for (const key of statOrder) {
      sum[key] = (sum[key] || 0) + (effectStats[key] || 0);
    }
    return sum;
  }, bonus);

  const passiveAttackPenalty = equippedItems.some((item) => getItemSpecialKeys(item).includes("shieldCrashAttackDown")) ? 3 : 0;
  const passiveSpeedPenalty = equippedItems.some((item) => getItemSpecialKeys(item).includes("doubleStrikeSpeedDown")) ? 3 : 0;

  return {
    maxHp: state.player.baseHp + (bonus.hp || 0),
    atk: state.player.baseAtk + (bonus.attack || 0) + (battleSpecial?.attack || 0) - passiveAttackPenalty,
    def: state.player.baseDef + (bonus.defense || 0) + (battleSpecial?.defense || 0),
    speed: state.player.baseSpeed + (bonus.speed || 0) - passiveSpeedPenalty,
    regen: state.player.baseRegen + (bonus.regen || 0),
    shield: state.player.baseShield + (bonus.shield || 0),
    lifesteal: state.player.baseLifesteal + (bonus.lifesteal || 0),
  };
}

function getHeroForm() {
  return heroFormMap.get(state.player.formId) || heroFormMap.get(defaultHeroFormId);
}

function getHeroFormStats() {
  return normalizeStats(getHeroForm()?.stats || {}, 999);
}

function getHeroFormImageUrl(form = getHeroForm()) {
  return `${heroFormImageBase}${form.image}`;
}

function setHeroForm(formId) {
  if (!heroFormMap.has(formId) || state.player.formId === formId) return;
  if (isPlayerDefeated() || state.bossReward) return;
  const oldStats = getPlayerStats();
  const targetForm = heroFormMap.get(formId);
  const currentForm = getHeroForm();
  const hpLoss = (currentForm?.stats?.hp || 0) - (targetForm?.stats?.hp || 0);
  if (hpLoss > 0 && state.player.hp <= hpLoss) {
    addBattleEvent("当前生命不足，无法切换会降低生命上限的形态。", "info");
    render();
    return;
  }
  state.player.formId = formId;
  const newStats = getPlayerStats();
  if (newStats.maxHp > oldStats.maxHp) {
    state.player.hp += newStats.maxHp - oldStats.maxHp;
  } else if (hpLoss > 0) {
    state.player.hp = Math.min(state.player.hp - hpLoss, newStats.maxHp);
  } else {
    state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  }
  state.player.hp = Math.max(0, state.player.hp);
  if (newStats.shield > oldStats.shield) {
    state.player.shield += newStats.shield - oldStats.shield;
  } else {
    state.player.shield = Math.min(state.player.shield, newStats.shield);
  }
  state.player.shieldMonsterId = "";
  saveGame();
  render();
}

function getItemSpecialStats(item) {
  const result = normalizeStats({}, 999);
  for (const instance of getItemSpecialInstances(item)) {
    const effect = instance.effect;
    const stateData = instance.state;
    if (effect.kind === "killThreshold" && effect.stat) {
      result[effect.stat] += clampInt(stateData.bonus, 0, 999) * effect.amount;
    } else if (effect.kind === "killPermanent" && effect.stat) {
      result[effect.stat] += clampInt(stateData.bonus, 0, 999);
    }
  }
  return result;
}

function getItemSpecialInstances(item) {
  return getItemSpecialKeys(item).map((key) => ({
    key,
    effect: photoSpecialEffectMap.get(key),
    state: ensureItemSpecialState(item, key),
  })).filter((entry) => entry.effect);
}

function getItemSpecialKeys(item) {
  if (!item || !Array.isArray(item.specialEffects)) return [];
  return [...new Set(item.specialEffects.filter((key) => photoSpecialEffectMap.has(key)))];
}

function ensureItemSpecialState(item, key) {
  if (!item.specialState || typeof item.specialState !== "object") item.specialState = {};
  if (!item.specialState[key] || typeof item.specialState[key] !== "object") {
    item.specialState[key] = {};
  }
  const data = item.specialState[key];
  if (!Number.isFinite(data.kills)) data.kills = 0;
  if (!Number.isFinite(data.bonus)) data.bonus = 0;
  return data;
}

function hasEquippedPhotoEffect(key) {
  return getEquippedItems().some((item) => getItemSpecialKeys(item).includes(key));
}

function getShieldCrashDamage() {
  if (!hasEquippedPhotoEffect("shieldCrashAttackDown")) return 0;
  return Math.floor(Math.max(0, state.player.shield || 0) * 0.5);
}

function triggerDealDamageSpecial() {
  if (!hasEquippedPhotoEffect("dealDamageAttack")) return;
  state.battleSpecial.attack = Math.min(10, (state.battleSpecial.attack || 0) + 1);
}

function triggerTakeDamageSpecial() {
  if (!hasEquippedPhotoEffect("takeDamageDefense")) return;
  state.battleSpecial.defense = Math.min(8, (state.battleSpecial.defense || 0) + 1);
}

function triggerKillSpecial(enemy) {
  void enemy;
  const changes = [];

  for (const item of getEquippedItems()) {
    for (const { key, effect, state: data } of getItemSpecialInstances(item)) {
      if (effect.kind === "killThreshold") {
        data.kills += 1;
        const targetBonus = Math.floor(data.kills / effect.threshold);
        if (targetBonus > data.bonus) {
          const gain = (targetBonus - data.bonus) * effect.amount;
          data.bonus = targetBonus;
          changes.push(`${formatItemDisplayName(item)} ${statLabels[effect.stat] || effect.stat}+${gain}`);
        }
      } else if (effect.kind === "killPermanent") {
        data.kills += 1;
        data.bonus += effect.amount;
        if (effect.stat === "hp") {
          const stats = getBattleStats(state.activeEnemyIds);
          state.player.hp = Math.min(stats.maxHp, state.player.hp + effect.amount);
        }
        changes.push(`${formatItemDisplayName(item)} ${statLabels[effect.stat] || effect.stat}+${effect.amount}`);
      }
      ensureItemSpecialState(item, key);
    }
  }

  if (changes.length) {
    addBattleDetail(`击杀触发：${changes.join("，")}。`);
  }
}

function getEquippedItems() {
  ensureInventorySlots();
  return state.inventory
    .slice(0, equipmentSlotLimit)
    .filter((item) => item && !item.tooLarge);
}

function isEquipmentLocked() {
  return Boolean(state.autoBattleTimer) || Boolean(state.currentBattle) || isPlayerDefeated() || Boolean(state.bossReward);
}

function dismantleSelectedItem() {
  if (isEquipmentLocked()) return false;
  ensureInventorySlots();
  const index = getSelectedSlotIndex();
  const removed = state.inventory[index];
  if (!removed) return false;

  const oldStats = getPlayerStats();
  const returnedFilm = getDismantleFilmReturn(removed);
  state.inventory[index] = null;
  state.selectedItemId = "";
  state.latestItem = state.inventory.find(Boolean) || null;
  state.infoMode = "log";
  addFilmAmount(returnedFilm);
  const newStats = getPlayerStats();
  if (newStats.maxHp < oldStats.maxHp) state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  state.lootError = "";
  setBusy("");
  addBattleEvent(`分解 ${formatItemDisplayName(removed)}，返还胶卷 +${formatFilmAmount(returnedFilm)}。`, "item");
  saveGame();
  render();
  return true;
}

function balanceItem(item, image = "") {
  const safe = item && typeof item === "object" ? item : {};
  const rarity = ["common", "uncommon", "rare"].includes(safe.rarity) ? safe.rarity : "common";
  const itemName = cleanText(safe.itemName, "照片装备", 18);
  const tags = normalizeStringList(safe.tags);
  const objectType = cleanText(safe.objectType, "", 18);
  const reason = cleanText(safe.reason, "", 72);
  const semanticText = [itemName, objectType, safe.description, reason, tags.join(" ")].filter(Boolean).join(" ");
  const tooLarge = shouldTreatAsTooLarge(itemName, semanticText, Boolean(safe.tooLarge));
  const requestedValue = tooLarge ? 0 : clampInt(safe.value, getPhotoValueMin(), getPhotoValueMax());
  const specialEffects = tooLarge
    ? []
    : choosePhotoSpecialEffects({ ...safe, itemName, objectType, reason, tags, description: semanticText }, image, requestedValue)
      .filter((key) => (photoSpecialEffectMap.get(key)?.value || Infinity) <= requestedValue);
  const specialValue = calculateSpecialEffectsValue(specialEffects);
  const statBudget = Math.max(0, requestedValue - specialValue);
  const targetValue = tooLarge
      ? 0
      : Math.max(requestedValue, specialValue);
  const stats = tooLarge
      ? normalizeStats({}, 20)
      : clampStatsToValue(allocateStatsForItem(safe.stats || {}, semanticText || itemName, statBudget), statBudget);

  return {
    itemName,
    objectType,
    rarity,
    value: targetValue,
    quality: getItemQuality(targetValue),
    stats,
    specialEffects,
    specialState: normalizeSpecialState(safe.specialState, specialEffects),
    description: tooLarge ? "主体过大或主要是场景，无法提供属性。" : cleanText(safe.description || reason, "由照片鉴定出的装备。", 72),
    reason,
    tags,
    confidence: clampNumber(safe.confidence, 0, 1),
    film: Boolean(safe.film),
    skipSpecialRoll: Boolean(safe.skipSpecialRoll),
    tooLarge,
    image,
  };
}

function normalizeInventoryItem(item) {
  const balanced = balanceItem({ ...(item || {}), skipSpecialRoll: true }, item?.image || makePlaceholderImage());
  const normalized = {
    ...balanced,
    id: typeof item?.id === "string" && item.id ? item.id : makeId("item"),
  };
  normalized.specialEffects = normalizeSpecialEffects(item?.specialEffects || balanced.specialEffects);
  normalized.specialState = normalizeSpecialState(item?.specialState || balanced.specialState, normalized.specialEffects);
  delete normalized.healAmount;
  delete normalized.consumable;
  return normalized;
}

function normalizeInventorySlots(inventory) {
  const slots = createEmptyInventorySlots();
  if (!Array.isArray(inventory)) return slots;
  const source = inventory.slice(0, equipmentVisibleSlots);
  for (let i = 0; i < source.length && i < equipmentVisibleSlots; i += 1) {
    slots[i] = source[i] ? normalizeInventoryItem(source[i]) : null;
  }
  return slots;
}

function scoreItem(item) {
  if (!item) return 0;
  if (Number.isFinite(item.value)) return Math.max(0, item.value);
  return calculateStatsValue(item.stats || {}) + calculateSpecialEffectsValue(getItemSpecialKeys(item));
}

function getItemQuality(value) {
  const score = Number.isFinite(value) ? value : 0;
  if (score >= 20) return { key: "legendary", label: "传说" };
  if (score >= 15) return { key: "epic", label: "史诗" };
  if (score >= 10) return { key: "rare", label: "稀有" };
  return { key: "common", label: "普通" };
}

function getItemQualityKey(item) {
  return getItemQuality(scoreItem(item)).key;
}

function getDismantleFilmReturn(item) {
  return Math.min(0.8, Math.ceil(scoreItem(item) * 0.5) / 10);
}

function normalizeStats(stats, maxValue = 20) {
  const safe = stats && typeof stats === "object" ? stats : {};
  return {
    hp: clampInt(safe.hp, 0, maxValue),
    attack: clampInt(safe.attack, 0, maxValue),
    defense: clampInt(safe.defense, 0, maxValue),
    speed: clampInt(safe.speed, 0, maxValue),
    shield: clampInt(safe.shield, 0, maxValue),
    lifesteal: clampInt(safe.lifesteal, 0, maxValue),
    regen: clampInt(safe.regen, 0, maxValue),
  };
}

function calculateStatsValue(stats) {
  const safe = normalizeStats(stats, 99);
  return statOrder.reduce((total, key) => total + safe[key] * statValueWeights[key], 0);
}

function clampStatsToValue(stats, valueBudget) {
  const result = normalizeStats(stats, 20);
  let remaining = Math.max(0, valueBudget);
  for (const key of statOrder) {
    const weight = statValueWeights[key];
    const maxPoints = Math.min(result[key], Math.floor(remaining / weight));
    result[key] = maxPoints;
    remaining -= maxPoints * weight;
  }
  return result;
}

function allocateStatsForItem(rawStats, itemName, valueBudget) {
  const normalized = normalizeStats(rawStats, 20);
  if (calculateStatsValue(normalized) > 0) return normalized;
  const keys = inferPreferredStats(itemName);
  const result = normalizeStats({}, 20);
  let remaining = valueBudget;
  for (const key of keys) {
    const points = Math.floor(remaining / statValueWeights[key]);
    if (points > 0) {
      result[key] += points;
      remaining -= points * statValueWeights[key];
    }
  }
  if (!calculateStatsValue(result)) result.hp = Math.max(0, remaining);
  return result;
}

function choosePhotoSpecialEffects(item, image, valueBudget) {
  const provided = normalizeSpecialEffects(item.specialEffects || item.effects || item.special || item.specialEffect)
    .filter((key) => (photoSpecialEffectMap.get(key)?.value || Infinity) <= valueBudget);
  if (provided.length) return provided.slice(0, 1);
  if (item.skipSpecialRoll) return [];
  if (valueBudget < 10) return [];

  const seed = `${item.itemName || ""}:${item.description || ""}:${image ? image.slice(0, 96) : ""}:${item.value || ""}`;
  const semanticPick = inferSemanticSpecialEffect(`${item.itemName || ""} ${item.objectType || ""} ${item.description || ""} ${item.reason || ""} ${normalizeStringList(item.tags).join(" ")}`);
  if (semanticPick && (photoSpecialEffectMap.get(semanticPick)?.value || Infinity) <= valueBudget) {
    const semanticRoll = hashIndex(`${seed}:semantic-special-roll`, 100);
    if (semanticRoll < 45) return [semanticPick];
  }

  const roll = hashIndex(`${seed}:special-roll`, 100);
  if (roll >= 20) return [];

  const preferred = inferSemanticSpecialEffects(`${item.itemName || ""} ${item.objectType || ""} ${item.description || ""} ${item.reason || ""} ${normalizeStringList(item.tags).join(" ")}`);
  const eligible = (preferred.length ? preferred : photoSpecialEffects.map((effect) => effect.key))
    .map((key) => photoSpecialEffectMap.get(key))
    .filter((effect) => effect && effect.value <= valueBudget);
  if (!eligible.length) return [];
  const picked = eligible[hashIndex(`${seed}:special-pick`, eligible.length)];
  return picked ? [picked.key] : [];
}

function inferSemanticSpecialEffect(text) {
  return inferSemanticSpecialEffects(text)[0] || "";
}

function inferSemanticSpecialEffects(text) {
  const source = String(text || "");
  const effects = [];
  const add = (key) => {
    if (photoSpecialEffectMap.has(key) && !effects.includes(key)) effects.push(key);
  };

  if (/鞋|拖鞋|滑板|轮|风扇|扇|双|一对|速度|疾|飞|跑|旋转|气流/.test(source)) add("doubleStrikeSpeedDown");
  if (/刀|剪|针|钩|指甲刀|锥|刃|锯|尖|夹|钳/.test(source)) add("dealDamageAttack");
  if (/锤|棍|棒|砖|石|键盘|鼠标|工具|扳手|螺丝刀|球拍|拍子|硬物|武器/.test(source)) {
    add("dealDamageAttack");
    add("killAttack");
  }
  if (/盾|锅盖|壳|盒|箱|套|盔|伞|镜|护|防|金属外壳|玻璃罩|甲/.test(source)) {
    add("shieldCrashAttackDown");
    add("takeDamageDefense");
    add("killShield");
  }
  if (/书|本|笔|尺|奖|证|牌|训练|练习|种子|植物|成长|学习|日记|笔记/.test(source)) {
    add("killAttack");
    add("killDefense");
    add("killSpeed");
  }
  if (/食|饭|面|糖|饼|肉|菜|果|西红柿|番茄|香蕉|药|茶|奶|水|饮|咖啡|汤|杯|瓶|补给|能量/.test(source)) {
    add("killMaxHp");
    add("killHpBoost");
  }
  return effects;
}

function normalizeSpecialEffects(input) {
  const values = Array.isArray(input) ? input : input ? [input] : [];
  return [...new Set(values.map((value) => normalizeSpecialEffectKey(value)).filter((key) => photoSpecialEffectMap.has(key)))];
}

function normalizeSpecialEffectKey(value) {
  if (typeof value === "string") {
    if (photoSpecialEffectMap.has(value)) return value;
    const text = value.trim();
    const byLabel = photoSpecialEffects.find((effect) => effect.label === text || text.includes(effect.label));
    if (byLabel) return byLabel.key;
    if (/击杀.*8.*攻/.test(text)) return "killAttack";
    if (/击杀.*8.*防/.test(text)) return "killDefense";
    if (/击杀.*4.*盾/.test(text)) return "killShield";
    if (/击杀.*12.*速/.test(text)) return "killSpeed";
    if (/造成伤害.*攻|攻击.*最多10/.test(text)) return "dealDamageAttack";
    if (/受到伤害.*防|受击.*防/.test(text)) return "takeDamageDefense";
    if (/击杀.*生命上限/.test(text)) return "killMaxHp";
    if (/击杀.*生命|击杀.*回复|击杀.*回血/.test(text)) return "killHpBoost";
    if (/二连击|连击2/.test(text)) return "doubleStrikeSpeedDown";
    if (/当前护盾|护盾.*0\.?5|护盾.*一半/.test(text)) return "shieldCrashAttackDown";
  }
  if (value && typeof value === "object") {
    return normalizeSpecialEffectKey(value.key || value.type || value.name || value.label);
  }
  return "";
}

function normalizeSpecialState(rawState, effectKeys) {
  const source = rawState && typeof rawState === "object" ? rawState : {};
  const result = {};
  for (const key of effectKeys) {
    const data = source[key] && typeof source[key] === "object" ? source[key] : {};
    result[key] = {
      kills: clampInt(data.kills, 0, 9999),
      bonus: clampInt(data.bonus, 0, 9999),
    };
  }
  return result;
}

function calculateSpecialEffectsValue(effectKeys) {
  return getSpecialEffectDefinitions(effectKeys)
    .reduce((total, effect) => total + effect.value, 0);
}

function getSpecialEffectDefinitions(effectKeys) {
  return normalizeSpecialEffects(effectKeys)
    .map((key) => photoSpecialEffectMap.get(key))
    .filter(Boolean);
}

function inferPreferredStats(name) {
  const text = String(name || "");
  if (/咖啡|水|饮|药|汤|茶|奶|果汁|杯|瓶|喷雾|清洁|纸巾|毛巾|湿巾/.test(text)) return ["regen", "hp", "shield"];
  if (/番茄|西红柿|香蕉|饭|面|糖|饼|肉|菜|水果|食|能量|糖果|零食|植物|花|叶|种子/.test(text)) return ["hp", "regen", "shield"];
  if (/刀|剪|针|钉|锥|刃|指甲刀|钩|夹|钳|锯|尖锐/.test(text)) return ["lifesteal", "attack", "speed"];
  if (/键盘|鼠标|锤|棍|棒|笔|工具|扳手|螺丝刀|砖|石|球拍|拍子|遥控器|手机|相机/.test(text)) return ["attack", "defense", "hp"];
  if (/锅盖|镜|盾|伞|盔|盒|箱|包|壳|套|口罩|眼镜|锁|钥匙|防护|保护|容器/.test(text)) return ["shield", "defense", "hp"];
  if (/鞋|拖鞋|滑板|风扇|轮|轻|羽|飞|跑|车模|陀螺|旋转|气流|线缆|充电器|电池/.test(text)) return ["speed", "attack", "hp"];
  if (/书|本|笔记|卡片|贴纸|玩具|模型|摆件|公仔|青蛙|卡通|图案/.test(text)) return ["hp", "shield", "attack"];
  return ["attack", "shield", "hp"];
}

async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件。");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    return resizeImageToDataUrl(image, analysisImageMaxEdge, analysisImageQuality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function makeInventoryImage(src) {
  const image = await loadImage(src);
  return resizeImageToDataUrl(image, inventoryImageMaxEdge, inventoryImageQuality);
}

function resizeImageToDataUrl(image, maxEdge, quality) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

function makeVisionTestImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 360;
  canvas.height = 220;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#245f9a";
  ctx.fillRect(26, 26, 308, 168);
  ctx.fillStyle = "#fffaf0";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText("照片勇者", 78, 92);
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("VISION OK", 86, 142);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片解码失败。"));
    image.src = src;
  });
}

function render() {
  ensureEncounter();
  ensureInventorySlots();
  const stats = getPlayerStats();
  const defeated = isPlayerDefeated();
  const bossRewardPending = Boolean(state.bossReward);

  state.player.hp = Math.max(0, Math.min(state.player.hp, stats.maxHp));
  const form = getHeroForm();
  els.heroAvatarImage.src = getHeroFormImageUrl(form);
  els.heroAvatarImage.alt = `照片勇者${form.label}形态`;
  renderHeroForms();

  els.playerHpText.textContent = `${state.player.hp}/${stats.maxHp}`;
  els.playerHpBar.style.width = `${percent(state.player.hp, stats.maxHp)}%`;
  els.playerHpBar.parentElement.classList.toggle("is-low", percent(state.player.hp, stats.maxHp) <= 30);
  els.playerAtk.textContent = stats.atk;
  els.playerDef.textContent = stats.def;
  els.playerSpeed.textContent = stats.speed;
  els.playerRegen.textContent = stats.regen;
  els.playerLifesteal.textContent = stats.lifesteal;
  els.playerShield.textContent = `${state.player.shield}/${stats.shield}`;

  els.floorText.textContent = state.gameClear
    ? "已通关"
    : `第 ${state.floor} / ${maxFloor} 层${isBossFloor(state.floor) ? " · Boss" : isRewardBossFloor(state.floor) ? " · 可选Boss" : ""}`;
  renderEnemyField();
  els.attackBtn.disabled = defeated || bossRewardPending || isBattleActionLocked() || Boolean(state.autoBattleTimer) || state.pendingFloorAdvance || Boolean(state.battleStartTimer) || state.gameClear || !getSelectedEnemies().length;
  els.attackBtn.setAttribute("aria-pressed", String(Boolean(state.autoBattleTimer)));
  els.fleeBtn.disabled = defeated || bossRewardPending || isBattleActionLocked() || state.pendingFloorAdvance || Boolean(state.battleStartTimer) || state.gameClear || isBossFloor(state.floor);

  renderApiStatus();
  renderCameraStatus();
  renderEquipmentGrid();
  renderEquipmentDetail();
  renderGameTextOnly();
}

function renderApiStatus() {
  const config = getConfigFromInputs();
  const missing = getMissingConfigFields(config);
  const activePreset = API_PRESETS[config.presetId] || API_PRESETS.custom;
  let stateName = "ready";
  let title = "API 配置完整";

  if (missing.length) {
    stateName = "missing";
    title = "API 未配置";
  } else if (activePreset.supportsVision === false || !isLikelyVisionModel(config)) {
    stateName = "text-only";
    title = "当前模型可能不支持图片输入";
  }

  if (els.apiStatusBadge) {
    els.apiStatusBadge.textContent = stateName === "ready" ? "API 已配置" : stateName === "missing" ? "API 未配置" : "仅文本测试";
    els.apiStatusBadge.dataset.state = stateName;
  }
  if (els.configToggleBtn) {
    els.configToggleBtn.dataset.state = stateName;
    els.configToggleBtn.title = title;
    els.configToggleBtn.setAttribute("aria-label", title);
  }
}

function renderCameraStatus() {
  els.filmCountBadge.textContent = `胶卷 ${formatFilmCount()}`;
}

function renderEnemyField() {
  els.enemyField.innerHTML = "";
  const enemyDamageEstimates = getEnemyDamageEstimates();
  const shouldFlipIn = state.enemyFlipEncounterId === state.encounterId && !state.currentBattle && !state.autoBattleTimer;

  if (state.bossReward) {
    renderBossRewardCards();
    return;
  }

  if (state.gameClear) {
    const clear = document.createElement("article");
    clear.className = "enemy-card is-active";
    clear.innerHTML = `
      <div class="enemy-card-head">
        <span class="monster-token">终</span>
        <div>
          <strong>40层已通关</strong>
          <span>等待下一版内容</span>
        </div>
      </div>
    `;
    els.enemyField.append(clear);
    return;
  }

  if (isBossFloor(state.floor)) {
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
  }

  state.enemies.forEach((enemy, index) => {
    const isDefeated = enemy.hp <= 0;
    const isLocked = Boolean(state.autoBattleTimer) || Boolean(state.currentBattle) || state.pendingFloorAdvance || Boolean(state.battleStartTimer) || isBossFloor(state.floor) || isDefeated;
    const selectionOrder = getEnemySelectionOrder(enemy.id);
    const isSelected = selectionOrder > 0;
    const isFaceDown = state.enemyFaceDownIds.has(enemy.id);
    const isFlippingDown = state.enemyFlipDownIds.has(enemy.id);
    const isFlippingUp = state.enemyFlipUpIds.has(enemy.id);
    const estimate = enemyDamageEstimates.get(enemy.id) || { text: "损失 ???", state: "unknown" };
    const button = document.createElement("button");
    button.className = `enemy-card enemy-select-card${isSelected ? " is-selected" : ""}${state.activeEnemyIds?.includes(enemy.id) ? " is-active" : ""}${isLocked ? " is-locked" : ""}${isDefeated ? " is-defeated" : ""}${shouldFlipIn ? " is-entering" : ""}${isFaceDown ? " is-face-down" : ""}${isFlippingDown ? " is-flipping-down" : ""}${isFlippingUp ? " is-flipping-up" : ""}`;
    button.type = "button";
    if (shouldFlipIn) {
      button.style.setProperty("--flip-delay", `${Math.min(2, index) * 80}ms`);
      button.addEventListener("animationend", () => button.classList.remove("is-entering"), { once: true });
    }
    if (isFlippingDown) {
      button.addEventListener("animationend", () => finishEnemyFlipDown(enemy.id), { once: true });
      window.setTimeout(() => finishEnemyFlipDown(enemy.id), 340);
    }
    button.setAttribute("aria-disabled", String(isLocked));
    button.addEventListener("click", () => {
      if (isLocked) return;
      toggleEnemySelection(enemy.id);
      saveGame();
      render();
    });

    const traitText = enemy.traits?.map((trait) => trait.text).filter(Boolean).join(" / ") || "";
    const imageUrl = getMonsterImageUrl(enemy.typeKey);
    const dropText = formatEnemyFilmDrop(enemy);
    button.innerHTML = `
      ${selectionOrder ? `<span class="selection-badge">${selectionOrder}</span>` : ""}
      <div class="enemy-card-head">
        <div class="monster-portrait">
          <img src="${imageUrl}" alt="${escapeHtml(enemy.typeName)}">
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(enemy.name)}</strong>
          <span>${escapeHtml(traitText)}</span>
        </div>
      </div>
      <dl class="enemy-card-stats">
        <div><dt>攻</dt><dd>${enemy.atk}</dd></div>
        <div><dt>防</dt><dd>${enemy.def}</dd></div>
        <div><dt>速</dt><dd>${enemy.speed}</dd></div>
      </dl>
      <div class="enemy-card-result">
        <span>${dropText}</span>
        <strong class="estimate-${estimate.state}">${escapeHtml(estimate.text)}</strong>
      </div>
      <div class="enemy-hp-line">
        <span>${enemy.hp}/${enemy.maxHp}</span>
        <div class="hp-track danger"><span style="width:${percent(enemy.hp, enemy.maxHp)}%"></span></div>
      </div>
      <div class="enemy-card-back" aria-hidden="true">
        <span>${isDefeated ? "已击破" : "未参战"}</span>
      </div>
    `;
    els.enemyField.append(button);
  });
  if (shouldFlipIn) state.enemyFlipEncounterId = "";
}

function renderBossRewardCards() {
  const options = Array.isArray(state.bossReward?.options) ? state.bossReward.options : [];
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "enemy-card reward-card";
    button.type = "button";
    button.addEventListener("click", () => chooseBossReward(index));
    button.innerHTML = `
      <div class="enemy-card-head">
        <div class="monster-portrait reward-portrait">
          <span>${index + 1}</span>
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(option.title || "奖励")}</strong>
          <span>${escapeHtml(option.desc || "选择后进入下一层。")}</span>
        </div>
      </div>
      <div class="enemy-card-result">
        <span>Boss奖励</span>
        <strong class="estimate-safe">选择</strong>
      </div>
    `;
    els.enemyField.append(button);
  });
}

function getEnemyDamageEstimates() {
  const estimates = new Map();
  if (isPlayerDefeated()) return estimates;
  if (state.currentBattle?.damageEstimates) {
    for (const [id, estimate] of Object.entries(state.currentBattle.damageEstimates)) {
      estimates.set(id, estimate);
    }
    for (const enemy of state.enemies.filter((item) => item.hp > 0)) {
      if (!estimates.has(enemy.id)) estimates.set(enemy.id, makeUnknownEstimate());
    }
    return estimates;
  }

  const aliveEnemies = state.enemies.filter((enemy) => enemy.hp > 0);
  const selectedIds = state.selectedEnemyIds.filter((id) => aliveEnemies.some((enemy) => enemy.id === id));
  if (selectedIds.length) {
    for (const [id, estimate] of simulateDamageEstimateForIds(selectedIds)) {
      estimates.set(id, estimate);
    }
  }

  for (const enemy of aliveEnemies) {
    if (estimates.has(enemy.id)) continue;
    const singleEstimate = simulateDamageEstimateForIds([enemy.id]).get(enemy.id);
    if (singleEstimate) estimates.set(enemy.id, singleEstimate);
  }

  return estimates;
}

function simulateDamageEstimateForIds(enemyIds, options = {}) {
  if (!options.ignoreFrozen && state.currentBattle?.damageEstimates) {
    const frozen = new Map(Object.entries(state.currentBattle.damageEstimates));
    return new Map(enemyIds.map((id) => [id, frozen.get(id) || makeUnknownEstimate()]));
  }
  const estimates = new Map();
  const enemies = enemyIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id))
    .filter(Boolean)
    .map(cloneEnemyForSimulation);
  if (!enemies.length) return estimates;

  const actualStartHp = state.player.hp;
  const theoreticalBuffer = 10000;
  const startHp = actualStartHp + theoreticalBuffer;
  const sim = createBattleSimulation(enemies);
  sim.hp = startHp;
  sim.initialHp = startHp;
  sim.actualStartHp = actualStartHp;
  sim.maxHpBonus = theoreticalBuffer;

  while (sim.hp > 0 && sim.activeIds.length) {
    if (sim.round >= 50) {
      for (const id of sim.activeIds) {
        estimates.set(id, makeUnknownEstimate());
      }
      break;
    }
    const nextEnemyId = getNextSimEnemyId(sim);
    const enemyTime = nextEnemyId ? sim.enemyTimes.get(nextEnemyId) : Infinity;
    const currentStats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
    currentStats.maxHp += sim.maxHpBonus || 0;
    if (sim.heroTime === Infinity && (!nextEnemyId || enemyTime === Infinity)) {
      for (const id of sim.activeIds) estimates.set(id, makeUnknownEstimate());
      break;
    }

    if (!nextEnemyId || sim.heroTime <= enemyTime + Number.EPSILON) {
      const defeatedIds = simulateHeroStrike(sim, enemies, currentStats);
      for (const id of defeatedIds) {
        estimates.set(id, formatHpLossEstimate(sim.initialHp - sim.hp, sim.actualStartHp));
      }
      sim.heroTime += getActionInterval(currentStats.speed);
      sim.round = defeatedIds.length ? 1 : sim.round + 1;
    } else {
      const enemy = enemies.find((item) => item.id === nextEnemyId);
      if (enemy) simulateMonsterStrike(sim, enemy, enemies, currentStats);
      sim.enemyTimes.set(nextEnemyId, enemyTime + getActionInterval(enemy?.speed || 0));
      sim.round += 1;
    }
  }

  for (const id of enemyIds) {
    if (!estimates.has(id)) {
      estimates.set(id, makeUnknownEstimate());
    }
  }
  return estimates;
}

function formatHpLossEstimate(loss, actualStartHp) {
  const value = Math.trunc(loss);
  const text = value < 0 ? `损失 +${Math.abs(value)}` : `损失 -${value}`;
  return {
    text,
    state: value > actualStartHp ? "danger" : "safe",
  };
}

function makeUnknownEstimate() {
  return { text: "损失 ???", state: "unknown" };
}

function getMonsterImageUrl(typeKey) {
  return `${monsterImageBase}${monsterImages[typeKey] || monsterImages.slime}`;
}

function getEnemyMaxShield(enemy) {
  return Math.max(enemy?.shield || 0, getTraitValue(enemy, "shield", 0));
}

function renderEquipmentGrid() {
  ensureInventorySlots();
  const locked = isEquipmentLocked();
  const selectionLocked = isEquipmentSelectionLocked();
  const selectedSlotIndex = getSelectedSlotIndex();

  els.equipmentGrid.innerHTML = "";
  for (let i = 0; i < equipmentVisibleSlots; i += 1) {
    const item = state.inventory[i];
    const button = document.createElement("button");
    const isSelected = i === selectedSlotIndex;
    const qualityKey = item ? getItemQualityKey(item) : "empty";
    button.className = `equipment-slot quality-${qualityKey}${item ? " has-item" : ""}${isSelected ? " is-selected" : ""}${selectionLocked ? " is-locked" : ""}`;
    button.type = "button";
    button.disabled = selectionLocked;
    button.setAttribute("aria-label", item ? `选择${item.itemName}` : `选择空装备格${i + 1}`);
    button.addEventListener("click", () => {
      if (selectionLocked) return;
      const wasSelected = i === getSelectedSlotIndex();
      const wasItemMode = state.infoMode === "item";
      const isRepeatClick = wasSelected && wasItemMode;
      state.selectedSlotIndex = i;
      state.selectedItemId = item?.id || "";
      state.lootError = "";
      state.infoMode = "item";
      if (!item) {
        state.lastPhoto = "";
        state.pendingPhotoSlotIndex = i;
      } else if (isRepeatClick && item.image) {
        openImageViewer(item.image, formatItemDisplayName(item));
      }
      saveGame();
      render();
    });

    if (item) {
      button.innerHTML = `
        <img src="${item.image || makePlaceholderImage()}" alt="">
        <span>${escapeHtml(formatItemDisplayName(item))}</span>
      `;
    } else {
      button.innerHTML = `<span class="empty-slot">${getCameraIconMarkup()}</span>`;
    }

    els.equipmentGrid.append(button);
  }
}

function renderEquipmentDetail() {
  ensureInventorySlots();
  const selected = getSelectedInventoryItem();
  const locked = isEquipmentLocked();
  const showingItem = state.infoMode === "item";

  els.equipmentActions.hidden = true;
  els.photoActionBtn.hidden = true;
  els.photoActionBtn.disabled = true;
  els.analyzePhotoBtn.hidden = true;
  els.analyzePhotoBtn.disabled = true;
  els.discardItemBtn.disabled = true;
  els.discardItemBtn.hidden = true;
  els.battleLog.hidden = true;
  els.equipmentDetailDesc.hidden = false;
  els.filmCountBadge.hidden = true;
  els.pendingPhotoPreview.hidden = true;
  els.pendingPhotoImage.removeAttribute("src");
  els.loadingState.hidden = false;
  els.equipmentDetail.classList.remove("is-error", "is-actionable", "is-log");
  els.equipmentDetailStats.hidden = false;
  delete els.equipmentDetailName.dataset.quality;

  if (state.lootError && !state.lastPhoto) {
    els.equipmentDetail.classList.add("is-error");
    els.equipmentDetailName.textContent = "鉴定失败";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = `${state.lootError} ${getLootErrorHint(state.lootError)}`;
    return;
  }

  if (state.lastPhoto && showingItem) {
    if (state.lootError) els.equipmentDetail.classList.add("is-error");
    els.equipmentDetailName.textContent = "待鉴定照片";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = state.lootError
      ? `${state.lootError} 可以重新鉴定。`
      : state.filmRolls >= 1
        ? `确认后鉴定并装入当前装备格。当前价值范围 ${formatPhotoValueRange()}。`
        : "胶卷不足，先击败怪物获得资源。";
    els.equipmentActions.hidden = false;
    els.analyzePhotoBtn.hidden = false;
    els.analyzePhotoBtn.disabled = locked || Boolean(els.loadingState.textContent) || state.filmRolls < 1;
    els.pendingPhotoPreview.hidden = false;
    els.pendingPhotoImage.src = state.lastPhoto;
    return;
  }

  if (!showingItem) {
    els.equipmentDetail.classList.add("is-log");
    els.equipmentDetailName.textContent = "";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.hidden = true;
    els.battleLog.hidden = false;
    els.filmCountBadge.hidden = true;
    renderLog();
    return;
  }

  if (!selected) {
    els.equipmentDetailName.textContent = "空装备格";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailStats.hidden = true;
    els.equipmentDetailDesc.textContent = locked
      ? isPlayerDefeated()
        ? "照片勇者已经倒下，只能重开。"
        : state.bossReward
          ? "先选择 Boss 奖励。"
          : "战斗中不能拍照鉴定。"
      : state.filmRolls >= 1
        ? `点击拍照按钮获取装备照片。当前价值范围 ${formatPhotoValueRange()}。`
        : "胶卷不足，先击败怪物获得资源。";
    els.filmCountBadge.hidden = false;
    els.equipmentActions.hidden = false;
    els.photoActionBtn.hidden = false;
    els.photoActionBtn.disabled = locked || state.filmRolls < 1;
    return;
  }

  const quality = getItemQuality(scoreItem(selected));
  els.equipmentDetailName.textContent = formatItemDisplayName(selected);
  els.equipmentDetailName.dataset.quality = quality.label;
  els.equipmentDetailStats.innerHTML = renderItemDetailPills(selected);
  els.equipmentDetailStats.hidden = false;
  els.equipmentDetailDesc.textContent = selected.description;
  els.equipmentActions.hidden = false;
  els.discardItemBtn.hidden = false;
  els.discardItemBtn.disabled = locked;
  const refund = getDismantleFilmReturn(selected);
  els.discardItemBtn.textContent = `分解 +${formatFilmAmount(refund)}`;
}

function getCameraIconMarkup() {
  return `
    <svg class="camera-empty-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 8h4l1.6-2h4.8L16 8h4v11H4V8Z"></path>
      <circle cx="12" cy="13.5" r="3.2"></circle>
    </svg>
  `;
}

function renderHeroForms() {
  els.formGrid.innerHTML = "";
  const currentForm = getHeroForm();
  document.querySelectorAll("[data-form-label]").forEach((node) => {
    node.textContent = `${currentForm.label}形态`;
  });

  for (const form of heroForms) {
    const button = document.createElement("button");
    button.className = "form-card";
    button.type = "button";
    button.dataset.formId = form.id;
    const hpLoss = (currentForm?.stats?.hp || 0) - (form?.stats?.hp || 0);
    const locked = isPlayerDefeated() || Boolean(state.bossReward) || (hpLoss > 0 && state.player.hp <= hpLoss);
    button.disabled = locked;
    button.setAttribute("aria-pressed", String(form.id === currentForm.id));
    if (form.id === currentForm.id) button.classList.add("is-active");
    if (locked) button.classList.add("is-locked");

    const img = document.createElement("img");
    img.src = getHeroFormImageUrl(form);
    img.alt = `${form.label}形态`;

    const copy = document.createElement("span");
    copy.className = "form-copy";
    copy.innerHTML = `<strong>${escapeHtml(form.label)}</strong><small>${escapeHtml(form.desc)}</small>`;

    button.append(img, copy);
    button.addEventListener("click", () => setHeroForm(form.id));
    els.formGrid.append(button);
  }
}

function getLootErrorHint(message) {
  const text = String(message || "");
  if (text.includes("image_url") || text.includes("图片输入") || text.includes("没有识别图片内容")) {
    return "当前模型可能不支持图片输入，或中转站没有把图片转发给模型。";
  }
  if (text.includes("浏览器直连") || text.toLowerCase().includes("cors")) {
    return "浏览器直连失败时，需要换支持 CORS 的接口，或后续加本地/云端代理。";
  }
  if (text.includes("响应结构")) {
    return "接口返回结构不标准，请把错误里的响应结构发给开发者适配。";
  }
  return "模型已返回内容，但格式不符合游戏约束；可以换模型或重试一张更清晰的现实物品照片。";
}

function renderStatPills(stats) {
  const pills = Object.entries(statLabels)
    .filter(([key]) => stats[key])
    .map(([key, label]) => `<span>${label} ${formatSignedNumber(stats[key] || 0)}</span>`);
  return pills.length ? pills.join("") : "<span>无属性</span>";
}

function formatSignedNumber(value) {
  const numeric = Number(value) || 0;
  return numeric > 0 ? `+${numeric}` : String(numeric);
}

function renderItemDetailPills(item) {
  const effectHtml = renderSpecialEffectPills(item);
  if (effectHtml && calculateStatsValue(item.stats || {}) <= 0) return effectHtml;
  const statHtml = renderStatPills(item.stats);
  if (effectHtml) return `${statHtml}${effectHtml}`;
  return statHtml;
}

function renderSpecialEffectPills(item) {
  return getItemSpecialInstances(item)
    .map(({ effect, state: data }) => `<span class="effect-pill">${escapeHtml(formatSpecialEffectText(effect, data))}</span>`)
    .join("");
}

function formatSpecialEffectText(effect, data = {}) {
  if (effect.kind === "killThreshold") {
    const progress = clampInt(data.kills, 0, 9999) % effect.threshold;
    const bonus = clampInt(data.bonus, 0, 9999) * effect.amount;
    return `${effect.label}（${progress}/${effect.threshold}，已+${bonus}）`;
  }
  if (effect.kind === "killPermanent") {
    return `${effect.label}（已+${clampInt(data.bonus, 0, 9999)}）`;
  }
  if (effect.kind === "dealDamageTemp") return `${effect.label}，最多${effect.cap}，战后复原`;
  if (effect.kind === "takeDamageTemp") return `${effect.label}，最多${effect.cap}，战后复原`;
  return effect.label;
}

function renderLog() {
  els.battleLog.innerHTML = "";
  const entries = [];

  if (state.currentBattle) {
    entries.push({
      id: "current",
      type: "current",
    summary: `正在对战${state.currentBattle.monsterName}`,
      details: state.currentBattle.details,
      expanded: true,
    });
  }

  entries.push(...state.battleReports);

  if (!entries.length) {
    return;
  }

  for (const entry of entries.slice(0, battleReportLimit)) {
    if (entry.type === "current") {
      renderBattleEntry(entry, "", false);
    } else if (entry.type === "event") {
      renderBattleEntry(entry, "", false);
    } else {
      renderBattleEntry(entry, "", true);
    }
  }
}

function renderBattleEntry(entry, markText, canToggle) {
  const isBattle = entry.type !== "event";
  const li = createBattleListItem({
    mark: markText,
    markClass: "",
    text: entry.summary,
    className: `${canToggle ? "is-summary" : ""}${entry.expanded ? " is-expanded" : ""}`,
  });

  if (canToggle) {
    const button = document.createElement("button");
    button.className = "battle-report-toggle";
    button.type = "button";
    button.textContent = entry.summary;
    button.setAttribute("aria-expanded", String(Boolean(entry.expanded)));
    button.addEventListener("click", () => toggleBattleReport(entry.id));
    li.lastChild.replaceWith(button);
  }

  if (entry.type === "current" && isBattle) {
    const details = entry.details?.length ? [...entry.details].reverse() : [];
    for (const detail of details) {
      els.battleLog.append(createBattleListItem({
        mark: "·",
        markClass: "detail",
        text: detail,
        className: "is-detail is-latest-first",
      }));
    }
    els.battleLog.append(li);
    return;
  }

  els.battleLog.append(li);

  if (entry.expanded && isBattle) {
    const details = entry.details?.length ? entry.details : ["暂无详细回合。"];
    for (const detail of details) {
      els.battleLog.append(createBattleListItem({
        mark: "·",
        markClass: "detail",
        text: detail,
        className: "is-detail",
      }));
    }
  }
}

function createBattleListItem({ mark, markClass = "", text, className = "" }) {
  const li = document.createElement("li");
  li.className = className.trim();
  const textEl = document.createElement("span");
  textEl.textContent = text;
  if (mark) {
    const markEl = document.createElement("span");
    markEl.className = `log-mark ${markClass}`.trim();
    markEl.textContent = mark;
    li.append(markEl, textEl);
  } else {
    li.classList.add("no-mark");
    li.append(textEl);
  }
  return li;
}

function toggleBattleReport(id) {
  const report = state.battleReports.find((entry) => entry.id === id);
  if (!report || report.type === "event") return;
  report.expanded = !report.expanded;
  saveGame();
  render();
}

function renderGameTextOnly() {
  const equippedItems = getEquippedItems();
  const selectedEquipment = getSelectedInventoryItem();
  const enemyDamageEstimates = getEnemyDamageEstimates();
  const inventoryItems = state.inventory.filter(Boolean);
  window.__photoHeroState = {
    runSeed: state.runSeed,
    player: {
      hp: state.player.hp,
      shield: state.player.shield,
      form: {
        id: getHeroForm().id,
        label: getHeroForm().label,
        stats: getHeroFormStats(),
        filmDropBonus: getHeroFormFilmShardBonus() / 10,
        noFilmDrop: Boolean(getHeroForm()?.noFilmDrop),
      },
      stats: getPlayerStats(),
      equipmentCount: inventoryItems.length,
      equippedCount: equippedItems.length,
      filmRolls: state.filmRolls,
      filmShards: state.filmShards,
      filmCount: getFilmCount(),
      photoValueMin: getPhotoValueMin(),
      photoValueMax: getPhotoValueMax(),
      globalFilmDropBonus: getGlobalFilmDropBonus() / 10,
      battleSpecial: { ...(state.battleSpecial || {}) },
      selectedEquipment: selectedEquipment ? formatItemDisplayName(selectedEquipment) : null,
      selectedSlotIndex: getSelectedSlotIndex(),
      equippedItems: equippedItems.map((item) => formatItemDisplayName(item)),
      equippedEffects: equippedItems.flatMap((item) => getItemSpecialKeys(item)),
    },
    floor: state.floor,
    maxFloor,
    gameClear: Boolean(state.gameClear),
    enemies: state.enemies.map((enemy, index) => ({
      index,
      id: enemy.id,
      name: enemy.name,
      typeKey: enemy.typeKey,
      image: getMonsterImageUrl(enemy.typeKey),
      typeName: enemy.typeName,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      shield: enemy.shield,
      atk: enemy.atk,
      def: enemy.def,
      speed: enemy.speed,
      traits: enemy.traits?.map((trait) => trait.text || trait.type) || [],
      drop: formatEnemyFilmDrop(enemy),
      damageEstimate: enemyDamageEstimates.get(enemy.id)?.text || "",
      damageEstimateState: enemyDamageEstimates.get(enemy.id)?.state || "",
      selected: state.selectedEnemyIds.includes(enemy.id),
      selectionOrder: getEnemySelectionOrder(enemy.id),
      active: state.activeEnemyIds.includes(enemy.id),
    })),
    selectedEnemyIds: [...state.selectedEnemyIds],
    selectedEnemyCount: state.selectedEnemyIds.length,
    activeEnemyIds: [...state.activeEnemyIds],
    bossReward: state.bossReward ? {
      floor: state.bossReward.floor,
      options: state.bossReward.options,
    } : null,
    hasPhoto: Boolean(state.lastPhoto),
    latestItem: state.latestItem,
    inventory: state.inventory.map((item, slotIndex) => item ? ({
      slotIndex,
      name: formatItemDisplayName(item),
      score: scoreItem(item),
      stats: item.stats || {},
      effects: getItemSpecialKeys(item),
      specialState: item.specialState || {},
      equipped: !item.tooLarge,
    }) : null),
    battleClock: state.battleClock,
    currentBattle: state.currentBattle
      ? {
          monsterName: state.currentBattle.monsterName,
          details: state.currentBattle.details,
        }
      : null,
    battleReports: state.battleReports.slice(0, 4).map((entry) => ({
      type: entry.type,
      result: entry.result || entry.eventType || "",
      summary: entry.summary,
      expanded: Boolean(entry.expanded),
      details: entry.expanded ? entry.details : [],
    })),
  };
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 20);
}

function setBusy(message) {
  els.loadingState.textContent = message;
  els.loadingState.dataset.notice = message ? "false" : "";
}

function saveConfig(showLog = true) {
  rememberCurrentApiKey();
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(getConfigFromInputs()));
  if (showLog) addLog("API 配置已保存到当前浏览器。");
  render();
}

function loadConfig() {
  const config = readJson(STORAGE_KEYS.config, {});
  const presetId = API_PRESETS[config.presetId] ? config.presetId : "siliconflow";
  customDraft.baseUrl = presetId === "custom" ? config.baseUrl || "" : config.customBaseUrl || "";
  customDraft.model = presetId === "custom" ? config.model || "" : config.customModel || "";
  Object.assign(providerApiKeys, config.apiKeys || {});
  if (config.apiKey && !providerApiKeys[presetId]) {
    providerApiKeys[presetId] = config.apiKey;
  }
  els.apiKeyInput.value = providerApiKeys[presetId] || "";
  applyPreset(presetId, false);
}

function getConfigFromInputs() {
  const activePreset = getActivePresetId();
  const baseUrl = els.baseUrlInput.value.trim();
  const activePresetConfig = API_PRESETS[activePreset] || API_PRESETS.custom;
  const model = activePreset === "custom" || activePresetConfig.editableModel
    ? (els.customModelInput.value.trim() || els.modelInput.value.trim())
    : els.modelInput.value.trim();

  return {
    presetId: activePreset,
    baseUrl,
    apiKey: els.apiKeyInput.value.trim(),
    apiKeys: { ...providerApiKeys, [activePreset]: els.apiKeyInput.value.trim() },
    model,
    customBaseUrl: activePreset === "custom" ? baseUrl : customDraft.baseUrl.trim(),
    customModel: activePreset === "custom" ? model : customDraft.model.trim(),
  };
}

function saveGame() {
  const save = {
    version: gameSaveVersion,
    runSeed: state.runSeed,
    player: state.player,
    floor: state.floor,
    encounterId: state.encounterId,
    enemies: state.enemies,
    selectedEnemyIds: state.selectedEnemyIds,
    activeEnemyIds: state.activeEnemyIds,
    gameClear: state.gameClear,
    bossReward: state.bossReward,
    photoValueMin: state.photoValueMin,
    photoValueMax: state.photoValueMax,
    globalFilmDropBonus: state.globalFilmDropBonus,
    filmShards: state.filmShards,
    filmRolls: state.filmRolls,
    battleClock: state.battleClock,
    battleReports: state.battleReports,
    battleReportSeq: state.battleReportSeq,
    currentBattle: state.currentBattle,
    infoMode: state.infoMode,
    battleSpecial: state.battleSpecial,
    inventory: state.inventory,
    selectedSlotIndex: state.selectedSlotIndex,
    pendingPhotoSlotIndex: state.pendingPhotoSlotIndex,
    selectedItemId: state.selectedItemId,
    latestItem: state.latestItem,
    log: state.log,
  };
  localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(save));
}

function loadSave() {
  const save = readJson(STORAGE_KEYS.save, null);
  if (!save) return;

  if (save.version !== gameSaveVersion) {
    localStorage.removeItem(STORAGE_KEYS.save);
    return;
  }

  state.player = normalizePlayer(save.player || state.player);
  state.runSeed = typeof save.runSeed === "string" && save.runSeed ? save.runSeed : makeRunSeed();
  state.inventory = normalizeInventorySlots(save.inventory);
  state.selectedSlotIndex = clampSlotIndex(save.selectedSlotIndex);
  state.pendingPhotoSlotIndex = clampSlotIndex(save.pendingPhotoSlotIndex ?? state.selectedSlotIndex);
  state.selectedItemId = state.inventory[state.selectedSlotIndex]?.id || "";
  state.latestItem = save.latestItem ? normalizeInventoryItem({ ...save.latestItem, skipSpecialRoll: true }) : state.inventory.find(Boolean) || null;
  state.log = Array.isArray(save.log) ? save.log : state.log;

  state.floor = clampInt(save.floor, 1, maxFloor);
  state.gameClear = Boolean(save.gameClear);
  state.bossReward = normalizeBossReward(save.bossReward);
  state.photoValueMin = clampInt(save.photoValueMin, defaultPhotoValueMin, 999);
  state.photoValueMax = Math.max(state.photoValueMin, clampInt(save.photoValueMax, defaultPhotoValueMax, 999));
  state.globalFilmDropBonus = clampInt(save.globalFilmDropBonus, 0, 999);
  state.enemies = Array.isArray(save.enemies) ? save.enemies.map(normalizeEnemy).filter(Boolean) : [];
  state.encounterId = typeof save.encounterId === "string" ? save.encounterId : "";
  if (!state.enemies.length && !state.gameClear) {
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
  }
  state.selectedEnemyIds = Array.isArray(save.selectedEnemyIds)
    ? save.selectedEnemyIds.filter((id) => typeof id === "string" && state.enemies.some((enemy) => enemy.id === id))
    : [];
  state.activeEnemyIds = Array.isArray(save.activeEnemyIds)
    ? save.activeEnemyIds.filter((id) => typeof id === "string" && state.enemies.some((enemy) => enemy.id === id))
    : [];
  state.filmShards = clampInt(save.filmShards, 0, 9);
  state.filmRolls = clampInt(save.filmRolls, 0, 999);
  state.battleReports = Array.isArray(save.battleReports) ? save.battleReports.map(normalizeBattleReport).filter(Boolean) : [];
  state.battleReportSeq = Number.isFinite(save.battleReportSeq) ? save.battleReportSeq : state.battleReports.length;
  state.currentBattle = normalizeCurrentBattle(save.currentBattle);
  state.infoMode = save.infoMode === "log" ? "log" : "item";
  state.battleClock = normalizeBattleClock(save.battleClock);
  state.battleSpecial = state.currentBattle ? normalizeBattleSpecial(save.battleSpecial) : createDefaultBattleSpecial();
  clearEnemyCardMotion();
}

function normalizePlayer(player) {
  const defaults = createDefaultPlayer();
  const normalized = {
    formId: heroFormMap.has(player.formId) ? player.formId : defaults.formId,
    baseHp: Number.isFinite(player.baseHp) ? player.baseHp : defaults.baseHp,
    hp: Number.isFinite(player.hp) ? player.hp : defaults.hp,
    baseAtk: Number.isFinite(player.baseAtk) ? player.baseAtk : defaults.baseAtk,
    baseDef: Number.isFinite(player.baseDef) ? player.baseDef : defaults.baseDef,
    baseSpeed: Number.isFinite(player.baseSpeed) ? player.baseSpeed : defaults.baseSpeed,
    baseRegen: Number.isFinite(player.baseRegen) ? player.baseRegen : defaults.baseRegen,
    baseShield: Number.isFinite(player.baseShield) ? player.baseShield : defaults.baseShield,
    baseLifesteal: Number.isFinite(player.baseLifesteal) ? player.baseLifesteal : defaults.baseLifesteal,
    shield: Number.isFinite(player.shield) ? player.shield : defaults.shield,
    shieldMonsterId: typeof player.shieldMonsterId === "string" ? player.shieldMonsterId : "",
  };
  normalized.hp = Math.max(0, Math.min(normalized.hp, getPlayerMaxHpFromRaw(normalized)));
  normalized.shield = Math.max(0, Math.min(normalized.shield, getPlayerShieldFromRaw(normalized)));
  return normalized;
}

function normalizeBossReward(reward) {
  if (!reward || typeof reward !== "object") return null;
  const floor = clampInt(reward.floor, 1, maxFloor);
  const options = Array.isArray(reward.options)
    ? reward.options
        .map((option, index) => normalizeBossRewardOption(option, floor, index))
        .filter(Boolean)
        .slice(0, 3)
    : [];
  return options.length ? { floor, options } : null;
}

function normalizeBossRewardOption(option, floor, index) {
  const validTypes = new Set(["filmDrop", "filmPercent", "valueMin", "valueMax"]);
  if (!option || typeof option !== "object" || !validTypes.has(option.type)) return null;
  const fallback = buildBossRewardOptions(floor).find((item) => item.type === option.type) || {};
  return {
    id: typeof option.id === "string" && option.id ? option.id : `${floor}-${index}-${option.type}`,
    type: option.type,
    title: cleanText(option.title, fallback.title || "奖励", 24),
    desc: cleanText(option.desc, fallback.desc || "选择后进入下一层。", 64),
  };
}

function normalizeBattleClock(clock) {
  if (!clock || typeof clock !== "object" || clock.encounterId !== state.encounterId || !state.currentBattle) return null;
  const activeIds = new Set(state.activeEnemyIds);
  const enemies = Array.isArray(clock.enemies)
    ? clock.enemies
        .filter((item) => typeof item?.id === "string" && activeIds.has(item.id))
        .map((item) => ({
          id: item.id,
          time: Number.isFinite(item.time) ? Math.max(0, item.time) : getActionInterval(state.enemies.find((enemy) => enemy.id === item.id)?.speed || 0),
        }))
    : [];
  const fallbackEnemies = getActiveBattleEnemies();
  return {
    hero: Number.isFinite(clock.hero) ? Math.max(0, clock.hero) : getActionInterval(getBattleStats(state.activeEnemyIds).speed),
    enemies: enemies.length ? enemies : fallbackEnemies.map((enemy) => ({ id: enemy.id, time: getActionInterval(enemy.speed) })),
    round: Number.isFinite(clock.round) ? Math.max(1, clock.round) : 1,
    encounterId: state.encounterId,
  };
}

function normalizeCurrentBattle(battle) {
  if (!battle || typeof battle !== "object") return null;
  const activeIds = Array.isArray(state.activeEnemyIds) ? state.activeEnemyIds : [];
  const names = activeIds
    .map((id) => state.enemies.find((enemy) => enemy.id === id)?.name)
    .filter(Boolean)
    .join("、");
  return {
    id: typeof battle.id === "string" ? battle.id : makeId("battle"),
    type: "battle",
    battleId: typeof battle.battleId === "string" ? battle.battleId : `${state.floor}:${activeIds.join("|")}`,
    floor: Number.isFinite(battle.floor) ? battle.floor : state.floor,
    monsterName: typeof battle.monsterName === "string" && battle.monsterName ? battle.monsterName : names || "敌人",
    startHp: Number.isFinite(battle.startHp) ? battle.startHp : state.player.hp,
    startShield: Number.isFinite(battle.startShield) ? battle.startShield : state.player.shield,
    damageEstimates: battle.damageEstimates && typeof battle.damageEstimates === "object" ? battle.damageEstimates : {},
    details: Array.isArray(battle.details) ? battle.details.filter((item) => typeof item === "string").slice(-90) : [],
    lootNames: Array.isArray(battle.lootNames) ? battle.lootNames.filter((item) => typeof item === "string") : [],
    defeatedIds: Array.isArray(battle.defeatedIds) ? battle.defeatedIds.filter((item) => typeof item === "string") : [],
    createdAt: Number.isFinite(battle.createdAt) ? battle.createdAt : Date.now(),
  };
}

function normalizeBattleReport(entry) {
  if (!entry || typeof entry !== "object") return null;
  const type = entry.type === "event" ? "event" : "battle";

  if (type === "event") {
    return {
      id: typeof entry.id === "string" ? entry.id : makeId("event"),
      type,
      eventType: typeof entry.eventType === "string" ? entry.eventType : "item",
      summary: typeof entry.summary === "string" ? entry.summary : "获得装备。",
      details: [],
      expanded: false,
      createdAt: Number.isFinite(entry.createdAt) ? entry.createdAt : Date.now(),
    };
  }

  return {
    id: typeof entry.id === "string" ? entry.id : makeId("battle"),
    type,
    battleId: typeof entry.battleId === "string" ? entry.battleId : "",
    floor: Number.isFinite(entry.floor) ? entry.floor : 1,
    monsterName: typeof entry.monsterName === "string" && entry.monsterName ? entry.monsterName : "敌人",
    startHp: Number.isFinite(entry.startHp) ? entry.startHp : state.player.hp,
    startShield: Number.isFinite(entry.startShield) ? entry.startShield : 0,
    lootNames: Array.isArray(entry.lootNames) ? entry.lootNames.filter((item) => typeof item === "string") : [],
    defeatedIds: Array.isArray(entry.defeatedIds) ? entry.defeatedIds.filter((item) => typeof item === "string") : [],
    result: typeof entry.result === "string" ? entry.result : "battle",
    hpDelta: Number.isFinite(entry.hpDelta) ? entry.hpDelta : 0,
    endHp: Number.isFinite(entry.endHp) ? entry.endHp : state.player.hp,
    endShield: Number.isFinite(entry.endShield) ? entry.endShield : state.player.shield,
    summary: typeof entry.summary === "string" ? entry.summary : makeBattleSummary(entry.result, entry, entry.hpDelta || 0),
    details: Array.isArray(entry.details) ? entry.details.filter((item) => typeof item === "string").slice(-60) : [],
    expanded: Boolean(entry.expanded),
    createdAt: Number.isFinite(entry.createdAt) ? entry.createdAt : Date.now(),
    finishedAt: Number.isFinite(entry.finishedAt) ? entry.finishedAt : Date.now(),
  };
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function byId(id) {
  return document.getElementById(id);
}

function percent(value, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

function clampInt(value, min, max) {
  const numeric = Number.parseInt(value, 10);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function makeId(idStem) {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  state.battleReportSeq += 1;
  return `${idStem}-${Date.now()}-${state.battleReportSeq}`;
}

function clampNumber(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, numeric));
}

function cleanText(value, fallback, maxLength) {
  const text = typeof value === "string" ? value.trim() : "";
  return (text || fallback).slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makePlaceholderImage() {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="12" fill="#f5ebd7"/>
      <circle cx="60" cy="48" r="22" fill="#245f9a"/>
      <path d="M28 92c10-24 54-24 64 0" fill="#bd3d36"/>
      <text x="60" y="109" text-anchor="middle" font-size="14" font-family="Arial" font-weight="700" fill="#17130f">PHOTO</text>
    </svg>
  `);
}

window.render_game_to_text = () => JSON.stringify(window.__photoHeroState || {});
window.advanceTime = () => render();
window.__photoHeroTestHooks = {
  compressImage,
  makeInventoryImage,
  loadImage,
  addTestItem(input) {
    const item = balanceItem(input || {}, input?.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-item") }, "测试装备已加入。");
  },
  addSpecialItem(effectKey, input = {}) {
    const effect = photoSpecialEffectMap.get(effectKey);
    const value = Math.max(effect?.value || 16, input.value || 16);
    const item = balanceItem({
      itemName: input.itemName || "测试特装",
      rarity: input.rarity || "rare",
      value,
      stats: input.stats || {},
      specialEffects: [effectKey],
      skipSpecialRoll: true,
      description: input.description || "测试用拍照特殊装备。",
      confidence: 1,
    }, input.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-special") }, "测试特殊装备已加入。");
  },
  addRawItem(input) {
    const item = {
      ...balanceItem({ ...(input || {}), skipSpecialRoll: input?.skipSpecialRoll ?? true }, input?.image || makePlaceholderImage()),
      stats: normalizeStats(input?.stats || {}, 999),
      id: makeId("test-item"),
    };
    addInventoryItem(item, "测试装备已加入。");
  },
  setPhoto(image) {
    state.lastPhoto = image || "";
    if (state.lastPhoto) state.infoMode = "item";
    render();
  },
  setHeroStats(next) {
    Object.assign(state.player, next || {});
    saveGame();
    render();
  },
  setRunRewards(next = {}) {
    if (Number.isFinite(next.photoValueMin)) state.photoValueMin = next.photoValueMin;
    if (Number.isFinite(next.photoValueMax)) state.photoValueMax = next.photoValueMax;
    if (Number.isFinite(next.globalFilmDropBonus)) state.globalFilmDropBonus = next.globalFilmDropBonus;
    if (Number.isFinite(next.filmRolls)) state.filmRolls = next.filmRolls;
    if (Number.isFinite(next.filmShards)) state.filmShards = next.filmShards;
    saveGame();
    render();
  },
  startBossRewardChoice,
  chooseBossReward,
  balanceItem,
  getPhotoValueRange() {
    return { min: getPhotoValueMin(), max: getPhotoValueMax() };
  },
  setHeroForm,
  selectEnemies(ids) {
    state.selectedEnemyIds = Array.isArray(ids) ? ids : [];
    saveGame();
    render();
  },
  setFloor(floor) {
    stopAutoBattle();
    stopBattleTimers();
    state.floor = clampInt(floor, 1, maxFloor);
    state.gameClear = false;
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = [];
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleClock = null;
    resetBattleSpecial();
    clearEnemyCardMotion();
    state.enemyFlipEncounterId = state.encounterId;
    applyFloorShield();
    saveGame();
    render();
  },
  setEnemies(enemies) {
    stopAutoBattle();
    stopBattleTimers();
    state.testEnemyOverride = Array.isArray(enemies) ? enemies : [];
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleClock = null;
    resetBattleSpecial();
    clearEnemyCardMotion();
    state.enemyFlipEncounterId = state.encounterId;
    applyFloorShield();
    saveGame();
    render();
  },
  getEnemyDamageEstimates,
  buildFloorEncounter,
  startAutoBattle,
  resolveBattleAction() {
    const finished = resolveBattleAction();
    saveGame();
    render();
    return finished;
  },
  getFirstInventoryId() {
    return state.inventory.find(Boolean)?.id || "";
  },
};
