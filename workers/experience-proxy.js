const experienceModel = "Qwen/Qwen3.5-35B-A3B";
const upstreamBaseUrl = "https://api.siliconflow.cn/v1";
const timeoutMs = 45000;
const maxBodyBytes = 7 * 1024 * 1024;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 20;

const visitorBuckets = new Map();

export default {
  async fetch(request, env) {
    return handleExperienceRequest(request, env);
  },
};

export async function handleExperienceRequest(request, env = {}) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  if (url.pathname !== "/" && url.pathname !== "/chat/completions" && url.pathname !== "/api/experience/chat/completions") {
    return jsonResponse({ error: { message: "Not found" } }, 404);
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: { message: "Method not allowed" } }, 405);
  }

  const apiKey = env.PHOTO_HERO_EXPERIENCE_API_KEY || "";
  if (!apiKey) {
    return jsonResponse({ error: { message: "体验接口暂未启用，请切到自定义使用自己的 API。" } }, 503);
  }
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: { message: "体验接口只允许照片勇者网页调用。" } }, 403);
  }
  if (!checkRateLimit(getVisitorKey(request))) {
    return jsonResponse({ error: { message: "体验额度暂时繁忙，请稍后再试，或切到自定义使用自己的 API。" } }, 429);
  }

  let body;
  try {
    body = await readRequestJson(request);
    body = sanitizeExperienceBody(body);
  } catch (error) {
    return jsonResponse({ error: { message: error.message || "请求格式不正确。" } }, error.status || 400);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const upstream = await fetch(buildUpstreamChatUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    const responseHeaders = corsHeaders({
      "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    return new Response(await upstream.text(), { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    const message = error?.name === "AbortError" ? "体验接口请求超时，请稍后再试。" : "体验接口转发失败，请稍后再试。";
    return jsonResponse({ error: { message } }, 502);
  }
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

export { experienceModel };

async function readRequestJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxBodyBytes) {
    throw Object.assign(new Error("图片请求过大，请换一张更小的照片。"), { status: 413 });
  }
  const text = await request.text();
  if (text.length > maxBodyBytes) {
    throw Object.assign(new Error("图片请求过大，请换一张更小的照片。"), { status: 413 });
  }
  try {
    return JSON.parse(text || "{}");
  } catch {
    throw Object.assign(new Error("请求体不是合法 JSON。"), { status: 400 });
  }
}

function hasImageInput(messages) {
  if (!Array.isArray(messages)) return false;
  return messages.some((message) => contentHasImage(message?.content));
}

function contentHasImage(content) {
  if (!Array.isArray(content)) return false;
  return content.some((part) => part?.type === "image_url" && typeof part?.image_url?.url === "string");
}

function buildUpstreamChatUrl() {
  const url = new URL(upstreamBaseUrl);
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/chat/completions`;
  return url.toString();
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("origin") || "";
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return host === "kw66.github.io" || host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

function getVisitorKey(request) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

function checkRateLimit(key) {
  const now = Date.now();
  for (const [visitor, entry] of visitorBuckets) {
    if (now - entry.startedAt > rateLimitWindowMs) visitorBuckets.delete(visitor);
  }
  const current = visitorBuckets.get(key);
  if (!current || now - current.startedAt > rateLimitWindowMs) {
    visitorBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= rateLimitMax;
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    ...extra,
  };
}

function jsonResponse(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders({ "Content-Type": "application/json; charset=utf-8" }),
  });
}
