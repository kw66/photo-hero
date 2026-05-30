const assert = require("node:assert/strict");

(async () => {
  const { experienceModel, sanitizeExperienceBody, buildExperienceBody, experienceSystemPrompt, experienceUserPrompt, experienceVisionTestSystemPrompt, experienceVisionTestUserPrompt } = await import("../server.js?test=experience-proxy");
  const worker = await import("../workers/experience-proxy.js");

  const sanitized = sanitizeExperienceBody({
    model: "attacker-model",
    stream: true,
    temperature: 3,
    max_tokens: 99999,
    sourceMode: "drawing",
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
  assert.equal(sanitized.sourceMode, "drawing");
  assert.equal(worker.experienceModel, experienceModel);
  assert.ok(worker.experienceSystemPrompt.includes("公共鉴定台"));
  assert.ok(worker.experienceUserPrompt.includes("装备素材 JSON"));
  assert.ok(worker.experienceSystemPromptLines.includes("你是《照片勇者》的公共鉴定台。只输出一个 JSON 对象：第一个字符是 {，最后一个字符是 }，不要 Markdown、代码块或任何解释。"));
  assert.ok(worker.experienceUserPromptLines.includes("鉴定这张图片里的一个主体，输出装备素材 JSON。"));
  assert.ok(worker.experienceDrawingSystemPromptLines.includes("你是《画图勇者》的公共鉴定台。只输出一个 JSON 对象：第一个字符是 {，最后一个字符是 }，不要 Markdown、代码块或任何解释。"));
  assert.ok(worker.experienceDrawingUserPromptLines.includes("鉴定这张简笔画里的一个主体，输出装备素材 JSON。"));
  assert.ok(experienceSystemPrompt.includes("公共鉴定台"));
  assert.ok(experienceUserPrompt.includes("装备素材 JSON"));
  assert.ok(worker.experienceVisionTestSystemPrompt.includes("只输出最终回答"));
  assert.ok(worker.experienceVisionTestUserPrompt.includes("图文模型测试成功"));
  assert.ok(experienceVisionTestSystemPrompt.includes("只输出最终回答"));
  assert.ok(experienceVisionTestUserPrompt.includes("图文模型测试成功"));

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

  const built = worker.buildExperienceBody(sanitized);
  assert.equal(built.sourceMode, undefined);
  assert.equal(built.enable_thinking, false);
  assert.deepEqual(built.thinking, { type: "disabled" });
  assert.equal(built.messages[0].role, "system");
  assert.equal(built.messages[1].role, "user");
  assert.ok(String(built.messages[0].content).includes("画图勇者"));
  assert.ok(String(built.messages[1].content[0].text).includes("简笔画"));
  assert.ok(String(built.messages[1].content[0].text).includes("装备素材 JSON"));
  assert.ok(built.messages[1].content.some((part) => part.type === "image_url"));

  const localBuilt = buildExperienceBody(sanitized);
  assert.equal(localBuilt.sourceMode, undefined);
  assert.equal(localBuilt.enable_thinking, false);
  assert.deepEqual(localBuilt.thinking, { type: "disabled" });
  assert.equal(localBuilt.messages[0].role, "system");
  assert.ok(String(localBuilt.messages[0].content).includes("公共鉴定台"));
  assert.ok(String(localBuilt.messages[1].content[0].text).includes("装备素材 JSON"));
  assert.ok(localBuilt.messages[1].content.some((part) => part.type === "image_url"));

  const visionTestBody = {
    ...sanitized,
    experienceTask: "vision_test",
    sourceMode: "drawing",
  };
  const workerVisionTest = worker.buildExperienceBody(visionTestBody);
  assert.equal(workerVisionTest.sourceMode, undefined);
  assert.equal(workerVisionTest.max_tokens, 96);
  assert.ok(String(workerVisionTest.messages[0].content).includes("只输出最终回答"));
  assert.ok(String(workerVisionTest.messages[1].content[0].text).includes("图文模型测试成功"));
  assert.ok(!String(workerVisionTest.messages[0].content).includes("画图勇者"));
  assert.ok(!String(workerVisionTest.messages[1].content[0].text).includes("装备素材 JSON"));

  const legacyVisionTestBody = {
    ...sanitized,
    experienceTask: "",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "请识别图片文字，只回复一句中文，格式为“图文模型测试成功：图片里写着……”。不要解释。" },
          { type: "image_url", image_url: { url: "data:image/jpeg;base64,AA==" } },
        ],
      },
    ],
  };
  const legacyWorkerVisionTest = worker.buildExperienceBody(legacyVisionTestBody);
  assert.equal(legacyWorkerVisionTest.max_tokens, 96);
  assert.ok(String(legacyWorkerVisionTest.messages[1].content[0].text).includes("图文模型测试成功"));
  assert.ok(!String(legacyWorkerVisionTest.messages[1].content[0].text).includes("装备素材 JSON"));

  const localVisionTest = buildExperienceBody(visionTestBody);
  assert.equal(localVisionTest.max_tokens, 96);
  assert.ok(String(localVisionTest.messages[0].content).includes("只输出最终回答"));
  assert.ok(String(localVisionTest.messages[1].content[0].text).includes("图文模型测试成功"));
  assert.ok(!String(localVisionTest.messages[1].content[0].text).includes("装备素材 JSON"));

  console.log(JSON.stringify({ ok: true, model: sanitized.model, workerModel: worker.experienceModel, sourceMode: sanitized.sourceMode, visionTest: true }, null, 2));
})();
