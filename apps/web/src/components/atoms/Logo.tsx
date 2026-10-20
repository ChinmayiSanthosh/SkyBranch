export function Logo({ size = 40 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="SkyBranch logo">
        <path
            d="M24 38 C 24 30, 22 26, 16 20 M24 32 C 26 26, 30 22, 36 16 M20 24 C 18 20, 18 16, 20 11 M31 21 C 34 20, 37 21, 40 24"
            fill="none"
            stroke="#1d2230"
            strokeWidth="2.2"
            strokeLinecap="round"
        />
        <line x1="6" y1="38" x2="42" y2="38" stroke="#1d2230" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="16" cy="20" r="2.2" fill="#e5806f" />
        <circle cx="36" cy="16" r="2.2" fill="#e5806f" />
        <circle cx="20" cy="11" r="2.2" fill="#e5806f" />
        </svg>
    );
}