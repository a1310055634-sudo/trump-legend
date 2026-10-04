// R49 coordinate calculator for 5 new/updated SVG charts in data.html
// Print all computed coordinates; do not touch the HTML.

console.log('=== 图1升级 · 支持率 8 节点（y = 524 - 8.8v；x = 70 + i*90，7 点） ===');
const nodes = [
  ['45%', 45, '70', '2017-02', 'gold'],
  ['49%', 49, '160', '2020-03', 'gold'],
  ['34%', 34, '250', '2021-01卸任', 'gold'],
  ['47%', 47, '340', '2025-01', 'gold-bright'],
  ['45%', 45, '430', '2025-02', 'gold-bright'],
  ['36%', 36, '520', '2025-10', 'gold-bright'],
  ['34%', 34, '610', '2026-08皮尤', 'gold-bright'],
];
for (const [lab, v, x, date] of nodes) console.log(`  ${date}: x=${x} y=${(524 - 8.8 * v).toFixed(1)}`);
console.log('  term1 polyline: 70,128 160,92.8 250,224.8');
console.log('  term2 polyline: 340,110.4 430,128 520,207.2 610,224.8');
console.log('  gap dash: 250,224.8 -> 340,110.4');

console.log('\n=== 图4 · 关税时间线（水平，y 轴线 150；节点 x=120/340/560） ===');
console.log('  nodes: 120=2025-04-02 解放日 145%；340=2025-05-12 日内瓦 145→30；560=2026-02-20 SCOTUS 6:3 违宪');

console.log('\n=== 图5 · DJT 股价（y = 260 - 2.75v；x = 70/205/340/475/610） ===');
const djt = [
  ['$79.38', 79.38, '70', '2024-03 上市峰值'],
  ['$17.89', 17.89, '205', '2024-09-03'],
  ['$13.55', 13.55, '340', '2024-09 解禁日'],
  ['$10.85', 10.85, '475', '2025-11'],
  ['$7.52', 7.52, '610', '2026-06-25'],
];
let pts = [];
for (const [lab, v, x, date] of djt) { const y = (260 - 2.75 * v).toFixed(1); pts.push(`${x},${y}`); console.log(`  ${date}: x=${x} y=${y}`); }
console.log('  polyline:', pts.join(' '));

console.log('\n=== 图6 · 四大职系任人次柱状（h = v*50，y = 260-50v；bar w=70，x=110/230/350/470） ===');
const cab = [['幕僚长', 4, 110], ['国务卿', 2, 230], ['国防部长', 4, 350], ['国安顾问', 4, 470]];
for (const [lab, v, x] of cab) console.log(`  ${lab}: x=${x} y=${260 - 50 * v} h=${50 * v}`);

console.log('\n=== 图7 · 2024 摇摆州胜负差横条（w = v/6*460，bar h=18，y=60+30i；state 文字 x=120 end） ===');
const st = [
  ['威斯康星', 0.9, '29,397'],
  ['密歇根', 1.4, '80,103'],
  ['宾州', 1.7, '120,266'],
  ['佐治亚', 2.2, '约125,000'],
  ['北卡罗来纳', 3.0, '约180,000'],
  ['内华达', 3.1, '约46,000'],
  ['亚利桑那', 5.9, '约187,000'],
];
st.forEach(([lab, v, votes], i) => {
  const y = 60 + 30 * i;
  console.log(`  ${lab}: y=${y} w=${(v / 6 * 460).toFixed(1)} (值 +${v}% · ${votes} 票)`);
});
