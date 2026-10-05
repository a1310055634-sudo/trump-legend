// R90 quotes.html 80→105：新增第九展室（第二任期·25 块全实源）
import { readFileSync, writeFileSync } from "node:fs";
const F = new URL("../quotes.html", import.meta.url);
let t = readFileSync(F, "utf8");
const ANCHOR = '<section class="panel panel-reveal" style="margin-top:40px">\n    <span class="caption">番外展室 · 绰号学</span>';
if (!t.includes(ANCHOR)) { console.log("锚点未命中"); process.exit(1); }

const q = (en, who) => `  <div class="panel panel-reveal" style="margin-top:24px">
    <blockquote class="quote">
      "${en}"
      <span class="quote__who">${who}</span>
    </blockquote>
  </div>
`;

let h = `
  <!-- ================= 第九展室 · 第二任期（R90 增补，25 块全实源） ================= -->
  <section class="panel panel-reveal" style="margin-top:var(--sp-8)">
    <span class="caption">第九展室 · 第二任期 · 金色的台词（2025–2026，25 块全实源）</span>
    <p>这一展室收录第二任期的台词。分层口径：<strong>讲台馆逐字稿交叉 9 条、卷·09 社媒交叉 3 条（达交叉上限）、卷·07 快照与卷·31 工程台账已核 2 条、本轮新核 11 条</strong>——零降级条目，每句都有可点回的出处。组别按场合排：重返白宫、国会演说、从 Quantico 到内阁桌、舞厅四重奏、2026 的语感。</p>
  </section>

  <div class="panel panel-reveal" style="margin-top:24px">
    <span class="caption">组一 · 重返白宫（就职演说 · 2025-01-20）</span>
  </div>
`;

h += q("The golden age of America begins right now. From this day forward, our country will flourish and be respected again all over the world.",
  "编辑部译：「美国的黄金时代，从此刻开始。从今天起，我们的国家将蓬勃发展、在全世界重获尊重。」｜2025-01-20 · 就职演说开场（卷·10 逐字稿交叉）——与八年前同一天的“美国浩劫”开场对仗成书。");
h += q("Our sovereignty will be reclaimed. Our safety will be restored. The scales of justice will be rebalanced.",
  "编辑部译：「我们的主权将被收回，我们的安全将被恢复，正义的天平将被重新摆正。」｜2025-01-20 · 就职演说（卷·10 逐字稿交叉）。");
h += q("First, I will declare a national emergency at our southern border.",
  "编辑部译：「首先，我将宣布南部边境进入国家紧急状态。」｜2025-01-20 · 就职演说（卷·10 逐字稿交叉）——“First”排在清单第一位的事，后来长成了<a href=\“immigration.html\”>卷·32 边境与驱逐</a>的一整馆台账。");
h += q("We will drill, baby, drill.",
  "编辑部译：「我们将钻探，宝贝，钻探。」｜2025-01-20 · 就职演说（卷·10 逐字稿交叉）——借来的 2008 年集会口号，变成了国家能源政策的三个词。");
h += q("...restoring the name of the great President William McKinley... changing the name of the Gulf of Mexico to the Gulf of America...",
  "编辑部译：「……恢复伟大的威廉·麦金莱总统之名……把墨西哥湾的名字改为美国湾……」（片段照录）｜2025-01-20 · 就职演说（卷·10 逐字稿交叉）——后半个括号里的命名，一年后引爆了<a href=\“media.html\”>卷·30</a>里的 AP 准入战。");

h += `
  <div class="panel panel-reveal" style="margin-top:24px">
    <span class="caption">组二 · 国会演说（2025-03-04）</span>
  </div>
`;
h += q("My proudest legacy will be that of a peacemaker and unifier.",
  "编辑部译：「我最自豪的政治遗产，将是成为一个缔造和平的人、一个弥合分裂的人。」｜2025-03-04 · 国会联席演说（卷·10 逐字稿交叉）。");
h += q("Whatever they tax us, we will tax them.",
  "编辑部译：「他们对课我们什么税，我们就课他们什么税。」｜2025-03-04 · 国会联席演说（卷·10 逐字稿交叉）——对等关税的一句话版本，后来被最高法院（卷·18 第五幅）拆掉了授权地基。");
h += q("As a result, illegal border crossings last month were, by far, the lowest ever recorded.",
  "编辑部译：「结果是：上月非法越境数量，是有记录以来最低的。」｜2025-03-04 · 国会联席演说（卷·10 逐字稿交叉）——这句的完整曲线，见<a href=\“immigration.html\”>卷·32</a>第六节的坠落折线。");
h += q("...get ready for an incredible future, because the golden age of America has only just begun.",
  "编辑部译：「……准备好迎接难以置信的未来吧，因为美利坚的黄金时代才刚刚开始。」（片段照录）｜2025-03-04 · 国会联席演说收尾（卷·10 逐字稿交叉）。");

h += `
  <div class="panel panel-reveal" style="margin-top:24px">
    <span class="caption">组三 · 从 Quantico 到内阁桌</span>
  </div>
`;
h += q("This is going to be a big thing for the people in this room, because it's the enemy from within, and we have to handle it before it gets out of control.",
  "编辑部译：「这对在这个房间里的人来说将是件大事——因为它是来自内部的敌人，我们必须在它失控之前处理好它。」｜2025-09-30 · Quantico 将军集合讲话（NPR 引述原文；BBC/CNN 逐字稿口径）——同场他还把美国城市称作军方的潜在\“训练场\”。争议双写与全场语境见卷·07。");
h += q("We have the strongest military anywhere in the world... You saw what we did with Venezuela. That worked out very quickly.",
  "编辑部译：「我们拥有全世界最强的军队……你们看到了我们对委内瑞拉做了什么。那件事解决得非常快。」｜2026-05-28 · 内阁会议（Rev.com 逐字稿在案）——\“解决得非常快\”指的是 2026-01-03 马杜罗被抓捕的那一夜（卷·07 第五幕）。");
h += q("They will never give me a Nobel Peace Prize. It's too bad. I deserve it, but they will never give it to me.",
  "编辑部译：「他们永远不会给我诺贝尔和平奖。太糟了。我配得上，但他们永远不会给我。」｜2025-02 · 白宫会议发言（BBC/NBC/今日美国多源一致口径）——八个月后，和平奖颁给了马查多；再四个月，奖章被亲自送进了白宫（卷·07 第七幕）。");
h += q("I could know about it. I didn't.",
  "编辑部译：「我可以知道这些事。但我没去知道。」（片段照录）｜第二任期 · CNBC 专访（Joe Kernen 主持）——被问及家族加密生意获利时的自辩（CNBC 官网标题原话）；播出日期以 CNBC 档案页为准，本馆核验窗未取到日粒度（如实注记）。利益冲突的双写全景见<a href=\“crypto.html\”>卷·29</a>第七节。");
h += q("It gets soaking wet...",
  "编辑部译：「（草坪）会湿透……」（片段照录，两词已核）｜2025-04 · 公开表态（多家媒体报道口径）——玫瑰园草坪换石板的理由，一条关于湿草坪的抱怨，最后变成了 190 万美元的工程（<a href=\“renovation.html\”>卷·31</a>第一节）。");

h += `
  <div class="panel panel-reveal" style="margin-top:24px">
    <span class="caption">组四 · 舞厅四重奏（2025–2026）</span>
  </div>
`;
h += q("This beautiful building will be, when complete, the much anticipated White House Ballroom — The Greatest of its kind ever built!...",
  "编辑部译：「这座美丽的建筑完工之时，就是万众期待的白宫舞厅——有史以来建造的同类建筑中最伟大的一座！……」（片段照录）｜2025 · Truth Social 效果图配文（卷·09 原帖交叉）——取代对象是\“很小、破旧、反复重建过多次的东翼\”；工程的造价三级跳与司法战，全档在<a href=\“renovation.html\”>卷·31</a>第二节。");
h += q("I built many ballrooms in many buildings... And that's my greatest strength, actually. I might as well do this.",
  "编辑部译：「我在很多楼里建过很多舞厅……这其实是我最大的强项。那我不妨来做这件事。」｜2025-11-12 · 白宫舞厅晚宴（The Hill 报道原话口径）。");
h += q("I think it'll be the greatest ballroom anywhere in the world... It pays total homage to the White House.",
  "编辑部译：「我想它会是全世界最伟大的舞厅……它向白宫致以十足的敬意。」｜2026-03-29 · 福克斯访谈（报道原话口径）。");
h += q("I build ballrooms. I build the greatest ballrooms and you can come down to Florida to see them.",
  "编辑部译：「我建舞厅。我建的是最伟大的舞厅，你们可以来佛罗里达亲眼看看。」｜2025-07 · 转述自其友人 Axelrod 的引述（NPR 口径）——三句舞厅语录排在一起，语法不同、句式相同。");

h += `
  <div class="panel panel-reveal" style="margin-top:24px">
    <span class="caption">组五 · 2026 的语感（国情咨文与日常）</span>
  </div>
`;
h += q("This is the golden age of America. When I last spoke in this chamber 12 months ago, I had just inherited a nation in crisis...",
  "编辑部译：「这就是美利坚的黄金时代。十二个月前我最后一次在这个大厅讲话时，我继承的还是一个危机中的国家……」（片段照录）｜2026-02-24 · 国情咨文（卷·10 逐字稿交叉）——注意主语的变化：黄金时代从\“开始\”（就职）变成了\“就是\”（一周年）。");
h += q("But tonight, after just one year, I can say with dignity and pride that we have achieved a transformation like no one has ever seen before.",
  "编辑部译：「但今晚，只用了一年，我可以带着尊严与自豪说：我们完成了一场前所未见的转型。」｜2026-02-24 · 国情咨文（卷·10 逐字稿交叉）。");
h += q("That's why in a breakthrough operation last June, the United States military obliterated Iran's nuclear weapons program.",
  "编辑部译：「这就是为什么在去年六月的一次突破性行动中，美国军队摧毁了伊朗的核武器计划。」｜2026-02-24 · 国情咨文（卷·10 逐字稿交叉）——\“去年六月\”指的是 B-2 钻地弹之夜（卷·07 第四幕；伊朗线的后续同样在那幕）。");
h += q("And our future will be bigger, better, brighter, bolder and more glorious than ever before. Thank you. God bless you and God bless America.",
  "编辑部译：「我们的未来会比如今更大、更好、更明亮、更大胆、也更辉煌。谢谢你们。上帝保佑你们，上帝保佑美国。」｜2026-02-24 · 国情咨文收尾（卷·10 逐字稿交叉）——五个比较级，是这一展室里最接近修辞的一次。");
h += q("...all Adult Citizens... $5,000... forward to signing those checks!...",
  "编辑部译：「……全体成年公民……5,000 美元……期待亲自签下那些支票！……」（片段照录）｜2026-10-04 · Truth Social（卷·09 原帖交叉）——中期动员的支票承诺，与同日的\“淹没他们\”网站直链打包发出；距开票整月（卷·07 幕间快照）。");
h += q("...don't want to 'LOCK THE CLOCK!'... PGA TOUR... 65%+... House vote of 308 to 117...",
  "编辑部译：「……不想\“锁定时钟\”！……PGA 巡回赛……65% 以上……众议院 308 对 117 的表决……」（片段照录）｜2026-10 · Truth Social 夏令时帖（卷·09 原帖交叉）——引民意、引职业高尔夫、引众院表决，末尾附上同党参议员的办公室电话：Truth Social 治国的标准姿势。");
h += q("...should be arrested for their dishonesty.",
  "编辑部译：「……应当因为不诚实而被捕。」（片段照录）｜2026-10-05 · Truth Social（卷·07 快照③存档直取交叉）——为俄亥俄集会\“空座位\”报道点名媒体；同日另一帖指控《纽约时报》\“修图\”。媒体战争的语汇归<a href=\“lexicon.html\”>卷·22</a>，制度归<a href=\“media.html\”>卷·30</a>，这一句挂在两个台账中间。");

t = t.replace(ANCHOR, ANCHOR + h);
// 馆后记更新：80→105
t = t.replace("<p>八十句话，八十年语言。", "<p>一百零五句话，八十年语言（第九展室为 V4 增补的 25 块第二任期全实源语料）。");
writeFileSync(F, t);
const body = t.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
console.log("CJK:", (body.match(/[\u4e00-\u9fff]/g) || []).length);
console.log("blockquote total:", (t.match(/<blockquote class="quote"/g) || []).length);
