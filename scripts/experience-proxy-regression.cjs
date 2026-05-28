const assert = require("node:assert/strict");

(async () => {
  const { experienceModel, sanitizeExperienceBody } = await import("../server.js?test=experience-proxy");
  const worker = await import("../workers/experience-proxy.js");

  const sanitized = sanitizeExperienceBody({
    model: "attacker-model",
    stream: true,
    temperature: 3,
    max_tokens: 99999,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "test" },
          { type: "image_url", image_url: { url: "data:image/jpeg;base64,AA==" } },
        ],
      },
    ],
  });

  assert.equal(experienceModel, "Qwen/Qwen3.5-35B-A3B");
  assert.equal(sanitized.model, experienceModel);
  assert.equal(sanitized.stream, false);
  assert.equal(sanitized.temperature, 1);
  assert.equal(sanitized.max_tokens, 640);
  assert.equal(worker.experienceModel, experienceModel);

  assert.throws(() => sanitizeExperienceBody({
    model: "attacker-model",
    messages: [{ role: "user", content: "plain text only" }],
  }), /图片鉴定请求/);
  assert.throws(() => worker.sanitizeExperienceBody({
    model: "attacker-model",
    messages: [{ role: "user", content: "plain text only" }],
  }), /图片鉴定请求/);

  assert.throws(() => sanitizeExperienceBody({
    messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: "https://example.com/photo.jpg" } }] }],
  }), /图片鉴定请求/);
  assert.throws(() => worker.sanitizeExperienceBody({
    messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: "https://example.com/photo.jpg" } }] }],
  }), /图片鉴定请求/);

  const oversizedImage = `data:image/jpeg;base64,${"A".repeat(Math.ceil((2.5 * 1024 * 1024 + 8) / 3) * 4)}`;
  assert.throws(() => sanitizeExperienceBody({
    messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: oversizedImage } }] }],
  }), /图片请求过大/);
  assert.throws(() => worker.sanitizeExperienceBody({
    messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: oversizedImage } }] }],
  }), /图片请求过大/);

  console.log(JSON.stringify({ ok: true, model: sanitized.model }, null, 2));
})();
