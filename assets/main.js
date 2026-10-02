/* 川流不息 · THE TRUMP LEGEND — main.js (v0.14.0-R13) */
(function () {
  "use strict";

  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 版本戳：页脚读 <meta name="site-version">
  function stampVersion() {
    var meta = document.querySelector('meta[name="site-version"]');
    var el = document.getElementById("site-version");
    if (meta && el) el.textContent = meta.getAttribute("content") || "dev";
  }

  // 分格入场：IntersectionObserver + 同批错峰编排（R13），reduced-motion 时 CSS 已直出
  function observeReveals() {
    var items = document.querySelectorAll(".panel-reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var shown = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // 同批进入的元素按先后 70ms 错峰（封顶 280ms，避免压过冒烟等待窗口）
        e.target.style.transitionDelay = REDUCE ? "0ms" : Math.min(shown * 70, 280) + "ms";
        e.target.classList.add("is-in");
        io.unobserve(e.target);
        e.target.addEventListener("transitionend", function h(ev) {
          if (ev.propertyName !== "opacity") return;
          e.target.style.transitionDelay = "";
          e.target.removeEventListener("transitionend", h);
        });
        shown += 1;
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  // 阅读进度条：顶部 3px 金线（R13）
  function initProgress() {
    if (document.getElementById("progress-bar")) return;
    var bar = document.createElement("div");
    bar.id = "progress-bar";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking = false;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // 时代导航滚动高亮：当前小节的年份亮起（R13，仅 timeline 有 .tl-rail）
  function initRailSpy() {
    var rail = document.querySelector(".tl-rail");
    if (!rail || !("IntersectionObserver" in window)) return;
    var links = [].slice.call(rail.querySelectorAll('a[href^="#"]'));
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var t = document.getElementById(a.getAttribute("href").slice(1));
      if (t) { map[t.id] = a; targets.push(t); }
    });
    if (!targets.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("is-active"); });
          (map[e.target.id] || { classList: { add: function () {} } }).classList.add("is-active");
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  // 返回顶部：滚动 600px 后浮现，键盘可达（R13）
  function initBackTop() {
    if (document.getElementById("back-top")) return;
    var btn = document.createElement("button");
    btn.id = "back-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "回到页首");
    btn.textContent = "\u2191";
    document.body.appendChild(btn);
    var show = function () {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", show, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" });
    });
    show();
  }

  // 移动端导航
  function bindNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function init() {
    stampVersion();
    observeReveals();
    initProgress();
    initRailSpy();
    initBackTop();
    bindNav();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
