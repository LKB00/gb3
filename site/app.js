/* FinStocks AI landing page behaviour
   - theme toggle (system by default, remembered per browser)
   - mobile nav
   - hero demo: prompt -> readable rules -> hypothetical backtest chart (pre-scripted, no live advice)
   - control panel switches
   - scroll reveal
*/
(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- theme ---------- */
  try {
    const saved = localStorage.getItem("fs-theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}
  const themeBtn = $("#themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const current = root.getAttribute("data-theme") || (systemDark ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("fs-theme", next); } catch (e) {}
    });
  }

  /* ---------- mobile nav ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  /* ---------- demo data (simulated; labelled hypothetical in the UI) ---------- */
  // Each scenario: a prompt, the rules the AI would draft, and 36 monthly index values
  // for the strategy and the Nifty 50 benchmark (both rebased to 100). Values are
  // illustrative shapes, not market data, so the demo can never read as advice.
  const MONTHS = ["Jan 23", "Apr 23", "Jul 23", "Oct 23", "Jan 24", "Apr 24", "Jul 24", "Oct 24", "Jan 25", "Apr 25", "Jul 25", "Oct 25", "Dec 25"];
  function series(seed, drift, vol, n) {
    // deterministic pseudo-random walk so every visitor sees the same picture
    let x = seed, v = 100; const out = [100];
    for (let i = 1; i < n; i++) {
      x = (x * 9301 + 49297) % 233280;
      const r = x / 233280 - 0.5;
      v = v * (1 + drift + r * vol);
      out.push(v);
    }
    return out;
  }
  const SCENARIOS = [
    {
      key: "largecap",
      prompt: "Invest ₹10,000 across large caps, rebalance monthly",
      rules: [
        ["Universe", "Nifty 100 constituents only"],
        ["Weighting", "Equal weight across 10 stocks by 6-month momentum"],
        ["Rebalance", "First trading day of every month"],
        ["Exit", "Drop a stock if it falls 8% from entry"],
        ["Cap", "Never deploy more than ₹10,000"],
      ],
      strategy: series(17, 0.0095, 0.062, 36),
      bench: series(41, 0.0085, 0.055, 36),
      stats: [["Max drawdown", "−11.4%"], ["Rebalances", "36"], ["Avg. holdings", "10"]],
    },
    {
      key: "dividend",
      prompt: "Build a steady dividend portfolio, low churn",
      rules: [
        ["Universe", "Stocks with 5+ years of uninterrupted dividends"],
        ["Filter", "Dividend yield above the Nifty 50 average"],
        ["Weighting", "Weight by dividend consistency, capped at 12% each"],
        ["Rebalance", "Quarterly, only when weights drift 3%+"],
        ["Exit", "Remove any company that cuts its dividend"],
      ],
      strategy: series(23, 0.0072, 0.038, 36),
      bench: series(41, 0.0085, 0.055, 36),
      stats: [["Max drawdown", "−7.9%"], ["Rebalances", "12"], ["Avg. holdings", "14"]],
    },
    {
      key: "trend",
      prompt: "Follow the trend in banking stocks, exit on weakness",
      rules: [
        ["Universe", "Nifty Bank constituents"],
        ["Entry", "Price above its 50-day average for 5 sessions"],
        ["Position", "Max 20% of capital per stock"],
        ["Exit", "Close below the 50-day average, or 6% stop from entry"],
        ["Hours", "Orders only during exchange hours, never pre-open"],
      ],
      strategy: series(9, 0.0088, 0.09, 36),
      bench: series(41, 0.0085, 0.055, 36),
      stats: [["Max drawdown", "−16.2%"], ["Trades", "58"], ["Time in cash", "31%"]],
    },
  ];

  /* ---------- demo UI ---------- */
  const chips = $$(".chip");
  const input = $("#promptInput");
  const runBtn = $("#runPrompt");
  const rulesEl = $("#rules");
  const chartEl = $("#chart");
  const tipEl = $("#tip");
  const statsEl = $("#stats");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let typingTimer = null;

  function renderRules(rules) {
    rulesEl.innerHTML = "";
    rules.forEach((r, i) => {
      const li = document.createElement("li");
      li.style.animationDelay = reduceMotion ? "0s" : i * 0.08 + "s";
      li.innerHTML = '<span class="k">' + (i + 1) + "</span><span><strong>" + r[0] + ".</strong> " + r[1] + "</span>";
      rulesEl.appendChild(li);
    });
  }

  function renderStats(stats) {
    statsEl.innerHTML = stats.map((s) => '<div class="stat"><div class="l">' + s[0] + '</div><div class="v">' + s[1] + "</div></div>").join("");
  }

  function renderChart(sc) {
    const W = 560, H = 245, padL = 34, padR = 44, padT = 14, padB = 26;
    const n = sc.strategy.length;
    const all = sc.strategy.concat(sc.bench);
    const minV = Math.floor(Math.min.apply(null, all) / 10) * 10;
    const maxV = Math.ceil(Math.max.apply(null, all) / 10) * 10;
    const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
    const y = (v) => padT + (1 - (v - minV) / (maxV - minV)) * (H - padT - padB);
    const path = (arr) => arr.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");

    // y grid: 4 lines at round values the data actually spans
    const ticks = [];
    const step = (maxV - minV) / 4;
    for (let k = 0; k <= 4; k++) ticks.push(Math.round(minV + step * k));

    let svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Hypothetical growth of 100 for the strategy versus the Nifty 50, simulated">';
    svg += '<g class="grid">' + ticks.map((t) => '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y(t).toFixed(1) + '" y2="' + y(t).toFixed(1) + '"/>').join("") + "</g>";
    svg += '<g class="axis">' + ticks.map((t) => '<text x="' + (padL - 6) + '" y="' + (y(t) + 3).toFixed(1) + '" text-anchor="end">' + t + "</text>").join("");
    // x labels: every 9th month plus the last
    [0, 9, 18, 27, 35].forEach((i) => {
      const label = MONTHS[Math.round((i / 35) * (MONTHS.length - 1))];
      svg += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? "start" : i === 35 ? "end" : "middle") + '">' + label + "</text>";
    });
    svg += "</g>";
    svg += '<path class="area" d="' + path(sc.strategy) + " L" + x(n - 1).toFixed(1) + " " + y(minV).toFixed(1) + " L" + padL + " " + y(minV).toFixed(1) + ' Z"/>';
    svg += '<path class="b" d="' + path(sc.bench) + '"/>';
    svg += '<path class="s" d="' + path(sc.strategy) + '"/>';
    const lastS = sc.strategy[n - 1], lastB = sc.bench[n - 1];
    svg += '<circle class="dot" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastS).toFixed(1) + '"/>';
    svg += '<circle class="dot b" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastB).toFixed(1) + '"/>';
    // direct end labels, nudged apart if they collide
    let ys = y(lastS), yb = y(lastB);
    if (Math.abs(ys - yb) < 12) { const mid = (ys + yb) / 2; ys = ys < yb ? mid - 7 : mid + 7; yb = ys < yb ? mid + 7 : mid - 7; }
    svg += '<text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (ys + 3).toFixed(1) + '">Strategy</text>';
    svg += '<text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (yb + 3).toFixed(1) + '">Nifty 50</text>';
    svg += '<line id="cross" class="cross" y1="' + padT + '" y2="' + (H - padB) + '" x1="0" x2="0" style="opacity:0"/>';
    svg += '<rect id="hit" x="' + padL + '" y="0" width="' + (W - padL - padR) + '" height="' + H + '" fill="transparent"/>';
    svg += "</svg>";
    chartEl.innerHTML = svg;

    // hover crosshair + tooltip
    const svgEl = $("svg", chartEl), hit = $("#hit", chartEl), cross = $("#cross", chartEl);
    function move(ev) {
      const rect = svgEl.getBoundingClientRect();
      const px = ((ev.clientX - rect.left) / rect.width) * W;
      const i = Math.max(0, Math.min(n - 1, Math.round(((px - padL) / (W - padL - padR)) * (n - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.style.opacity = 1;
      const m = MONTHS[Math.round((i / (n - 1)) * (MONTHS.length - 1))];
      tipEl.innerHTML = "<b>" + m + "</b><br>Strategy " + sc.strategy[i].toFixed(1) + " · Nifty 50 " + sc.bench[i].toFixed(1);
      tipEl.style.left = (x(i) / W) * 100 + "%";
      tipEl.style.top = (Math.min(y(sc.strategy[i]), y(sc.bench[i])) / H) * 100 + "%";
      tipEl.style.opacity = 1;
    }
    function leave() { cross.style.opacity = 0; tipEl.style.opacity = 0; }
    hit.addEventListener("pointermove", move);
    hit.addEventListener("pointerleave", leave);
  }

  function run(sc) {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.key === sc.key)));
    renderRules(sc.rules);
    renderChart(sc);
    renderStats(sc.stats);
  }

  function typeInto(text, done) {
    clearInterval(typingTimer);
    if (reduceMotion) { input.value = text; done(); return; }
    input.value = "";
    let i = 0;
    typingTimer = setInterval(() => {
      input.value = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(typingTimer); done(); }
    }, 22);
  }

  function pick(sc) { typeInto(sc.prompt, () => run(sc)); }

  function fromFreeText() {
    const q = (input.value || "").toLowerCase();
    let sc = SCENARIOS[0];
    if (/dividend|income|steady|low churn/.test(q)) sc = SCENARIOS[1];
    else if (/trend|momentum|bank|exit|breakout/.test(q)) sc = SCENARIOS[2];
    run(sc);
  }

  if (input && rulesEl && chartEl) {
    chips.forEach((c) => c.addEventListener("click", () => pick(SCENARIOS.find((s) => s.key === c.dataset.key))));
    runBtn.addEventListener("click", fromFreeText);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") fromFreeText(); });
    // render at rest so the first frame already shows the whole loop
    input.value = SCENARIOS[0].prompt;
    run(SCENARIOS[0]);
  }

  /* ---------- control panel switches ---------- */
  const status = $("#panelStatus");
  $$(".switch").forEach((sw) => {
    sw.addEventListener("click", () => {
      const on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", String(on));
      if (sw.id === "autopilot" && status) {
        status.classList.toggle("paused", !on);
        $("span", status).textContent = on ? "Autopilot running within your limits" : "Autopilot paused. Open positions stay in your broker account.";
      }
    });
  });

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = $$(".faq details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- scroll reveal ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pending"); en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- footer year ---------- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
})();
