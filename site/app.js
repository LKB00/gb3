/* FinStocks AI landing page v4
   - hero chat box with animated example prompts
   - live chat thread in the product stage: steps -> streamed answer -> rules -> drawing chart -> actions
   - autoplay through examples while the stage is on screen, until the visitor takes over
   - phone notification, feature-still animations, reveal on scroll
   All AI output is pre-scripted and labelled simulated; nothing here is live advice. */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  /* ---------- header + nav ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  const nav = $("#nav"), navToggle = $("#navToggle");
  navToggle.addEventListener("click", () => navToggle.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));
  $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- scenarios (simulated) ---------- */
  const MONTHS = ["Jan 23", "Apr 23", "Jul 23", "Oct 23", "Jan 24", "Apr 24", "Jul 24", "Oct 24", "Jan 25", "Apr 25", "Jul 25", "Oct 25", "Dec 25"];
  function series(seed, drift, vol, n) {
    let x = seed, v = 100; const out = [100];
    for (let i = 1; i < n; i++) { x = (x * 9301 + 49297) % 233280; v *= 1 + drift + (x / 233280 - 0.5) * vol; out.push(v); }
    return out;
  }
  const BENCH = series(41, 0.0085, 0.055, 36);
  const SCENARIOS = [
    { key: "largecap", title: "Large caps, monthly",
      prompt: "Invest ₹10,000 in large caps, rebalance monthly",
      steps: ["Reading your prompt", "Screening 100 Nifty 100 stocks by 6-month momentum", "Simulating 36 months on NSE data", "Applying brokerage, STT and GST"],
      answer: "Here’s a draft for ₹10,000 across large caps. Five rules, all editable. I tested them on NSE data from Jan 2023 to Dec 2025 with costs included. The worst simulated month was −11.4%. Nothing runs until you approve it.",
      rules: [["Universe", "Nifty 100 constituents only"], ["Weighting", "Equal weight, top 10 by 6-month momentum"], ["Rebalance", "First trading day of every month"], ["Exit", "Drop a stock if it falls 8% from entry"], ["Cap", "Never deploy more than ₹10,000"]],
      strategy: series(17, 0.0095, 0.062, 36), stats: [["Max drawdown", "−11.4%"], ["Rebalances", "36"], ["Holdings", "10"]],
      order: ["BUY RELIANCE", "1 share · ₹2,931"] },
    { key: "dividend", title: "Dividend, low churn",
      prompt: "Build a steady dividend portfolio with low churn",
      steps: ["Reading your prompt", "Finding companies with 5+ years of unbroken dividends", "Simulating 36 months on NSE data", "Applying brokerage, STT and GST"],
      answer: "Here’s a low-churn dividend draft. It only holds companies with five or more years of uninterrupted dividends, and rebalances quarterly only when weights drift. Worst simulated month: −7.9%. Review the rules, then try it in Mock Mode.",
      rules: [["Universe", "5+ years of uninterrupted dividends"], ["Filter", "Yield above the Nifty 50 average"], ["Weighting", "By consistency, capped at 12% each"], ["Rebalance", "Quarterly, only when weights drift 3%+"], ["Exit", "Remove any company that cuts its dividend"]],
      strategy: series(23, 0.0072, 0.038, 36), stats: [["Max drawdown", "−7.9%"], ["Rebalances", "12"], ["Holdings", "14"]],
      order: ["BUY ITC", "4 shares · ₹1,849"] },
    { key: "trend", title: "Bank trend follower",
      prompt: "Follow the trend in banking stocks, exit on weakness",
      steps: ["Reading your prompt", "Scanning 12 Nifty Bank stocks against their 50-day average", "Simulating 36 months on NSE data", "Applying brokerage, STT and GST"],
      answer: "Here’s a trend-following draft for bank stocks. It enters after five sessions above the 50-day average, and exits on a close below it or a 6% stop. It sat in cash for about 31% of the simulated period. Worst simulated month: −16.2%.",
      rules: [["Universe", "Nifty Bank constituents"], ["Entry", "Above 50-day average for 5 sessions"], ["Position", "Max 20% of capital per stock"], ["Exit", "Close below 50-day average, or 6% stop"], ["Hours", "Exchange hours only, never pre-open"]],
      strategy: series(9, 0.0088, 0.09, 36), stats: [["Max drawdown", "−16.2%"], ["Trades", "58"], ["In cash", "31%"]],
      order: ["BUY ICICIBANK", "2 shares · ₹2,486"] },
  ];
  const byKey = (k) => SCENARIOS.find((s) => s.key === k);
  function match(text) {
    const q = (text || "").toLowerCase();
    if (/dividend|income|steady|churn|passive/.test(q)) return SCENARIOS[1];
    if (/trend|momentum|bank|exit|breakout|swing/.test(q)) return SCENARIOS[2];
    return SCENARIOS[0];
  }

  /* ---------- chart ---------- */
  let chartSeq = 0;
  function chartSVG(sc) {
    const id = "g" + ++chartSeq;
    const W = 560, H = 250, padL = 30, padR = 54, padT = 12, padB = 22, n = sc.strategy.length;
    const all = sc.strategy.concat(BENCH);
    const minV = Math.floor(Math.min.apply(null, all) / 10) * 10, maxV = Math.ceil(Math.max.apply(null, all) / 10) * 10;
    const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
    const y = (v) => padT + (1 - (v - minV) / (maxV - minV)) * (H - padT - padB);
    const path = (arr) => arr.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
    const ticks = []; for (let k = 0; k <= 4; k++) ticks.push(Math.round(minV + ((maxV - minV) / 4) * k));
    let s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Hypothetical growth of 100, strategy versus Nifty 50, simulated">';
    s += '<defs><linearGradient id="' + id + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#12805c" stop-opacity="0.16"/><stop offset="1" stop-color="#12805c" stop-opacity="0"/></linearGradient></defs>';
    s += '<g class="grid">' + ticks.map((t) => '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y(t).toFixed(1) + '" y2="' + y(t).toFixed(1) + '"/>').join("") + "</g>";
    s += '<g class="axis">' + ticks.map((t) => '<text x="' + (padL - 6) + '" y="' + (y(t) + 3).toFixed(1) + '" text-anchor="end">' + t + "</text>").join("");
    [0, 12, 24, 35].forEach((i) => { s += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="' + (i === 0 ? "start" : i === 35 ? "end" : "middle") + '">' + MONTHS[Math.round((i / 35) * (MONTHS.length - 1))] + "</text>"; });
    s += "</g><g class=\"plot\">";
    s += '<path d="' + path(sc.strategy) + " L" + x(n - 1).toFixed(1) + " " + y(minV).toFixed(1) + " L" + padL + " " + y(minV).toFixed(1) + ' Z" fill="url(#' + id + ')"/>';
    s += '<path class="b" d="' + path(BENCH) + '"/><path class="s" d="' + path(sc.strategy) + '"/>';
    const lastS = sc.strategy[n - 1], lastB = BENCH[n - 1];
    s += '<circle class="dot" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastS).toFixed(1) + '"/><circle class="dot b" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastB).toFixed(1) + '"/>';
    let ys = y(lastS), yb = y(lastB);
    if (Math.abs(ys - yb) < 12) { const mid = (ys + yb) / 2, up = ys < yb; ys = up ? mid - 7 : mid + 7; yb = up ? mid + 7 : mid - 7; }
    s += '<text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (ys + 3).toFixed(1) + '">Strategy</text><text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (yb + 3).toFixed(1) + '">Nifty 50</text>';
    s += '</g><line class="cross" y1="' + padT + '" y2="' + (H - padB) + '" x1="0" x2="0" style="opacity:0"/><rect class="hit" x="' + padL + '" y="0" width="' + (W - padL - padR) + '" height="' + H + '" fill="transparent"/></svg>';
    return { svg: s, W, H, x, y, n };
  }
  function mountChart(el, sc, animate) {
    const c = chartSVG(sc);
    el.innerHTML = c.svg + '<div class="tip"></div>';
    el.classList.toggle("static", !animate);
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("drawn")));
    const svgEl = $("svg", el), hit = $(".hit", el), cross = $(".cross", el), tip = $(".tip", el);
    hit.addEventListener("pointermove", (ev) => {
      const r = svgEl.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * c.W;
      const i = Math.max(0, Math.min(c.n - 1, Math.round(((px - 30) / (c.W - 84)) * (c.n - 1))));
      cross.setAttribute("x1", c.x(i)); cross.setAttribute("x2", c.x(i)); cross.style.opacity = 1;
      tip.innerHTML = "<b>" + MONTHS[Math.round((i / (c.n - 1)) * (MONTHS.length - 1))] + "</b>&nbsp; S " + sc.strategy[i].toFixed(1) + " · N50 " + BENCH[i].toFixed(1);
      tip.style.left = (c.x(i) / c.W) * 100 + "%";
      tip.style.top = (Math.min(c.y(sc.strategy[i]), c.y(BENCH[i])) / c.H) * 100 + "%";
      tip.style.opacity = 1;
    });
    hit.addEventListener("pointerleave", () => { cross.style.opacity = 0; tip.style.opacity = 0; });
  }

  /* ---------- chat thread ---------- */
  const thread = $("#thread");
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const toBottom = () => { thread.scrollTop = thread.scrollHeight; };
  let runId = 0;

  function el(html) { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }

  async function play(sc, userText, animate) {
    const id = ++runId, alive = () => id === runId;
    $$(".side-item").forEach((b) => b.classList.toggle("on", b.dataset.key === sc.key));
    thread.innerHTML = "";
    thread.appendChild(el('<div class="msg user"><div class="bubble">' + esc(userText) + "</div></div>"));
    const ai = el('<div class="msg ai"><span class="ai-av busy" aria-hidden="true"></span><div class="ai-body"><div class="ai-name">FinStocks AI<span>Mock Mode</span></div><div class="steps"></div></div></div>');
    thread.appendChild(ai);
    const body = $(".ai-body", ai), stepsEl = $(".steps", ai), av = $(".ai-av", ai);
    toBottom();

    // 1. visible reasoning steps
    for (const st of sc.steps) {
      const row = el('<div class="step"><span class="ic">' + (animate ? '<span class="spin"></span>' : CHECK) + "</span><span>" + st + "</span></div>");
      if (!animate) row.classList.add("done");
      stepsEl.appendChild(row); toBottom();
      if (animate) { await sleep(620); if (!alive()) return; row.classList.add("done"); $(".ic", row).innerHTML = CHECK; }
    }
    // 2. streamed answer
    const p = el('<p class="ai-text"></p>'); body.appendChild(p);
    if (animate) {
      const words = sc.answer.split(" ");
      for (let i = 0; i < words.length; i++) {
        p.innerHTML = esc(words.slice(0, i + 1).join(" ")) + '<span class="caret"></span>';
        if (i % 4 === 0) toBottom();
        await sleep(34); if (!alive()) return;
      }
    }
    p.textContent = sc.answer;
    // 3. rules + chart cards
    const cards = el('<div class="ai-cards"><div class="card"><div class="card-head"><b>Rules</b><span>Draft 1 · editable</span></div><ol class="rules"></ol></div><div class="card"><div class="card-head"><b>Growth of 100</b><span>Jan 23 – Dec 25 · costs included</span></div><div class="legend"><span class="s"><i></i>Strategy</span><span class="b"><i></i>Nifty 50</span></div><div class="chart"></div><div class="stats"></div><div class="note">Simulated. Does not predict future results.</div></div></div>');
    body.appendChild(cards);
    $(".rules", cards).innerHTML = sc.rules.map((r, i) => '<li style="animation-delay:' + (animate ? 0.15 + i * 0.1 : 0) + 's"><span class="k">0' + (i + 1) + "</span><span><strong>" + r[0] + ".</strong> " + r[1] + "</span></li>").join("");
    $(".stats", cards).innerHTML = sc.stats.map((s) => '<div class="stat"><div class="l">' + s[0] + '</div><div class="v">' + s[1] + "</div></div>").join("");
    mountChart($(".chart", cards), sc, animate);
    toBottom();
    await sleep(900); if (!alive()) return;
    // 4. actions
    body.appendChild(el('<div class="ai-actions"><span class="mini primary">Run in Mock Mode</span><span class="mini">Edit rules</span><span class="mini">Explain rule 2</span><span class="mini">Read full document</span></div>'));
    av.classList.remove("busy");
    toBottom();
    notify(sc, animate);
  }

  /* ---------- phone ---------- */
  const notif = $("#notif");
  let notifTimer = null;
  function notify(sc, animate) {
    $("#phSym").textContent = sc.order[0];
    $("#phQty").textContent = sc.order[1];
    $("#notifTitle").textContent = "Strategy ready in Mock Mode";
    $("#notifBody").textContent = sc.title + " · orders await your approval";
    if (!animate) return;
    clearTimeout(notifTimer);
    notif.classList.add("show");
    $(".ph-order").classList.remove("flash"); void $(".ph-order").offsetWidth; $(".ph-order").classList.add("flash");
    notifTimer = setTimeout(() => notif.classList.remove("show"), 3600);
  }

  /* ---------- autoplay ---------- */
  let userTookOver = false, stageVisible = false, autoTimer = null, autoIdx = 0, playing = false;
  async function autoplayNext() {
    if (userTookOver || !stageVisible || playing) return;
    playing = true;
    autoIdx = (autoIdx + 1) % SCENARIOS.length;
    const sc = SCENARIOS[autoIdx];
    const myRun = runId + 1;
    await play(sc, sc.prompt, true);
    playing = false;
    if (runId === myRun && !userTookOver) autoTimer = setTimeout(autoplayNext, 6500);
  }
  function takeOver() { userTookOver = true; clearTimeout(autoTimer); playing = false; }

  // first frame: complete conversation at rest
  play(SCENARIOS[0], SCENARIOS[0].prompt, false);
  const stage = $("#stage");
  if ("IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver((es) => es.forEach((e) => {
      stageVisible = e.isIntersecting;
      if (stageVisible && !userTookOver && !playing) { clearTimeout(autoTimer); autoTimer = setTimeout(autoplayNext, 2200); }
      if (!stageVisible) clearTimeout(autoTimer);
    }), { threshold: 0.35 }).observe(stage);
  }

  /* ---------- hero chat box ---------- */
  const ask = $("#ask"), askInput = $("#askInput");
  function send(text) {
    text = (text || "").trim(); if (!text) return;
    takeOver();
    stage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    setTimeout(() => play(match(text), text, true), reduceMotion ? 0 : 450);
  }
  ask.addEventListener("submit", (e) => { e.preventDefault(); const t = askInput.value; askInput.value = ""; send(t); });
  askInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask.requestSubmit(); } });
  askInput.addEventListener("focus", () => { stopPlaceholder(); });

  // animated placeholder: types example prompts until the visitor focuses the box
  let phTimer = null, phStopped = false;
  function stopPlaceholder() { phStopped = true; clearTimeout(phTimer); askInput.placeholder = "Describe your investing idea…"; }
  (function cyclePlaceholder() {
    if (reduceMotion) return;
    const lines = ["Invest ₹10,000 in large caps, rebalance monthly", "Build a steady dividend portfolio with low churn", "Follow the trend in banking stocks, exit on weakness", "Put ₹5,000 into IT stocks, but cap any one at 20%"];
    let li = 0, ci = 0, del = false;
    (function tick() {
      if (phStopped) return;
      const t = lines[li];
      if (!del) { ci++; askInput.placeholder = t.slice(0, ci); if (ci === t.length) { del = true; phTimer = setTimeout(tick, 1800); return; } phTimer = setTimeout(tick, 38); }
      else { ci -= 2; askInput.placeholder = t.slice(0, Math.max(ci, 0)) || " "; if (ci <= 0) { del = false; ci = 0; li = (li + 1) % lines.length; phTimer = setTimeout(tick, 350); return; } phTimer = setTimeout(tick, 14); }
    })();
  })();

  // example chips type into the box, then send
  let chipTimer = null;
  $$(".ask-chip").forEach((c) => c.addEventListener("click", () => {
    stopPlaceholder(); clearInterval(chipTimer);
    const text = c.textContent.trim();
    if (reduceMotion) { send(text); return; }
    askInput.value = ""; let i = 0;
    chipTimer = setInterval(() => { askInput.value = text.slice(0, ++i); if (i >= text.length) { clearInterval(chipTimer); setTimeout(() => { askInput.value = ""; send(text); }, 250); } }, 16);
  }));

  // in-app composer + sidebar
  const composer = $("#composer"), composerInput = $("#composerInput");
  composer.addEventListener("submit", (e) => { e.preventDefault(); const t = composerInput.value.trim(); if (!t) return; composerInput.value = ""; takeOver(); play(match(t), t, true); });
  composerInput.addEventListener("focus", takeOver);
  $$(".side-item").forEach((b) => b.addEventListener("click", () => { takeOver(); const sc = byKey(b.dataset.key); play(sc, sc.prompt, true); }));
  $("#newChat").addEventListener("click", () => { takeOver(); runId++; thread.innerHTML = '<div class="msg ai"><span class="ai-av" aria-hidden="true"></span><div class="ai-body"><div class="ai-name">FinStocks AI<span>Mock Mode</span></div><p class="ai-text">Describe an investing idea in your own words. I’ll draft rules you can read, test them on past data, and nothing will run until you approve it.</p></div></div>'; $$(".side-item").forEach((x) => x.classList.remove("on")); composerInput.focus(); });

  /* ---------- feature still 1: typing prompt on reveal ---------- */
  function typeOnce(node) {
    if (reduceMotion || node.dataset.done) return;
    node.dataset.done = "1";
    const text = node.dataset.text; let i = 0;
    node.textContent = ""; node.classList.add("typing");
    const t = setInterval(() => { node.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(t); node.classList.remove("typing"); } }, 28);
  }

  /* ---------- limits phone switch ---------- */
  const live = $("#phLive");
  $$(".switch").forEach((sw) => sw.addEventListener("click", () => {
    const on = sw.getAttribute("aria-checked") !== "true";
    sw.setAttribute("aria-checked", String(on));
    if (sw.id === "autopilot" && live) { live.classList.toggle("paused", !on); $("span", live).textContent = on ? "Autopilot on" : "Paused · no new orders"; }
  }));

  /* ---------- FAQ ---------- */
  const faqs = $$(".faq details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- reveal ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach((r) => { if (r.getBoundingClientRect().top > window.innerHeight) r.classList.add("pending"); });
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.remove("pending");
      const typer = $(".typer", en.target); if (typer) setTimeout(() => typeOnce(typer), 300);
      io.unobserve(en.target);
    }), { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((r) => io.observe(r));
  }
  $("#year").textContent = new Date().getFullYear();
})();
