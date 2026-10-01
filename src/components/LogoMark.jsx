// The logo: a good bot (lime, smiling) and a bad bot (pink, frowning), side by side.
// Colours are fixed on purpose so the logo looks the same in light and dark mode.
// The same drawing is used in public/ icons and the share image (see docs/PROJECT_CONTEXT.md, "Brand").
export default function LogoMark({ className = 'logo-mark' }) {
  return (
    <svg className={className} viewBox="0 0 44 28" aria-hidden="true" focusable="false">
      <circle cx="13" cy="14" r="12" fill="#c2ef72" />
      <circle cx="31" cy="14" r="12" fill="#f6a5a0" stroke="var(--logo-gap, #fbfbf7)" strokeWidth="2" />
      <g fill="#24282c">
        <circle cx="9.5" cy="12" r="1.8" />
        <circle cx="16.5" cy="12" r="1.8" />
        <circle cx="27.5" cy="12.5" r="1.8" />
        <circle cx="34.5" cy="12.5" r="1.8" />
      </g>
      <g fill="none" stroke="#24282c" strokeWidth="2" strokeLinecap="round">
        <path d="M8.5 17 Q13 21.6 17.5 17" />
        <path d="M26.5 20.8 Q31 16.2 35.5 20.8" />
        <path d="M26.2 8.4 L29.6 10.2" />
        <path d="M35.8 8.4 L32.4 10.2" />
      </g>
    </svg>
  );
}
