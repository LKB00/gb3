# Current Landing Page Audit: finstocks.ai/home (and root)

> **Access limitation (read first):** As of 2026-09-30, finstocks.ai could not be loaded from this research environment. curl, WebFetch and a Playwright render were all refused by the organization's network egress policy (HTTP 403 on CONNECT to `finstocks.ai:443`). The same policy blocked play.google.com, trustpilot.com, medium.com, tracxn.com, scamadviser.com and web.archive.org. **No screenshots were taken. The raw HTML, meta tags, DOM, script bundles and rendered layout were NOT observed.** Everything below comes from search-engine indexes: page titles, snippets, and search-tool summaries of those snippets. Treat snippet-derived wording as approximate. The section-by-section structure, tech stack, SEO tags, performance and accessibility need a direct pass from a machine that can reach the site.

## 1. What does Finstocks.ai offer (features, AI, markets, pricing, target users)?

### Takeaway
FinStocks AI presents itself as an Indian, prompt-based AI trading and automation platform. A user types a natural-language instruction (e.g. "Invest ₹10,000 now") and the AI picks the strategy, places the orders through the user's own broker account and rebalances. Supporting features are Autopilot, a custom strategy builder, backtesting and a virtual-money "Mock Mode". No pricing could be found. It is a very early-stage company: founded in 2025, unfunded, about 5 employees, based in Bengaluru.

### Cited Findings
- The root page's indexed title is "FinStocks AI | Prompt-based trading strategies on your own ..." (truncated in the index; "own ..." probably continues as "broker account", which is inferred). — [finstocks.ai](https://finstocks.ai/)
- The /home page's indexed title is "FinStocks AI | The Ultimate AI Stock Trading & Investment Platform". — [finstocks.ai/home](https://finstocks.ai/home)
- Indexed descriptive copy reads roughly: "India's leading AI trading platform… automate investments with Autopilot, build custom strategies, backtest ideas, and trade smarter with AI(-powered insights)". — [finstocks.ai](https://finstocks.ai/), [finstocks.ai/login](https://finstocks.ai/login)
- Positioning claim: "world's first prompt-based AI trading platform", where users "simply type a prompt—'Invest ₹10,000 now'—and the AI handles everything: strategy, execution, and rebalancing in real time." — search snippets associated with [LinkedIn company page](https://in.linkedin.com/company/finstocks-ai) and [finstocks.ai](https://finstocks.ai/)
- "Mock Mode" lets users "invest virtual money risk-free before going live." — search snippet, [finstocks.ai](https://finstocks.ai/)
- The platform is said to trade automatically "during market hours (9:30–3:30)". — search snippet (source page not pinned down; appears with [RocketReach](https://rocketreach.co/finstocks-ai-profile_b695ee15c94aa5e2) / [finstocks.ai/how-to-use](https://finstocks.ai/how-to-use) results)
- Target-user framing: retail investors "who want access to the tools Wall Street keeps for itself". — search snippet (same result set as above)
- Broker connectivity: the product lets users "connect with brokerages". Upstox is named as a supported broker for executing trades. A "/how-to-use" page is indexed with the title "How to Use FinStocks AI | Use Cases & Broker Setup". — [Tracxn](https://tracxn.com/d/companies/finstocks/__RmNKJf4h66SjRkiHKBCT9Vy7iqRdGqhdGgkl__yO3IE), [finstocks.ai/how-to-use](https://finstocks.ai/how-to-use)
- A founder Medium post says users can trade with commands like "Invest ₹30K now" and that it uses "real-time data analysis and machine learning" to "execute trades without needing brokers or manual steps". This conflicts with the broker-connection messaging elsewhere. — [Medium, Rushikesh Chavan](https://medium.com/@founder_50249/how-finstocks-ai-is-changing-the-world-of-stock-market-trading-3eadf5005ee1) (snippet only)
- Company facts: founded in 2025 by Rushikesh Chavan; unfunded; based in Bengaluru. — [Tracxn](https://tracxn.com/d/companies/finstocks/__RmNKJf4h66SjRkiHKBCT9Vy7iqRdGqhdGgkl__yO3IE). Listed as a Financial Services company in Bengaluru with 5 employees. — [RocketReach](https://rocketreach.co/finstocks-ai-profile_b695ee15c94aa5e2)
- Other indexed site pages: /about ("About FinStocks AI - Leading AI-Based Trading Platform"), /login ("FinStocks AI | India's Leading AI Trading Platform"), /how-to-use, and a public share URL pattern /shared/{uuid} ("FinStocks AI - AI-Powered Stock Trading Platform | Intelligent Investment Solutions"). — [site:finstocks.ai results](https://finstocks.ai/shared/9031c7cf-ccf6-468d-98a9-de17cf28c2f6)

### Inferences
- The markets covered are Indian equities (NSE/BSE), inferred from the ₹ amounts, "India's leading", Upstox and the 3:30 close. No source explicitly names NSE/BSE, F&O or US markets.
- The /shared/{uuid} URLs suggest users can share strategies or portfolios publicly, which could become a viral or social-proof loop. This is inferred from the URL pattern only.
- The "9:30–3:30" wording does not match the NSE/BSE regular session, which opens at 9:15. Either the product deliberately skips the opening 15 minutes or the copy is imprecise. This is worth checking.

### Gaps
- No pricing, plans or free-trial terms were found in any indexed source.
- The full list of supported brokers could not be confirmed. Only Upstox is named; Zerodha and Angel One are not confirmed.
- Asset classes (cash equity, F&O, ETFs, MFs) and the AI/LLM stack behind the product are not documented in any reachable source.

## 2. Exact page structure (hero, subhead, CTAs, nav, social proof, features, pricing, FAQ, footer, trust/compliance)

### Takeaway
This could not be observed directly because the site is blocked by egress policy. The only evidence is the indexed titles and descriptions, which suggest a hero built around the prompt ("Invest ₹10,000 now"), the tagline "India's leading AI trading platform", and a feature set of Autopilot, custom strategies, backtesting, Mock Mode and broker connection.

### Cited Findings
- Title and description phrases, as above: "The Ultimate AI Stock Trading & Investment Platform" on /home, "Prompt-based trading strategies on your own …" on root, "India's Leading AI Trading Platform" on /login. — [finstocks.ai/home](https://finstocks.ai/home), [finstocks.ai](https://finstocks.ai/), [finstocks.ai/login](https://finstocks.ai/login)
- No SEBI registration number or disclaimer text from finstocks.ai surfaced in searches for "FinStocks AI SEBI registered disclaimer". The SEBI-registered results that came back belong to an unrelated firm, "ABJ Finstocks" (multibaggers.co.in, a SEBI Research Analyst). — [ABJ Finstocks disclosures](https://multibaggers.co.in/mandatory-disclosures/)

### Inferences
- Root (`/`) and `/home` carry different titles. This suggests they are separate routes or templates rather than a redirect, but that is inferred and not verified.

### Gaps
- Hero headline and subheadline verbatim, CTA labels, nav items, section order, testimonials or user counts, the pricing section, FAQ, footer and risk disclaimers were not observed. They need a direct fetch or a screenshot.
- It is unknown whether the page shows a SEBI registration or states that the product is a technology platform and not an advisor. Given that it executes trades automatically, this matters under SEBI's retail algo-trading framework, which requires broker-approved and exchange-registered algos (regulatory context from background knowledge, not a cited source).

## 3. Copy tone, visual style, tech stack, SPA shell, SEO, performance, accessibility, mobile

### Takeaway
Only the SEO titles could be assessed. They are inconsistent from page to page and use superlatives ("Ultimate", "Leading", "World's first"). Tech stack, SPA vs. SSR, OG tags, performance and accessibility are unverified.

### Cited Findings
- Four different title formulas across indexed pages: "Prompt-based trading strategies on your own …" on root, "The Ultimate AI Stock Trading & Investment Platform" on /home and in one /how-to-use listing, "India's Leading AI Trading Platform" on /login, and "AI-Powered Stock Trading Platform | Intelligent Investment Solutions" on /shared. — [site:finstocks.ai results](https://finstocks.ai/home)
- /how-to-use is indexed under two different titles ("How to Use FinStocks AI | Use Cases & Broker Setup" and "FinStocks AI | The Ultimate AI Stock Trading & Investment Platform"). This hints at a client-side title swap or a shared default title. — [finstocks.ai/how-to-use](https://finstocks.ai/how-to-use)
- Tone of the indexed copy is superlative and hype-leaning: "India's leading", "world's first", "Ultimate", "tools Wall Street keeps for itself". — sources as above

### Inferences
- A default title that is shared and then overridden per route, combined with /login being indexed as a page, is typical of a client-rendered SPA (e.g. React/Vite) with per-route head management. This is inferred and needs confirmation.
- The "Wall Street" framing is US-centric language for an India-only product and may not fit Indian retail investors.

### Gaps
- `<meta description>`, OG/Twitter tags, canonical tags, robots.txt/sitemap, JS bundle size, Core Web Vitals, alt text, contrast and mobile layout were all not observable.

## 4. Clarity, trust and conversion gaps; the 5-second value proposition

### Takeaway
Based on indexed copy, the 5-second read is "type a sentence and AI invests your money for you in Indian stocks". That is distinctive and simple. The trust layer, though, looks thin in public: no visible regulatory status, no pricing, one Trustpilot review, a very low automated ScamAdviser score, and name collisions with several unrelated "Finstock(s)" brands.

### Cited Findings
- Trustpilot: TrustScore 3.7 from 1 review; the company has not asked for reviews. — [Trustpilot](https://www.trustpilot.com/review/finstocks.ai) (search snippet)
- ScamAdviser gives finstocks.ai "a very low trust score", while cautioning that its algorithm is not perfect. — [ScamAdviser](https://www.scamadviser.com/check-website/finstocks.ai) (search snippet). This is typical for young domains and is not evidence of fraud.
- Name confusion: the Google Play app "Finstocks" (co.diy7.krdcm) is an education app by "Education DIY7 Media" that was last updated in August 2024. — [AppBrain](https://www.appbrain.com/app/finstocks/co.diy7.krdcm). Other unrelated brands in the same search results are Finstock, Inc. (finstock.co, US quant analytics) — [finstock.co](https://www.finstock.co/); FinStok AI (finstok.ai, screener) — [finstok.ai](https://finstok.ai/); and ABJ Finstocks (SEBI RA) — [multibaggers.co.in](https://multibaggers.co.in/)

### Inferences
- The biggest conversion gap is likely trust. The product asks for broker access and places trades autonomously with real money, yet the site's public footprint shows no compliance statement, security explanation (e.g. OAuth broker login, no custody of funds), track record or pricing. This is inferred from absence in the indexes, not from viewing the page.
- The "world's first", "India's leading" and "Ultimate" claims have no supporting numbers such as users, AUM or returns. Superlatives without evidence can hurt credibility in finance.
- Mock Mode is a strong low-risk entry point and could be the primary CTA ("Try with virtual money").
- The Google Play listing named "Finstocks" is not this company's app. Users searching the app store may land on the wrong product.

### Gaps
- Actual CTAs, sign-up friction and any testimonials or metrics on the page are unknown.

## 5. External mentions and positioning

### Takeaway
The external footprint is small and mostly founder-driven: LinkedIn, X, Instagram (including creator reels), YouTube, Medium and Luma events. No press coverage or Product Hunt launch was found.

### Cited Findings
- LinkedIn company page — [linkedin.com/company/finstocks-ai](https://in.linkedin.com/company/finstocks-ai). Founder LinkedIn — [Rushikesh Chavan](https://in.linkedin.com/in/rushikesh-chavan-88a4a9317)
- X account @FinStocksAI — [x.com/FinStocksAI](https://x.com/FinStocksAI). Instagram @finstocks.ai — [Instagram](https://www.instagram.com/finstocks.ai/). An Instagram reel shows a user endorsement ("I've recently started using @finstocks.ai, and honestly, it's a …") — [Instagram reel](https://www.instagram.com/reel/DR1M-6sk1lW/). YouTube channel — [@FinstocksAI](https://www.youtube.com/@FinstocksAI)
- Luma event pages: "AI for Trading | Finstocks.ai" and a founder profile — [Luma event](https://luma.com/9xhp34u0), [Luma founder](https://luma.com/user/usr-Ir5XWFB8qpmezHO)
- Founder Medium article: "How FinStocks AI is changing the world of stock market trading" — [Medium](https://medium.com/@founder_50249/how-finstocks-ai-is-changing-the-world-of-stock-market-trading-3eadf5005ee1)

### Inferences
- Community and event-led growth (Luma meetups, influencer reels) looks like the current acquisition channel. Some visitors will therefore arrive already warm, and the landing page should reinforce creator testimonials.

### Gaps
- No Product Hunt listing, press articles, App Store or Play Store app from FinStocks AI itself, or follower counts were found.
- Snippets for the Instagram reel and the Medium article could not be fetched in full.
