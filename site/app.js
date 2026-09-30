/* FinStocks AI landing page v5
   Journey wiring: hero chat → live demo → "Save & run in Mock Mode" → sign-up sheet (Google or mobile + OTP) → done.
   Every [data-signup] control opens the same sheet, carrying the strategy the visitor last saw.
   All AI output is pre-scripted and labelled simulated; nothing here is live advice.
   The sign-up sheet is front-end only: wire googleBtn / phoneForm / otpForm to the real auth provider. */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };

  /* ---------- header, nav, active section ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  const nav = $("#nav"), navToggle = $("#navToggle");
  navToggle.addEventListener("click", () => navToggle.setAttribute("aria-expanded", String(nav.classList.toggle("open"))));
  $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  const navIO = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$(".nav-links a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" }) : null;
  if (navIO) ["demo", "safety", "how", "pricing", "faq"].forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });

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
      explain: ["Explain rule 2", "Rule 2 ranks every Nifty 100 stock by its price change over the last six months and holds the top ten in equal amounts, about ₹1,000 each. Equal weighting stops one large stock from dominating. If you’d rather hold 15 stocks, tell me and I’ll redraft and re-test."],
      strategy: series(17, 0.0095, 0.062, 36), stats: [["Max drawdown", "−11.4%"], ["Rebalances", "36"], ["Holdings", "10"]],
      order: ["BUY RELIANCE", "1 share · ₹2,931"] },
    { key: "dividend", title: "Dividend, low churn",
      prompt: "Build a steady dividend portfolio with low churn",
      steps: ["Reading your prompt", "Finding companies with 5+ years of unbroken dividends", "Simulating 36 months on NSE data", "Applying brokerage, STT and GST"],
      answer: "Here’s a low-churn dividend draft. It only holds companies with five or more years of uninterrupted dividends, and rebalances quarterly only when weights drift. Worst simulated month: −7.9%. Review the rules, then try it in Mock Mode.",
      rules: [["Universe", "5+ years of uninterrupted dividends"], ["Filter", "Yield above the Nifty 50 average"], ["Weighting", "By consistency, capped at 12% each"], ["Rebalance", "Quarterly, only when weights drift 3%+"], ["Exit", "Remove any company that cuts its dividend"]],
      explain: ["Explain rule 2", "Rule 2 keeps only companies whose trailing 12-month dividend yield is above the Nifty 50 average. It favours income, but a high yield can also mean a falling share price, which is why rule 5 removes any company that cuts its dividend."],
      strategy: series(23, 0.0072, 0.038, 36), stats: [["Max drawdown", "−7.9%"], ["Rebalances", "12"], ["Holdings", "14"]],
      order: ["BUY ITC", "4 shares · ₹1,849"] },
    { key: "trend", title: "Bank trend follower",
      prompt: "Follow the trend in banking stocks, exit on weakness",
      steps: ["Reading your prompt", "Scanning 12 Nifty Bank stocks against their 50-day average", "Simulating 36 months on NSE data", "Applying brokerage, STT and GST"],
      answer: "Here’s a trend-following draft for bank stocks. It enters after five sessions above the 50-day average, and exits on a close below it or a 6% stop. It sat in cash for about 31% of the simulated period. Worst simulated month: −16.2%.",
      rules: [["Universe", "Nifty Bank constituents"], ["Entry", "Above 50-day average for 5 sessions"], ["Position", "Max 20% of capital per stock"], ["Exit", "Close below 50-day average, or 6% stop"], ["Hours", "Exchange hours only, never pre-open"]],
      explain: ["Explain rule 2", "Rule 2 waits for a stock to close above its 50-day average five sessions in a row before buying. The wait filters out one-day spikes, at the cost of entering later. You can shorten it to three sessions and I’ll re-test."],
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
  let current = SCENARIOS[0];

  /* ---------- chart ---------- */
  let chartSeq = 0;
  function mountChart(host, sc, animate) {
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
    s += '</g><g class="plot">';
    s += '<path d="' + path(sc.strategy) + " L" + x(n - 1).toFixed(1) + " " + y(minV).toFixed(1) + " L" + padL + " " + y(minV).toFixed(1) + ' Z" fill="url(#' + id + ')"/>';
    s += '<path class="b" d="' + path(BENCH) + '"/><path class="s" d="' + path(sc.strategy) + '"/>';
    const lastS = sc.strategy[n - 1], lastB = BENCH[n - 1];
    s += '<circle class="dot" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastS).toFixed(1) + '"/><circle class="dot b" r="4" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastB).toFixed(1) + '"/>';
    let ys = y(lastS), yb = y(lastB);
    if (Math.abs(ys - yb) < 12) { const mid = (ys + yb) / 2, up = ys < yb; ys = up ? mid - 7 : mid + 7; yb = up ? mid + 7 : mid - 7; }
    s += '<text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (ys + 3).toFixed(1) + '">Strategy</text><text class="endlabel" x="' + (x(n - 1) + 8).toFixed(1) + '" y="' + (yb + 3).toFixed(1) + '">Nifty 50</text>';
    s += '</g><line class="cross" y1="' + padT + '" y2="' + (H - padB) + '" x1="0" x2="0" style="opacity:0"/><rect class="hit" x="' + padL + '" y="0" width="' + (W - padL - padR) + '" height="' + H + '" fill="transparent"/></svg>';
    host.innerHTML = s + '<div class="tip"></div>';
    host.classList.toggle("static", !animate);
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => host.classList.add("drawn")));
    const svgEl = $("svg", host), hit = $(".hit", host), cross = $(".cross", host), tip = $(".tip", host);
    hit.addEventListener("pointermove", (ev) => {
      const r = svgEl.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(n - 1, Math.round(((px - padL) / (W - padL - padR)) * (n - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.style.opacity = 1;
      tip.innerHTML = "<b>" + MONTHS[Math.round((i / (n - 1)) * (MONTHS.length - 1))] + "</b>&nbsp; S " + sc.strategy[i].toFixed(1) + " · N50 " + BENCH[i].toFixed(1);
      tip.style.left = (x(i) / W) * 100 + "%";
      tip.style.top = (Math.min(y(sc.strategy[i]), y(BENCH[i])) / H) * 100 + "%";
      tip.style.opacity = 1;
    });
    hit.addEventListener("pointerleave", () => { cross.style.opacity = 0; tip.style.opacity = 0; });
  }

  /* ---------- chat thread ---------- */
  const thread = $("#thread");
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const toBottom = () => { thread.scrollTop = thread.scrollHeight; };
  let runId = 0;

  function aiShell() {
    const ai = el('<div class="msg ai"><span class="ai-av busy" aria-hidden="true"></span><div class="ai-body"><div class="ai-name">FinStocks AI<span>Mock Mode</span></div></div></div>');
    thread.appendChild(ai); toBottom();
    return ai;
  }
  async function stream(p, text, animate, alive) {
    if (animate) {
      const words = text.split(" ");
      for (let i = 0; i < words.length; i++) {
        p.innerHTML = esc(words.slice(0, i + 1).join(" ")) + '<span class="caret"></span>';
        if (i % 4 === 0) toBottom();
        await sleep(32); if (!alive()) return false;
      }
    }
    p.textContent = text; toBottom();
    return true;
  }
  function actions(sc, withExplain) {
    return el('<div class="ai-actions">' +
      '<button class="act primary" type="button" data-act="save">Save &amp; run in Mock Mode ' + ARROW + "</button>" +
      (withExplain ? '<button class="act" type="button" data-act="explain">' + sc.explain[0] + "</button>" : "") +
      '<button class="act" type="button" data-act="doc">Read the full document</button></div>');
  }

  async function play(sc, userText, animate) {
    const id = ++runId, alive = () => id === runId;
    current = sc;
    $$(".side-item").forEach((b) => b.classList.toggle("on", b.dataset.key === sc.key));
    thread.innerHTML = "";
    thread.appendChild(el('<div class="msg user"><div class="bubble">' + esc(userText) + "</div></div>"));
    const ai = aiShell(), body = $(".ai-body", ai), av = $(".ai-av", ai);
    const stepsEl = el('<div class="steps"></div>'); body.appendChild(stepsEl);
    for (const st of sc.steps) {
      const row = el('<div class="step"><span class="ic">' + (animate ? '<span class="spin"></span>' : CHECK) + "</span><span>" + st + "</span></div>");
      if (!animate) row.classList.add("done");
      stepsEl.appendChild(row); toBottom();
      if (animate) { await sleep(600); if (!alive()) return; row.classList.add("done"); $(".ic", row).innerHTML = CHECK; }
    }
    const p = el('<p class="ai-text"></p>'); body.appendChild(p);
    if (!(await stream(p, sc.answer, animate, alive))) return;
    const cards = el('<div class="ai-cards"><div class="card"><div class="card-head"><b>Rules</b><span>Draft 1 · editable</span></div><ol class="rules"></ol></div><div class="card"><div class="card-head"><b>Growth of 100</b><span>Jan 23 – Dec 25 · costs included</span></div><div class="legend"><span class="s"><i></i>Strategy</span><span class="b"><i></i>Nifty 50</span></div><div class="chart"></div><div class="stats"></div><div class="note">Simulated. Does not predict future results.</div></div></div>');
    body.appendChild(cards);
    $(".rules", cards).innerHTML = sc.rules.map((r, i) => '<li style="animation-delay:' + (animate ? 0.15 + i * 0.1 : 0) + 's"><span class="k">0' + (i + 1) + "</span><span><strong>" + r[0] + ".</strong> " + r[1] + "</span></li>").join("");
    $(".stats", cards).innerHTML = sc.stats.map((s) => '<div class="stat"><div class="l">' + s[0] + '</div><div class="v">' + s[1] + "</div></div>").join("");
    mountChart($(".chart", cards), sc, animate);
    toBottom();
    await sleep(900); if (!alive()) return;
    body.appendChild(actions(sc, true));
    av.classList.remove("busy");
    toBottom();
    notify(sc, animate);
  }

  async function followUp(sc, question, answer) {
    const id = ++runId, alive = () => id === runId;
    $$(".ai-actions", thread).forEach((a) => a.remove());
    thread.appendChild(el('<div class="msg user"><div class="bubble">' + esc(question) + "</div></div>"));
    const ai = aiShell(), body = $(".ai-body", ai);
    await sleep(500); if (!alive()) return;
    const p = el('<p class="ai-text"></p>'); body.appendChild(p);
    if (!(await stream(p, answer, true, alive))) return;
    body.appendChild(actions(sc, false));
    $(".ai-av", ai).classList.remove("busy");
    toBottom();
  }

  thread.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    takeOver();
    const act = b.dataset.act;
    if (act === "save") openSheet(current);
    else if (act === "explain") followUp(current, current.explain[0], current.explain[1]);
    else if (act === "doc") document.getElementById("document").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- phone in the stage ---------- */
  const notif = $("#notif"); let notifTimer = null;
  function notify(sc, animate) {
    $("#phSym").textContent = sc.order[0];
    $("#phQty").textContent = sc.order[1];
    $("#notifBody").textContent = sc.title + " · orders await your approval";
    if (!animate) return;
    clearTimeout(notifTimer);
    notif.classList.add("show");
    const o = $(".ph-order"); o.classList.remove("flash"); void o.offsetWidth; o.classList.add("flash");
    notifTimer = setTimeout(() => notif.classList.remove("show"), 3600);
  }

  /* ---------- autoplay while the demo is on screen, until the visitor takes over ---------- */
  const stage = $("#demo");
  let userTookOver = false, stageVisible = false, autoTimer = null, autoIdx = 0, playing = false;
  async function autoplayNext() {
    if (userTookOver || !stageVisible || playing) return;
    playing = true;
    autoIdx = (autoIdx + 1) % SCENARIOS.length;
    const sc = SCENARIOS[autoIdx], myRun = runId + 1;
    await play(sc, sc.prompt, true);
    playing = false;
    if (runId === myRun && !userTookOver) autoTimer = setTimeout(autoplayNext, 7000);
  }
  function takeOver() { userTookOver = true; clearTimeout(autoTimer); playing = false; }
  play(SCENARIOS[0], SCENARIOS[0].prompt, false); // complete conversation at rest
  if ("IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver((es) => es.forEach((e) => {
      stageVisible = e.isIntersecting;
      if (stageVisible && !userTookOver && !playing) { clearTimeout(autoTimer); autoTimer = setTimeout(autoplayNext, 2400); }
      if (!stageVisible) clearTimeout(autoTimer);
    }), { threshold: 0.35 }).observe(stage);
  }

  /* ---------- hero chat box ---------- */
  const ask = $("#ask"), askInput = $("#askInput");
  function send(text) {
    text = (text || "").trim(); if (!text) { askInput.focus(); return; }
    takeOver();
    stage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    setTimeout(() => play(match(text), text, true), reduceMotion ? 0 : 450);
  }
  ask.addEventListener("submit", (e) => { e.preventDefault(); const t = askInput.value; askInput.value = ""; send(t); });
  askInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask.requestSubmit(); } });
  askInput.addEventListener("focus", () => stopPlaceholder());

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

  let chipTimer = null;
  $$(".ask-chip").forEach((c) => c.addEventListener("click", () => {
    stopPlaceholder(); clearInterval(chipTimer);
    const text = c.textContent.trim();
    if (reduceMotion) { send(text); return; }
    askInput.value = ""; let i = 0;
    chipTimer = setInterval(() => { askInput.value = text.slice(0, ++i); if (i >= text.length) { clearInterval(chipTimer); setTimeout(() => { askInput.value = ""; send(text); }, 250); } }, 16);
  }));

  const composer = $("#composer"), composerInput = $("#composerInput");
  composer.addEventListener("submit", (e) => { e.preventDefault(); const t = composerInput.value.trim(); if (!t) return; composerInput.value = ""; takeOver(); play(match(t), t, true); });
  composerInput.addEventListener("focus", takeOver);
  $$(".side-item").forEach((b) => b.addEventListener("click", () => { takeOver(); const sc = byKey(b.dataset.key); play(sc, sc.prompt, true); }));
  $("#newChat").addEventListener("click", () => {
    takeOver(); runId++;
    thread.innerHTML = '<div class="msg ai"><span class="ai-av" aria-hidden="true"></span><div class="ai-body"><div class="ai-name">FinStocks AI<span>Mock Mode</span></div><p class="ai-text">Describe an investing idea in your own words. I’ll draft rules you can read, test them on past data, and nothing runs until you approve it.</p></div></div>';
    $$(".side-item").forEach((x) => x.classList.remove("on"));
    composerInput.focus();
  });

  /* ---------- sign-up sheet ---------- */
  const sheet = $("#sheet");
  let lastFocus = null;
  function showPane(name) {
    $$(".sheet-step", sheet).forEach((p) => { p.hidden = p.dataset.pane !== name; });
    const first = $('.sheet-step[data-pane="' + name + '"] input, .sheet-step[data-pane="' + name + '"] button:not(.linkbtn)', sheet);
    if (first) setTimeout(() => first.focus(), 60);
  }
  function openSheet(sc, mode) {
    lastFocus = document.activeElement;
    const saving = $("#saving");
    if (sc) {
      saving.hidden = false;
      $("#savingTitle").textContent = sc.title;
      $("#savingMeta").textContent = sc.rules.length + " rules · backtest Jan 23 – Dec 25 · ₹10,000 virtual";
      $("#doneText").textContent = "“" + sc.title + "” is saved with ₹10,000 of virtual money. Review the rules and run your first virtual trades.";
    } else {
      saving.hidden = true;
      $("#doneText").textContent = "₹10,000 of virtual money is ready. Describe your first idea to get started.";
    }
    $("#sheetTitle").textContent = mode === "login" ? "Log in to FinStocks" : sc ? "Save this strategy" : "Start in Mock Mode";
    $("#phoneErr").hidden = true; $("#otpErr").hidden = true;
    sheet.hidden = false; document.body.classList.add("locked");
    showPane("start");
  }
  function closeSheet() {
    sheet.hidden = true; document.body.classList.remove("locked");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-signup]");
    if (t) { e.preventDefault(); openSheet(t.closest("#demo, .demo-foot") ? current : userTookOver ? current : null, t.dataset.signup); }
  });
  $$("[data-close]", sheet).forEach((c) => c.addEventListener("click", (e) => { if (c.tagName === "A") e.preventDefault(); closeSheet(); }));
  document.addEventListener("keydown", (e) => {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") { // keep focus inside the sheet
      const f = $$("button, input, a[href]", sheet).filter((n) => !n.closest("[hidden]"));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $("#googleBtn").addEventListener("click", () => showPane("done"));
  const phoneInput = $("#phoneInput");
  phoneInput.addEventListener("input", () => { phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10); $("#phoneErr").hidden = true; });
  $("#phoneForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phoneInput.value)) { $("#phoneErr").hidden = false; phoneInput.focus(); return; }
    $("#otpTo").textContent = "+91 " + phoneInput.value.slice(0, 5) + " " + phoneInput.value.slice(5);
    showPane("otp");
  });
  $("[data-back]", sheet).addEventListener("click", () => showPane("start"));
  const otpInput = $("#otpInput");
  otpInput.addEventListener("input", () => { otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6); $("#otpErr").hidden = true; if (otpInput.value.length === 6) $("#otpForm").requestSubmit(); });
  $("#otpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (otpInput.value.length !== 6) { $("#otpErr").hidden = false; otpInput.focus(); return; }
    otpInput.value = ""; showPane("done");
  });

  /* ---------- how it works: stepper follows scroll ---------- */
  const stepItems = $$("#stepper li");
  const stepIO = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = +e.target.dataset.step;
    stepItems.forEach((li, j) => { li.classList.toggle("on", j === i); li.classList.toggle("done", j < i); });
  }), { rootMargin: "-40% 0px -55% 0px" }) : null;
  if (stepIO) $$(".how-step").forEach((s) => stepIO.observe(s));

  /* ---------- mobile sticky CTA: after the hero, hidden near the final CTA ---------- */
  const mcta = $("#mobileCta"), finalSec = $("#start");
  function mctaUpdate() {
    const pastHero = ask.getBoundingClientRect().bottom < 0;
    const f = finalSec.getBoundingClientRect();
    const nearFinal = f.top < window.innerHeight && f.bottom > 0;
    mcta.classList.toggle("show", pastHero && !nearFinal && sheet.hidden);
  }
  window.addEventListener("scroll", mctaUpdate, { passive: true }); mctaUpdate();

  /* ---------- limits phone switch ---------- */
  const live = $("#phLive");
  $$(".switch").forEach((sw) => sw.addEventListener("click", () => {
    const on = sw.getAttribute("aria-checked") !== "true";
    sw.setAttribute("aria-checked", String(on));
    if (sw.id === "autopilot" && live) { live.classList.toggle("paused", !on); $("span", live).textContent = on ? "Autopilot on" : "Paused · no new orders"; }
  }));

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = $$(".faq details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- reveal + still animations ---------- */
  function typeOnce(node) {
    if (reduceMotion || node.dataset.done) return;
    node.dataset.done = "1";
    const text = node.dataset.text; let i = 0;
    node.textContent = ""; node.classList.add("typing");
    const t = setInterval(() => { node.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(t); node.classList.remove("typing"); } }, 28);
  }
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
