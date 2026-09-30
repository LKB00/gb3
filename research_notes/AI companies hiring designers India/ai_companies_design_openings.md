# AI-native, US-HQ companies with live product design / UX roles in India or remote-India (as of 30 Sep 2026)

## Which AI companies have India/remote-India design roles on Greenhouse, Lever, Ashby, Workable, Rippling ATS, SmartRecruiters?

### Takeaway
I found **9 live product-design postings at 7 AI-native, US-HQ companies** that are located in India or open to remote-India. The companies are Ema, AiPrise, Atomicwork, SigNoz, Hevo Data, HeyMarvin and Netomi. There is also one YC-listed UX Researcher role at Emergent.

For a 3–4-year designer, the best fits are:
- **Ema Product Designer** (3+ yrs, Bengaluru hybrid)
- **AiPrise Product Designer II** (3+ yrs, Bengaluru onsite)
- **Atomicwork Product Designer** (1–4 yrs, Bengaluru hybrid)
- **Atomicwork Lead Product Designer**, a stretch role that asks "at least three years"

SigNoz (4–10 yrs) and Hevo (4–8 yrs) are reachable for someone at about 4 years. HeyMarvin asks 5+ years and Netomi asks 8–12 years.

Several companies on the brief have **no** India design role live right now: Glean, Moveworks (now part of ServiceNow), Uniphore, Mercor and Observe.AI. Observe.AI's only India "design" posting is not a UX role.

### Method
- I queried the public ATS JSON APIs directly for about 450 company slugs, many of them in several casings:
  - Greenhouse: `boards-api.greenhouse.io/v1/boards/{slug}/jobs`
  - Lever: `api.lever.co/v0/postings/{slug}`
  - Ashby: `api.ashbyhq.com/posting-api/job-board/{slug}`, with a curl User-Agent
  - Rippling: `api.rippling.com/platform/api/ats/v1/board/{slug}/jobs`
  - SmartRecruiters: `api.smartrecruiters.com/v1/companies/{slug}/postings?q=design`
- I also checked Uniphore's Workday board through its CXS API.
- I filtered for design/UX titles with Indian, APAC or unrestricted-remote locations. Then I pulled each matching posting's description to get its years of experience and work mode.
- An API listing means the posting is live on the ATS on 30 Sep 2026.
- "Posted" means:
  - Ashby `publishedAt`
  - Greenhouse `first_published`
  - Lever `createdAt`, converted to a date
- I supplemented the scan with WebSearch `site:` queries and the YC jobs board.

### Cited Findings

**A. Live postings: AI-native, US-HQ, India / remote-India**

| # | Company | What it does (one line) | HQ | Role | Location / mode | Experience asked | Posted | Fit for 3–4 yr? | Link |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ema | Agentic AI platform, the "Universal AI Employee" for enterprises | Silicon Valley (posting: "Headquartered in Silicon Valley and with offices in London, Bangalore and Vancouver") | Product designer | Bengaluru; hybrid, office 3 days/week | "3+ years of experience in UX/UI design" | 2026-07-24 | **YES, strong** | [Ashby](https://jobs.ashbyhq.com/ema/36c17dbb-168d-4654-9a4e-0be64cacd02a) |
| 2 | AiPrise | YC S22, Series A. AI-powered global KYB/KYC compliance infrastructure for fintechs and banks | US (Ashby board also lists San Jose, CA roles; the posting does not state HQ) | Product Designer II | Bengaluru; OnSite | "3+ years as a product designer" | 2026-08-10 | **YES, strong** | [Ashby](https://jobs.ashbyhq.com/aiprise/8b61b339-a456-4f33-9970-19a69caa0db4); also on [YC jobs](https://www.ycombinator.com/jobs/role/designer/bengaluru) (₹25–35 L) |
| 3 | Atomicwork | AI-native service management / digital workplace platform ("uniting people, processes, and platforms through AI automation") | US-incorporated, with a large Bengaluru team (HQ not stated in the posting) | Product Designer | Bengaluru; "hybrid position based out of our Bengaluru office" | "1-4 years of experience designing modern applications" | first published 2025-04-25 (updated 2026-09-30) | **YES** (upper end of the range) | [Greenhouse](https://job-boards.greenhouse.io/atomicwork/jobs/4407185008) |
| 4 | Atomicwork | same as above | same as above | Lead Product Designer (Bangalore, India) | Bengaluru; hybrid | "at least three years of experience designing modern applications" | first published 2024-10-08 (updated 2026-09-30) | **Stretch** (Lead title, low stated ask) | [Greenhouse](https://job-boards.greenhouse.io/atomicwork/jobs/4170401008) |
| 5 | SigNoz | YC-backed, OpenTelemetry-native open-source observability platform (dev infra, not AI-first) | "Backed by YC and some of the prominent VCs in the Bay Area. We are completely remote" | Sr Product Designer | Remote, India (or Europe) | "4-10 years of experience in digital product design" | 2026-06-30 | Possible at 4 yrs | [Ashby](https://jobs.ashbyhq.com/signoz/ea04f41f-62c2-40a2-996f-6d7389d80124) |
| 6 | Hevo Data | No-code data pipeline / ELT platform for 2,000+ companies (data infra, not AI-first) | San Francisco per background knowledge; India-founded (not stated in the posting) | Senior Product Designer | Bengaluru; onsite | "4 to 8 years designing and shipping real products" | 2026-08-13 | Possible at 4 yrs | [Lever](https://jobs.lever.co/hevodata/3c22a84f-7eb6-4105-aa3b-7698322a98af) |
| 7 | HeyMarvin | AI-native user-research platform: repository, AI interviewer, chat. Clients include Microsoft, Best Buy and LinkedIn | "headquartered in Oakland, CA" | Product Designer | India; fully remote | "5+ years in UI/UX or Product Design" | not shown (Rippling API has no date) | No (5+), though worth a stretch application | [Rippling](https://ats.rippling.com/heymarvin/jobs/a446aa95-c37d-49e4-b07c-60821eda7735) |
| 8 | Netomi | "Leading agentic AI platform for enterprise customer experience" (Delta, MetLife, United) | US (not stated in the posting) | Staff Product Designer | Gurugram; remote | "8–12 years of product design experience" | 2026-07-20 | No (Staff) | [Lever](https://jobs.lever.co/netomi/a5606db8-5bbd-46b2-bf76-6a5800e7177e) |
| 9 | Emergent (YC S24) | AI app builder: "turns your ideas into monetizable software" via autonomous coding agents | San Francisco (per YC page) | UX Researcher | Bangalore; onsite | "6+ years of hands-on experience independently planning and executing UX research" | not shown | No (research, 6+) | [YC Work at a Startup](https://www.ycombinator.com/companies/emergent/jobs/mQWjPff-ux-researcher) |

Also live, but excluded from the product-design list:
- Atomicwork Visual Designer, Bengaluru — [Greenhouse](https://job-boards.greenhouse.io/atomicwork/jobs/4177607008)
- Hevo Senior Visual Designer, Bangalore — [Lever](https://jobs.lever.co/hevodata/370f9639-f2c5-4647-a4ab-8d070f71549f)
- Hevo UX Design Intern, Bangalore — [Lever](https://jobs.lever.co/hevodata/433ffdef-3125-48ed-a131-52c697c321ee)

**B. Borderline "AI-powered" (not AI-native) US-HQ companies with India design roles**

These companies market themselves as AI-powered, but AI is not the core product. I list them for completeness.
- **Docsumo.** Document AI for financial documents; Sequoia and Techstars backed. HQ is not stated in the posting; it is US/India per background knowledge.
  - Senior UI UX Designer (5+ years), Mumbai, remote. Asks "At Least 5 years".
  - Created 2024-08-28 and still on the live Lever board, so it is likely an evergreen req. — [Lever](https://jobs.lever.co/docsumo/cead0f39-a903-434f-8096-61e97d1c2439)
- **HighLevel.** "AI-powered business operating system" for agencies and SMBs.
  - Lead Product Designer, India, 100% remote.
  - Asks "7+ years of relevant product design experience". Posted 2026-08-17. — [Lever](https://jobs.lever.co/gohighlevel/4eac1849-29f4-4556-95fa-db283607c936)
- **ServiceNow (acquired Moveworks).**
  - Principal Product Designer, Bangalore (posted 2026-09-23, "15+ years") — [SmartRecruiters](https://jobs.smartrecruiters.com/ServiceNow/744000151297869)
  - Director, Product Design, Bangalore (posted 2026-09-30) — [SmartRecruiters](https://jobs.smartrecruiters.com/ServiceNow/744000152588729)
  - The Moveworks-specific "Principal Product Designer, Moveworks" posting (744000129443659) returns `active: false`. It is closed.
- **Freshworks** (Freshservice, "people-first approach to AI"): Lead – Product Designer, Bengaluru (released 2026-09-14) — [SmartRecruiters](https://jobs.smartrecruiters.com/freshworks/744000149242464)
- **HackerRank:** Head of Design, hybrid Bangalore (first published 2026-07-29) — [Greenhouse](https://job-boards.greenhouse.io/hackerrank/jobs/8093648)
- **Other US-HQ, non-AI-native India design roles.** These are covered in the sibling notes file `../US product design jobs India/ats_greenhouse_lever_ashby.md`:
  - Tekion Product Designer II (3–5 yrs)
  - 6sense Product Designer III (Pune and Bengaluru)
  - Zeta Global Product Designer
  - Okta Staff UX Designer and Senior UX Researcher, Bengaluru
  - Rubrik Director of Product Design

**C. Re-confirmation of the companies named in the brief**
- **Still live (reconfirmed on 30 Sep 2026):** Ema, AiPrise, Atomicwork (both the PD and Lead PD reqs), SigNoz, Hevo Data and HeyMarvin. See table A.
- **Observe.AI:** the only India design-titled posting is "Interaction Designer", Bengaluru, first published 2026-09-02 — [posting](https://www.observe.ai/position?gh_jid=5409244008).
  - The company describes itself as "the AI Agents platform for customer experience".
  - An earlier review of this posting found it is a speech-analytics configuration role ("analyze spoken language data"), not UX. Exclude it.
- **Uniphore:** careers run on Workday, and the Workday CXS search for "design" returned no design roles. The live results were engineering, sales and AI leadership roles only — [Uniphore Workday](https://uniphore.wd503.myworkdayjobs.com/Uniphore).
  - A third-party aggregator shows an old "UX Designer, Bangalore" (2–4 yrs) listing — [uiuxjobsboard](https://uiuxjobsboard.com/job/754923-ux-designer-bangalore-india).
  - It is not on Uniphore's live Workday board, so treat it as closed.
- **Glean:** the Greenhouse board `gleanwork` is live but has no India design roles.
- **Moveworks:** there is no standalone board; hiring is now under ServiceNow. See section B.
- **Mercor:** the Ashby board `mercor` is live with 114 jobs but no India/remote-India design roles.

**D. Non-US-HQ AI companies with India design roles (out of scope, brief)**
- **Sarvam AI** (Bengaluru; Indian sovereign LLMs): Product Designer, Bengaluru onsite, 4+ yrs, posted 2026-05-19 — [Ashby](https://jobs.ashbyhq.com/sarvam/79bb725b-83d4-400c-a207-e2b0a7ccec68). It also has a Visual Designer role.
- **Bolna** (YC F25; multilingual voice-AI agents, HQ Bengaluru per [AIM](https://analyticsindiamag.com/ai-news-updates/bengaluru-voice-ai-startup-bolna-grabs-6-3-mn-to-enhance-vernacular-calls)): Product Designer, Bengaluru onsite, posted 2026-09-03.
  - The posting says "We do not require formal credentials or a specific number of years".
  - It is a good 3–4 yr fit if non-US HQ is acceptable — [Ashby](https://jobs.ashbyhq.com/bolna/99bbc760-d1ae-473c-b697-f3baeee622f3)
- **Cardboard** (YC W26; "agentic video editor"; YC page lists HQ Bengaluru): Founding Designer, Bengaluru / San Francisco, "3+ years", ₹30–60 L plus 0.1–1% equity — [YC](https://www.ycombinator.com/companies/cardboard/jobs/pZUQWeq-founding-designer)
- **Staff-level roles in London (no India):** ElevenLabs Product Designer (London/NY remote) and Synthesia Staff Product Designer (London).

### Inferences
- **Where the roles are.** India-located design demand among AI-native companies is concentrated in US-incorporated startups that have a Bengaluru build centre: Ema, AiPrise, Atomicwork, Netomi, Emergent and HeyMarvin (remote). It is not coming from the frontier labs and top-tier AI apps. OpenAI, Anthropic, Perplexity, Harvey, Cursor, Replit, Midjourney, Deepgram, Baseten, CodeRabbit, Abridge, Cresta, Notion and Linear all have live design reqs, but only in the US, UK, EU or Canada.
- **Best apply-now list for a 3–4 yr designer:**
  1. Ema
  2. AiPrise
  3. Atomicwork PD
  4. SigNoz and Hevo, as stretch applications at the low end of their ranges
  5. Bolna and Cardboard, if non-US-HQ is acceptable
- **Treat the old Atomicwork reqs with caution.** The PD req was first published in Apr 2025 and the Lead req in Oct 2024. Both were refreshed on 30 Sep 2026, so they are likely evergreen or pipeline reqs; apply, but expect slower response.
- **Not strictly AI-first.** SigNoz and Hevo are dev and data infrastructure. They fit "AI dev tools/infra" only loosely, and the writer should flag this.

### Gaps
- **Blocked or unusable hosts:**
  - Workable's public widget API returned Cloudflare "error code: 1015" (rate-limited), so Workable boards could not be scanned. Constructor ("Product Designer: AI Agent Tools") and NineTwoThree AI Studio surfaced in search but are unverified.
  - The Rippling ATS API gives no posting date, so HeyMarvin's posting date is unknown.
  - YC's workatastartup.com job page for Coulomb AI's UX Designer returned no content, so it is unverified.
  - Wellfound was not fetched.
- **No live design role found.** These companies had a live board, or were checked by other means, but showed no India design role: Glean, Uniphore, Moveworks (standalone), Mercor, Composio, SpotDraft, GigaML, Lyzr, TrueFoundry, Nurix, Gushwork, CloudSEK, Typeface, Writer, Sierra, Decagon, Cresta, Gong, Eightfold, Apollo, Salesloft, Outreach, Mindtickle (only a 2017 stale posting), Gainsight and Atlan.
- **No board found** on any of the five ATS APIs under the obvious slugs. These companies likely use their own sites or Workday: Rocketlane, Portkey, Maxim, Simplismart, UnifyApps, Floworks, Zime, Vahan, Kore.ai, Yellow.ai, Leena AI, Aisera, Gupshup, Haptik, Pixis, Innovaccer, Whatfix, Postman, BrowserStack, Sprinklr, Fireflies and Writesonic.
- **Sanas.** A Product Design Lead in Bengaluru appeared in search, but Sanas's Rippling board currently lists no design roles, so it is likely closed.
- **HQ not verified from a primary source.** HQ for AiPrise, Atomicwork, Hevo and Netomi comes from background knowledge and board context. None of these postings states it.
