const STORAGE_KEYS = {
  config: "photoHero.config",
  save: "photoHero.save",
};

const DEFAULT_CONFIG = {
  baseUrl: "https://api.deepseek.com",
  model: "deepseek-v4-flash",
};

const slotNames = {
  weapon: "武器",
  armor: "防具",
  accessory: "饰品",
};

const rarityNames = {
  common: "普通",
  uncommon: "精良",
  rare: "稀有",
};

const monsters = [
  { name: "纸壳史莱姆", hp: 18, atk: 4, def: 0 },
  { name: "橡皮小鬼", hp: 24, atk: 5, def: 1 },
  { name: "抽屉守卫", hp: 32, atk: 7, def: 2 },
  { name: "旧书巫师", hp: 38, atk: 8, def: 3 },
];

const els = {
  playerLevel: byId("playerLevel"),
  playerHpText: byId("playerHpText"),
  playerHpBar: byId("playerHpBar"),
  playerAtk: byId("playerAtk"),
  playerDef: byId("playerDef"),
  equipCount: byId("equipCount"),
  monsterName: byId("monsterName"),
  monsterLevel: byId("monsterLevel"),
  monsterHpText: byId("monsterHpText"),
  monsterHpBar: byId("monsterHpBar"),
  monsterAtk: byId("monsterAtk"),
  monsterDef: byId("monsterDef"),
  winCount: byId("winCount"),
  attackBtn: byId("attackBtn"),
  nextMonsterBtn: byId("nextMonsterBtn"),
  healBtn: byId("healBtn"),
  resetGameBtn: byId("resetGameBtn"),
  photoBtn: byId("photoBtn"),
  analyzeBtn: byId("analyzeBtn"),
  fileInput: byId("fileInput"),
  cameraFrame: byId("cameraFrame"),
  photoPreview: byId("photoPreview"),
  photoStateBadge: byId("photoStateBadge"),
  baseUrlInput: byId("baseUrlInput"),
  apiKeyInput: byId("apiKeyInput"),
  modelInput: byId("modelInput"),
  saveConfigBtn: byId("saveConfigBtn"),
  testChatBtn: byId("testChatBtn"),
  chatPromptInput: byId("chatPromptInput"),
  chatResult: byId("chatResult"),
  mockBtn: byId("mockBtn"),
  lootCard: byId("lootCard"),
  inventoryList: byId("inventoryList"),
  loadingState: byId("loadingState"),
  battleLog: byId("battleLog"),
};

const state = {
  player: {
    level: 1,
    baseHp: 30,
    hp: 30,
    baseAtk: 5,
    baseDef: 1,
    wins: 0,
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
    },
  },
  monsterIndex: 0,
  monster: makeMonster(0, 1),
  inventory: [],
  lastPhoto: "",
  latestItem: null,
  log: ["拍照或选择一件现实物品，把它变成第一件装备。"],
};

loadConfig();
loadSave();
bindEvents();
render();

function bindEvents() {
  [els.baseUrlInput, els.modelInput, els.apiKeyInput].forEach((input) => {
    input.addEventListener("input", () => {
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
      els.photoStateBadge.textContent = "已拍照";
      els.analyzeBtn.disabled = false;
      addLog("照片已准备好，可以鉴定。");
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
      itemName: "练习用照片护符",
      slot: "accessory",
      rarity: "common",
      stats: { attack: 1, defense: 1, hp: 6 },
      description: "没有调用模型，用于测试装备流程。",
      confidence: 1,
    });
    receiveItem(item, "模拟鉴定完成。");
  });

  els.saveConfigBtn.addEventListener("click", saveConfig);
  els.testChatBtn.addEventListener("click", testChatApi);
  els.attackBtn.addEventListener("click", attackMonster);
  els.nextMonsterBtn.addEventListener("click", nextMonster);
  els.healBtn.addEventListener("click", restPlayer);
  els.resetGameBtn.addEventListener("click", resetGame);
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

  saveConfig(false);
  setBusy("鉴定中...");
  els.analyzeBtn.disabled = true;

  try {
    const item = await analyzeDirectly(config, state.lastPhoto);
    receiveItem(balanceItem(item), "鉴定完成。");
  } catch (error) {
    addLog(`鉴定失败：${error.message || "未知错误"}`);
  } finally {
    setBusy("");
    els.analyzeBtn.disabled = false;
    render();
  }
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
                  "根据图片里的真实物品，生成一件低数值装备。只能返回 JSON，格式为 {\"itemName\":\"\",\"slot\":\"weapon|armor|accessory\",\"rarity\":\"common|uncommon|rare\",\"stats\":{\"attack\":0,\"defense\":0,\"hp\":0},\"description\":\"\",\"confidence\":0.0}。数值必须克制：attack/defense 不超过 8，hp 不超过 20。",
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
  state.inventory.unshift(fullItem);
  autoEquip(fullItem);
  addLog(`${message} 获得 ${fullItem.itemName}。`);
  saveGame();
  render();
}

function autoEquip(item) {
  const current = state.player.equipment[item.slot];
  if (!current || scoreItem(item) > scoreItem(current)) {
    state.player.equipment[item.slot] = item;
    addLog(`${item.itemName} 已装备到${slotNames[item.slot]}。`);
    const stats = getPlayerStats();
    state.player.hp = Math.min(stats.maxHp, state.player.hp + item.stats.hp);
  }
}

function attackMonster() {
  const stats = getPlayerStats();

  if (state.player.hp <= 0) {
    addLog("勇者已经倒下，先休整。");
    render();
    return;
  }

  if (state.monster.hp <= 0) {
    addLog("这只怪物已经被击败了。");
    render();
    return;
  }

  const playerDamage = Math.max(1, stats.atk - state.monster.def);
  state.monster.hp = Math.max(0, state.monster.hp - playerDamage);
  addLog(`勇者造成 ${playerDamage} 点伤害。`);

  if (state.monster.hp <= 0) {
    state.player.wins += 1;
    state.player.level = 1 + Math.floor(state.player.wins / 3);
    addLog(`${state.monster.name} 被击败。`);
    saveGame();
    render();
    return;
  }

  const monsterDamage = Math.max(1, state.monster.atk - stats.def);
  state.player.hp = Math.max(0, state.player.hp - monsterDamage);
  addLog(`${state.monster.name} 反击 ${monsterDamage} 点伤害。`);

  if (state.player.hp <= 0) {
    addLog("勇者倒下了，休整可以恢复生命。");
  }

  saveGame();
  render();
}

function nextMonster() {
  if (state.monster.hp > 0) {
    addLog("先解决眼前的怪物。");
    render();
    return;
  }

  state.monsterIndex += 1;
  state.monster = makeMonster(state.monsterIndex, state.player.level);
  addLog(`${state.monster.name} 出现了。`);
  saveGame();
  render();
}

function restPlayer() {
  const stats = getPlayerStats();
  state.player.hp = stats.maxHp;
  addLog("勇者完成休整，生命已恢复。");
  saveGame();
  render();
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEYS.save);
  state.player = {
    level: 1,
    baseHp: 30,
    hp: 30,
    baseAtk: 5,
    baseDef: 1,
    wins: 0,
    equipment: { weapon: null, armor: null, accessory: null },
  };
  state.monsterIndex = 0;
  state.monster = makeMonster(0, 1);
  state.inventory = [];
  state.latestItem = null;
  state.log = ["进度已重置。"];
  render();
}

function makeMonster(index, level) {
  const template = monsters[index % monsters.length];
  const scale = Math.floor(index / monsters.length) + level;
  return {
    name: template.name,
    level: scale,
    maxHp: template.hp + scale * 5,
    hp: template.hp + scale * 5,
    atk: template.atk + scale,
    def: template.def + Math.floor(scale / 2),
  };
}

function getPlayerStats() {
  const equipment = Object.values(state.player.equipment).filter(Boolean);
  const bonus = equipment.reduce(
    (sum, item) => ({
      attack: sum.attack + item.stats.attack,
      defense: sum.defense + item.stats.defense,
      hp: sum.hp + item.stats.hp,
    }),
    { attack: 0, defense: 0, hp: 0 },
  );

  return {
    level: state.player.level,
    maxHp: state.player.baseHp + (state.player.level - 1) * 5 + bonus.hp,
    atk: state.player.baseAtk + (state.player.level - 1) * 2 + bonus.attack,
    def: state.player.baseDef + Math.floor((state.player.level - 1) / 2) + bonus.defense,
  };
}

function balanceItem(item) {
  const safe = item && typeof item === "object" ? item : {};
  const rarity = ["common", "uncommon", "rare"].includes(safe.rarity) ? safe.rarity : "common";
  const rarityCap = { common: 6, uncommon: 9, rare: 12 }[rarity];
  const slot = ["weapon", "armor", "accessory"].includes(safe.slot) ? safe.slot : "accessory";
  const stats = safe.stats || {};
  const attack = clampInt(stats.attack, 0, slot === "weapon" ? rarityCap : Math.ceil(rarityCap / 2));
  const defense = clampInt(stats.defense, 0, slot === "armor" ? rarityCap : Math.ceil(rarityCap / 2));
  const hp = clampInt(stats.hp, 0, rarityCap * 3);

  return {
    itemName: cleanText(safe.itemName, "照片装备", 18),
    slot,
    rarity,
    stats: {
      attack,
      defense,
      hp,
    },
    description: cleanText(safe.description, "由照片鉴定出的装备。", 56),
    confidence: clampNumber(safe.confidence, 0, 1),
  };
}

function scoreItem(item) {
  if (!item) return 0;
  return item.stats.attack * 3 + item.stats.defense * 3 + item.stats.hp;
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
  const equipped = Object.values(state.player.equipment).filter(Boolean);

  state.player.hp = Math.min(state.player.hp, stats.maxHp);

  els.playerLevel.textContent = `Lv.${state.player.level}`;
  els.playerHpText.textContent = `${state.player.hp} / ${stats.maxHp}`;
  els.playerHpBar.style.width = `${percent(state.player.hp, stats.maxHp)}%`;
  els.playerAtk.textContent = stats.atk;
  els.playerDef.textContent = stats.def;
  els.equipCount.textContent = `${equipped.length}/3`;

  els.monsterName.textContent = state.monster.name;
  els.monsterLevel.textContent = `Lv.${state.monster.level}`;
  els.monsterHpText.textContent = `${state.monster.hp} / ${state.monster.maxHp}`;
  els.monsterHpBar.style.width = `${percent(state.monster.hp, state.monster.maxHp)}%`;
  els.monsterAtk.textContent = state.monster.atk;
  els.monsterDef.textContent = state.monster.def;
  els.winCount.textContent = state.player.wins;

  els.nextMonsterBtn.disabled = state.monster.hp > 0;
  renderLoot();
  renderInventory();
  renderLog();
  renderGameTextOnly();
}

function renderLoot() {
  const item = state.latestItem;
  if (!item) {
    els.lootCard.className = "loot-card empty";
    els.lootCard.innerHTML = "<strong>还没有新装备</strong><span>拍照鉴定后会出现在这里。</span>";
    return;
  }

  els.lootCard.className = "loot-card";
  els.lootCard.innerHTML = `
    <strong>${escapeHtml(item.itemName)}</strong>
    <div class="loot-meta">
      <span>${slotNames[item.slot]}</span>
      <span>${rarityNames[item.rarity]}</span>
      <span>攻 +${item.stats.attack}</span>
      <span>防 +${item.stats.defense}</span>
      <span>血 +${item.stats.hp}</span>
    </div>
    <span>${escapeHtml(item.description)}</span>
  `;
}

function renderInventory() {
  els.inventoryList.innerHTML = "";
  for (const item of state.inventory.slice(0, 8)) {
    const row = document.createElement("div");
    row.className = "inventory-item";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.itemName)}</strong>
        <span>${slotNames[item.slot]} · 攻 ${item.stats.attack} / 防 ${item.stats.defense} / 血 ${item.stats.hp}</span>
      </div>
      <button class="ghost-button" type="button">装备</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      state.player.equipment[item.slot] = item;
      addLog(`${item.itemName} 已装备。`);
      saveGame();
      render();
    });
    els.inventoryList.append(row);
  }
}

function renderLog() {
  els.battleLog.innerHTML = "";
  for (const entry of state.log.slice(0, 10)) {
    const li = document.createElement("li");
    li.textContent = entry;
    els.battleLog.append(li);
  }
}

function renderGameTextOnly() {
  window.__photoHeroState = {
    player: {
      level: state.player.level,
      hp: state.player.hp,
      stats: getPlayerStats(),
      equipment: Object.fromEntries(
        Object.entries(state.player.equipment).map(([slot, item]) => [
          slot,
          item ? item.itemName : null,
        ]),
      ),
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
  els.baseUrlInput.value = config.baseUrl || DEFAULT_CONFIG.baseUrl;
  els.apiKeyInput.value = config.apiKey || "";
  els.modelInput.value = config.model || DEFAULT_CONFIG.model;
}

function getConfigFromInputs() {
  return {
    baseUrl: els.baseUrlInput.value.trim(),
    apiKey: els.apiKeyInput.value.trim(),
    model: els.modelInput.value.trim(),
  };
}

function saveGame() {
  const save = {
    player: state.player,
    monsterIndex: state.monsterIndex,
    monster: state.monster,
    inventory: state.inventory,
    latestItem: state.latestItem,
    log: state.log,
  };
  localStorage.setItem(STORAGE_KEYS.save, JSON.stringify(save));
}

function loadSave() {
  const save = readJson(STORAGE_KEYS.save, null);
  if (!save) return;

  state.player = save.player || state.player;
  state.monsterIndex = Number.isFinite(save.monsterIndex) ? save.monsterIndex : 0;
  state.monster = save.monster || makeMonster(0, 1);
  state.inventory = Array.isArray(save.inventory) ? save.inventory : [];
  state.latestItem = save.latestItem || null;
  state.log = Array.isArray(save.log) ? save.log : state.log;
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

window.render_game_to_text = () => JSON.stringify(window.__photoHeroState || {});
window.advanceTime = () => render();
