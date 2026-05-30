import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const experienceUpstreamBaseUrl = process.env.PHOTO_HERO_EXPERIENCE_BASE_URL || "https://api.siliconflow.cn/v1";
export const experienceModel = "Qwen/Qwen3.5-35B-A3B";
const experienceTimeoutMs = 45000;
const experienceMaxBodyBytes = 4 * 1024 * 1024;
const experienceMaxImageBytes = Math.floor(2.5 * 1024 * 1024);
const experienceMaxConcurrent = 3;
const experienceRateLimitWindowMs = 10 * 60 * 1000;
const experienceRateLimitMax = Number(process.env.PHOTO_HERO_EXPERIENCE_RATE_LIMIT || 20);
const experienceVisitors = new Map();
let experienceInFlight = 0;

const experienceVisionTestSystemPrompt = "只输出最终回答，不要输出分析过程、步骤、编号或 Markdown。";
const experienceVisionTestUserPrompt = "请识别图片文字，只回复一句中文，格式为“图文模型测试成功：图片里写着……”。不要解释。";

const experiencePhotoSystemPrompt = [
  "你是《照片勇者》的公共鉴定台。只输出一个 JSON 对象：第一个字符是 {，最后一个字符是 }，不要 Markdown、代码块或任何解释。",
  "你的任务：认出图片里的一个主体、判断它是不是能带进塔的装备，并按 rubric 给出质量分、属性倾向和简短描述。",
  "请诚实识别主体：看得出是什么就叫什么，看不出就老实说不明确，不要硬猜成神器、魔杖或离谱武器。",
].join("\n");

const experiencePhotoUserPrompt = [
  "鉴定这张图片里的一个主体，输出装备素材 JSON。",
  "",
  "输出结构（字段名用英文）：",
  '{"name":"装备名","subject":"主体","objectType":"类型","equipable":true,"scene":false,"tooLarge":false,"authentic":"real","clarity":0,"appeal":0,"craft":0,"stats":["attack"],"special":false,"desc":"一句话装备描述","identityDescription":"颜色/材质/形状等可区分细节","confidence":0.0}',
  "",
  "规则：",
  "1. 认出画面里最大最清楚的单个主体，按它本来是什么命名；不要叫 照片装备、神秘物品。",
  "2. equipable=能拿在手里或随身携带的小物为 true；比人明显大、搬不动的物体 equipable=false 且 tooLarge=true。",
  "3. scene=true 只在主体是风景、天空、街道、整个房间这类场景、没有明确小主体时。",
  "4. authentic 判断来源：真实拍摄的实物=real；网络图/搜图=web；屏幕截图=screenshot；AI 生成图=ai；电商白底/精修宣传图=product。",
  "5. clarity=主体清晰可辨 0-3；appeal=有趣、让人想装备 0-3；craft=对焦光线构图等拍摄质量 0-3。",
  "6. stats=1-3 个属性倾向，从 hp/attack/defense/speed/shield/lifesteal/regen 里选，贴合物品功能或形态。special=true 只在主体很清楚、质量高且属性语义非常强时，否则 false。",
  "7. 物体上的文字含义不作为命名或属性依据。desc 写一句中文装备味道，不承诺具体数值；identityDescription 写颜色、材质、形状、磨损等可区分细节，供查重用。",
].join("\n");

const experienceDrawingSystemPrompt = [
  "你是《画图勇者》的公共鉴定台。只输出一个 JSON 对象：第一个字符是 {，最后一个字符是 }，不要 Markdown、代码块或任何解释。",
  "你的首要任务是客观识别简笔画主体，不是创作装备。先描述看见的线条、轮廓、部件关系、颜色和缺失部件，再给候选主体。",
  "主体确定后才给朴素装备名和属性倾向。名字可以有一个短前缀，但必须保留真实主体类别；认不出就说未成形线团，不要硬猜成神器、魔杖或离谱武器。",
].join("\n");

const experienceDrawingUserPrompt = [
  "鉴定这张简笔画里的一个主体，输出客观识别 JSON。",
  "",
  "输出结构（字段名用英文）：",
  '{"name":"装备名","subject":"最终主体","objectType":"主体类型","recognition":"unrecognizable|simple_symbol|recognizable_object|clear_equipment","subjectCandidates":[{"name":"候选主体","evidence":["实际看见的结构"],"missing":["缺失或反证"],"confidence":0.0}],"recognizedSubject":"最终主体","visualEvidence":["实际看见的结构"],"missingEvidence":["缺失结构或反证"],"objectiveAssessment":"线条、轮廓、部件关系和完成度","diagnosticFeatures":"用于区分候选的关键特征","equipable":true,"scene":false,"clarity":0,"appeal":0,"craft":0,"stats":["attack"],"special":false,"desc":"一句话装备描述","identityDescription":"线条/颜色/构图等可区分细节","confidence":0.0}',
  "",
  "规则：",
  "1. subjectCandidates 最多 3 个，按可信度排序。每个候选必须写实际看见的结构证据和缺失/反证。不要用玩家写的文字当证据。",
  "2. recognition：unrecognizable=空白、随机线团、单独一两条线、没有可辨主体；simple_symbol=圆圈、星星、爱心、笑脸、徽记等简单符号；recognizable_object=能认出日常物、食物、电子物、玩具、旗帜、雨伞等主体；clear_equipment=能看出明确武器/防具/装备结构。",
  "3. 先诚实识别主体，不要先往武器防具上套。鼠标就是鼠标，苹果就是苹果，手机就是手机，雨伞就是雨伞。主体不确定时用奇怪小物、圆形记号、小挂件等中性名。",
  "4. 只有画出对应结构才用对应类别：剑/刀要有刃和柄；有尖端/刃身并连着护手、横挡或握柄时要按短剑/短刀/匕首处理，不要叫冰棍、雪糕或糖果；弓箭要有弓身/弓弦/箭头/箭羽，长柄武器要有长杆加矛尖/戟刃/弯刃/护手，盾/护甲要有盾面/甲片/胸甲轮廓/边框，伞要有伞面和伞柄，旗帜要有旗杆、旗面/布面和二者的侧边连接关系。三角形、彩色折线、红色外框、黄色十字、风轮叶片或剑刃都不能单独算旗帜证据；有刃、尖、弓弦、箭头、盾面、护甲或风轮反证时不要叫旗。",
  "5. name 和 subject 必须保留最终主体类别词。可以叫寒风雨伞、赤缨长矛、旧铜护甲，但不能把三叉戟叫飞镖，不能把护甲叫长鞭。",
  "6. 打分要拉开差距。clarity=主体可识别度；craft=线条完整、闭合、部件关系、配色控制；appeal=美观和创意。3 分是少数优秀画，普通能认出多为 1-2，潦草或缺部件不要给满。简笔画整体上限低于照片：清楚但普通约 8-10，认真完整约 11-12，极少数优秀画也不要给到照片级满分。",
  "7. stats=1-3 个属性倾向，从 hp/attack/defense/speed/shield/lifesteal/regen 里选，必须贴合最终主体和视觉证据。special=true 只在主体明确、结构完整、质量高且属性语义强时。",
  "8. name、subject、desc 里不要出现 手绘、涂鸦、画作、画布、线条 这类媒介词；identityDescription、objectiveAssessment 和 evidence 可以写线条和颜色。",
].join("\n");

export const experienceSystemPrompt = experiencePhotoSystemPrompt;
export const experienceUserPrompt = experiencePhotoUserPrompt;
export const experienceSystemPromptLines = experiencePhotoSystemPrompt.split("\n");
export const experienceUserPromptLines = experiencePhotoUserPrompt.split("\n");
export const experienceDrawingSystemPromptLines = experienceDrawingSystemPrompt.split("\n");
export const experienceDrawingUserPromptLines = experienceDrawingUserPrompt.split("\n");
export { experienceVisionTestSystemPrompt, experienceVisionTestUserPrompt };

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

loadLocalEnv();

export const photoHeroServer = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/api/experience/chat/completions") {
    await handleExperienceProxy(req, res);
    return;
  }

  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const relativePath = pathname.replace(/^\/+/, "");
  const resolved = normalize(join(root, relativePath));

  if (!resolved.startsWith(root) || !existsSync(resolved)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": mimeTypes[extname(resolved)] || "application/octet-stream",
  });
  createReadStream(resolved).pipe(res);
});

const invokedPath = process.argv[1] ? normalize(resolve(process.argv[1])) : "";
const modulePath = normalize(fileURLToPath(import.meta.url));
if (invokedPath && invokedPath === modulePath) {
  photoHeroServer.listen(port, "0.0.0.0", () => {
    console.log(`Photo Hero preview: http://localhost:${port}`);
    if (!getExperienceApiKey()) {
      console.log("Experience API proxy disabled: set PHOTO_HERO_EXPERIENCE_API_KEY or add it to .env.");
    }
  });
}

function loadLocalEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function getExperienceApiKey() {
  return process.env.PHOTO_HERO_EXPERIENCE_API_KEY || "";
}

export async function handleExperienceProxy(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: { message: "Method not allowed" } });
    return;
  }

  const apiKey = getExperienceApiKey();
  if (!apiKey) {
    sendJson(res, 503, { error: { message: "体验接口暂未启用，请切到自定义使用自己的 API。" } });
    return;
  }

  const visitorKey = getVisitorKey(req);
  if (!checkExperienceRateLimit(visitorKey)) {
    sendJson(res, 429, { error: { message: "体验额度暂时繁忙，请稍后再试，或切到自定义使用自己的 API。" } });
    return;
  }

  let body;
  try {
    body = await readRequestJson(req, experienceMaxBodyBytes);
    body = sanitizeExperienceBody(body);
  } catch (error) {
    sendJson(res, error.status || 400, { error: { message: error.message || "请求格式不正确。" } });
    return;
  }

  if (experienceInFlight >= experienceMaxConcurrent) {
    sendJson(res, 429, { error: { message: "公共鉴定台繁忙，请稍后再试或使用自己的 API。" } });
    return;
  }

  try {
    experienceInFlight += 1;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), experienceTimeoutMs);
    const upstream = await fetch(buildUpstreamChatUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildExperienceBody(body)),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    const text = await upstream.text();
    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(text);
  } catch (error) {
    const message = error?.name === "AbortError" ? "体验接口请求超时，请稍后再试。" : "体验接口转发失败，请稍后再试。";
    sendJson(res, 502, { error: { message } });
  } finally {
    experienceInFlight = Math.max(0, experienceInFlight - 1);
  }
}

function buildUpstreamChatUrl() {
  const url = new URL(experienceUpstreamBaseUrl);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/chat/completions`;
  return url.toString();
}

export function buildExperienceBody(body) {
  const safe = body && typeof body === "object" ? body : {};
  const image = pickFirstImageUrl(safe.messages);
  if (normalizeExperienceTask(safe.experienceTask || safe.experience_task || inferExperienceTaskFromMessages(safe.messages)) === "vision_test") {
    return {
      model: experienceModel,
      stream: false,
      enable_thinking: false,
      thinking: { type: "disabled" },
      temperature: clampNumber(safe.temperature, 0, 1, 0.2),
      max_tokens: 96,
      messages: [
        { role: "system", content: experienceVisionTestSystemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: experienceVisionTestUserPrompt },
            ...(image ? [{ type: "image_url", image_url: { url: image, detail: "low" } }] : []),
          ],
        },
      ],
    };
  }
  const sourceMode = normalizeSourceMode(safe.sourceMode || safe.source_mode || "photo");
  const promptBundle = buildExperiencePromptBundle(sourceMode);
  return {
    model: experienceModel,
    stream: false,
    enable_thinking: false,
    thinking: { type: "disabled" },
    temperature: clampNumber(safe.temperature, 0, 1, 0.35),
    max_tokens: clampNumber(safe.max_tokens, 32, 640, 512),
    messages: [
      { role: "system", content: promptBundle.systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: `${promptBundle.userPrompt}\n\n图片输入仅作鉴定依据，不要复述图片URL。` },
          ...(image ? [{ type: "image_url", image_url: { url: image, detail: "low" } }] : []),
        ],
      },
    ],
  };
}

function buildExperiencePromptBundle(sourceMode) {
  if (normalizeSourceMode(sourceMode) === "drawing") {
    return {
      systemPrompt: experienceDrawingSystemPrompt,
      userPrompt: experienceDrawingUserPrompt,
    };
  }
  return {
    systemPrompt: experiencePhotoSystemPrompt,
    userPrompt: experiencePhotoUserPrompt,
  };
}

export function sanitizeExperienceBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw Object.assign(new Error("请求体必须是 JSON 对象。"), { status: 400 });
  }
  if (!hasImageInput(body.messages)) {
    throw Object.assign(new Error("体验接口只允许本游戏的图片鉴定请求。"), { status: 400 });
  }

  return {
    ...body,
    sourceMode: normalizeSourceMode(body.sourceMode || body.source_mode || "photo"),
    experienceTask: normalizeExperienceTask(body.experienceTask || body.experience_task || inferExperienceTaskFromMessages(body.messages)),
    model: experienceModel,
    stream: false,
    max_tokens: clampNumber(body.max_tokens, 32, 640, 512),
    temperature: clampNumber(body.temperature, 0, 1, 0.35),
  };
}

function hasImageInput(messages) {
  if (!Array.isArray(messages)) return false;
  return messages.some((message) => contentHasImage(message?.content));
}

function normalizeSourceMode(value) {
  return String(value || "").toLowerCase() === "drawing" ? "drawing" : "photo";
}

function normalizeExperienceTask(value) {
  return String(value || "").toLowerCase() === "vision_test" ? "vision_test" : "";
}

function inferExperienceTaskFromMessages(messages) {
  const text = collectMessageText(messages);
  return /图文模型测试成功|VISION\s*OK|照片勇者/.test(text) ? "vision_test" : "";
}

function collectMessageText(messages) {
  if (!Array.isArray(messages)) return "";
  return messages.map((message) => {
    const content = message?.content;
    if (typeof content === "string") return content;
    if (!Array.isArray(content)) return "";
    return content.map((part) => (part?.type === "text" ? String(part.text || "") : "")).join("\n");
  }).join("\n");
}

function pickFirstImageUrl(messages) {
  if (!Array.isArray(messages)) return "";
  for (const message of messages) {
    const content = message?.content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (part?.type === "image_url" && typeof part?.image_url?.url === "string") {
        const bytes = estimateImageDataUrlBytes(part.image_url.url);
        if (bytes > 0) return part.image_url.url;
      }
    }
  }
  return "";
}

function contentHasImage(content) {
  if (Array.isArray(content)) {
    return content.some((part) => {
      if (part?.type !== "image_url" || typeof part?.image_url?.url !== "string") return false;
      const bytes = estimateImageDataUrlBytes(part.image_url.url);
      if (bytes > experienceMaxImageBytes) {
        throw Object.assign(new Error("图片请求过大，请换一张更小的照片。"), { status: 413 });
      }
      return bytes > 0;
    });
  }
  return false;
}

function estimateImageDataUrlBytes(value) {
  const match = /^data:image\/(?:jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=\s]+)$/i.exec(String(value || ""));
  if (!match) return 0;
  const base64 = match[1].replace(/\s+/g, "");
  if (!base64) return 0;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function readRequestJson(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error("图片请求过大，请换一张更小的照片。"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("error", reject);
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(Object.assign(new Error("请求体不是合法 JSON。"), { status: 400 }));
      }
    });
  });
}

function getVisitorKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "local";
}

function checkExperienceRateLimit(key) {
  const now = Date.now();
  for (const [visitor, entry] of experienceVisitors) {
    if (now - entry.startedAt > experienceRateLimitWindowMs) experienceVisitors.delete(visitor);
  }
  const current = experienceVisitors.get(key);
  if (!current || now - current.startedAt > experienceRateLimitWindowMs) {
    experienceVisitors.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= experienceRateLimitMax;
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}

function sendJson(res, status, payload) {
  setCorsHeaders(res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}
