const STORAGE_KEYS = {
  config: "photoHero.config",
  save: "photoHero.save",
};

const API_PRESETS = {
  "qwen-vl": {
    label: "阿里 Qwen-VL",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-vl-plus",
    note: "推荐用于图片鉴定：支持图片输入，OpenAI-compatible，已通过 GitHub Pages CORS 预检。",
    links: [
      { label: "阿里百炼控制台", url: "https://bailian.console.aliyun.com/" },
      { label: "获取 API Key", url: "https://help.aliyun.com/zh/model-studio/get-api-key" },
    ],
    supportsVision: true,
  },
  siliconflow: {
    label: "硅基流动",
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "Qwen/Qwen2.5-VL-72B-Instruct",
    note: "适合低成本尝试。具体视觉模型名可能随平台变化，若失败请在硅基流动后台复制当前可用模型名。",
    links: [
      { label: "硅基流动控制台", url: "https://cloud.siliconflow.cn/" },
      { label: "API 文档", url: "https://docs.siliconflow.cn/" },
    ],
    supportsVision: true,
  },
  "deepseek-text": {
    label: "DeepSeek 文本",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-flash",
    note: "只适合测试文本对话；DeepSeek 官方 API 当前不支持照片鉴定所需的 image_url 图片输入。",
    links: [
      { label: "DeepSeek 平台", url: "https://platform.deepseek.com/" },
      { label: "官方文档", url: "https://api-docs.deepseek.com/zh-cn/" },
    ],
    supportsVision: false,
  },
  custom: {
    label: "自定义",
    baseUrl: "",
    model: "",
    note: "自定义 API 必须支持图片输入、OpenAI-compatible /chat/completions，以及浏览器 CORS 直连。",
    links: [],
    supportsVision: true,
  },
};

const customDraft = {
  baseUrl: "",
  model: "",
};

const rarityNames = {
  common: "普通",
  uncommon: "精良",
  rare: "稀有",
};

const equipmentPageSize = 10;

const statLabels = {
  attack: "攻",
  defense: "防",
  hp: "血",
  speed: "速",
  shield: "盾",
};

const monsters = [
  { name: "纸壳史莱姆", hp: 18, atk: 4, def: 0 },
  { name: "橡皮小鬼", hp: 24, atk: 5, def: 1 },
  { name: "抽屉守卫", hp: 32, atk: 7, def: 2 },
  { name: "旧书巫师", hp: 38, atk: 8, def: 3 },
];

const els = {
  playerLevel: byId("playerLevel"),
  playerLevelStat: byId("playerLevelStat"),
  playerHpText: byId("playerHpText"),
  playerHpBar: byId("playerHpBar"),
  playerExpText: byId("playerExpText"),
  playerExpBar: byId("playerExpBar"),
  playerAtk: byId("playerAtk"),
  playerDef: byId("playerDef"),
  playerSpeed: byId("playerSpeed"),
  playerShield: byId("playerShield"),
  monsterName: byId("monsterName"),
  monsterLevel: byId("monsterLevel"),
  monsterHpText: byId("monsterHpText"),
  monsterHpBar: byId("monsterHpBar"),
  monsterAtk: byId("monsterAtk"),
  monsterDef: byId("monsterDef"),
  monsterSpeed: byId("monsterSpeed"),
  winCount: byId("winCount"),
  attackBtn: byId("attackBtn"),
  fleeBtn: byId("fleeBtn"),
  resetGameBtn: byId("resetGameBtn"),
  photoBtn: byId("photoBtn"),
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
  modelInput: byId("modelInput"),
  saveConfigBtn: byId("saveConfigBtn"),
  testChatBtn: byId("testChatBtn"),
  chatPromptInput: byId("chatPromptInput"),
  chatResult: byId("chatResult"),
  mockBtn: byId("mockBtn"),
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
  loadingState: byId("loadingState"),
  battleLog: byId("battleLog"),
};

const state = {
  player: {
    level: 1,
    exp: 0,
    baseHp: 30,
    hp: 30,
    baseAtk: 5,
    baseDef: 1,
    baseSpeed: 3,
    baseShield: 0,
    wins: 0,
  },
  monsterIndex: 0,
  monster: makeMonster(0, 1),
  inventory: [],
  equipmentPage: 0,
  selectedItemId: "",
  lastPhoto: "",
  latestItem: null,
  lootError: "",
  log: ["上传图片或拍一件现实物品，把它变成第一件装备。"],
};

loadConfig();
loadSave();
bindEvents();
render();

function bindEvents() {
  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => setSecondaryPanel(button.dataset.panelTarget || "none"));
  });

  document.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset || "custom", true));
  });

  [els.baseUrlInput, els.modelInput, els.apiKeyInput].forEach((input) => {
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

  els.photoBtn.addEventListener("click", () => {
    els.fileInput.value = "";
    els.fileInput.click();
  });

  els.fileInput.addEventListener("change", async () => {
    const file = els.fileInput.files?.[0];
    if (!file) return;

    setBusy("处理照片...");
    try {
      state.lastPhoto = await compressImage(file);
      els.photoPreview.src = state.lastPhoto;
      els.cameraFrame.classList.add("has-photo");
      els.photoStateBadge.textContent = "已选择";
      els.analyzeBtn.disabled = false;
      addLog("图片已准备好，可以鉴定。");
    } catch (error) {
      addLog(`照片读取失败：${error.message || "无法处理该图片"}`);
    } finally {
      setBusy("");
      renderGameTextOnly();
    }
  });

  els.analyzeBtn.addEventListener("click", analyzePhoto);
  els.mockBtn.addEventListener("click", () => {
    const item = balanceItem({
      itemName: "练习用蓝纹护符",
      rarity: "common",
      stats: { attack: 1, defense: 1, hp: 6, speed: 1, shield: 2 },
      description: "没有调用模型，用于测试装备流程。",
      confidence: 1,
    }, state.lastPhoto || makePlaceholderImage());
    receiveItem(item, "模拟鉴定完成。");
  });

  els.saveConfigBtn.addEventListener("click", saveConfig);
  els.testChatBtn.addEventListener("click", testChatApi);
  els.toggleKeyBtn.addEventListener("click", toggleApiKeyVisibility);
  els.attackBtn.addEventListener("click", attackMonster);
  els.fleeBtn.addEventListener("click", fleeBattle);
  els.resetGameBtn.addEventListener("click", resetGame);
  els.equipPrevBtn.addEventListener("click", () => changeEquipmentPage(-1));
  els.equipNextBtn.addEventListener("click", () => changeEquipmentPage(1));
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
  const target = panelId === "config" ? "config" : "";
  els.secondaryArea.classList.toggle("is-collapsed", !target);

  document.querySelectorAll(".secondary-content").forEach((panel) => {
    panel.hidden = panel.dataset.secondaryPanel !== target;
  });

  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.panelTarget === target));
  });
}

function applyPreset(presetId, persist = false) {
  if (persist && getActivePresetId() === "custom" && presetId !== "custom") {
    rememberCustomDraft();
  }

  const preset = API_PRESETS[presetId] || API_PRESETS.custom;
  const isCustom = presetId === "custom";

  if (isCustom) {
    els.baseUrlInput.value = customDraft.baseUrl;
    els.modelInput.value = customDraft.model;
  } else {
    els.baseUrlInput.value = preset.baseUrl;
    els.modelInput.value = preset.model;
  }

  els.baseUrlInput.readOnly = !isCustom;
  els.modelInput.readOnly = !isCustom;
  els.baseUrlInput.classList.toggle("is-locked", !isCustom);
  els.modelInput.classList.toggle("is-locked", !isCustom);
  els.presetNote.textContent = preset.note;
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
  return document.querySelector(".preset-button.is-active")?.dataset.preset || "custom";
}

function rememberCustomDraft() {
  customDraft.baseUrl = els.baseUrlInput.value;
  customDraft.model = els.modelInput.value;
}

async function testChatApi() {
  const config = getConfigFromInputs();
  const prompt = els.chatPromptInput.value.trim();
  const missing = getMissingConfigFields(config);

  if (missing.length) {
    setChatResult(`缺少配置：${missing.join("、")}。`, true, "missing");
    addLog("API 测试缺少配置。");
    render();
    return;
  }

  if (!prompt) {
    setChatResult("测试消息不能为空。", true);
    return;
  }

  saveConfig(false);
  els.testChatBtn.disabled = true;
  setChatResult("正在请求模型...");

  try {
    const content = await callChatText(config, prompt);
    setChatResult(content || "模型返回为空。", false);
    addLog("文本 API 测试成功。");
  } catch (error) {
    setChatResult(error.message || "测试失败。", true);
    addLog("文本 API 测试失败。");
  } finally {
    els.testChatBtn.disabled = false;
    render();
  }
}

async function callChatText(config, prompt) {
  let response;
  try {
    response = await fetch(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
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

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  return JSON.stringify(payload, null, 2);
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

  const config = getConfigFromInputs();
  if (!config.baseUrl || !config.apiKey || !config.model) {
    addLog("先填写并保存 API 地址、Key 和模型名。");
    return;
  }

  if (!isLikelyVisionModel(config)) {
    const message =
      "当前模型看起来不支持图片输入。DeepSeek V4 Flash 可用于测试对话；照片鉴定请换成支持 vision/image_url 的模型。";
    showLootError(message);
    addLog("图片鉴定需要视觉模型。");
    return;
  }

  saveConfig(false);
  setBusy("鉴定中...");
  els.analyzeBtn.disabled = true;

  try {
    const item = await analyzeDirectly(config, state.lastPhoto);
    receiveItem(balanceItem(item, state.lastPhoto), "鉴定完成。");
  } catch (error) {
    const message = normalizeAnalyzeError(error);
    showLootError(`鉴定失败：${message}`);
    addLog(`鉴定失败：${message}`);
  } finally {
    setBusy("");
    els.analyzeBtn.disabled = false;
    render();
  }
}

function isLikelyVisionModel(config) {
  const baseUrl = config.baseUrl.toLowerCase();

  if (baseUrl.includes("api.deepseek.com")) {
    return false;
  }

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
  try {
    response = await fetch(buildChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.35,
        messages: [
          {
            role: "system",
            content:
              "你是一个轻量网页 RPG 的装备鉴定器。你只能输出 JSON，不要输出 Markdown 或额外解释。",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "根据图片里的真实物品，生成一件低数值魔塔式装备。只能返回 JSON，格式为 {\"itemName\":\"\",\"rarity\":\"common|uncommon|rare\",\"stats\":{\"hp\":0,\"attack\":0,\"defense\":0,\"speed\":0,\"shield\":0},\"description\":\"\",\"confidence\":0.0}。数值必须克制：attack/defense/speed/shield 不超过 8，hp 不超过 30。",
              },
              {
                type: "image_url",
                image_url: { url: image },
              },
            ],
          },
        ],
      }),
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

  return extractJson(payload?.choices?.[0]?.message?.content);
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

function extractJson(content) {
  if (typeof content !== "string") {
    throw new Error("模型没有返回文本内容。");
  }

  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : content;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start < 0 || end < start) {
    throw new Error("模型没有返回可解析的 JSON。");
  }

  return JSON.parse(candidate.slice(start, end + 1));
}

function readUpstreamError(payload) {
  if (!payload) return "";
  if (typeof payload.error === "string") return payload.error;
  if (typeof payload.error?.message === "string") return payload.error.message;
  if (typeof payload.message === "string") return payload.message;
  return "";
}

function receiveItem(item, message) {
  const fullItem = {
    ...item,
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  };
  state.latestItem = fullItem;
  state.lootError = "";
  state.inventory.unshift(fullItem);
  state.selectedItemId = fullItem.id;
  state.equipmentPage = 0;
  addLog(`${message} 获得 ${fullItem.itemName}。`);
  saveGame();
  render();
}

function attackMonster() {
  const stats = getPlayerStats();

  if (state.player.hp <= 0) {
    state.player.hp = Math.max(1, Math.floor(stats.maxHp * 0.45));
    addLog("照片勇者从倒地中爬起，恢复少量生命。");
    render();
    return;
  }

  if (state.monster.hp <= 0) {
    spawnNextMonster("新的敌人补上来了。");
  }

  const playerDamage = Math.max(1, stats.atk + Math.floor(stats.speed / 3) - state.monster.def);
  state.monster.hp = Math.max(0, state.monster.hp - playerDamage);
  addLog(`照片勇者造成 ${playerDamage} 点伤害。`);

  if (state.monster.hp <= 0) {
    state.player.wins += 1;
    state.player.exp += 4 + state.monster.level * 2;
    while (state.player.exp >= getNextExp(state.player.level)) {
      state.player.exp -= getNextExp(state.player.level);
      state.player.level += 1;
      state.player.hp = getPlayerStats().maxHp;
      addLog(`勇者升到 Lv.${state.player.level}。`);
    }
    addLog(`${state.monster.name} 被击败。`);
    saveGame();
    render();
    return;
  }

  const rawDamage = Math.max(1, state.monster.atk - stats.def);
  const shieldBlock = Math.min(stats.shield, rawDamage);
  const speedGap = Math.max(0, state.monster.speed - stats.speed);
  const monsterDamage = Math.max(0, rawDamage - shieldBlock + Math.floor(speedGap / 3));
  state.player.hp = Math.max(0, state.player.hp - monsterDamage);
  addLog(`${state.monster.name} 反击 ${monsterDamage} 点伤害，护盾抵消 ${shieldBlock}。`);

  if (state.player.hp <= 0) {
    addLog("照片勇者倒下了，开战或逃跑都能重新站起来。");
  }

  saveGame();
  render();
}

function fleeBattle() {
  const stats = getPlayerStats();
  state.player.hp = Math.max(1, Math.min(stats.maxHp, state.player.hp + Math.ceil(stats.maxHp * 0.35)));
  spawnNextMonster("照片勇者撤退，新的敌人出现。");
}

function spawnNextMonster(message) {
  state.monsterIndex += 1;
  state.monster = makeMonster(state.monsterIndex, state.player.level);
  addLog(message || `${state.monster.name} 出现了。`);
  saveGame();
  render();
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEYS.save);
  state.player = {
    level: 1,
    exp: 0,
    baseHp: 30,
    hp: 30,
    baseAtk: 5,
    baseDef: 1,
    baseSpeed: 3,
    baseShield: 0,
    wins: 0,
  };
  state.monsterIndex = 0;
  state.monster = makeMonster(0, 1);
  state.inventory = [];
  state.equipmentPage = 0;
  state.selectedItemId = "";
  state.latestItem = null;
  state.lootError = "";
  state.log = ["进度已重置。"];
  render();
}

function makeMonster(index, level) {
  const template = monsters[index % monsters.length];
  const scale = Math.floor(index / monsters.length) + level;
  const maxHp = template.hp + scale * 5;
  return {
    name: template.name,
    level: scale,
    maxHp,
    hp: maxHp,
    atk: template.atk + scale,
    def: template.def + Math.floor(scale / 2),
    speed: 2 + Math.floor(scale / 2) + (index % 3),
  };
}

function normalizeMonster(monster, index = 0, level = 1) {
  const fallback = makeMonster(index, level);
  const maxHp = Number.isFinite(monster.maxHp) ? monster.maxHp : fallback.maxHp;
  return {
    name: typeof monster.name === "string" && monster.name ? monster.name : fallback.name,
    level: Number.isFinite(monster.level) ? monster.level : fallback.level,
    maxHp,
    hp: Number.isFinite(monster.hp) ? Math.min(monster.hp, maxHp) : fallback.hp,
    atk: Number.isFinite(monster.atk) ? monster.atk : fallback.atk,
    def: Number.isFinite(monster.def) ? monster.def : fallback.def,
    speed: Number.isFinite(monster.speed) ? monster.speed : fallback.speed,
  };
}

function getPlayerStats() {
  const bonus = state.inventory.reduce(
    (sum, item) => ({
      attack: sum.attack + item.stats.attack,
      defense: sum.defense + item.stats.defense,
      hp: sum.hp + item.stats.hp,
      speed: sum.speed + item.stats.speed,
      shield: sum.shield + item.stats.shield,
    }),
    { attack: 0, defense: 0, hp: 0, speed: 0, shield: 0 },
  );

  return {
    level: state.player.level,
    maxHp: state.player.baseHp + (state.player.level - 1) * 5 + bonus.hp,
    atk: state.player.baseAtk + (state.player.level - 1) * 2 + bonus.attack,
    def: state.player.baseDef + Math.floor((state.player.level - 1) / 2) + bonus.defense,
    speed: state.player.baseSpeed + bonus.speed,
    shield: state.player.baseShield + bonus.shield,
    nextExp: getNextExp(state.player.level),
  };
}

function getNextExp(level) {
  return 12 + (level - 1) * 6;
}

function balanceItem(item, image = "") {
  const safe = item && typeof item === "object" ? item : {};
  const rarity = ["common", "uncommon", "rare"].includes(safe.rarity) ? safe.rarity : "common";
  const rarityCap = { common: 6, uncommon: 9, rare: 12 }[rarity];
  const stats = safe.stats || {};
  const attack = clampInt(stats.attack, 0, rarityCap);
  const defense = clampInt(stats.defense, 0, rarityCap);
  const hp = clampInt(stats.hp, 0, rarityCap * 4);
  const speed = clampInt(stats.speed, 0, rarityCap);
  const shield = clampInt(stats.shield, 0, rarityCap);

  return {
    itemName: cleanText(safe.itemName, "照片装备", 18),
    rarity,
    stats: {
      attack,
      defense,
      hp,
      speed,
      shield,
    },
    description: cleanText(safe.description, "由照片鉴定出的装备。", 56),
    confidence: clampNumber(safe.confidence, 0, 1),
    image,
  };
}

function scoreItem(item) {
  if (!item) return 0;
  return item.stats.attack * 3 + item.stats.defense * 3 + item.stats.speed * 2 + item.stats.shield * 2 + item.stats.hp;
}

async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("请选择图片文件。");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const maxEdge = 1024;
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.78);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
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
  const stats = getPlayerStats();

  state.player.hp = Math.min(state.player.hp, stats.maxHp);

  els.playerLevel.textContent = `Lv.${state.player.level}`;
  els.playerLevelStat.textContent = state.player.level;
  els.playerHpText.textContent = `${state.player.hp} / ${stats.maxHp}`;
  els.playerHpBar.style.width = `${percent(state.player.hp, stats.maxHp)}%`;
  els.playerExpText.textContent = `${state.player.exp} / ${stats.nextExp}`;
  els.playerExpBar.style.width = `${percent(state.player.exp, stats.nextExp)}%`;
  els.playerAtk.textContent = stats.atk;
  els.playerDef.textContent = stats.def;
  els.playerSpeed.textContent = stats.speed;
  els.playerShield.textContent = stats.shield;

  els.monsterName.textContent = state.monster.name;
  els.monsterLevel.textContent = `Lv.${state.monster.level}`;
  els.monsterHpText.textContent = `${state.monster.hp} / ${state.monster.maxHp}`;
  els.monsterHpBar.style.width = `${percent(state.monster.hp, state.monster.maxHp)}%`;
  els.monsterAtk.textContent = state.monster.atk;
  els.monsterDef.textContent = state.monster.def;
  els.monsterSpeed.textContent = state.monster.speed;
  els.winCount.textContent = state.player.wins;

  renderApiStatus();
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

  els.apiStatusBadge.textContent = "可鉴定图片";
  els.apiStatusBadge.dataset.state = "ready";
}

function renderEquipmentGrid() {
  const totalPages = Math.max(1, Math.ceil(state.inventory.length / equipmentPageSize));
  state.equipmentPage = Math.min(Math.max(0, state.equipmentPage), totalPages - 1);
  const start = state.equipmentPage * equipmentPageSize;
  const pageItems = state.inventory.slice(start, start + equipmentPageSize);

  els.equipmentGrid.innerHTML = "";
  for (let i = 0; i < equipmentPageSize; i += 1) {
    const item = pageItems[i];
    const button = document.createElement("button");
    button.className = `equipment-slot${item ? " has-item" : ""}${item?.id === state.selectedItemId ? " is-selected" : ""}`;
    button.type = "button";
    button.disabled = !item;
    button.setAttribute("aria-label", item ? `查看${item.itemName}` : "空装备格");

    if (item) {
      button.innerHTML = `
        <img src="${item.image || makePlaceholderImage()}" alt="">
        <span>${escapeHtml(item.itemName)}</span>
      `;
      button.addEventListener("click", () => {
        state.selectedItemId = item.id;
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
  els.equipPageText.textContent = `${state.inventory.length ? state.equipmentPage + 1 : 0} / ${state.inventory.length ? totalPages : 0}`;
}

function renderEquipmentDetail() {
  if (state.lootError) {
    els.equipmentDetail.classList.add("is-error");
    els.equipmentDetailImage.removeAttribute("src");
    els.equipmentDetailImage.hidden = true;
    els.equipmentDetailEmpty.hidden = false;
    els.equipmentDetailEmpty.textContent = "鉴定失败";
    els.equipmentDetailName.textContent = "鉴定失败";
    els.equipmentDetailMeta.textContent = state.lootError;
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailDesc.textContent = "请检查模型是否支持图片输入和浏览器 CORS。";
    return;
  }

  els.equipmentDetail.classList.remove("is-error");
  const selected = state.inventory.find((item) => item.id === state.selectedItemId) || state.latestItem || state.inventory[0];
  if (!selected) {
    els.equipmentDetailImage.removeAttribute("src");
    els.equipmentDetailImage.hidden = true;
    els.equipmentDetailEmpty.hidden = false;
    els.equipmentDetailEmpty.textContent = "选择装备查看大图";
    els.equipmentDetailName.textContent = "未选择装备";
    els.equipmentDetailMeta.textContent = "上传或拍照后生成装备。";
    els.equipmentDetailStats.innerHTML = "";
    els.equipmentDetailDesc.textContent = "装备会显示缩略图，点击格子后在这里查看图片和描述。";
    return;
  }

  els.equipmentDetailImage.src = selected.image || makePlaceholderImage();
  els.equipmentDetailImage.hidden = false;
  els.equipmentDetailEmpty.hidden = true;
  els.equipmentDetailName.textContent = selected.itemName;
  els.equipmentDetailMeta.textContent = `${rarityNames[selected.rarity]} · 第 ${state.inventory.findIndex((item) => item.id === selected.id) + 1} 件装备`;
  els.equipmentDetailStats.innerHTML = renderStatPills(selected.stats);
  els.equipmentDetailDesc.textContent = selected.description;
}

function renderStatPills(stats) {
  return Object.entries(statLabels)
    .map(([key, label]) => `<span>${label} +${stats[key] || 0}</span>`)
    .join("");
}

function changeEquipmentPage(delta) {
  const totalPages = Math.max(1, Math.ceil(state.inventory.length / equipmentPageSize));
  state.equipmentPage = Math.min(Math.max(0, state.equipmentPage + delta), totalPages - 1);
  saveGame();
  render();
}

function renderLog() {
  els.battleLog.innerHTML = "";
  for (const entry of state.log.slice(0, 10)) {
    const li = document.createElement("li");
    const mark = document.createElement("span");
    mark.className = `log-mark ${getLogMarkType(entry)}`;
    mark.textContent = getLogMarkText(entry);
    const text = document.createElement("span");
    text.textContent = entry;
    li.append(mark, text);
    els.battleLog.append(li);
  }
}

function getLogMarkType(entry) {
  if (entry.includes("鉴定") || entry.includes("装备") || entry.includes("获得")) return "item";
  if (entry.includes("勇者") || entry.includes("撤退")) return "hero";
  if (entry.includes("反击") || entry.includes("出现") || entry.includes("击败")) return "";
  return "info";
}

function getLogMarkText(entry) {
  if (entry.includes("鉴定") || entry.includes("装备") || entry.includes("获得")) return "装";
  if (entry.includes("勇者") || entry.includes("撤退")) return "勇";
  if (entry.includes("反击") || entry.includes("出现") || entry.includes("击败")) return "战";
  return "记";
}

function renderGameTextOnly() {
  window.__photoHeroState = {
    player: {
      level: state.player.level,
      exp: state.player.exp,
      hp: state.player.hp,
      stats: getPlayerStats(),
      equipmentCount: state.inventory.length,
      selectedEquipment: state.inventory.find((item) => item.id === state.selectedItemId)?.itemName || null,
    },
    monster: state.monster,
    hasPhoto: Boolean(state.lastPhoto),
    latestItem: state.latestItem,
    log: state.log.slice(0, 4),
  };
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 20);
}

function setBusy(message) {
  els.loadingState.textContent = message;
}

function saveConfig(showLog = true) {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(getConfigFromInputs()));
  if (showLog) addLog("API 配置已保存到当前浏览器。");
  render();
}

function loadConfig() {
  const config = readJson(STORAGE_KEYS.config, {});
  customDraft.baseUrl = config.presetId === "custom" ? config.baseUrl || "" : config.customBaseUrl || "";
  customDraft.model = config.presetId === "custom" ? config.model || "" : config.customModel || "";
  els.apiKeyInput.value = config.apiKey || "";
  applyPreset(config.presetId || "custom", false);
}

function getConfigFromInputs() {
  const activePreset = getActivePresetId();
  const baseUrl = els.baseUrlInput.value.trim();
  const model = els.modelInput.value.trim();

  return {
    presetId: activePreset,
    baseUrl,
    apiKey: els.apiKeyInput.value.trim(),
    model,
    customBaseUrl: activePreset === "custom" ? baseUrl : customDraft.baseUrl.trim(),
    customModel: activePreset === "custom" ? model : customDraft.model.trim(),
  };
}

function saveGame() {
  const save = {
    player: state.player,
    monsterIndex: state.monsterIndex,
    monster: state.monster,
    inventory: state.inventory,
    equipmentPage: state.equipmentPage,
    selectedItemId: state.selectedItemId,
    latestItem: state.latestItem,
    log: state.log,
  };
  localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(save));
}

function loadSave() {
  const save = readJson(STORAGE_KEYS.save, null);
  if (!save) return;

  state.player = normalizePlayer(save.player || state.player);
  state.monsterIndex = Number.isFinite(save.monsterIndex) ? save.monsterIndex : 0;
  state.monster = normalizeMonster(save.monster || {}, state.monsterIndex, state.player.level);
  state.inventory = Array.isArray(save.inventory) ? save.inventory.map((item) => balanceItem(item, item.image || makePlaceholderImage())) : [];
  state.equipmentPage = Number.isFinite(save.equipmentPage) ? save.equipmentPage : 0;
  state.selectedItemId = save.selectedItemId || state.inventory[0]?.id || "";
  state.latestItem = save.latestItem ? balanceItem(save.latestItem, save.latestItem.image || makePlaceholderImage()) : state.inventory[0] || null;
  state.log = Array.isArray(save.log) ? save.log : state.log;
}

function normalizePlayer(player) {
  return {
    level: Number.isFinite(player.level) ? player.level : 1,
    exp: Number.isFinite(player.exp) ? player.exp : 0,
    baseHp: Number.isFinite(player.baseHp) ? player.baseHp : 30,
    hp: Number.isFinite(player.hp) ? player.hp : 30,
    baseAtk: Number.isFinite(player.baseAtk) ? player.baseAtk : 5,
    baseDef: Number.isFinite(player.baseDef) ? player.baseDef : 1,
    baseSpeed: Number.isFinite(player.baseSpeed) ? player.baseSpeed : 3,
    baseShield: Number.isFinite(player.baseShield) ? player.baseShield : 0,
    wins: Number.isFinite(player.wins) ? player.wins : 0,
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
