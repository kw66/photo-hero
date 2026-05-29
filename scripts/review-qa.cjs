const { chromium } = require("playwright");
const fs = require("fs");

const targetUrl = process.env.PHOTO_HERO_URL || "http://127.0.0.1:3000/";
const screenshotDir = process.env.PHOTO_HERO_QA_OUTPUT || "output";
fs.mkdirSync(screenshotDir, { recursive: true });

async function stubStatsApi(page) {
  await page.route("https://ypefmpeekfucmarbbdov.supabase.co/rest/v1/rpc/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/rpc/get_counters")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
      return;
    }
    if (url.includes("/rpc/increment_counter")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: "null" });
      return;
    }
    await route.fallback();
  });
}

async function collectScenario(page, name, action = async () => {}) {
  const errors = [];
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  const url = new URL(targetUrl);
  url.searchParams.set("review", String(Date.now()));
  url.searchParams.set("scenario", name);
  await page.goto(url.toString(), { waitUntil: "load" });
  await waitForGameReady(page);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "load" });
  await waitForGameReady(page);
  await action(page);
  await page.waitForTimeout(250);

  const metrics = await page.evaluate(() => {
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    const state = JSON.parse(window.render_game_to_text());
    const body = document.body;
    const html = document.documentElement;
    const visibleButtons = Array.from(document.querySelectorAll("button"))
      .filter((node) => !node.hidden && node.offsetParent !== null)
      .map((node) => node.textContent.trim().replace(/\s+/g, " "))
      .filter(Boolean);
    return {
      state,
      title: document.title,
      horizontalOverflow: Math.max(body.scrollWidth, html.scrollWidth) - window.innerWidth,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      fullHeight: Math.max(body.scrollHeight, html.scrollHeight),
      hero: rect(".hero-summary"),
      equipmentGrid: rect(".equipment-grid"),
      detail: rect("#equipmentDetail"),
      actions: rect(".floor-action-row"),
      enemyField: rect("#enemyField"),
      visibleButtons,
      detailText: document.querySelector("#equipmentDetail")?.innerText || "",
      enemyText: document.querySelector("#enemyField")?.innerText || "",
      infoText: document.querySelector(".info-panel")?.innerText || "",
      playerManualText: Array.from(document.querySelectorAll('.info-page[data-info-page="about"], .info-page[data-info-page="photo"], .info-page[data-info-page="battle"]'))
        .map((node) => node.textContent || "")
        .join("\n"),
      activeInfoTab: document.querySelector("[data-info-tab][aria-selected='true']")?.dataset.infoTab || "",
      statCardCount: document.querySelectorAll(".global-stat").length,
      todayStatCount: Array.from(document.querySelectorAll(".global-stat em")).filter((node) => /^今日 /.test(node.textContent.trim())).length,
      statLabels: Array.from(document.querySelectorAll(".global-stat span")).map((node) => node.textContent.trim()),
      formEconomy: window.__reviewFormEconomy || null,
      mobileSaveFallback: window.__reviewMobileSaveFallback || null,
      onboarding: window.__reviewOnboarding || null,
      careerGallery: window.__reviewCareerGallery || null,
      bossCeremony: window.__reviewBossCeremony || null,
      defeatedEquipment: window.__reviewDefeatedEquipment || null,
      defeatEnding: window.__reviewDefeatEnding || null,
      equipmentDetailPreview: window.__reviewEquipmentDetailPreview || null,
      introFlow: window.__reviewIntroFlow || null,
      drawingMode: window.__reviewDrawingMode || null,
      appraisalRetry: window.__reviewAppraisalRetry || null,
      reappraisal: window.__reviewReappraisal || null,
      modeSwitchEquivalence: window.__reviewModeSwitchEquivalence || null,
      itemStory: window.__reviewItemStory || null,
      itemTypography: window.__reviewItemTypography || null,
      soundEffects: window.__reviewSoundEffects || null,
      audioControls: window.__reviewAudioControls || null,
      globalStats: window.__reviewGlobalStats || null,
      bgmPreload: window.__reviewBgmPreload || null,
      monsterDistribution: window.__reviewMonsterDistribution || null,
      bossFilmDrops: window.__reviewBossFilmDrops || null,
      cropAppraisal: window.__reviewCropAppraisal || null,
      groupSpecials: window.__reviewGroupSpecials || null,
      linkedTraits: window.__reviewLinkedTraits || null,
      bossRetreat: window.__reviewBossRetreat || null,
      knightCaptainSummon: window.__reviewKnightCaptainSummon || null,
      panelToggle: window.__reviewPanelToggle || null,
      bestiary: window.__reviewBestiary || null,
      hiddenLayers: window.__reviewHiddenLayers || null,
      apiConfig: window.__reviewApiConfig || null,
      infoCards: window.__reviewInfoCards || null,
      monsterSprites: Array.from(document.querySelectorAll(".monster-sprite")).map((node) => {
        const style = getComputedStyle(node);
        const fallback = node.querySelector("img");
        const portrait = node.closest(".monster-portrait");
        const portraitStyle = portrait ? getComputedStyle(portrait) : null;
        return {
          backgroundImage: style.backgroundImage,
          backgroundSize: style.backgroundSize,
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          width: parseFloat(style.width) || 0,
          height: parseFloat(style.height) || 0,
          portraitWidth: portraitStyle ? parseFloat(portraitStyle.width) || 0 : 0,
          portraitHeight: portraitStyle ? parseFloat(portraitStyle.height) || 0 : 0,
          fallbackSrc: fallback?.getAttribute("src") || "",
          fallbackAlt: fallback?.getAttribute("alt") || "",
        };
      }),
      hitEffects: (() => {
        const readProbe = (className) => {
          const probe = document.createElement("div");
          probe.className = className;
          probe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:120px;height:120px;pointer-events:none;";
          document.body.append(probe);
          const style = getComputedStyle(probe, "::after");
          const result = {
            backgroundImage: style.backgroundImage,
            animationName: style.animationName,
            backgroundSize: style.backgroundSize,
          };
          probe.remove();
          return result;
        };
        return {
          hero: readProbe("hero-form-card is-hit"),
          enemy: readProbe("enemy-card is-hit"),
        };
      })(),
      groupQr: (() => {
        const card = document.querySelector(".author-qr-card");
        const group = document.querySelector(".group-qr");
        const links = document.querySelector(".author-links");
        const img = document.querySelector(".group-qr img");
        const projectSocial = document.querySelector(".project-social-card");
        const anchors = Array.from(projectSocial?.querySelectorAll("a") || []);
        const rect = img?.getBoundingClientRect();
        const cardRect = card?.getBoundingClientRect();
        const groupRect = group?.getBoundingClientRect();
        const linksRect = links?.getBoundingClientRect();
        return {
          text: group?.innerText.trim() || "",
          loaded: Boolean(img?.complete && img.naturalWidth > 0),
          src: img?.getAttribute("src") || "",
          square: rect ? Math.abs(rect.width - rect.height) < 1 : false,
          linksText: links?.innerText.trim() || "",
          projectSocialText: projectSocial?.innerText.trim() || "",
          projectSocialLinks: anchors.map((node) => ({ text: node.textContent.trim(), href: node.href })),
          rightSide: Boolean(
            cardRect
            && groupRect
            && linksRect
            && groupRect.left >= linksRect.right - 1
            && groupRect.right <= cardRect.right + 1
          ),
        };
      })(),
    };
  });
  metrics.errors = errors;
  await page.screenshot({ path: `${screenshotDir}/review-${name}.png`, fullPage: true });
  return metrics;
}

async function waitForGameReady(page) {
  await page.waitForFunction(() => (
    Boolean(window.render_game_to_text)
    && Boolean(window.__photoHeroTestHooks)
    && !document.body.classList.contains("is-booting")
    && document.getElementById("bootLoader")?.hidden !== false
  ), null, { timeout: 30000 });
}

function assertScenario(name, metrics) {
  const failures = [];
  if (metrics.errors.length) failures.push(`${name}: console/page errors: ${metrics.errors.join(" | ")}`);
  if (metrics.horizontalOverflow > 0) failures.push(`${name}: horizontal overflow ${metrics.horizontalOverflow}`);
  if ((metrics.monsterSprites || []).length) {
    for (const sprite of metrics.monsterSprites) {
      if (!sprite.backgroundImage.includes("assets/monster-animations/")) failures.push(`${name}: monster card should use animated sprite strip, got ${sprite.backgroundImage}`);
      if (sprite.animationName !== "monsterIdle") failures.push(`${name}: monster sprite should use idle animation, got ${sprite.animationName}`);
      const expectedWidth = `${Math.round((sprite.width || 0) * 4)}px`;
      const expectedHeight = `${Math.round(sprite.height || 0)}px`;
      if (!sprite.backgroundSize.includes(expectedWidth) || !sprite.backgroundSize.includes(expectedHeight)) failures.push(`${name}: monster sprite should scale 4 frames to its visible size, got ${sprite.backgroundSize} for ${sprite.width}x${sprite.height}`);
      if (sprite.portraitWidth && (sprite.width > sprite.portraitWidth + 0.5 || sprite.height > sprite.portraitHeight + 0.5)) failures.push(`${name}: monster sprite should fit inside portrait frame, got ${JSON.stringify(sprite)}`);
      if (!sprite.fallbackSrc.includes("assets/monsters/") || !sprite.fallbackAlt) failures.push(`${name}: monster sprite should keep static image fallback and alt text, got ${JSON.stringify(sprite)}`);
    }
  }
  if (metrics.hitEffects) {
    if (!metrics.hitEffects.hero?.backgroundImage.includes("assets/effects/hit-hero-impact.png")) failures.push(`${name}: hero hit effect should use impact strip, got ${JSON.stringify(metrics.hitEffects.hero)}`);
    if (metrics.hitEffects.hero?.animationName !== "hitEffectFlash") failures.push(`${name}: hero hit effect should use hitEffectFlash animation, got ${JSON.stringify(metrics.hitEffects.hero)}`);
    if (!metrics.hitEffects.enemy?.backgroundImage.includes("assets/effects/hit-enemy-slash.png")) failures.push(`${name}: enemy hit effect should use slash strip, got ${JSON.stringify(metrics.hitEffects.enemy)}`);
    if (metrics.hitEffects.enemy?.animationName !== "hitEffectFlash") failures.push(`${name}: enemy hit effect should use hitEffectFlash animation, got ${JSON.stringify(metrics.hitEffects.enemy)}`);
  }
  if (name === "mobile-fresh") {
    if (metrics.state.floor !== 0) failures.push(`${name}: fresh game should start at intro floor 0, got ${metrics.state.floor}`);
    if (!metrics.visibleButtons.includes("全部选择")) failures.push(`${name}: missing intro all-select prompt button`);
    if (metrics.visibleButtons.includes("进入魔塔")) failures.push(`${name}: enter-tower button should appear only after all intro films are selected`);
    if (metrics.visibleButtons.includes("绕过")) failures.push(`${name}: intro floor should not show bypass`);
    if (!/塔门前|石台|三卷胶卷/.test(metrics.detailText)) failures.push(`${name}: intro detail should explain the tower-door film rolls, got ${metrics.detailText}`);
    if (!/拍照/.test(metrics.enemyText) || !/鉴定台/.test(metrics.enemyText) || !/战斗/.test(metrics.enemyText)) failures.push(`${name}: intro reward cards should show in-world onboarding copy, got ${metrics.enemyText}`);
    if (/塔门前的三卷胶卷|塔门前的三卷画布|三道槽纹/.test(metrics.enemyText)) failures.push(`${name}: intro reward grid should not show a separate prompt strip, got ${metrics.enemyText}`);
    if (/开局胶卷|三卷都要收下|第一次|备用|最后一卷/.test(metrics.enemyText)) failures.push(`${name}: intro copy still contains blunt placeholder wording, got ${metrics.enemyText}`);
    if (metrics.state.player.filmCount !== 0) failures.push(`${name}: intro film should be granted only after selection, got ${metrics.state.player.filmCount}`);
    if (/价值范围/.test(metrics.detailText)) failures.push(`${name}: exposes raw value range in empty state`);
  }
  if (name === "intro-flow") {
    const result = metrics.introFlow || {};
    if (result.initialFloor !== 0) failures.push(`${name}: should start on floor 0, got ${JSON.stringify(result)}`);
    if (result.initialBgm !== "opening") failures.push(`${name}: intro should use opening BGM, got ${JSON.stringify(result)}`);
    if (result.enterEnabledBeforeAll !== true || result.primaryTextBeforeAll !== "全部选择" || result.promptBeforeAll !== true) failures.push(`${name}: intro action should prompt all-select before all three films are selected, got ${JSON.stringify(result)}`);
    if (result.afterCancelCount !== 2 || result.enterEnabledAfterCancel !== true || result.primaryTextAfterCancel !== "全部选择" || result.promptAfterCancel !== true) failures.push(`${name}: intro cards should allow canceling a selected film and return to all-select prompt, got ${JSON.stringify(result)}`);
    if (result.reorderedBadges?.join(",") !== "1,2") failures.push(`${name}: intro card badges should re-number after cancel, got ${JSON.stringify(result)}`);
    if (result.selectedCount !== 3 || result.enterEnabledAfterAll !== true || result.primaryTextAfterAll !== "进入魔塔" || result.promptAfterAll !== false) failures.push(`${name}: all three intro film cards should switch the action to tower entry, got ${JSON.stringify(result)}`);
    if (result.finalBadges?.join(",") !== "1,3,2") failures.push(`${name}: intro card badges should preserve click order after reselecting, got ${JSON.stringify(result)}`);
    if (!result.equalCardHeights) failures.push(`${name}: intro cards should keep stable equal heights, got ${JSON.stringify(result)}`);
    if (result.afterFloor !== 1 || result.afterFilmCount !== 3) failures.push(`${name}: entering tower should move to floor 1 with 3 films, got ${JSON.stringify(result)}`);
    if (result.afterBgm !== "area1") failures.push(`${name}: floor 1 should switch to area1 BGM on entry, got ${JSON.stringify(result)}`);
    if (result.afterSelectedSlotIndex !== 0 || result.afterPendingPhotoSlotIndex !== 0 || result.afterInfoMode !== "item") failures.push(`${name}: entering tower should focus the first empty equipment slot, got ${JSON.stringify(result)}`);
    if (!result.afterFirstSlotSelected) failures.push(`${name}: first equipment slot should be visually selected after entering tower, got ${JSON.stringify(result)}`);
    if (!result.afterPhotoCallout) failures.push(`${name}: photo button should show first-photo callout after entering tower, got ${JSON.stringify(result)}`);
    if (result.photoCalloutAfterClick) failures.push(`${name}: photo callout should disappear immediately after clicking photo, got ${JSON.stringify(result)}`);
    if (result.photoStartedAfterClick !== true) failures.push(`${name}: clicking photo should mark first-photo tutorial as started, got ${JSON.stringify(result)}`);
  }
  if (name === "drawing-mode") {
    const result = metrics.drawingMode || {};
    if (result.initialTitle !== "照片勇者" || result.afterTitle !== "画图勇者") failures.push(`${name}: title button should toggle from photo to drawing mode, got ${JSON.stringify(result)}`);
    if (!result.modeButtonInsideTools || result.modeButtonInsideHeading || !result.modeButtonBeforeInfo) failures.push(`${name}: mode button should be in panel tools before 冒险手册, got ${JSON.stringify(result)}`);
    if (result.playMode !== "drawing" || result.resourceName !== "画布") failures.push(`${name}: state should expose drawing mode and canvas resource, got ${JSON.stringify(result)}`);
    if (!/画布/.test(result.introText || "") || /胶卷/.test(result.introText || "")) failures.push(`${name}: intro copy should switch from film to canvas wording, got ${result.introText}`);
    if (!result.drawingEmptyIconCount) failures.push(`${name}: empty equipment slots should switch to drawing icons, got ${JSON.stringify(result)}`);
    if (!/打开画布/.test(result.desktopHint || "") || /拖|粘贴|Ctrl\+V|图片/.test(result.desktopHint || "")) failures.push(`${name}: desktop input hint should switch to drawing copy, got ${result.desktopHint}`);
    if (result.afterFloor !== 1 || result.afterResourceCount !== 3) failures.push(`${name}: drawing intro should still enter tower with 3 canvas uses, got ${JSON.stringify(result)}`);
    if (result.photoButtonText !== "画图") failures.push(`${name}: empty-slot action should become 画图, got ${JSON.stringify(result)}`);
    if (!result.modalOpened || !result.canvasVisible) failures.push(`${name}: clicking 画图 should open a visible drawing modal, got ${JSON.stringify(result)}`);
    if (!result.eraserActive || !result.brushRestored || result.activeSize !== "24") failures.push(`${name}: drawing toolbar should support eraser, color restore, and size selection, got ${JSON.stringify(result)}`);
    if (!result.pendingAfterUse || result.pendingSourceMode !== "drawing") failures.push(`${name}: drawn canvas should become pending drawing input, got ${JSON.stringify(result)}`);
    if (!/待鉴定画作/.test(result.detailAfterUse || "")) failures.push(`${name}: detail panel should show pending drawing copy, got ${result.detailAfterUse}`);
  }
  if (name === "appraisal-retry-retains-input") {
    const result = metrics.appraisalRetry || {};
    if (!result.pendingAfterFailure || result.pendingSourceModeAfterFailure !== "drawing") failures.push(`${name}: failed drawing appraisal should keep the pending drawing input, got ${JSON.stringify(result)}`);
    if (result.filmAfterFailure !== result.filmBeforeFailure) failures.push(`${name}: failed appraisal should not consume canvas/film, got ${JSON.stringify(result)}`);
    if (!result.retryButtonEnabled || result.retryButtonText !== "鉴定") failures.push(`${name}: retry button should stay enabled after failure, got ${JSON.stringify(result)}`);
    if (!/画作还在/.test(result.detailAfterFailure || "") || !/重新鉴定/.test(result.detailAfterFailure || "")) failures.push(`${name}: detail copy should tell the player the drawing is retained and retryable, got ${result.detailAfterFailure}`);
    if (result.requestCountAfterRetry !== 2) failures.push(`${name}: clicking retry should send another appraisal request, got ${JSON.stringify(result)}`);
    if (!result.pendingAfterRetry || result.pendingSourceModeAfterRetry !== "drawing") failures.push(`${name}: failed retry should still keep the drawing input, got ${JSON.stringify(result)}`);
  }
  if (name === "reappraisal") {
    const result = metrics.reappraisal || {};
    if (result.buttonText !== "重鉴定" || !result.buttonEnabled) failures.push(`${name}: selected photo equipment should expose an enabled reappraisal button, got ${JSON.stringify(result)}`);
    if (result.requestCount !== 1) failures.push(`${name}: reappraisal should send exactly one model request, got ${JSON.stringify(result)}`);
    if (result.busyButtonText !== "取消重鉴定" || !result.busyButtonEnabled) failures.push(`${name}: in-flight reappraisal should expose an enabled cancel button, got ${JSON.stringify(result)}`);
    if (result.filmBefore !== 2 || result.filmAfter !== 1) failures.push(`${name}: successful reappraisal should consume exactly one film/canvas use, got ${JSON.stringify(result)}`);
    if (result.slotCountBefore !== result.slotCountAfter || result.slotCountAfter !== 1) failures.push(`${name}: reappraisal should replace the selected slot instead of adding a new item, got ${JSON.stringify(result)}`);
    if (!result.sameSlot || result.oldId === result.newId || result.oldName === result.newName) failures.push(`${name}: reappraisal should replace the same slot with a new item identity, got ${JSON.stringify(result)}`);
    if (!result.newPhotoKeyIsReroll || result.newPhotoKey === result.oldPhotoKey) failures.push(`${name}: reappraisal should assign a reroll duplicate key, got ${JSON.stringify(result)}`);
    if (result.duplicateByOldKey || result.duplicateByNewKey?.id !== result.newId) failures.push(`${name}: reappraisal duplicate checks should ignore the old source but recognize the new reroll item, got ${JSON.stringify(result)}`);
    if ((result.newScore || 0) < 18 || (result.newScore || 0) > 26) failures.push(`${name}: reappraisal should use the current appraisal value range, got ${JSON.stringify(result)}`);
    if (!result.reappraisedFromOld || !result.reappraisedAt) failures.push(`${name}: reappraised item should keep source metadata, got ${JSON.stringify(result)}`);
    if (!result.promptHadRerollHint) failures.push(`${name}: reappraisal prompt should tell the model to judge independently, got ${JSON.stringify(result)}`);
    if (!result.detailShowsNewItem) failures.push(`${name}: equipment detail should show the newly reappraised item, got ${JSON.stringify(result)}`);
  }
  if (name === "mode-switch-equivalence") {
    const result = metrics.modeSwitchEquivalence || {};
    if (!/胶卷/.test(result.introPhotoText || "") || /画布/.test(result.introPhotoText || "")) failures.push(`${name}: intro should start with photo resource wording, got ${JSON.stringify(result)}`);
    if (!/画布/.test(result.introDrawingText || "") || /胶卷/.test(result.introDrawingText || "")) failures.push(`${name}: selected intro cards should live-switch to drawing wording, got ${JSON.stringify(result)}`);
    if (result.introDrawingBadges?.join(",") !== "1,2") failures.push(`${name}: intro selection order should survive mode switch, got ${JSON.stringify(result)}`);
    if (!result.drawingEmptyIcons || result.cameraEmptyIconsAfterDrawing) failures.push(`${name}: empty slots should live-switch from camera icons to drawing icons, got ${JSON.stringify(result)}`);
    if (!/胶卷 0\.1/.test(result.monsterPhotoText || "") || /画布/.test(result.monsterPhotoText || "")) failures.push(`${name}: monster cards should show photo resource wording before switch, got ${JSON.stringify(result)}`);
    if (!/画布 0\.1/.test(result.monsterDrawingText || "") || /胶卷/.test(result.monsterDrawingText || "")) failures.push(`${name}: monster cards should live-switch to drawing resource wording, got ${JSON.stringify(result)}`);
    if (result.actionAfterDrawing !== "画图" || result.actionAfterPhoto !== "拍照") failures.push(`${name}: input action should live-switch between 画图 and 拍照, got ${JSON.stringify(result)}`);
    if (!/补给胶卷|胶卷磁石|胶卷倍增|泛用胶卷|高级胶卷/.test(result.bossPhotoText || "") || /画布/.test(result.bossPhotoText || "")) failures.push(`${name}: boss rewards should show photo wording before switch, got ${JSON.stringify(result)}`);
    if (!/补给画布|画布磁石|画布倍增|泛用画布|高级画布/.test(result.bossDrawingText || "") || /胶卷/.test(result.bossDrawingText || "")) failures.push(`${name}: boss rewards should live-switch to drawing wording, got ${JSON.stringify(result)}`);
    if (result.itemNamesBeforeSwitch?.join("|") !== result.itemNamesAfterSwitch?.join("|")) failures.push(`${name}: generated equipment names should not switch with mode, got ${JSON.stringify(result)}`);
    if (!result.analyzingSwitchAllowed || result.modeAfterAnalyzingSwitch !== "photo") failures.push(`${name}: mode should be switchable even while an appraisal is marked analyzing, got ${JSON.stringify(result)}`);
  }
  if (name === "onboarding") {
    const result = metrics.onboarding || {};
    if (!result.firstPhotoHint) failures.push(`${name}: missing first photo hint`);
    if (result.focusedEmptySlot) failures.push(`${name}: empty equipment slot should not use the old breathing highlight`);
    if (!result.photoClickStartsTutorial) failures.push(`${name}: photo button should start the first-photo tutorial state`);
    if (result.photoCalloutAfterClick) failures.push(`${name}: photo button callout should disappear after click`);
    if (!result.battleHintAfterAttack) failures.push(`${name}: missing battle selection hint after attack click`);
    if (!result.postKillHint) failures.push(`${name}: missing post-kill film hint`);
  }
  if (name === "mobile-flee") {
    if (metrics.state.floor !== 2) failures.push(`${name}: bypass should advance to floor 2`);
    if (!metrics.visibleButtons.includes("绕过")) failures.push(`${name}: non-boss floor after bypass should still show bypass`);
  }
  if (name === "mobile-battle-retreat") {
    if (metrics.state.floor !== 1) failures.push(`${name}: retreat should stay on floor 1`);
    if (metrics.state.player.hp !== metrics.state.player.stats.maxHp) failures.push(`${name}: retreat should restore HP to the pre-battle maximum`);
    if (metrics.state.player.shield !== metrics.state.player.stats.shield) failures.push(`${name}: retreat should restore shield to the pre-battle maximum`);
    if (metrics.state.player.filmCount !== 3) failures.push(`${name}: retreat should not keep film rewards`);
    if (metrics.state.currentBattle) failures.push(`${name}: retreat should clear current battle`);
    if (!metrics.visibleButtons.includes("绕过")) failures.push(`${name}: retreat should return to pre-battle bypass state`);
    const damaged = metrics.state.enemies.some((enemy) => enemy.hp !== enemy.maxHp);
    if (damaged) failures.push(`${name}: retreat should restore enemy HP`);
  }
  if (name === "mobile-defeated-equipment") {
    const result = metrics.defeatedEquipment || {};
    if (!result.secondSlotEnabled) failures.push(`${name}: defeated hero should still be able to click occupied equipment slots, got ${JSON.stringify(result)}`);
    if (!result.emptySlotDisabled) failures.push(`${name}: defeated hero should not be able to select empty slots for photo work, got ${JSON.stringify(result)}`);
    if (!result.selectedSecondItem || !/护身/.test(result.detailText || "")) failures.push(`${name}: clicking equipment after defeat should update detail text, got ${JSON.stringify(result)}`);
    if (!result.viewerOpenedOnRepeat) failures.push(`${name}: repeat-clicking selected equipment after defeat should still open the large image, got ${JSON.stringify(result)}`);
    if (!result.discardDisabled) failures.push(`${name}: defeated hero should not be able to dismantle equipment, got ${JSON.stringify(result)}`);
    if (!result.photoDisabled) failures.push(`${name}: defeated hero should not be able to start photo appraisal from item detail, got ${JSON.stringify(result)}`);
    if (metrics.state.player.hp !== 0) failures.push(`${name}: scenario should remain defeated, got hp ${metrics.state.player.hp}`);
  }
  if (name === "mobile-defeat-ending") {
    const result = metrics.defeatEnding || {};
    if (metrics.state.gameClear) failures.push(`${name}: defeat ending must not mark the run as clear`);
    if (metrics.state.player.hp !== 0) failures.push(`${name}: defeat ending scenario should leave hero defeated, got hp ${metrics.state.player.hp}`);
    if (metrics.state.careerSummary?.outcome !== "defeat") failures.push(`${name}: missing defeat career summary outcome, got ${JSON.stringify(metrics.state.careerSummary)}`);
    if (!result.cardIsDefeat || result.panelOutcome !== "defeat") failures.push(`${name}: defeat ending card/panel should use defeat styling, got ${JSON.stringify(result)}`);
    if (!result.attackButtonReturnsEnding) failures.push(`${name}: attack button should reopen defeat ending after viewing equipment, got ${JSON.stringify(result)}`);
    if (!result.occupiedSlotEnabled || !result.selectedItemAfterEnding) failures.push(`${name}: defeated equipment should remain viewable from ending, got ${JSON.stringify(result)}`);
    if (!result.emptySlotDisabled) failures.push(`${name}: empty slot should stay disabled after defeat ending, got ${JSON.stringify(result)}`);
    if (result.textHasClearCopy) failures.push(`${name}: defeat ending should not read as a clear ending, got ${result.detailText}`);
    if (!result.textHasDefeatCopy) failures.push(`${name}: defeat ending should mention stopping/falling, got ${result.detailText}`);
    if (/(?:\bAI\b|重新生成|生成中|模型生成失败)/i.test(`${result.detailText || ""}\n${metrics.visibleButtons.join("\n")}`)) {
      failures.push(`${name}: defeat tower-history UI should not expose AI/regenerate wording, got ${JSON.stringify({ detail: result.detailText, buttons: metrics.visibleButtons })}`);
    }
    if (!result.canvasReady) failures.push(`${name}: defeat ending share image should render as PNG, got ${JSON.stringify(result)}`);
  }
  if (name === "desktop-equipment-preview") {
    const result = metrics.equipmentDetailPreview || {};
    if (!result.visible || !result.loaded || result.width < 180 || result.height < 180) {
      failures.push(`${name}: desktop equipment detail should show a loaded large preview, got ${JSON.stringify(result)}`);
    }
    if (!result.detailHasTwoColumns) failures.push(`${name}: desktop detail body should reserve a second column for the preview, got ${JSON.stringify(result)}`);
    if (!result.viewerOpened) failures.push(`${name}: clicking the desktop detail preview should open the large image viewer, got ${JSON.stringify(result)}`);
    if (!/桌面预览护符/.test(metrics.detailText)) failures.push(`${name}: selected equipment detail should stay visible beside preview, got ${metrics.detailText}`);
  }
  if (name === "mobile-equipment-preview") {
    const result = metrics.equipmentDetailPreview || {};
    if (result.visible || result.display !== "none") {
      failures.push(`${name}: mobile equipment detail should not show the desktop large preview, got ${JSON.stringify(result)}`);
    }
    if (!/移动预览护符/.test(metrics.detailText)) failures.push(`${name}: mobile selected equipment detail should remain visible without preview, got ${metrics.detailText}`);
  }
  if (name === "mobile-reward") {
    if (!metrics.visibleButtons.includes("选择")) failures.push(`${name}: missing reward confirm button`);
    if (/可切换|点选|点选择确认/.test(metrics.enemyText)) failures.push(`${name}: reward cards still show old footer copy`);
  }
  if (name === "mobile-reward-boss-bypass") {
    if (!metrics.visibleButtons.includes("绕过")) failures.push(`${name}: reward boss pre-battle should show 绕过`);
    if (metrics.visibleButtons.includes("逃跑")) failures.push(`${name}: reward boss pre-battle should not show 逃跑`);
    if (metrics.state.floor !== 25) failures.push(`${name}: should inspect reward boss floor 25, got ${metrics.state.floor}`);
    if (metrics.state.currentBattle) failures.push(`${name}: should remain pre-battle`);
  }
  if (name === "mobile-career") {
    if (!metrics.visibleButtons.includes("塔史结局")) failures.push(`${name}: missing tower ending button`);
    if (!metrics.equipmentGrid || metrics.equipmentGrid.height <= 0) failures.push(`${name}: equipment grid should stay usable after clear`);
    if (!metrics.visibleButtons.includes("保存")) failures.push(`${name}: cleared run should allow saving selected equipment image`);
    if (!/通关纪念杯/.test(metrics.detailText)) failures.push(`${name}: selected equipment detail should be visible after clear`);
    if (!metrics.state.player.selectedHasOriginalImage) failures.push(`${name}: selected cleared equipment should retain fullImage for saving`);
  }
  if (name === "mobile-career-markdown") {
    if (/\*\*|标题[:：]|【通关】/.test(metrics.detailText)) failures.push(`${name}: career summary should strip markdown/title wrappers, got ${metrics.detailText}`);
    if (!/黑伞旧闻/.test(metrics.detailText)) failures.push(`${name}: cleaned career title should remain visible`);
    if (!/塔史记名装备/.test(metrics.detailText)) failures.push(`${name}: career card should use tower-history equipment copy`);
    if (/(?:\bAI\b|重新生成|生成中|模型生成失败)/i.test(`${metrics.detailText}\n${metrics.visibleButtons.join("\n")}`)) {
      failures.push(`${name}: tower-history UI should not expose AI/regenerate wording, got ${JSON.stringify({ detail: metrics.detailText, buttons: metrics.visibleButtons })}`);
    }
  }
  if (name === "career-gallery") {
    const gallery = metrics.careerGallery || {};
    if (gallery.itemCards !== 10) failures.push(`${name}: career summary should show 10 equipment cards, got ${gallery.itemCards}`);
    if (gallery.imageCards !== 10) failures.push(`${name}: career summary equipment cards should show images, got ${gallery.imageCards}`);
    if (gallery.canvasReady !== true) failures.push(`${name}: career share image should render with equipment gallery`);
  }
  if (name === "boss-ceremony") {
    const boss = metrics.bossCeremony || {};
    if (!boss.gateNarrative) failures.push(`${name}: gate boss narrative should be ceremonial`);
    if (!boss.rewardNarrative) failures.push(`${name}: reward boss narrative should emphasize optional greed`);
    if (!boss.gateCardClass) failures.push(`${name}: gate boss card should keep gate boss styling class`);
    if (!boss.rewardCardClass) failures.push(`${name}: reward boss card should keep reward boss styling class`);
    if (!boss.gateBadgeHidden) failures.push(`${name}: gate boss card should not show abstract badge text`);
    if (!boss.rewardBadgeHidden) failures.push(`${name}: reward boss card should not show abstract badge text`);
    if (!boss.gateSummary) failures.push(`${name}: gate boss victory summary should be dedicated`);
    if (!boss.rewardSummary) failures.push(`${name}: reward boss victory summary should be dedicated`);
  }
  if (name === "item-story") {
    const story = metrics.itemStory || {};
    if (!story.hasTowerMeaning) failures.push(`${name}: generated item descriptions should feel tower/story themed`);
    if (story.hasRawStatPromise) failures.push(`${name}: generated item descriptions should not expose raw stat promises`);
  }
  if (name === "item-typography") {
    const item = metrics.itemTypography || {};
    if (!item.slotNameBalanced) failures.push(`${name}: long equipment names should split into balanced two-line slot labels, got ${JSON.stringify(item)}`);
    if (!item.detailNameBalanced) failures.push(`${name}: detail title should use the same balanced line break, got ${JSON.stringify(item)}`);
    const refunds = item.refunds || {};
    if (refunds.common !== 0.3 || refunds.rare !== 0.5 || refunds.epic !== 0.7 || refunds.legendary !== 0.9) {
      failures.push(`${name}: quality dismantle refunds should be 0.3/0.5/0.7/0.9, got ${JSON.stringify(refunds)}`);
    }
    const scoredItems = item.scoredItems || {};
    if (scoredItems.shieldFourScore !== 12 || scoredItems.shieldFourQuality !== "common") {
      failures.push(`${name}: shield +4 should score with weight 3, got ${JSON.stringify(scoredItems)}`);
    }
    if (scoredItems.shieldFiveScore !== 15 || scoredItems.shieldFiveQuality !== "rare") {
      failures.push(`${name}: shield +5 should score as rare actual power, got ${JSON.stringify(scoredItems)}`);
    }
    if (scoredItems.shieldOnlyValue >= 21 && scoredItems.shieldOnlyScore < 21 && scoredItems.shieldOnlyQuality === "legendary") {
      failures.push(`${name}: shield-only item quality should not use raw photo value, got ${JSON.stringify(scoredItems)}`);
    }
    if (scoredItems.shieldWithSpecialScore !== 20 || scoredItems.shieldWithSpecialQuality !== "epic") {
      failures.push(`${name}: meaningful special effects should lift shield items to epic, got ${JSON.stringify(scoredItems)}`);
    }
  }
  if (name === "mobile-save-fallback") {
    const result = metrics.mobileSaveFallback || {};
    if (result.saveResult !== "viewer") failures.push(`${name}: mobile save should fall back to image viewer, got ${result.saveResult}`);
    if (!result.viewerOpen) failures.push(`${name}: save fallback should open image viewer`);
    if (!result.captionHasHint) failures.push(`${name}: save fallback should show long-press hint`);
    if (!result.viewerKeepsImageOnTap) failures.push(`${name}: tapping the image should not close the save fallback viewer`);
  }
  if (name === "sound-effects") {
    const se = metrics.soundEffects || {};
    const controls = metrics.audioControls || {};
    const preload = metrics.bgmPreload || {};
    if (se.appraisalSuccess !== 1) failures.push(`${name}: appraisal should fire one success sound, got ${se.appraisalSuccess}`);
    if (se.dismantle !== 1) failures.push(`${name}: dismantle should fire one sound, got ${se.dismantle}`);
    if (se.nextFloor !== 1) failures.push(`${name}: floor advance should fire one sound, got ${se.nextFloor}`);
    if (se.repeatedEnemyHits !== 2) failures.push(`${name}: repeated enemy hits during animation should fire two battle sounds, got ${se.repeatedEnemyHits}`);
    if (se.repeatedHeroHits !== 2) failures.push(`${name}: repeated hero hits during animation should fire two battle sounds, got ${se.repeatedHeroHits}`);
    if (se.sweepBattleHits !== 3) failures.push(`${name}: sweep should fire one battle sound per animated hit card, got ${se.sweepBattleHits}`);
    if (se.sweepEnemyHitCount !== 3) failures.push(`${name}: sweep should animate all three physically hit cards, got ${se.sweepEnemyHitCount}`);
    if (se.heroHitActive !== true || se.enemyHitActive !== true) failures.push(`${name}: hit animation state should remain active after sound checks, got ${JSON.stringify({ hero: se.heroHitActive, enemy: se.enemyHitActive })}`);
    if (se.bgmNativeLoopDisabled !== true) failures.push(`${name}: BGM should use manual delayed looping, got ${JSON.stringify(se)}`);
    if (se.bgmSameTrackNoRefresh !== true) failures.push(`${name}: same-track BGM refreshes should not restart playback, got ${JSON.stringify(se)}`);
    if (se.modeSwitchDoesNotTouchBgm !== true) failures.push(`${name}: switching photo/drawing mode should not restart or switch BGM, got ${JSON.stringify(se)}`);
    if (se.bgmDelayedLoopRestart !== true) failures.push(`${name}: BGM should restart only after delayed loop handoff, got ${JSON.stringify(se)}`);
    if (se.bgmRecoveredFromPause !== true) failures.push(`${name}: BGM should recover if paused unexpectedly, got ${JSON.stringify(se)}`);
    if (se.bgmWatchdogRecovered !== true) failures.push(`${name}: BGM watchdog should recover stalled playback, got ${JSON.stringify(se)}`);
    if (se.contextRecoveryAttempted !== true) failures.push(`${name}: audio context recovery should be attempted, got ${JSON.stringify(se)}`);
    if (se.bgmSwitchStartedNewTrack !== true) failures.push(`${name}: BGM switching should start the requested new track, got ${JSON.stringify(se)}`);
    if (se.bgmSwitchStopsOldTrack !== true) failures.push(`${name}: BGM switching should keep the old track during handoff then stop it, got ${JSON.stringify(se)}`);
    if (se.bossBgmOnFloorEntry !== true) failures.push(`${name}: boss BGM should switch on floor entry before battle starts, got ${JSON.stringify(se)}`);
    if (se.bossBattleDoesNotRefreshBgm !== true) failures.push(`${name}: starting a boss battle should not refresh the already-selected floor BGM, got ${JSON.stringify(se)}`);
    if (se.bgmCrossfadeHandoff !== true) failures.push(`${name}: BGM switch should crossfade by keeping the previous track during handoff, got ${JSON.stringify(se)}`);
    if (se.lastSfxPlayError) failures.push(`${name}: SFX playback should not leave an error after recovery, got ${se.lastSfxPlayError}`);
    if (controls.sfxFill !== "100%" || controls.bgmFill !== "100%") failures.push(`${name}: 100% sliders should fill to the end, got ${JSON.stringify(controls)}`);
    if (controls.sfxZeroFill !== "0%" || controls.bgmZeroFill !== "0%") failures.push(`${name}: 0% sliders should empty to the start, got ${JSON.stringify(controls)}`);
    if (controls.sliderPaddingLeft !== "0px" || controls.sliderPaddingRight !== "0px" || controls.sliderBorderLeft !== "0px" || controls.sliderBorderRight !== "0px") {
      failures.push(`${name}: volume range inputs should not inherit global input padding/border, got ${JSON.stringify(controls)}`);
    }
    if (!controls.battleGainBoosted) failures.push(`${name}: SFX gain should exceed old capped volume at 100%, got ${JSON.stringify(controls)}`);
    const preloadedKeys = preload.completedKeys || preload.blobKeys || preload.keys || [];
    if (!preload.started || preloadedKeys.length < 3) failures.push(`${name}: BGM should preload in order after audio unlock, got ${JSON.stringify(preload)}`);
    if (preloadedKeys[0] !== "opening") failures.push(`${name}: BGM preload should start from opening track, got ${JSON.stringify(preloadedKeys)}`);
    if (!(preload.blobKeys || []).includes("area1")) failures.push(`${name}: preloaded BGM should use cached blob sources for early floors, got ${JSON.stringify(preload)}`);
  }
  if (name === "monster-distribution") {
    const distribution = metrics.monsterDistribution || {};
    if (distribution.floor1AllSlime !== true) failures.push(`${name}: floor 1 should stay all slime`);
    if (distribution.earlyInvalidCount !== 0) failures.push(`${name}: non-basic monsters appeared before floor 10: ${JSON.stringify(distribution.earlyInvalidByFloor)}`);
    if (distribution.earlyTier3Count !== 0) failures.push(`${name}: tier 3 monsters appeared before floor 11`);
    if ((distribution.floor11Tier3Rate || 0) > 0.42) failures.push(`${name}: floor 11 tier 3 rate too high: ${distribution.floor11Tier3Rate}`);
    if ((distribution.floor13Tier3Rate || 0) > 0.58) failures.push(`${name}: floor 13 tier 3 rate too high: ${distribution.floor13Tier3Rate}`);
    if ((distribution.floor17Tier4Rate || 0) > 0.28) failures.push(`${name}: floor 17 tier 4 rate too high: ${distribution.floor17Tier4Rate}`);
    if ((distribution.floor23Tier4Rate || 0) < 0.18) failures.push(`${name}: floor 23 should still allow some tier 4 pressure: ${distribution.floor23Tier4Rate}`);
  }
  if (name === "boss-film-drops") {
    const drops = metrics.bossFilmDrops || {};
    for (const floor of ["10", "20", "25", "35", "38", "40"]) {
      if (drops[floor]?.length !== 1 || drops[floor][0].drop !== "胶卷 0.3") {
        failures.push(`${name}: floor ${floor} boss should show 胶卷 0.3, got ${JSON.stringify(drops[floor])}`);
      }
    }
    const floor30 = drops["30"] || [];
    const floor30Drops = floor30.map((enemy) => `${enemy.typeKey}:${enemy.drop}`).join(",");
    if (floor30.length !== 1 || floor30[0]?.typeKey !== "knightCaptain" || floor30[0]?.drop !== "胶卷 0.3") {
      failures.push(`${name}: floor 30 should preview one knight captain with 胶卷 0.3, got ${floor30Drops}`);
    }
  }
  if (name === "crop-appraisal") {
    const crop = metrics.cropAppraisal || {};
    if (!crop.croppedSmaller) failures.push(`${name}: cropped image should be smaller than source`);
    if (!crop.sameCropDuplicate) failures.push(`${name}: same source and same crop should be treated as duplicate`);
    if (crop.differentCropDuplicate) failures.push(`${name}: same source with different crop should not be blocked by photo duplicate`);
    if (!crop.viewerOpened) failures.push(`${name}: crop action should open the full-screen viewer`);
    if (!crop.viewerClosedAfterConfirm) failures.push(`${name}: crop confirm should close the full-screen viewer`);
    if (!crop.viewerCropSaved) failures.push(`${name}: full-screen crop should save a crop rectangle`);
  }
  if (name === "group-specials") {
    const specials = metrics.groupSpecials || {};
    if (specials.sweepLeftHp !== 0 || specials.sweepCenterHp !== 0 || specials.sweepRightHp !== 0) {
      failures.push(`${name}: sweep should still hit neighbors when center is killed, got ${JSON.stringify(specials)}`);
    }
    const visualSweepState = specials.visualSweepState || {};
    if (visualSweepState["visual-left"] !== 0 || visualSweepState["visual-center"] !== 0 || visualSweepState["visual-right"] !== 0 || visualSweepState["visual-far"] !== 4) {
      failures.push(`${name}: sweep should use visual card position, not selected attack order, got ${JSON.stringify(visualSweepState)}`);
    }
    if (specials.peerlessBaseAtk !== 4 || specials.peerlessBaseDef !== 1 || specials.peerlessAtk !== 7 || specials.peerlessDef !== 4) {
      failures.push(`${name}: peerless should add attack/defense +3 only to battle stats, got ${JSON.stringify(specials)}`);
    }
    if (specials.peerlessAfterResetAtk !== 4 || specials.peerlessAfterResetDef !== 1) {
      failures.push(`${name}: peerless bonus should reset outside battle, got ${JSON.stringify(specials)}`);
    }
    const activeKeys = specials.activeSpecialKeys || [];
    for (const key of ["dealDamageAttack", "takeDamageDefense", "doubleStrikeSpeedDown", "shieldCrashAttackDown"]) {
      if (!activeKeys.includes(key)) failures.push(`${name}: different unique passives should each be active, missing ${key}, got ${JSON.stringify(activeKeys)}`);
    }
    if ((activeKeys.filter((key) => key === "dealDamageAttack").length) !== 1) {
      failures.push(`${name}: same passive key should only activate once, got ${JSON.stringify(activeKeys)}`);
    }
    if (specials.comboStrikeCount !== 2 || specials.comboShieldDamage !== 10 || specials.comboAttackAfterHit !== 1 || specials.comboDefenseAfterHit !== 1) {
      failures.push(`${name}: combo skills should interact after their cooldown counts, got ${JSON.stringify(specials)}`);
    }
    if (specials.comboBaseAtk !== 4 || specials.comboBattleAtk !== 5 || specials.comboAtkReadout?.base !== "4" || specials.comboAtkReadout?.delta !== "+1" || specials.comboAtkReadout?.deltaKind !== "positive") {
      failures.push(`${name}: temporary attack should render as base plus green delta without changing base stats, got ${JSON.stringify({ base: specials.comboBaseAtk, battle: specials.comboBattleAtk, readout: specials.comboAtkReadout })}`);
    }
    if (specials.zeroHeroDamage !== 0 || specials.zeroAttackAfterHit !== 1 || specials.zeroHpAfterHeroStrike !== 64 || specials.zeroDefenseAfterMonster !== 1 || specials.zeroHpAfterMonster !== 70) {
      failures.push(`${name}: attack/defense/regen/lifesteal should trigger from actions even at zero damage, got ${JSON.stringify(specials)}`);
    }
    if (specials.sweepActionAttack !== 1 || specials.sweepActionHp !== 56) {
      failures.push(`${name}: sweep should not count as extra attack action for attack gain/lifesteal, got ${JSON.stringify(specials)}`);
    }
    const megaDefense = specials.megaDefenseState || {};
    if (megaDefense.immuneUsed !== 2 || megaDefense.defenseSpecial !== 1 || megaDefense.hp !== 41) {
      failures.push(`${name}: mega defense immunity should still count as a defended action, got ${JSON.stringify(megaDefense)}`);
    }
    if (specials.heavyStrikeHp !== 1 || specials.heavyStrikeValue !== 9) {
      failures.push(`${name}: heavy strike should fire on the third attack and record the 3x attack damage, got ${JSON.stringify(specials)}`);
    }
    if (specials.bloodrageAtk !== 8 || specials.bloodrageReadout?.base !== "4" || specials.bloodrageReadout?.delta !== "+4") {
      failures.push(`${name}: bloodrage should add attack from missing HP without changing base attack, got ${JSON.stringify({ atk: specials.bloodrageAtk, readout: specials.bloodrageReadout })}`);
    }
    if (specials.attackCapState?.attack !== 5 || specials.attackCapState?.leftBadge !== "" || specials.attackCapState?.rightBadge !== "+5") {
      failures.push(`${name}: capped attack stack should stop showing a cooldown countdown and keep the +5 value badge, got ${JSON.stringify(specials.attackCapState)}`);
    }
  }
  if (name === "linked-traits") {
    const traits = metrics.linkedTraits || {};
    if (!traits.guardShieldApplied || !traits.guardShieldDisplayed) {
      failures.push(`${name}: guard team shield should apply and display as over-cap HP, got ${JSON.stringify(traits.guardState)}`);
    }
    if (!traits.startAutoBattleGuardShieldApplied) {
      failures.push(`${name}: guard team shield should survive the real startAutoBattle render path, got ${JSON.stringify(traits.startAutoBattleGuardState)}`);
    }
    if (!traits.warcryApplied || !traits.warcryRemoved || traits.warcryClockAfterDeath !== 0.5) {
      failures.push(`${name}: warrior warcry should be a live aura only, got ${JSON.stringify({ base: traits.warriorBaseState, live: traits.warriorLiveState, after: traits.warriorAfterDeathState, clock: traits.warcryClockAfterDeath })}`);
    }
    if (traits.wizardSingleDef !== 5 || traits.wizardTempDefBeforeThird !== 5 || traits.wizardTempDefAfterHit !== 6 || traits.wizardBaseDefAfterHit !== 10) {
      failures.push(`${name}: one wizard should lock the opening defense penalty and trigger temp defense only on the third hit, got ${JSON.stringify({ single: traits.wizardSingleDef, beforeThird: traits.wizardTempDefBeforeThird, afterHit: traits.wizardTempDefAfterHit, base: traits.wizardBaseDefAfterHit })}`);
    }
    const wizardReadout = traits.wizardStatReadout || {};
    if (wizardReadout.base !== "10" || wizardReadout.delta !== "-4" || wizardReadout.deltaKind !== "negative") {
      failures.push(`${name}: wizard defense break should render as base plus red delta, got ${JSON.stringify(wizardReadout)}`);
    }
    if (traits.wizardDef !== 0) failures.push(`${name}: two wizards should reduce hero defense to 0, got ${traits.wizardDef}`);
    if (traits.wizardTempDefAtCap !== 10 || traits.wizardDefenseSpecialAtCap !== 5 || traits.wizardCapReadout?.base !== "10" || traits.wizardCapReadout?.delta !== "") {
      failures.push(`${name}: temporary defense should stack to its own cap and can neutralize a -5 wizard penalty exactly, got ${JSON.stringify({ def: traits.wizardTempDefAtCap, readout: traits.wizardCapReadout, special: traits.wizardDefenseSpecialAtCap })}`);
    }
    if (traits.wizardSmallPenaltyDefAtCap !== 7 || traits.wizardSmallPenaltySpecialAtCap !== 5 || traits.wizardSmallPenaltyReadout?.base !== "5" || traits.wizardSmallPenaltyReadout?.delta !== "+2" || traits.wizardSmallPenaltyReadout?.deltaKind !== "positive") {
      failures.push(`${name}: temporary defense cap must not be reduced to the wizard penalty amount, got ${JSON.stringify({ def: traits.wizardSmallPenaltyDefAtCap, readout: traits.wizardSmallPenaltyReadout, special: traits.wizardSmallPenaltySpecialAtCap })}`);
    }
    if (traits.wizardAfterOneDeathDef !== 0 || traits.wizardAfterDeathDef !== 0) {
      failures.push(`${name}: wizard defense break should stay locked after wizard death, got ${JSON.stringify({ one: traits.wizardAfterOneDeathDef, all: traits.wizardAfterDeathDef })}`);
    }
    if (traits.wizardNegativeDef !== -3 || traits.wizardNegativeHp !== 67) {
      failures.push(`${name}: wizard should not turn negative defense into zero, got ${JSON.stringify({ def: traits.wizardNegativeDef, hp: traits.wizardNegativeHp })}`);
    }
    if (traits.patrolShield !== 0 || traits.patrolHp !== 75 || traits.patrolAfterDeathShield !== 0) failures.push(`${name}: patrol breakShield should be a battle-start result that persists after patrol dies, got ${JSON.stringify(traits.patrolState)}`);
    if (traits.noLifestealBefore !== 0 || traits.noLifestealAfter !== 2) {
      failures.push(`${name}: skeleton no-lifesteal should disappear after skeleton death, got ${JSON.stringify({ before: traits.noLifestealBefore, after: traits.noLifestealAfter })}`);
    }
    const lifestealReadout = traits.noLifestealReadoutBefore || {};
    if (lifestealReadout.base !== "2" || lifestealReadout.delta !== "-2" || lifestealReadout.deltaKind !== "negative") {
      failures.push(`${name}: skeleton no-lifesteal should render lifesteal as base plus red delta, got ${JSON.stringify(lifestealReadout)}`);
    }
    if (traits.noRegenBefore !== 0 || traits.noRegenAfter !== 4) {
      failures.push(`${name}: knight no-regen should disappear after knight death, got ${JSON.stringify({ before: traits.noRegenBefore, after: traits.noRegenAfter })}`);
    }
    const regenReadout = traits.noRegenReadoutBefore || {};
    if (regenReadout.base !== "4" || regenReadout.delta !== "-4" || regenReadout.deltaKind !== "negative") {
      failures.push(`${name}: knight no-regen should render regen as base plus red delta, got ${JSON.stringify(regenReadout)}`);
    }
    if (traits.golemHp !== 7) failures.push(`${name}: golem sturdy should limit normal hero damage to 1, got hp ${traits.golemHp}`);
    if (traits.octopusDamage !== 41) failures.push(`${name}: octopus giant should add max-HP gap damage, got ${traits.octopusDamage}`);
    if (traits.octopusDisplayAtk !== 41 || !/生命上限差/.test(traits.octopusTraitText || "")) {
      failures.push(`${name}: octopus card should show effective attack and max-HP-gap copy, got ${JSON.stringify({ atk: traits.octopusDisplayAtk, trait: traits.octopusTraitText })}`);
    }
    if (traits.octopusEqualDefenseEstimate !== "损失 -0" || traits.octopusEqualDefenseEstimateState !== "safe") {
      failures.push(`${name}: octopus estimate should use real max HP, not theoretical buffer HP, got ${JSON.stringify(traits.octopusEqualDefenseEstimateStateInfo)}`);
    }
    if (traits.octopusLethalEstimate !== "会倒下" || traits.octopusLethalEstimateState !== "danger") {
      failures.push(`${name}: octopus estimate should warn when giant damage is lethal, got ${JSON.stringify(traits.octopusLethalStateInfo)}`);
    }
    if (traits.octopusAfterHpKillEstimate !== "损失 -8" || traits.octopusAfterHpKillEstimateState !== "safe") {
      failures.push(`${name}: octopus estimate should include real max-HP gains from previous simulated kills without counting theoretical buffer, got ${JSON.stringify(traits.octopusAfterHpKillStateInfo)}`);
    }
    if (traits.octopusSpeed !== 2) failures.push(`${name}: octopus speed should be 2, got ${traits.octopusSpeed}`);
    if (traits.demonPromotionAtk !== 19 || traits.demonPromotionDef !== 9 || traits.dragonSpeedAfterAttack !== 4) {
      failures.push(`${name}: demon should promote and dragon should speed up on attack, got ${JSON.stringify(traits.bossGrowthState)}`);
    }
    if (traits.archmageStats?.atk !== 10 || traits.archmageStats?.def !== 5 || traits.archmageStats?.speed !== 3) {
      failures.push(`${name}: archmage stats should be 10/5/3, got ${JSON.stringify(traits.archmageStats)}`);
    }
    if (traits.archmageSummonHpChanged || traits.archmageSummonLeftHp !== 30 || traits.archmageSummonActiveOrder?.join(",") !== "mage,mage,archmage" || traits.archmageSummonDrops?.join(",") !== "胶卷 0.0,胶卷 0.3,胶卷 0.0") {
      failures.push(`${name}: archmage summon should revive a side mage without damaging hero and keep target/drop order, got ${JSON.stringify(traits.archmageSummonState)}`);
    }
    if (traits.knightDamageWithGuards !== 17 || traits.knightDamageAfterGuardDeath !== 17) {
      failures.push(`${name}: knight captain should not reduce damage through guards, got ${JSON.stringify(traits.knightState)}`);
    }
    if (traits.shieldCrashGolemHp !== 0) failures.push(`${name}: shield crash should trigger on the second attack and add current shield damage against sturdy enemies, got hp ${traits.shieldCrashGolemHp}`);
  }
  if (name === "panel-toggle") {
    const panel = metrics.panelToggle || {};
    if (!panel.infoOpened || !panel.infoClosed) failures.push(`${name}: info button should open then close the info panel`);
    if (!panel.configOpened || !panel.configClosed) failures.push(`${name}: API button should open then close the config panel`);
  }
  if (name === "monster-bestiary") {
    const bestiary = metrics.bestiary || {};
    if (bestiary.activeInfoTab !== "bestiary") failures.push(`${name}: bestiary tab should be active, got ${JSON.stringify(bestiary)}`);
    if ((bestiary.normalCount || 0) < 12) failures.push(`${name}: normal pagination should include all normal monsters, got ${JSON.stringify(bestiary)}`);
    if (bestiary.bossCount !== 7) failures.push(`${name}: boss pagination should include seven bosses, got ${JSON.stringify(bestiary)}`);
    if (bestiary.npcCount !== 4 || bestiary.npcGroupCount !== 1) failures.push(`${name}: npc bestiary should be a separate paged group with four NPCs, got ${JSON.stringify(bestiary)}`);
    if ((bestiary.affixCount || 0) < 10 || bestiary.affixGroupCount !== 1) failures.push(`${name}: affix bestiary should be a separate paged group, got ${JSON.stringify(bestiary)}`);
    if (bestiary.hiddenGroupCount !== 0 || bestiary.hiddenCount !== 0) {
      failures.push(`${name}: hidden layers should not be a separate bestiary group, got ${JSON.stringify(bestiary)}`);
    }
    if (!bestiary.bossKeys?.includes("demon") || !bestiary.bossKeys?.includes("archmage")) failures.push(`${name}: boss pagination should include final and reward bosses, got ${JSON.stringify(bestiary)}`);
    if (bestiary.initial?.group !== "normal" || !bestiary.initial?.monsterKeys?.includes("slime") || (bestiary.initial?.cardCount || 0) < 2 || bestiary.initial?.pageText !== `1 / ${bestiary.normalPages}`) {
      failures.push(`${name}: bestiary should start on a compact normal monster page with multiple cards, got ${JSON.stringify(bestiary)}`);
    }
    if (bestiary.initialAffixCardCount !== 0) {
      failures.push(`${name}: affix cards should not be appended below the monster page, got ${JSON.stringify(bestiary)}`);
    }
    if (bestiary.statValueFontSize > 13.5) {
      failures.push(`${name}: bestiary stat value font should stay compact, got ${JSON.stringify(bestiary)}`);
    }
    if (bestiary.afterNormalNext?.group !== "normal" || bestiary.afterNormalNext?.pageText !== `2 / ${bestiary.normalPages}` || JSON.stringify(bestiary.afterNormalNext?.monsterKeys) === JSON.stringify(bestiary.initial?.monsterKeys)) {
      failures.push(`${name}: normal next page should advance to a different multi-card page, got ${JSON.stringify(bestiary)}`);
    }
    for (const [pageName, pageState] of Object.entries({ initial: bestiary.initial, boss: bestiary.bossStart, npc: bestiary.npcStart, affix: bestiary.affixStart })) {
      if ((pageState?.truncationCount || 0) > 0) failures.push(`${name}: ${pageName} bestiary page should not use ellipsis/clamped text, got ${JSON.stringify(pageState)}`);
    }
    if (bestiary.bossStart?.group !== "boss" || !bestiary.bossStart?.monsterKeys?.includes("skeletonCaptain") || (bestiary.bossStart?.cardCount || 0) < 2 || bestiary.bossStart?.pageText !== `1 / ${bestiary.bossPages}`) {
      failures.push(`${name}: boss group should start on a compact boss page, got ${JSON.stringify(bestiary)}`);
    }
    if (bestiary.bossFinal?.group !== "boss" || !bestiary.bossFinal?.monsterKeys?.includes("demon") || bestiary.bossFinal?.pageText !== `${bestiary.bossPages} / ${bestiary.bossPages}`) {
      failures.push(`${name}: boss pagination should reach a final page containing demon, got ${JSON.stringify(bestiary)}`);
    }
    if (!bestiary.hasDetailPortrait) failures.push(`${name}: selected monster detail should show portrait, got ${JSON.stringify(bestiary)}`);
    if (!/魔王/.test(bestiary.detailText || "") || !/第40层塔顶魔王/.test(bestiary.detailText || "") || !/晋升/.test(bestiary.detailText || "")) {
      failures.push(`${name}: demon detail should show name, floor pattern, and trait detail, got ${JSON.stringify(bestiary)}`);
    }
    if (bestiary.affixStart?.group !== "affix" || (bestiary.affixStart?.affixCardCount || 0) < 2 || !/属性与词条/.test(bestiary.affixDetailText || "") || !/生命上限/.test(bestiary.affixDetailText || "") || !/攻击/.test(bestiary.affixDetailText || "") || !/防御/.test(bestiary.affixDetailText || "") || !/每点/.test(bestiary.affixDetailText || "")) {
      failures.push(`${name}: affix group should start with compact base stat cards, got ${JSON.stringify(bestiary)}`);
    }
    if (/时机|收益|战中|看装备在战斗/.test(bestiary.affixDetailText || "")) {
      failures.push(`${name}: affix group should not use split manual labels or awkward copy, got ${JSON.stringify(bestiary)}`);
    }
    if (bestiary.npcStart?.group !== "npc" || (bestiary.npcStart?.npcCardCount || 0) !== 4 || !bestiary.npcStart?.npcKeys?.includes("elder") || !bestiary.npcStart?.npcKeys?.includes("princess") || !bestiary.npcHasPortrait) {
      failures.push(`${name}: npc group should show all rescue NPC cards with portraits, got ${JSON.stringify(bestiary)}`);
    }
    if (!/老人/.test(bestiary.npcDetailText || "") || !/出没/.test(bestiary.npcDetailText || "") || !/奖励/.test(bestiary.npcDetailText || "") || /暗门触发怪|随机选中|非最弱位/.test(bestiary.npcDetailText || "")) {
      failures.push(`${name}: npc bestiary should show NPC appearance/reward without hidden-trigger mechanics, got ${JSON.stringify(bestiary)}`);
    }
    if (!/普通怪/.test(bestiary.groupText || "") || !/Boss/.test(bestiary.groupText || "") || !/NPC/.test(bestiary.groupText || "") || !/属性/.test(bestiary.groupText || "") || /隐藏/.test(bestiary.groupText || "")) {
      failures.push(`${name}: bestiary groups should show normal, Boss, NPC, and affix only, got ${JSON.stringify(bestiary)}`);
    }
  }
  if (name === "hidden-layers") {
    const hidden = metrics.hiddenLayers || {};
    if (!hidden.triggersValid) failures.push(`${name}: hidden triggers should avoid first four floors, boss floors, and slot 0, got ${JSON.stringify(hidden.triggers)}`);
    if (hidden.hidden1?.floorText !== "隐藏1 · 老人" || hidden.hidden1?.enemyCount !== 3 || hidden.hidden1?.npcCount !== 1 || hidden.hidden1?.combatCount !== 2) {
      failures.push(`${name}: hidden1 should render two guards and one noncombat elder, got ${JSON.stringify(hidden.hidden1)}`);
    }
    if (
      !/老人/.test(hidden.hidden1?.npcCardText || "")
      || !/待解救/.test(hidden.hidden1?.npcCardText || "")
      || !/奖励/.test(hidden.hidden1?.npcCardText || "")
      || !/形态经验\s*\+2/.test(hidden.hidden1?.npcCardText || "")
      || /不参与战斗|中间卡牌|被困老人|解救老人后/.test(hidden.hidden1?.npcCardText || "")
    ) {
      failures.push(`${name}: hidden NPC card should only show name, rescue status, and reward, got ${JSON.stringify(hidden.hidden1)}`);
    }
    if (hidden.hidden1?.npcCardHeight > hidden.hidden1?.maxGuardCardHeight + 8) {
      failures.push(`${name}: hidden NPC card height should stay aligned with guard cards, got ${JSON.stringify(hidden.hidden1)}`);
    }
    if (hidden.hidden1?.beforeAllSelectedText !== "全部选择" || hidden.hidden1?.afterAllSelectedText !== "解救") {
      failures.push(`${name}: hidden battle button should require all three selected cards, got ${JSON.stringify(hidden.hidden1)}`);
    }
    if (!hidden.hidden1Timeout?.resolved || hidden.hidden1Timeout?.rescued || hidden.hidden1Timeout?.returnFloor !== 10 || hidden.hidden1Timeout?.result !== "enemy-fled" || !/解救失败/.test(hidden.hidden1Timeout?.summary || "")) {
      failures.push(`${name}: hidden timeout should return to the queued floor and mark rescue failed, got ${JSON.stringify(hidden.hidden1Timeout)}`);
    }
    if (!hidden.hidden3Reward?.rescued || hidden.hidden3Reward?.atkDelta !== 1 || hidden.hidden3Reward?.defDelta !== 1 || hidden.hidden3Reward?.speedDelta !== 1 || hidden.hidden3Reward?.returnFloor !== 22) {
      failures.push(`${name}: hidden3 rescue should grant gem stats and return to the queued floor, got ${JSON.stringify(hidden.hidden3Reward)}`);
    }
    if (!hidden.hidden4Reward?.trueEnding || hidden.hidden4Reward?.hpAfter !== hidden.hidden4Reward?.maxHpAfter) {
      failures.push(`${name}: hidden4 rescue should full heal and unlock true ending, got ${JSON.stringify(hidden.hidden4Reward)}`);
    }
  }
  if (name === "api-config") {
    const api = metrics.apiConfig || {};
    if (api.visiblePresets?.join(",") !== "experience,siliconflow,xiaomi,zhipu,micu,custom") failures.push(`${name}: visible preset order should be Experience, SiliconFlow, Xiaomi, Zhipu, Micu, Custom, got ${JSON.stringify(api)}`);
    if (api.visiblePresetLabels?.join(",") !== "体验,硅基流动,小米,智谱,米醋,自定义") failures.push(`${name}: visible preset labels changed unexpectedly, got ${JSON.stringify(api)}`);
    if (api.defaultPreset !== "experience") failures.push(`${name}: default preset should be experience, got ${JSON.stringify(api)}`);
    if (api.defaultModel !== "Qwen/Qwen3.5-35B-A3B") failures.push(`${name}: default experience model changed unexpectedly, got ${JSON.stringify(api)}`);
    if (!/\/api\/experience$|workers\.dev$/.test(api.defaultBaseUrl || "")) failures.push(`${name}: default base URL should use the experience proxy, got ${JSON.stringify(api)}`);
    if (!api.defaultKeyLocked || !api.defaultToggleHidden || !api.defaultModelDisabled || !api.defaultHasMaskedKey) failures.push(`${name}: experience preset should lock and mask key/model controls, got ${JSON.stringify(api)}`);
    if (!api.defaultConfigPanelExperience || !api.defaultConfigGridHidden || api.defaultBaseUrlVisible || api.defaultModelVisible || api.defaultApiKeyVisible || api.defaultSaveVisible) {
      failures.push(`${name}: experience preset should hide URL/model/key/save controls, got ${JSON.stringify(api)}`);
    }
    if (!api.defaultReady) failures.push(`${name}: experience preset should be ready without player key, got ${JSON.stringify(api)}`);
    if (api.defaultStoredKey) failures.push(`${name}: experience preset should not store an API key, got ${JSON.stringify(api)}`);
    if (api.afterToggleType !== "password" || api.afterToggleValue !== api.defaultKeyValue) failures.push(`${name}: hidden key toggle should not reveal the experience key mask, got ${JSON.stringify(api)}`);
    if (!api.defaultExperienceRequestSeen || api.defaultExperienceUsesAuthorizationHeader || !api.defaultExperienceBodyHasImage) {
      failures.push(`${name}: experience browser request should use proxy without Authorization and include an image, got ${JSON.stringify(api)}`);
    }
    if (api.xiaomiPreset !== "xiaomi" || api.xiaomiBaseUrl !== "https://api.xiaomimimo.com/v1") failures.push(`${name}: Xiaomi preset should use the requested base URL, got ${JSON.stringify(api)}`);
    if (api.xiaomiConfigPanelExperience || api.xiaomiConfigGridHidden || !api.xiaomiBaseUrlVisible || !api.xiaomiModelVisible || !api.xiaomiApiKeyVisible || !api.xiaomiSaveVisible) {
      failures.push(`${name}: non-experience presets should show URL/model/key/save controls, got ${JSON.stringify(api)}`);
    }
    if (api.xiaomiModel !== "mimo-v2.5") failures.push(`${name}: Xiaomi preset should default to mimo-v2.5, got ${JSON.stringify(api)}`);
    if (api.xiaomiModelOptions?.join(",") !== "mimo-v2.5,mimo-v2-omni") failures.push(`${name}: Xiaomi model dropdown should contain only supported vision models, got ${JSON.stringify(api)}`);
    if (!/mimo-v2\.5-pro/.test(api.xiaomiNote || "")) failures.push(`${name}: Xiaomi note should explain mimo-v2.5-pro is not a vision model, got ${JSON.stringify(api)}`);
    if (!api.xiaomiLinksText?.includes("小米邀请链接") || !api.xiaomiLinksText?.includes("小米文档")) failures.push(`${name}: Xiaomi preset should show invite and docs links, got ${JSON.stringify(api)}`);
    if (!api.xiaomiUsesApiKeyHeader || api.xiaomiUsesAuthorizationHeader) failures.push(`${name}: Xiaomi requests should use api-key header instead of Authorization, got ${JSON.stringify(api)}`);
    if (api.xiaomiFirstContentType !== "image_url" || api.xiaomiSecondContentType !== "text") failures.push(`${name}: Xiaomi vision request should send image before text, got ${JSON.stringify(api)}`);
    if (!api.xiaomiThinkingDisabled || api.xiaomiHasMaxTokens || !api.xiaomiHasMaxCompletionTokens) failures.push(`${name}: Xiaomi body should disable thinking and use max_completion_tokens, got ${JSON.stringify(api)}`);
    if (!/图文模型测试成功/.test(api.xiaomiTestResult || "")) failures.push(`${name}: Xiaomi test result formatter should accept a valid image response, got ${JSON.stringify(api)}`);
    if (!api.afterCustomEditable || api.customToggleVisible === false) failures.push(`${name}: custom mode should restore editable key controls, got ${JSON.stringify(api)}`);
    if (api.customKeyType !== "text" || api.customKeyValue !== "sk-test-visible") failures.push(`${name}: custom key should remain viewable when user asks to show it, got ${JSON.stringify(api)}`);
    if (api.customStoredKey !== "sk-test-visible") failures.push(`${name}: custom key should still persist normally, got ${JSON.stringify(api)}`);
  }
  if (name === "mobile-boss-selection") {
    if (metrics.visibleButtons.includes("逃跑")) failures.push(`${name}: boss floor still shows 逃跑`);
    if (!metrics.visibleButtons.includes("选择怪物")) failures.push(`${name}: boss floor should require selecting all monsters`);
    const enemies = metrics.state.enemies || [];
    if (enemies.length !== 1 || enemies[0].typeKey !== "knightCaptain") {
      failures.push(`${name}: floor 30 should preview one wide knight captain card, got ${JSON.stringify(enemies.map((enemy) => enemy.typeKey))}`);
    }
    if (enemies[0]?.drop !== "胶卷 0.3") {
      failures.push(`${name}: floor 30 preview should show boss drop 胶卷 0.3, got ${enemies[0]?.drop}`);
    }
  }
  if (name === "mobile-boss-retreat") {
    const bossRetreat = metrics.bossRetreat || {};
    const summon = metrics.knightCaptainSummon || {};
    if (summon.inBattleTypes?.join(",") !== "guard,knightCaptain,guard") {
      failures.push(`${name}: knight captain should summon visual guard/captain/guard cards, got ${JSON.stringify(summon.inBattleTypes)}`);
    }
    if (summon.inBattleOrders?.join(",") !== "1,3,2") {
      failures.push(`${name}: knight captain battle order should display 1,3,2, got ${JSON.stringify(summon.inBattleOrders)}`);
    }
    if (summon.activeOrderTypes?.join(",") !== "guard,guard,knightCaptain") {
      failures.push(`${name}: knight captain attack order should be left guard, right guard, captain, got ${JSON.stringify(summon.activeOrderTypes)}`);
    }
    if (summon.summonedDrops?.join(",") !== "胶卷 0.0,胶卷 0.3,胶卷 0.0") {
      failures.push(`${name}: summoned guards should have base 胶卷 0.0 and captain should keep 胶卷 0.3, got ${JSON.stringify(summon.summonedDrops)}`);
    }
    if (summon.greedySummonedDrops?.join(",") !== "胶卷 0.1,胶卷 0.4,胶卷 0.1") {
      failures.push(`${name}: greedy form should add +0.1 film to summoned guards and captain, got ${JSON.stringify(summon.greedySummonedDrops)}`);
    }
    if (!bossRetreat.inBattleRetreatVisible) failures.push(`${name}: boss battle should show retreat after battle starts`);
    if (bossRetreat.afterFloor !== 30 || bossRetreat.afterBattleActive) failures.push(`${name}: boss retreat should restore pre-battle boss floor, got ${JSON.stringify(bossRetreat)}`);
    if (bossRetreat.afterHp !== bossRetreat.beforeHp || bossRetreat.afterShield !== bossRetreat.beforeShield) failures.push(`${name}: boss retreat should restore hero HP/shield, got ${JSON.stringify(bossRetreat)}`);
    if (bossRetreat.enemyHpChanged) failures.push(`${name}: boss retreat should restore enemy HP, got ${JSON.stringify(bossRetreat)}`);
    if (bossRetreat.afterRetreatVisible) failures.push(`${name}: boss pre-battle state should not show retreat after retreat`);
    if (bossRetreat.afterTypes?.join(",") !== "knightCaptain") {
      failures.push(`${name}: boss retreat should restore a single knight captain card, got ${JSON.stringify(bossRetreat.afterTypes)}`);
    }
  }
  if (name === "mobile-reward-boss-retreat") {
    const bossRetreat = metrics.bossRetreat || {};
    if (!bossRetreat.inBattleRetreatVisible) failures.push(`${name}: reward boss battle should show retreat after battle starts`);
    if (bossRetreat.afterFloor !== 25 || bossRetreat.afterBattleActive) failures.push(`${name}: reward boss retreat should restore pre-battle reward boss floor, got ${JSON.stringify(bossRetreat)}`);
    if (bossRetreat.afterRetreatVisible) failures.push(`${name}: reward boss pre-battle state should not show retreat after retreat`);
  }
  if (name === "mobile-info") {
    if (metrics.activeInfoTab !== "about") failures.push(`${name}: info panel should open on outside/trail tab`);
    if (!metrics.visibleButtons.includes("塔外")) failures.push(`${name}: missing outside tab`);
    if (!metrics.visibleButtons.includes("冒险手册") || metrics.visibleButtons.includes("游戏信息")) failures.push(`${name}: top info button should be 冒险手册, got ${JSON.stringify(metrics.visibleButtons)}`);
    if (!metrics.visibleButtons.includes("拍照/画图")) failures.push(`${name}: missing photo/drawing tab`);
    if (!metrics.visibleButtons.includes("战斗")) failures.push(`${name}: missing battle tab`);
    if (!/勇者足迹/.test(metrics.infoText)) failures.push(`${name}: missing player-facing global stats title`);
    if (metrics.infoCards?.hasHeaderTitle) failures.push(`${name}: info panel should not keep a separate 冒险手册 header row, got ${JSON.stringify(metrics.infoCards)}`);
    if (metrics.infoCards?.photoSelectedIndex !== 1 || metrics.infoCards?.battleSelectedIndex !== 2) failures.push(`${name}: clicked photo/battle info cards should become selected, got ${JSON.stringify(metrics.infoCards)}`);
    if (metrics.infoCards?.photoSelectedCount !== 1 || metrics.infoCards?.battleSelectedCount !== 1) failures.push(`${name}: exactly one selectable card per info page should be active, got ${JSON.stringify(metrics.infoCards)}`);
    if (!metrics.infoCards?.photoCardsClickable || !metrics.infoCards?.battleCardsClickable) failures.push(`${name}: photo/battle info cards should be keyboard/click selectable, got ${JSON.stringify(metrics.infoCards)}`);
    if (!/另一段冒险/.test(metrics.infoText)) failures.push(`${name}: missing other games block`);
    const manualPlayerPages = metrics.playerManualText || "";
    if (/素材来源|魔塔50层|抹茶旦旦/.test(manualPlayerPages)) failures.push(`${name}: material source copy should stay out of the in-game manual, got ${manualPlayerPages}`);
    if (/\bAI\b|API(?:\s*Key)?|接口|模型名|图文模型|开发者|说明书|教程/.test(manualPlayerPages)) failures.push(`${name}: player manual should avoid developer/API/manual wording, got ${manualPlayerPages}`);
    for (const label of ["访问", "访客", "游玩", "通关", "击杀", "击杀Boss", "鉴定", "照片装备", "画图装备", "超级形态", "爬塔层数"]) {
      if (!metrics.statLabels.includes(label)) failures.push(`${name}: missing stat label ${label}`);
    }
    if (!metrics.groupQr.loaded || !metrics.groupQr.src.includes("xiaohongshu-group-qr.jpg")) failures.push(`${name}: Xiaohongshu QR image did not load`);
    if (!metrics.groupQr.square) failures.push(`${name}: Xiaohongshu QR image should be square`);
    if (metrics.groupQr.text !== "加入塔外营地") failures.push(`${name}: Xiaohongshu QR copy should be 加入塔外营地`);
    if (!/项目页查看更新记录/.test(metrics.groupQr.projectSocialText || "")) failures.push(`${name}: missing compact project link copy`);
    if (!/交流帖分享你的装备/.test(metrics.groupQr.projectSocialText || "")) failures.push(`${name}: missing compact Xiaohongshu post copy`);
    if (/github\.com\/kw66\/photo-hero|打开帖子|小红书帖子|求个|求点赞|作者\/统计|全站统计/.test(metrics.groupQr.linksText || "")) failures.push(`${name}: author block still exposes old/manual link text`);
    if (!metrics.groupQr.projectSocialLinks?.some((link) => link.text === "项目页查看更新记录" && link.href.includes("github.com/kw66/photo-hero"))) failures.push(`${name}: project label should link to GitHub`);
    if (!metrics.groupQr.projectSocialLinks?.some((link) => link.text === "交流帖分享你的装备" && link.href.includes("xhslink.com/o/17XFWimxM94"))) failures.push(`${name}: Xiaohongshu label should link to post`);
    if (!metrics.groupQr.rightSide) failures.push(`${name}: Xiaohongshu QR should sit on the right side of author block`);
    if (metrics.statLabels.includes("装备")) failures.push(`${name}: old generic equipment stat label should be split into photo/drawing equipment`);
    if (metrics.statCardCount !== 11) failures.push(`${name}: expected 11 global stat cards, got ${metrics.statCardCount}`);
    if (metrics.todayStatCount !== 11) failures.push(`${name}: expected 11 today stat labels, got ${metrics.todayStatCount}`);
    const globalStats = metrics.globalStats || {};
    if (globalStats.photoEquipmentTotalKey !== "photo_hero_appraisals_total" || globalStats.photoEquipmentDailyPrefix !== "photo_hero_appraisals_day") {
      failures.push(`${name}: photo equipment stat should preserve old successful-equipment counters, got ${JSON.stringify(globalStats)}`);
    }
    if (globalStats.legacyEquipmentTotalKey !== globalStats.photoEquipmentTotalKey || globalStats.legacyEquipmentDailyPrefix !== globalStats.photoEquipmentDailyPrefix) {
      failures.push(`${name}: legacy equipment counter aliases should still point at photo equipment counters, got ${JSON.stringify(globalStats)}`);
    }
    if (globalStats.drawingEquipmentTotalKey !== "photo_hero_drawing_equipment_total" || globalStats.drawingEquipmentDailyPrefix !== "photo_hero_drawing_equipment_day") {
      failures.push(`${name}: drawing equipment stat should use drawing equipment counters, got ${JSON.stringify(globalStats)}`);
    }
    if (globalStats.superFormsTotalKey !== "photo_hero_super_forms_total" || globalStats.superFormsDailyPrefix !== "photo_hero_super_forms_day") {
      failures.push(`${name}: super form stat should use super form counters, got ${JSON.stringify(globalStats)}`);
    }
    if (globalStats.bossKillsTotalKey !== "photo_hero_boss_kills_total" || globalStats.bossKillsDailyPrefix !== "photo_hero_boss_kills_day") {
      failures.push(`${name}: boss kill stat should use boss kill counters, got ${JSON.stringify(globalStats)}`);
    }
    if (globalStats.appraisalTotalKey !== "photo_hero_appraisal_players_total" || globalStats.appraisalDailyPrefix !== "photo_hero_appraisal_players_day") {
      failures.push(`${name}: appraisal stat should use unique player counters, got ${JSON.stringify(globalStats)}`);
    }
    if (!globalStats.photoEquipmentMetricOk || globalStats.photoEquipmentIncrementCount !== 4) {
      failures.push(`${name}: photo equipment metric should increment old total and daily counters once per photo equipment, got ${JSON.stringify(globalStats)}`);
    }
    if (!globalStats.drawingEquipmentMetricOk || globalStats.drawingEquipmentIncrementCount !== 2) {
      failures.push(`${name}: drawing equipment metric should increment total and daily once, got ${JSON.stringify(globalStats)}`);
    }
    if (!globalStats.superFormsMetricOk || globalStats.superFormsIncrementCount !== 2) {
      failures.push(`${name}: super form metric should increment total and daily once, got ${JSON.stringify(globalStats)}`);
    }
    if (!globalStats.bossKillsMetricOk || globalStats.bossKillsIncrementCount !== 4) {
      failures.push(`${name}: boss kill metric should increment total and daily per boss kill, got ${JSON.stringify(globalStats)}`);
    }
    if (!globalStats.firstAppraisal?.totalRecorded || !globalStats.firstAppraisal?.dailyRecorded || globalStats.firstAppraisal?.skipped) {
      failures.push(`${name}: first successful appraisal should count this browser, got ${JSON.stringify(globalStats.firstAppraisal)}`);
    }
    if (!globalStats.secondAppraisal?.skipped || globalStats.secondAppraisal?.totalRecorded || globalStats.secondAppraisal?.dailyRecorded) {
      failures.push(`${name}: repeated successful appraisal in the same browser should not count again, got ${JSON.stringify(globalStats.secondAppraisal)}`);
    }
    if (globalStats.appraisalIncrementCount !== 2) {
      failures.push(`${name}: unique appraisal should increment only total and daily once, got ${JSON.stringify(globalStats)}`);
    }
  }
  if (name === "mobile-form-economy") {
    const formChecks = metrics.formEconomy || {};
    if (formChecks.shield !== 15) failures.push(`${name}: mega shield should add 15 shield`);
    if (formChecks.shieldAvatar?.dataFormKey !== "shield") {
      failures.push(`${name}: main avatar card should expose shield form key, got ${JSON.stringify(formChecks.shieldAvatar)}`);
    }
    if (formChecks.shieldAvatar?.objectPosition !== "50% 50%") {
      failures.push(`${name}: main shield avatar should be vertically centered, got ${JSON.stringify(formChecks.shieldAvatar)}`);
    }
    if (
      !formChecks.shieldAvatar
      || formChecks.shieldAvatar.centerFromCardTop < 38
      || formChecks.shieldAvatar.centerFromCardTop > 48
      || formChecks.shieldAvatar.bottomGapToLabel < 12
    ) {
      failures.push(`${name}: main shield avatar should sit near the other forms without touching the label, got ${JSON.stringify(formChecks.shieldAvatar)}`);
    }
    if (formChecks.lifesteal?.lifesteal !== 4 || formChecks.lifesteal?.def !== -1) {
      failures.push(`${name}: mega lifesteal should be lifesteal +4 and defense -2 from base, got ${JSON.stringify(formChecks.lifesteal)}`);
    }
    if (formChecks.regenShield?.shieldAfterHit !== formChecks.regenShield?.maxShield) {
      failures.push(`${name}: mega regen should restore shield after a hit, got ${JSON.stringify(formChecks.regenShield)}`);
    }
    if (formChecks.hpKill?.maxHp !== 93 || formChecks.hpKill?.hp !== 56) {
      failures.push(`${name}: mega HP kill should add max HP +3 and heal 6 in battle, got ${JSON.stringify(formChecks.hpKill)}`);
    }
    if (!/每击杀1怪，生命上限\+3且生命\+6/.test(formChecks.hpEffectText || "") || /每击杀1怪生命上限\s*\+3/.test(formChecks.hpEffectText || "") || /每击杀1怪生命\s*\+6/.test(formChecks.hpEffectText || "")) {
      failures.push(`${name}: mega HP form should combine max-HP and heal-on-kill copy into one line, got ${JSON.stringify(formChecks.hpEffectText)}`);
    }
    if (/经验/.test(formChecks.hpMetaText || "")) {
      failures.push(`${name}: evolved HP form card should not show experience progress, got ${JSON.stringify(formChecks.hpMetaText)}`);
    }
    if (formChecks.hpShared?.defenseMaxHp !== 50 || formChecks.hpShared?.afterKillDefenseMaxHp !== 53 || formChecks.hpShared?.afterKillDefenseHp !== 16) {
      failures.push(`${name}: mega HP form bonus should not be shared, but kill max HP should persist across forms, got ${JSON.stringify(formChecks.hpShared)}`);
    }
    if (formChecks.hpSwitch?.attackHp !== 30 || formChecks.hpSwitch?.backHp !== 60 || formChecks.hpSwitch?.lowForm !== "hp" || formChecks.hpSwitch?.lowHp !== 20 || formChecks.hpSwitch?.megaAttackHp !== 30 || formChecks.hpSwitch?.megaBackHp !== 70 || formChecks.hpSwitch?.megaLowForm !== "hp") {
      failures.push(`${name}: switching away from HP form should preserve missing HP and block lethal max-HP loss, got ${JSON.stringify(formChecks.hpSwitch)}`);
    }
    if (formChecks.speedPreStrike?.hp !== 5 || formChecks.speedPreStrike?.attackBonus !== 0 || formChecks.speedPreStrike?.hpAfter !== 51 || formChecks.speedPreStrike?.heroClock === Infinity) {
      failures.push(`${name}: mega speed pre-strike should not trigger cooldown skills before clock setup, got ${JSON.stringify(formChecks.speedPreStrike)}`);
    }
    if (formChecks.greedyDropBonus !== 0.1) failures.push(`${name}: mega greedy should keep film drop +0.1`);
    const visibleLabels = formChecks.visibleFormLabels || {};
    const visibleLabelList = [visibleLabels.header || "", ...(visibleLabels.cards || [])];
    if (visibleLabels.header !== "\u8d85\u7ea7\u8d22\u8ff7") {
      failures.push(`${name}: evolved hero label should use 超级 instead of mega, got ${visibleLabels.header}`);
    }
    if (/经验/.test(formChecks.greedyMetaText || "")) {
      failures.push(`${name}: evolved greedy form card should not show experience progress, got ${JSON.stringify(formChecks.greedyMetaText)}`);
    }
    if (!visibleLabelList.includes("\u8d85\u7ea7\u8d22\u8ff7")) {
      failures.push(`${name}: form chooser should show 超级财迷 for evolved greedy form, got ${JSON.stringify(visibleLabelList)}`);
    }
    if (visibleLabelList.some((label) => /mega/i.test(label))) {
      failures.push(`${name}: visible form labels should not contain mega, got ${JSON.stringify(visibleLabelList)}`);
    }
    const expected = {
      "0.9": { atk: 4, def: 1, speed: 2 },
      "1.0": { atk: 5, def: 1, speed: 2 },
      "2.0": { atk: 5, def: 2, speed: 2 },
      "3.0": { atk: 5, def: 2, speed: 3 },
      "4.0": { atk: 6, def: 2, speed: 3 },
    };
    for (const [film, stats] of Object.entries(expected)) {
      const actual = formChecks.greedyStatsByFilm?.[film];
      if (!actual || actual.atk !== stats.atk || actual.def !== stats.def || actual.speed !== stats.speed) {
        failures.push(`${name}: greedy stats at ${film} film expected ${JSON.stringify(stats)}, got ${JSON.stringify(actual)}`);
      }
    }
    const badgeKey = (entry) => `${entry.stat}:${entry.text}`;
    const attackBadges = (formChecks.formBattleBadges?.attack?.badges || []).map(badgeKey);
    if (!attackBadges.includes("attack:+3") || !attackBadges.includes("defense:-1")) {
      failures.push(`${name}: attack form battle avatar should show attack gain and defense loss, got ${JSON.stringify(formChecks.formBattleBadges?.attack)}`);
    }
    const angryBadges = (formChecks.formBattleBadges?.angry?.badges || []).map(badgeKey);
    if (!angryBadges.includes("attack:+5") || !angryBadges.includes("defense:+5")) {
      failures.push(`${name}: angry form battle avatar should show both red attack and blue defense gains, got ${JSON.stringify(formChecks.formBattleBadges?.angry)}`);
    }
    const greedyBadges = (formChecks.formBattleBadges?.greedy?.badges || []).map(badgeKey);
    if (!greedyBadges.includes("attack:+1") || !greedyBadges.includes("defense:+1") || !greedyBadges.includes("speed:+1")) {
      failures.push(`${name}: greedy form battle avatar should show carried-film attack/defense/speed gains, got ${JSON.stringify(formChecks.formBattleBadges?.greedy)}`);
    }
    for (const [formId, state] of Object.entries(formChecks.formBattleBadges || {})) {
      if (!state?.rightAligned || !state?.topStacked) {
        failures.push(`${name}: ${formId} form battle badges should stack on the avatar's far right, got ${JSON.stringify(state)}`);
      }
    }
  }
  return failures;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const desktop = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  await stubStatsApi(mobile);
  await stubStatsApi(desktop);

  const scenarios = {};
  scenarios.mobileFresh = await collectScenario(mobile, "mobile-fresh");
  scenarios.desktopFresh = await collectScenario(desktop, "desktop-fresh");

  scenarios.introFlow = await collectScenario(desktop, "intro-flow", async (page) => {
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewIntroFlow = {
        initialFloor: state.floor,
        initialBgm: state.audio?.bgmKey || "",
        enterEnabledBeforeAll: !document.querySelector("#attackBtn")?.disabled,
        primaryTextBeforeAll: document.querySelector("#attackBtn")?.textContent?.trim() || "",
        promptBeforeAll: Boolean(document.querySelector("#attackBtn")?.classList.contains("is-choice-prompt")),
        selectedCount: state.introRewardSelectedIds?.length || 0,
      };
    });
    await page.locator(".intro-reward-card").nth(0).click();
    await page.locator(".intro-reward-card").nth(1).click();
    await page.locator(".intro-reward-card").nth(2).click();
    await page.locator(".intro-reward-card").nth(1).click();
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      const button = document.querySelector("#attackBtn");
      return (state.introRewardSelectedIds || []).length === 2
        && button?.textContent?.trim() === "全部选择"
        && button?.classList.contains("is-choice-prompt")
        && !button?.disabled;
    }, null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      const cards = Array.from(document.querySelectorAll(".intro-reward-card"));
      const heights = cards.map((card) => Math.round(card.getBoundingClientRect().height));
      window.__reviewIntroFlow = {
        ...window.__reviewIntroFlow,
        afterCancelCount: state.introRewardSelectedIds?.length || 0,
        enterEnabledAfterCancel: !document.querySelector("#attackBtn")?.disabled,
        primaryTextAfterCancel: document.querySelector("#attackBtn")?.textContent?.trim() || "",
        promptAfterCancel: Boolean(document.querySelector("#attackBtn")?.classList.contains("is-choice-prompt")),
        reorderedBadges: cards.map((card) => card.querySelector(".selection-badge")?.textContent?.trim() || "").filter(Boolean),
        equalCardHeights: new Set(heights).size === 1,
        cardHeights: heights,
      };
    });
    await page.locator(".intro-reward-card").nth(1).click();
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      const button = document.querySelector("#attackBtn");
      return (state.introRewardSelectedIds || []).length === 3
        && button?.textContent?.trim() === "进入魔塔"
        && !button?.classList.contains("is-choice-prompt")
        && !button?.disabled;
    }, null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewIntroFlow = {
        ...window.__reviewIntroFlow,
        selectedCount: state.introRewardSelectedIds?.length || 0,
        enterEnabledAfterAll: !document.querySelector("#attackBtn")?.disabled,
        primaryTextAfterAll: document.querySelector("#attackBtn")?.textContent?.trim() || "",
        promptAfterAll: Boolean(document.querySelector("#attackBtn")?.classList.contains("is-choice-prompt")),
        finalBadges: Array.from(document.querySelectorAll(".intro-reward-card .selection-badge")).map((badge) => badge.textContent?.trim() || ""),
      };
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).floor === 1, null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewIntroFlow = {
        ...window.__reviewIntroFlow,
        afterFloor: state.floor,
        afterFilmCount: state.player?.filmCount,
        afterBgm: state.audio?.bgmKey || "",
        afterInfoMode: state.infoMode || "",
        afterSelectedSlotIndex: state.player?.selectedSlotIndex,
        afterPendingPhotoSlotIndex: state.pendingPhotoSlotIndex,
        afterFirstSlotSelected: Boolean(document.querySelector(".equipment-slot:nth-child(1)")?.classList.contains("is-selected")),
        afterPhotoCallout: Boolean(document.querySelector("#photoActionBtn")?.classList.contains("is-photo-callout")),
      };
    });
    await page.evaluate(() => document.querySelector("#photoActionBtn")?.click());
    await page.waitForFunction(() => !document.querySelector("#photoActionBtn")?.classList.contains("is-photo-callout"), null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewIntroFlow = {
        ...window.__reviewIntroFlow,
        photoCalloutAfterClick: Boolean(document.querySelector("#photoActionBtn")?.classList.contains("is-photo-callout")),
        photoStartedAfterClick: Boolean(state.tutorial?.photoStarted),
      };
    });
  });

  scenarios.drawingMode = await collectScenario(desktop, "drawing-mode", async (page) => {
    await page.evaluate(() => {
      window.__reviewDrawingMode = {
        initialTitle: document.querySelector("#gameModeBtn")?.textContent?.trim() || "",
        modeButtonInsideTools: document.querySelector("#gameModeBtn")?.parentElement?.classList.contains("panel-tools") || false,
        modeButtonInsideHeading: Boolean(document.querySelector("#gameModeBtn")?.closest("h2")),
        modeButtonBeforeInfo: (() => {
          const buttons = Array.from(document.querySelectorAll(".panel-tools > button"));
          const modeButton = document.querySelector("#gameModeBtn");
          const infoButton = document.querySelector("#infoToggleBtn");
          return buttons.indexOf(modeButton) >= 0 && buttons.indexOf(modeButton) < buttons.indexOf(infoButton);
        })(),
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "drawing", null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewDrawingMode = {
        ...window.__reviewDrawingMode,
        afterTitle: document.querySelector("#gameModeBtn")?.textContent?.trim() || "",
        playMode: state.playMode,
        resourceName: state.resourceName,
        introText: document.querySelector("#enemyField")?.innerText || "",
        desktopHint: document.querySelector("#desktopInputHint")?.innerText || "",
        drawingEmptyIconCount: document.querySelectorAll(".drawing-empty-icon").length,
      };
    });
    await page.locator(".intro-reward-card").nth(0).click();
    await page.locator(".intro-reward-card").nth(1).click();
    await page.locator(".intro-reward-card").nth(2).click();
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).floor === 1, null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewDrawingMode = {
        ...window.__reviewDrawingMode,
        afterFloor: state.floor,
        afterResourceCount: state.player?.filmCount,
        photoButtonText: document.querySelector("#photoActionBtn")?.textContent?.trim() || "",
      };
    });
    await page.evaluate(() => document.querySelector("#photoActionBtn")?.click());
    await page.waitForFunction(() => !document.querySelector("#drawingModal")?.hidden, null, { timeout: 3000 });
    await page.click('[data-drawing-tool="eraser"]');
    await page.click('[data-drawing-size="24"]');
    await page.evaluate(() => {
      window.__reviewDrawingMode = {
        ...window.__reviewDrawingMode,
        modalOpened: !document.querySelector("#drawingModal")?.hidden,
        canvasVisible: Boolean(document.querySelector("#drawingCanvas")?.getBoundingClientRect().width),
        eraserActive: document.querySelector('[data-drawing-tool="eraser"]')?.classList.contains("is-active") || false,
        activeSize: document.querySelector(".drawing-size.is-active")?.dataset.drawingSize || "",
      };
    });
    await page.click('[data-drawing-color="#2f7ed8"]');
    await page.evaluate(() => {
      window.__reviewDrawingMode = {
        ...window.__reviewDrawingMode,
        brushRestored: document.querySelector('[data-drawing-tool="brush"]')?.classList.contains("is-active") || false,
      };
    });
    const box = await page.locator("#drawingCanvas").boundingBox();
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.56);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.34, { steps: 4 });
    await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.58, { steps: 4 });
    await page.mouse.up();
    await page.click("#drawingUseBtn");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      return state.hasPhoto && state.pendingSourceMode === "drawing";
    }, null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewDrawingMode = {
        ...window.__reviewDrawingMode,
        pendingAfterUse: Boolean(state.hasPhoto),
        pendingSourceMode: state.pendingSourceMode,
        detailAfterUse: document.querySelector("#equipmentDetail")?.innerText || "",
      };
    });
  });

  scenarios.appraisalRetry = await collectScenario(desktop, "appraisal-retry-retains-input", async (page) => {
    let requestCount = 0;
    await page.route("https://api.siliconflow.cn/v1/chat/completions", async (route) => {
      requestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ choices: [{ message: { content: "不是 JSON" } }] }),
      });
    });
    const retainedDrawing = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%23fffaf0%22%2F%3E%3Cpath%20d%3D%22M20%2080%20L60%2025%20L100%2080%20Z%22%20fill%3D%22none%22%20stroke%3D%22%232f7ed8%22%20stroke-width%3D%2210%22%20stroke-linejoin%3D%22round%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2262%22%20r%3D%2215%22%20fill%3D%22%23d94a38%22%2F%3E%3C%2Fsvg%3E";
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "drawing", null, { timeout: 3000 });
    await page.evaluate((image) => {
      const hooks = window.__photoHeroTestHooks;
      document.querySelector('[data-preset="siliconflow"]')?.click();
      hooks.enterTowerForTest({ silent: true });
      hooks.setRunRewards({ filmRolls: 3, filmShards: 0 });
      hooks.setPendingPhotoForTest(image, { sourceMode: "drawing" });
      const keyInput = document.querySelector("#apiKeyInput");
      if (keyInput) {
        keyInput.value = "test-key";
        keyInput.dispatchEvent(new Event("input", { bubbles: true }));
        keyInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      window.__reviewAppraisalRetry = {
        filmBeforeFailure: JSON.parse(window.render_game_to_text()).player?.filmCount,
      };
    }, retainedDrawing);
    await page.click("#analyzePhotoBtn");
    await page.waitForFunction(() => {
      const hooks = window.__photoHeroTestHooks;
      return !hooks.state.analysisRequest && Boolean(hooks.state.lootError);
    }, null, { timeout: 5000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      const retryButton = document.querySelector("#analyzePhotoBtn");
      window.__reviewAppraisalRetry = {
        ...window.__reviewAppraisalRetry,
        pendingAfterFailure: Boolean(state.hasPhoto),
        pendingSourceModeAfterFailure: state.pendingSourceMode,
        filmAfterFailure: state.player?.filmCount,
        retryButtonEnabled: Boolean(retryButton && !retryButton.hidden && !retryButton.disabled),
        retryButtonText: retryButton?.textContent?.trim() || "",
        detailAfterFailure: document.querySelector("#equipmentDetail")?.innerText || "",
      };
    });
    await page.click("#analyzePhotoBtn");
    for (let i = 0; i < 30 && requestCount < 2; i += 1) {
      await page.waitForTimeout(100);
    }
    await page.waitForFunction(() => {
      const hooks = window.__photoHeroTestHooks;
      return !hooks.state.analysisRequest && Boolean(hooks.state.lootError);
    }, null, { timeout: 5000 });
    await page.evaluate((count) => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewAppraisalRetry = {
        ...window.__reviewAppraisalRetry,
        requestCountAfterRetry: count,
        pendingAfterRetry: Boolean(state.hasPhoto),
        pendingSourceModeAfterRetry: state.pendingSourceMode,
      };
    }, requestCount);
  });

  scenarios.reappraisal = await collectScenario(desktop, "reappraisal", async (page) => {
    let requestCount = 0;
    let promptHadRerollHint = false;
    let releaseReappraisalRoute = null;
    const reappraisalRouteGate = new Promise((resolve) => {
      releaseReappraisalRoute = resolve;
    });
    await page.route("https://api.siliconflow.cn/v1/chat/completions", async (route) => {
      requestCount += 1;
      const body = route.request().postDataJSON();
      const userContent = body?.messages?.find?.((message) => message.role === "user")?.content || [];
      promptHadRerollHint = JSON.stringify(userContent).includes("重鉴定") && JSON.stringify(userContent).includes("重新独立观察");
      await Promise.race([
        reappraisalRouteGate,
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          choices: [{
            message: {
              content: JSON.stringify({
                itemName: "重铸水杯",
                subjectName: "水杯",
                objectType: "杯子",
                identityDescription: "蓝色杯子，圆柱杯身，桌面近景，有真实接触阴影。",
                sizeClass: "handheld",
                isScene: false,
                isEquipable: true,
                photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 3, interesting: 2 },
                statAffinity: [{ stat: "regen", score: 3 }, { stat: "hp", score: 2 }],
                specialAffinity: [],
                description: "杯身带着温和补给感。",
                reason: "杯子主体清晰，适合作为补给装备。",
                tags: ["杯子", "容器"],
                confidence: 0.92,
              }),
            },
          }],
        }),
      });
    });
    const sourceImage = await page.evaluate(async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#efe0c8";
      ctx.fillRect(0, 0, 180, 180);
      ctx.fillStyle = "#2e74b8";
      ctx.fillRect(62, 36, 58, 88);
      ctx.fillStyle = "#1d4f8f";
      ctx.fillRect(70, 28, 42, 12);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.ellipse(91, 132, 48, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      return canvas.toDataURL("image/jpeg", 0.82);
    });
    await page.evaluate((image) => {
      const hooks = window.__photoHeroTestHooks;
      document.querySelector('[data-preset="siliconflow"]')?.click();
      hooks.enterTowerForTest({ silent: true });
      hooks.setRunRewards({ filmRolls: 2, filmShards: 0, photoValueMin: 18, photoValueMax: 26 });
      const keyInput = document.querySelector("#apiKeyInput");
      if (keyInput) {
        keyInput.value = "test-key";
        keyInput.dispatchEvent(new Event("input", { bubbles: true }));
        keyInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const oldKey = "img:oldcup";
      hooks.addRawItem({
        itemName: "旧水杯",
        subjectName: "水杯",
        objectType: "杯子",
        value: 8,
        stats: { hp: 8 },
        sourceMode: "photo",
        photoKey: oldKey,
        sourcePhotoKey: oldKey,
        image,
        fullImage: image,
        appraisalImage: image,
        identityDescription: "蓝色杯子，圆柱杯身，桌面近景，有真实接触阴影。",
        skipSpecialRoll: true,
      });
      hooks.state.selectedSlotIndex = 0;
      hooks.state.infoMode = "item";
      hooks.render();
      const inventory = hooks.getInventoryForTest();
      const selected = inventory[0] || {};
      const button = document.querySelector("#analyzePhotoBtn");
      window.__reviewReappraisal = {
        buttonText: button?.textContent?.trim() || "",
        buttonEnabled: Boolean(button && !button.hidden && !button.disabled),
        filmBefore: JSON.parse(window.render_game_to_text()).player?.filmCount,
        slotCountBefore: inventory.filter(Boolean).length,
        oldId: selected.id || "",
        oldName: selected.itemName || "",
        oldPhotoKey: selected.photoKey || "",
      };
    }, sourceImage);
    await page.click("#analyzePhotoBtn");
    await page.waitForFunction(() => {
      const hooks = window.__photoHeroTestHooks;
      const button = document.querySelector("#analyzePhotoBtn");
      return hooks.state.analysisRequest?.reappraisal
        && button?.textContent?.trim() === "取消重鉴定"
        && !button.disabled;
    }, null, { timeout: 3000 });
    const reappraisalBusyState = await page.evaluate(() => {
      const button = document.querySelector("#analyzePhotoBtn");
      return {
        text: button?.textContent?.trim() || "",
        enabled: Boolean(button && !button.hidden && !button.disabled),
      };
    });
    releaseReappraisalRoute?.();
    await page.waitForFunction(() => {
      const hooks = window.__photoHeroTestHooks;
      const inventory = hooks.getInventoryForTest();
      return !hooks.state.analysisRequest && inventory[0]?.itemName === "重铸水杯";
    }, null, { timeout: 6000 });
    await page.evaluate(({ count, promptHint, busyState }) => {
      const hooks = window.__photoHeroTestHooks;
      const state = JSON.parse(window.render_game_to_text());
      const inventory = hooks.getInventoryForTest();
      const selected = inventory[0] || {};
      window.__reviewReappraisal = {
        ...window.__reviewReappraisal,
        requestCount: count,
        promptHadRerollHint: promptHint,
        busyButtonText: busyState.text,
        busyButtonEnabled: busyState.enabled,
        filmAfter: state.player?.filmCount,
        slotCountAfter: inventory.filter(Boolean).length,
        sameSlot: state.selectedSlotIndex === 0,
        newId: selected.id || "",
        newName: selected.itemName || "",
        newPhotoKey: selected.photoKey || "",
        newSourcePhotoKey: selected.sourcePhotoKey || "",
        newPhotoKeyIsReroll: /^reroll:/i.test(selected.photoKey || "") && selected.photoKey === selected.sourcePhotoKey,
        newScore: selected.score || 0,
        rangeMin: hooks.getPhotoValueMappingForTest(15).min,
        rangeMax: hooks.getPhotoValueMappingForTest(15).max,
        duplicateByOldKey: hooks.findCurrentPhotoDuplicateForTest("img:oldcup", "img:oldcup", null),
        duplicateByNewKey: hooks.findCurrentPhotoDuplicateForTest(selected.photoKey || "", selected.sourcePhotoKey || "", null),
        reappraisedFromOld: selected.reappraisedFromId === window.__reviewReappraisal.oldId,
        reappraisedAt: selected.reappraisedAt || 0,
        detailShowsNewItem: /重铸水杯/.test(document.querySelector("#equipmentDetail")?.innerText || ""),
      };
    }, { count: requestCount, promptHint: promptHadRerollHint, busyState: reappraisalBusyState });
  });

  scenarios.modeSwitchEquivalence = await collectScenario(desktop, "mode-switch-equivalence", async (page) => {
    await page.locator(".intro-reward-card").nth(0).click();
    await page.locator(".intro-reward-card").nth(1).click();
    await page.evaluate(() => {
      window.__reviewModeSwitchEquivalence = {
        introPhotoText: document.querySelector("#enemyField")?.innerText || "",
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "drawing", null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        introDrawingText: document.querySelector("#enemyField")?.innerText || "",
        introDrawingBadges: Array.from(document.querySelectorAll(".intro-reward-card .selection-badge")).map((badge) => badge.textContent?.trim() || ""),
        drawingEmptyIcons: document.querySelectorAll(".drawing-empty-icon").length,
        cameraEmptyIconsAfterDrawing: document.querySelectorAll(".camera-empty-icon").length,
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "photo", null, { timeout: 3000 });
    await page.locator(".intro-reward-card").nth(2).click();
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).floor === 1, null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        monsterPhotoText: document.querySelector("#enemyField")?.innerText || "",
        actionAfterPhoto: document.querySelector("#photoActionBtn")?.textContent?.trim() || "",
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "drawing", null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        monsterDrawingText: document.querySelector("#enemyField")?.innerText || "",
        actionAfterDrawing: document.querySelector("#photoActionBtn")?.textContent?.trim() || "",
      };
    });
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addRawItem({
        itemName: "照片戒指",
        sourceMode: "photo",
        value: 10,
        stats: { attack: 1 },
        description: "照片装备原样保留。",
        photoKey: "mode-switch-photo-item",
        photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 1 },
      });
      hooks.addRawItem({
        itemName: "画作护符",
        sourceMode: "drawing",
        value: 10,
        stats: { defense: 1 },
        description: "画作装备原样保留。",
        photoKey: "mode-switch-drawing-item",
        photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
      });
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        itemNamesBeforeSwitch: Array.from(document.querySelectorAll(".slot-name")).map((node) => node.textContent?.trim() || "").filter(Boolean),
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "photo", null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        itemNamesAfterSwitch: Array.from(document.querySelectorAll(".slot-name")).map((node) => node.textContent?.trim() || "").filter(Boolean),
      };
    });
    await page.evaluate(() => {
      window.__photoHeroTestHooks.startBossRewardChoice(10);
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        bossPhotoText: document.querySelector("#enemyField")?.innerText || "",
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "drawing", null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__photoHeroTestHooks.state.analysisRequest = { id: "mode-switch-test" };
      window.__photoHeroTestHooks.render();
    });
    await page.evaluate(() => {
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        bossDrawingText: document.querySelector("#enemyField")?.innerText || "",
      };
    });
    await page.click("#gameModeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).playMode === "photo", null, { timeout: 3000 });
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewModeSwitchEquivalence = {
        ...window.__reviewModeSwitchEquivalence,
        analyzingSwitchAllowed: true,
        modeAfterAnalyzingSwitch: state.playMode,
      };
    });
  });

  scenarios.onboarding = await collectScenario(mobile, "onboarding", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.selectIntroRewardForTest("intro-film-1");
      hooks.selectIntroRewardForTest("intro-film-2");
      hooks.selectIntroRewardForTest("intro-film-3");
      hooks.confirmIntroRewardsForTest();
      hooks.state.infoMode = "item";
      hooks.render();
    });
    await page.evaluate(() => {
      window.__reviewOnboarding = {
        firstPhotoHint: /先拍一件身边的小物品/.test(document.querySelector("#equipmentDetail")?.innerText || ""),
        focusedEmptySlot: Boolean(document.querySelector(".equipment-slot.is-tutorial-focus")),
      };
    });
    await page.evaluate(() => document.querySelector("#photoActionBtn")?.click());
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewOnboarding.photoClickStartsTutorial = Boolean(state.tutorial?.photoStarted);
      window.__reviewOnboarding.photoCalloutAfterClick = Boolean(document.querySelector("#photoActionBtn")?.classList.contains("is-photo-callout"));
    });
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.state.tutorial.photoStarted = true;
      hooks.state.tutorial.battleHintSeen = false;
      hooks.state.infoMode = "log";
      hooks.render();
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => /点一只怪，再点战斗/.test(document.querySelector("#equipmentDetail")?.innerText || ""), null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewOnboarding.battleHintAfterAttack = /点一只怪，再点战斗/.test(document.querySelector("#equipmentDetail")?.innerText || "");
      const hooks = window.__photoHeroTestHooks;
      hooks.setEnemies([{
        id: "review-first-kill",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 1,
        hp: 1,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-first-kill"]);
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => /胶卷攒够后，可以继续拍新装备/.test(document.querySelector("#equipmentDetail")?.innerText || ""), null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewOnboarding.postKillHint = /胶卷攒够后，可以继续拍新装备/.test(document.querySelector("#equipmentDetail")?.innerText || "");
    });
  });

  scenarios.mobileReward = await collectScenario(mobile, "mobile-reward", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.startBossRewardChoice(10));
  });

  scenarios.mobileRewardBossBypass = await collectScenario(mobile, "mobile-reward-boss-bypass", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.setFloor(25));
  });

  scenarios.mobileFlee = await collectScenario(mobile, "mobile-flee", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.setFloor(1));
    await page.click("#fleeBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).floor === 2, null, { timeout: 3000 });
  });

  scenarios.mobileBattleRetreat = await collectScenario(mobile, "mobile-battle-retreat", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setEnemies([{
        id: "review-retreat",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 20,
        hp: 20,
        atk: 2,
        def: 0,
        speed: 2,
        traits: [],
      }]);
      hooks.selectEnemies(["review-retreat"]);
      window.__reviewBattleRetreatBefore = JSON.parse(window.render_game_to_text());
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      const enemy = state.enemies.find((item) => item.id === "review-retreat");
      return Boolean(state.currentBattle) || Boolean(enemy && enemy.hp < enemy.maxHp);
    }, null, { timeout: 3000 });
    await page.click("#fleeBtn");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      const before = window.__reviewBattleRetreatBefore;
      return before
        && !state.currentBattle
        && state.floor === before.floor
        && state.player.hp === before.player.hp
        && state.player.shield === before.player.shield;
    }, null, { timeout: 3000 });
  });

  scenarios.mobileDefeatedEquipment = await collectScenario(mobile, "mobile-defeated-equipment", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addRawItem({
        itemName: "旧铜短剑",
        subjectName: "旧铜短剑",
        objectType: "桌面小物",
        identityDescription: "一把旧铜色短剑摆件。",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%231d2420'/%3E%3Cpath d='M36 86L84 30' stroke='%23d09b3e' stroke-width='12'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%231d2420'/%3E%3Cpath d='M170 500L470 120' stroke='%23d09b3e' stroke-width='64'/%3E%3C/svg%3E",
        stats: { attack: 1 },
        value: 12,
        description: "旧铜短剑被塔影磨亮。",
        skipSpecialRoll: true,
      });
      hooks.addRawItem({
        itemName: "护身银牌",
        subjectName: "护身银牌",
        objectType: "桌面小物",
        identityDescription: "一枚银色护身牌。",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%231d2420'/%3E%3Ccircle cx='60' cy='60' r='35' fill='%23cfd8dc'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%231d2420'/%3E%3Ccircle cx='320' cy='320' r='220' fill='%23cfd8dc'/%3E%3C/svg%3E",
        stats: { shield: 2 },
        value: 14,
        description: "护身银牌替倒下的勇者留住最后的光。",
        skipSpecialRoll: true,
      });
      hooks.state.selectedSlotIndex = 0;
      hooks.state.selectedItemId = hooks.state.inventory[0]?.id || "";
      hooks.render();
      hooks.setHeroStats({ hp: 0 });
    });
    await page.locator(".equipment-slot.has-item").nth(1).click();
    await page.locator(".equipment-slot.has-item").nth(1).click();
    await page.evaluate(() => {
      const slots = Array.from(document.querySelectorAll(".equipment-slot"));
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewDefeatedEquipment = {
        secondSlotEnabled: !slots[1]?.disabled,
        emptySlotDisabled: Boolean(slots[2]?.disabled),
        selectedSecondItem: /护身/.test(state.player.selectedEquipment || ""),
        detailText: document.querySelector("#equipmentDetail")?.innerText || "",
        viewerOpenedOnRepeat: !document.querySelector("#imageViewer")?.hidden,
        discardDisabled: Boolean(document.querySelector("#discardItemBtn")?.disabled),
        photoDisabled: Boolean(document.querySelector("#photoActionBtn")?.disabled),
      };
      document.querySelector("#imageViewer")?.click();
    });
  });

  scenarios.mobileDefeatEnding = await collectScenario(mobile, "mobile-defeat-ending", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addRawItem({
        itemName: "裂纹护符",
        subjectName: "裂纹护符",
        objectType: "桌面小物",
        identityDescription: "一枚有裂纹的护符。",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%231d2420'/%3E%3Cpath d='M60 14L100 50L88 104H32L20 50Z' fill='%23d65b4f'/%3E%3Cpath d='M58 24L50 58L70 62L58 98' stroke='%23f6dfb4' stroke-width='8' fill='none'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%231d2420'/%3E%3Cpath d='M320 70L540 260L470 570H170L100 260Z' fill='%23d65b4f'/%3E%3Cpath d='M310 130L260 310L380 340L305 540' stroke='%23f6dfb4' stroke-width='42' fill='none'/%3E%3C/svg%3E",
        stats: { shield: 2, defense: 1 },
        value: 15,
        description: "裂纹护符在塔里替勇者挡过最后一击。",
        skipSpecialRoll: true,
      });
      hooks.setFloor(6);
      hooks.setEnemies([{
        id: "review-defeat-ending",
        testEnemy: true,
        typeKey: "skeleton",
        typeName: "骷髅",
        name: "裂骨骷髅",
        maxHp: 60,
        hp: 60,
        atk: 99,
        def: 0,
        speed: 9,
        traits: [],
      }]);
      hooks.selectEnemies(["review-defeat-ending"]);
      hooks.setHeroStats({ hp: 1, shield: 0 });
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      return state.player.hp === 0 && state.careerSummary?.outcome === "defeat";
    }, null, { timeout: 5000 });
    await page.locator(".equipment-slot.has-item").first().click();
    await page.click("#attackBtn");
    await page.waitForFunction(() => Boolean(document.querySelector(".career-card.is-defeat")), null, { timeout: 3000 });
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const slots = Array.from(document.querySelectorAll(".equipment-slot"));
      const state = JSON.parse(window.render_game_to_text());
      const image = await hooks.makeCareerSummaryImageForTest();
      window.__reviewDefeatEnding = {
        panelOutcome: document.querySelector("#equipmentDetail")?.dataset.outcome || "",
        cardIsDefeat: Boolean(document.querySelector(".career-card.is-defeat")),
        attackButtonReturnsEnding: Boolean(document.querySelector(".career-card.is-defeat")),
        occupiedSlotEnabled: !slots[0]?.disabled,
        emptySlotDisabled: Boolean(slots[1]?.disabled),
        selectedItemAfterEnding: state.player.selectedEquipment === "裂纹护符",
        textHasDefeatCopy: /战败|止步|倒在|遗落/.test(document.querySelector("#equipmentDetail")?.innerText || ""),
        textHasClearCopy: /通关|塔顶传说|第40层通关/.test(document.querySelector("#equipmentDetail")?.innerText || ""),
        canvasReady: typeof image === "string" && image.startsWith("data:image/png"),
        detailText: document.querySelector("#equipmentDetail")?.innerText || "",
      };
    });
  });

  const addPreviewItem = async (page, itemName) => {
    await page.evaluate((name) => {
      const hooks = window.__photoHeroTestHooks;
      hooks.resetGameForTest();
      hooks.addRawItem({
        itemName: name,
        subjectName: name,
        objectType: "桌面小物",
        identityDescription: "一枚带有暖色光泽的护符。",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%231d2420'/%3E%3Cpath d='M60 18L96 48L84 100H36L24 48Z' fill='%23d09b3e'/%3E%3Ccircle cx='60' cy='58' r='18' fill='%234f8fd6'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%231d2420'/%3E%3Cpath d='M320 80L520 230L455 560H185L120 230Z' fill='%23d09b3e'/%3E%3Ccircle cx='320' cy='310' r='112' fill='%234f8fd6'/%3E%3C/svg%3E",
        stats: { shield: 2, defense: 1 },
        value: 15,
        description: `${name}挂在塔墙边，光泽能挡下一截冷风。`,
        skipSpecialRoll: true,
      });
    }, itemName);
  };

  scenarios.desktopEquipmentPreview = await collectScenario(desktop, "desktop-equipment-preview", async (page) => {
    await addPreviewItem(page, "桌面预览护符");
    await page.click("#equipmentDetailImageBtn");
    await page.evaluate(() => {
      const preview = document.querySelector("#equipmentDetailImageBtn");
      const image = document.querySelector("#equipmentDetailImage");
      const body = document.querySelector("#equipmentDetailBody");
      const rect = preview?.getBoundingClientRect();
      const bodyStyle = body ? getComputedStyle(body) : null;
      window.__reviewEquipmentDetailPreview = {
        display: preview ? getComputedStyle(preview).display : "",
        visible: Boolean(preview && !preview.hidden && rect && rect.width > 0 && rect.height > 0),
        loaded: Boolean(image?.complete && image.naturalWidth > 0),
        width: rect?.width || 0,
        height: rect?.height || 0,
        detailHasTwoColumns: Boolean(bodyStyle && bodyStyle.gridTemplateColumns.split(" ").length >= 2),
        viewerOpened: !document.querySelector("#imageViewer")?.hidden,
      };
      document.querySelector("#imageViewer")?.click();
    });
  });

  scenarios.mobileEquipmentPreview = await collectScenario(mobile, "mobile-equipment-preview", async (page) => {
    await addPreviewItem(page, "移动预览护符");
    await page.evaluate(() => {
      const preview = document.querySelector("#equipmentDetailImageBtn");
      const image = document.querySelector("#equipmentDetailImage");
      const rect = preview?.getBoundingClientRect();
      window.__reviewEquipmentDetailPreview = {
        display: preview ? getComputedStyle(preview).display : "",
        visible: Boolean(preview && !preview.hidden && rect && rect.width > 0 && rect.height > 0),
        loaded: Boolean(image?.complete && image.naturalWidth > 0),
        width: rect?.width || 0,
        height: rect?.height || 0,
      };
    });
  });

  scenarios.mobileInfo = await collectScenario(mobile, "mobile-info", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const counterIds = hooks.getStatsCounterIdsForTest();
      const increments = [];
      const originalFetch = window.fetch;
      window.fetch = async (url, options = {}) => {
        if (String(url).includes("/rpc/increment_counter")) {
          const body = JSON.parse(options.body || "{}");
          increments.push(body.counter_id);
          return new Response("null", { status: 200, headers: { "Content-Type": "application/json" } });
        }
        return originalFetch(url, options);
      };
      hooks.resetAppraisalPlayerStatsForTest();
      const photoEquipmentMetricOk = await hooks.recordStatsMetricForTest("PhotoEquipment", 2);
      const photoEquipmentIncrements = increments.slice();
      increments.length = 0;
      const drawingEquipmentMetricOk = await hooks.recordStatsMetricForTest("DrawingEquipment", 1);
      const drawingEquipmentIncrements = increments.slice();
      increments.length = 0;
      const superFormsMetricOk = await hooks.recordStatsMetricForTest("SuperForms", 1);
      const superFormsIncrements = increments.slice();
      increments.length = 0;
      const bossKillsMetricOk = await hooks.recordStatsMetricForTest("BossKills", 2);
      const bossKillsIncrements = increments.slice();
      increments.length = 0;
      const firstAppraisal = await hooks.recordAppraisalPlayerForTest();
      const secondAppraisal = await hooks.recordAppraisalPlayerForTest();
      const appraisalIncrements = increments.slice();
      window.fetch = originalFetch;
      window.__reviewGlobalStats = {
        legacyEquipmentTotalKey: counterIds.totalEquipment,
        legacyEquipmentDailyPrefix: counterIds.dailyEquipmentPrefix,
        photoEquipmentTotalKey: counterIds.totalPhotoEquipment,
        photoEquipmentDailyPrefix: counterIds.dailyPhotoEquipmentPrefix,
        drawingEquipmentTotalKey: counterIds.totalDrawingEquipment,
        drawingEquipmentDailyPrefix: counterIds.dailyDrawingEquipmentPrefix,
        superFormsTotalKey: counterIds.totalSuperForms,
        superFormsDailyPrefix: counterIds.dailySuperFormsPrefix,
        bossKillsTotalKey: counterIds.totalBossKills,
        bossKillsDailyPrefix: counterIds.dailyBossKillsPrefix,
        appraisalTotalKey: counterIds.totalAppraisals,
        appraisalDailyPrefix: counterIds.dailyAppraisalsPrefix,
        photoEquipmentMetricOk,
        photoEquipmentIncrementCount: photoEquipmentIncrements.length,
        photoEquipmentIncrements,
        drawingEquipmentMetricOk,
        drawingEquipmentIncrementCount: drawingEquipmentIncrements.length,
        drawingEquipmentIncrements,
        superFormsMetricOk,
        superFormsIncrementCount: superFormsIncrements.length,
        superFormsIncrements,
        bossKillsMetricOk,
        bossKillsIncrementCount: bossKillsIncrements.length,
        bossKillsIncrements,
        firstAppraisal,
        secondAppraisal,
        appraisalIncrementCount: appraisalIncrements.length,
        appraisalIncrements,
      };
    });
    await page.click("#infoToggleBtn");
    await page.click('[data-info-tab="photo"]');
    await page.locator('.info-page[data-info-page="photo"] .info-block').nth(1).click();
    await page.click('[data-info-tab="battle"]');
    await page.locator('.info-page[data-info-page="battle"] .info-block').nth(2).click();
    await page.evaluate(() => {
      const selectedIndex = (tabId) => {
        const cards = Array.from(document.querySelectorAll(`.info-page[data-info-page="${tabId}"] .info-block[data-info-card="true"]`));
        return cards.findIndex((card) => card.classList.contains("is-selected"));
      };
      const selectedCount = (tabId) => document.querySelectorAll(`.info-page[data-info-page="${tabId}"] .info-block[data-info-card="true"].is-selected`).length;
      const clickable = (tabId) => Array.from(document.querySelectorAll(`.info-page[data-info-page="${tabId}"] .info-block[data-info-card="true"]`))
        .every((card) => card.getAttribute("role") === "button" && card.getAttribute("tabindex") === "0" && card.hasAttribute("aria-pressed"));
      window.__reviewInfoCards = {
        hasHeaderTitle: Boolean(document.querySelector(".info-panel .secondary-head h2")),
        tabLabels: Array.from(document.querySelectorAll("[data-info-tab]")).map((button) => button.textContent.trim()),
        infoButtonText: document.querySelector("#infoToggleBtn")?.textContent.trim() || "",
        photoSelectedIndex: selectedIndex("photo"),
        battleSelectedIndex: selectedIndex("battle"),
        photoSelectedCount: selectedCount("photo"),
        battleSelectedCount: selectedCount("battle"),
        photoCardsClickable: clickable("photo"),
        battleCardsClickable: clickable("battle"),
      };
    });
    await page.click('[data-info-tab="about"]');
  });

  scenarios.mobileCareer = await collectScenario(mobile, "mobile-career", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addTestItem({
        itemName: "通关纪念杯",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Ccircle cx='60' cy='60' r='34' fill='%23245f9a'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23f5ebd7'/%3E%3Ccircle cx='320' cy='320' r='210' fill='%23245f9a'/%3E%3C/svg%3E",
        stats: { hp: 2 },
        value: 8,
        description: "塔顶带回来的蓝色纪念杯。",
        skipSpecialRoll: true,
      });
      hooks.setFloor(40);
      hooks.setEnemies([{
        id: "review-demon",
        testEnemy: true,
        typeKey: "demon",
        typeName: "魔王",
        name: "魔王",
        maxHp: 1,
        hp: 1,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-demon"]);
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).gameClear, null, { timeout: 5000 });
    await page.click(".equipment-slot.has-item");
    await page.waitForFunction(() => {
      const state = JSON.parse(window.render_game_to_text());
      return state.player.selectedEquipment === "通关纪念杯" && state.player.selectedHasOriginalImage;
    }, null, { timeout: 3000 });
  });

  scenarios.mobileCareerMarkdown = await collectScenario(mobile, "mobile-career-markdown", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addTestItem({
        itemName: "黑伞",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Cpath d='M20 60Q60 18 100 60Z' fill='%23245f9a'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23f5ebd7'/%3E%3Cpath d='M80 330Q320 80 560 330Z' fill='%23245f9a'/%3E%3C/svg%3E",
        stats: { shield: 3 },
        value: 21,
        description: "塔顶旧伞。",
        skipSpecialRoll: true,
      });
      hooks.setCareerSummaryForTest({
        status: "ai",
        title: "照片勇者生涯总结",
        text: "**标题：黑伞旧闻**\n\n**多年后**，塔里仍有人记得那把黑伞。\n\n1. 【通关】照片勇者击败16只怪物与8位Boss，把黑伞和纪念杯写进旧账。",
      });
    });
  });

  scenarios.careerGallery = await collectScenario(desktop, "career-gallery", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const makeImage = (index) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='hsl(${index * 30},70%,84%)'/><circle cx='60' cy='56' r='30' fill='#245f9a'/><text x='60' y='104' text-anchor='middle' font-size='15' font-family='Arial' font-weight='700' fill='#17130f'>${index}</text></svg>`)}`;
      for (let index = 0; index < 10; index += 1) {
        hooks.addTestItem({
          itemName: `旧物${index + 1}`,
          image: makeImage(index + 1),
          fullImage: makeImage(index + 1),
          stats: { hp: index + 1 },
          value: 5 + index,
          description: `塔里记下的旧物${index + 1}。`,
          skipSpecialRoll: true,
        });
      }
      hooks.setCareerSummaryForTest({ status: "local" });
      const image = await hooks.makeCareerSummaryImageForTest();
      window.__reviewCareerGallery = {
        itemCards: document.querySelectorAll(".career-item-card").length,
        imageCards: document.querySelectorAll(".career-item-card img").length,
        canvasReady: typeof image === "string" && image.startsWith("data:image/png"),
      };
    });
  });

  scenarios.bossCeremony = await collectScenario(desktop, "boss-ceremony", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setFloor(10);
      const gateText = JSON.parse(window.render_game_to_text()).battleReports.map((entry) => entry.summary).join("\\n");
      const gateCard = document.querySelector(".enemy-card.is-gate-boss");
      const gateBadgeHidden = !/封门Boss|奖励强敌/.test(document.querySelector("#enemyField")?.innerText || "");
      const gateSummary = hooks.makeBattleSummary("victory", {
        floor: 10,
        monsterName: "骷髅队长",
        lootNames: ["胶卷 +0.3"],
        endHp: 42,
        endMaxHp: 80,
      }, -6);
      hooks.setFloor(25);
      const rewardText = JSON.parse(window.render_game_to_text()).battleReports.map((entry) => entry.summary).join("\\n");
      const rewardCard = document.querySelector(".enemy-card.is-reward-boss");
      const rewardBadgeHidden = !/封门Boss|奖励强敌/.test(document.querySelector("#enemyField")?.innerText || "");
      const rewardSummary = hooks.makeBattleSummary("victory", {
        floor: 25,
        monsterName: "章鱼",
        lootNames: ["胶卷 +0.3"],
        endHp: 64,
        endMaxHp: 90,
      }, -3);
      window.__reviewBossCeremony = {
        gateNarrative: /封门|点名|登塔者/.test(gateText),
        rewardNarrative: /绕过去|伸手去拿|付价/.test(rewardText),
        gateCardClass: Boolean(gateCard),
        rewardCardClass: Boolean(rewardCard),
        gateBadgeHidden,
        rewardBadgeHidden,
        gateSummary: /封门石锁崩开|塔顶封印碎裂/.test(gateSummary),
        rewardSummary: /贪心有了回响/.test(rewardSummary),
      };
    });
  });

  scenarios.itemStory = await collectScenario(desktop, "item-story", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addRawItem({
        itemName: "旧剪刀",
        subjectName: "旧剪刀",
        objectType: "剪刀",
        identityDescription: "银色金属旧剪刀，桌面实拍。",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Cpath d='M34 30L92 88M92 30L34 88' stroke='%23245f9a' stroke-width='10'/%3E%3C/svg%3E",
        stats: { attack: 2, lifesteal: 1 },
        value: 18,
        description: "物品。",
        skipSpecialRoll: true,
      });
      const detailText = document.querySelector("#equipmentDetail")?.innerText || "";
      window.__reviewItemStory = {
        hasTowerMeaning: /塔|塔影|塔风|塔纹/.test(detailText),
        hasRawStatPromise: /攻击\\+|防御\\+|生命上限\\+|速度\\+|吸血\\+|回复\\+|护盾\\+/.test(detailText),
      };
    });
  });

  scenarios.itemTypography = await collectScenario(desktop, "item-typography", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.resetGameForTest();
      const longName = "古铜色机械怀表碎片";
      hooks.addRawItem({
        itemName: longName,
        subjectName: "怀表碎片",
        objectType: "桌面小物",
        identityDescription: "古铜色圆形机械怀表，表盖有细纹。",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%231d2420'/%3E%3Ccircle cx='60' cy='64' r='34' fill='%23b7792d'/%3E%3C/svg%3E",
        stats: { shield: 1 },
        value: 13,
        description: "古铜色机械怀表被塔影收进口袋。",
        skipSpecialRoll: true,
      });
      const readLengths = (text) => String(text || "").split("\n").map((line) => Array.from(line).length);
      const slotName = document.querySelector(".slot-name")?.textContent || "";
      const detailName = document.querySelector("#equipmentDetail strong")?.textContent || "";
      const balancedName = hooks.formatBalancedItemDisplayNameForTest?.({ itemName: longName }) || "";
      const slotLengths = readLengths(slotName);
      const detailLengths = readLengths(detailName);
      const makeItem = (stats, specialEffects = []) => ({ itemName: "测试装备", stats, specialEffects, skipSpecialRoll: true });
      const shieldOnly = hooks.balanceItem({
        itemName: "护盾盒",
        subjectName: "护盾盒",
        objectType: "防护盒",
        description: "盒子外壳能遮挡保护，像护盾。",
        reason: "主体=盒子；倾向=护盾",
        tags: ["盒子", "外壳", "护盾"],
        value: 21,
        stats: { shield: 2 },
        photoQuality: { clarity: 3, subjectArea: 3, backgroundClean: 2, realPhoto: 3, focusLight: 2, interesting: 2 },
        statAffinity: [{ stat: "shield", score: 3 }],
        skipSpecialRoll: true,
      });
      const scoredItems = {
        shieldFourScore: hooks.scoreItemForTest?.({ stats: { shield: 4 }, skipSpecialRoll: true }),
        shieldFourQuality: hooks.getItemQualityForTest?.(hooks.scoreItemForTest?.({ stats: { shield: 4 }, skipSpecialRoll: true }) || 0)?.key,
        shieldFiveScore: hooks.scoreItemForTest?.({ stats: { shield: 5 }, skipSpecialRoll: true }),
        shieldFiveQuality: hooks.getItemQualityForTest?.(hooks.scoreItemForTest?.({ stats: { shield: 5 }, skipSpecialRoll: true }) || 0)?.key,
        shieldOnlyValue: shieldOnly.value,
        shieldOnlyScore: hooks.scoreItemForTest?.(shieldOnly),
        shieldOnlyQuality: hooks.getItemQualityForTest?.(hooks.scoreItemForTest?.(shieldOnly) || 0)?.key,
        shieldWithSpecialScore: hooks.scoreItemForTest?.({ stats: { shield: 2 }, specialEffects: ["killShield"], skipSpecialRoll: true }),
        shieldWithSpecialQuality: hooks.getItemQualityForTest?.(hooks.scoreItemForTest?.({ stats: { shield: 2 }, specialEffects: ["killShield"], skipSpecialRoll: true }) || 0)?.key,
      };
      window.__reviewItemTypography = {
        balancedName,
        slotName,
        detailName,
        slotLengths,
        detailLengths,
        slotNameBalanced: slotLengths.length === 2 && slotLengths[0] >= slotLengths[1] && slotLengths[0] - slotLengths[1] <= 1,
        detailNameBalanced: detailLengths.length === 2 && detailLengths[0] >= detailLengths[1] && detailLengths[0] - detailLengths[1] <= 1,
        scoredItems,
        refunds: {
          common: hooks.getDismantleFilmReturnForTest(makeItem({ shield: 2 })),
          rare: hooks.getDismantleFilmReturnForTest(makeItem({ shield: 5 })),
          epic: hooks.getDismantleFilmReturnForTest(makeItem({ shield: 1 }, ["killShield"])),
          legendary: hooks.getDismantleFilmReturnForTest(makeItem({ shield: 3 }, ["killShield"])),
        },
      };
    });
  });

  scenarios.mobileBossSelection = await collectScenario(mobile, "mobile-boss-selection", async (page) => {
    await page.evaluate(() => window.__photoHeroTestHooks.setFloor(30));
  });

  scenarios.mobileBossRetreat = await collectScenario(mobile, "mobile-boss-retreat", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setFloor(30);
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
      window.__reviewBossRetreatStart = JSON.parse(window.render_game_to_text());
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).currentBattle, null, { timeout: 3000 });
    const inBattleRetreatVisible = await page.locator("#fleeBtn").isVisible();
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      const hooks = window.__photoHeroTestHooks;
      window.__reviewKnightCaptainSummon = {
        inBattleTypes: state.enemies.map((enemy) => enemy.typeKey),
        inBattleOrders: state.enemies.map((enemy) => enemy.selectionOrder),
        activeOrderTypes: state.activeEnemyIds
          .map((id) => state.enemies.find((enemy) => enemy.id === id)?.typeKey)
          .filter(Boolean),
        summonedDrops: state.enemies.map((enemy) => enemy.drop),
      };
    });
    await page.click("#fleeBtn");
    await page.waitForFunction(() => !JSON.parse(window.render_game_to_text()).currentBattle, null, { timeout: 3000 });
    await page.evaluate((visible) => {
      const before = window.__reviewBossRetreatStart;
      const after = JSON.parse(window.render_game_to_text());
      const beforeEnemies = new Map((before?.enemies || []).map((enemy) => [enemy.id, enemy.hp]));
      window.__reviewBossRetreat = {
        inBattleRetreatVisible: visible,
        beforeHp: before?.player?.hp,
        beforeShield: before?.player?.shield,
        afterHp: after.player.hp,
        afterShield: after.player.shield,
        afterFloor: after.floor,
        afterBattleActive: Boolean(after.currentBattle),
        afterTypes: after.enemies.map((enemy) => enemy.typeKey),
        afterRetreatVisible: Array.from(document.querySelectorAll("button"))
          .some((node) => !node.hidden && node.offsetParent !== null && node.textContent.trim().includes("閫冭窇")),
        enemyHpChanged: after.enemies.some((enemy) => beforeEnemies.has(enemy.id) && beforeEnemies.get(enemy.id) !== enemy.hp),
      };
    }, inBattleRetreatVisible);
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setFloor(30);
      hooks.setHeroForm("greedy");
      hooks.setFormProgress({ greedy: { kills: 10, level: 2 } });
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).currentBattle, null, { timeout: 3000 });
    await page.evaluate(() => {
      window.__reviewKnightCaptainSummon.greedySummonedDrops = JSON.parse(window.render_game_to_text()).enemies.map((enemy) => enemy.drop);
    });
    await page.click("#fleeBtn");
    await page.waitForFunction(() => !JSON.parse(window.render_game_to_text()).currentBattle, null, { timeout: 3000 });
  });

  scenarios.mobileRewardBossRetreat = await collectScenario(mobile, "mobile-reward-boss-retreat", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      hooks.setFloor(25);
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
    });
    await page.click("#attackBtn");
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).currentBattle, null, { timeout: 3000 });
    const inBattleRetreatVisible = await page.locator("#fleeBtn").isVisible();
    await page.click("#fleeBtn");
    await page.waitForFunction(() => !JSON.parse(window.render_game_to_text()).currentBattle, null, { timeout: 3000 });
    await page.evaluate((visible) => {
      const after = JSON.parse(window.render_game_to_text());
      window.__reviewBossRetreat = {
        inBattleRetreatVisible: visible,
        afterFloor: after.floor,
        afterBattleActive: Boolean(after.currentBattle),
        afterRetreatVisible: Array.from(document.querySelectorAll("button"))
          .some((node) => !node.hidden && node.offsetParent !== null && node.textContent.trim().includes("閫冭窇")),
      };
    }, inBattleRetreatVisible);
  });

  scenarios.mobileFormEconomy = await collectScenario(mobile, "mobile-form-economy", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      hooks.renderHeroFormsForTest?.();
      const setMegaForm = (formId) => {
        hooks.setHeroForm(formId);
        hooks.setFormProgress({
          [formId]: { kills: 10, level: 2 },
        });
      };
      const readMainAvatarAlignment = async (formId) => {
        hooks.setHeroForm(formId);
        hooks.render();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const img = document.querySelector("#heroAvatarImage");
        const card = img?.closest(".hero-form-card");
        const label = card?.querySelector("[data-form-label]");
        if (!img || !card || !label) return null;
        await img.decode().catch(() => {});
        if (!img.naturalWidth || !img.naturalHeight) return null;
        const rect = img.getBoundingClientRect();
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(rect.width);
        canvas.height = Math.ceil(rect.height);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const style = getComputedStyle(img);
        const parsePx = (value) => Number.parseFloat(value || "0") || 0;
        const paddingTop = parsePx(style.paddingTop);
        const paddingRight = parsePx(style.paddingRight);
        const paddingBottom = parsePx(style.paddingBottom);
        const paddingLeft = parsePx(style.paddingLeft);
        const contentWidth = rect.width - paddingLeft - paddingRight;
        const contentHeight = rect.height - paddingTop - paddingBottom;
        const scale = Math.min(contentWidth / img.naturalWidth, contentHeight / img.naturalHeight);
        const drawWidth = img.naturalWidth * scale;
        const drawHeight = img.naturalHeight * scale;
        const positionParts = style.objectPosition.split(/\s+/);
        const positionY = positionParts[1] || positionParts[0] || "50%";
        const offsetX = (contentWidth - drawWidth) / 2;
        const offsetY = positionY === "50%" || positionY === "center" ? (contentHeight - drawHeight) / 2 : 0;
        ctx.drawImage(img, paddingLeft + offsetX, paddingTop + offsetY, drawWidth, drawHeight);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < canvas.height; y += 1) {
          for (let x = 0; x < canvas.width; x += 1) {
            if (data[(y * canvas.width + x) * 4 + 3] <= 12) continue;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
        if (maxX < 0) return null;
        const labelTop = label.getBoundingClientRect().top - card.getBoundingClientRect().top;
        return {
          formId,
          dataFormKey: card.dataset.formKey || "",
          objectPosition: style.objectPosition,
          minY,
          maxY,
          centerFromCardTop: Math.round(((minY + maxY + 1) / 2) * 10) / 10,
          bottomGapToLabel: Math.round((labelTop - maxY) * 10) / 10,
        };
      };
      setMegaForm("shield");
      const shieldAvatar = await readMainAvatarAlignment("shield");
      const shield = hooks.getPlayerStats().shield - 3;
      setMegaForm("lifesteal");
      const lifestealStats = hooks.getPlayerStats();
      const lifesteal = { lifesteal: lifestealStats.lifesteal, def: lifestealStats.def };
      setMegaForm("regen");
      hooks.setHeroStats({ hp: 40, shield: 0 });
      hooks.setEnemies([{
        id: "review-regen-hit",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 30,
        hp: 30,
        atk: 2,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-regen-hit"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(["review-regen-hit"]), 1);
      const regenShield = { shieldAfterHit: hooks.state.player.shield, maxShield: hooks.getPlayerStats().shield };
      hooks.resetGameForTest();
      hooks.setFormProgress({ hp: { kills: 10, level: 2 }, defense: { kills: 10, level: 2 } });
      hooks.setHeroForm("hp");
      hooks.renderHeroFormsForTest?.();
      const hpEffectText = document.querySelector('.form-card[data-form-id="hp"] .form-copy')?.innerText || "";
      const hpMetaText = document.querySelector('.form-card[data-form-id="hp"] .form-card-meta')?.innerText || "";
      hooks.setHeroStats({ hp: 50 });
      hooks.setHeroForm("defense");
      const defenseMaxHp = hooks.getPlayerStats().maxHp;
      hooks.setHeroForm("hp");
      hooks.setEnemies([{
        id: "review-hp-kill",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 1,
        hp: 1,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-hp-kill"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveBattleAction();
      const hpKill = { hp: hooks.state.player.hp, maxHp: hooks.getPlayerStats().maxHp };
      hooks.state.pendingFloorAdvance = false;
      hooks.setHeroForm("defense");
      const hpShared = {
        defenseMaxHp,
        afterKillDefenseMaxHp: hooks.getPlayerStats().maxHp,
        afterKillDefenseHp: hooks.state.player.hp,
      };
      hooks.resetGameForTest();
      hooks.setHeroStats({ hp: 60 });
      hooks.setHeroForm("attack");
      const attackHp = hooks.state.player.hp;
      hooks.setHeroForm("hp");
      const backHp = hooks.state.player.hp;
      hooks.setHeroStats({ hp: 20 });
      hooks.setHeroForm("attack");
      const lowForm = hooks.state.player.formId;
      const lowHp = hooks.state.player.hp;
      hooks.resetGameForTest();
      hooks.setFormProgress({ hp: { kills: 10, level: 2 } });
      hooks.setHeroForm("hp");
      hooks.setHeroStats({ hp: 70 });
      hooks.setHeroForm("attack");
      const megaAttackHp = hooks.state.player.hp;
      hooks.setHeroForm("hp");
      const megaBackHp = hooks.state.player.hp;
      hooks.setHeroStats({ hp: 40 });
      hooks.setHeroForm("attack");
      const hpSwitch = {
        attackHp,
        backHp,
        lowForm,
        lowHp,
        megaAttackHp,
        megaBackHp,
        megaLowForm: hooks.state.player.formId,
        megaLowHp: hooks.state.player.hp,
      };
      hooks.resetGameForTest();
      setMegaForm("speed");
      hooks.addSpecialComboItem(["doubleStrikeSpeedDown", "dealDamageAttack"], {
        itemName: "连击进攻测试工具靴",
        value: 18,
        stats: { lifesteal: 1 },
        description: "shoe speed tool sharp attack",
      });
      hooks.setEnemies([{
        id: "review-speed-pre",
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: "史莱姆",
        maxHp: 10,
        hp: 10,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      }]);
      hooks.selectEnemies(["review-speed-pre"]);
      hooks.setHeroStats({ hp: 50, baseHp: 80, baseAtk: 5, baseLifesteal: 1 });
      hooks.beginBattle(hooks.state.enemies);
      const speedPreStrike = {
        hp: hooks.state.enemies[0]?.hp,
        attackBonus: hooks.state.battleSpecial.attack,
        hpAfter: hooks.state.player.hp,
        heroClock: hooks.state.battleClock?.hero,
      };
      hooks.resetGameForTest();
      setMegaForm("greedy");
      hooks.renderHeroFormsForTest?.();
      const greedyDropBonus = JSON.parse(window.render_game_to_text()).player.form.filmDropBonus;
      const greedyMetaText = document.querySelector('.form-card[data-form-id="greedy"] .form-card-meta')?.innerText || "";
      const greedyStatsByFilm = {};
      for (const film of [0.9, 1.0, 2.0, 3.0, 4.0]) {
        const rolls = Math.floor(film);
        const shards = Math.round((film - rolls) * 10);
        hooks.setRunRewards({ filmRolls: rolls, filmShards: shards });
        const stats = hooks.getPlayerStats();
        greedyStatsByFilm[film.toFixed(1)] = { atk: stats.atk, def: stats.def, speed: stats.speed };
      }
      const visibleFormLabels = {
        header: document.querySelector("[data-form-label]")?.textContent.trim() || "",
        cards: Array.from(document.querySelectorAll(".form-card-meta strong")).map((node) => node.textContent.trim()),
        metaText: Array.from(document.querySelectorAll(".form-card-meta")).map((node) => node.textContent.trim()),
      };
      const readBattleBadgeProbe = async (formId, options = {}) => {
        hooks.resetGameForTest();
        hooks.setHeroForm(formId);
        if (options.progress) hooks.setFormProgress({ [formId]: options.progress });
        if (options.rewards) hooks.setRunRewards(options.rewards);
        hooks.setEnemies([{
          id: `badge-${formId}`,
          testEnemy: true,
          typeKey: "slime",
          typeName: "史莱姆",
          name: "史莱姆",
          maxHp: 30,
          hp: 30,
          atk: 1,
          def: 0,
          speed: 1,
          traits: [],
        }]);
        hooks.beginBattle(hooks.state.enemies);
        hooks.render();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const card = document.querySelector(".hero-form-card");
        const cardRect = card?.getBoundingClientRect();
        const badges = Array.from(document.querySelectorAll(".hero-form-battle-badge")).map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            stat: node.dataset.stat || "",
            text: node.textContent.trim(),
            rightGap: cardRect ? Math.round(cardRect.right - rect.right) : 999,
            top: cardRect ? Math.round(rect.top - cardRect.top) : 0,
          };
        });
        return {
          badges,
          rightAligned: badges.length > 0 && badges.every((badge) => badge.rightGap >= 3 && badge.rightGap <= 9),
          topStacked: badges.every((badge, index) => index === 0 || badge.top > badges[index - 1].top),
        };
      };
      const formBattleBadges = {
        attack: await readBattleBadgeProbe("attack"),
        angry: await readBattleBadgeProbe("angry"),
        greedy: await readBattleBadgeProbe("greedy", { progress: { kills: 10, level: 2 }, rewards: { filmRolls: 3, filmShards: 0 } }),
      };
      window.__reviewFormEconomy = { shield, shieldAvatar, lifesteal, regenShield, hpKill, hpShared, hpSwitch, speedPreStrike, greedyDropBonus, greedyStatsByFilm, visibleFormLabels, hpEffectText, hpMetaText, greedyMetaText, formBattleBadges };
    });
  });

  scenarios.cropAppraisal = await collectScenario(desktop, "crop-appraisal", async (page) => {
    const source = await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f5ebd7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#bd3d36";
      ctx.fillRect(60, 70, 230, 260);
      ctx.fillStyle = "#245f9a";
      ctx.fillRect(510, 70, 230, 260);
      const source = canvas.toDataURL("image/jpeg", 0.82);
      const cropA = { x: 0.05, y: 0.1, width: 0.35, height: 0.8 };
      const cropB = { x: 0.6, y: 0.1, width: 0.35, height: 0.8 };
      const cropped = await hooks.cropImageToDataUrl(source, cropA, 420, 0.72);
      const sourceKey = hooks.makePhotoDuplicateKey(source);
      const cropAKey = hooks.makePhotoDuplicateKey(cropped);
      hooks.addRawItem({
        itemName: "红色方块",
        subjectName: "红色方块",
        objectType: "测试块",
        value: 8,
        stats: { hp: 2 },
        photoKey: cropAKey,
        sourcePhotoKey: sourceKey,
        cropRect: cropA,
        skipSpecialRoll: true,
      });
      window.__reviewCropAppraisal = {
        croppedSmaller: cropped.length < source.length,
        sameCropDuplicate: Boolean(hooks.findCurrentPhotoDuplicateForTest(cropAKey, sourceKey, cropA)),
        differentCropDuplicate: Boolean(hooks.findCurrentPhotoDuplicateForTest(hooks.makePhotoDuplicateKey(source), sourceKey, cropB)),
      };
      hooks.setPendingPhotoForTest(source);
      return source;
    });
    void source;
    await page.click("#photoActionBtn");
    await page.waitForFunction(() => !document.querySelector("#imageViewer").hidden && document.querySelector("#imageViewer").classList.contains("is-crop-editor"), null, { timeout: 3000 });
    const viewerOpened = await page.evaluate(() => !document.querySelector("#imageViewer").hidden);
    const imageBox = await page.locator("#imageViewerImage").boundingBox();
    await page.mouse.move(imageBox.x + imageBox.width * 0.18, imageBox.y + imageBox.height * 0.22);
    await page.mouse.down();
    await page.mouse.move(imageBox.x + imageBox.width * 0.55, imageBox.y + imageBox.height * 0.72, { steps: 8 });
    await page.mouse.up();
    await page.click("#viewerCropConfirm");
    await page.waitForFunction(() => document.querySelector("#imageViewer").hidden, null, { timeout: 3000 });
    await page.evaluate((viewerOpened) => {
      const state = JSON.parse(window.render_game_to_text());
      window.__reviewCropAppraisal = {
        ...window.__reviewCropAppraisal,
        viewerOpened,
        viewerClosedAfterConfirm: Boolean(document.querySelector("#imageViewer").hidden),
        viewerCropSaved: Boolean(state.pendingCropRect && !state.cropMode),
      };
    }, viewerOpened);
  });

  scenarios.groupSpecials = await collectScenario(desktop, "group-specials", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const makeEnemy = (id, hp = 4) => ({
        id,
        testEnemy: true,
        typeKey: "slime",
        typeName: "史莱姆",
        name: id,
        maxHp: hp,
        hp,
        atk: 0,
        def: 0,
        speed: 1,
        traits: [],
      });
      hooks.addSpecialItem("sweep", { itemName: "横扫测试刷", value: 15, stats: {}, specialAffinity: ["sweep"] });
      hooks.setEnemies([makeEnemy("left"), makeEnemy("center", 12), makeEnemy("right")]);
      hooks.selectEnemies(["left", "center", "right"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const sweepLeftHp = hooks.state.enemies.find((enemy) => enemy.id === "left")?.hp;
      const sweepCenterHp = hooks.state.enemies.find((enemy) => enemy.id === "center")?.hp;
      const sweepRightHp = hooks.state.enemies.find((enemy) => enemy.id === "right")?.hp;

      hooks.resetGameForTest();
      hooks.addSpecialItem("sweep", { itemName: "横扫测试刷", value: 15, stats: {}, specialAffinity: ["sweep"] });
      hooks.setEnemies([makeEnemy("visual-left"), makeEnemy("visual-center", 12), makeEnemy("visual-right"), makeEnemy("visual-far")]);
      hooks.selectEnemies(["visual-center", "visual-far", "visual-left", "visual-right"]);
      hooks.beginBattle(hooks.state.selectedEnemyIds.map((id) => hooks.state.enemies.find((enemy) => enemy.id === id)).filter(Boolean));
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const visualSweepState = Object.fromEntries(hooks.state.enemies.map((enemy) => [enemy.id, enemy.hp]));

      hooks.resetGameForTest();
      hooks.addSpecialItem("peerless", { itemName: "无双测试章", value: 15, stats: {}, specialAffinity: ["peerless"] });
      hooks.setEnemies([makeEnemy("peerless-kill", 1), makeEnemy("peerless-next", 10)]);
      hooks.selectEnemies(["peerless-kill", "peerless-next"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const peerlessBaseStats = hooks.getPlayerStats();
      const peerlessStats = hooks.getBattleStatsForTest();
      hooks.resetGameForTest();
      const resetStats = hooks.getPlayerStats();

      hooks.resetGameForTest();
      hooks.addSpecialComboItem(["dealDamageAttack", "takeDamageDefense", "doubleStrikeSpeedDown", "shieldCrashAttackDown"], {
        itemName: "fan knife shield combo",
        subjectName: "fan knife shield combo",
        objectType: "fan knife shield shell",
        description: "fan speed knife sharp shield shell protect",
        value: 16,
        stats: { shield: 7 },
      });
      hooks.addSpecialItem("dealDamageAttack", { itemName: "knife low tester", description: "knife sharp", value: 15, stats: {}, specialAffinity: ["dealDamageAttack"] });
      hooks.setEnemies([{ ...makeEnemy("combo-target", 30), atk: 4 }]);
      hooks.selectEnemies(["combo-target"]);
      hooks.setHeroStats({ baseShield: 10, hp: 80 });
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const comboResults = hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      const activeSpecialKeys = hooks.getActiveSpecialsForTest().map((item) => item.key);
      const comboStrikeCount = comboResults.length;
      const comboShieldDamage = comboResults[0]?.shieldCrashDamage || 0;
      const comboAttackAfterHit = hooks.state.battleSpecial.attack;
      const comboDefenseAfterHit = hooks.state.battleSpecial.defense;
      const comboBaseAtk = hooks.getPlayerStats().atk;
      const comboBattleAtk = hooks.getBattleStatsForTest().atk;
      hooks.render();
      const comboAtkReadout = JSON.parse(window.render_game_to_text()).player.statReadouts?.atk || {};

      hooks.resetGameForTest();
      hooks.addSpecialComboItem(["dealDamageAttack", "takeDamageDefense"], {
        itemName: "sharp shield action tester",
        subjectName: "sharp shield action tester",
        objectType: "knife shield shell",
        description: "knife sharp shield shell protect",
        value: 16,
        stats: {},
      });
      hooks.setHeroStats({ hp: 70, baseHp: 80, baseAtk: 1, baseDef: 10, baseShield: 0, baseLifesteal: 2, baseRegen: 2, shield: 0 });
      hooks.setEnemies([{ ...makeEnemy("zero-action-target", 20), atk: 1, def: 99 }]);
      hooks.selectEnemies(["zero-action-target"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.state.player.hp = 60;
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const zeroHeroResults = hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const zeroAttackAfterHit = hooks.state.battleSpecial.attack;
      const zeroHpAfterHeroStrike = hooks.state.player.hp;
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      const zeroDefenseAfterMonster = hooks.state.battleSpecial.defense;
      const zeroHpAfterMonster = hooks.state.player.hp;

      hooks.resetGameForTest();
      hooks.addSpecialItem("sweep", { itemName: "wide sweep brush", description: "wide sweep brush", value: 15, stats: {}, specialAffinity: ["sweep"] });
      hooks.addSpecialItem("dealDamageAttack", { itemName: "sharp knife tester", description: "knife sharp", value: 15, stats: {}, specialAffinity: ["dealDamageAttack"] });
      hooks.setEnemies([makeEnemy("sweep-left", 20), makeEnemy("sweep-center", 20), makeEnemy("sweep-right", 20)]);
      hooks.selectEnemies(["sweep-left", "sweep-center", "sweep-right"]);
      hooks.setHeroStats({ hp: 70, baseHp: 80, baseAtk: 4, baseShield: 0, baseLifesteal: 2, shield: 0 });
      hooks.beginBattle(hooks.state.enemies);
      hooks.state.player.hp = 50;
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const sweepActionAttack = hooks.state.battleSpecial.attack;
      const sweepActionHp = hooks.state.player.hp;

      hooks.resetGameForTest();
      hooks.addSpecialItem("takeDamageDefense", { itemName: "shield shell tester", description: "shield shell protect", value: 15, stats: {}, specialAffinity: ["takeDamageDefense"] });
      hooks.setFormProgress({ defense: { kills: 10, level: 2 } });
      hooks.setHeroForm("defense");
      hooks.setHeroStats({ hp: 80, baseRegen: 2, baseShield: 0, shield: 0 });
      hooks.setEnemies([{ ...makeEnemy("immune-hit", 20), atk: 10 }]);
      hooks.selectEnemies(["immune-hit"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.state.player.hp = 40;
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(), 1);
      const megaDefenseState = {
        hp: hooks.state.player.hp,
        defenseSpecial: hooks.state.battleSpecial.defense,
        immuneUsed: hooks.state.battleSpecial.damageImmuneUsed,
      };

      hooks.resetGameForTest();
      hooks.addSpecialItem("heavyStrike", { itemName: "heavy hammer tester", description: "heavy hammer smash", value: 16, stats: {}, specialAffinity: ["heavyStrike"] });
      hooks.setHeroStats({ baseAtk: 3, baseShield: 0, shield: 0, hp: 80 });
      hooks.setEnemies([makeEnemy("heavy-target", 16)]);
      hooks.selectEnemies(["heavy-target"]);
      hooks.beginBattle(hooks.state.enemies);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const heavyStrikeHp = hooks.state.enemies[0]?.hp;
      const heavyStrikeValue = hooks.state.inventory
        .flatMap((item) => item ? Object.values(item.specialState || {}) : [])
        .reduce((sum, data) => sum + (data.battleValue || 0), 0);

      hooks.resetGameForTest();
      hooks.addSpecialItem("bloodrage", { itemName: "blood rage tester", description: "red broken rage", value: 16, stats: {}, specialAffinity: ["bloodrage"] });
      hooks.setHeroStats({ baseHp: 100, hp: 40, baseAtk: 4 });
      hooks.setEnemies([makeEnemy("bloodrage-target", 20)]);
      hooks.selectEnemies(["bloodrage-target"]);
      hooks.beginBattle(hooks.state.enemies);
      const bloodrageAtk = hooks.getBattleStatsForTest().atk;
      hooks.render();
      const bloodrageReadout = JSON.parse(window.render_game_to_text()).player.statReadouts?.atk || {};

      hooks.resetGameForTest();
      hooks.addSpecialItem("dealDamageAttack", { itemName: "attack cap tester", description: "knife sharp", value: 15, stats: {}, specialAffinity: ["dealDamageAttack"] });
      hooks.setHeroStats({ hp: 80, baseHp: 80, baseAtk: 1, baseDef: 1, baseShield: 0, shield: 0 });
      hooks.setEnemies([{ ...makeEnemy("attack-cap-target", 999), def: 999, atk: 0 }]);
      hooks.selectEnemies(["attack-cap-target"]);
      hooks.beginBattle(hooks.state.enemies);
      for (let i = 0; i < 10; i += 1) {
        hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      }
      hooks.render();
      const attackCapSlot = document.querySelector(".equipment-slot.has-item");
      const attackCapState = {
        attack: hooks.state.battleSpecial.attack,
        leftBadge: attackCapSlot?.querySelector(".slot-battle-badge-left")?.textContent?.trim() || "",
        rightBadge: attackCapSlot?.querySelector(".slot-battle-badge-right")?.textContent?.trim() || "",
      };

      window.__reviewGroupSpecials = {
        sweepLeftHp,
        sweepCenterHp,
        sweepRightHp,
        visualSweepState,
        peerlessBaseAtk: peerlessBaseStats.atk,
        peerlessBaseDef: peerlessBaseStats.def,
        peerlessAtk: peerlessStats.atk,
        peerlessDef: peerlessStats.def,
        peerlessAfterResetAtk: resetStats.atk,
        peerlessAfterResetDef: resetStats.def,
        activeSpecialKeys,
        comboStrikeCount,
        comboShieldDamage,
        comboAttackAfterHit,
        comboDefenseAfterHit,
        comboBaseAtk,
        comboBattleAtk,
        comboAtkReadout,
        zeroHeroDamage: zeroHeroResults[0]?.totalDamage || 0,
        zeroAttackAfterHit,
        zeroHpAfterHeroStrike,
        zeroDefenseAfterMonster,
        zeroHpAfterMonster,
        sweepActionAttack,
        sweepActionHp,
        megaDefenseState,
        heavyStrikeHp,
        heavyStrikeValue,
        bloodrageAtk,
        bloodrageReadout,
        attackCapState,
      };
    });
  });

  scenarios.linkedTraits = await collectScenario(desktop, "linked-traits", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const baseEnemy = (id, typeKey, overrides = {}) => {
        const type = hooks.monsterTypes[typeKey] || hooks.monsterTypes.slime;
        return {
          id,
          testEnemy: true,
          typeKey,
          typeName: type.name,
          name: type.name,
          maxHp: overrides.maxHp ?? type.hp,
          hp: overrides.hp ?? overrides.maxHp ?? type.hp,
          atk: overrides.atk ?? type.atk,
          def: overrides.def ?? type.def,
          speed: overrides.speed ?? type.speed,
          maxShield: overrides.maxShield ?? 0,
          shield: overrides.shield ?? 0,
          traits: (overrides.traits || type.traits || []).map((trait) => ({ ...trait })),
        };
      };
      const begin = (enemies) => {
        hooks.setEnemies(enemies);
        hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
        hooks.beginBattle(hooks.state.enemies);
        return hooks.state.enemies;
      };

      let enemies = begin([baseEnemy("g1", "guard"), baseEnemy("g2", "guard"), baseEnemy("kc", "knightCaptain")]);
      const guardState = enemies.map((enemy) => ({
        id: enemy.id,
        shield: enemy.shield,
        maxShield: enemy.maxShield,
        display: `${Math.ceil(enemy.hp + enemy.shield)}/${enemy.maxHp}`,
      }));
      const guardShieldApplied = guardState.every((enemy) => enemy.shield === 40 && enemy.maxShield === 40);
      const guardShieldDisplayed = guardState.filter((enemy) => enemy.id.startsWith("g")).every((enemy) => enemy.display === "90/50")
        && guardState.find((enemy) => enemy.id === "kc")?.display === "80/40";
      const knightDamageWithGuards = hooks.applyHeroDamageToEnemy(enemies[2], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 }).totalDamage;
      enemies[0].hp = 0;
      enemies[1].hp = 0;
      const knightDamageAfterGuardDeath = hooks.applyHeroDamageToEnemy(enemies[2], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 }).totalDamage;

      hooks.setEnemies([baseEnemy("sg1", "guard"), baseEnemy("sg2", "guard"), baseEnemy("skc", "knightCaptain")]);
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
      hooks.startAutoBattle();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const startAutoBattleGuardState = hooks.state.enemies.map((enemy) => ({
        id: enemy.id,
        shield: enemy.shield,
        maxShield: enemy.maxShield,
      }));
      const startAutoBattleGuardShieldApplied = startAutoBattleGuardState.every((enemy) => enemy.shield === 40 && enemy.maxShield === 40);

      enemies = begin([baseEnemy("w1", "warrior"), baseEnemy("s1", "slime"), baseEnemy("s2", "slime")]);
      const warriorBaseState = enemies.map((enemy) => ({ atk: enemy.atk, def: enemy.def, speed: enemy.speed }));
      const warriorLiveState = enemies.map((enemy) => hooks.getMonsterDisplayStats(enemy, enemies.map((item) => item.id)));
      const warcryApplied = warriorBaseState[0].atk === 12 && warriorBaseState[0].def === 5 && warriorBaseState[0].speed === 2
        && warriorLiveState[0].atk === 15 && warriorLiveState[0].def === 8 && warriorLiveState[0].speed === 3
        && warriorLiveState[1].atk === 9 && warriorLiveState[1].def === 3 && warriorLiveState[1].speed === 3;
      hooks.state.battleClock = {
        hero: 0,
        enemies: [
          { id: "w1", time: 0.3333333333333333 },
          { id: "s1", time: 0.3333333333333333 },
          { id: "s2", time: 0.3333333333333333 },
        ],
        round: 1,
        encounterId: hooks.state.encounterId,
      };
      hooks.state.activeEnemyIds = ["w1", "s1", "s2"];
      hooks.applyHeroDamageToEnemy(enemies[0], { atk: 999, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 });
      hooks.defeatEnemy(enemies[0]);
      const warcryClockAfterDeath = hooks.state.battleClock.enemies.find((clock) => clock.id === "s1")?.time;
      const warriorAfterDeathState = enemies.map((enemy) => hooks.getMonsterDisplayStats(enemy, enemies.map((item) => item.id)));
      const warcryRemoved = warriorAfterDeathState[1].atk === 6 && warriorAfterDeathState[1].def === 0 && warriorAfterDeathState[1].speed === 2
        && warriorAfterDeathState[2].atk === 6 && warriorAfterDeathState[2].def === 0 && warriorAfterDeathState[2].speed === 2;

      hooks.setHeroStats({ hp: 80, shield: 3, baseDef: 10, baseShield: 0 });
      hooks.addSpecialItem("takeDamageDefense", { itemName: "wizard guard tester", description: "shield shell protect", value: 15, stats: {}, specialAffinity: ["takeDamageDefense"] });
      enemies = begin([baseEnemy("z0", "wizard")]);
      const wizardSingleDef = hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)).def;
      hooks.addSpecialItem("takeDamageDefense", { itemName: "阻击护壳测试", description: "shield shell protect", value: 15, stats: {}, specialAffinity: ["takeDamageDefense"] });
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["z0"]), 1);
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["z0"]), 1);
      const wizardTempDefBeforeThird = hooks.getBattleStatsForTest(["z0"]).def;
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["z0"]), 1);
      const wizardTempDefAfterHit = hooks.getBattleStatsForTest(["z0"]).def;
      const wizardBaseDefAfterHit = hooks.getPlayerStats().def;
      hooks.render();
      const wizardStatReadout = JSON.parse(window.render_game_to_text()).player.statReadouts?.def || {};
      for (let i = 0; i < 12; i += 1) {
        hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["z0"]), 1);
      }
      const wizardTempDefAtCap = hooks.getBattleStatsForTest(["z0"]).def;
      const wizardDefenseSpecialAtCap = hooks.state.battleSpecial.defense;
      hooks.render();
      const wizardCapReadout = JSON.parse(window.render_game_to_text()).player.statReadouts?.def || {};

      hooks.setHeroStats({ hp: 80, shield: 3, baseDef: 5, baseShield: 0 });
      hooks.addSpecialItem("takeDamageDefense", { itemName: "small penalty guard tester", description: "shield shell protect", value: 15, stats: {}, specialAffinity: ["takeDamageDefense"] });
      enemies = begin([baseEnemy("z-small", "wizard", { atk: 1 })]);
      for (let i = 0; i < 15; i += 1) {
        hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["z-small"]), 1);
      }
      const wizardSmallPenaltyDefAtCap = hooks.getBattleStatsForTest(["z-small"]).def;
      const wizardSmallPenaltySpecialAtCap = hooks.state.battleSpecial.defense;
      hooks.render();
      const wizardSmallPenaltyReadout = JSON.parse(window.render_game_to_text()).player.statReadouts?.def || {};

      hooks.setHeroStats({ hp: 80, shield: 3, baseDef: 10, baseShield: 3 });
      enemies = begin([baseEnemy("z1", "wizard"), baseEnemy("z2", "wizard")]);
      const wizardDef = hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)).def;
      enemies[0].hp = 0;
      const wizardAfterOneDeathDef = hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)).def;
      enemies[1].hp = 0;
      const wizardAfterDeathDef = hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)).def;

      hooks.setHeroStats({ hp: 80, shield: 0, baseDef: -3, baseShield: 0 });
      enemies = begin([baseEnemy("zn1", "wizard", { atk: 10 })]);
      const wizardNegativeDef = hooks.getBattleStatsForTest(["zn1"]).def;
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["zn1"]), 1);
      const wizardNegativeHp = hooks.state.player.hp;

      hooks.setHeroStats({ hp: 80, shield: 3, baseDef: 1 });
      enemies = begin([baseEnemy("p1", "patrol", { atk: 6 })]);
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["p1"]), 1);
      enemies[0].hp = 0;
      const patrolState = { hp: hooks.state.player.hp, shield: hooks.state.player.shield, afterDeathShield: hooks.state.player.shield };

      hooks.resetGameForTest();
      hooks.setHeroStats({ hp: 50, shield: 0, baseAtk: 0, baseDef: 999, baseLifesteal: 2 });
      enemies = begin([baseEnemy("sk1", "skeleton"), baseEnemy("sl1", "slime", { hp: 20, def: 0, traits: [] })]);
      hooks.render();
      const noLifestealReadoutBefore = JSON.parse(window.render_game_to_text()).player.statReadouts?.lifesteal || {};
      hooks.resolveHeroStrikeAgainstEnemy(enemies[1]);
      const noLifestealBefore = hooks.state.player.hp - 50;
      enemies[0].hp = 0;
      hooks.defeatEnemy(enemies[0]);
      hooks.resolveHeroStrikeAgainstEnemy(enemies[1]);
      const noLifestealAfter = hooks.state.player.hp - 50;

      hooks.resetGameForTest();
      hooks.setHeroStats({ hp: 40, shield: 0, baseDef: 999, baseRegen: 4 });
      enemies = begin([baseEnemy("kn1", "knight"), baseEnemy("sl2", "slime", { atk: 0, traits: [] })]);
      hooks.render();
      const noRegenReadoutBefore = JSON.parse(window.render_game_to_text()).player.statReadouts?.regen || {};
      hooks.resolveMonsterStrike(enemies[1], hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)), 1);
      const noRegenBefore = hooks.state.player.hp - 40;
      enemies[0].hp = 0;
      hooks.defeatEnemy(enemies[0]);
      hooks.resolveMonsterStrike(enemies[1], hooks.getBattleStatsForTest(enemies.map((enemy) => enemy.id)), 1);
      const noRegenAfter = hooks.state.player.hp - 40;

      enemies = begin([baseEnemy("go1", "golem")]);
      hooks.applyHeroDamageToEnemy(enemies[0], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 });
      const golemHp = enemies[0].hp;

      enemies = begin([baseEnemy("oc1", "octopus")]);
      const octopusDamage = hooks.getMonsterAttackForStrike(enemies[0], { maxHp: 80 });
      const octopusState = JSON.parse(window.render_game_to_text()).enemies.find((enemy) => enemy.id === "oc1") || {};
      const octopusDisplayAtk = octopusState.displayAtk;
      const octopusSpeed = octopusState.displayStats?.speed;
      const octopusTraitText = (octopusState.traits || []).join(" / ");
      hooks.setFloor(25);
      hooks.setHeroStats({ hp: 110, baseHp: 80, baseAtk: 9, baseDef: 11, baseSpeed: 3, baseRegen: 1, baseShield: 4, baseLifesteal: 1, shield: 4 });
      const octopusEqualDefenseState = JSON.parse(window.render_game_to_text()).enemies[0] || {};
      hooks.setHeroStats({ hp: 50, baseHp: 50, baseAtk: 1, baseDef: 0, baseSpeed: 1, baseRegen: 0, baseShield: 0, baseLifesteal: 0, shield: 0 });
      const octopusLethalState = JSON.parse(window.render_game_to_text()).enemies[0] || {};
      hooks.setHeroStats({ hp: 110, baseHp: 80, baseAtk: 10, baseDef: 0, baseSpeed: 20, baseRegen: 0, baseShield: 0, baseLifesteal: 0, shield: 0 });
      hooks.addSpecialItem("killMaxHp", { itemName: "铸命章鱼预估测试", description: "seed growth trophy", value: 15, stats: {}, specialAffinity: ["killMaxHp"] });
      hooks.setEnemies([baseEnemy("octopus-hp-scout", "slime", { hp: 1, def: 0, atk: 0, speed: 1 }), baseEnemy("octopus-after-hp", "octopus")]);
      hooks.selectEnemies(["octopus-hp-scout", "octopus-after-hp"]);
      const octopusAfterHpKillState = JSON.parse(window.render_game_to_text()).enemies.find((enemy) => enemy.id === "octopus-after-hp") || {};

      enemies = begin([baseEnemy("dm1", "demon")]);
      hooks.applyHeroDamageToEnemy(enemies[0], { atk: 20, def: 1, speed: 1, maxHp: 80, shield: 0, regen: 0, lifesteal: 0 });
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["dm1"]), 1);
      const demonPromotionState = { atk: enemies[0].atk, def: enemies[0].def };
      enemies = begin([baseEnemy("dr1", "dragon", { atk: 1 })]);
      hooks.resolveMonsterStrike(enemies[0], hooks.getBattleStatsForTest(["dr1"]), 1);
      const dragonSpeedAfterAttack = enemies[0].speed;

      hooks.setFloor(38);
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
      hooks.beginBattle(hooks.state.enemies);
      enemies = hooks.state.enemies;
      const archmage = enemies.find((enemy) => enemy.typeKey === "archmage");
      const leftMage = enemies[0];
      const leftMageId = leftMage.id;
      const archmageStats = { atk: archmage.atk, def: archmage.def, speed: archmage.speed };
      const hpBeforeArchmageSummon = hooks.state.player.hp;
      leftMage.hp = 0;
      hooks.defeatEnemy(leftMage);
      if (hooks.state.enemyFlipDownIds?.has?.(leftMageId)) hooks.finishEnemyFlipDownForTest(leftMageId);
      hooks.resolveMonsterStrike(archmage, hooks.getBattleStatsForTest(hooks.state.activeEnemyIds), 1);
      const revivedLeftMage = hooks.state.enemies.find((enemy) => enemy.id === leftMageId);
      const archmageSummonState = {
        leftHp: revivedLeftMage?.hp,
        hpBefore: hpBeforeArchmageSummon,
        hpAfter: hooks.state.player.hp,
        activeOrder: [...hooks.state.activeEnemyIds],
        activeOrderTypes: hooks.state.activeEnemyIds
          .map((id) => hooks.state.enemies.find((enemy) => enemy.id === id)?.typeKey)
          .filter(Boolean),
        drops: hooks.state.enemies.map((enemy) => enemy.summoned ? "胶卷 0.0" : "胶卷 0.3"),
        faceDown: hooks.state.enemyFaceDownIds?.has?.(leftMageId),
      };

      hooks.resetGameForTest();
      hooks.addSpecialItem("shieldCrashAttackDown", { itemName: "护盾撞击测试", value: 16, stats: {} });
      hooks.setHeroStats({ baseShield: 10, shield: 10 });
      enemies = begin([baseEnemy("go2", "golem")]);
      hooks.resolveHeroStrikeAgainstEnemy(enemies[0], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(enemies[0], "attack");
      const shieldCrashGolemHp = enemies[0].hp;

      window.__reviewLinkedTraits = {
        guardState,
        guardShieldApplied,
        guardShieldDisplayed,
        startAutoBattleGuardState,
        startAutoBattleGuardShieldApplied,
        warriorBaseState,
        warriorLiveState,
        warriorAfterDeathState,
        warcryApplied,
        warcryRemoved,
        warcryClockAfterDeath,
        wizardSingleDef,
        wizardTempDefBeforeThird,
        wizardTempDefAfterHit,
        wizardBaseDefAfterHit,
        wizardStatReadout,
        wizardTempDefAtCap,
        wizardDefenseSpecialAtCap,
        wizardCapReadout,
        wizardSmallPenaltyDefAtCap,
        wizardSmallPenaltySpecialAtCap,
        wizardSmallPenaltyReadout,
        wizardDef,
        wizardAfterOneDeathDef,
        wizardAfterDeathDef,
        wizardNegativeDef,
        wizardNegativeHp,
        patrolState,
        patrolHp: patrolState.hp,
        patrolShield: patrolState.shield,
        patrolAfterDeathShield: patrolState.afterDeathShield,
        noLifestealBefore,
        noLifestealAfter,
        noLifestealReadoutBefore,
        noRegenBefore,
        noRegenAfter,
        noRegenReadoutBefore,
        golemHp,
        octopusDamage,
        octopusDisplayAtk,
        octopusSpeed,
        octopusTraitText,
        octopusEqualDefenseEstimate: octopusEqualDefenseState.damageEstimate,
        octopusEqualDefenseEstimateState: octopusEqualDefenseState.damageEstimateState,
        octopusEqualDefenseEstimateStateInfo: {
          text: octopusEqualDefenseState.damageEstimate,
          state: octopusEqualDefenseState.damageEstimateState,
          displayAtk: octopusEqualDefenseState.displayAtk,
        },
        octopusLethalEstimate: octopusLethalState.damageEstimate,
        octopusLethalEstimateState: octopusLethalState.damageEstimateState,
        octopusLethalStateInfo: {
          text: octopusLethalState.damageEstimate,
          state: octopusLethalState.damageEstimateState,
          displayAtk: octopusLethalState.displayAtk,
        },
        octopusAfterHpKillEstimate: octopusAfterHpKillState.damageEstimate,
        octopusAfterHpKillEstimateState: octopusAfterHpKillState.damageEstimateState,
        octopusAfterHpKillStateInfo: {
          text: octopusAfterHpKillState.damageEstimate,
          state: octopusAfterHpKillState.damageEstimateState,
          displayAtk: octopusAfterHpKillState.displayAtk,
        },
        bossGrowthState: { demonPromotionState, dragonSpeedAfterAttack },
        demonPromotionState,
        demonPromotionAtk: demonPromotionState.atk,
        demonPromotionDef: demonPromotionState.def,
        dragonSpeedAfterAttack,
        archmageStats,
        archmageSummonState,
        archmageSummonHpChanged: archmageSummonState.hpAfter !== archmageSummonState.hpBefore,
        archmageSummonLeftHp: archmageSummonState.leftHp,
        archmageSummonActiveOrder: archmageSummonState.activeOrderTypes,
        archmageSummonDrops: archmageSummonState.drops,
        knightState: { knightDamageWithGuards, knightDamageAfterGuardDeath },
        knightDamageWithGuards,
        knightDamageAfterGuardDeath,
        shieldCrashGolemHp,
      };
    });
  });

  scenarios.panelToggle = await collectScenario(desktop, "panel-toggle", async (page) => {
    const panelState = async () => page.evaluate(() => {
      const area = document.querySelector("#secondaryArea");
      return {
        infoVisible: Boolean(document.querySelector('[data-secondary-panel="info"]:not([hidden])')) && !area?.classList.contains("is-collapsed"),
        configVisible: Boolean(document.querySelector('[data-secondary-panel="config"]:not([hidden])')) && !area?.classList.contains("is-collapsed"),
      };
    });
    await page.click("#infoToggleBtn");
    const infoOpenState = await panelState();
    await page.click("#infoToggleBtn");
    const infoClosedState = await panelState();
    await page.click("#configToggleBtn");
    const configOpenState = await panelState();
    await page.click("#configToggleBtn");
    const configClosedState = await panelState();
    await page.evaluate((result) => {
      window.__reviewPanelToggle = result;
    }, {
      infoOpened: infoOpenState.infoVisible,
      infoClosed: !infoClosedState.infoVisible && !infoClosedState.configVisible,
      configOpened: configOpenState.configVisible,
      configClosed: !configClosedState.infoVisible && !configClosedState.configVisible,
    });
  });

  scenarios.monsterBestiary = await collectScenario(desktop, "monster-bestiary", async (page) => {
    await page.click("#infoToggleBtn");
    await page.click('[data-info-tab="bestiary"]');
    const readPage = async () => page.evaluate(() => ({
      group: document.querySelector("[data-bestiary-shell]")?.dataset.currentGroup || "",
      pages: Number(document.querySelector("[data-bestiary-shell]")?.dataset.currentPages || 0),
      count: Number(document.querySelector("[data-bestiary-shell]")?.dataset.currentCount || 0),
      selectedKey: document.querySelector(".bestiary-card")?.dataset.selectedMonster
        || document.querySelector(".bestiary-card")?.dataset.selectedNpc
        || document.querySelector(".affix-card")?.dataset.affixKey
        || "",
      monsterKeys: Array.from(document.querySelectorAll(".bestiary-card")).map((card) => card.dataset.selectedMonster || ""),
      npcKeys: Array.from(document.querySelectorAll(".bestiary-npc-card")).map((card) => card.dataset.selectedNpc || ""),
      affixKeys: Array.from(document.querySelectorAll(".affix-card")).map((card) => card.dataset.affixKey || ""),
      cardCount: document.querySelectorAll(".bestiary-card").length,
      npcCardCount: document.querySelectorAll(".bestiary-npc-card").length,
      affixCardCount: document.querySelectorAll(".affix-card").length,
      pageText: document.querySelector(".bestiary-page-indicator")?.textContent.trim() || "",
      truncationCount: Array.from(document.querySelectorAll("[data-bestiary-shell] .bestiary-card-head strong, [data-bestiary-shell] .bestiary-card-head em, [data-bestiary-shell] .bestiary-card-rules p span, [data-bestiary-shell] .bestiary-card-rules li span, [data-bestiary-shell] .affix-card p, [data-bestiary-shell] .affix-card-note"))
        .filter((node) => {
          const style = getComputedStyle(node);
          const lineClamp = style.webkitLineClamp || "";
          return style.textOverflow === "ellipsis"
            || (lineClamp && lineClamp !== "none" && lineClamp !== "unset")
            || (style.overflow === "hidden" && node.scrollWidth > node.clientWidth + 1);
        }).length,
    }));
    const initial = await readPage();
    const initialAffixCardCount = await page.locator(".affix-card").count();
    const statValueFontSize = await page.$eval(".bestiary-stats dd", (node) => Number.parseFloat(getComputedStyle(node).fontSize));
    await page.click('[data-bestiary-action="next"]');
    const afterNormalNext = await readPage();
    await page.click('[data-bestiary-group="boss"]');
    const bossStart = await readPage();
    for (let i = 0; i < 10; i += 1) {
      const canNext = await page.$eval('[data-bestiary-action="next"]', (button) => !button.disabled);
      if (!canNext) break;
      await page.click('[data-bestiary-action="next"]');
    }
    const bossFinal = await readPage();
    const bossDetailText = await page.$eval(".bestiary-card-grid", (node) => node.innerText);
    const bossHasDetailPortrait = await page.$eval(".bestiary-card-grid", (node) => Boolean(node.querySelector(".monster-sprite img")));
    await page.click('[data-bestiary-group="npc"]');
    const npcStart = await readPage();
    const npcDetailText = await page.$eval(".bestiary-card-grid", (node) => node.innerText);
    const npcHasPortrait = await page.$eval(".bestiary-card-grid", (node) => Boolean(node.querySelector(".npc-portrait img")));
    await page.click('[data-bestiary-group="affix"]');
    const affixStart = await readPage();
    const affixDetailText = await page.$eval(".affix-bestiary", (node) => node.innerText);
    const groupState = await page.evaluate(() => ({
      groupText: document.querySelector(".bestiary-group-switch")?.innerText || "",
      hiddenGroupCount: document.querySelectorAll('[data-bestiary-group="hidden"]').length,
      npcGroupCount: document.querySelectorAll('[data-bestiary-group="npc"]').length,
      affixGroupCount: document.querySelectorAll('[data-bestiary-group="affix"]').length,
    }));
    await page.evaluate(({ initial, afterNormalNext, bossStart, bossFinal, npcStart, affixStart, bossDetailText, bossHasDetailPortrait, npcDetailText, npcHasPortrait, affixDetailText, groupState, initialAffixCardCount, statValueFontSize }) => {
      const shell = document.querySelector("[data-bestiary-shell]");
      window.__reviewBestiary = {
        activeInfoTab: document.querySelector("[data-info-tab][aria-selected='true']")?.dataset.infoTab || "",
        tabLabels: Array.from(document.querySelectorAll("[data-info-tab]")).map((button) => button.textContent.trim()),
        normalCount: Number(shell?.dataset.normalCount || 0),
        bossCount: Number(shell?.dataset.bossCount || 0),
        affixCount: Number(shell?.dataset.affixCount || 0),
        hiddenCount: Number(shell?.dataset.hiddenCount || 0),
        npcCount: Number(shell?.dataset.npcCount || 0),
        hiddenGroupCount: groupState.hiddenGroupCount,
        npcGroupCount: groupState.npcGroupCount,
        affixGroupCount: groupState.affixGroupCount,
        bossKeys: (shell?.dataset.bossKeys || "").split(",").filter(Boolean),
        normalPages: initial.pages,
        bossPages: bossStart.pages,
        npcPages: npcStart.pages,
        affixPages: affixStart.pages,
        initialAffixCardCount,
        statValueFontSize,
        initial,
        afterNormalNext,
        bossStart,
        bossFinal,
        npcStart,
        affixStart,
        selectedGroup: shell?.dataset.currentGroup || "",
        selectedKey: document.querySelector(".bestiary-card")?.dataset.selectedMonster
          || document.querySelector(".bestiary-card")?.dataset.selectedNpc
          || document.querySelector(".affix-card")?.dataset.affixKey
          || "",
        pageText: document.querySelector(".bestiary-page-indicator")?.textContent.trim() || "",
        hasDetailPortrait: bossHasDetailPortrait,
        npcHasPortrait,
        groupText: groupState.groupText,
        detailText: bossDetailText,
        npcDetailText,
        affixDetailText,
      };
    }, { initial, afterNormalNext, bossStart, bossFinal, npcStart, affixStart, bossDetailText, bossHasDetailPortrait, npcDetailText, npcHasPortrait, affixDetailText, groupState, initialAffixCardCount, statValueFontSize });
  });

  scenarios.hiddenLayers = await collectScenario(mobile, "hidden-layers", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const bossFloors = new Set([10, 20, 25, 30, 35, 38, 40]);
      hooks.resetGameForTest();
      const triggers = [1, 2, 3, 4].map((index) => hooks.getHiddenTriggerForTest(index));
      const triggersValid = triggers.every((trigger) =>
        trigger
        && trigger.floor >= 5
        && trigger.slot !== 0
        && !bossFloors.has(trigger.floor)
      );

      hooks.enterHiddenLayerForTest(1, 10);
      const hidden1State = JSON.parse(window.render_game_to_text());
      const hidden1 = {
        floorText: document.querySelector("#floorText")?.textContent.trim() || "",
        enemyCount: hidden1State.enemies.length,
        npcCount: hidden1State.enemies.filter((enemy) => enemy.nonCombat).length,
        combatCount: hidden1State.enemies.filter((enemy) => !enemy.nonCombat).length,
        middleNpc: hidden1State.enemies[1]?.npcKey || "",
        visibleText: document.querySelector("#enemyField")?.innerText || "",
      };
      const npcCard = document.querySelector(".enemy-card.is-npc-card");
      const guardCards = Array.from(document.querySelectorAll(".enemy-card:not(.is-npc-card)"));
      hidden1.npcCardText = npcCard?.innerText || "";
      hidden1.npcCardHeight = Math.round(npcCard?.getBoundingClientRect().height || 0);
      hidden1.maxGuardCardHeight = Math.max(...guardCards.map((card) => Math.round(card.getBoundingClientRect().height || 0)), 0);
      hooks.selectEnemies(hooks.state.enemies.filter((enemy) => !enemy.nonCombat).map((enemy) => enemy.id));
      hidden1.beforeAllSelectedText = document.querySelector("#attackBtn")?.textContent.trim() || "";
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
      hidden1.afterAllSelectedText = document.querySelector("#attackBtn")?.textContent.trim() || "";

      const runHiddenRescue = async (index, returnFloor) => {
        hooks.resetGameForTest();
        hooks.setHeroStats({ baseHp: 200, hp: 50, baseAtk: 200, baseDef: 100, baseSpeed: 20, baseShield: 0, shield: 0 });
        hooks.enterHiddenLayerForTest(index, returnFloor);
        const before = hooks.getPlayerStats();
        hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
        hooks.beginBattle(hooks.state.enemies.filter((enemy) => !enemy.nonCombat));
        for (let i = 0; i < 20 && hooks.state.currentBattle; i += 1) {
          hooks.resolveBattleAction();
        }
        await wait(520);
        const after = hooks.getPlayerStats();
        const hero = hooks.getHeroStateForTest();
        const hiddenState = hooks.getHiddenLayerStateForTest();
        return {
          rescued: Boolean(hiddenState.rescued?.[index]),
          returnFloor: hooks.state.floor,
          atkDelta: after.atk - before.atk,
          defDelta: after.def - before.def,
          speedDelta: after.speed - before.speed,
          trueEnding: Boolean(hiddenState.rescued?.[4]),
          hpAfter: hero.hp,
          maxHpAfter: hero.maxHp,
        };
      };

      const hidden3Reward = await runHiddenRescue(3, 22);
      const hidden4Reward = await runHiddenRescue(4, 40);
      const runHiddenTimeout = async (index, returnFloor) => {
        hooks.resetGameForTest();
        hooks.setHeroStats({ baseHp: 500, hp: 500, baseAtk: 1, baseDef: 200, baseSpeed: 1, baseShield: 0, shield: 0 });
        hooks.enterHiddenLayerForTest(index, returnFloor);
        hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
        hooks.beginBattle(hooks.state.enemies.filter((enemy) => !enemy.nonCombat));
        if (hooks.state.currentBattle) hooks.state.currentBattle.roundLimit = 2;
        for (let i = 0; i < 5 && hooks.state.currentBattle; i += 1) {
          hooks.resolveBattleAction();
        }
        await wait(520);
        const hiddenState = hooks.getHiddenLayerStateForTest();
        const report = hooks.state.battleReports?.find((entry) => entry?.result === "enemy-fled") || {};
        return {
          resolved: Boolean(hiddenState.resolved?.[index]),
          rescued: Boolean(hiddenState.rescued?.[index]),
          current: hiddenState.current || null,
          returnFloor: hooks.state.floor,
          result: report.result || "",
          summary: report.summary || "",
        };
      };
      const hidden1Timeout = await runHiddenTimeout(1, 10);

      window.__reviewHiddenLayers = {
        triggers,
        triggersValid,
        hidden1,
        hidden1Timeout,
        hidden3Reward,
        hidden4Reward,
      };
    });
  });

  scenarios.apiConfig = await collectScenario(desktop, "api-config", async (page) => {
    await page.click("#configToggleBtn");
    await page.evaluate(() => {
      const readStoredConfig = () => JSON.parse(localStorage.getItem("photoHero.config") || "{}");
      const state = JSON.parse(window.render_game_to_text());
      const keyInput = document.querySelector("#apiKeyInput");
      const toggle = document.querySelector("#toggleKeyBtn");
      const modelInput = document.querySelector("#modelInput");
      const baseUrlInput = document.querySelector("#baseUrlInput");
      const configPanel = document.querySelector("#configPanel");
      const configGrid = document.querySelector(".config-grid");
      const saveButton = document.querySelector("#saveConfigBtn");
      window.__reviewApiConfig = {
        visiblePresets: Array.from(document.querySelectorAll(".preset-button")).map((button) => button.dataset.preset || ""),
        visiblePresetLabels: Array.from(document.querySelectorAll(".preset-button")).map((button) => button.textContent?.trim() || ""),
        defaultPreset: state.api?.presetId || "",
        defaultBaseUrl: state.api?.baseUrl || "",
        defaultModel: state.api?.model || "",
        defaultReady: Boolean(state.api?.hasApiKey),
        defaultKeyLocked: Boolean(keyInput?.readOnly),
        defaultToggleHidden: Boolean(toggle?.hidden),
        defaultModelDisabled: Boolean(modelInput?.disabled),
        defaultHasMaskedKey: /^•+$/.test(keyInput?.value || ""),
        defaultKeyValue: keyInput?.value || "",
        defaultStoredKey: readStoredConfig().apiKey || "",
        defaultConfigPanelExperience: Boolean(configPanel?.classList.contains("is-experience-config")),
        defaultConfigGridHidden: window.getComputedStyle(configGrid).display === "none",
        defaultBaseUrlVisible: Boolean(baseUrlInput?.offsetParent),
        defaultModelVisible: Boolean(modelInput?.offsetParent),
        defaultApiKeyVisible: Boolean(keyInput?.offsetParent),
        defaultSaveVisible: Boolean(saveButton?.offsetParent),
      };
    });
    await page.evaluate(() => {
      const keyInput = document.querySelector("#apiKeyInput");
      document.querySelector("#toggleKeyBtn")?.click();
      window.__reviewApiConfig = {
        ...window.__reviewApiConfig,
        afterToggleType: keyInput?.type || "",
        afterToggleValue: keyInput?.value || "",
      };
    });
    let defaultExperienceRequest = null;
    await page.route(/\/api\/experience\/chat\/completions$|photo-hero-experience\.[^/]+\.workers\.dev\/chat\/completions$/, async (route) => {
      const request = route.request();
      defaultExperienceRequest = {
        headers: request.headers(),
        body: request.postDataJSON(),
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ choices: [{ message: { content: "图文模型测试成功：图片里写着照片勇者和 VISION OK。" } }] }),
      });
    });
    await page.click("#testChatBtn");
    for (let i = 0; i < 30 && !defaultExperienceRequest; i += 1) {
      await page.waitForTimeout(100);
    }
    await page.evaluate((request) => {
      const body = request?.body || {};
      const hasImage = (body.messages || []).some((message) => (
        Array.isArray(message.content)
        && message.content.some((part) => (
          part?.type === "image_url"
          && /^data:image\/(?:jpeg|jpg|png|webp);base64,/i.test(part.image_url?.url || "")
        ))
      ));
      window.__reviewApiConfig = {
        ...window.__reviewApiConfig,
        defaultExperienceRequestSeen: Boolean(request),
        defaultExperienceUsesAuthorizationHeader: Boolean(request?.headers?.authorization),
        defaultExperienceBodyHasImage: hasImage,
      };
    }, defaultExperienceRequest);

    let xiaomiRequest = null;
    await page.route("https://api.xiaomimimo.com/v1/chat/completions", async (route) => {
      const request = route.request();
      xiaomiRequest = {
        headers: request.headers(),
        body: request.postDataJSON(),
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ choices: [{ message: { content: "图文模型测试成功：图片里写着照片勇者和 VISION OK。" } }] }),
      });
    });
    await page.click('[data-preset="xiaomi"]');
    await page.evaluate(() => {
      const state = JSON.parse(window.render_game_to_text());
      const modelInput = document.querySelector("#modelInput");
      const baseUrlInput = document.querySelector("#baseUrlInput");
      const keyInput = document.querySelector("#apiKeyInput");
      const configPanel = document.querySelector("#configPanel");
      const configGrid = document.querySelector(".config-grid");
      const saveButton = document.querySelector("#saveConfigBtn");
      window.__reviewApiConfig = {
        ...window.__reviewApiConfig,
        xiaomiPreset: state.api?.presetId || "",
        xiaomiBaseUrl: state.api?.baseUrl || "",
        xiaomiModel: state.api?.model || "",
        xiaomiModelOptions: Array.from(modelInput?.options || []).map((option) => option.value || ""),
        xiaomiNote: document.querySelector("#presetNote")?.innerText || "",
        xiaomiLinksText: document.querySelector("#providerLinks")?.innerText || "",
        xiaomiConfigPanelExperience: Boolean(configPanel?.classList.contains("is-experience-config")),
        xiaomiConfigGridHidden: window.getComputedStyle(configGrid).display === "none",
        xiaomiBaseUrlVisible: Boolean(baseUrlInput?.offsetParent),
        xiaomiModelVisible: Boolean(modelInput?.offsetParent),
        xiaomiApiKeyVisible: Boolean(keyInput?.offsetParent),
        xiaomiSaveVisible: Boolean(saveButton?.offsetParent),
      };
    });
    await page.fill("#apiKeyInput", "sk-xiaomi-test");
    await page.click("#testChatBtn");
    for (let i = 0; i < 30 && !xiaomiRequest; i += 1) {
      await page.waitForTimeout(100);
    }
    await page.waitForFunction(() => !/正在测试/.test(document.querySelector("#chatResult")?.innerText || ""), null, { timeout: 3000 }).catch(() => {});
    await page.evaluate((request) => {
      const body = request?.body || {};
      const content = body.messages?.find?.((message) => message.role === "user")?.content || [];
      window.__reviewApiConfig = {
        ...window.__reviewApiConfig,
        xiaomiUsesApiKeyHeader: request?.headers?.["api-key"] === "sk-xiaomi-test",
        xiaomiUsesAuthorizationHeader: Boolean(request?.headers?.authorization),
        xiaomiFirstContentType: content[0]?.type || "",
        xiaomiSecondContentType: content[1]?.type || "",
        xiaomiThinkingDisabled: body.thinking?.type === "disabled",
        xiaomiHasMaxTokens: Object.prototype.hasOwnProperty.call(body, "max_tokens"),
        xiaomiHasMaxCompletionTokens: Object.prototype.hasOwnProperty.call(body, "max_completion_tokens"),
        xiaomiTestResult: document.querySelector("#chatResult")?.innerText || "",
      };
    }, xiaomiRequest);
    await page.click('[data-preset="custom"]');
    await page.fill("#baseUrlInput", "https://example.test/v1");
    await page.fill("#customModelInput", "vision-test-model");
    await page.fill("#apiKeyInput", "sk-test-visible");
    await page.click("#toggleKeyBtn");
    await page.click("#saveConfigBtn");
    await page.evaluate(() => {
      const keyInput = document.querySelector("#apiKeyInput");
      const toggle = document.querySelector("#toggleKeyBtn");
      const stored = JSON.parse(localStorage.getItem("photoHero.config") || "{}");
      window.__reviewApiConfig = {
        ...window.__reviewApiConfig,
        afterCustomEditable: !keyInput?.readOnly,
        customToggleVisible: !toggle?.hidden,
        customKeyType: keyInput?.type || "",
        customKeyValue: keyInput?.value || "",
        customStoredKey: stored.apiKey || "",
      };
    });
  });

  scenarios.mobileSaveFallback = await collectScenario(mobile, "mobile-save-fallback", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      hooks.addTestItem({
        itemName: "移动保存杯",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Ccircle cx='60' cy='60' r='34' fill='%23245f9a'/%3E%3C/svg%3E",
        fullImage: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Crect width='640' height='640' fill='%23f5ebd7'/%3E%3Ccircle cx='320' cy='320' r='210' fill='%23245f9a'/%3E%3C/svg%3E",
        stats: { shield: 2 },
        value: 8,
        description: "用于验证移动端保存兜底。",
        skipSpecialRoll: true,
      });
    });
    await page.click("#savePhotoBtn");
    await page.waitForFunction(() => !document.querySelector("#imageViewer").hidden, null, { timeout: 3000 });
    await page.click("#imageViewerImage");
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      const viewer = document.querySelector("#imageViewer");
      const caption = document.querySelector("#imageViewerCaption")?.textContent || "";
      window.__reviewMobileSaveFallback = {
        saveResult: "viewer",
        viewerOpen: Boolean(viewer && !viewer.hidden),
        captionHasHint: /长按图片保存/.test(caption),
        viewerKeepsImageOnTap: Boolean(viewer && !viewer.hidden),
      };
    });
  });

  scenarios.soundEffects = await collectScenario(desktop, "sound-effects", async (page) => {
    await page.evaluate(async () => {
      const hooks = window.__photoHeroTestHooks;
      const count = (key) => hooks.getAudioEvents().filter((event) => event.key === key).length;
      hooks.setAudioSettings({ sfxEnabled: true, sfxVolume: 1, bgmEnabled: true, bgmVolume: 1 });
      const sfxFill = document.querySelector("#sfxVolumeInput")?.style.getPropertyValue("--slider-fill") || "";
      const bgmFill = document.querySelector("#bgmVolumeInput")?.style.getPropertyValue("--slider-fill") || "";
      hooks.setAudioSettings({ sfxVolume: 0, bgmVolume: 0 });
      const sfxZeroFill = document.querySelector("#sfxVolumeInput")?.style.getPropertyValue("--slider-fill") || "";
      const bgmZeroFill = document.querySelector("#bgmVolumeInput")?.style.getPropertyValue("--slider-fill") || "";
      const sliderStyle = getComputedStyle(document.querySelector("#sfxVolumeInput"));
      hooks.setAudioSettings({ sfxEnabled: true, sfxVolume: 1, bgmEnabled: true, bgmVolume: 1 });
      const battleGain = hooks.getEffectiveAudioGainForTest?.("battleHit", "sfx") || 0;
      const bgmGain = hooks.getEffectiveAudioGainForTest?.("", "bgm") || 0;
      window.__reviewAudioControls = {
        sfxFill,
        bgmFill,
        sfxZeroFill,
        bgmZeroFill,
        sliderPaddingLeft: sliderStyle.paddingLeft,
        sliderPaddingRight: sliderStyle.paddingRight,
        sliderBorderLeft: sliderStyle.borderLeftWidth,
        sliderBorderRight: sliderStyle.borderRightWidth,
        battleGain,
        bgmGain,
        battleGainBoosted: battleGain > 0.58,
        bgmNativeVolume: bgmGain <= 1,
      };
      document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 360));
      window.__reviewBgmPreload = hooks.getBgmPreloadStateForTest?.() || {};
      const initialBgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      hooks.ensureBgmForTest?.(true);
      const sameTrackBaselineState = hooks.getBgmPlaybackStateForTest?.() || {};
      hooks.ensureBgmForTest?.(true);
      hooks.ensureBgmForTest?.(true);
      const sameTrackRefreshState = hooks.getBgmPlaybackStateForTest?.() || {};
      const modeSwitchBgmEventCount = (hooks.getBgmEvents?.() || []).length;
      const modeSwitchBaselineState = hooks.getBgmPlaybackStateForTest?.() || {};
      document.querySelector("#gameModeBtn")?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      document.querySelector("#gameModeBtn")?.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const modeSwitchBgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      const modeSwitchBgmEvents = (hooks.getBgmEvents?.() || []).length - modeSwitchBgmEventCount;
      hooks.markCurrentBgmEndedForTest?.();
      await new Promise((resolve) => setTimeout(resolve, 220));
      const loopWaitState = hooks.getBgmPlaybackStateForTest?.() || {};
      await new Promise((resolve) => setTimeout(resolve, 1050));
      const loopRestartState = hooks.getBgmPlaybackStateForTest?.() || {};
      hooks.forceBgmPausedForTest?.();
      await new Promise((resolve) => setTimeout(resolve, 220));
      const recoveredBgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      const recoveryBeforeWatchdog = hooks.getAudioRecoveryStateForTest?.() || {};
      hooks.forceBgmStalledForTest?.();
      hooks.checkBgmWatchdogForTest?.();
      await new Promise((resolve) => setTimeout(resolve, 120));
      const recoveryAfterWatchdog = hooks.getAudioRecoveryStateForTest?.() || {};
      await hooks.suspendAudioContextForTest?.();
      const recoveryBeforeContext = hooks.getAudioRecoveryStateForTest?.() || {};
      const recoveryAfterContext = hooks.recoverGameAudioAndWaitForTest
        ? await hooks.recoverGameAudioAndWaitForTest("review-context", 900)
        : hooks.recoverGameAudioForTest?.("review-context") || {};
      await new Promise((resolve) => setTimeout(resolve, 80));
      hooks.setFloor(1);
      hooks.ensureBgmForTest?.(true);
      await new Promise((resolve) => setTimeout(resolve, 180));
      const area1BgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      hooks.setFloor(10);
      hooks.ensureBgmForTest?.(true);
      const area1DuringSwitchState = hooks.getCachedBgmPlaybackStateForTest?.("area1") || {};
      await new Promise((resolve) => setTimeout(resolve, 1900));
      const bossBgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      const area1AfterSwitchState = hooks.getCachedBgmPlaybackStateForTest?.("area1") || {};
      const switchSfxRecovery = hooks.recoverGameAudioAndWaitForTest
        ? await hooks.recoverGameAudioAndWaitForTest("review-before-sfx", 900)
        : hooks.recoverGameAudioForTest?.("review-before-sfx") || {};

      hooks.clearAudioEvents();
      hooks.addTestItem({
        itemName: "音效测试石",
        image: "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f5ebd7'/%3E%3Ccircle cx='60' cy='60' r='34' fill='%23245f9a'/%3E%3C/svg%3E",
        stats: { hp: 2 },
        value: 8,
        description: "用于检查鉴定成功音效。",
        skipSpecialRoll: true,
      });
      const appraisalSuccess = count("appraisalSuccess");

      hooks.clearAudioEvents();
      hooks.dismantleSelectedItemForTest();
      const dismantle = count("dismantle");

      hooks.clearAudioEvents();
      hooks.setHeroStats({ hp: 80, shield: 3 });
      hooks.setFloor(1);
      hooks.state.selectedEnemyIds = [];
      hooks.state.currentBattle = null;
      hooks.state.activeEnemyIds = [];
      hooks.state.battleClock = null;
      hooks.state.autoBattleTimer = 0;
      hooks.state.battleStartTimer = 0;
      hooks.state.pendingFloorAdvance = false;
      document.querySelector("#fleeBtn").click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const nextFloor = count("nextFloor");
      hooks.setFloor(10);
      const floor10BgmState = hooks.ensureBgmForTest?.(true) || {};
      hooks.clearAudioEvents();
      hooks.selectEnemies(hooks.state.enemies.map((enemy) => enemy.id));
      hooks.startAutoBattle();
      await new Promise((resolve) => setTimeout(resolve, 120));
      const floor10BattleBgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      const floor10BattleBgmEvents = hooks.getBgmEvents?.() || [];
      hooks.setFloor(11);
      hooks.ensureBgmForTest?.(true);
      await new Promise((resolve) => setTimeout(resolve, 120));
      const area2BgmState = hooks.getBgmPlaybackStateForTest?.() || {};
      const floor10CachedDuringSwitch = hooks.getCachedBgmPlaybackStateForTest?.("skeletonCaptain") || {};
      await new Promise((resolve) => setTimeout(resolve, 900));
      const floor10CachedAfterSwitch = hooks.getCachedBgmPlaybackStateForTest?.("skeletonCaptain") || {};
      const floor10OldTrackSoftened = floor10CachedDuringSwitch.paused === false
        && (floor10CachedDuringSwitch.fading === true || (floor10CachedDuringSwitch.volume || 0) < (floor10BgmState.volume || 1) - 0.02);
      const floor10OldTrackGoneOrSilent = floor10CachedAfterSwitch.paused === true || (floor10CachedAfterSwitch.volume || 0) <= 0.02;

      const setupBattle = (ids) => {
        hooks.clearAudioEvents();
        hooks.setHeroStats({ baseAtk: 30, baseDef: 0, baseSpeed: 2, hp: 80, shield: 3 });
        hooks.setEnemies(ids.map((id, index) => ({
          id,
          testEnemy: true,
          typeKey: "slime",
          typeName: "史莱姆",
          name: `史莱姆${index + 1}`,
          maxHp: 200,
          hp: 200,
          atk: 4,
          def: 0,
          speed: 1,
          traits: [],
        })));
        hooks.selectEnemies(ids);
        hooks.beginBattle(hooks.state.enemies);
      };

      setupBattle(["se-target"]);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      await new Promise((resolve) => setTimeout(resolve, 120));
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[0], "attack");
      const repeatedEnemyHits = count("battleHit");
      const enemyHitActive = Boolean(hooks.state.enemyHitEffectUntilById?.["se-target"]);

      hooks.clearAudioEvents();
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(hooks.state.activeEnemyIds), 1);
      await new Promise((resolve) => setTimeout(resolve, 120));
      hooks.resolveMonsterStrike(hooks.state.enemies[0], hooks.getBattleStatsForTest(hooks.state.activeEnemyIds), 2);
      const repeatedHeroHits = count("battleHit");
      const heroHitActive = Boolean(hooks.state.heroHitEffectUntil);

      hooks.addSpecialItem("sweep", { itemName: "横扫音叉", value: 20, stats: { attack: 0 } });
      setupBattle(["se-left", "se-center", "se-right"]);
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      hooks.clearAudioEvents();
      hooks.resolveHeroStrikeAgainstEnemy(hooks.state.enemies[1], "attack");
      const sweepBattleHits = count("battleHit");
      const sweepEnemyHitCount = Object.keys(hooks.state.enemyHitEffectUntilById || {}).length;
      const finalRecoveryState = hooks.getAudioRecoveryStateForTest?.() || {};

      window.__reviewSoundEffects = {
        appraisalSuccess,
        dismantle,
        nextFloor,
        repeatedEnemyHits,
        repeatedHeroHits,
        sweepBattleHits,
        sweepEnemyHitCount,
        heroHitActive,
        enemyHitActive,
        bgmNativeLoopDisabled: initialBgmState.loop === false,
        bgmSameTrackNoRefresh: sameTrackRefreshState.playAttemptToken === sameTrackBaselineState.playAttemptToken,
        modeSwitchDoesNotTouchBgm: modeSwitchBgmEvents === 0
          && modeSwitchBgmState.key === modeSwitchBaselineState.key
          && modeSwitchBgmState.playAttemptToken === modeSwitchBaselineState.playAttemptToken,
        bgmDelayedLoopRestart: loopWaitState.playAttemptToken === sameTrackRefreshState.playAttemptToken && loopWaitState.loopRestartScheduled === true && loopRestartState.playAttemptToken > loopWaitState.playAttemptToken,
        bgmRecoveredFromPause: recoveredBgmState.hasAudio && recoveredBgmState.paused === false,
        bgmWatchdogRecovered: (recoveryAfterWatchdog.count || 0) > (recoveryBeforeWatchdog.count || 0),
        contextRecoveryAttempted: (recoveryAfterContext.count || 0) > (recoveryBeforeContext.count || 0),
        bgmSwitchStartedNewTrack: area1BgmState.key === "area1" && bossBgmState.key === "skeletonCaptain" && bossBgmState.hasAudio,
        bgmSwitchStopsOldTrack: area1DuringSwitchState.paused === false && area1AfterSwitchState.paused === true,
        bossBgmOnFloorEntry: floor10BgmState.key === "skeletonCaptain",
        bossBattleDoesNotRefreshBgm: floor10BattleBgmState.key === floor10BgmState.key && floor10BattleBgmEvents.length === 0,
        bgmCrossfadeHandoff: area2BgmState.key === "area2" && floor10OldTrackSoftened && floor10OldTrackGoneOrSilent,
        bgmCrossfadeProbe: { floor10BgmState, floor10CachedDuringSwitch, floor10CachedAfterSwitch, area2BgmState },
        contextState: recoveryAfterContext.contextState,
        lastSfxPlayError: finalRecoveryState.lastSfxPlayError || switchSfxRecovery.lastSfxPlayError || "",
      };
    });
  });

  scenarios.monsterDistribution = await collectScenario(desktop, "monster-distribution", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const tierByType = {
        slime: 1,
        bat: 1,
        skeleton: 1,
        mage: 2,
        wizard: 3,
        guard: 3,
        knight: 3,
        patrol: 4,
        warrior: 4,
        swordsman: 4,
      };
      const originalSeed = hooks.state.runSeed;
      const sampleFloor = (floor, count = 96) => {
        const typeCounts = {};
        let tier3 = 0;
        let tier4 = 0;
        let total = 0;
        for (let index = 0; index < count; index += 1) {
          hooks.state.runSeed = `review-distribution-${floor}-${index}`;
          const types = hooks.buildFloorEncounter(floor).map((enemy) => enemy.typeKey);
          for (const type of types) {
            typeCounts[type] = (typeCounts[type] || 0) + 1;
            const tier = tierByType[type] || 1;
            if (tier >= 3) tier3 += 1;
            if (tier >= 4) tier4 += 1;
            total += 1;
          }
        }
        return {
          typeCounts,
          tier3Rate: total ? Number((tier3 / total).toFixed(3)) : 0,
          tier4Rate: total ? Number((tier4 / total).toFixed(3)) : 0,
        };
      };
      const floor1 = sampleFloor(1, 12);
      const allowedBefore10 = new Set(["slime", "bat", "skeleton", "mage"]);
      const early = [2, 3, 5, 8, 9].map((floor) => ({ floor, ...sampleFloor(floor, 24) }));
      const floor11 = sampleFloor(11);
      const floor13 = sampleFloor(13);
      const floor17 = sampleFloor(17);
      const floor23 = sampleFloor(23);
      hooks.state.runSeed = originalSeed;
      window.__reviewMonsterDistribution = {
        floor1AllSlime: Object.keys(floor1.typeCounts).length === 1 && floor1.typeCounts.slime === 36,
        earlyInvalidByFloor: Object.fromEntries(early.map((item) => [
          String(item.floor),
          Object.fromEntries(Object.entries(item.typeCounts).filter(([type]) => !allowedBefore10.has(type))),
        ])),
        earlyInvalidCount: early.reduce((sum, item) => sum + Object.entries(item.typeCounts).filter(([type]) => !allowedBefore10.has(type)).reduce((inner, [, count]) => inner + count, 0), 0),
        earlyTier3Count: early.reduce((sum, item) => sum + Math.round(item.tier3Rate * 72), 0),
        floor11Tier3Rate: floor11.tier3Rate,
        floor13Tier3Rate: floor13.tier3Rate,
        floor17Tier4Rate: floor17.tier4Rate,
        floor23Tier4Rate: floor23.tier4Rate,
        floor11Counts: floor11.typeCounts,
        floor17Counts: floor17.typeCounts,
        floor23Counts: floor23.typeCounts,
      };
    });
  });

  scenarios.bossFilmDrops = await collectScenario(desktop, "boss-film-drops", async (page) => {
    await page.evaluate(() => {
      const hooks = window.__photoHeroTestHooks;
      const readFloor = (floor) => {
        hooks.setFloor(floor);
        return JSON.parse(window.render_game_to_text()).enemies.map((enemy) => ({
          typeKey: enemy.typeKey,
          name: enemy.name,
          drop: enemy.drop,
        }));
      };
      window.__reviewBossFilmDrops = Object.fromEntries([10, 20, 25, 30, 35, 38, 40].map((floor) => [String(floor), readFloor(floor)]));
    });
  });

  await browser.close();

  const failures = Object.entries(scenarios).flatMap(([key, metrics]) => {
    const name = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    return assertScenario(name, metrics);
  });
  console.log(JSON.stringify({ scenarios, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
})();
