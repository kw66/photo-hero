Original prompt: 继续和我讨论游戏事宜，我们到时候上传github和研究生模拟器一样让大家玩吗。要不先做个雏形，让我先能在我的手机上打开网页调用相机，调用大模型？

## 2026-05-14

- Decision: prototype first, no hosted backend. Use browser H5 for pure photo capture and a local Node service for OpenAI-compatible vision calls.
- Project display name: 照片勇者.
- Scope: API config, pure photo capture, one equipment identification flow, simple equip/fight loop.
- Created package.json, server.js, and the first public UI files.
- User correction: no realtime camera preview. The game should be pure photo-taking.
- Verification note: inline PowerShell JSON for Playwright actions failed due quoting, so use tests/idle-actions.json.
- Installed dependencies.
- Started local server on port 3000.
- Verified desktop page load, app.js load, attack interaction, mobile photo-input flow, mock equipment generation, and missing-parameter API error path.
- Added README.md and .gitignore.
- Removed Playwright from project dependencies; verification uses the local Codex web-game skill instead.
- Direction correction: final public version must be a single GitHub Pages style URL, not a local Node app.
- API config must be stored only in each user's browser localStorage.
- Changed root structure to static-first index.html/app.js/styles.css.
- Changed photo input to allow camera or gallery instead of forcing camera capture.

## TODO

- Test phone photo capture on a real device over LAN.
- Test with a real OpenAI-compatible vision API key.
- Verify GitHub Pages style static serving.
- Current preview server PID after static-first rewrite: 14392.
- Added text-only LLM chat test before photo/vision testing.
- GitHub CLI is installed but not authenticated on this machine; deployment is blocked until `gh auth login` is completed.
- Added API provider preset buttons for Ali Qwen-VL, SiliconFlow, DeepSeek text test, and Custom mode.
- URL/model fields now start empty, lock when a preset is selected, and unlock when Custom is selected.
- Custom mode preserves the user's manually typed URL/model while switching between presets.
- Added player-facing guidance that photo identification requires vision/multimodal support, OpenAI-compatible chat/completions, and browser CORS.
- Verified with `node --check app.js`, local page load through the web-game Playwright client, and a mobile Playwright flow covering preset locking, custom restore, refresh persistence, and API key eye-toggle behavior.
- Added official provider links for preset APIs: Ali Bailian console/key docs, SiliconFlow console/docs, and DeepSeek platform/docs; verified link switching and mobile overflow.
- Reworked the game UI into a one-panel, desktop-first control board: API settings are hidden behind a top button, the hero area owns attributes/equipment/photo identification, and the enemy area owns combat actions and battle report.
- Replaced the three-slot RPG equipment model with a Mota-style stat model: HP bar, EXP bar, level, speed, attack, defense, and shield.
- Equipment is now an unlimited collection: all identified items contribute stats, the UI shows 10 thumbnail slots per page, supports paging, and clicking a slot shows a larger image plus description and stat pills.
- Verified desktop 1440x900 and laptop 1366x768 fit in one page without document scrolling; mobile has no horizontal overflow and keeps natural vertical browsing.
- Desktop UI refinement: compressed the title/header into a 40px tool strip, renamed the player display to 照片勇者, reduced button and type scale, and changed player stats from large cards into a compact status strip.
- Enemy UI refinement: replaced the wide enemy banner with a compact square-ish enemy card prepared for multiple enemies, added enemy speed, and simplified battle actions to 开战 / 逃跑.
- Verified `node --check app.js`, desktop 1366x768 and 1440x900 no document scroll, and interaction flow for 开战 / 逃跑 with no console errors.
- Removed the DeepSeek text-only preset from the UI and hardened config loading so old saved DeepSeek preset values fall back to custom mode instead of lingering in the interface.
- Simplified player progression around photo equipment only: removed player level/EXP/progress growth, kept seven player stats (HP, attack, defense, speed, regen, shield, lifesteal), and made regen/lifesteal reduce battle attrition without adding a larger economy.
- Implemented the agreed battle semantics: speed is an action-timeline interval (`1 / speed`) with same-time hero priority, shield refreshes per enemy and absorbs damage before HP, regen triggers after being hit, and lifesteal triggers after hero attacks.
- Added a temporary attribute test panel for the seven player stats so battle tuning can be tested without using equipment generation.
