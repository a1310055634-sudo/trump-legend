/* 川流不息 · THE TRUMP LEGEND — main.js (v0.1.0-R01) */
(function () {
  "use strict";

  // 版本戳：页脚读 <meta name="site-version">
  function stampVersion() {
    var meta = document.querySelector('meta[name="site-version"]');
    var el = document.getElementById("site-version");
    if (meta && el) el.textContent = meta.getAttribute("content") || "dev";
  }

  // 分格入场：IntersectionObserver，reduced-motion 时 CSS 已直出
  function observeReveals() {
    var items = document.querySelectorAll(".panel-reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (n) { io.observe(n); });
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

  function init() { stampVersion(); observeReveals(); bindNav(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
