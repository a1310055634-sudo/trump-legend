# 川流不息 · 特朗普传奇站 — 建设账本

- 项目根：`D:\vibe coding\trump-legend`
- 任务书：`PROMPT.md`（每轮开工前必读；**v2 金黑特辑版**，2026-10-03 用户拍板改版）
- 当前状态：**施工中** `current_round = 18 / completed`
- 下一轮：**R19**（终验：内容字数统计、事实抽查 20 条、版本戳 v1.0.0-rc）
- 当前版本：`v0.19.0-R18`
- 驱动方式：定时任务每 20 分钟一轮（automation-79a585bc，2026-10-03 由 25 分钟改 20 分钟）；并发保护 `.round-lock`（mtime < 45 分钟视为施工中，直接结束）
- 纪律：每轮 commit、禁 push/remote、中文一律 Write/Edit 写入、完结后只读空转

---

## 轮次状态表

| 轮 | 内容 | 状态 |
|---|---|---|
| R01 | 骨架+漫画设计系统+首页封面（已被 R01b 替换） | ✅ completed（主会话 2026-10-03） |
| R01b | **改版**：金黑奢华设计系统+真人照片 10 张+首页照片化重制 | ✅ completed（主会话 2026-10-03） |
| R02 | timeline 上卷 1946-1987 + index 目录卡解锁 | ✅ completed（自动化 R02，2026-10-03） |
| R03 | timeline 下卷 1988-2026 + 时间轴交互 | ✅ completed（自动化 R03，2026-10-03） |
| R04 | empire 商业帝国 | ✅ completed（自动化 R04，2026-10-03） |
| R05 | stage 舞台 | ✅ completed（自动化 R05，2026-10-03） |
| R06 | whitehouse 第一任期 | ✅ completed（自动化 R06，2026-10-03） |
| R07 | downfall 至暗时刻 | ✅ completed（自动化 R07，2026-10-03） |
| R08 | comeback 翻盘 | ✅ completed（自动化 R08，2026-10-03） |
| R09 | act47 第二任期（须联网复核） | ✅ completed（自动化 R09，2026-10-03） |
| R10 | quotes 台词馆 | ✅ completed（自动化 R10，2026-10-03） |
| R11 | 视觉卷一：各卷刊头照片横幅 .cover-art | ✅ completed（自动化 R11，2026-10-03） |
| R12 | 视觉卷二：纹理系统化 | ✅ completed（自动化 R12，2026-10-03） |
| R13 | 交互卷 | ✅ completed（自动化 R13，2026-10-03） |
| R14 | about 编辑部 + 页脚收口 | ✅ completed（自动化 R14，2026-10-03） |
| R15 | 移动端与可达性 | ✅ completed（自动化 R15，2026-10-03） |
| R16 | 内容增厚卷 | ✅ completed（自动化 R16，2026-10-03） |
| R17 | QA 一（console/断链/typo/对比度/file://） | ✅ completed（自动化 R17，2026-10-03） |
| R18 | QA 二（多视口截图审查） | ✅ completed（自动化 R18，2026-10-03） |
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

### R03（自动化轮 automation-79a585bc，2026-10-03 02:55-03:05）✅
- **产出**：timeline.html 升全卷版——上卷内容原样保留（各节加锚点 id），追加下卷五幕（1988-1990 全押 / 1990s 坠落与喘息〔四次 Chapter 11 双写〕/ 2004-2015 学徒 / 2015 扶梯 / 2016-2020 素人总统 / 2020-2021 至暗 / 2022-2024 法庭与子弹 / 2024-2025 翻盘第 47 任），页首新增时代导航 `.tl-rail`（15 个锚点链接，原生键盘可达，:focus-visible 金框）；新增 style.css 组件 `.tl-rail`（纯扩展）；刊头改全卷口径；照片复用库存 8 张（新增曝光：walk-star/speech-2016/farewell-2021/rally-2024/inaug-2025），零新增下载；版本全站 v0.4.0-R03（index+timeline meta/页脚四处同步）。
- **事实复核**：下卷全部事实取自 R01 已核底座；写作中发现初稿把普利策奖错记在"振臂照"上——WebSearch 核实 2025 普利策突发新闻摄影奖实为《纽约时报》Doug Mills（子弹掠过头部照），已改写为准确表述（美联社振臂照传遍全球+Mills 拿奖，两句分开写）。
- **自测**：smoke timeline.html + index.html 双 PASS（console 零 error、8/10 照片全载、版本一致、零断链）；1280/375 截图目检通过（时代导航换行正常、全页无溢出）。
- **坑**：①2024-2025 名场面归属要逐条核（普利策差一点写错）；②下卷刻意止笔于 2025-01-20 就任，2025-2026 执政细节全部留给卷·07 专项轮核实后再写——避免时间线页与 act47 页的事实重复维护；③转场锚点跳转靠 html scroll-behavior:smooth + scroll-margin-top，reduced-motion 已有全局降级，无需额外脚本。

### R04（自动化轮 automation-79a585bc，2026-10-03 03:02-03:10）✅
- **产出**：新建 `empire.html`（卷·02 商业帝国）：刊头+6 格金色台账条（42 年租约/68 层/4.075 亿广场/12 亿泰姬陵/4 次重组/9 亿个人担保）+ 导读 + 五笔大交易各一节配照（君悦 Commodore CC0、大厦 CC BY 复用、广场 CC BY-SA 新增 `plaza-1988.jpg`、泰姬陵 CC0 新增 `taj-1990.jpg`）+ 快船节纯文字（3.65 亿接手→1990 断息→1992-04-12 转手 USAir）+ Chapter 11 专账（1991/1992/2004/2009 四行+公司重组≠个人破产双写）+「名字变成生意」转折节。解锁 index 卷·02 卡+导航；版本三页同步 v0.5.0-R04。CREDITS.md 增两行。
- **扩写事实复核**（WebSearch）：泰姬陵造价 12 亿美元/新泽西最高建筑/1990 年底未付 5000 万美元债券利息；快船 1989 约 3.65 亿接手东方航空东北穿梭线、损失超 1.28 亿、1992-04-12 转 USAir Shuttle——与 Wikipedia/WSJ/Palm Beach Post 等一致；底座既有数字（广场 4.075 亿、个人担保 9 亿、企业债 35 亿、四次重组年份）未动。
- **自测**：smoke empire/index/timeline 三页 PASS（console 零 error、4/10/8 照片全载、版本一致、零断链、lockedCards 9→7）；1280 截图目检通过（tools/shots/R04/，移动端沿用同构布局未复检——组件均为已验证复用）。
- **坑**：①Trump Shuttle 飞机照 Commons 全是 GFDL 1.2 许可——不在本站四类白名单（PD/CC0/CC BY/CC BY-SA），弃图保政策，快船节纯文字；②"5000 万美元利息未付"与"1.28 亿亏损"等新数字逐条带来源核过后才落笔。

### R05（自动化轮 automation-79a585bc，2026-10-03 03:22-03:30）✅
- **产出**：新建 `stage.html`（卷·03 舞台）：导读（舞台三级台阶）+ 1987 书节（《交易的艺术》人设底稿，施瓦茨 2016 年《纽约客》后悔代笔公案）+ 2004 电视节（The Apprentice 首播约 1850 万观众）+ **"You're fired." 金框引语卡**（标注 NBC 2004-2015 出处）+ 名人堂时代（2007 星光大道/2013 WWE）+ 品牌两本账双写节（授权帝国 vs Trump University 2010 停办、2016-11 大选后十日 2500 万美元和解三案）+ 2015 舞台尽头收束。照片复用 walk-star（PD，本卷主图）+ trump-tower（CC BY）；解锁 index 卷·03 卡+导航；版本四页同步 v0.6.0-R05。
- **扩写事实复核**（WebSearch）：Apprentice 2004-01 NBC 首播约 1850 万观众；Trump University 2010 停办、三案 2016 年 11 月以 2500 万美元和解（BBC/时代等一致）；施瓦茨后悔代笔为《纽约客》2016 年报道内容（公开记录）。
- **自测**：smoke stage/index/empire/timeline 四页 PASS（console 零 error、照片全载、版本一致、零断链、lockedCards 9→6）；1280 截图目检通过（tools/shots/R05/）。
- **坑**：①"You're fired!" 用节目台词口径入引语卡（NBC+年份出处），避免被当成个人语录无出处；②Trump University 和解是品牌章最重的一笔，按"两本账都是真的"框架写，不替读者下结论；③品牌冠名楼照片 Commons 探测无合适自由许可图，本卷 2 张照片达标（政策下限）。

### R06（自动化轮 automation-79a585bc，2026-10-03 03:42-03:50）✅
- **产出**：新建 `whitehouse.html`（卷·04 白宫岁月）：本卷口径声明（功过并陈）+ 2017 官方肖像（PD 复用）+ 六节：2016 逆袭（304:227 与普选落后 287 万并陈）、立法与法官（TCJA 双写+三任大法官 6:3 格局）、外交（新加坡/河内峰会+亚伯拉罕协议 vs 退群三连，配峰会握手照 PD 复用）、2020 疫情大考（含本人 2020-10 感染，不写具体日期避免细化）、两次弹劾均未定罪（含"唯一卸任后受审的弹劾"、七人倒戈细节）、连任失利（指引卷·05/卷·01 下卷防重复）。解锁 index 卷·04 卡+导航；版本五页同步 v0.7.0-R06。
- **事实口径**：全部取自 R01 已核底座（无 2025-2026 时事）；本人感染新冠为极广泛公开记录，采用"2020 年 10 月感染并短暂住院"低精度表述不铺日期；每位大法官年份（2017/2018/2020）与底座一致。
- **自测**：smoke whitehouse/index/stage/empire/timeline 五页 PASS（console 零 error、照片全载、版本一致、零断链、lockedCards 9→5）；1280 截图目检通过（tools/shots/R06/）。
- **坑**：①连任失利与至暗细节已在卷·01 下卷写过，本卷只留指针防内容重复维护；②弹劾双写引用"七名共和党参议员倒戈"这个硬数字撑住平衡感——争议内容要靠具体数字而非形容词立稳。

### R07（自动化轮 automation-79a585bc，2026-10-03 04:02-04:10）✅
- **产出**：新建 `downfall.html`（卷·05 至暗时刻，克制版叙事）：刊头「从白宫到被告席」+ 离任照开卷（PD 复用）+ 六节：失去的四个月（306:232/国会山五人死亡口径修正版/二次弹劾 57:43 未达 67）、传票的季节（海湖搜查+四案点名：纽约封口费/联邦机密/联邦国会山/佐治亚）、在案照（新增 `mugshot-2023.jpg` PD，富尔顿县 2023-08-24，CREDITS 已登记）、账单（Carroll 8830 万/民事欺诈 4.54 亿/34 项重罪+双写）、子弹（巴特勒——Comperatore 具名致敬、西棕榈滩 Routh）、谷底长影（账目并排+翻盘钩子）。照片 3 张全 PD/CC0。解锁 index 卷·05 卡+导航；版本六页同步 v0.8.0-R07。
- **事实口径修正**：初稿把 1·6 死亡人数与事后警员自杀混写——改为"骚乱及随后数日内五人死亡（含一名次日身亡的国会警察）；另有处置警员事后自杀认定为因公殉职"两分句；二次弹劾改"57 票定罪 43 票无罪、未达 67 票门槛"。其余全取自底座。
- **自测**：smoke 六页全 PASS（console 零 error、照片全载、版本一致、零断链、lockedCards 9→4）；1280 截图目检通过（tools/shots/R07/，整体调性克制达标）。
- **坑**：①1·6 类敏感史实要"标准口径两分句"写法，人数与自杀抚恤分开陈述，避免混淆构成；②档案照是本卷唯一新增图——克制的卷不需要多图，3 张够了；③"他次日正式承认新政府将就任"这类表述删除（他次日视频讲话但从未正式认败，原稿表述有歧义）。

### R08（自动化轮 automation-79a585bc，2026-10-03 04:22-04:30）✅
- **产出**：新建 `comeback.html`（卷·06 翻盘）：**巴特勒航拍金框做封面级开卷**（figure--frame）+ "Fight! Fight! Fight!" 引语卡（引语卡内注明 Vucci 版权照不可用之照片政策口径与 Mills 普利策归属）+ 七月转折（RNC 提名/万斯 39 岁/拜登 7-21 退选背书哈里斯/8-05 哈里斯正式提名）+ RNC 绷带演讲照（新增 `rnc-2024.jpg` CC BY 2.0 Tim Kennedy，CREDITS 已登记，首下 844KB 后改 width=800 得 156KB）+ 九月第二颗子弹（简写防与卷·05 重复）+ 11 月 5 日决胜（七摇摆州点名/312:226/普选 49.8:48.3/GOP 自 2004 首赢普选/民调八年二次大错）+ 2025-01-20 二次登顶（宣誓照 PD，克利夫兰 128 年）+ 卷·07 钩子。解锁 index 卷·06 卡+导航；版本七页同步 v0.9.0-R08。
- **扩写事实复核**（WebSearch）：万斯 7-15 RNC 首日宣布、7-17 正式接受提名（密尔沃基）；拜登 7-21 宣布退选并背书哈里斯——均与 NPR/Reuters/AP 一致；底座既有数字（312:226/49.8:48.3/七州）未动。
- **自测**：smoke 七页全 PASS（console 零 error、照片全载、版本一致、零断链、lockedCards 9→3）；1280 截图目检通过（tools/shots/R08/）。
- **坑**：①"挥拳格"的版权解法=CC0 巴特勒场照做金框封面 + 引语卡 typography 承载戏剧性，Vucci 振臂照（AP 版权）只作文字提及——政策不可破；②新下载图记得压宽（首下 844KB，width=800 后 156KB）；③西棕榈滩在佛州不叫长岛——地理笔误自查修正，写作时勿想当然。

### R09（自动化轮 automation-79a585bc，2026-10-03 04:42-04:55）✅
- **产出**：新建 `act47.html`（卷·07 第二任期，全站最大内容页）：口径声明（核验基准日 2026-10-03）+ 七幕——开局闪电（26 项行政令/225 项年计/DOGE 百日/驱逐 60.5 万+白宫称 190 万自离）、关税大戏（解放日 145%→日内瓦 30%、SCOTUS 6:3 IEEPA 违宪 2026-02-20）、加沙和平（1-15 停火→3-18 破裂→9-29 20 点方案→10-10 生效→10-13 人质交换+沙姆沙伊赫峰会，配峰会照 CC BY 4.0 新增 `sharm-2025.jpg`）、伊朗战争卷（午夜之锤 B-2×7/14 钻地弹→2026-02-28 哈梅内伊被击毙 40 天国丧→霍尔木兹危机→6-17/18 凡尔赛 14 点备忘录 60 天限期 8 月中到期未定）、西半球（2026-01-03 抓捕马杜罗夫妇）、国内战线（OBBBA 3.4 万亿/43 天停摆/Epstein 档案法 11-19 签署+DOJ 350 万页 2026-01-30/赦免首日约 1600 名 1·6 被告累计近 2000）、民意（诺奖 Machado+奖章赠白宫+"不可转让"声明/No Kings 三轮 400-600 万→700 万→800 万/盖洛普 36%+皮尤 34%）。开局配图新增 `eo-2025.jpg` PD。收束节"这就是现在"+未完待续。解锁 index 卷·07 卡+导航；版本八页同步 v0.10.0-R09（批量脚本带计数守卫，每页 2 处）。CREDITS 增两行。
- **事实核实（本轮 5 次 WebSearch 逐条过）**：午夜之锤（7 B-2/14 GBU-57/福尔多纳坦兹伊斯法罕/十二日战争）、哈梅内伊 2026-02-28 被击毙+40 天国丧+特朗普"夺回国家"喊话+美官员私下怀疑政权更迭、凡尔赛 14 点备忘录（与佩泽希齐扬电子签/重开霍尔木兹/60 天限期 8 月中到期未定）、马杜罗夫妇 2026-01-03 加拉加斯连夜抓捕、20 点方案（9-29 与内塔尼亚胡/和平委员会）、10-13 人质交换（20 名在世/近 2000 名巴方获释）、日内瓦 145→30/125→10、SCOTUS Learning Resources v. Trump 6:3 罗伯茨执笔、诺奖 Machado+奖章赠白宫+不可转让声明、No Kings 三轮人数、26 项行政令/225 项年计、60.5 万驱逐+190 万自离、43 天停摆、Epstein 法 11-19 签署+1-30 350 万页——全部多源一致后才落笔；赦免"约 2000"细化为"首日约 1600 名 1·6 被告+全年近 2000"（比底座更精确）。
- **自测**：smoke 八页全 PASS（console 零 error、照片全载、版本一致、零断链、lockedCards 9→2）；1280 截图目检通过（tools/shots/R09/）。
- **坑**：①初稿混入四处中英混杂词（rolled/flattop/overnight/disarmament/only once）——Write 完必须 grep 自查英文残留；②批量版本替换用脚本时 Edit 工具的文件追踪会失效，先跑脚本再做 Edit（本轮先脚本后 Edit，撞了一次重读恢复）；③"未完待续"卷的核验基准日要写在页面上（2026-10-03），让时效边界对读者诚实。

### R10（自动化轮 automation-79a585bc，2026-10-03 05:02-05:12）✅
- **产出**：新建 `quotes.html`（卷·08 台词馆）：收录标准声明（可核验+日期场合+编辑部译+争议附语境）+ **四个展室 17 条已核语录**——上台之前（修墙宣言 2015-06-16/第五大道开枪 2016-01-23 康瑟尔布拉夫斯/Access Hollywood 2005 录音 2016-10-07 公开【克制引用核心句】/I alone can fix it 2016-07-21 RNC）、白宫一期（American carnage 就职演说/covfefe 2017-05-31 推文含补刀/假新闻敌人 2017-02-17/没人知道医保这么复杂 2017-02-27/两边都有好人 2017-08-15【附语境双写】/非常稳定的天才 2018-01-06 回应《烈焰与怒火》/我完全不担责 2020-03-13/It is what it is 2020-08-03 Axios）、法庭与子弹（eating the dogs 2024-09-10 ABC 辩论含主持人当场核查/Fight×3 2024-07-13）、第二任期（黄金时代 2025-01-20 就职开篇/Liberation Day 2025-04-02）+ 馆后记（TO BE CONTINUED 梗回扣）。照片复用 speech-2016（PD 标注订正：Gage Skidmore CC BY-SA 2.0）。解锁 index 卷·08 卡（最后一张内容卡）+导航；版本九页同步 v0.11.0-R10（批量脚本）。
- **事实核实**：两条 WebSearch 批次逐条核到原文与日期（covfefe 推文文本/稳定天才推文全文背景/第五大道原话与地点/RNC 句/American carnage 官方档案文本/Axios 上下文/国情咨询句/金句辩论原句含主持人核查/fine people 原话与争议双方），全部多源一致；"假新闻敌人""没人知道医保复杂""修墙宣言"为极广泛公开记录的成名句（日期均为标准记载）。
- **自测**：smoke 九页全 PASS（console 零 error、照片全载、版本一致、零断链、lockedCards 9→1 仅剩编辑部）；1280 截图目检通过（tools/shots/R10/）。
- **坑**：①meta description 属性里嵌半角双引号会截断属性——含引号的描述改用「」；②争议引语（Access Hollywood/fine people）的写法=核心句+语境+双方说法，不回避也不渲染；③顺带发现 R01 时 speech-2016 在 R09 页脚图注曾写"PD"是错的（实为 CC BY-SA 2.0）——R05 已按正确署名执行，此处的教训是：图注署名要与 CREDITS.md 对表核验。

### R11（自动化轮 automation-79a585bc，2026-10-03 05:22-05:30）✅
- **产出**：设计系统新增 `.cover-art` 刊头照片横幅组件（双色调做旧 grayscale(0.5)+sepia(0.22)+金斜晖遮罩+压暗渐变、clamp 高度 170-300px、object-position 上偏、金色角标 .cover-art__tag）；八张内容页刊头上方各插入一张签名照横幅——卷01 reagan-1987 / 卷02 trump-tower / 卷03 walk-star / 卷04 portrait-2017 / 卷05 farewell-2021 / 卷06 rally-2024 / 卷07 sharm-2025 / 卷08 speech-2016（全部复用库存，零新增下载，首页封面已有 hero 不加）。顺带修正账本 R11 行的 R01 旧文案（"SVG 刊头"→照片横幅）。版本九页同步 v0.12.0-R11（批量脚本带计数）。
- **自测**：smoke 八张内容页全 PASS（console 零 error、照片全载、版本一致、零断链）；1280 截图目检通过（timeline 卷横幅做旧效果+角标可读性确认，tools/shots/R11/）。
- **坑（复犯警示）**：①上轮批量版本脚本改过的文件，本轮 Edit 前必须先 Read 刷新追踪——本轮 8 个 Edit 有 7 个因追踪过期被拒（quotes.html 意外存活），grep 定位+小窗 Read 后全部补齐；这个坑已在 R09 记过，仍是复犯率最高的一号坑。

### R12（自动化轮 automation-79a585bc，2026-10-03 05:42-05:50）✅
- **产出**（纯 CSS 轮，HTML 零内容改动）：①纹理单源化——`--tex-grain`（金噪点）与 `--tex-veins`（大理石云纹）收敛为 :root 令牌，全站唯一定义处；②body 的颗粒从固定伪元素改为背景层（视觉等效、少一层合成）；③.hero 云纹改令牌引用；④云纹延展到 .stat-strip 与 .tbc（多层 background：纹理层 cover no-repeat 压在渐变上，透明度焊死在 SVG 内无需额外控制）。装饰一致性审计：九页 flagbar+goldrule 齐备 ✓。版本九页同步 v0.13.0-R12（批量脚本带计数）。
- **自测**：先跑 CSS 冒烟（timeline/index 双 PASS）再升版本，版本后复验 act47/quotes/downfall 三页 PASS——共五页冒烟零 error、照片全载、版本一致；1280 截图目检（首页数字条云纹效果确认，tools/shots/R12/）。
- **坑**：①本轮流程顺序修正了 R11 的坑——脚本批量改版本放最后、纯 CSS 阶段先冒烟，全程零 Edit 追踪冲突；②纹理透明度已经焊死在 SVG 的 alpha 通道里，页面层不要再用 opacity 叠加（双层衰减会几乎不可见）。

### R13（自动化轮 automation-79a585bc，2026-10-03 06:03-06:15）✅
- **产出**（main.js+style.css 双文件轮，零 HTML 内容改动）：①阅读进度条——顶部 3px 金线 #progress-bar，rAF 节流随滚动，JS 注入九页通用；②back-to-top——44px 触控目标（预铺 R15），滚过 600px 浮现，reduced-motion 时 scroll behavior=auto，键盘可达（button+aria-label）；③时代导航滚动高亮——timeline 的 .tl-rail 随滚动把当前小节年份点亮（.is-active 金底反白，IntersectionObserver -25%/-60% 视窗带）；④入场错峰编排——同批进入视口的 .panel-reveal 按 70ms 级联（封顶 280ms），transitionend 后清除内联延迟（不污染 hover 过渡）；⑤顺手修 R02 起潜伏的过渡覆盖 bug——.chapter-card.panel-reveal 合并 transition（hover 的 border/box-shadow 不再瞬变）。CSS 新增 #progress-bar/.back-top/.tl-rail a.is-active/合并过渡+reduced-motion 补丁；smoke.mjs 等待窗 700→1600ms（适配错峰）。
- **自测**：新写 tools/probe-interactions.mjs（CDP 交互探针）——timeline：进度条 40% 滚动位=35%宽、back-top 浮现/点击归零并隐藏、时代导航高亮"1987 出版"；quotes（无 rail 页）：进度条 38.8%、back-top 正常、no-rail 正确 no-op——双页 PASS；smoke 九页全 PASS（console 零 error）。版本九页批量 v0.14.0-R13。
- **坑**：①全页截图不显示进度条/back-top（截在 scrollY=0，本就该隐藏）——JS 交互行为必须用行为探针断言而非截图；②错峰延迟封顶必须 < smoke 等待窗，否则强制入场后截图会拍到半透明元素；③transition 属性不合并——两个类各自定义 transition 时后者整体覆盖前者，多类组件要显式写合并清单。

### R14（自动化轮 automation-79a585bc，2026-10-03 06:23-06:35）✅
- **产出**：新建 `about.html`（编辑部页，九卷收官页）：本刊是谁（含金黑视觉的现实原型=大厦门厅）+ 事实纪律五条（含核验基准日与"以原始出处为准"最高条款）+ 照片与版权（17 张自由许可盘点+逐位摄影者致谢——CC 署名在此页正式兑现）+ 参考来源（Wiki/白宫档案/普利策官网/Gallup/主流媒体）+ 致敬声明（无关联不背书）+ 版本史（R01 漫画版被推翻如实记录→v0.15.0-R14）。解锁 index 编辑部卡（**lockedCards 9→0，十页全部上线**）+导航加编辑部；页脚收口确认：十页页脚三件套（致敬声明/照片来源/版本）逐页一致。版本十页同步 v0.15.0-R14。
- **自测**：smoke 十页全 PASS（console 零 error、照片全载、版本一致、零断链）；1280 截图目检通过（tools/shots/R14/）。**R14 轮内自查修正两处**：①照片总数初写 14 实为 17（数 CREDITS 行修正）；②横幅初用 hero-2025 竖幅肖像被 cover 裁成脸部特写——换 trump-tower 横幅照并重截图。
- **坑**：①竖幅人像照片禁入 .cover-art 横幅（object-position 上偏 28% 会裁成额头）——横幅只选横构图；②桌面端导航 10 项在 1280 宽下换行为两行，可读未破版——留给 R15 移动端轮统一决策（缩短标签或调整断点）；③"17 张照片"这类全站统计数字写前必须数一遍实物（CREDITS.md 行数）。

### R15（自动化轮 automation-79a585bc，2026-10-03 06:42-06:55）✅
- **产出**：新写 `tools/audit-a11y.mjs`（可持续复跑的审计器：10 页×375/768/1280 溢出 + AA 对比度全文走查 + 触控目标 + reduced-motion 直出，51 项检查）。首轮实测抓出 145 个问题、收敛为 4 个系统性根因，全部修复：①`--ink-faint` #6f6a5e→**#8a8578**（3.65:1→≥4.9:1 达 AA；影响 credit/quote__who/footer__meta/hero__meta 全站图注类）；②**back-top 真 bug**——JS 注入 id="back-top" 而 CSS 写成类选择器 `.back-top`，44px 样式从未生效（11×19 裸按钮），改 `#back-top`；③触控高度：nav__list a 加 padding 11px 8px、.tl-rail a 改 inline-flex+min-height 44px、.brand 加 padding、.nav-toggle min-height 44px（375 档实测）；④reduced-motion 直出 ✓（无需改动）。审计器内置两类已论证豁免：.gold-text 渐变裁字（计算色透明系误报，实测最暗金阶 4.26:1>大字 3:1）、footer/段落内联链接（WCAG 2.5.8 inline 例外）。**复跑 51 项检查 0 问题 PASS**。版本十页同步 v0.16.0-R15。
- **自测**：审计器 PASS（51/51）+ 十页 smoke 全 PASS + 375/1280 截图目检（导航触控区放大后桌面双行排版可读、375 目录按钮达标）。
- **坑**：①批量脚本后 Edit 失效的坑本轮又踩一次（style.css 先脚本后 Edit 顺序错误）——铁律升级：**同轮内一切批量脚本必须放在所有 Edit 之后**；②back-top 类选择器/注入 id 不一致这类"样式静默不生效"只有实测才暴露，R13 的行为探针当时只测了行为没测尺寸；③about 版本史段落里写死版本号，被批量替换误更新——历史段落里的版本号要用"轮次+描述"而非可被替换的字面量，或替换脚本排除该段。

### R16（自动化轮 automation-79a585bc，2026-10-03 07:01-07:20）✅
- **产出**：内容增厚卷——八卷 CJK 字数全部达到 2500+（timeline 2947 / empire 2506 / stage 2501 / whitehouse 2527 / downfall 2502 / comeback 2503 / act47 2620 / quotes 2557，合计约 2.1 万字，四波扩写）。新增内容全部来自本轮 WebSearch 核验或公认公开记录：四案 91→88 项指控演变、多拉 2012（1.5 亿）/坦伯利 2014（6500 万）、《第一步法案》2018-12-21、太空军 2019-12-20、伏特加 2005/牛排 2007、《小鬼当家2》1992 客串、三摇摆州合计不足八万票、2016 广告费 2:1、河内 2019-02 离席、马斯克 7 月"美国党"、特朗普牛排等货架史、麦迪逊广场花园收官集会（1939 旧照争议双写）、1.55 亿总票数、107 天竞选、万斯"美国的希特勒"私信与 40 岁就任、量刑日"无条件释放"视频出席、Twitter 封号 232 天与 DJT 上市、宾州三现叙事、巴特勒后防弹玻璃、UNSC 无关细节已排除。新增 14 个面板/段落（无新增照片——政策允许，各页照片已达标）。
- **自测**：八卷 CJK 计数脚本全过 2500 线（多波微调至全绿）；英文残留扫描仅剩专名；十页 smoke 全 PASS；版本十页同步 v0.17.0-R16。
- **坑**：①版本史段落里的字面版本号被批量替换第三次吃掉（R15 记过仍复犯）——已手工修正为"轮次+描述"式写法并把本条升级为铁律：**about.html 版本史段落永远不写可被全局替换的字面版本号，或批量脚本必须排除 about.html 的该段落**；②扩写新事实（91→88 演变、坦伯利价格、量刑日视频出席）全部先 WebSearch 再落笔，底座外数字零容忍；③写作时英文残留（real/freedom/major party/Entertainment）两轮 grep 自查清零——中文写作纪律的 grep 检查应紧随每波扩写。

### R17（自动化轮 automation-79a585bc，2026-10-03 07:24-07:38）✅
- **产出**：QA 工具两件——`tools/qa-links.mjs`（10 页 href/src 全量解析→本地存在性+外链图片清点）与 `tools/typo-scan.mjs`（术语一致性+错字模式+英文残留白名单复核，可持续复跑）。**QA 结果全绿**：①断链 PASS（零断链、零外链图片）；②typo PASS（修掉 5 处中英混排真实残留：act47"暂时 setback"→受挫、stage"competing 商业任务"→比拼真实商业任务、"signature 系列"→同名系列、"lifetime 累计"→累计、timeline"housing 热潮"→住房热潮；术语"哈里斯/万斯/里根/弹劾/账单"全站一致，"川普"仅存于刊名释义）；③对比度复测 51/51 PASS（R15 审计器复跑）；④console 零 error：十页 smoke 全 PASS（file:// 直开验证内含于 smoke 的 file:// 加载方式）；⑤英文残留人工复核清单全部为引语原文/官方专名/人名（Vucci/Mills/Crooks/Comperatore/Wharton 等）。
- **扫描器自身修正**：①缺 import join/ROOT（两连 ReferenceError）；②正文提取加空白归一化（品牌换行产生双空格误报）；③"？？？"豁免（covfefe 补刀原话标点）。
- **永久修复**：about.html 版本史段落**不再含任何字面版本号**（末条改"当前版本以页脚标注为准"）——三度被批量替换误吃的坑就此根除（R15 记录的坑第三次复犯后升级处理）。
- **自测**：qa-links PASS、typo-scan PASS、audit-a11y 51/51 PASS、十页 smoke PASS；版本十页同步 v0.18.0-R17（about 仅 meta+页脚 2 处正确位）。
- **坑**：①typo 扫描器首跑连吃两个 ReferenceError（import 不全）——新工具写完先跑再入库；②正则扫描的正文提取必须先做空白归一化，否则标记换行会制造海量假阳性；③引语页里的原话标点（？？？）和引语原文（英文全句）都是合法"异常"，扫描器要有豁免清单并注明理由。

### R18（自动化轮 automation-79a585bc，2026-10-03 07:41-07:55）✅
- **产出**：新写 `tools/multiview-shots.mjs`（10 页 × 1280/375 全页截图 + 三项审计：横向溢出/非封面图失真（natural 与渲染比例差 >6%）/隐藏容器裁字）→ **20 张全页截图**入 `tools/shots/R18/`。审计抓出 **2 处真实失真**：index hero 肖像（HTML height="1080" 属性 × CSS width:100% 组合把 4:5 肖像纵向拉伸成 0.38 细长条）——修复 `.figure img { height: auto }` 后复跑 20 张 0 问题、console 异常 0。页面本体零改动（纯 CSS 一行修复）。版本十页同步 v0.19.0-R18——**about.html 版本史永久修复首次经受批量替换检验：十页全部恰好替换 2 处（meta+页脚），历史段落零误伤**。
- **自测**：multiview 审计 PASS（20 截图/0 溢出/0 失真/0 裁切/0 console 异常）；十页 smoke 全 PASS；目检 index-1280（hero 肖像比例已正常）与 act47-375（最长页无溢出）；三处标题"发暗"经 CDP 实测为缩略图观感非缺陷（R01b 记录的坑第二次应验——象牙白 rgb(242,236,220)、opacity 1 实证）。
- **坑**：①HTML 的 width/height 属性与 CSS width:100% 组合会静默拉伸图片（CSS 只覆盖宽度不覆盖高度）——图注类图片必须 `height: auto`；②失真检测的正确姿势是比较 naturalWidth/Height 比例与 clientWidth/Height 比例（object-fit:cover 的封面类图片按设计裁切需排除）。

### 待办池（不占轮次，随手可清）
- 无



































### 遗留问题
- 无

### 审计记录（2026-10-03 02:35 主会话）
- 旧定时任务 automation-d9dd6bef 已由用户从 Automations 页删除（它此前每次触发都被服务商内容过滤 1301 拦死，从未真正施工）；新任务 automation-79a585bc 已注册（精简提示词，一切以 PROMPT.md 现文为准），02:59 起每 25 分钟一轮；**后应用户要求改为每 20 分钟一轮，同轮 smoke.mjs 升级：版本断言改"页脚=meta 一致性校验"（不再硬编码版本号）、首页专属断言仅对 index.html 生效（其余页走通用验收线），R02 起升版不再炸冒烟**。
- **事故**：02:28–02:35 之间 PROMPT.md 与 PROGRESS.md 被用户误删（用户已确认；git 中完好），已原样恢复。后续轮若发现任务书/账本缺失：先 `git restore PROMPT.md PROGRESS.md` 再动手，勿自行重建。
