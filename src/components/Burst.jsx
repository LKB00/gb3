// A small, quick burst of pastel confetti for wins. Purely decorative;
// hidden for people who prefer reduced motion (see styles.css).
const COLORS = ['var(--d-input)', 'var(--d-output)', 'var(--d-control)', 'var(--d-trust)', 'var(--d-feedback)', 'var(--d-agents)', 'var(--lime)'];

export default function Burst({ count = 18 }) {
  return (
    <span className="burst" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.2;
        const dist = 60 + (i % 4) * 22;
        return (
          <span
            key={i}
            style={{
              '--x': `${Math.cos(angle) * dist}px`,
              '--y': `${Math.sin(angle) * dist - 20}px`,
              '--r': `${(i * 47) % 360}deg`,
              background: COLORS[i % COLORS.length],
              animationDelay: `${(i % 5) * 18}ms`,
            }}
          />
        );
      })}
    </span>
  );
}

// "+30 XP" that floats up and fades.
export function XpPop({ amount }) {
  return <span className="xp-pop" aria-hidden>+{amount} XP</span>;
}
