# Promo video

A 32-second video with original music and sound effects, in three sizes:

| File | Size | For |
|---|---|---|
| `design/video/gb3-promo.mp4` | 1080×1920 (vertical) | Instagram Reels, YouTube Shorts, LinkedIn mobile |
| `design/video/gb3-promo-square.mp4` | 1080×1080 (square) | LinkedIn feed |
| `design/video/gb3-promo-wide.mp4` | 1920×1080 (wide) | X/Twitter, YouTube |

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

## Sound

`sound.mjs` makes all the sound from code (no music library, so no licence questions):
- **Music:** about 125 BPM, A minor (Am7, Fmaj7, C, G6). A quiet heartbeat in the hook, the beat drops on scene 2,
  pad and arp only during the logo, the beat comes back for the games, then one warm chord at the end.
- **Effects:** typing, a "nope" for the warning, whooshes between scenes, a riser and hit before the logo,
  a ding for each good choice, the tap, a chime and a coin for +10 XP, sparkles on the logo and the card.
- Loudness is about -14 LUFS (normal for social media).

## Make it again

Run these from the repo root. In the cloud sandbox, start each command with `CHROMIUM_PATH=/opt/pw-browsers/chromium`.

```bash
npm run build                                   # the site the screenshots come from
node scripts/promo/shots.mjs                    # 1. real phone screenshots -> scripts/promo/shots/
node scripts/promo/sound.mjs                    # 2. music + effects -> scripts/promo/out/sound.wav (about 15 s)
node scripts/promo/render.mjs                   # 3. vertical video (about 10 minutes)
node scripts/promo/render.mjs --square          #    square video (about 6 minutes)
node scripts/promo/render.mjs --wide            #    wide video (about 10 minutes)
node scripts/promo/render.mjs 2 15 --square     # optional: still frames at 2 s and 15 s -> scripts/promo/stills/
node scripts/promo/render.mjs --sound-only      # after changing only the sound: add it again, no re-render
```

- To preview, open `scripts/promo/promo.html` in a browser after `shots.mjs` (add `?square` or `?wide` for the other sizes). It plays in a loop, without sound.
- To change words or timing, edit `promo.html`. Each scene has a start and end time in `scenes`, and its animation is in `render(t)`.
  If you move a scene, move its sounds in `sound.mjs` too (the times are in seconds there as well).
- If counts change (games, cards), update the words in `promo.html` too.
- The phone is drawn in `promo.html` (`.device`). Screenshots are 393×764, the screen of a modern phone without the status bar and home bar.
