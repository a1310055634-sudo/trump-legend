# 川流不息 · 特朗普传奇站 — 建设账本

- 项目根：`D:\vibe coding\trump-legend`
- 任务书：`PROMPT.md`（每轮开工前必读）
- 当前状态：**施工中** `current_round = 1 / completed`
- 下一轮：**R02**（timeline.html 上卷）
- 当前版本：`v0.1.0-R01`
- 驱动方式：定时任务每 25 分钟一轮；并发保护 `.round-lock`（mtime < 45 分钟视为施工中，直接结束）
- 纪律：每轮 commit、禁 push/remote、中文一律 Write/Edit 写入、完结后只读空转

---

## 轮次状态表

| 轮 | 内容 | 状态 |
|---|---|---|
| R01 | 骨架+设计系统+首页封面 | ✅ completed（主会话 2026-10-03） |
| R02 | timeline 上卷 1946-1987 + index 目录卡解锁 | ⬜ not_started |
| R03 | timeline 下卷 1988-2026 + 时间轴交互 | ⬜ not_started |
| R04 | empire 商业帝国 | ⬜ not_started |
| R05 | stage 舞台 | ⬜ not_started |
| R06 | whitehouse 第一任期 | ⬜ not_started |
| R07 | downfall 至暗时刻 | ⬜ not_started |
| R08 | comeback 翻盘 | ⬜ not_started |
| R09 | act47 第二任期（须联网复核） | ⬜ not_started |
| R10 | quotes 台词馆 | ⬜ not_started |
| R11 | 视觉卷一：各卷 SVG 刊头 | ⬜ not_started |
| R12 | 视觉卷二：纹理系统化 | ⬜ not_started |
| R13 | 交互卷 | ⬜ not_started |
| R14 | about 编辑部 + 页脚收口 | ⬜ not_started |
| R15 | 移动端与可达性 | ⬜ not_started |
| R16 | 内容增厚卷 | ⬜ not_started |
| R17 | QA 一（console/断链/typo/对比度/file://） | ⬜ not_started |
| R18 | QA 二（多视口截图审查） | ⬜ not_started |
| R19 | 终验 + 事实抽查 20 条 | ⬜ not_started |
| R20 | 收官 v1.0.0 + RELEASE.md | ⬜ not_started |

---

## 交接记录

### R01（主会话 2026-10-03）✅
- 联网核验事实底座（2024 大选、两次遇刺、第二任期 2025-2026 大事年表），写入 PROMPT.md 第三节。
- 建成设计系统 `assets/style.css`：漫画四色印刷+复古新闻纸令牌、`.panel` 分格 / `.bubble` 对话框 / `.caption` 旁白框 / `.kaboom` 拟声字 / `.halftone` 网点 / `.speedlines` 集中线 / `.badge` / `.zigzag` / `.panel-reveal` 入场（尊重 reduced-motion）。
- `assets/main.js`：版本戳注入（读 `<meta name="site-version">`）、入场观察器、移动端导航。
- `index.html` 封面式首页：刊头条（川流不息 / THE TRUMP LEGEND / ISSUE #45+47）、封面 SVG（半调金日+曼哈顿剪影+闪电）、导语 bubble、九卷目录卡（未建页面=锁定卡无 href）、数字速览条（45&47/4 次公司破产重组/2 弹劾/34 定罪/2 遇刺未遂/312 选举人）、TO BE CONTINUED 块。
- 坑与约定：目录卡解锁规则=轮次建好页面后把 `<a class="chapter-card" data-locked>` 换成真 href（R02 起随建随解锁）；页脚版本从 meta 读取，升版时两处一起改。
- 自测：无头 Chrome 9341 冒烟通过（console 零 error，截图留档 `tools/shots/R01/`）；视觉验收两视口（1280/375）双 PASS。
- **坑（后续轮必读）**：带 `.panel-reveal` 入场动效的元素初始 opacity:0，`Page.captureScreenshot(captureBeyondViewport)` 不会触发视口外元素的 IntersectionObserver——截图会拍成空白。`tools/smoke.mjs` 已内置修复：截图前强制全部 `.panel-reveal` 加 `.is-in` 并等 700ms 过渡。后续轮改版 smoke 脚本时不得删掉这一步。

### 待办池（不占轮次，随手可清）
- 无

### 遗留问题
- 无
