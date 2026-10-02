# 川流不息 · 特朗普传奇站 — 建设账本

- 项目根：`D:\vibe coding\trump-legend`
- 任务书：`PROMPT.md`（每轮开工前必读；**v2 金黑特辑版**，2026-10-03 用户拍板改版）
- 当前状态：**施工中** `current_round = 2 / completed`
- 下一轮：**R03**（timeline.html 下卷 1988-2026 + 时间轴交互）
- 当前版本：`v0.3.0-R02`
- 驱动方式：定时任务每 20 分钟一轮（automation-79a585bc，2026-10-03 由 25 分钟改 20 分钟）；并发保护 `.round-lock`（mtime < 45 分钟视为施工中，直接结束）
- 纪律：每轮 commit、禁 push/remote、中文一律 Write/Edit 写入、完结后只读空转

---

## 轮次状态表

| 轮 | 内容 | 状态 |
|---|---|---|
| R01 | 骨架+漫画设计系统+首页封面（已被 R01b 替换） | ✅ completed（主会话 2026-10-03） |
| R01b | **改版**：金黑奢华设计系统+真人照片 10 张+首页照片化重制 | ✅ completed（主会话 2026-10-03） |
| R02 | timeline 上卷 1946-1987 + index 目录卡解锁 | ✅ completed（自动化 R02，2026-10-03） |
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

### R01b（主会话 2026-10-03）✅ —— 改版轮：真人照片 + 金黑奢华
- **改版原因**：用户不认可漫画风，拍板「必须有特朗普真人照片」+「金黑奢华/国旗色点缀：特朗普大厦大理石鎏金质感、深色底、金色衬线大标题」。R01 漫画版全部替换。
- **照片落地**：新建 `assets/photos/`，从 Wikimedia Commons 抓 10 张自由许可真人照片（7 张公有领域含 4 张美国政府作品、1 张 CC0、2 张 CC 署名），全本地引用零外链；逐张登记 `assets/photos/CREDITS.md`（含使用规则 5 条）。抓取脚本 `tools/fetch-photos.mjs`、元数据 `tools/photos-meta.json`、署名采集 `tools/collect-credits.mjs`。
- **设计系统 v2**：`style.css` 全量重写——黑金令牌（--black 三级/--gold 三级/--flag-red/blue 点缀）、金渐变衬线大标题 `.gold-text`（Georgia+宋体栈）、金色画框 `.figure--frame`（双层线框+对角角饰）、国旗彩条 `.flagbar`、大理石颗粒与云纹（SVG feTurbulence data URI 自绘）、`.chapter-card` 照片卡（锁定态灰度+红章）、`.quote` 引语卡、`.stat-strip` 金衬线数字条。
- **首页重制**：hero 左文右图（2025 官方肖像金框+credit）、新加坡峰会宽幅照、英文引语卡、九卷目录卡每卡配真实历史照片（编辑部卡用鎏金「川」字 monogram）、金色数字速览、双 flagbar 收边。全部 9 卡仍 data-locked（页面未建）。
- **自测**：smoke.mjs 升级（+照片 naturalWidth 全加载断言、总数 10、版本 v0.2.0-R01b）→ PASS：console 零 error、10 照片全载、9 卡/6 数字/TBC/页脚齐；CDP 探针核查三个 h1 计算色=象牙白 rgb(242,236,220)、金渐变 background-clip 生效、无横向溢出；双视口截图留档 `tools/shots/R01b/` 并逐项目检通过。
- **坑（后续轮必读）**：
  1. Commons 批量抓图会被**限流静默失败**（API 错误被 catch 吞掉变"无候选"）——重跑即可；**精确文件名优先于搜索**（搜索曾抓到"特朗普模仿者"合照和就职门票图）。
  2. Commons API `iiurlwidth: 0` 会报错——传了就整查询失败，勿传 0。
  3. 本地静态站**禁用 `loading="lazy"`**：首屏外懒加载图不真实加载，冒烟 naturalWidth 断言和 captureBeyondViewport 全页截图都会挂；图片总量才 ~2MB，直接 eager。
  4. Unicode 文件名（DPRK–USA 带 en-dash）在 API 精确标题查询没问题，encodeURIComponent 走 Special:FilePath 也稳。
  5. 截图缩略图上衬线大标题会"看起来发暗金"，是缩放观感；判定颜色必须 CDP getComputedStyle 实测（`tools/probe-colors.mjs` 可复用）。

### R02（自动化轮 automation-79a585bc，2026-10-03 02:46-02:56）✅
- **产出**：新建 `timeline.html`（卷·01 上卷，1946-1987）：刊头（卷号+标题+logline）+ 七个小节（1946 出生/1959 军校/1968 沃顿/1971 接管/1976-1980 君悦改造/1983 大厦/1987 交易的艺术+白宫）+ 金框引语卡（《交易的艺术》p.46 已核原文）+ TBC 下卷预告；3 张照片（Commodore 老照 CC0 新增 `commodore-hotel.jpg`、trump-tower CC BY 复用、reagan-1987 PD 复用），CREDITS.md 已登记 Commodore 行。
- **扩写事实复核**：出生地=牙买加医院（Jamaica Hospital Medical Center）、13 岁约 1959 入纽约军校、福特汉姆两年转沃顿 1968 年 5 月经济学学士——WebSearch 与 Wikipedia/白宫历史协会/Miller Center 一致；底座既有事实（1971 接管/42 年租约/1980 开业/1983 大厦/1987 出版）未动。
- **解锁**：index.html 卷·01 目录卡去 data-locked+真链接、刊头导航加"卷·01 生平全录"、TBC 下期预告更新为下卷；版本双页同步 v0.3.0-R02（meta+页脚）。
- **自测**：smoke timeline.html + index.html 双 PASS（console 零 error、3/10 照片全载、版本一致、零断链、lockedCards 9→8）；1280/375 截图目检通过（tools/shots/R02/）。
- **坑**：①node fetch 连 thumb.wikimedia.org 偶发 ConnectTimeout——Special:FilePath 下载换 `curl -sL` 一次成功，后续抓图优先 curl；②出生地老宅 Commons 无自由许可图，不硬凑，该节保持纯文字；③Commodore 选的是荷兰国立博物馆 CC0 藏的改建前历史明信片照——比"改建后酒店"照片更贴 1976 年叙事，CC0 还省署名。

### 待办池（不占轮次，随手可清）
- 无



### 遗留问题
- 无

### 审计记录（2026-10-03 02:35 主会话）
- 旧定时任务 automation-d9dd6bef 已由用户从 Automations 页删除（它此前每次触发都被服务商内容过滤 1301 拦死，从未真正施工）；新任务 automation-79a585bc 已注册（精简提示词，一切以 PROMPT.md 现文为准），02:59 起每 25 分钟一轮；**后应用户要求改为每 20 分钟一轮，同轮 smoke.mjs 升级：版本断言改"页脚=meta 一致性校验"（不再硬编码版本号）、首页专属断言仅对 index.html 生效（其余页走通用验收线），R02 起升版不再炸冒烟**。
- **事故**：02:28–02:35 之间 PROMPT.md 与 PROGRESS.md 被用户误删（用户已确认；git 中完好），已原样恢复。后续轮若发现任务书/账本缺失：先 `git restore PROMPT.md PROGRESS.md` 再动手，勿自行重建。
