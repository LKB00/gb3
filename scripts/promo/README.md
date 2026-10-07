# Promo video

A 32-second vertical video (1080×1920, 30 fps, no sound) for Reels, Shorts, LinkedIn and X.
The output is `design/video/gb3-promo.mp4`.

## Story

| Time | Scene |
|---|---|
| 0–4 s | **Hook.** An AI says "Done! I deleted 2,340 old emails for you." A "No preview. No undo." warning appears. Then: **Good bot or bad bot?** |
| 4–9 s | "Same AI. Better design." Bad and good choices side by side (Just does it / Asks first, …). |
| 9–12 s | Brand: app icon, name, "The game that trains your eye for good AI design." |
| 12–18 s | Real This-or-That screen on a phone. A tap on the better answer gives +10 XP. |
| 18–24 s | "7 quick games. 5 minutes a day." A carousel of real game screens. |
| 24–28 s | "Collect 37 cards. Find your type." The player card turns in 3D. |
| 28–32 s | End card: "Can you spot good AI design?" + gb3.lokeshbhatia.com. |

## Make it again

Run these from the repo root. In the cloud sandbox, start each command with `CHROMIUM_PATH=/opt/pw-browsers/chromium`.

```bash
npm run build                          # the site the screenshots come from
node scripts/promo/shots.mjs           # real phone screenshots -> scripts/promo/shots/
node scripts/promo/render.mjs 2 15     # optional: still frames at 2 s and 15 s -> scripts/promo/stills/
node scripts/promo/render.mjs          # the full video (about 10 minutes), needs ffmpeg
```

- To preview, open `scripts/promo/promo.html` in a browser after `shots.mjs`. It plays in a loop.
- To change words or timing, edit `promo.html`. Each scene has a start and end time in `scenes`, and its animation is in `render(t)`.
- If counts change (games, cards), update the words in `promo.html` too.
- There is no sound. Add music in the app where you post it (Instagram, YouTube), or in any video editor.
