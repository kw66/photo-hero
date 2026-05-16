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

const systemItemImageBase = "./assets/items/";

const systemItemImageMap = {
  西红柿: "tomato.webp",
  香蕉: "banana.webp",
  咖啡: "coffee.webp",
  矿泉水: "water.webp",
  锅盖: "pot-lid.webp",
  橡皮: "eraser.webp",
  雨伞: "umbrella.webp",
  镜子: "mirror.webp",
  键盘: "keyboard.webp",
  拖鞋: "slipper.webp",
  剪刀: "scissors.webp",
  指甲刀: "nail-clipper.webp",
  风扇: "fan.webp",
  滑板: "skateboard.webp",
  胶卷: "film-roll.webp",
  普通胶卷: "film-roll.webp",
  胶卷碎片: "film-roll.webp",
};

const rarityNames = {
  common: "普通",
  uncommon: "精良",
  rare: "稀有",
};

const equipmentPageSize = 9;
const equipmentSlotLimit = 10;
const mergeUpgradeCount = 10;
const battleReportLimit = 18;
const modelMaxTokens = 512;
const modelImageDetail = "low";
const analysisImageMaxEdge = 1024;
const analysisImageQuality = 0.78;
const inventoryImageMaxEdge = 420;
const inventoryImageQuality = 0.72;
const maxFloor = 40;
const gameSaveVersion = 5;
const initialFilmRolls = 1;
const bossFloors = new Set([10, 20, 30, 40]);
const rewardBossFloors = new Set([25, 35, 39]);
const testStats = [
  { key: "baseHp", label: "生命", step: 5, min: 5, max: 999 },
  { key: "baseAtk", label: "攻", step: 1, min: 1, max: 999 },
  { key: "baseDef", label: "防", step: 1, min: 0, max: 999 },
  { key: "baseSpeed", label: "速", step: 1, min: 1, max: 999 },
  { key: "baseRegen", label: "回", step: 1, min: 0, max: 999 },
  { key: "baseLifesteal", label: "吸", step: 1, min: 0, max: 999 },
  { key: "baseShield", label: "盾", step: 1, min: 0, max: 999 },
  { key: "filmShards", label: "碎", step: 1, min: 0, max: 9, target: "state" },
];

const statLabels = {
  hp: "生命",
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
  speed: 18,
  shield: 4,
  lifesteal: 12,
  regen: 12,
};

const photoSpecialEffects = [
  { key: "killAttack", label: "每击杀8怪攻击+1", value: 12, kind: "killThreshold", threshold: 8, stat: "attack", amount: 1 },
  { key: "killDefense", label: "每击杀8怪防御+1", value: 15, kind: "killThreshold", threshold: 8, stat: "defense", amount: 1 },
  { key: "killShield", label: "每击杀4怪护盾+1", value: 10, kind: "killThreshold", threshold: 4, stat: "shield", amount: 1 },
  { key: "killSpeed", label: "每击杀12怪速度+1", value: 16, kind: "killThreshold", threshold: 12, stat: "speed", amount: 1 },
  { key: "dealDamageAttack", label: "造成伤害临时攻击+1", value: 15, kind: "dealDamageTemp", stat: "attack", amount: 1, cap: 10 },
  { key: "takeDamageDefense", label: "受到伤害临时防御+1", value: 15, kind: "takeDamageTemp", stat: "defense", amount: 1, cap: 8 },
  { key: "killMaxHp", label: "每次击杀生命上限+2", value: 15, kind: "killPermanent", stat: "hp", amount: 2 },
  { key: "killHeal", label: "每次击杀生命+8", value: 15, kind: "killHeal", amount: 8 },
  { key: "doubleStrikeSpeedDown", label: "速度-5，二连击", value: 16, kind: "passive", stat: "speed", amount: -5, doubleStrike: true },
  { key: "shieldCrashAttackDown", label: "攻击-5，附带当前护盾*0.5伤害", value: 16, kind: "passive", stat: "attack", amount: -5, shieldDamageRatio: 0.5 },
];

const photoSpecialEffectMap = new Map(photoSpecialEffects.map((effect) => [effect.key, effect]));

const portableEquipmentPattern = /锤|锤子|榔头|工具|扳手|螺丝刀|钳|剪刀|刀|指甲刀|键盘|鼠标|笔|尺子|直尺|卷尺|书|本|杯|瓶|伞|雨伞|镜|锅盖|盒|包|鞋|拖鞋|滑板|风扇|橡皮|橡皮擦|胶带|刷|梳|钥匙|锁|球|砖|石|玩具|摆件|模型|饰品|衣服|帽|手机|耳机|充电器|遥控器|椅|凳|小桌|台灯|相机|眼镜/i;
const oversizedScenePattern = /汽车|车辆|公交|火车|飞机|船|房|楼|建筑|天空|风景|街道|道路|山|海|河|湖|树|大型家具|床|沙发|衣柜|冰箱|洗衣机|大面积背景/i;
const explicitOversizePattern = /比人.{0,8}(大|高)|比一个人.{0,8}(大|高)|尺寸.{0,8}(超过|大于|高于).{0,4}人|人.{0,4}(还要)?大|巨大|无法搬动|不能搬动|主要是.{0,6}(场景|背景)|大面积背景/i;

const statOrder = ["hp", "attack", "defense", "speed", "shield", "lifesteal", "regen"];

const heroForms = [
  { id: "hp", label: "生命", image: "form-hp.png", stats: { hp: 30 }, desc: "生命上限 +30" },
  { id: "attack", label: "攻击", image: "form-attack.png", stats: { attack: 2 }, desc: "攻击 +2" },
  { id: "lifesteal", label: "吸血", image: "form-lifesteal.png", stats: { lifesteal: 1 }, desc: "吸血 +1" },
  { id: "regen", label: "回复", image: "form-regen.png", stats: { regen: 1 }, desc: "回复 +1" },
  { id: "speed", label: "速度", image: "form-speed.png", stats: { speed: 1 }, desc: "速度 +1" },
  { id: "defense", label: "防御", image: "form-defense.png", stats: { defense: 2 }, desc: "防御 +2" },
  { id: "shield", label: "护盾", image: "form-shield.png", stats: { shield: 10 }, desc: "护盾 +10" },
];

const heroFormMap = new Map(heroForms.map((form) => [form.id, form]));
const defaultHeroFormId = heroForms[0].id;
const heroFormImageBase = "./assets/heroes/";

const monsterImages = {
  slime: "13.png",
  skeleton: "16.png",
  bat: "15.png",
  mage: "11.png",
  wizard: "21.png",
  guard: "12.png",
  knight: "037-03.png",
  golem: "14.png",
  patrol: "35.png",
  octopus: "47.png",
  dragon: "039-01.png",
  vampire: "44.png",
  demon: "53.png",
  orc: "17.png",
  swordsman: "42.png",
  warrior: "22.png",
  archmage: "54.png",
  skeletonCaptain: "55.png",
  knightCaptain: "32.png",
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

const monsterPools = [
  ["slime", "skeleton", "bat", "mage"],
  ["slime", "skeleton", "bat", "mage", "orc", "golem", "wizard"],
  ["slime", "skeleton", "bat", "mage", "orc", "golem", "wizard", "guard", "knight", "patrol"],
  ["slime", "skeleton", "bat", "mage", "orc", "golem", "wizard", "guard", "knight", "patrol", "swordsman", "warrior"],
  ["slime", "skeleton", "bat", "mage", "orc", "golem", "wizard", "guard", "knight", "patrol", "swordsman", "warrior"],
];

const normalMonsterUnlocks = [
  { floor: 1, key: "slime", weight: 12 },
  { floor: 2, key: "bat", weight: 5 },
  { floor: 3, key: "skeleton", weight: 5 },
  { floor: 4, key: "mage", weight: 4 },
  { floor: 6, key: "orc", weight: 4 },
  { floor: 8, key: "golem", weight: 3 },
  { floor: 11, key: "wizard", weight: 4 },
  { floor: 13, key: "guard", weight: 3 },
  { floor: 15, key: "knight", weight: 4 },
  { floor: 17, key: "patrol", weight: 3 },
  { floor: 21, key: "warrior", weight: 4 },
  { floor: 23, key: "swordsman", weight: 3 },
];

const lootTypes = [
  { name: "西红柿", stats: { hp: 15 } },
  { name: "香蕉", stats: { hp: 10 } },
  { name: "咖啡", stats: { regen: 2 } },
  { name: "矿泉水", stats: { regen: 1 } },
  { name: "锅盖", stats: { defense: 3 } },
  { name: "橡皮", stats: { defense: 2 } },
  { name: "雨伞", stats: { shield: 6 } },
  { name: "镜子", stats: { shield: 3 } },
  { name: "键盘", stats: { attack: 4 } },
  { name: "拖鞋", stats: { attack: 3 } },
  { name: "剪刀", stats: { lifesteal: 2 } },
  { name: "指甲刀", stats: { lifesteal: 1 } },
  { name: "风扇", stats: { speed: 2 } },
  { name: "滑板", stats: { speed: 1 } },
];

const bossRewards = {
  skeletonCaptain: { itemName: "普通胶卷", stats: { defense: 2 } },
  vampire: { itemName: "普通胶卷", stats: { lifesteal: 1 } },
  knightCaptain: { itemName: "普通胶卷", stats: { shield: 8 } },
  octopus: { itemName: "普通胶卷", stats: { hp: 25 } },
  dragon: { itemName: "普通胶卷", stats: { speed: 2 } },
  archmage: { itemName: "普通胶卷", stats: { attack: 3 } },
};

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
  enemyHint: byId("enemyHint"),
  enemyField: byId("enemyField"),
  attackBtn: byId("attackBtn"),
  fleeBtn: byId("fleeBtn"),
  resetGameBtn: byId("resetGameBtn"),
  photoBtn: byId("photoBtn"),
  pasteImageBtn: byId("pasteImageBtn"),
  analyzeBtn: byId("analyzeBtn"),
  fileInput: byId("fileInput"),
  cameraFrame: byId("cameraFrame"),
  photoPreview: byId("photoPreview"),
  photoStateBadge: byId("photoStateBadge"),
  apiStatusBadge: byId("apiStatusBadge"),
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
  debugStats: byId("debugStats"),
  recommendEquipBtn: byId("recommendEquipBtn"),
  equipmentGrid: byId("equipmentGrid"),
  equipPrevBtn: byId("equipPrevBtn"),
  equipNextBtn: byId("equipNextBtn"),
  equipPageText: byId("equipPageText"),
  equipmentDetail: byId("equipmentDetail"),
  equipmentDetailImage: byId("equipmentDetailImage"),
  equipmentDetailEmpty: byId("equipmentDetailEmpty"),
  equipmentDetailName: byId("equipmentDetailName"),
  equipmentDetailMeta: byId("equipmentDetailMeta"),
  equipmentDetailStats: byId("equipmentDetailStats"),
  equipmentDetailDesc: byId("equipmentDetailDesc"),
  useItemBtn: byId("useItemBtn"),
  loadingState: byId("loadingState"),
  battleLog: byId("battleLog"),
};

const state = {
  player: createDefaultPlayer(),
  floor: 1,
  encounterId: "",
  enemies: [],
  selectedEnemyIds: [],
  activeEnemyIds: [],
  battleClock: null,
  battleReports: [],
  battleReportSeq: 0,
  currentBattle: null,
  gameClear: false,
  inventory: [],
  equipmentPage: 0,
  selectedItemId: "",
  equippedItemIds: [],
  lastPhoto: "",
  latestItem: null,
  filmShards: 0,
  filmRolls: initialFilmRolls,
  lootError: "",
  log: ["上传图片或拍一件现实物品，把它变成第一件装备。"],
  autoBattleTimer: 0,
  battleSpecial: createDefaultBattleSpecial(),
  testEnemyOverride: null,
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

  els.photoBtn.addEventListener("click", () => {
    els.fileInput.value = "";
    els.fileInput.click();
  });
  els.pasteImageBtn.addEventListener("click", pasteImageFromClipboard);

  els.fileInput.addEventListener("change", async () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;
    await preparePhotoFromFile(file, "图片已准备好，可以鉴定。", "照片读取失败");
  });

  document.addEventListener("paste", handlePasteEvent);

  els.analyzeBtn.addEventListener("click", analyzePhoto);
  els.saveConfigBtn.addEventListener("click", saveConfig);
  els.testChatBtn.addEventListener("click", testVisionApi);
  els.toggleKeyBtn.addEventListener("click", toggleApiKeyVisibility);
  els.attackBtn.addEventListener("click", toggleAutoBattle);
  els.fleeBtn.addEventListener("click", fleeBattle);
  els.resetGameBtn.addEventListener("click", resetGame);
  els.recommendEquipBtn.addEventListener("click", recommendEquipment);
  els.useItemBtn.addEventListener("click", useSelectedConsumable);
  els.equipPrevBtn.addEventListener("click", () => changeEquipmentPage(-1));
  els.equipNextBtn.addEventListener("click", () => changeEquipmentPage(1));
  renderHeroForms();
  renderDebugControls();
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
  const target = ["config", "debug", "forms"].includes(panelId) ? panelId : "";
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
  setBusy("处理图片...");
  try {
    state.lastPhoto = await compressImage(file);
    els.photoPreview.src = state.lastPhoto;
    els.photoPreview.hidden = false;
    els.cameraFrame.classList.add("has-photo");
    state.lootError = "";
    renderCameraStatus();
    addLog(successMessage);
    showInputNotice(successMessage);
    render();
  } catch (error) {
    showInputNotice(`${errorPrefix}：${error.message || "无法处理该图片"}`);
  } finally {
    if (els.loadingState.dataset.notice !== "true") setBusy("");
    renderGameTextOnly();
  }
}

async function pasteImageFromClipboard() {
  if (document.hasFocus && !document.hasFocus()) {
    window.focus();
  }

  if (!navigator.clipboard?.read) {
    showInputNotice("当前浏览器不支持按钮读取剪贴板；请直接按 Ctrl+V 粘贴图片。");
    return;
  }

  try {
    setBusy("读取剪贴板...");
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageType = Array.from(item.types || []).find((type) => type.startsWith("image/") || type === "image/png");
      if (!imageType) continue;
      const blob = await item.getType(imageType);
      await preparePhotoFromFile(new File([blob], "clipboard-image.png", { type: imageType }), "已粘贴剪贴板图片，可以鉴定。", "粘贴图片失败");
      return;
    }
    showInputNotice("按钮没有读到图片；如果剪贴板里确实有图，请直接按 Ctrl+V 粘贴。");
  } catch (error) {
    showInputNotice(`按钮读取剪贴板失败：${error.message || "浏览器拒绝读取"}。请直接按 Ctrl+V 粘贴图片。`);
  } finally {
    if (els.loadingState.dataset.notice !== "true") setBusy("");
    renderGameTextOnly();
  }
}

async function handlePasteEvent(event) {
  const file = getImageFileFromDataTransfer(event.clipboardData);
  if (!file) return;
  event.preventDefault();
  await preparePhotoFromFile(file, "已粘贴图片，可以鉴定。", "粘贴图片失败");
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
  if (!state.lastPhoto) {
    addLog("还没有照片。");
    return;
  }

  if (getFilmCount() <= 0) {
    const message = "需要先获得胶卷：10 个碎片可合成 1 个，Boss 会掉落普通胶卷并直接提升属性。";
    showLootError(message);
    addLog(message);
    return;
  }

  const config = getConfigFromInputs();
  if (!config.baseUrl || !config.apiKey || !config.model) {
    addLog("先填写并保存 API 地址、Key 和模型名。");
    return;
  }

  if (!isLikelyVisionModel(config)) {
    const message =
      "当前模型看起来不支持图片输入；照片鉴定请换成支持 vision/image_url 的模型。";
    showLootError(message);
    addLog("图片鉴定需要视觉模型。");
    return;
  }

  saveConfig(false);
  setBusy("鉴定中...");
  els.analyzeBtn.disabled = true;

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
    els.analyzeBtn.disabled = false;
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
  render();
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
        content:
          "你是一个轻量网页 RPG 的装备鉴定器。你只能输出 JSON，不要输出 Markdown 或额外解释。第一字符必须是 {，最后一个字符必须是 }。严格按规则给低数值装备。",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "根据图片里的真实物品生成一件游戏装备。这里的装备不是只能穿在身上，只要现实中单人可搬动、可手持、可放进背包、或尺寸明显不超过人的物品，都必须视为可装备道具，包括锤子、工具、书本、杯子、玩具、小家具、桌面物品。只能返回 JSON，格式为 {\"itemName\":\"\",\"value\":0,\"tooLarge\":false,\"stats\":{\"hp\":0,\"attack\":0,\"defense\":0,\"speed\":0,\"shield\":0,\"lifesteal\":0,\"regen\":0},\"description\":\"\",\"confidence\":0.0}。规则：1) 只有明显比人尺寸更大或主要是场景/背景的东西，例如汽车、房子、天空、风景、建筑、道路、大型家具、大面积背景，才允许 tooLarge=true、value=0、所有属性为0；普通锤子、剪刀、键盘、锅盖、椅子、小桌子等不要判为 tooLarge。2) value 是 5 到 20 的整数，表示装备总价值；越像现实实拍、主体占比越大、越清晰、背景越干净、杂物越少、物品越有趣越动心，value 越高。不是越精美越高，也不是越普通或破旧越高。3) 属性价值换算：生命上限 hp 每点价值1，攻击 attack 每点价值5，防御 defense 每点价值6，速度 speed 每点价值18，护盾 shield 每点价值4，吸血 lifesteal 每点价值12，回复 regen 每点价值12。4) 属性总价值不得超过 value。5) 按物品特性分配主属性：食物/药品偏 hp 或 regen，工具/键盘/硬物偏 attack，容器/锅盖/保护类偏 defense 或 shield，鞋/滑板/风扇/轻便物偏 speed，尖锐小工具偏 lifesteal，水/咖啡/饮品偏 regen。可以有多个属性，但主属性必须符合物品特性。描述要短。",
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
  const source = raw?.equipment || raw?.item || raw?.result || raw;
  const safe = source && typeof source === "object" ? source : {};
  const stats = normalizeModelStats(safe.stats || safe.attributes || safe["属性"] || {});
  const itemName = safe.itemName || safe.name || safe.item || safe["物品名称"] || safe["装备名"] || safe["名称"];
  const value = safe.value ?? safe.score ?? safe.quality ?? safe["价值"] ?? safe["品质"];
  const tooLarge = safe.tooLarge ?? safe.too_large ?? safe.oversized ?? safe["过大"] ?? safe["无法装备"];
  const description = safe.description || safe.desc || safe["描述"];
  const cleanName = cleanText(itemName, "照片装备", 18);
  const rejected = parseBooleanLike(tooLarge);
  const correctedTooLarge = shouldTreatAsTooLarge(cleanName, description, rejected);
  return {
    itemName: cleanName,
    value: correctedTooLarge ? 0 : clampInt(value, 5, 20),
    tooLarge: correctedTooLarge,
    stats,
    description: cleanText(description, "由照片鉴定出的装备。", 56),
    confidence: clampNumber(safe.confidence ?? safe["置信度"], 0, 1),
  };
}

function shouldTreatAsTooLarge(itemName, description = "", modelRejected = false) {
  const text = `${itemName || ""} ${description || ""}`;
  if (oversizedScenePattern.test(text) || explicitOversizePattern.test(text)) return true;
  if (isPortableEquipmentText(text)) return false;
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
    description: cleanText(`模型未按 JSON 返回，已按文字描述保守鉴定：${source}`, "由照片鉴定出的装备。", 56),
    confidence: 0.45,
  };
}

function looksLikeVisionFailure(text) {
  return /(?:无法|不能|看不到|未能|没有能力).{0,12}(?:图片|图像|照片)|(?:不支持|无法处理).{0,12}(?:图片|图像|image)|(?:作为|身为).{0,8}AI.{0,12}(?:无法|不能)/i.test(text);
}

function looksTooLargeFromText(text) {
  const source = String(text || "");
  if (isPortableEquipmentText(source)) return false;
  return /(?:tooLarge\s*=\s*true|too_large\s*=\s*true|风景|天空|建筑|汽车|车辆|房子|街道|道路|大型家具|大面积背景|比人.{0,8}(?:大|高)|尺寸.{0,8}(?:超过|大于|高于).{0,4}人|主要是.{0,6}(?:场景|背景))/i.test(source);
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
  if (fullItem.tooLarge || fullItem.consumable) {
    fullItem.consumable = true;
    fullItem.healAmount = fullItem.healAmount
      ? clampInt(fullItem.healAmount, 5, 10)
      : 5 + hashIndex(`${fullItem.id}:${fullItem.itemName}:${fullItem.description}`, 6);
  }
  state.lastPhoto = "";
  const rewardText = fullItem.tooLarge
    ? `${message} 获得补给：${fullItem.itemName}，可使用回复 ${fullItem.healAmount} 点生命。`
    : `${message} 获得 ${fullItem.itemName}。`;
  addInventoryItem(fullItem, rewardText, !fullItem.tooLarge && scoreItem(fullItem) > 0);
}

function addInventoryItem(item, message, autoEquip = false) {
  ensureConsumableHeal(item);
  state.latestItem = item;
  state.lootError = "";
  addInventoryItemDirect(item);
  const mergeMessages = mergeUpgradeableItems();
  sortInventoryByValue();
  if (state.inventory.some((entry) => entry.id === item.id)) {
    state.selectedItemId = item.id;
  } else if (!state.inventory.some((entry) => entry.id === state.selectedItemId)) {
    state.selectedItemId = state.inventory[0]?.id || "";
  }
  if (autoEquip) {
    if (!equipItem(item.id) && state.selectedItemId) equipItem(state.selectedItemId);
  }
  state.equipmentPage = 0;
  addLog(message);
  for (const mergeMessage of mergeMessages) addLog(mergeMessage);
  addBattleEvent(message, "item");
  for (const mergeMessage of mergeMessages) addBattleEvent(mergeMessage, "item");
  saveGame();
  render();
}

function addInventoryItemDirect(item) {
  state.inventory.unshift(item);
}

function ensureConsumableHeal(item) {
  if (!isConsumableItem(item)) return item;
  item.consumable = true;
  item.healAmount = item.healAmount
    ? clampInt(item.healAmount, 5, 10)
    : 5 + hashIndex(`${item.id || ""}:${item.itemName || ""}:${item.description || ""}`, 6);
  return item;
}

function mergeUpgradeableItems() {
  const messages = [];
  let merged = true;

  while (merged) {
    merged = false;
    const groups = new Map();
    for (const item of state.inventory) {
      if (!isUpgradeableTowerItem(item)) continue;
      const key = getUpgradeableItemKey(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }

    for (const group of groups.values()) {
      if (group.length < mergeUpgradeCount) continue;
      const consumed = group.slice(0, mergeUpgradeCount);
      const template = consumed[0];
      const nextItem = createUpgradedTowerItem(template);
      const consumedIds = new Set(consumed.map((item) => item.id));
      state.inventory = state.inventory.filter((item) => !consumedIds.has(item.id));
      state.equippedItemIds = state.equippedItemIds.filter((id) => !consumedIds.has(id));
      addInventoryItemDirect(nextItem);
      state.selectedItemId = nextItem.id;
      state.latestItem = nextItem;
      equipItem(nextItem.id);
      messages.push(`${formatItemDisplayName(template)} * ${mergeUpgradeCount} 合成为 ${formatItemDisplayName(nextItem)}。`);
      merged = true;
      break;
    }
  }

  return messages;
}

function isUpgradeableTowerItem(item) {
  return Boolean(item?.fixed && item.source === "tower" && !item.film && !isConsumableItem(item));
}

function getUpgradeableItemKey(item) {
  return `${item.itemName}::${getItemLevel(item)}`;
}

function getItemLevel(item) {
  return clampInt(item?.level, 0, 12);
}

function getItemBaseStats(item) {
  const baseStats = item?.baseStats && calculateStatsValue(item.baseStats) > 0
    ? item.baseStats
    : item?.stats || {};
  return normalizeStats(baseStats, 999);
}

function getLevelMultiplier(level) {
  return 2 ** Math.max(0, getItemLevel({ level }));
}

function applyItemLevelStats(baseStats, level) {
  const multiplier = getLevelMultiplier(level);
  const normalized = normalizeStats(baseStats, 999);
  const result = normalizeStats({}, 999);
  for (const key of statOrder) {
    result[key] = normalized[key] * multiplier;
  }
  return result;
}

function createUpgradedTowerItem(template) {
  const nextLevel = getItemLevel(template) + 1;
  const baseStats = getItemBaseStats(template);
  return {
    ...balanceItem({
      itemName: template.itemName,
      rarity: template.rarity || "common",
      stats: applyItemLevelStats(baseStats, nextLevel),
      description: `塔中怪物装备 +${nextLevel}，由 10 件 +${nextLevel - 1} 合成，效果翻倍。`,
      confidence: 1,
      film: false,
      fixed: true,
      source: "tower",
      level: nextLevel,
      baseStats,
    }, makeSystemItemImage(template.itemName)),
    id: makeId("item"),
  };
}

function formatItemDisplayName(item) {
  const level = getItemLevel(item);
  return `${item?.itemName || "装备"}${level > 0 ? `+${level}` : ""}`;
}

function toggleAutoBattle() {
  if (state.autoBattleTimer || state.gameClear || isPlayerDefeated()) return;
  startAutoBattle();
}

function startAutoBattle() {
  if (isPlayerDefeated()) return;

  ensureEncounter();
  if (isBossFloor(state.floor)) {
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
  }
  const selectedEnemies = getSelectedEnemies();
  if (!selectedEnemies.length) return;

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
}

function stopAutoBattle() {
  if (!state.autoBattleTimer) return;
  window.clearInterval(state.autoBattleTimer);
  state.autoBattleTimer = 0;
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
    removeEnemiesByIds(state.activeEnemyIds, false);
    finishCurrentBattle("enemy-fled");
    stopAutoBattle();
    handleBattleEndAdvance();
    return true;
  }

  const enemyClock = getNextEnemyClock();
  const heroTime = state.battleClock.hero;
  if (!enemyClock || heroTime <= enemyClock.time + Number.EPSILON) {
    const defeated = resolveHeroStrike(stats, round);
    state.battleClock.hero += 1 / Math.max(1, stats.speed);
    if (defeated) {
      state.battleClock.round = 1;
    } else {
      state.battleClock.round += 1;
    }
  } else {
    const enemy = state.enemies.find((item) => item.id === enemyClock.id);
    if (enemy) resolveMonsterStrike(enemy, stats, round);
    enemyClock.time += 1 / Math.max(1, enemy?.speed || 1);
    state.battleClock.round += 1;
  }

  if (state.player.hp <= 0) {
    addBattleDetail("照片勇者倒下了。");
    finishCurrentBattle("defeat");
    stopAutoBattle();
    return true;
  }

  if (!getActiveBattleEnemies().length) {
    finishCurrentBattle("victory");
    stopAutoBattle();
    handleBattleEndAdvance();
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
    const damage = hasTrait(enemy, "magic") ? enemy.atk : Math.max(0, enemy.atk - currentStatsBeforeHit.def);
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
  triggerKillSpecial(enemy);
  for (const drop of drops) {
    if (drop.kind === "shard") {
      addFilmShards(drop.amount);
      continue;
    }
    if (drop.kind === "bossReward") {
      applyBossReward(drop);
      continue;
    }
    drop.id = drop.id || makeId("item");
    addInventoryItemDirect(drop);
    state.selectedItemId = drop.id;
    equipItem(drop.id);
    state.latestItem = drop;
  }
  mergeUpgradeableItems();
  sortInventoryByValue();
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
    const amount = drop.kind === "shard" ? drop.amount || 1 : drop.amount || 1;
    for (let i = 0; i < amount; i += 1) {
      state.currentBattle.lootNames.push(drop.itemName);
    }
    if (drop.kind === "bossReward") {
      const statText = formatStatsText(drop.stats);
      if (statText) state.currentBattle.lootNames.push(statText);
    }
  }
}

function finishCurrentBattle(result) {
  if (!state.currentBattle) return;
  const battle = state.currentBattle;
  const hpDelta = state.player.hp - battle.startHp;
  const report = {
    ...battle,
    result,
    hpDelta,
    endHp: state.player.hp,
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
    const stats = getPlayerStats();
    const endHp = Number.isFinite(battle?.endHp) ? battle.endHp : state.player.hp;
    const hpPercent = stats.maxHp ? endHp / stats.maxHp : 1;
    const label = hpPercent <= 0.2
      ? "险胜"
      : hpDelta >= 0
        ? "完胜"
        : Math.abs(hpDelta) <= Math.max(3, Math.ceil(stats.maxHp * 0.15))
          ? "小胜"
          : "胜";
    const remainText = label === "险胜" ? `，剩余生命 ${endHp}/${stats.maxHp}` : "";
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
  return [...counts.entries()]
    .map(([name, count]) => count > 1 ? `${name}*${count}` : name)
    .join("、");
}

function formatStatsText(stats) {
  const normalized = normalizeStats(stats || {}, 999);
  return statOrder
    .filter((key) => normalized[key])
    .map((key) => `${statLabels[key] || key}+${normalized[key]}`)
    .join(" ");
}

function formatHpDelta(delta) {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function fleeBattle() {
  if (isPlayerDefeated()) return;
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
  advanceFloor();
  saveGame();
  render();
}

function makeBattleClock(stats, enemies) {
  return {
    hero: 1 / Math.max(1, stats.speed),
    enemies: enemies.map((enemy) => ({
      id: enemy.id,
      time: 1 / Math.max(1, enemy.speed),
    })),
    round: 1,
    encounterId: state.encounterId,
  };
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

function handleBattleEndAdvance() {
  advanceFloor();
}

function advanceFloor() {
  stopAutoBattle();
  if (isPlayerDefeated()) return;
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
  applyFloorShield();
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
      dropKey: enemy.dropKey || "西红柿",
      dropName: enemy.dropName || enemy.dropKey || "西红柿",
      name: enemy.name || `${enemy.dropName || "西红柿"}${enemy.typeName || "史莱姆"}`,
      maxHp: Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1,
      hp: Number.isFinite(enemy.hp) ? enemy.hp : Number.isFinite(enemy.maxHp) ? enemy.maxHp : 1,
      atk: Number.isFinite(enemy.atk) ? enemy.atk : 1,
      def: Number.isFinite(enemy.def) ? enemy.def : 0,
      speed: Number.isFinite(enemy.speed) ? enemy.speed : 1,
      maxShield: Number.isFinite(enemy.maxShield) ? enemy.maxShield : Number.isFinite(enemy.shield) ? enemy.shield : 0,
      shield: Number.isFinite(enemy.shield) ? enemy.shield : 0,
      prefixStats: enemy.prefixStats || {},
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
  if (floor === 39) return ["archmage"];
  if (floor === 40) return ["demon"];
  const pool = buildWeightedMonsterPool(floor);
  return [0, 1, 2].map((slot) => pool[hashIndex(`${floor}:monster:${slot}`, pool.length)]);
}

function buildWeightedMonsterPool(floor) {
  const entries = normalMonsterUnlocks.filter((entry) => floor >= entry.floor);
  const weighted = [];
  for (const entry of entries) {
    const age = Math.max(0, floor - entry.floor);
    const decay = Math.max(1, entry.weight - Math.floor(age / 10));
    for (let i = 0; i < decay; i += 1) weighted.push(entry.key);
  }
  return weighted.length ? weighted : ["slime"];
}

function makeEnemy(typeKey, floor, slot) {
  const type = monsterTypes[typeKey] || monsterTypes.slime;
  const object = lootTypes[hashIndex(`${floor}:object:${slot}`, lootTypes.length)];
  const prefixStats = normalizeStats(object.stats || {});
  const shield = getTraitValueFromList(type.traits, "shield", 0) || 0;
  const traits = mergePrefixTraits(cloneTraits(type.traits), prefixStats);
  const maxHp = Math.max(1, type.hp + (prefixStats.hp || 0));
  return {
    id: `${floor}-${slot}-${object.name}-${type.name}`,
    floor,
    slot,
    typeKey,
    typeName: type.name,
    dropKey: object.name,
    dropName: object.name,
    name: `${object.name}${type.name}`,
    maxHp,
    hp: maxHp,
    atk: Math.max(0, type.atk + (prefixStats.attack || 0)),
    def: Math.max(0, type.def + (prefixStats.defense || 0)),
    speed: Math.max(1, type.speed + (prefixStats.speed || 0)),
    maxShield: Math.max(0, shield + (prefixStats.shield || 0)),
    shield: Math.max(0, shield + (prefixStats.shield || 0)),
    prefixStats,
    traits,
  };
}

function normalizeEnemy(enemy) {
  if (!enemy || typeof enemy !== "object") return null;
  if (enemy.testEnemy) {
    const maxHp = Number.isFinite(enemy.maxHp) ? Math.max(1, enemy.maxHp) : Number.isFinite(enemy.hp) ? Math.max(1, enemy.hp) : 1;
    const maxShield = Number.isFinite(enemy.maxShield) ? Math.max(0, enemy.maxShield) : Number.isFinite(enemy.shield) ? Math.max(0, enemy.shield) : 0;
    return {
      ...enemy,
      id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
      name: typeof enemy.name === "string" && enemy.name ? enemy.name : `${enemy.dropName || "西红柿"}${enemy.typeName || "史莱姆"}`,
      typeKey: enemy.typeKey || "slime",
      typeName: enemy.typeName || "史莱姆",
      dropName: enemy.dropName || enemy.dropKey || "西红柿",
      dropKey: enemy.dropKey || enemy.dropName || "西红柿",
      maxHp,
      hp: Number.isFinite(enemy.hp) ? Math.max(0, Math.min(enemy.hp, maxHp)) : maxHp,
      atk: Number.isFinite(enemy.atk) ? Math.max(0, enemy.atk) : 1,
      def: Number.isFinite(enemy.def) ? Math.max(0, enemy.def) : 0,
      speed: Number.isFinite(enemy.speed) ? Math.max(1, enemy.speed) : 1,
      maxShield,
      shield: Number.isFinite(enemy.shield) ? Math.max(0, Math.min(enemy.shield, maxShield)) : maxShield,
      prefixStats: normalizeStats(enemy.prefixStats || {}, 999),
      traits: Array.isArray(enemy.traits) ? cloneTraits(enemy.traits) : [],
    };
  }
  const previousMaxHp = Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1;
  const previousMaxShield = Number.isFinite(enemy.maxShield) ? enemy.maxShield : Number.isFinite(enemy.shield) ? enemy.shield : 0;
  const typeName = typeof enemy.typeName === "string" ? enemy.typeName : "怪物";
  const dropName = typeof enemy.dropName === "string" ? enemy.dropName : enemy.objectName || enemy.objectKey || "物品";
  const dropKey = typeof enemy.dropKey === "string" ? enemy.dropKey : enemy.objectKey || enemy.objectName || dropName || "西红柿";
  const type = monsterTypes[enemy.typeKey];
  const object = lootTypes.find((item) => item.name === dropKey || item.name === dropName);
  const prefixStats = normalizeStats(object?.stats || enemy.prefixStats || {});
  const baseShield = type ? getTraitValueFromList(type.traits, "shield", 0) || 0 : 0;
  const maxHp = type ? Math.max(1, type.hp + (prefixStats.hp || 0)) : Number.isFinite(enemy.maxHp) ? enemy.maxHp : Number.isFinite(enemy.hp) ? enemy.hp : 1;
  const maxShield = type
    ? Math.max(0, baseShield + (prefixStats.shield || 0))
    : Number.isFinite(enemy.maxShield)
      ? enemy.maxShield
      : Number.isFinite(enemy.shield)
        ? enemy.shield
        : 0;
  const traits = type ? mergePrefixTraits(cloneTraits(type.traits), prefixStats) : Array.isArray(enemy.traits) ? enemy.traits : [];
  return {
    ...enemy,
    id: typeof enemy.id === "string" ? enemy.id : makeId("enemy"),
    name: typeof enemy.name === "string" && enemy.name ? enemy.name : `${dropName}${typeName}`,
    typeName,
    dropName,
    dropKey,
    maxHp,
    hp: Number.isFinite(enemy.hp)
      ? Math.max(0, Math.min(enemy.hp >= previousMaxHp ? maxHp : enemy.hp, maxHp))
      : maxHp,
    atk: type ? Math.max(0, type.atk + (prefixStats.attack || 0)) : Number.isFinite(enemy.atk) ? enemy.atk : 1,
    def: type ? Math.max(0, type.def + (prefixStats.defense || 0)) : Number.isFinite(enemy.def) ? enemy.def : 0,
    speed: type ? Math.max(1, type.speed + (prefixStats.speed || 0)) : Number.isFinite(enemy.speed) ? Math.max(1, enemy.speed) : 1,
    maxShield,
    shield: Number.isFinite(enemy.shield)
      ? Math.max(0, Math.min(enemy.shield >= previousMaxShield ? maxShield : enemy.shield, maxShield))
      : maxShield,
    prefixStats,
    traits,
  };
}

function createItemFromObject(objectName) {
  const object = lootTypes.find((item) => item.name === objectName) || lootTypes[lootTypes.length - 1];
  return balanceItem({
    itemName: object.name,
    rarity: "common",
    stats: object.stats || {},
    description: object.film ? "无属性。可作为后续拍照玩法的胶卷。" : "塔中怪物固定装备，同名装备可以重复拥有。",
    confidence: 1,
    film: Boolean(object.film),
    fixed: true,
    source: "tower",
    level: 0,
    skipSpecialRoll: true,
    baseStats: object.stats || {},
  }, makeSystemItemImage(object.name));
}

function getEnemyDrops(enemy) {
  const drops = [createItemFromObject(enemy.dropKey), {
    kind: "shard",
    itemName: "胶卷碎片",
    amount: 1,
  }];
  const bossReward = createBossReward(enemy);
  if (bossReward) drops.push(bossReward);
  return drops;
}

function createBossReward(enemy) {
  const config = bossRewards[enemy.typeKey];
  if (!config) return null;
  return {
    kind: "bossReward",
    itemName: config.itemName,
    amount: 1,
    stats: normalizeStats(config.stats || {}, 999),
  };
}

function applyBossReward(drop) {
  state.filmRolls += drop.amount || 1;
  const stats = normalizeStats(drop.stats || {}, 999);
  const beforeStats = getPlayerStats();
  state.player.baseHp += stats.hp || 0;
  state.player.baseAtk += stats.attack || 0;
  state.player.baseDef += stats.defense || 0;
  state.player.baseSpeed += stats.speed || 0;
  state.player.baseShield += stats.shield || 0;
  state.player.baseLifesteal += stats.lifesteal || 0;
  state.player.baseRegen += stats.regen || 0;
  const afterStats = getPlayerStats();
  if (afterStats.maxHp > beforeStats.maxHp) {
    state.player.hp += afterStats.maxHp - beforeStats.maxHp;
  }
}

function addFilmShards(amount) {
  state.filmShards += amount;
  const made = Math.floor(state.filmShards / 10);
  if (made > 0) {
    state.filmRolls += made;
    state.filmShards %= 10;
  }
}

function getFilmCount() {
  return state.filmRolls;
}

function consumeFilm() {
  if (state.filmRolls <= 0) return false;
  state.filmRolls -= 1;
  return true;
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
    stats.speed = Math.max(1, stats.speed - value);
  }
  if (activeEnemies.some((enemy) => hasTrait(enemy, "heroAttackDown"))) {
    const value = Math.max(...activeEnemies.map((enemy) => getTraitValue(enemy, "heroAttackDown", 0)));
    stats.atk = Math.max(0, stats.atk - value);
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
    stats.speed = Math.max(1, stats.speed - value);
  }
  if (enemies.some((enemy) => hasTrait(enemy, "heroAttackDown"))) {
    const value = Math.max(...enemies.map((enemy) => getTraitValue(enemy, "heroAttackDown", 0)));
    stats.atk = Math.max(0, stats.atk - value);
  }
  applyBattleSpecialPassives(stats);
  return stats;
}

function applyBattleSpecialPassives(stats) {
  stats.speed = Math.max(1, stats.speed);
  stats.atk = Math.max(0, stats.atk);
  return stats;
}

function simulateSelectedBattle() {
  const enemies = getSelectedEnemies()
    .filter((enemy) => enemy.hp > 0)
    .map(cloneEnemyForSimulation);
  if (!enemies.length || isPlayerDefeated()) {
    return { result: "none", hpDelta: 0, endHp: state.player.hp, rounds: 0, defeatedCount: 0 };
  }

  const stats = getBattleStatsForEnemiesWithSpecial(enemies, createDefaultBattleSpecial());
  const sim = {
    hp: state.player.hp,
    shield: stats.shield,
    battleSpecial: createDefaultBattleSpecial(),
    maxHpBonus: 0,
    activeIds: enemies.map((enemy) => enemy.id),
    heroTime: 1 / Math.max(1, stats.speed),
    enemyTimes: new Map(enemies.map((enemy) => [enemy.id, 1 / Math.max(1, enemy.speed)])),
    round: 1,
    rounds: 0,
    defeatedCount: 0,
  };
  const startHp = sim.hp;

  while (sim.hp > 0 && sim.activeIds.length) {
    if (sim.round >= 50) {
      return {
        result: "timeout",
        hpDelta: sim.hp - startHp,
        endHp: sim.hp,
        rounds: sim.rounds,
        defeatedCount: sim.defeatedCount,
      };
    }

    const currentStats = getBattleStatsForEnemiesWithSpecial(getSimActiveEnemies(sim, enemies), sim.battleSpecial);
    currentStats.maxHp += sim.maxHpBonus || 0;
    const nextEnemyId = getNextSimEnemyId(sim);
    const enemyTime = nextEnemyId ? sim.enemyTimes.get(nextEnemyId) : Infinity;

    if (!nextEnemyId || sim.heroTime <= enemyTime + Number.EPSILON) {
      const defeated = simulateHeroStrike(sim, enemies, currentStats);
      sim.heroTime += 1 / Math.max(1, currentStats.speed);
      sim.round = defeated ? 1 : sim.round + 1;
    } else {
      const enemy = enemies.find((item) => item.id === nextEnemyId);
      if (enemy) simulateMonsterStrike(sim, enemy, enemies, currentStats);
      sim.enemyTimes.set(nextEnemyId, enemyTime + 1 / Math.max(1, enemy?.speed || 1));
      sim.round += 1;
    }
    sim.rounds += 1;
  }

  return {
    result: sim.hp <= 0 ? "death" : "win",
    hpDelta: sim.hp - startHp,
    endHp: sim.hp,
    rounds: sim.rounds,
    defeatedCount: sim.defeatedCount,
  };
}

function cloneEnemyForSimulation(enemy) {
  return {
    ...enemy,
    traits: cloneTraits(enemy.traits || []),
    prefixStats: { ...(enemy.prefixStats || {}) },
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
  let defeatedAny = false;

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
      defeatedAny = true;
    }
  }

  return defeatedAny;
}

function simulateMonsterStrike(sim, enemy, enemies, stats) {
  const hitCount = getTraitValue(enemy, "multiHit", 1);
  for (let i = 0; i < hitCount; i += 1) {
    const damage = hasTrait(enemy, "magic") ? enemy.atk : Math.max(0, enemy.atk - stats.def);
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
  let heal = 0;
  for (const item of getEquippedItems()) {
    for (const { effect } of getItemSpecialInstances(item)) {
      if (effect.key === "killMaxHp") maxHpGain += effect.amount;
      if (effect.key === "killHeal") heal += effect.amount;
    }
  }
  if (maxHpGain > 0) stats.maxHp += maxHpGain;
  sim.maxHpBonus = (sim.maxHpBonus || 0) + maxHpGain;
  if (heal > 0) sim.hp = Math.min(stats.maxHp, sim.hp + heal);
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

function mergePrefixTraits(traits, stats) {
  const merged = [...traits];
  if (stats.regen) upsertNumericTrait(merged, "regen", stats.regen, `回复${stats.regen}`);
  if (stats.lifesteal) upsertNumericTrait(merged, "lifesteal", stats.lifesteal, `吸血${stats.lifesteal}`);
  return merged;
}

function upsertNumericTrait(traits, type, delta, text) {
  const existing = traits.find((trait) => trait.type === type);
  if (existing) {
    const nextValue = Math.max(0, (Number.isFinite(existing.value) ? existing.value : 0) + delta);
    existing.value = nextValue;
    existing.text = `${type === "regen" ? "回复" : "吸血"}${nextValue}`;
    return;
  }
  traits.push({ type, value: delta, text });
}

function isBossFloor(floor) {
  return bossFloors.has(floor);
}

function isRewardBossFloor(floor) {
  return rewardBossFloors.has(floor);
}

function isPlayerDefeated() {
  return state.player.hp <= 0;
}

function makeEncounterId() {
  return `${state.floor}:${state.enemies.map((enemy) => enemy.id).join("|")}`;
}

function applyFloorShield() {
  const stats = getPlayerStats();
  if (state.player.shieldMonsterId === state.encounterId) return;
  state.player.shield = stats.shield;
  state.player.shieldMonsterId = state.encounterId;
}

function createDefaultPlayer() {
  return {
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
}

function resetGame() {
  stopAutoBattle();
  localStorage.removeItem(STORAGE_KEYS.save);
  state.player = createDefaultPlayer();
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
  state.inventory = [];
  state.equipmentPage = 0;
  state.selectedItemId = "";
  state.equippedItemIds = [];
  state.lastPhoto = "";
  state.latestItem = null;
  state.filmShards = 0;
  state.filmRolls = initialFilmRolls;
  state.lootError = "";
  state.log = ["已重开。"];
  resetBattleSpecial();
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

  const passiveAttackPenalty = equippedItems.some((item) => getItemSpecialKeys(item).includes("shieldCrashAttackDown")) ? 5 : 0;
  const passiveSpeedPenalty = equippedItems.some((item) => getItemSpecialKeys(item).includes("doubleStrikeSpeedDown")) ? 5 : 0;

  return {
    maxHp: state.player.baseHp + (bonus.hp || 0),
    atk: Math.max(0, state.player.baseAtk + (bonus.attack || 0) + (battleSpecial?.attack || 0) - passiveAttackPenalty),
    def: Math.max(0, state.player.baseDef + (bonus.defense || 0) + (battleSpecial?.defense || 0)),
    speed: Math.max(1, state.player.baseSpeed + (bonus.speed || 0) - passiveSpeedPenalty),
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
  const oldStats = getPlayerStats();
  state.player.formId = formId;
  const newStats = getPlayerStats();
  if (newStats.maxHp > oldStats.maxHp) {
    state.player.hp += newStats.maxHp - oldStats.maxHp;
  } else {
    state.player.hp = Math.min(state.player.hp, newStats.maxHp);
  }
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
        changes.push(`${formatItemDisplayName(item)} ${statLabels[effect.stat] || effect.stat}+${effect.amount}`);
      } else if (effect.kind === "killHeal") {
        data.kills += 1;
        const stats = getBattleStats(state.activeEnemyIds);
        const beforeHp = state.player.hp;
        state.player.hp = Math.min(stats.maxHp, state.player.hp + effect.amount);
        const healed = state.player.hp - beforeHp;
        if (healed > 0) changes.push(`${formatItemDisplayName(item)} 回复${healed}`);
      }
      ensureItemSpecialState(item, key);
    }
  }

  if (changes.length) {
    addBattleDetail(`击杀触发：${changes.join("，")}。`);
  }
}

function getEquippedItems() {
  const inventoryIds = new Set(state.inventory.map((item) => item.id));
  const seenIds = new Set();
  const seenFixedKeys = new Set();
  const nextIds = [];
  const items = [];

  for (const id of state.equippedItemIds) {
    if (seenIds.has(id) || !inventoryIds.has(id) || nextIds.length >= equipmentSlotLimit) continue;
    const item = state.inventory.find((entry) => entry.id === id);
    if (!item || isConsumableItem(item)) continue;
    if (item.fixed) {
      const fixedKey = getFixedEquipKey(item);
      if (seenFixedKeys.has(fixedKey)) continue;
      seenFixedKeys.add(fixedKey);
    }
    seenIds.add(id);
    nextIds.push(id);
    items.push(item);
  }

  state.equippedItemIds = nextIds;
  return items;
}

function equipItem(itemId) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item || isConsumableItem(item)) return false;
  if (state.equippedItemIds.includes(itemId)) return true;
  if (state.equippedItemIds.length >= equipmentSlotLimit) return false;
  if (item.fixed && getEquippedItems().some((entry) => entry.fixed && getFixedEquipKey(entry) === getFixedEquipKey(item) && entry.id !== item.id)) {
    return false;
  }
  state.equippedItemIds.push(itemId);
  return true;
}

function getFixedEquipKey(item) {
  return `${item?.itemName || ""}::${getItemLevel(item)}`;
}

function toggleEquipItem(itemId) {
  if (isEquipmentLocked()) return false;
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item) return false;
  const index = state.equippedItemIds.indexOf(itemId);
  state.selectedItemId = itemId;
  if (isConsumableItem(item)) return true;
  if (index >= 0) {
    state.equippedItemIds.splice(index, 1);
    return true;
  }
  return equipItem(itemId);
}

function isConsumableItem(item) {
  return Boolean(item?.consumable || item?.tooLarge);
}

function isEquipmentLocked() {
  return Boolean(state.autoBattleTimer) || Boolean(state.currentBattle);
}

function recommendEquipment() {
  if (isEquipmentLocked()) return false;

  const selected = [];
  const fixedKeys = new Set();
  const candidates = state.inventory
    .filter((item) => !isConsumableItem(item) && scoreItem(item) > 0)
    .map((item, index) => ({ item, index }))
    .sort((a, b) => scoreItem(b.item) - scoreItem(a.item) || Number(a.item.fixed) - Number(b.item.fixed) || a.index - b.index);

  for (const { item } of candidates) {
    if (selected.length >= equipmentSlotLimit) break;
    if (item.fixed) {
      const fixedKey = getFixedEquipKey(item);
      if (fixedKeys.has(fixedKey)) continue;
      fixedKeys.add(fixedKey);
    }
    selected.push(item.id);
  }

  state.equippedItemIds = selected;
  getEquippedItems();
  state.selectedItemId = state.equippedItemIds[0] || state.inventory[0]?.id || "";
  addLog(selected.length ? `已推荐装备 ${selected.length} 件。` : "没有可推荐装备。");
  saveGame();
  render();
  return true;
}

function useSelectedConsumable() {
  if (isEquipmentLocked()) return false;
  const index = state.inventory.findIndex((item) => item.id === state.selectedItemId);
  const item = state.inventory[index];
  if (index < 0 || !isConsumableItem(item)) return false;

  const stats = getPlayerStats();
  if (state.player.hp >= stats.maxHp) {
    addLog("生命已满，暂时不用补给。");
    render();
    return false;
  }

  const healAmount = clampInt(item.healAmount, 5, 10);
  const beforeHp = state.player.hp;
  state.player.hp = Math.min(stats.maxHp, state.player.hp + healAmount);
  const healed = state.player.hp - beforeHp;
  const [usedItem] = state.inventory.splice(index, 1);
  state.equippedItemIds = state.equippedItemIds.filter((id) => id !== usedItem.id);
  state.selectedItemId = state.inventory[Math.min(index, state.inventory.length - 1)]?.id || "";
  state.latestItem = state.inventory[0] || null;
  addBattleEvent(`使用 ${usedItem.itemName}，回复 ${healed} 点生命。`, "item");
  addLog(`使用 ${usedItem.itemName}，回复 ${healed} 点生命。`);
  saveGame();
  render();
  return true;
}

function balanceItem(item, image = "") {
  const safe = item && typeof item === "object" ? item : {};
  const rarity = ["common", "uncommon", "rare"].includes(safe.rarity) ? safe.rarity : "common";
  const isFixed = Boolean(safe.fixed);
  const itemName = cleanText(safe.itemName, "照片装备", 18);
  const tooLarge = isFixed ? false : shouldTreatAsTooLarge(itemName, safe.description, Boolean(safe.tooLarge));
  const consumable = Boolean(safe.consumable || tooLarge) && tooLarge;
  const requestedValue = isFixed || tooLarge ? 0 : clampInt(safe.value, 5, 20);
  const specialEffects = isFixed || tooLarge || consumable
    ? []
    : choosePhotoSpecialEffects(safe, image, requestedValue)
      .filter((key) => (photoSpecialEffectMap.get(key)?.value || Infinity) <= requestedValue);
  const specialValue = calculateSpecialEffectsValue(specialEffects);
  const statBudget = Math.max(0, requestedValue - specialValue);
  const targetValue = isFixed
    ? calculateStatsValue(safe.stats || {})
    : tooLarge
      ? 0
      : Math.max(requestedValue, specialValue);
  const stats = isFixed
    ? normalizeStats(safe.stats || {}, 99)
    : tooLarge
      ? normalizeStats({}, 20)
      : clampStatsToValue(allocateStatsForItem(safe.stats || {}, itemName, statBudget), statBudget);

  return {
    itemName,
    rarity,
    value: targetValue,
    stats,
    specialEffects,
    specialState: normalizeSpecialState(safe.specialState, specialEffects),
    description: tooLarge ? "物品过大或不是可装备物，无法提供属性。" : cleanText(safe.description, "由照片鉴定出的装备。", 56),
    confidence: clampNumber(safe.confidence, 0, 1),
    film: Boolean(safe.film),
    fixed: isFixed,
    source: typeof safe.source === "string" ? safe.source : "",
    level: isFixed ? getItemLevel(safe) : 0,
    baseStats: isFixed ? getItemBaseStats(safe) : normalizeStats({}, 999),
    skipSpecialRoll: Boolean(safe.skipSpecialRoll),
    tooLarge,
    consumable,
    healAmount: consumable && Number.isFinite(Number.parseInt(safe.healAmount, 10))
      ? clampInt(safe.healAmount, 5, 10)
      : 0,
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
  const withHeal = ensureConsumableHeal(normalized);
  if (withHeal.fixed && !withHeal.source) withHeal.source = "tower";
  if (isSystemItemImageName(withHeal.itemName) && (withHeal.fixed || withHeal.source === "tower" || withHeal.film)) {
    withHeal.image = makeSystemItemImage(withHeal.itemName);
  }
  return withHeal;
}

function scoreItem(item) {
  if (!item) return 0;
  return calculateStatsValue(item.stats || {}) + calculateSpecialEffectsValue(getItemSpecialKeys(item));
}

function sortInventoryByValue() {
  state.inventory = state.inventory
    .map((item, index) => ({ item, index }))
    .sort((a, b) => scoreItem(b.item) - scoreItem(a.item) || getItemLevel(b.item) - getItemLevel(a.item) || a.index - b.index)
    .map(({ item }) => item);
  if (state.selectedItemId && !state.inventory.some((item) => item.id === state.selectedItemId)) {
    state.selectedItemId = state.inventory[0]?.id || "";
  }
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
  const roll = hashIndex(`${seed}:special-roll`, 100);
  if (roll >= 32) return [];

  const eligible = photoSpecialEffects.filter((effect) => effect.value <= valueBudget);
  if (!eligible.length) return [];
  const picked = eligible[hashIndex(`${seed}:special-pick`, eligible.length)];
  return picked ? [picked.key] : [];
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
    if (/击杀.*生命|击杀.*回复|击杀.*回血/.test(text)) return "killHeal";
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
  if (/咖啡|水|饮|药|汤|茶|奶|果汁/.test(text)) return ["regen", "hp", "shield"];
  if (/番茄|西红柿|香蕉|饭|面|糖|饼|肉|菜|水果|食/.test(text)) return ["hp", "regen", "shield"];
  if (/刀|剪|针|钉|锥|刃|指甲刀/.test(text)) return ["lifesteal", "attack", "speed"];
  if (/键盘|锤|棍|笔|工具|扳手|砖|石/.test(text)) return ["attack", "defense", "hp"];
  if (/锅盖|镜|盾|伞|盔|盒|包|壳/.test(text)) return ["shield", "defense", "hp"];
  if (/鞋|拖鞋|滑板|风扇|轮|轻|羽/.test(text)) return ["speed", "attack", "hp"];
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
  const stats = getPlayerStats();
  const defeated = isPlayerDefeated();

  state.player.hp = Math.min(state.player.hp, stats.maxHp);
  const form = getHeroForm();
  els.heroAvatarImage.src = getHeroFormImageUrl(form);
  els.heroAvatarImage.alt = `照片勇者${form.label}形态`;
  renderHeroForms();

  els.playerHpText.textContent = `${state.player.hp} / ${stats.maxHp}`;
  els.playerHpBar.style.width = `${percent(state.player.hp, stats.maxHp)}%`;
  els.playerHpBar.parentElement.classList.toggle("is-low", percent(state.player.hp, stats.maxHp) <= 30);
  els.playerAtk.textContent = stats.atk;
  els.playerDef.textContent = stats.def;
  els.playerSpeed.textContent = stats.speed;
  els.playerRegen.textContent = stats.regen;
  els.playerLifesteal.textContent = stats.lifesteal;
  els.playerShield.textContent = `${state.player.shield} / ${stats.shield}`;

  els.floorText.textContent = state.gameClear
    ? "已通关"
    : `第 ${state.floor} / ${maxFloor} 层${isBossFloor(state.floor) ? " · Boss" : isRewardBossFloor(state.floor) ? " · 奖励Boss" : ""}`;
  renderEnemyHint();
  renderEnemyField();
  els.attackBtn.disabled = defeated || Boolean(state.autoBattleTimer) || state.gameClear || !getSelectedEnemies().length;
  els.attackBtn.setAttribute("aria-pressed", String(Boolean(state.autoBattleTimer)));
  els.fleeBtn.disabled = defeated || state.gameClear || isBossFloor(state.floor);

  renderApiStatus();
  renderCameraStatus();
  els.recommendEquipBtn.disabled = defeated || isEquipmentLocked() || !state.inventory.some((item) => !isConsumableItem(item) && scoreItem(item) > 0);
  renderEquipmentGrid();
  renderEquipmentDetail();
  renderLog();
  renderGameTextOnly();
}

function renderApiStatus() {
  const config = getConfigFromInputs();
  const missing = getMissingConfigFields(config);
  const activePreset = API_PRESETS[config.presetId] || API_PRESETS.custom;

  if (missing.length) {
    els.apiStatusBadge.textContent = "API 未配置";
    els.apiStatusBadge.dataset.state = "missing";
    return;
  }

  if (activePreset.supportsVision === false || !isLikelyVisionModel(config)) {
    els.apiStatusBadge.textContent = "仅文本测试";
    els.apiStatusBadge.dataset.state = "text-only";
    return;
  }

  els.apiStatusBadge.textContent = "API 已配置";
  els.apiStatusBadge.dataset.state = "ready";
}

function renderCameraStatus() {
  const filmText = `胶卷 ${getFilmCount()} · 碎片 ${state.filmShards}/10`;
  els.photoStateBadge.textContent = filmText;
  els.analyzeBtn.disabled = !state.lastPhoto || getFilmCount() <= 0;
}

function renderEnemyHint() {
  if (!els.enemyHint) return;
  const upcomingText = getUpcomingFloorHint();
  if (state.gameClear) {
    els.enemyHint.textContent = "已通关。";
    return;
  }
  if (isPlayerDefeated()) {
    els.enemyHint.textContent = "照片勇者已倒下，只能重开。";
    return;
  }
  if (state.currentBattle || state.autoBattleTimer) {
    els.enemyHint.textContent = "战斗中不可更换对手或装备。";
    return;
  }
  const count = state.selectedEnemyIds.length;
  if (isBossFloor(state.floor)) {
    els.enemyHint.textContent = `${formatSelectionEstimate(simulateSelectedBattle())} · Boss 层自动挑战全部敌人，不能逃跑。${upcomingText ? ` ${upcomingText}` : ""}`;
    return;
  }
  if (!count) {
    els.enemyHint.textContent = `点击敌人选择本层对手；数字表示勇者攻击顺序。选多个奖励更多，但所有被选敌人都会一起进攻。${upcomingText ? ` ${upcomingText}` : ""}`;
    return;
  }
  els.enemyHint.textContent = `${formatSelectionEstimate(simulateSelectedBattle())} · 再次点击可取消；逃跑会直接进入下一层。${upcomingText ? ` ${upcomingText}` : ""}`;
}

function formatSelectionEstimate(estimate) {
  const count = state.selectedEnemyIds.length;
  if (!count) return "";
  const rewardText = formatSelectionRewards();
  if (!estimate || estimate.result === "none") return `已选择 ${count} 个 · ${rewardText}`;
  const statusMap = {
    win: "预计可胜",
    death: "预计会倒下",
    timeout: "敌方可能逃跑",
  };
  const status = statusMap[estimate.result] || "结果未知";
  const hpText = estimate.hpDelta > 0 ? `生命 +${estimate.hpDelta}` : `生命 ${estimate.hpDelta}`;
  return `已选择 ${count} 个 · ${rewardText} · ${hpText} · ${status}`;
}

function formatSelectionRewards() {
  const enemies = getSelectedEnemies().filter((enemy) => enemy.hp > 0);
  if (!enemies.length) return "奖励无";
  const names = [];
  const shardCount = enemies.length;
  for (const enemy of enemies) {
    names.push(enemy.dropName || "装备");
    const reward = createBossReward(enemy);
    if (reward) {
      names.push("普通胶卷");
      const statText = formatStatsText(reward.stats);
      if (statText) names.push(statText);
    }
  }
  names.push(shardCount > 1 ? `胶卷碎片*${shardCount}` : "胶卷碎片");
  return `奖励 ${formatLootNames(names)}`;
}

function getUpcomingFloorHint() {
  const current = state.floor;
  const targets = [
    { floor: 10, label: "Boss", name: "骷髅队长" },
    { floor: 20, label: "Boss", name: "吸血鬼" },
    { floor: 25, label: "奖励Boss", name: "章鱼", optional: true },
    { floor: 30, label: "Boss", name: "骑士队长" },
    { floor: 35, label: "奖励Boss", name: "魔龙", optional: true },
    { floor: 39, label: "奖励Boss", name: "大法师", optional: true },
    { floor: 40, label: "最终Boss", name: "魔王" },
  ];
  const next = targets.find((item) => item.floor >= current);
  if (!next) return "";
  if (next.floor === current) {
    return next.optional ? `本层奖励Boss：${next.name}，可跳过。` : `本层${next.label}：${next.name}。`;
  }
  return `预告：${next.floor}层 ${next.label} ${next.name}${next.optional ? "，可跳过" : ""}。`;
}

function renderEnemyField() {
  els.enemyField.innerHTML = "";

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
    const isLocked = Boolean(state.autoBattleTimer) || Boolean(state.currentBattle) || isBossFloor(state.floor) || isDefeated;
    const selectionOrder = getEnemySelectionOrder(enemy.id);
    const isSelected = selectionOrder > 0;
    const button = document.createElement("button");
    button.className = `enemy-card enemy-select-card${isSelected ? " is-selected" : ""}${state.activeEnemyIds?.includes(enemy.id) ? " is-active" : ""}${isLocked ? " is-locked" : ""}${isDefeated ? " is-defeated" : ""}`;
    button.type = "button";
    button.setAttribute("aria-disabled", String(isLocked));
    button.addEventListener("click", () => {
      if (isLocked) return;
      toggleEnemySelection(enemy.id);
      saveGame();
      render();
    });

    const traitText = enemy.traits?.map((trait) => trait.text).filter(Boolean).join(" / ") || "无特性";
    const prefixText = getPrefixEffectText(enemy);
    const imageUrl = getMonsterImageUrl(enemy.typeKey);
    button.innerHTML = `
      ${selectionOrder ? `<span class="selection-badge">${selectionOrder}</span>` : ""}
      <div class="enemy-card-head">
        <div class="monster-portrait">
          <img src="${imageUrl}" alt="${escapeHtml(enemy.typeName)}">
        </div>
        <div class="enemy-name-block">
          <strong>${escapeHtml(enemy.name)}</strong>
          <span>${escapeHtml(enemy.dropName)} · ${escapeHtml(prefixText)}</span>
          <span>${escapeHtml(traitText)}</span>
        </div>
      </div>
      <div class="enemy-hp-line">
        <span>${enemy.hp} / ${enemy.maxHp}</span>
        <div class="hp-track danger"><span style="width:${percent(enemy.hp, enemy.maxHp)}%"></span></div>
      </div>
      <dl class="enemy-card-stats">
        <div><dt>攻</dt><dd>${enemy.atk}</dd></div>
        <div><dt>防</dt><dd>${enemy.def}</dd></div>
        <div><dt>速</dt><dd>${enemy.speed}</dd></div>
        <div><dt>盾</dt><dd>${enemy.shield || 0}</dd></div>
      </dl>
    `;
    els.enemyField.append(button);
  });
}

function getMonsterImageUrl(typeKey) {
  return `./figure/${monsterImages[typeKey] || monsterImages.slime}`;
}

function getPrefixEffectText(enemy) {
  const stats = Object.entries(enemy.prefixStats || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${statLabels[key] || key}+${value}`);
  return stats.length ? stats.join(" ") : "无属性";
}

function renderEquipmentGrid() {
  getEquippedItems();
  sortInventoryByValue();
  const locked = isEquipmentLocked();
  const totalPages = Math.max(1, Math.ceil(state.inventory.length / equipmentPageSize));
  state.equipmentPage = Math.min(Math.max(0, state.equipmentPage), totalPages - 1);
  const start = state.equipmentPage * equipmentPageSize;
  const pageItems = state.inventory.slice(start, start + equipmentPageSize);

  els.equipmentGrid.innerHTML = "";
  for (let i = 0; i < equipmentPageSize; i += 1) {
    const item = pageItems[i];
    const isEquipped = item ? state.equippedItemIds.includes(item.id) : false;
    const button = document.createElement("button");
    button.className = `equipment-slot${item ? " has-item" : ""}${isEquipped ? " is-equipped" : ""}${item?.id === state.selectedItemId ? " is-selected" : ""}${locked && item ? " is-locked" : ""}${isConsumableItem(item) ? " is-consumable" : ""}`;
    button.type = "button";
    button.disabled = !item;
    button.setAttribute("aria-label", item ? `查看${item.itemName}` : "空装备格");

    if (item) {
      button.innerHTML = `
        <img src="${item.image || makePlaceholderImage()}" alt="">
        ${isConsumableItem(item) ? `<b class="supply-badge">补</b>` : ""}
        ${getItemSpecialKeys(item).length ? `<b class="special-badge">特</b>` : ""}
        <span>${escapeHtml(formatItemDisplayName(item))}</span>
      `;
      button.addEventListener("click", () => {
        if (locked) {
          state.selectedItemId = item.id;
          saveGame();
          render();
          return;
        }
        toggleEquipItem(item.id);
        saveGame();
        render();
      });
    } else {
      button.innerHTML = `<span class="empty-slot">+</span>`;
    }

    els.equipmentGrid.append(button);
  }

  els.equipPrevBtn.disabled = state.equipmentPage <= 0;
  els.equipNextBtn.disabled = state.equipmentPage >= totalPages - 1;
  els.equipPageText.textContent = `${getEquippedItems().length}/${equipmentSlotLimit} · ${state.inventory.length ? state.equipmentPage + 1 : 0} / ${state.inventory.length ? totalPages : 0}`;
}

function renderEquipmentDetail() {
  els.useItemBtn.hidden = true;
  els.useItemBtn.disabled = true;

  if (state.lootError) {
    els.equipmentDetail.classList.add("is-error");
    els.cameraFrame.classList.remove("has-photo");
    els.photoPreview.hidden = true;
    els.equipmentDetailImage.removeAttribute("src");
    els.equipmentDetailImage.hidden = true;
    els.equipmentDetailEmpty.hidden = false;
    els.equipmentDetailEmpty.textContent = "鉴定失败";
    els.equipmentDetailName.textContent = "鉴定失败";
    els.equipmentDetailMeta.textContent = state.lootError;
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailDesc.textContent = getLootErrorHint(state.lootError);
    return;
  }

  els.equipmentDetail.classList.remove("is-error");
  if (state.lastPhoto) {
    els.cameraFrame.classList.add("has-photo");
    els.photoPreview.src = state.lastPhoto;
    els.photoPreview.hidden = false;
    els.equipmentDetailImage.removeAttribute("src");
    els.equipmentDetailImage.hidden = true;
    els.equipmentDetailEmpty.hidden = true;
    els.equipmentDetailEmpty.textContent = "";
    els.equipmentDetailName.textContent = "待鉴定照片";
    els.equipmentDetailMeta.textContent = `胶卷 ${getFilmCount()} · 碎片 ${state.filmShards}/10`;
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailDesc.textContent = "点击鉴定后会生成装备并进入装备库。";
    return;
  }

  const selected = state.inventory.find((item) => item.id === state.selectedItemId) || state.inventory[0];
  if (!selected) {
    els.cameraFrame.classList.remove("has-photo");
    els.photoPreview.hidden = true;
    els.equipmentDetailImage.removeAttribute("src");
    els.equipmentDetailImage.hidden = true;
    els.equipmentDetailEmpty.hidden = false;
    els.equipmentDetailEmpty.textContent = "";
    els.equipmentDetailName.textContent = "未选择装备";
    els.equipmentDetailMeta.textContent = "战胜怪物会掉落物品。";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailDesc.textContent = "点击背包格装备，再点一次卸下；最多装备 10 件。";
    return;
  }

  els.cameraFrame.classList.remove("has-photo");
  els.photoPreview.hidden = true;
  els.equipmentDetailImage.src = selected.image || makePlaceholderImage();
  els.equipmentDetailImage.hidden = false;
  els.equipmentDetailEmpty.hidden = true;
  els.equipmentDetailName.textContent = formatItemDisplayName(selected);
  const alreadyHasSameFixed = selected.fixed
    && !state.equippedItemIds.includes(selected.id)
    && getEquippedItems().some((item) => item.fixed && getFixedEquipKey(item) === getFixedEquipKey(selected));
  const equippedText = isConsumableItem(selected)
    ? `补给 · 回复 ${clampInt(selected.healAmount, 5, 10)}`
    : state.equippedItemIds.includes(selected.id)
      ? "已装备"
      : alreadyHasSameFixed
        ? "同名同级已装备"
        : "未装备";
  els.equipmentDetailMeta.textContent = `${rarityNames[selected.rarity]} · ${equippedText} · 价值 ${scoreItem(selected)} · 第 ${state.inventory.findIndex((item) => item.id === selected.id) + 1} 件`;
  els.equipmentDetailStats.innerHTML = isConsumableItem(selected)
    ? `<span>使用回复 ${clampInt(selected.healAmount, 5, 10)}</span>`
    : renderItemDetailPills(selected);
  els.equipmentDetailDesc.textContent = selected.description;

  if (isConsumableItem(selected)) {
    const stats = getPlayerStats();
    els.useItemBtn.hidden = false;
    els.useItemBtn.disabled = isEquipmentLocked() || state.player.hp >= stats.maxHp;
    els.useItemBtn.textContent = state.player.hp >= stats.maxHp ? "生命已满" : `使用 · 回复 ${clampInt(selected.healAmount, 5, 10)}`;
  }
}

function renderHeroForms() {
  els.formGrid.innerHTML = "";
  const currentForm = getHeroForm();
  document.querySelectorAll("[data-form-label]").forEach((node) => {
    node.textContent = `形态 · ${currentForm.label}`;
  });

  for (const form of heroForms) {
    const button = document.createElement("button");
    button.className = "form-card";
    button.type = "button";
    button.dataset.formId = form.id;
    button.setAttribute("aria-pressed", String(form.id === currentForm.id));
    if (form.id === currentForm.id) button.classList.add("is-active");

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
    .map(([key, label]) => `<span>${label} +${stats[key] || 0}</span>`);
  return pills.length ? pills.join("") : "<span>无属性</span>";
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

function changeEquipmentPage(delta) {
  const totalPages = Math.max(1, Math.ceil(state.inventory.length / equipmentPageSize));
  state.equipmentPage = Math.min(Math.max(0, state.equipmentPage + delta), totalPages - 1);
  saveGame();
  render();
}

function renderDebugControls() {
  els.debugStats.innerHTML = "";

  for (const stat of testStats) {
    const row = document.createElement("div");
    row.className = "debug-stat";
    const label = document.createElement("span");
    label.textContent = stat.label;
    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "-";
    minus.setAttribute("aria-label", `${stat.label}减少`);
    const value = document.createElement("strong");
    value.dataset.debugValue = stat.key;
    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `${stat.label}增加`);

    minus.addEventListener("click", () => adjustTestStat(stat, -stat.step));
    plus.addEventListener("click", () => adjustTestStat(stat, stat.step));

    row.append(label, minus, value, plus);
    els.debugStats.append(row);
  }

  updateDebugValues();
}

function updateDebugValues() {
  for (const stat of testStats) {
    const value = els.debugStats.querySelector(`[data-debug-value="${stat.key}"]`);
    if (value) value.textContent = getDebugStatValue(stat);
  }
}

function adjustTestStat(stat, delta) {
  if (stat.key === "filmShards") {
    adjustTestFilmShards(delta);
    return;
  }

  const nextValue = Math.max(stat.min, Math.min(stat.max, state.player[stat.key] + delta));
  if (nextValue === state.player[stat.key]) return;
  const oldStats = getPlayerStats();
  state.player[stat.key] = nextValue;
  const newStats = getPlayerStats();
  state.player.hp = Math.min(newStats.maxHp, state.player.hp + Math.max(0, newStats.maxHp - oldStats.maxHp));

  if (stat.key === "baseShield") {
    state.player.shieldMonsterId = "";
    applyFloorShield();
  }

  addLog(`${stat.label} 调整为 ${nextValue}。`);
  updateDebugValues();
  saveGame();
  render();
}

function getDebugStatValue(stat) {
  if (stat.target === "state") return state[stat.key];
  return state.player[stat.key];
}

function adjustTestFilmShards(delta) {
  if (delta > 0) {
    addFilmShards(delta);
  } else if (delta < 0) {
    state.filmShards = Math.max(0, state.filmShards + delta);
  }
  updateDebugValues();
  saveGame();
  render();
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
      renderBattleEntry(entry, "战", false);
    } else if (entry.type === "event") {
      renderBattleEntry(entry, "装", false);
    } else {
      renderBattleEntry(entry, getReportMarkText(entry), true);
    }
  }
}

function renderBattleEntry(entry, markText, canToggle) {
  const isBattle = entry.type !== "event";
  const markClass = entry.type === "event" ? "item" : getReportMarkClass(entry);
  const li = createBattleListItem({
    mark: markText,
    markClass,
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

  els.battleLog.append(li);

  if ((entry.expanded || entry.type === "current") && isBattle) {
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
  const markEl = document.createElement("span");
  markEl.className = `log-mark ${markClass}`.trim();
  markEl.textContent = mark;
  const textEl = document.createElement("span");
  textEl.textContent = text;
  li.append(markEl, textEl);
  return li;
}

function toggleBattleReport(id) {
  const report = state.battleReports.find((entry) => entry.id === id);
  if (!report || report.type === "event") return;
  report.expanded = !report.expanded;
  saveGame();
  render();
}

function getReportMarkClass(entry) {
  if (entry.result === "victory") return "hero";
  if (entry.result === "enemy-fled") return "info";
  return "";
}

function getReportMarkText(entry) {
  if (entry.result === "victory") return "胜";
  if (entry.result === "enemy-fled") return "逃";
  if (entry.result === "hero-fled") return "退";
  if (entry.result === "defeat") return "败";
  return "战";
}

function renderGameTextOnly() {
  const equippedItems = getEquippedItems();
  const selectedEquipment = state.inventory.find((item) => item.id === state.selectedItemId);
  window.__photoHeroState = {
    player: {
      hp: state.player.hp,
      shield: state.player.shield,
      form: {
        id: getHeroForm().id,
        label: getHeroForm().label,
        stats: getHeroFormStats(),
      },
      stats: getPlayerStats(),
      equipmentCount: state.inventory.length,
      equippedCount: equippedItems.length,
      filmRolls: state.filmRolls,
      filmShards: state.filmShards,
      filmCount: getFilmCount(),
      selectedEstimate: simulateSelectedBattle(),
      battleSpecial: { ...(state.battleSpecial || {}) },
      selectedEquipment: selectedEquipment ? formatItemDisplayName(selectedEquipment) : null,
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
      image: getMonsterImageUrl(enemy.typeKey),
      typeName: enemy.typeName,
      dropName: enemy.dropName,
      prefixEffect: getPrefixEffectText(enemy),
      prefixStats: enemy.prefixStats || {},
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      shield: enemy.shield,
      atk: enemy.atk,
      def: enemy.def,
      speed: enemy.speed,
      traits: enemy.traits?.map((trait) => trait.text || trait.type) || [],
      selected: state.selectedEnemyIds.includes(enemy.id),
      selectionOrder: getEnemySelectionOrder(enemy.id),
      active: state.activeEnemyIds.includes(enemy.id),
    })),
    selectedEnemyIds: [...state.selectedEnemyIds],
    selectedEnemyCount: state.selectedEnemyIds.length,
    activeEnemyIds: [...state.activeEnemyIds],
    hasPhoto: Boolean(state.lastPhoto),
    latestItem: state.latestItem,
    inventory: state.inventory.slice(0, 12).map((item) => ({
      name: formatItemDisplayName(item),
      score: scoreItem(item),
      stats: item.stats || {},
      effects: getItemSpecialKeys(item),
      specialState: item.specialState || {},
      equipped: state.equippedItemIds.includes(item.id),
      consumable: isConsumableItem(item),
    })),
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
    player: state.player,
    floor: state.floor,
    encounterId: state.encounterId,
    enemies: state.enemies,
    selectedEnemyIds: state.selectedEnemyIds,
    activeEnemyIds: state.activeEnemyIds,
    gameClear: state.gameClear,
    filmShards: state.filmShards,
    filmRolls: state.filmRolls,
    battleClock: state.battleClock,
    battleReports: state.battleReports,
    battleReportSeq: state.battleReportSeq,
    currentBattle: state.currentBattle,
    battleSpecial: state.battleSpecial,
    inventory: state.inventory,
    equipmentPage: state.equipmentPage,
    selectedItemId: state.selectedItemId,
    equippedItemIds: state.equippedItemIds,
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
  state.inventory = Array.isArray(save.inventory) ? save.inventory.map(normalizeInventoryItem) : [];
  mergeUpgradeableItems();
  sortInventoryByValue();
  state.equipmentPage = Number.isFinite(save.equipmentPage) ? save.equipmentPage : 0;
  state.selectedItemId = save.selectedItemId || state.inventory[0]?.id || "";
  state.equippedItemIds = Array.isArray(save.equippedItemIds)
    ? save.equippedItemIds.filter((id) => typeof id === "string" && state.inventory.some((item) => item.id === id)).slice(0, equipmentSlotLimit)
    : save.selectedItemId && state.inventory.some((item) => item.id === save.selectedItemId)
      ? [save.selectedItemId]
      : [];
  state.latestItem = save.latestItem ? normalizeInventoryItem({ ...save.latestItem, skipSpecialRoll: true }) : state.inventory[0] || null;
  state.log = Array.isArray(save.log) ? save.log : state.log;

  state.floor = clampInt(save.floor, 1, maxFloor);
  state.gameClear = Boolean(save.gameClear);
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
  state.battleClock = normalizeBattleClock(save.battleClock);
  state.battleSpecial = state.currentBattle ? normalizeBattleSpecial(save.battleSpecial) : createDefaultBattleSpecial();
}

function normalizePlayer(player) {
  const defaults = createDefaultPlayer();
  return {
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
}

function normalizeBattleClock(clock) {
  if (!clock || typeof clock !== "object" || clock.encounterId !== state.encounterId || !state.currentBattle) return null;
  const activeIds = new Set(state.activeEnemyIds);
  const enemies = Array.isArray(clock.enemies)
    ? clock.enemies
        .filter((item) => typeof item?.id === "string" && activeIds.has(item.id))
        .map((item) => ({
          id: item.id,
          time: Number.isFinite(item.time) ? Math.max(0, item.time) : 1 / Math.max(1, state.enemies.find((enemy) => enemy.id === item.id)?.speed || 1),
        }))
    : [];
  const fallbackEnemies = getActiveBattleEnemies();
  return {
    hero: Number.isFinite(clock.hero) ? Math.max(0, clock.hero) : 1 / Math.max(1, getBattleStats(state.activeEnemyIds).speed),
    enemies: enemies.length ? enemies : fallbackEnemies.map((enemy) => ({ id: enemy.id, time: 1 / Math.max(1, enemy.speed) })),
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

function makeId(prefix) {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  state.battleReportSeq += 1;
  return `${prefix}-${Date.now()}-${state.battleReportSeq}`;
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

function makeSystemItemImage(itemName) {
  const file = systemItemImageMap[itemName] || systemItemImageMap.胶卷;
  return `${systemItemImageBase}${file}`;
}

function isSystemItemImageName(itemName) {
  return Boolean(systemItemImageMap[itemName]);
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
  makeSystemItemImage,
  addTestItem(input) {
    const item = balanceItem(input || {}, input?.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-item") }, "测试装备已加入。", true);
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
      fixed: false,
    }, input.image || makePlaceholderImage());
    addInventoryItem({ ...item, id: makeId("test-special") }, "测试特殊装备已加入。", true);
  },
  addTowerItem(name) {
    const item = createItemFromObject(name);
    item.id = makeId("test-item");
    addInventoryItem(item, "测试塔装已加入。", true);
  },
  applyBossReward(typeKey) {
    const drop = createBossReward({ typeKey });
    if (drop) {
      applyBossReward(drop);
      saveGame();
      render();
    }
  },
  addRawItem(input) {
    const item = {
      ...balanceItem({ ...(input || {}), skipSpecialRoll: input?.skipSpecialRoll ?? true }, input?.image || makePlaceholderImage()),
      stats: normalizeStats(input?.stats || {}, 999),
      id: makeId("test-item"),
    };
    addInventoryItem(item, "测试装备已加入。", true);
  },
  setPhoto(image) {
    state.lastPhoto = image || "";
    if (state.lastPhoto) {
      els.photoPreview.src = state.lastPhoto;
    }
    render();
  },
  setHeroStats(next) {
    Object.assign(state.player, next || {});
    saveGame();
    render();
  },
  setHeroForm,
  selectEnemies(ids) {
    state.selectedEnemyIds = Array.isArray(ids) ? ids : [];
    saveGame();
    render();
  },
  setFloor(floor) {
    stopAutoBattle();
    state.floor = clampInt(floor, 1, maxFloor);
    state.gameClear = false;
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = [];
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleClock = null;
    resetBattleSpecial();
    applyFloorShield();
    saveGame();
    render();
  },
  setEnemies(enemies) {
    stopAutoBattle();
    state.testEnemyOverride = Array.isArray(enemies) ? enemies : [];
    state.enemies = buildFloorEncounter(state.floor);
    state.encounterId = makeEncounterId();
    state.selectedEnemyIds = state.enemies.map((enemy) => enemy.id);
    state.activeEnemyIds = [];
    state.currentBattle = null;
    state.battleClock = null;
    resetBattleSpecial();
    applyFloorShield();
    saveGame();
    render();
  },
  recommendEquipment,
  useSelectedConsumable,
  simulateSelectedBattle,
  buildFloorEncounter,
  startAutoBattle,
  resolveBattleAction() {
    const finished = resolveBattleAction();
    saveGame();
    render();
    return finished;
  },
  getFirstInventoryId() {
    return state.inventory[0]?.id || "";
  },
};
