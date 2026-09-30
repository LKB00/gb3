# Competitor & Best-in-Class Landing Page Teardown: AI Stock Research / Trading Products (for finstocks.ai redesign)

> **Method caveat (read first):** Every direct page fetch (finstocks.ai, tickertape.in, danelfin.com, simplywall.st, composer.trade, streak.tech, public.com, smallcase.com, lapa.ninja) was **blocked by this environment's network egress proxy**. So none of the live pages were rendered. Everything below comes from web-search snippets, the pages' own `<title>` tags as search engines index them (these are verbatim), press releases, app-store listings and third-party reviews. **Verbatim hero H1/subheads, CTA button labels and exact section order could NOT be checked for most pages.** Where a quote is only a page title or a search snippet, it's marked that way. Before the copy is used in a final deliverable, someone should look at the live pages in a browser.

## Which products are the closest competitors (given what finstocks.ai actually is)?

### Takeaway
FinStocks AI is not a stock-research or screening tool. It is an Indian (Bengaluru) **prompt-based AI trading / automated execution platform**: "Invest ₹10,000 now" → AI handles strategy, execution and rebalancing, plus Autopilot, custom strategies, backtesting and a virtual-money Mock Mode. Its closest competitors are therefore **prompt/no-code strategy-to-execution products** (Composer by SoFi, Public Generated Assets, Streak, Tradetron, Surmount, smallcase). Research tools (Danelfin, Tickertape, Simply Wall St, Robinhood Cortex) are best-in-class references for *AI credibility and research UX*, not head-to-head rivals.

### Cited Findings
**What finstocks.ai is**
- The page title reads (verbatim): "FinStocks AI | Prompt-based trading strategies on your own ..." (truncated in the index). The login page title reads "FinStocks AI | India's Leading AI Trading Platform". The how-to-use page title reads "FinStocks AI | The Ultimate AI Stock Trading & Investment Platform". — [finstocks.ai](https://finstocks.ai/), [login](https://finstocks.ai/login), [how-to-use](https://finstocks.ai/how-to-use)
- Self-description: "world's first prompt-based AI trading platform", with a mission "to make algorithmic trading effortless for everyone—no brokers, no signals, no manual execution". Users type a prompt such as "Invest ₹10,000 now" and the AI handles "strategy, execution, and rebalancing in real time". — [finstocks.ai](https://finstocks.ai/) / [LinkedIn](https://in.linkedin.com/company/finstocks-ai)
- Features: Autopilot, custom strategy builder, backtesting, "Mock Mode to invest virtual money risk-free before going live". It trades automatically during market hours (9:30–3:30). Example prompt: "Invest ₹30K now". — [Founder Medium post](https://medium.com/@founder_50249/how-finstocks-ai-is-changing-the-world-of-stock-market-trading-3eadf5005ee1); [finstocks.ai/about](https://finstocks.ai/about)
- Founder Rushikesh Chavan, Bengaluru. It has a Trustpilot page, a YouTube channel, a Google Play app and Instagram creator reels. — [Trustpilot](https://www.trustpilot.com/review/finstocks.ai), [YouTube](https://www.youtube.com/@FinstocksAI), [Google Play](https://play.google.com/store/apps/details?id=co.diy7.krdcm&hl=en_US), [Instagram](https://www.instagram.com/reel/DR1M-6sk1lW/)
- Search results did not show FinStocks AI's SEBI registration or its broker/regulatory status. The same results noted that SEBI has cautioned investors against unregulated algo-trading platforms. — [search summary incl. finstocks.ai pages](https://finstocks.ai/about)
- Name-collision risk: finstock.co ("Finstock, Inc.: AI Trading Analytics and Quant Research Platform") and finstok.ai ("FinStok AI | World's Most Easiest Stocks & Options Screener !") are separate products with near-identical names. — [finstock.co](https://www.finstock.co/), [finstok.ai](https://finstok.ai/)

**Recommended teardown set (11)**
| # | Product | Market | Why it's relevant |
|---|---|---|---|
| 1 | Composer by SoFi | US | Closest global analog: natural-language → backtest → auto-execute |
| 2 | Public.com Generated Assets | US | Prompt → investable index, backtested vs S&P 500 |
| 3 | Zerodha Streak | India | No-code algo, backtest, deploy on Kite; free for Zerodha users |
| 4 | Tradetron | India | Algo strategy marketplace; deploy on own broker |
| 5 | Surmount | US | Automated strategies, connect existing brokerage |
| 6 | smallcase | India | Idea-based baskets; SEBI-registered managers; distributed via brokers |
| 7 | Danelfin | US/EU | Best-in-class AI-accuracy communication (AI Score + track record) |
| 8 | Tickertape | India | Research/screener benchmark for Indian retail |
| 9 | Simply Wall St | Global | Visual explainability (Snowflake), social proof at scale |
| 10 | Robinhood Cortex / Strategies | US | How a mass-market broker frames AI |
| 11 | Screener.in / Trendlyne / StockEdge | India | Not researched (see Gaps) |

### Inferences
- FinStocks AI's biggest positioning risk is regulatory credibility. It tells users it executes trades for them ("no brokers") in a market where SEBI is actively warning about unregulated algo platforms. Its landing page therefore has to answer "who holds my money / which broker / is this SEBI-compliant?" earlier and more clearly than the research-only competitors do.
- Composer by SoFi is the single most useful model, because it is the same product loop (describe → backtest → execute) and has just been relaunched in 2026 with explicit AI-safety framing.

### Gaps
- The hero headline, subheadline, CTAs and section order on finstocks.ai/home could not be seen (egress blocked).
- FinStocks AI's broker partners, SEBI registration (RA/IA/algo provider empanelment) and pricing were not found in search.

---

## Per-competitor teardown: hero, CTAs, product visuals, social proof, trust, pricing, structure

### Takeaway
Across the set, the strongest pages make one concrete, checkable promise (a score, a prompt → portfolio, a backtest). They back it with a scale number (users, trades, AUM) and handle regulation plainly (SEC-registered adviser subsidiary, SEBI-registered managers, "rules-based" execution). Pricing is almost always a free tier plus a named paid tier, with a trial.

### Cited Findings

**1. Composer by SoFi (composer.trade) — closest analog**
- Page title (verbatim): "Composer by SoFi – Trading. Built Better." — [composer.trade](https://www.composer.trade/)
- Product Hunt tagline (verbatim): "Composer: Build, backtest and execute trading algorithms with AI". — [Product Hunt](https://www.producthunt.com/products/composer-2)
- Value prop: "explain your goals, strategy, and risk concerns in natural language — and the AI-assisted editor will create the strategy for you". Composer then "executes your trading strategy, making trades and rebalancing automatically". It says "No coding skills are required". Strategies are discoverable by categories such as "Long Term, Technology Focus, and Diversification". — [composer.trade (via search)](https://www.composer.trade/)
- Product visual concept: "symphonies", a no-code visual editor for "hedge-fund like algorithms". — [Alpaca case study](https://alpaca.markets/blog/how-composer-is-redefining-algorithmic-trading-with-their-no-code-platform/)
- AI-credibility framing (June 23, 2026 launch): "Unlike agentic trading tools that rely on AI to continuously make trading decisions, Composer uses AI to help investors build sophisticated rules-based strategies that are executed automatically according to clear, predefined rules… investors maintain visibility into how their strategies work and can evaluate historical performance across different market environments before deciding whether to activate a strategy." — [BusinessWire / SoFi press release](https://www.businesswire.com/news/home/20260623095057/en/Introducing-Composer-by-SoFi-AI-Powered-Investing-From-Idea-to-Execution)
- Trust: SoFi parent brand ("Composer by SoFi"). Composer Securities LLC is the broker. — [SoFi IR](https://investors.sofi.com/news/news-details/2026/Introducing-Composer-by-SoFi-AI-Powered-Investing-From-Idea-to-Execution/default.aspx)
- Pricing (per a third-party review): free tier to build and backtest indefinitely; "Trading Pass at $32/month billed annually" adds automated execution and unlimited backtesting; "zero commissions and zero management fees". — [composer.trade via search / tooliverse](https://tooliverse.ai/tools/composer)

**2. Public.com — Generated Assets**
- Launch copy (verbatim, X): "Generated Assets can turn any idea into an investable index using AI. It all starts with a prompt." — [Public on X](https://x.com/public/status/1924480558761152976)
- Product Hunt tagline (verbatim): "Generated Assets: Turn any idea into an investable index with AI". — [Product Hunt](https://www.producthunt.com/products/generated-assets?launch=generated-assets)
- Mechanics shown: a prompt bar; example prompts "companies that have flat org charts" and "CEOs under 40"; backtest "against benchmarks like the S&P 500"; refine with follow-up prompts. Explainability: "dispatches a swarm of AI evaluation agents… evaluating companies on… sector fit, financial metrics, growth trajectory". — [PR Newswire](https://www.prnewswire.com/news-releases/investors-can-turn-ideas-into-an-investable-index-with-publics-launch-of-generated-assets-302454862.html); [Public prompting guide](https://public.com/generated-asset/how-it-works)
- Positioning line from a later release (title, verbatim): "Public Becomes the First Brokerage To Introduce AI Agents for Your Portfolio". — [PR Newswire](https://www.prnewswire.com/news-releases/public-becomes-the-first-brokerage-to-introduce-ai-agents-for-your-portfolio-302729050.html)

**3. Zerodha Streak (India)**
- Launch headline (verbatim): "Introducing Streak - Algo trade without coding". — [Z-Connect by Zerodha](https://zerodha.com/z-connect/streak/introducing-streak-algo-trade-without-coding)
- Product: build strategies from dropdowns across 60+ indicators; backtest across 20 stocks at once, with P&L curves, win/loss, drawdown and downloadable logs; deploy live on Kite with notifications. — [VRD Nation review](https://www.vrdnation.com/zerodha-streak/); [tradersunited review](https://tradersunited.org/blog/zerodha-streak-review-algo-trading)
- Pricing: free for all Zerodha users since January 2024, capped at 5 live and 15 virtual deployments. — [tradersunited review](https://tradersunited.org/blog/zerodha-streak-review-algo-trading)
- Trust: inherits the Zerodha broker brand, and execution runs through the user's own Kite account.

**4. Tradetron (India)**
- Page title (verbatim): "Algo Trading Strategies | Best Algo Trading Software in India - Tradetron". — [tradetron.tech](https://tradetron.tech/)
- Positioning: a "multi asset, multi currency, multi exchange Algo Strategy marketplace" with a point-and-click builder. Strategies from "established portfolio managers" are available for "a fixed and/or variable (profit sharing) fee". — [Tradetron marketplace](https://tradetron.tech/market-place)
- Scale proof: "Some 11k algos are deployed on the system which take 1.5 million trades every month in paper trading and live accounts." — [Tradetron (via search)](https://tradetron.tech/market-place)

**5. Surmount (US)**
- Page title (verbatim): "Surmount | Automated Investing Platform for Self-Directed Investors". — [surmount.ai](https://surmount.ai/)
- Value prop: automate with expert-built strategies "that trade directly in their existing brokerage with no minimums, no coding, and no giving up control, for free to start". Its library is "built by experts and AI". — [surmount.ai](https://surmount.ai/)
- Compliance disclosure: "Surmount AI Inc. is not a registered investment adviser… investment advisory services… are provided by Quantbase, LLC, a wholly-owned subsidiary… registered with the U.S. Securities and Exchange Commission." — [surmount.ai](https://surmount.ai/)

**6. smallcase (India)**
- Page title / headline (verbatim): "Invest in ideas". It is repeated on every broker-hosted instance ("Invest in ideas | smallcases on Zerodha", "…on Groww", "…on ICICI", "…on HDFC Securities"). — [smallcase.zerodha.com](https://smallcase.zerodha.com/); [smallcases.groww.in](https://smallcases.groww.in/)
- Trust: "All smallcases are managed by SEBI-registered investment experts, who offer timely rebalance updates". 500+ model portfolios with themes such as "Electric Vehicles", "Momentum Investing" and "Precious Metals Tracker". Users pick a manager "based on experience, investment style & past performance". — [smallcase on SBI Securities](https://smallcases.sbisecurities.in/manager/smallcaseHQ)
- Distribution itself is the social proof: broker logos (Zerodha, Groww, ICICI Direct, HDFC Securities, IIFL, SBI Securities). — same sources

**7. Danelfin (US/EU) — best-in-class AI-accuracy communication**
- Page title (verbatim): "Danelfin | AI Stock Picker to Find the Best Stocks". — [danelfin.com](https://danelfin.com/)
- Core mechanic: an AI Score from 1–10. "The higher the score, the higher the probability of beating the market in the next 3 months." The AI "analyzes over 10,000 features per day per stock". — [danelfin.com](https://danelfin.com/); [How it works](https://danelfin.com/how-it-works)
- Track-record claims: "Since 2017, US-listed stocks with the highest AI Score (10/10) outperformed the market by +21.05% on average after 3 months (annualized alpha), while stocks with the lowest AI Score (1/10) underperformed the market by -33.28%". The Best Stocks strategy returned "+376% from January 3, 2017, until June 9, 2025, vs. only +166% of the S&P 500". — [danelfin.com](https://danelfin.com/); [Best Stocks strategy page](https://danelfin.com/best-stock-investment-strategy)
- Free hook: AI Scores are visible to any visitor. Help-center article: "Why are the AI Scores available for free?" — [Danelfin Help Center](https://support.danelfin.com/hc/en-us/articles/4405443156625-Why-are-the-AI-Scores-available-for-free)
- Pricing: Free, Plus, Pro and Elite tiers at $29 / $79 / $179 per month, or $22 / $59 / $134 billed annually. 14-day trial, no card needed for the free tier. — [The Rundown review](https://www.therundown.ai/tools/danelfin)
- Developer channel: an MCP server landing page ("AI Scores in Claude Code & Cursor"). — [mcp.danelfin.com](https://mcp.danelfin.com/landing/)

**8. Tickertape (India)**
- Page title (verbatim): "Research & Invest in Indian & US Stocks, ETFs & MFs | Tickertape". — [tickertape.in](https://www.tickertape.in/)
- Feature-count proof on sub-pages: "Stock Screener India: Filter & Analyze 5000+ Stocks"; "200+ filters or 15+ pre-built screens"; the MF screener has "50+ filters". It claims to be used by "700K+ smart investors" for screening. — [Tickertape screener](https://www.tickertape.in/screener/equity)
- Signature widget: Market Mood Index. Pro plan "from ₹399/month or ₹2,999/year". — [Find My Moat review](https://www.findmymoat.com/tools/tickertape); [techjockey](https://www.techjockey.com/detail/tickertape)

**9. Simply Wall St (global)**
- Page title (verbatim): "Free Portfolio Tracker, Stock Insights and Community - Simply Wall St". — [simplywall.st](https://simplywall.st/)
- Social proof: "Over 7,000,000 investors use Simply Wall St". A 4.6 app-store rating is reported by a third party. — [simplywall.st (via search)](https://simplywall.st/); [stockunlock review](https://stockunlock.com/simply-wall-st-review.html)
- Product demo: a public, no-signup "Explore Our Demo Portfolio" page. The Snowflake graphic scores value, future growth, past performance, financial health and dividends. — [Demo portfolio](https://simplywall.st/portfolio/demo); [Snowflake help](https://support.simplywall.st/hc/en-us/articles/360001740916-How-does-the-Snowflake-work)
- The free tier (portfolio of up to 10 holdings) is the lead offer. — [simplywall.st](https://simplywall.st/)

**10. Robinhood Cortex / Strategies**
- AI framed around a single job: Stock Digests answer why a stock is "going up or down today", using news, analyst activity, technicals and platform data. Proof: "95% of those surveyed in the US reported they love using the product". — [Robinhood newsroom](https://robinhood.com/us/en/newsroom/introducing-strategies-banking-and-cortex/); [Benzinga](https://benzinga.com/markets/tech/25/08/47252402/robinhood-unveils-cortex-ai-tool-digests-in-uk-bringing-real-time-stock-explanations-to-everyday-investors-after-95-us-approval)
- Strategies (robo): "$50 minimum", fees "capped at $250 for Gold members". — [Robinhood newsroom](https://robinhood.com/us/en/newsroom/introducing-strategies-banking-and-cortex/)

### Inferences
- Page titles fall into two camps. Some are **outcome/idea-led** ("Invest in ideas", "Trading. Built Better.", "Turn any idea into an investable index"). Others are **SEO category-led** ("Algo Trading Strategies | Best Algo Trading Software in India", "AI Stock Picker to Find the Best Stocks"). FinStocks' current title ("Prompt-based trading strategies on your own ...") is mechanism-led. The strongest pages pair an idea-led H1 with a mechanism subhead.
- The Indian players (smallcase, Streak) lean on **borrowed trust from brokers** (Zerodha, Groww etc.) rather than their own claims. That is a gap FinStocks must fill with explicit broker and SEBI information.

### Gaps
- Verbatim H1s, subheads, CTA button labels, hero visual type and section order for all 10 pages could not be checked (egress blocked). Only titles, press copy and snippets were available.
- No testimonial copy, press-logo bars or compliance footer text was captured verbatim, except Surmount's.

---

## What patterns recur, and what differentiates the strongest pages?

### Takeaway
The recurring pattern: a plain-language promise + a live or interactive proof object (prompt bar, score, demo portfolio) + a free/virtual entry point + a scale number + a regulatory line. The differentiator is a **single signature artifact** users can try before signup (Danelfin's AI Score, Simply Wall St's Snowflake/demo portfolio, Public's prompt bar, Tickertape's Market Mood Index).

### Cited Findings
- **A signature, explorable artifact without signup:** Danelfin shows AI Scores to any visitor ([Help Center](https://support.danelfin.com/hc/en-us/articles/4405443156625-Why-are-the-AI-Scores-available-for-free)). Simply Wall St has a public demo portfolio ([demo](https://simplywall.st/portfolio/demo)). Public leads with a prompt bar ([PR Newswire](https://www.prnewswire.com/news-releases/investors-can-turn-ideas-into-an-investable-index-with-publics-launch-of-generated-assets-302454862.html)).
- **Example prompts as copy:** Public shows concrete prompts ("CEOs under 40") ([PR Newswire](https://www.prnewswire.com/news-releases/investors-can-turn-ideas-into-an-investable-index-with-publics-launch-of-generated-assets-302454862.html)). FinStocks already uses "Invest ₹10,000 now" ([finstocks.ai](https://finstocks.ai/)).
- **Risk-free entry:** Composer lets users build and backtest free forever ([tooliverse](https://tooliverse.ai/tools/composer)). Streak gives 15 virtual deployments ([tradersunited](https://tradersunited.org/blog/zerodha-streak-review-algo-trading)). FinStocks has Mock Mode ([Medium](https://medium.com/@founder_50249/how-finstocks-ai-is-changing-the-world-of-stock-market-trading-3eadf5005ee1)).
- **Scale numbers:** "Over 7,000,000 investors" ([Simply Wall St](https://simplywall.st/)); "700K+ smart investors" ([Tickertape](https://www.tickertape.in/screener/equity)); "11k algos… 1.5 million trades every month" ([Tradetron](https://tradetron.tech/market-place)); "500+ model portfolios" ([smallcase](https://smallcases.sbisecurities.in/manager/smallcaseHQ)).
- **"No X, no Y, no Z" objection-killing copy:** Surmount says "no minimums, no coding, and no giving up control" ([surmount.ai](https://surmount.ai/)). FinStocks says "no brokers, no signals, no manual execution" ([finstocks.ai](https://finstocks.ai/)).
- **Control and ownership messaging:** Surmount's "trade directly in their existing brokerage" ([surmount.ai](https://surmount.ai/)) and Streak's deploy on your own Kite account ([VRD Nation](https://www.vrdnation.com/zerodha-streak/)).
- **Third-party design guidance:** put trust badges right next to the primary CTA. Don't promise guaranteed returns or overstate regulatory approvals. Mockups of AI chat responding to questions "make the technology feel real". Per one agency's claim, fintech landing pages convert at 5–8%, higher than generic SaaS. — [utsubo trust design patterns](https://www.utsubo.com/blog/fintech-website-trust-design-patterns); [designrevision](https://designrevision.com/blog/fintech-saas-landing-pages); [wsa.design](https://wsa.design/news/high-converting-landing-pages-for-fintech-websites-structure-copy-and-data-insights) (these are agency blogs, so treat the stats as indicative only)

### Inferences
- **Emulate:** (a) a prompt bar in the hero, pre-filled with rotating Indian-context prompts ("Invest ₹10,000 in low-volatility large caps"), leading to a sample backtest card with no signup; (b) Mock Mode as the primary CTA ("Try with ₹10L virtual money"), because it lowers risk perception; (c) a real scale metric (users, strategies deployed, trades executed) in the style of Tradetron's; (d) a broker/SEBI trust strip beside the CTA.
- **Avoid:** superlatives that can't be verified ("World's first", "India's Leading", "Ultimate"); FinStocks' titles currently use all three. Also avoid "no brokers" copy that may read as unregulated execution; replace it with "executes via your SEBI-registered broker account" if that is accurate.

### Gaps
- There was no primary A/B data on which pattern converts better for AI-trading products specifically.

---

## How do AI-first finance products communicate AI credibility without overpromising?

### Takeaway
Three credible approaches were found. (1) **Quantified, dated, cohort-based track records with a named benchmark** (Danelfin). (2) **"AI builds, rules execute" transparency**: users see the logic and backtest across market regimes before activating (Composer by SoFi, Public). (3) **Narrow, explainable AI jobs with user-satisfaction proof** instead of return claims (Robinhood Cortex). Regulated-entity disclosures (Surmount → SEC-registered Quantbase; smallcase → SEBI-registered managers) anchor all three.

### Cited Findings
- Danelfin states returns as probabilities over a fixed horizon ("probability of beating the market in the next 3 months"). It gives both tails ("+21.05%" for 10/10 vs "-33.28%" for 1/10) with a start date ("Since 2017") and a benchmark ("vs. only +166% of the S&P 500"). — [danelfin.com](https://danelfin.com/); [strategy page](https://danelfin.com/best-stock-investment-strategy)
- Composer by SoFi explicitly contrasts itself with "agentic trading tools that rely on AI to continuously make trading decisions". Its AI builds "rules-based strategies… executed automatically according to clear, predefined rules", and users can "evaluate historical performance across different market environments before deciding whether to activate". — [BusinessWire](https://www.businesswire.com/news/home/20260623095057/en/Introducing-Composer-by-SoFi-AI-Powered-Investing-From-Idea-to-Execution)
- Public explains *how* the AI decides (a "swarm of AI evaluation agents" scoring sector fit, financials and growth) and backtests against the S&P 500. — [PR Newswire](https://www.prnewswire.com/news-releases/investors-can-turn-ideas-into-an-investable-index-with-publics-launch-of-generated-assets-302454862.html)
- Robinhood Cortex proves value through a survey ("95%… love using the product") and cited sources, not performance claims. — [Benzinga](https://benzinga.com/markets/tech/25/08/47252402/robinhood-unveils-cortex-ai-tool-digests-in-uk-bringing-real-time-stock-explanations-to-everyday-investors-after-95-us-approval)
- Surmount discloses its regulatory structure plainly (not an RIA itself; advice via an SEC-registered subsidiary). — [surmount.ai](https://surmount.ai/)
- Indian context: smallcase grounds trust in "SEBI-registered investment experts" and managers' "past performance". — [smallcase](https://smallcases.sbisecurities.in/manager/smallcaseHQ). SEBI has warned investors against unregulated algo platforms. — [search result context, finstocks.ai/about query](https://finstocks.ai/about)

### Inferences
- For FinStocks: show each AI-generated strategy as **readable rules** (e.g. "Rebalance weekly; exit if drawdown > 8%") next to its backtest. Label backtests as hypothetical with date range, benchmark (Nifty 50) and costs included. Show a Mock Mode track record (paper P&L of live strategies since date X) rather than headline return claims. Put SEBI/broker disclosures in the hero trust strip, not only in the footer.
- Danelfin-style tail disclosure (show the losers too) is a strong honesty signal that few competitors copy.

### Gaps
- Exact disclaimer wording on Danelfin, Composer and Tickertape pages (e.g. "past performance is not indicative…") could not be captured verbatim.
- It is not clear which SEBI framework (the 2025 retail algo-trading rules, broker empanelment of algo providers) FinStocks falls under. This needs confirmation from the client.
- Screener.in, Trendlyne, StockEdge, Groww, Seeking Alpha, TipRanks, Koyfin, Magnifi and Perplexity Finance were not researched. The tool budget went to the closer strategy/execution competitors after egress blocking forced search-only research.
