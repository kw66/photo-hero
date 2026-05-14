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
