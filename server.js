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
      body: JSON.stringify(body),
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

export function sanitizeExperienceBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw Object.assign(new Error("请求体必须是 JSON 对象。"), { status: 400 });
  }
  if (!hasImageInput(body.messages)) {
    throw Object.assign(new Error("体验接口只允许本游戏的图片鉴定请求。"), { status: 400 });
  }

  return {
    ...body,
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
