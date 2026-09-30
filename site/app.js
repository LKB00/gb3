/* FinStocks AI landing page v2
   - header state on scroll, mobile nav
   - NSE ticker strip (illustrative values)
   - hero app scene: 3D tilt, prompt -> rules -> hypothetical backtest chart (pre-scripted)
   - phone control panel switches
   - transform-only scroll reveal
*/
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- header ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  const nav = $("#nav"), navToggle = $("#navToggle");
  navToggle.addEventListener("click", () => navToggle.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));
  $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- ticker (illustrative, not live) ---------- */
  const TICKS = [
    ["NIFTY 50", "24,812.40", "+0.42"], ["BANKNIFTY", "52,104.15", "+0.18"], ["RELIANCE", "2,931.20", "+0.71"],
    ["HDFCBANK", "1,684.55", "-0.22"], ["TCS", "4,102.90", "+0.35"], ["INFY", "1,876.30", "-0.48"],
    ["ICICIBANK", "1,242.75", "+0.56"], ["BHARTIARTL", "1,598.10", "+1.02"], ["ITC", "462.35", "-0.11"],
    ["LT", "3,644.00", "+0.29"], ["SBIN", "812.60", "+0.64"], ["HINDUNILVR", "2,455.85", "-0.37"],
  ];
  const track = $("#tickerTrack");
  const one = TICKS.map((t) => '<span class="ticker-item"><span class="sym">' + t[0] + '</span><span class="px num">' + t[1] + '</span><span class="chg ' + (t[2][0] === "-" ? "down" : "up") + '">' + t[2] + "%</span></span>").join("") + '<span class="ticker-item note">Illustrative quotes · not live market data</span>';
  track.innerHTML = one + one;

  /* ---------- scenarios (simulated; labelled hypothetical in the UI) ---------- */
  const MONTHS = ["Jan 23", "Apr 23", "Jul 23", "Oct 23", "Jan 24", "Apr 24", "Jul 24", "Oct 24", "Jan 25", "Apr 25", "Jul 25", "Oct 25", "Dec 25"];
  function series(seed, drift, vol, n) {
    let x = seed, v = 100; const out = [100];
    for (let i = 1; i < n; i++) { x = (x * 9301 + 49297) % 233280; v *= 1 + drift + (x / 233280 - 0.5) * vol; out.push(v); }
    return out;
  }
  const BENCH = series(41, 0.0085, 0.055, 36);
  const SCENARIOS = [
    { key: "largecap", prompt: "Invest ₹10,000 across large caps, rebalance monthly",
      rules: [["Universe", "Nifty 100 constituents only"], ["Weighting", "Equal weight, top 10 by 6-month momentum"], ["Rebalance", "First trading day of every month"], ["Exit", "Drop a stock if it falls 8% from entry"], ["Cap", "Never deploy more than ₹10,000"]],
      strategy: series(17, 0.0095, 0.062, 36), stats: [["Max drawdown", "−11.4%"], ["Rebalances", "36"], ["Avg. holdings", "10"]] },
    { key: "dividend", prompt: "Build a steady dividend portfolio, low churn",
      rules: [["Universe", "5+ years of uninterrupted dividends"], ["Filter", "Yield above the Nifty 50 average"], ["Weighting", "By consistency, capped at 12% each"], ["Rebalance", "Quarterly, only when weights drift 3%+"], ["Exit", "Remove any company that cuts its dividend"]],
      strategy: series(23, 0.0072, 0.038, 36), stats: [["Max drawdown", "−7.9%"], ["Rebalances", "12"], ["Avg. holdings", "14"]] },
    { key: "trend", prompt: "Follow the trend in banking stocks, exit on weakness",
      rules: [["Universe", "Nifty Bank constituents"], ["Entry", "Price above 50-day average for 5 sessions"], ["Position", "Max 20% of capital per stock"], ["Exit", "Close below 50-day average, or 6% stop"], ["Hours", "Orders only in exchange hours, never pre-open"]],
      strategy: series(9, 0.0088, 0.09, 36), stats: [["Max drawdown", "−16.2%"], ["Trades", "58"], ["Time in cash", "31%"]] },
  ];

  /* ---------- demo ---------- */
  const chips = $$(".chip"), input = $("#promptInput"), runBtn = $("#runPrompt");
  const rulesEl = $("#rules"), chartEl = $("#chart"), tipEl = $("#tip"), statsEl = $("#stats");
  let typingTimer = null;

  function renderRules(rules) {
    rulesEl.innerHTML = rules.map((r, i) => '<li style="animation-delay:' + (reduceMotion ? 0 : i * 0.09) + 's"><span class="k">0' + (i + 1) + '</span><span><strong>' + r[0] + ".</strong> " + r[1] + "</span></li>").join("");
  }
  function renderStats(stats) {
    statsEl.innerHTML = stats.map((s) => '<div class="stat"><div class="l">' + s[0] + '</div><div class="v">' + s[1] + "</div></div>").join("");
  }
  function renderChart(sc) {
    const W = 560, H = 262, padL = 34, padR = 52, padT = 14, padB = 26, n = sc.strategy.length;
    const all = sc.strategy.concat(BENCH);
    const minV = Math.floor(Math.min.apply(null, all) / 10) * 10, maxV = Math.ceil(Math.max.apply(null, all) / 10) * 10;
    const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
    const y = (v) => padT + (1 - (v - minV) / (maxV - minV)) * (H - padT - padB);
    const path = (arr) => arr.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
    const ticks = []; for (let k = 0; k <= 4; k++) ticks.push(Math.round(minV + ((maxV - minV) / 4) * k));
    let s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Hypothetical growth of 100 for the strategy versus the Nifty 50, simulated">';
    s += '<defs><linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d6b66e" stop-opacity="0.22"/><stop offset="1" stop-color="#d6b66e" stop-opacity="0"/></linearGradient></defs>';
    s += '<g class="grid">' + ticks.map((t) => '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y(t).toFixed(1) + '" y2="' + y(t).toFixed(1) + '"/>').join("") + "</g>";
    s += '<g class="axis">' + ticks.map((t) => '<text x="' + (padL - 6) + '" y="' + (y(t) + 3).toFixed(1) + '" text-anchor="end">' + t + "</text>").join("");
    [0, 9, 18, 27, 35].forEach((i) => { s += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? "start" : i === 35 ? "end" : "middle") + '">' + MONTHS[Math.round((i / 35) * (MONTHS.length - 1))] + "</text>"; });
    s += "</g>";
    s += '<path class="area" d="' + path(sc.strategy) + " L" + x(n - 1).toFixed(1) + " " + y(minV).toFixed(1) + " L" + padL + " " + y(minV).toFixed(1) + ' Z"/>';
    s += '<path class="b" d="' + path(BENCH) + '"/><path class="s" d="' + path(sc.strategy) + '"/>';
    const lastS = sc.strategy[n - 1], lastB = BENCH[n - 1];
    s += '<circle class="dot" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastS).toFixed(1) + '"/><circle class="dot b" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastB).toFixed(1) + '"/>';
    let ys = y(lastS), yb = y(lastB);
    if (Math.abs(ys - yb) < 12) { const mid = (ys + yb) / 2, sUp = ys < yb; ys = sUp ? mid - 7 : mid + 7; yb = sUp ? mid + 7 : mid - 7; }
    s += '<text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (ys + 3).toFixed(1) + '">Strategy</text><text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (yb + 3).toFixed(1) + '">Nifty 50</text>';
    s += '<line id="cross" class="cross" y1="' + padT + '" y2="' + (H - padB) + '" x1="0" x2="0" style="opacity:0"/><rect id="hit" x="' + padL + '" y="0" width="' + (W - padL - padR) + '" height="' + H + '" fill="transparent"/></svg>';
    chartEl.innerHTML = s;
    const svgEl = $("svg", chartEl), hit = $("#hit", chartEl), cross = $("#cross", chartEl);
    hit.addEventListener("pointermove", (ev) => {
      const rect = svgEl.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * W;
      const i = Math.max(0, Math.min(n - 1, Math.round(((px - padL) / (W - padL - padR)) * (n - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.style.opacity = 1;
      tipEl.innerHTML = "<b>" + MONTHS[Math.round((i / (n - 1)) * (MONTHS.length - 1))] + "</b>&nbsp; S " + sc.strategy[i].toFixed(1) + " · N50 " + BENCH[i].toFixed(1);
      tipEl.style.left = (x(i) / W) * 100 + "%";
      tipEl.style.top = (Math.min(y(sc.strategy[i]), y(BENCH[i])) / H) * 100 + "%";
      tipEl.style.opacity = 1;
    });
    hit.addEventListener("pointerleave", () => { cross.style.opacity = 0; tipEl.style.opacity = 0; });
  }
  function run(sc) { chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.key === sc.key))); renderRules(sc.rules); renderChart(sc); renderStats(sc.stats); }
  function typeInto(text, done) {
    clearInterval(typingTimer);
    if (reduceMotion) { input.value = text; done(); return; }
    input.value = ""; let i = 0;
    typingTimer = setInterval(() => { input.value = text.slice(0, ++i); if (i >= text.length) { clearInterval(typingTimer); done(); } }, 20);
  }
  function fromFreeText() {
    const q = (input.value || "").toLowerCase();
    let sc = SCENARIOS[0];
    if (/dividend|income|steady|low churn/.test(q)) sc = SCENARIOS[1];
    else if (/trend|momentum|bank|exit|breakout/.test(q)) sc = SCENARIOS[2];
    run(sc);
  }
  chips.forEach((c) => c.addEventListener("click", () => { const sc = SCENARIOS.find((s) => s.key === c.dataset.key); typeInto(sc.prompt, () => run(sc)); }));
  runBtn.addEventListener("click", fromFreeText);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") fromFreeText(); });
  input.value = SCENARIOS[0].prompt;
  run(SCENARIOS[0]);

  /* ---------- 3D tilt on the app scene (desktop pointers only) ---------- */
  const scene = $("#scene"), app = $("#app");
  if (finePointer && !reduceMotion) {
    scene.addEventListener("pointermove", (e) => {
      const r = scene.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      app.style.setProperty("--ry", (px * 6).toFixed(2) + "deg");
      app.style.setProperty("--rx", (6 - py * 6).toFixed(2) + "deg");
    });
    scene.addEventListener("pointerleave", () => { app.style.setProperty("--ry", "0deg"); app.style.setProperty("--rx", "6deg"); });
  }

  /* ---------- phone switches ---------- */
  const live = $("#phLive");
  $$(".switch").forEach((sw) => sw.addEventListener("click", () => {
    const on = sw.getAttribute("aria-checked") !== "true";
    sw.setAttribute("aria-checked", String(on));
    if (sw.id === "autopilot") { live.classList.toggle("paused", !on); $("span", live).textContent = on ? "Autopilot on · within limits" : "Paused · no new orders"; }
  }));

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = $$(".faq details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- scroll reveal (transform only) ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach((el) => { if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("pending"); });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pending"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  $("#year").textContent = new Date().getFullYear();
})();
